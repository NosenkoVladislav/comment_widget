const commentList = (selector) => {
  const rootElement = document.querySelector(selector);
  const storageKey = 'commentList';

  const commentInputTemplate = `
  <div class="widget">
       <input type="text" class="name-space widget-element">
       <textarea type="text" class="text-space widget-element"></textarea>
       <button class="add-comment widget-element">Add comment</button>
  </div>
  <div class="content"></div>`;

  const commentTextTemplate = `
  <div class="comment-wrapper" id="{{id}}">
        <div class="author-name"><span>{{name}}</span></div>
        <input class="author-name-input hiden">
        <div class="edit control hiden"><i class="fa fa-pencil" aria-hidden="true"></i></div>
        <div class="delete control"><i class="fa fa-trash" aria-hidden="true"></i></div>
        <div class="comment-text"><span>{{text}}</span></div>
        <input class="comment-text-input hiden">
        <div class="date">{{date}}</div>
  </div>`;

  let inputName;
  let inputText;
  let btnAdd;

  let contentElement;
  let allComments = JSON.parse(localStorage.getItem(storageKey)) || [];

  function initialRendern() {
    rootElement.innerHTML = commentInputTemplate;
    rootElement.classList.add('comment-widget');

    inputName = rootElement.querySelector('.name-space');
    inputText = rootElement.querySelector('.text-space');
    btnAdd = rootElement.querySelector('.add-comment');
    contentElement = rootElement.querySelector('.content');

    commentsRendern();
  };

  function commentsRendern() {
    const commentsArray = [];

    for(let item of allComments) {
      let renderedItem = commentTextTemplate.replace('{{id}}', item.id).replace('{{name}}', item.name).replace('{{text}}', item.text ).replace('{{date}}', item.date);
      commentsArray.push(renderedItem);
    }

    contentElement.innerHTML = commentsArray.join('');
  };

  function newComment() {
    const newElement = {
      id : idGenerator(),
      name: inputName.value,
      text: inputText.value,
      date: dateGenerator()
    }

    if(newElement.name !== '' && newElement.text !== ''){
      allComments.push(newElement);
    } else {
      alert('Please check all fields!');
    }
  
    clearInputs()
    localStorageSync();
    commentsRendern();
  }

  function clearInputs() {
    inputName.value = '';
    inputText.value = '';
  }

  function eventHandler() {
    btnAdd.addEventListener('click', newComment);

    contentElement.addEventListener('click', (e) => {   
      const id = e.target.closest('.comment-wrapper').id;
      let target = e.target;

        while(target.parentNode != contentElement) {
          if(target.classList.contains('delete')){
             deleteComment(id);
            return;
          }

          if(target.classList.contains('edit')){
             editComment(id);
            return;
          }
            target = target.parentNode;
        }
    })
  }

  function idGenerator() {
    return Math.random().toString(36).substr(2, 9);
  }

  function dateGenerator() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() +1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (month < 10) {
      month = "0" + month;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    let dateNow =  day + "." + month + "." + year + " in " + hours + ":" + minutes;
    return dateNow;
  }

  function deleteComment(id) {
    const filtredCommentsArray = [];

    for(let item of allComments) {
      if (item.id !== id) {
        filtredCommentsArray.push(item);
      }
    }

    allComments = filtredCommentsArray;
    commentsRendern();
    localStorageSync();
  }

   function localStorageSync() {
    localStorage.setItem(storageKey, JSON.stringify(allComments));
  }

  function editComment(id) {

    commentsRendern();
    localStorageSync();
  }

  initialRendern();
  eventHandler();
};

  


commentList('.conteiner');
const tokenHolder = {
  token: ''
}

const tasksHolder = {};


const userInfoHolder = {};

class LoginPage {
  constructor() {
    this.username = '';
    this.password = '';
    this.taskListInstance = new TaskList();
  }

  handleEvent(event) {
    let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
    this[method](event);
  }

  async login() {
    this.username = document.getElementById('username').value;
    this.password = document.getElementById('password').value;

    let user = {
      username: this.username,
      password: this.password
    }

    let response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      let result = await response.json();
      this.token = result.WebAPIToken;
      tokenHolder.token = this.token;
      userInfoHolder.name = this.username;
      userInfoHolder.password = this.password;
      this.taskListInstance.getTasks();
    } else {
      let result = await response.json();
      console.log(`LoginPage, error: ${result.error}`);
    }
  }

  async register() {
    this.username = document.getElementById('username').value;
    this.password = document.getElementById('password').value;

    let user = {
      username: this.username,
      password: this.password
    }

    let response = await fetch('/api/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      let result = await response.json();
      this.id = result.id;
      alert('Congrats, you have created an account.');
      location.reload();
    } else {
      let result = await response.json();
      console.log(`LoginPage, error: ${result.error}`);
    }
  }

  signUp() {
    let registerform = `
      <div class="register" id="register-form">
        <h2>Sign Up</h2>
        <form>
          <input id="username" type="text" placeholder="Username" required minlength="4" maxlength="30">
          <input id="password" type="password" placeholder="Password" required minlength="6">
          <button id="register-btn" data-action="register">Sign Up</button>
        </form>
        <p>Have an account? <span id="sign-in" data-action="render">Sign in</span>.</p>
      </div>`;

    let elem = document.querySelector('body');
    elem.innerHTML = registerform;

    let signIn = document.getElementById('sign-in');
    signIn.addEventListener('click', loginPage);

    let register = document.getElementById('register-btn');
    register.addEventListener('click', loginPage);
  }

  render() {
    let loginform = `
      <div class="login" id="login-form">
        <h2>Sign In</h2>
        <form >
          <input id="username" type="text" placeholder="Username">
          <input id="password" type="password" placeholder="Password">
          <button id="login-btn" type="button" data-action="login">Sign In</button>
       </form>
       <p>New here? <span id="sign-up" data-action="signUp">Sign up now</span>.</p>
      </div>`;

    let elem = document.querySelector('body');
    elem.innerHTML = loginform;

    let signUp = document.getElementById('sign-up');
    signUp.addEventListener('click', loginPage);

    let btn = document.getElementById('login-btn');
    btn.addEventListener('click', loginPage);
  }

  onClick() {
    let action = event.target.dataset.action;
    if (action) {
      this[action]();
    }
  }
}

class TaskList {
  constructor() {
    this.tasks = new Array();  // probably can delete
  }

  handleEvent(event) {
    let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
    this[method](event);
  }

  async getTasks() {
    let response = await fetch('/api/tasks');

    if (response.ok) {
      let result = await response.json();
      this.tasks = result;  // probably can delete
      tasksHolder.tasks = result;
      this.render();
    } else {
      console.log(`Task List, error ${response.error}`);
    }
  }

  render() {
    let now = new Date();
    let day = { weekday: "long" };
    let monthEndDate = { month: "short", day: "numeric" };

    let itemList = `
    <div id="wrapper">
      <header id="header">
      <div id="user">
        <p id="current-user">${userInfoHolder.name}</p>
        <button id="logout" data-action="logout"><i class="fas fa-sign-out-alt" data-action="logout"></i></button>
      </div>
      <p id="current-date">${now.toLocaleDateString("en-Us", day)}<span>, </span>${now.toLocaleDateString("en-Us", monthEndDate)}</p>
      </header>
      <div id="item-list">
        <ul id="list">`;

    tasksHolder.tasks.forEach(task => itemList += `
      <li class="item" id="${task.id}">
      <div class="item-head flex">
        <p class="date">${task.date}</p>
        <i class="fas fa-caret-down"  data-action="item"></i>
        <p class="name">${task.name}</p>
        <i class="fa fa-trash-o delete" data-action="item"></i>
      </div>
      <p class="item-body display-none">${task.description}</p>
    </li>`);

    itemList += `
      </ul>
        <form id="add-item" class="add-item  display-none" method="post">
          <div class="flex">
            <input type="text" class="date" placeholder="Date" required minlength="1">
            <input type="text" id="name" placeholder="Name" required minlength="1">
          </div>
          <div class="flex">
            <textarea id="description"></textarea>
            <button type="button" id="add-btn" data-action="addTask"><i class="fas fa-plus" data-action="addTask"></i></button>
          </div>
        </form>
        <button id="add-item-btn"><i class="fas fa-chevron-down" data-action="arrowBtn"></i></button>
      </div>
      </div>`;

    let elem = document.querySelector('body');
    elem.innerHTML = itemList;

    let arrowButton = document.querySelector('#add-item-btn i');
    arrowButton.addEventListener("click", taskList);

    let list = document.getElementById('list');
    list.addEventListener("click", taskList);

    let addBtn = document.getElementById('add-btn');
    addBtn.addEventListener("click", taskList);

    let logout = document.getElementById('logout');
    logout.addEventListener("click", taskList);
  }

  // DOES NOT WORK WITH BTN TYPE=SUBMIT WHYYYYY ???
  addTask() {
    let taskDate = document.querySelector('#add-item .date');
    let taskName = document.getElementById('name');
    let taskDescription = document.getElementById('description');

    if (taskDate.value != '' && taskName.value != '') {

      (async () => {
        let body = {
          WebAPIToken: tokenHolder.token,
          name: taskName.value,
          description: taskDescription.value,
          date: taskDate.value
        }

        let response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          let result = await response.json();
          this.tasks.push(result); // probably can delete
          tasksHolder.tasks.push(result);
          console.log(result);

          // add html task here

          let elem = document.getElementById('list');
          elem.insertAdjacentHTML('beforeend', `
          <li class="item" id="${result.id}">
            <div class="item-head flex">
              <p class="date">${result.date}</p>
              <i class="fas fa-caret-down"  data-action="item"></i>
              <p class="name">${result.name}</p>
              <i class="fa fa-trash-o delete" data-action="item"></i>
            </div>
            <p class="item-body display-none">${result.description}</p>
          </li>`);

          // clear add-item form
          taskDate.value = '';
          taskName.value = '';
          taskDescription.value = '';
        } else {
          let result = await response.json();
          console.log(`Task List, add task error: ${result.error}`);
        }

      })();
    } else {
      console.log('provide Name and Date');
    }
  }

  item() {
    let elem = event.target;
    let elemDescription = elem.parentElement.nextElementSibling;
    let item = elem.parentElement.parentElement;


    if ((elem.classList.contains('fa-caret-down') && elemDescription.innerHTML != '') || (elem.classList.contains('fa-caret-up') && elemDescription.innerHTML != '')) {

      let margin = elem.previousElementSibling.offsetWidth;
      let width = elem.nextElementSibling.offsetWidth;

      elemDescription.style.margin = `0px 0px 0px ${margin + 44}px`;
      elemDescription.style.width = `${width}px`;

      elemDescription.classList.toggle('display-none');
      elem.classList.toggle('fa-caret-up');
      elem.classList.toggle('fa-caret-down');
    } else if (elem.classList.contains('delete')) {

      (async () => {
        let body = {
          WebAPIToken: tokenHolder.token,
          task_id: item.id
        }

        let response = await fetch(`/api/tasks/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          let result = await response.json();
          console.log(`Task List, delete task message: ${result.message}`);
          item.remove();
          tasksHolder.tasks.splice(tasksHolder.tasks.findIndex(a => a.id == item.id), 1);
        } else {
          let result = await response.json();
          console.log(`Task List, error: ${result.error}`);
        }
      })();
    }
  }

  async logout() {
    let response = await fetch('/api/auth/out');

    if (response.ok) {
      let result = await response.json();
      console.log(result.message);
      location.reload();
    } else {
      let result = await response.json();
      console.log(result.error);
    }

  }

  arrowBtn() {
    let elem = event.target;
    let addItemForm = document.getElementById('add-item');

    addItemForm.classList.toggle('display-none');
    elem.classList.toggle('fa-chevron-up');
    elem.classList.toggle('fa-chevron-down');
  }

  onClick() {
    let action = event.target.dataset.action;
    if (action) {
      this[action]();
    }
  }
}

let taskList = new TaskList();
let loginPage = new LoginPage();

loginPage.render();

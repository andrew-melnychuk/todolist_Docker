class MainPage {
  constructor() {
    this.token = '';
  }

  setToken(value) {
    this.token = value;
  }

  getToken() {
    return this.token;
  }
}

class LoginPage extends MainPage {
  constructor(token) {
    super(token);
    this.username = '';
    this.password = '';
    this.id = '';
    this.response = '';
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
      console.log(`LoginPage, Token: ${this.token}`);

      // як сюди привязать щоб загружався render() з рядка 189 ???
    } else {
      let result = await response.json();
      console.log(`LoginPage, error: ${result.error}`); //response.error ???
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
      this.render();
    } else {
      let result = await response.json();
      console.log(`LoginPage, error: ${result.error}`); //response.error ???
    }
  }

  signUp() {
    let registerform = `
      <div class="register" id="register-form">
        <h2>Sign Up</h2>
        <form>
          <input id="username" type="text" placeholder="Username" required minlength="4" maxlength="30">
          <input id="password" type="password" placeholder="Password" required minlength="6">
          <button id="register-btn" type="submit" data-action="register">Sign Up</button>
        </form>
        <p>Have an account? <span id="sign-in" data-action="render">Sign in</span>.</p>
      </div>`;

    let elem = document.getElementById('content');
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
          <input id="username" type="text" placeholder="Username" required minlength="4" maxlength="30">
          <input id="password" type="password" placeholder="Password" required minlength="6">
          <button id="login-btn" type="submit" data-action="login">Sign In</button>
       </form>
       <p>New here? <span id="sign-up" data-action="signUp">Sign up now</span>.</p>
      </div>`;

    let elem = document.getElementById('content');
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

class TaskList extends MainPage {
  constructor(token) {
    super(token);
    this.tasks = new Array();
  }

  handleEvent(event) {
    let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
    this[method](event);
  }

  async getTasks() {
    let response = await fetch('/api/tasks');

    if (response.ok) {
      let result = await response.json();
      this.tasks = result;
      console.log(`Task List, Tasks${tasks}`);
      this.render();
    } else {
      console.log(`Task List, error ${response.error}`);  //response.error ???
    }
  }

  render() {
    let itemList = `
    <div id="item-list">
    <ul id="list">`;

    for (let i = 0; i < this.tasks.length; i++) {
      itemList += `
      <li class="item">
        <div class="item-head flex">
          <p class="date">${task[i].date}</p>
          <p class="name">${task[i].name}</p>
          <i class="fa fa-trash-o delete"></i>
        </div>
        <p class="item-body display-none">${task[i].description}</p>
      </li>`;
    }

    //   this.tasks.forEach(task => list += `
    //   <li class="item">
    //   <div class="item-head flex">
    //     <p class="date">${task.date}</p>
    //     <p class="name">${task.name}</p>
    //     <i class="fa fa-trash-o delete"></i>
    //   </div>
    //   <p class="item-body">${task.description}</p>
    // </li>`);

    itemList += `
      </ul>
        <form id="add-item" class="add-item  display-none" method="post">
          <div class="flex">
            <input type="text" class="date" placeholder="Date">
            <input type="text" id="name" placeholder="Name">
          </div>
          <div class="flex">
            <textarea id="description"></textarea>
            <button type="submit" id="add-btn"><i class="fas fa-plus"></i></button>
          </div>
        </form>
        <button id="add-item-btn" data-action="arrowBtn"><i class="fas fa-chevron-down"></i></button>
      </div>`;

    let elem = document.getElementById('content');
    elem.innerHTML = list;

    let arrowButton = document.querySelector('#add-item-btn i');
    arrowButton.addEventListener("click", taskList);

    let list = document.getElementById('list');
    list.addEventListener("click", taskList);
  }

  addTask(task) {
    let taskDate = task.date;
    let taskName = task.name;
    let taskDescription = task.description;

    async () => {
      let body = {
        WebAPIToken: this.token,
        date: taskDate,
        name: taskName,
        description: taskDescription
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
        this.tasks.push(result);
        console.log(`Task List, add task message: ${result.message}`);  //response.message ???
      } else {
        let result = await response.json();
        console.log(`Task List, add task error: ${result.error}`);  //response.error ???
      }
    }
  }

  item() {
    let elem = event.target;
    let elemDescription = elem.parentElement.nextElementSibling;
    let task = elem.parentElement.parentElement;

    if (elem.classList.contains('name') && elemDescription != null) {
      elemDescription.classList.toggle('display-none');
    } else if (elem.classList.contains('delete')) {
      async () => {
        let body = {
          WebAPIToken: this.token,
          task_id: idexapmle // change this
        }

        let response = await fetch('/api/tasks/taskid', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          let result = await response.json();
          console.log(`Task List, delete task message: ${result.message}`);  //response.message ???
        } else {
          let result = await response.json();
          console.log(`Task List, error: ${result.error}`);  //response.error ???
        }
      }

      task.remove();
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

let main = new MainPage();
let loginPage = new LoginPage();
let taskList = new TaskList();
// List

// let list = document.getElementById('list');
// list.addEventListener("click", function (e) {
//   let elem = e.target;
//   let elemDescription = elem.parentElement.nextElementSibling;
//   let task = elem.parentElement.parentElement;

//   if (elem.classList.contains('name') && elemDescription != null) {
//     elemDescription.classList.toggle('display-none');
//   } else if (elem.classList.contains('delete')) {
//     task.remove();
//   }
// });

// // Arrow btn

// let arrowButton = document.querySelector('#add-item-btn i');
// arrowButton.addEventListener("click", function (e) {
//   let elem = e.target;
//   let addItemForm = document.getElementById('add-item');

//   addItemForm.classList.toggle('display-none');
//   elem.classList.toggle('fa-chevron-up');
//   elem.classList.toggle('fa-chevron-down');
// });



class LoginPage {
  constructor() {
    this.username = '';
    this.password = '';
    this.token = '';
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
      // як сюди привязать щоб загружався TaskList це ж має бути метод іншого класу ???
    } else {
      let result = await response.json();
      console.log(result.error);
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
      console.log(result.error);
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

let loginPage = new LoginPage();

loginPage.render();
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
    this.response = '';
  }

  handleEvent(event) {
    let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
    this[method](event);
  }

  async onClick() {
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
      console.log('succesfully entered');
    } else {
      let result = await response.json();
      console.log(result.error);
    }
  }

  // onClick() {
  //   this.username = document.getElementById('username').value;
  //   this.password = document.getElementById('password').value;

  //   let xhr = new XMLHttpRequest();
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState == 4 && xhr.status == 200) {
  //       let response = JSON.parse(xhr.responseText);
  //     } else if (xhr.readyState == 4 && xhr.status !== 200) {
  //       let response = JSON.parse(xhr.responseText);
  //       console.log(response.error);
  //     }
  //   }

  //   xhr.open("POST", "/api/auth", true);
  //   xhr.setRequestHeader("Content-Type", "application/json");
  //   xhr.send(JSON.stringify({ username: this.username, password: this.password }));
  // }

  render() {
    let loginform = `
      <div class="login" id="login-form">
        <h2>Sign In</h2>
        <form >
          <input id="username" type="text" placeholder="Username">
          <input id="password" type="password" placeholder="Password">
         <button id="login-btn" type="submit">Sign In</button>
       </form>
       <p>New here? <a href="#" id="sign-up">Sign up now</a>.</p>
      </div>`

    let elem = document.getElementById('content');
    elem.innerHTML = loginform;
  }
}

let loginPage = new LoginPage();

loginPage.render();

let btn = document.getElementById('login-btn');
btn.addEventListener('click', loginPage);
import '@babel/polyfill';
import { login, logout } from './login';

const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');

loginForm &&
  loginForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    login({
      email: formData.get('email'),
      password: formData.get('pass'),
    });
  });

logoutBtn && logoutBtn.addEventListener('click', logout);

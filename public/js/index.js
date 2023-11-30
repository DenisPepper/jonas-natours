import '@babel/polyfill';
import { login, logout } from './login';
import { updateData } from './update-settings';

const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');

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

formUserData &&
  formUserData.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    updateData({
      email: formData.get('email'),
      name: formData.get('name'),
    });
  });

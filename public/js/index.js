import '@babel/polyfill';
import { login } from './login';

const loginForm = document.querySelector('.form');

loginForm &&
  loginForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    login({
      email: formData.get('email'),
      password: formData.get('pass'),
    });
  });

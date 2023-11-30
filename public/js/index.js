import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './update-settings';

const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserSettings = document.querySelector('.form-user-settings');

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
    updateSettings({
      email: formData.get('email'),
      name: formData.get('name'),
    });
  });

formUserSettings &&
  formUserSettings.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    await updateSettings({
      currentPassword: formData.get('password-current'),
      password: formData.get('password'),
      passwordConfirm: formData.get('password-confirm'),
    });
    const inputs = evt.target.querySelectorAll('input');
    for (const input of inputs) {
      input.value = '';
    }
  });

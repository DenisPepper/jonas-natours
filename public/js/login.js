const loginForm = document.querySelector('.form');

const login = async (formData) => {
  const path = 'http://127.0.0.1:3000/api/v1/users/login';

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  };

  try {
    await fetch(path, params);
  } catch (error) {
    console.log('Ошибка авторизации');
  }
};

loginForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const formData = new FormData(evt.target);
  login({
    email: formData.get('email'),
    password: formData.get('pass'),
  });
});

export const login = async (formData) => {
  const path = 'http://127.0.0.1:3000/api/v1/users/login';

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  };

  try {
    const response = await fetch(path, params);
    const { status } = await response.json();
    if (status === 'success') location.assign('/');
  } catch (error) {
    console.log('Ошибка при отправке запроса авторизации');
  }
};

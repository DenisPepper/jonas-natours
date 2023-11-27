import axios from 'axios';

export const login = async (formData) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: formData,
    });
    console.log(data);
    if (data.status === 'success') location.assign('/');
  } catch (error) {
    console.log(error.response.data.message);
  }
};

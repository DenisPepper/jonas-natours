import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (formData) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: formData,
    });
    showAlert('success', 'You are logged in');
    if (data.status === 'success') setTimeout(() => location.assign('/'), 1500);
  } catch (error) {
    showAlert('error', error.response.data.message || 'You are not logged!');
  }
};

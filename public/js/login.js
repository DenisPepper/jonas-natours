import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (formData) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: formData,
    });
    if (data.status === 'success') {
      showAlert('success', 'You are logged in');
      setTimeout(() => location.assign('/'), 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message || 'You are not logged!');
  }
};

export const logout = async () => {
  try {
    const { data } = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if (data.status === 'success') location.reload(true);
  } catch (error) {
    showAlert(
      'error',
      error.message || 'Error logging out! Try again later...',
    );
  }
};

import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async ({ name, email }) => {
  try {
    const { data } = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateUserInfo',
      data: { name, email },
    });

    if (data.status === 'success')
      showAlert('success', 'Your data updated successfully');
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

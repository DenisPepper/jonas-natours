import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async ({
  name,
  email,
  currentPassword,
  password,
  passwordConfirm,
}) => {
  const url = password
    ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
    : 'http://127.0.0.1:3000/api/v1/users/updateUserInfo';

  const data = password
    ? { currentPassword, password, passwordConfirm }
    : { name, email };

  try {
    const { data: newData } = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (newData.status === 'success')
      showAlert('success', 'Your data updated successfully');
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const hideAlert = () => {
  const alert = document.querySelector('alert');
  if (alert) alert.parentElement.removeChild(alert);
};

export const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, 5000);
};

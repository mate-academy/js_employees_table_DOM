export const createNotification = (text, type = 'success') => {
  const notification = document.createElement('div');
  const title = document.createElement('h2');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');

  if (type === 'error') {
    notification.classList.add('error');
  } else {
    notification.classList.add('success');
  }

  title.textContent = text;
  notification.append(title);

  setTimeout(() => {
    notification.remove();
  }, 3000);

  return notification;
};

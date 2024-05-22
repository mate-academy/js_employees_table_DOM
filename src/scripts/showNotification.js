'use strict';

export function showNotification(titleName, message, isSuccess) {
  const notification = document.createElement('div');
  const title = document.createElement('h3');
  const paragraph = document.createElement('p');

  title.textContent = titleName;
  title.className = 'title';

  paragraph.textContent = message;

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', isSuccess ? 'success' : 'error');

  notification.appendChild(title);
  notification.appendChild(paragraph);
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

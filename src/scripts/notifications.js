'use strict';

let notificationsArea = null;
const types = {
  success: 'success',
  error: 'error',
  warning: 'warning',
};

function createNotificationsArea() {
  notificationsArea = document.createElement('div');

  notificationsArea.style.cssText = `
    position: fixed;
    right: 10px;
    top: 10px;

    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
  `;

  document.body.insertAdjacentElement('beforeend', notificationsArea);
}

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const heading = document.createElement('h2');
  const message = document.createElement('p');

  heading.innerText = `${title}:`;
  message.innerText = description;

  heading.style.cssText = 'margin: 0 0 12px 0;';
  message.style.cssText = 'margin: 0;';

  notification.append(heading);
  notification.append(message);

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.dataset.qa = 'notification';

  notification.style.cssText = `
    position: static;

    padding: 12px;
    min-height: auto;
  `;

  notificationsArea.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

module.exports = {
  notificationsArea: notificationsArea,
  types: types,
  create: createNotificationsArea,
  push: pushNotification,
};

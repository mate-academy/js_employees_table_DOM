'use strict';

export const pushNotification = (
  posTop,
  posRight,
  title,
  description,
  type,
) => {
  const notificationElement = document.createElement('div');

  notificationElement.classList.add('notification', type);
  notificationElement.style.top = posTop + 'px';
  notificationElement.style.right = posRight + 'px';

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');
  notificationTitle.textContent = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;
  notificationElement.dataset.qa = 'notification';
  notificationElement.classList.add(`${type}`);

  document.body.appendChild(notificationElement);
  notificationElement.appendChild(notificationTitle);
  notificationElement.appendChild(notificationDescription);

  setTimeout(() => {
    notificationElement.style.display = 'none';
  }, 2000);
};

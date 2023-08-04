'use strict';

const pushNotification = (
  posTop = 10,
  posRight = 10,
  title,
  description,
  type = 'error',
) => {
  const body = document.body;

  const notifElem = document.createElement('div');
  const notifTitle = document.createElement('h2');
  const notifDescription = document.createElement('p');

  notifElem.classList.add('notification', type);

  notifElem.style.top = typeof posTop === 'number'
    ? `${posTop}px`
    : posTop;

  notifElem.style.right = typeof posRight === 'number'
    ? `${posRight}px`
    : posRight;

  notifTitle.className = 'title';
  notifTitle.innerText = title;
  notifDescription.innerText = description;

  notifElem.setAttribute('data-qa', 'notification');

  notifElem.append(notifTitle, notifDescription);

  body.appendChild(notifElem);

  setTimeout(() => notifElem.remove(), 2000);
};

module.exports = { pushNotification };

import { toUpperCaseFirstLetter } from '../utils/format';

const NOTIFICATIONS = {
  success: 'New employee was successfully added.',
  // warning: 'Please check the form: some fields are invalid.',
  error: 'Please check the form: some fields are invalid.',
};

let timerID;

export function showNotification(refEl, type) {
  clearTimeout(timerID);

  const ongoingNotificationEl = document.querySelector(
    '[data-qa="notification"]',
  );

  if (ongoingNotificationEl) {
    ongoingNotificationEl.remove();
  }

  const notificationEl = document.createElement('div');
  const notificationTitle = document.createElement('span');
  const notificationText = document.createElement('p');

  notificationEl.classList.add('notification', type);
  notificationEl.dataset.qa = 'notification';
  notificationTitle.classList.add('title');

  notificationTitle.textContent = `${toUpperCaseFirstLetter(type)} message`;
  notificationText.textContent = NOTIFICATIONS[type];

  notificationEl.append(notificationTitle, notificationText);

  refEl.insertAdjacentElement('afterend', notificationEl);

  timerID = setTimeout(() => {
    notificationEl.remove();
  }, 3000);
}

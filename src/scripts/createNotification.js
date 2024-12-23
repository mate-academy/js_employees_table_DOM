import { createElement } from './utils';

export function pushNotification(posTop, posRight, title, description, type) {
  const html = document.documentElement;
  const notification = document.createElement('div');

  const notificationTitle = createElement('h2', title);
  const notificationDescription = createElement('p', description);

  notificationTitle.classList.add('title');
  notification.classList.add('notification', type);

  notification.append(notificationTitle);
  notification.append(notificationDescription);

  notification.dataset.qa = 'notification';

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  html.append(notification);

  setTimeout(() => (notification.style.display = 'none'), 2000);
}

export function pushNotification(posTop, posRight, title, description, type) {
  const notificationBlock = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notificationTitle.classList = 'title';
  notificationTitle.textContent = title;
  notificationDescription.textContent = description;

  notificationBlock.className = `notification ${type}`;
  notificationBlock.setAttribute('data-qa', 'notification');
  notificationBlock.append(notificationTitle, notificationDescription);
  notificationBlock.style.top = `${posTop}px`;
  notificationBlock.style.right = `${posRight}px`;
  notificationBlock.style.zIndex = 2;

  document.body.prepend(notificationBlock);

  setTimeout(() => {
    notificationBlock.style.display = 'none';
  }, 3000);
}

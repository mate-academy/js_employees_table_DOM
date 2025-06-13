export const pushNotification = (
  posTop,
  posRight,
  title,
  description,
  type,
) => {
  const body = document.body;
  const messageContainer = document.createElement('div');

  messageContainer.style = `top: ${posTop}px; right: ${posRight}px;`;
  messageContainer.classList.add('notification', type);
  messageContainer.setAttribute('data-qa', 'notification');

  const titleEl = document.createElement('h2');

  titleEl.classList.add('title');
  titleEl.innerText = title;

  const descriptionEl = document.createElement('p');

  descriptionEl.innerText = description;

  messageContainer.append(titleEl, descriptionEl);
  body.append(messageContainer);

  setTimeout(() => {
    messageContainer.remove();
  }, 2000);
};

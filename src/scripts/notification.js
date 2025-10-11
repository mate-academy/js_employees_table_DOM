export const pushNotification = (
  posTop,
  posRight,
  title,
  description,
  type,
) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add(type, 'notification');
  div.setAttribute('data-qa', 'notification');
  div.style.zIndex = 1000;
  div.style.cssText = `position: absolute; top: ${posTop}px; right: ${posRight}px;`;
  h2.classList.add('title');
  h2.textContent = title;
  p.textContent = description;

  div.append(h2, p);
  document.body.append(div);

  setTimeout(() => (div.hidden = true), 5000);
};

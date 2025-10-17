export const pushNotification = (
  posTop = 10,
  posRight = 10,
  title = 'Error',
  description = 'An error occurred.',
  type = 'error',
) => {
  const allertEl = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  allertEl.style.cssText = `
  position: fixed;
  top: ${posTop}px;
  right: ${posRight}px;
  `;

  allertEl.className = `notification ${type}`;
  allertEl.setAttribute('data-qa', 'notification');

  h2.textContent = title;
  h2.className = 'title';

  p.textContent = description;

  allertEl.append(h2, p);
  document.body.append(allertEl);

  setTimeout(() => {
    if (allertEl) {
      allertEl.remove();
    }
  }, 2000);
};

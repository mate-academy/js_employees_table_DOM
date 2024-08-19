export function createNotificationElement() {
  const h3 = document.createElement('h3');

  h3.setAttribute('data-qa', 'notification');
  h3.classList.add('notification');
  h3.innerText = '';

  h3.style.cssText = `
  display: none;
  `;
  document.querySelector('body').after(h3);

  return h3;
}

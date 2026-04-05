export const showNotification = (type, title, text = '', timeout = 4000) => {
  const prev = document.querySelector('[data-qa="notification"]');

  if (prev) {
    prev.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.className = `notification ${type}`;

  const h = document.createElement('h2');

  notification.appendChild(h);
  h.textContent = title;
  h.className = 'title';

  if (text) {
    const p = document.createElement('p');

    p.textContent = text;
    p.style.whiteSpace = 'pre-wrap';
    notification.appendChild(p);
  }

  const form = document.querySelector('.new-employee-form');
  const rect = form.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const distanceFromViewportTopToFormBottom = rect.bottom + scrollTop + 'px';
  const distanceFromViewportTopToFormLeft = rect.left + 'px';

  notification.style.top = distanceFromViewportTopToFormBottom;
  notification.style.left = distanceFromViewportTopToFormLeft;
  notification.style.marginTop = 10 + 'px';

  document.body.appendChild(notification);

  const t = setTimeout(() => {
    notification.remove();
  }, timeout);

  notification.addEventListener('click', () => {
    clearTimeout(t);
    setTimeout(() => notification.remove(), 150);
  });
};

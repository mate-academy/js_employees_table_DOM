import { clearField } from './clearField';
import { createNotificationElement } from './createNotificationElement';

const h3 = createNotificationElement();

function customizeNotification(title) {
  title.style.cssText = `
  display: flex;
  justify-content: center;
  align-items: center;
  color: #1e1919;
  `;

  setInterval(() => {
    title.style.display = 'none';
  }, 5000);
}

function showError(title, erorMessage) {
  title.classList.add('error');
  title.classList.remove('success');
  title.textContent = erorMessage;
  customizeNotification(title);
}

function showSuccess(title, succsessMessage) {
  title.classList.remove('error');
  title.classList.add('success');
  title.textContent = succsessMessage;
  customizeNotification(title);
}

export function validationForm(fieldData) {
  const { name: userName, position, age, salary } = fieldData;

  if (!userName || !position || !salary || !age) {
    showError(h3, 'All fields are required');

    return false;
  }

  if (userName.length < 4) {
    showError(h3, 'Name has less than 4 letters');

    return false;
  }

  if (age < 18 || age > 90) {
    showError(h3, 'Age shoud not be less 18 or up 90');

    return false;
  }

  showSuccess(h3, 'Successfully aded');
  clearField();

  return true;
}

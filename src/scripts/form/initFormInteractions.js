import { checkFormInputs } from './checkFormInputs';
import { pushNotification } from '../notification/pushNotification';
import { convertToCurrency, clearErrorNotifications } from '../utils/utils';

export function initFormInteractions(form, table) {
  if (!form || !table) {
    return;
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const dataFromForm = {
      fullName: form.elements.name.value.trim(),
      position: form.elements.position.value.trim(),
      office: form.elements.office.value.trim(),
      age: Number(form.elements.age.value.trim()),
      salary: Number(form.elements.salary.value.trim()),
    };

    const checkResults = checkFormInputs(dataFromForm);

    if (checkResults.length > 0) {
      handleError(checkResults);
    } else {
      addData(dataFromForm, table);
      form.reset();
    }
  });
}

function handleError(errors) {
  clearErrorNotifications();

  for (let i = 0; i < errors.length; i++) {
    pushNotification(
      i * 140 + 10,
      10,
      errors[i].title,
      errors[i].message,
      'error',
    );
  }
}

function addData({ fullName, position, office, age, salary } = {}, table) {
  const tBody = table.tBodies?.[0] ?? table.createTBody();
  const row = `<tr>
          <td>${fullName}</td>
          <td>${position}</td>
          <td>${office}</td>
          <td>${age}</td>
          <td>${convertToCurrency(salary)}</td>
        </tr>`;

  tBody.insertAdjacentHTML('beforeend', row);

  pushNotification(
    10,
    10,
    'Title of Success message',
    'Message example.\n ' +
      'Notification should contain title and description.',
    'success',
  );
}

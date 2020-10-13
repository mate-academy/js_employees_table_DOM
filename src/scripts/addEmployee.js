import { form, tableBody } from './main';
import { pushNotification } from './pushNotification';

export function addEmployee(event) {
  const data = form.elements;

  event.preventDefault();

  if (isValidData(data)) {
    addRow(data);

    pushNotification(
      450,
      275,
      'Success',
      'New employee successfully added.',
      'success'
    );
  }
}

function isValidData(data) {
  const age = +data[3].value;

  if (data[0].value.length < 4) {
    pushNotification(
      450,
      275,
      'Too short name.',
      'Name shout be at least 4 letters long.',
      'error'
    );

    return false;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      450,
      275,
      age < 18
        ? 'You are too young for that.'
        : 'You are too old for that.',
      'Age shout be between 18 and 90',
      'error'
    );

    return false;
  }

  return true;
}

function addRow(data) {
  const salary = `$${(+data[4].value).toLocaleString('en-US')}`;

  const newRow = `
  <tr>
    <td>${data[0].value}</td>
    <td>${data[1].value}</td>
    <td>${data[2].value}</td>
    <td>${data[3].value}</td>
    <td>${salary}</td>
  </tr>
  `;

  tableBody.insertAdjacentHTML('afterbegin', newRow);
}

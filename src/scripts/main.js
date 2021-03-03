'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

const selecteHandler = (e) => {
  const selectRow = e.target.closest('tr');

  if (!selectRow || !tbody.contains(selectRow)) {
    return;
  }

  [...tbody.children].forEach(employee => {
    employee.classList.remove('active');
  });

  const selectTr = e.target.parentNode;

  selectTr.classList.add('active');
};

tbody.addEventListener('click', selecteHandler);

employeeForm.insertAdjacentHTML('afterbegin', `
  <label for="name">
    Name:
    <input name="name" data-qa="name" type="text" required>
  </label>
  <label for="position">
    Position:
    <input name="position" data-qa="position" type="text" required>
  </label>
  <label for="office">
    Office:
    <select name="office" data-qa="office" id="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label for="age">
    Age:
    <input name="age" data-qa="age" type="number" required>
  </label>
  <label for="salary">
    Salary:
    <input name="salary" data-qa="salary" type="number" required>
  </label>
  <button type="submit">Save to table</button>
`);

document.body.append(employeeForm);

const pushNotification = (
  positionTop,
  positionRight,
  title,
  description,
  type
) => {
  const notification = document.createElement('div');
  const titleNotification = document.createElement('h2');
  const descriptionNotification = document.createElement('p');

  notification.classList.add('notification', `${type}`);
  notification.dataset.qa = 'notification';
  titleNotification.classList.add('title');
  descriptionNotification.classList.add('description');

  titleNotification.innerText = title;
  descriptionNotification.innerText = description;

  notification.style.top = positionTop + 'px';
  notification.style.right = positionRight + 'px';

  notification.append(titleNotification, descriptionNotification);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

const submit = employeeForm.querySelector('button');
const input = employeeForm.querySelectorAll('input');
const select = employeeForm.querySelector('select');

const addToForm = (e) => {
  e.preventDefault();

  const inputValueName = input[0].value;
  const inputValuePosition = input[1].value;
  const selectValueOffice = select.value;
  const inputValueAge = input[2].value;
  const inputValueSalary = +input[3].value;

  const minLengthOfInput = 4;
  const minAgeForInput = 18;
  const maxAgeForInput = 90;

  if (inputValueName.length < 4) {
    pushNotification(
      150,
      -0,
      'error',
      'value is less than 4 letters',
      'error'
    );
  }

  if (!inputValuePosition) {
    pushNotification(
      -0,
      -0,
      'error',
      'Position is required',
      'error'
    );
  }

  if (!inputValueSalary) {
    pushNotification(
      450,
      -0,
      'error',
      'Salary is required',
      'error'
    );
  }

  if (inputValueAge < minAgeForInput || inputValueAge > maxAgeForInput) {
    pushNotification(
      300,
      -0,
      'error',
      'value is less than 18 or more than 90',
      'error'
    );
  }

  if (
    inputValueName.length >= minLengthOfInput
    && inputValuePosition
    && inputValueSalary
    && (
      inputValueAge >= minAgeForInput
      && inputValueAge <= maxAgeForInput
    )
  ) {
    tbody.insertAdjacentHTML('beforeend', `<tr>
      <td>${inputValueName}</td>
      <td>${inputValuePosition}</td>
      <td>${selectValueOffice}</td>
      <td>${inputValueAge}</td>
      <td>$${inputValueSalary.toLocaleString('en')}</td>
    </tr>`);

    pushNotification(
      0,
      -0,
      'success',
      'congrats',
      'success'
    );
  }
};

function convertToNumber(string) {
  return string.replace(/[^0-9]/g, '');
}

let count = 1;

const sorted = (e) => {
  const th = e.target.closest('th');
  const thIndex = th.cellIndex;
  const rowsList = [...tbody.children];

  count++;

  if (!thead.contains(th)) {
    return;
  }

  switch (th.innerText) {
    case 'Name':
    case 'Position' :
      rowsList.sort((currentString, nextString) => {
        const currentStringText = currentString.cells[thIndex].innerText;
        const nextStringText = nextString.cells[thIndex].innerText;

        if (count % 2 === 0) {
          return currentStringText.localeCompare(nextStringText);
        }

        if (count % 2 !== 0) {
          return nextStringText.localeCompare(currentStringText);
        }
      });
      break;

    case 'Age':
    case 'Salary':
      rowsList.sort((currentItem, nextItem) => {
        const currentItemNumber
          = convertToNumber(currentItem.cells[thIndex].innerText);
        const nextItemNumber
          = convertToNumber(nextItem.cells[thIndex].innerText);

        if (count % 2 === 0) {
          return currentItemNumber - nextItemNumber;
        }

        if (count % 2 !== 0) {
          return nextItemNumber - currentItemNumber;
        }
      });
  }

  rows.forEach(row => tbody.removeChild(row));
  rowsList.forEach(row => tbody.appendChild(row));
};

submit.addEventListener('click', addToForm);
thead.addEventListener('click', sorted);

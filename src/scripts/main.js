'use strict';

const titles = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');

const sortStates = Array(titles.length).fill(1);

function sortRowsByColumn(dataRows, columnIndex, order) {
  return dataRows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();

    if (cellA < cellB) {
      return -1 * order;
    }

    if (cellA > cellB) {
      return 1 * order;
    }

    return 0;
  });
}

function sortRowsByNumber(dataRows, columnIndex, order) {
  return dataRows.sort((a, b) => {
    const cellA = parseFloat(
      a.cells[columnIndex].textContent.replace('$', '').replace(/,/g, ''),
    );
    const cellB = parseFloat(
      b.cells[columnIndex].textContent.replace('$', '').replace(/,/g, ''),
    );

    return (cellA - cellB) * order;
  });
}

titles.forEach((element, index) => {
  element.addEventListener('click', () => {
    const currentRows = Array.from(tbody.querySelectorAll('tr'));
    let sortedRows;

    if (index === 3 || index === 4) {
      sortedRows = sortRowsByNumber(currentRows, index, sortStates[index]);
    } else {
      sortedRows = sortRowsByColumn(currentRows, index, sortStates[index]);
    }

    sortStates[index] *= -1;

    sortedRows.forEach((row) => {
      tbody.appendChild(row);
    });
  });
});

function handleRowHover(row) {
  row.addEventListener('click', () => {
    document
      .querySelectorAll('tr')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
}

document.querySelectorAll('tbody tr').forEach(handleRowHover);

const formContainer = document.createElement('form');

formContainer.className = 'new-employee-form';

const label = document.createElement('label');

label.className = 'label';
label.textContent = 'Name:';

const input = document.createElement('input');

input.className = 'select';
input.setAttribute('name', 'name');
input.setAttribute('type', 'text');
input.setAttribute('required', '');
input.setAttribute('data-qa', 'name');

const label2 = document.createElement('label');

label2.textContent = 'Position';

const input2 = document.createElement('input');

input2.setAttribute('name', 'position');
input2.setAttribute('type', 'text');
input2.setAttribute('data-qa', 'position');
input2.setAttribute('required', '');

const label3 = document.createElement('label');

label3.textContent = 'Office';

const select = document.createElement('select');

select.setAttribute('data-qa', 'office');
select.setAttribute('name', 'office');
select.setAttribute('required', '');
select.className = 'select';

const option1 = document.createElement('option');

option1.setAttribute('value', 'tokyo');
option1.textContent = 'Tokyo';

const option2 = document.createElement('option');

option2.setAttribute('value', 'singapore');
option2.textContent = 'Singapore';

const option3 = document.createElement('option');

option3.setAttribute('value', 'london');
option3.textContent = 'London';

const option4 = document.createElement('option');

option4.setAttribute('value', 'new york');
option4.textContent = 'New York';

const option5 = document.createElement('option');

option5.setAttribute('value', 'edinburg');
option5.textContent = 'Edinburg';

const option6 = document.createElement('option');

option6.setAttribute('value', 'san francisco');
option6.textContent = 'San Francisco';

const label4 = document.createElement('label');

label4.textContent = 'Age';

const input4 = document.createElement('input');

input4.setAttribute('name', 'age');
input4.setAttribute('type', 'number');
input4.setAttribute('data-qa', 'age');
input4.setAttribute('required', '');

const label5 = document.createElement('label');

label5.textContent = 'Salary';

const input5 = document.createElement('input');

input5.setAttribute('name', 'salary');
input5.setAttribute('type', 'number');
input5.setAttribute('data-qa', 'salary');
input5.setAttribute('required', '');

const button = document.createElement('button');

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  titleElement.textContent = title;
  descriptionElement.textContent = description;

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.style.cssText = `position: fixed; top: ${posTop}px; right: ${posRight}px;`;

  notification.appendChild(titleElement);
  notification.appendChild(descriptionElement);
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
};

button.addEventListener('click', (eve) => {
  eve.preventDefault();

  const nameValue = input.value.trim();
  const ageValue = parseInt(input4.value, 10);
  const salaryValue = parseFloat(input5.value);

  if (nameValue.length < 4) {
    pushNotification(
      50,
      10,
      'Validation Error',
      'Name should contain at least 4 characters.',
      'error',
    );

    return;
  }

  if (isNaN(ageValue) || ageValue < 18 || ageValue > 90) {
    pushNotification(
      50,
      10,
      'Validation Error',
      'Age must be between 18 and 90.',
      'error',
    );

    return;
  }

  if (isNaN(salaryValue) || salaryValue <= 0) {
    pushNotification(
      50,
      10,
      'Validation Error',
      'Salary must be a positive number.',
      'error',
    );

    return;
  }

  const row = document.createElement('tr');
  const nameCell = document.createElement('td');

  nameCell.textContent = nameValue;

  const positionCell = document.createElement('td');

  positionCell.textContent = input2.value;

  const officeCell = document.createElement('td');

  officeCell.textContent = select.value;

  const ageCell = document.createElement('td');

  ageCell.textContent = ageValue;

  const salaryCell = document.createElement('td');

  salaryCell.textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(salaryValue);

  row.appendChild(nameCell);
  row.appendChild(positionCell);
  row.appendChild(officeCell);
  row.appendChild(ageCell);
  row.appendChild(salaryCell);

  tbody.appendChild(row);
  formContainer.reset();

  pushNotification(
    50,
    10,
    'Success',
    'New employee added successfully!',
    'success',
  );

  row.addEventListener('click', () => {
    document
      .querySelectorAll('tr')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

let activeInputCell = null;

tbody.addEventListener('dblclick', (even) => {
  const cell = even.target;

  if (cell.tagName !== 'TD' || activeInputCell) {
    return;
  }

  const originalValue = cell.textContent.trim();

  const input6 = document.createElement('input');

  input6.type = 'text';
  input6.className = 'cell-input';
  input6.value = originalValue;

  cell.textContent = '';
  cell.appendChild(input6);
  input.focus();

  activeInputCell = input6;

  const saveValue = () => {
    const newValue = input6.value.trim();

    cell.textContent = newValue || originalValue;
    activeInputCell = null;
  };

  input6.addEventListener('blur', saveValue);

  input6.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'Enter') {
      saveValue();
    } else if (evnt.key === 'Escape') {
      cell.textContent = originalValue;
      activeInputCell = null;
    }
  });
});

document.body.appendChild(formContainer);
formContainer.appendChild(label);
label.appendChild(input);
formContainer.appendChild(label2);
label2.appendChild(input2);
formContainer.appendChild(label3);
label3.appendChild(select);
select.appendChild(option1);
select.appendChild(option2);
select.appendChild(option3);
select.appendChild(option4);
select.appendChild(option5);
select.appendChild(option6);
formContainer.appendChild(label4);
label4.appendChild(input4);
formContainer.appendChild(label5);
label5.appendChild(input5);
formContainer.appendChild(button);

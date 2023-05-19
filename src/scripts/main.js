'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const sortingOrder = {};
let editedCell = null;

table.addEventListener('click', (e) => {
  const tableRows = [...tbody.querySelectorAll('tr')];

  if (e.target.tagName === 'TH') {
    const place = e.target.closest('thead') ? 0 : table.rows.length - 1;
    const index = [...table.rows[place].children].indexOf(e.target);
    const columnName = e.target.textContent;

    if (!sortingOrder[columnName]) {
      sortingOrder[columnName] = 'asc';
    } else if (sortingOrder[columnName] === 'asc') {
      sortingOrder[columnName] = 'desc';
    } else {
      sortingOrder[columnName] = 'asc';
    }

    tableRows.sort((a, b) => {
      const first = a.children[index].innerText;
      const second = b.children[index].innerText;

      if (isNaN(parseFloat(first.slice(1)))) {
        return first.localeCompare(second);
      } else {
        if (first.slice(0, 1) === '$') {
          return parseFloat(first.slice(1)) - parseFloat(second.slice(1));
        }

        return parseFloat(first) - parseFloat(second);
      }
    });

    if (sortingOrder[columnName] === 'desc') {
      tableRows.reverse();
    }
  }

  tableRows.forEach(row => tbody.append(row));
});

table.addEventListener('click', (tr) => {
  const clickedRow = tr.target.closest('tbody tr');

  tbody.querySelectorAll('tr').forEach(row => {
    if (row !== clickedRow) {
      row.classList.remove('active');
    }
  });

  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const nameInput = createLabeledInputField('Name:', 'text', 'name', 'name');
const positionInput
= createLabeledInputField('Position:', 'text', 'position', 'position');
const officeInput
= createSelectField('Office:', 'select', 'office', [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
]);
const ageInput = createLabeledInputField('Age:', 'number', 'age', 'age');
const salaryInput
= createLabeledInputField('Salary:', 'number', 'salary', 'salary');
const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Save to table';

form.appendChild(nameInput);
form.appendChild(positionInput);
form.appendChild(officeInput);
form.appendChild(ageInput);
form.appendChild(salaryInput);
form.appendChild(submitButton);
document.body.appendChild(form);

function createLabeledInputField(
  labelText, fieldType, nameAtr, data) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const inputField = document.createElement('input');

  inputField.setAttribute('type', fieldType);
  inputField.setAttribute('name', nameAtr);
  inputField.setAttribute('data-qa', data);
  inputField.setAttribute('required', '');

  label.appendChild(inputField);

  return label;
}

function createSelectField(labelText, nameAtr, data, options) {
  const labelForSelect = document.createElement('label');
  const selectList = document.createElement('select');

  labelForSelect.textContent = labelText;
  selectList.setAttribute('name', nameAtr);
  selectList.setAttribute('data-qa', data);
  selectList.setAttribute('required', '');

  Array.from(options).forEach(optionText => {
    const option = document.createElement('option');

    option.textContent = optionText;
    option.value = optionText;
    selectList.appendChild(option);
  });

  labelForSelect.appendChild(selectList);

  return labelForSelect;
}

function showNotification(title, description, className) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', className);

  const notificationTitle = document.createElement('h2');

  notificationTitle.textContent = title;
  notification.appendChild(notificationTitle);

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;
  notification.appendChild(notificationDescription);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newName = document.querySelector('[name = \'name\']').value;
  const position = document.querySelector('[name = \'position\']').value;
  const office = document.querySelector('[name = \'select\']').value;
  const age = parseInt(document.querySelector('[name = \'age\']').value);
  const salary
  = parseFloat(document.querySelector('[name = \'salary\']').value);

  if (newName.length < 4 || (age < 18 || age > 90)) {
    showNotification('Title of Error message', 'Message example.\n '
    + 'Notification should contain title and description.', 'error');

    return;
  }

  const newRow = document.createElement('tr');
  const nameCell = document.createElement('td');

  nameCell.textContent = newName;
  newRow.appendChild(nameCell);

  const positionCell = document.createElement('td');

  positionCell.textContent = position;
  newRow.appendChild(positionCell);

  const officeCell = document.createElement('td');

  officeCell.textContent = office;
  newRow.appendChild(officeCell);

  const ageCell = document.createElement('td');

  ageCell.textContent = age;
  newRow.appendChild(ageCell);

  const salaryCell = document.createElement('td');

  salaryCell.textContent = '$' + Math.abs(salary).toLocaleString();
  newRow.appendChild(salaryCell);

  tbody.appendChild(newRow);

  showNotification('Title of Success message', 'Message example.\n '
  + 'Notification should contain title and description.', 'success');

  form.reset();
});

tbody.addEventListener('dblclick', (e) => {
  if (editedCell) {
    return;
  }

  const targetCell = e.target;
  const originalText = targetCell.textContent;

  targetCell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalText;

  input.addEventListener('blur', () => saveCellChanges(input, originalText));

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      saveCellChanges(input, originalText);
    }
  });

  targetCell.appendChild(input);
  input.focus();
  editedCell = input;
});

function saveCellChanges(input, originalText) {
  const editedValue = input.value.trim();

  if (editedValue === '') {
    input.value = originalText;
  } else {
    input.parentElement.textContent = editedValue;
  }

  editedCell = null;
}

'use strict';

const body = document.querySelector('body');

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

// #region sorting table
const columnsAll = tableHead.querySelectorAll('th');

let sortDirection = 1;
let sortedColumnIndex = -1;

columnsAll.forEach((th) => {
  th.addEventListener('click', (e) => {
    const clickedIndex = Array.from(columnsAll).indexOf(e.target);

    if (sortedColumnIndex === clickedIndex) {
      sortDirection = -sortDirection;
    } else if (sortedColumnIndex !== clickedIndex) {
      sortDirection = 1;
      sortedColumnIndex = clickedIndex;
    }

    const rowsArray = Array.from(tableBody.querySelectorAll('tr'));

    rowsArray.sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('td')[sortedColumnIndex].textContent;
      const cellB = rowB.querySelectorAll('td')[sortedColumnIndex].textContent;
      const clearNumA = cellA.replace('$', '').replaceAll(',', '');
      const clearNumB = cellB.replace('$', '').replaceAll(',', '');
      const aNum = Number(clearNumA);
      const bNum = Number(clearNumB);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return (aNum - bNum) * sortDirection;
      }

      return cellA.localeCompare(cellB) * sortDirection;
    });

    rowsArray.forEach((row) => tableBody.append(row));
  });
});

// #endregion
// #region active class
tableBody.addEventListener('click', (e) => {
  tableBody
    .querySelectorAll('tr')
    .forEach((row) => row.classList.remove('active'));

  const clickedRow = e.target.closest('tr');

  if (clickedRow) {
    clickedRow.classList.add('active');
  }
});

// #endregion
// #region form new employee
const form = document.createElement('form');

form.classList.add('new-employee-form');

function createField(data) {
  const newField = document.createElement('label');

  newField.textContent = data.label;

  const input = document.createElement('input');

  input.setAttribute('type', data.type);
  input.setAttribute('name', data.name);
  input.setAttribute('data-qa', data.qa);

  newField.append(input);

  return newField;
}

const nameField = createField({
  label: 'Name:',
  type: 'text',
  name: 'name',
  qa: 'name',
});

const positionField = createField({
  label: 'Position:',
  type: 'text',
  name: 'position',
  qa: 'position',
});

const ageField = createField({
  label: 'Age:',
  type: 'number',
  name: 'age',
  qa: 'age',
});

const salaryField = createField({
  label: 'Salary:',
  type: 'number',
  name: 'salary',
  qa: 'salary',
});

form.append(nameField);
form.append(positionField);
form.append(ageField);
form.append(salaryField);
body.append(form);

// #endregion
// #region selectOption
const labelForSelect = document.createElement('label');
const select = document.createElement('select');

select.setAttribute('name', 'office');
select.setAttribute('data-qa', 'office');

function createOption(city) {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;

  select.append(option);
}
createOption('Tokyo');
createOption('Singapore');
createOption('New York');
createOption('Edinburgh');
createOption('San Francisco');
createOption('London');

labelForSelect.textContent = 'Office: ';
labelForSelect.append(select);
form.append(labelForSelect);

// #endregion
// #region button and notificattion
const button = document.createElement('button');

button.textContent = 'Save to table';

button.setAttribute('type', 'submit');
form.append(button);

// #region notification
const notification = document.createElement('div');

body.append(notification);

notification.classList.add('notification', 'title');
notification.setAttribute('data-qa', 'notification');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  notification.textContent = '';
  notification.classList.remove('error', 'success', 'warning');

  const formData = new FormData(form);

  for (const value of formData.values()) {
    if (value === '') {
      notification.textContent = 'Please, fill in all fields. <3';
      notification.classList.add('error');

      return;
    }
  }

  if (formData.get('name').length < 4) {
    notification.textContent = 'The name must be at least 4 letters long.';
    notification.classList.add('error');

    return;
  }

  const age = Number(formData.get('age'));

  if (age < 18 || age > 90) {
    notification.textContent =
      // eslint-disable-next-line max-len
      'Young people under the age of 18 cannot be included in the table, nor can people over the age of 90.';
    notification.classList.add('error');

    return;
  }

  const salary = Number(formData.get('salary'));

  if (salary <= 0) {
    notification.textContent =
      'People who do not have a salary cannot occupy a place in the table.';
    notification.classList.add('error');

    return;
  }

  // #endregion
  // #region add new employee

  const newEployee = document.createElement('tr');
  const firstRow = tableBody.querySelector('tr');
  const columnsCount = firstRow.querySelectorAll('td').length;

  const keys = ['name', 'position', 'office', 'age', 'salary'];

  for (let i = 0; i < columnsCount; i++) {
    const newData = document.createElement('td');

    if (keys[i] === 'salary') {
      // eslint-disable-next-line no-shadow
      const salary = Number(formData.get('salary'));

      newData.textContent = `$${salary.toLocaleString('en-US')}`;
    } else {
      newData.textContent = formData.get(keys[i]);
    }

    newEployee.append(newData);
  }

  tableBody.append(newEployee);
  // #endregion

  notification.classList.add('success');
  notification.textContent = 'Employee added successfully.';
});
// #endregion
// #region dbclick function

let editingCell = null;

tableBody.addEventListener('dblclick', (e) => {
  const clickCell = e.target.closest('td');

  if (!clickCell) {
    return;
  }

  if (editingCell) {
    return;
  }

  editingCell = clickCell;

  const oldText = clickCell.textContent;

  clickCell.textContent = '';

  const newData = document.createElement('input');

  newData.classList.add('cell-input');
  newData.setAttribute('type', 'text');
  newData.setAttribute('value', oldText);

  clickCell.append(newData);
  newData.focus();

  function save() {
    const newValue = newData.value.trim();

    clickCell.textContent = newValue === '' ? oldText : newValue;
    editingCell = null;
  }

  newData.addEventListener('blur', save);

  newData.addEventListener('keydown', (evet) => {
    if (evet.key === 'Enter') {
      newData.blur();
    }
  });
});
// #endregion

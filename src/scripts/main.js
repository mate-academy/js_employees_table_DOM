'use strict';

const tableHead = document.querySelectorAll('th');
let sortDirection = 'asc';
let currentColumn = null;

tableHead.forEach((head, index) => {
  head.addEventListener('click', () => {
    if (currentColumn === index) {
      if (sortDirection === 'asc') {
        sortDirection = 'desc';
      } else {
        sortDirection = 'asc';
      }
    } else {
      sortDirection = 'asc';
    }

    currentColumn = index;

    const rows = document.querySelectorAll('tbody tr');
    const rowsArray = Array.from(rows);

    rowsArray.sort((a, b) => {
      const aText = a.querySelectorAll('td')[index].textContent;
      const bText = b.querySelectorAll('td')[index].textContent;

      let comparison;

      if (index === 3 || index === 4) {
        const aValue = Number(aText.replace('$', '').replace(',', ''));
        const bValue = Number(bText.replace('$', '').replace(',', ''));

        comparison = aValue - bValue;
      } else {
        comparison = aText.localeCompare(bText);
      }

      if (sortDirection === 'desc') {
        comparison = comparison * -1;
      }

      return comparison;
    });

    const tBody = document.querySelector('tbody');

    rowsArray.forEach((row) => {
      tBody.append(row);
    });
  });
});

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  const rows = tbody.querySelectorAll('tr');

  rows.forEach((r) => {
    r.classList.remove('active');
  });

  row.classList.add('active');
});

const form = document.createElement('form');

form.setAttribute('novalidate', 'novalidate');

form.classList.add('new-employee-form');

const body = document.querySelector('body');

body.append(form);

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('name', 'name');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('required', 'required');

const nameText = document.createTextNode('Name: ');

nameLabel.append(nameText);
nameLabel.append(nameInput);

form.append(nameLabel);

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('name', 'position');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('required', 'required');

const positionText = document.createTextNode('Position: ');

positionLabel.append(positionText);
positionLabel.append(positionInput);

form.append(positionLabel);

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageInput.setAttribute('name', 'age');
ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('required', 'required');

const ageText = document.createTextNode('Age: ');

ageLabel.append(ageText);
ageLabel.append(ageInput);

form.append(ageLabel);

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('required', 'required');

const salaryText = document.createTextNode('Salary: ');

salaryLabel.append(salaryText);
salaryLabel.append(salaryInput);

form.append(salaryLabel);

const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeSelect.setAttribute('data-qa', 'office');
officeSelect.setAttribute('required', 'required');

const tokyoOption = document.createElement('option');
const tokyoText = document.createTextNode('Tokyo');

tokyoOption.append(tokyoText);
officeSelect.append(tokyoOption);

const singaporeOption = document.createElement('option');
const singaporeText = document.createTextNode('Singapore');

singaporeOption.append(singaporeText);
officeSelect.append(singaporeOption);

const londonOption = document.createElement('option');
const londonText = document.createTextNode('London');

londonOption.append(londonText);
officeSelect.append(londonOption);

const newYorkOption = document.createElement('option');
const newYorkText = document.createTextNode('New York');

newYorkOption.append(newYorkText);
officeSelect.append(newYorkOption);

const edinburghOption = document.createElement('option');

const edinburghText = document.createTextNode('Edinburgh');

edinburghOption.append(edinburghText);
officeSelect.append(edinburghOption);

const sanFranciscoOption = document.createElement('option');
const sanFranciscoText = document.createTextNode('San Francisco');

sanFranciscoOption.append(sanFranciscoText);
officeSelect.append(sanFranciscoOption);

const officeText = document.createTextNode('Office: ');

officeLabel.append(officeText);
officeLabel.append(officeSelect);

form.append(officeLabel);

const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');

const submitText = document.createTextNode('Save to table');

submitButton.append(submitText);
form.append(submitButton);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const oldNotification = document.querySelector('[data-qa="notification"]');

  const notification = document.createElement('div');

  if (oldNotification) {
    oldNotification.remove();
  }

  const employeeName = nameInput.value;
  const position = positionInput.value;
  const age = ageInput.value;
  const salary = '$' + Number(salaryInput.value).toLocaleString('en-US');
  const office = officeSelect.value;

  if (employeeName.length < 4) {
    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('error');

    const nameTextNotification = document.createTextNode(
      'Name must contain at least 4 letters',
    );

    notification.append(nameTextNotification);

    body.append(notification);

    return;
  }

  if (position === '') {
    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('error');

    const positionTextNotification = document.createTextNode(
      'Position is required',
    );

    notification.append(positionTextNotification);
    body.append(notification);

    return;
  }

  if (age < 18 || age > 90) {
    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('error');

    const ageTextNotification = document.createTextNode(
      'Age must be between 18 and 90',
    );

    notification.append(ageTextNotification);

    body.append(notification);

    return;
  }

  const newRow = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.append(employeeName);
  newRow.append(nameCell);

  const positionCell = document.createElement('td');

  positionCell.append(position);
  newRow.append(positionCell);

  const officeCell = document.createElement('td');

  officeCell.append(office);
  newRow.append(officeCell);

  const ageCell = document.createElement('td');

  ageCell.append(age);
  newRow.append(ageCell);

  const salaryCell = document.createElement('td');

  salaryCell.append(salary);
  newRow.append(salaryCell);

  tbody.append(newRow);

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('success');

  const textNotification = document.createTextNode(
    'Employee successfully added',
  );

  notification.append(textNotification);

  body.append(notification);
});

function editCell(cell) {
  if (document.querySelector('.cell-input')) {
    return;
  }

  const initialValue = cell.textContent;

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;

  cell.textContent = '';

  cell.append(input);

  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (input.value === '') {
        cell.textContent = initialValue;
      } else {
        cell.textContent = input.value;
      }

      input.remove();
    }
  });

  input.addEventListener('blur', () => {
    if (input.value === '') {
      cell.textContent = initialValue;
    } else {
      cell.textContent = input.value;
    }

    input.remove();
  });
}

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    editCell(e.target);
  }
});

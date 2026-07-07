'use strict';

const headers = document.querySelectorAll('th');
let sortColumn = null;
let sortDirection = 'asc';

headers.forEach((header) => {
  header.addEventListener('click', (evt) => {
    const th = evt.target.closest('th');
    const tbodyHeader = document.querySelector('tbody');
    const columnNumber = th.cellIndex;
    const data = Array.from(tbodyHeader.rows);

    if (sortColumn === columnNumber) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = columnNumber;
      sortDirection = 'asc';
    }

    data.sort((a, b) => {
      const aValue = a.cells[columnNumber].innerText;
      const bValue = b.cells[columnNumber].innerText;
      const cleanNumber = (str) => +str.replace(/[$,]/g, '');

      const aNum = cleanNumber(aValue);
      const bNum = cleanNumber(bValue);

      let result;

      if (!isNaN(aNum) && !isNaN(bNum)) {
        result = aNum - bNum;
      } else {
        result = aValue.localeCompare(bValue);
      }

      return sortDirection === 'asc' ? result : -result;
    });

    tbodyHeader.append(...data);
  });
});

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  document
    .querySelectorAll('tbody tr')
    .forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

const body = document.body;

const form = document.createElement('form');

form.className = 'new-employee-form';

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.setAttribute('data-qa', 'name');
nameInput.required = true;

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.setAttribute('data-qa', 'position');

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');

const option1 = document.createElement('option');

option1.value = 'Tokyo';
option1.textContent = 'Tokyo';

const option2 = document.createElement('option');

option2.value = 'Singapore';
option2.textContent = 'Singapore';

const option3 = document.createElement('option');

option3.value = 'London';
option3.textContent = 'London';

const option4 = document.createElement('option');

option4.value = 'New York';
option4.textContent = 'New York';

const option5 = document.createElement('option');

option5.value = 'Edinburgh';
option5.textContent = 'Edinburgh';

const option6 = document.createElement('option');

option6.value = 'San Francisco';
option6.textContent = 'San Francisco';

officeSelect.append(option1, option2, option3, option4, option5, option6);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.setAttribute('data-qa', 'age');
ageInput.required = true;
ageInput.type = 'number';

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = true;
salaryInput.type = 'number';

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

nameLabel.append(nameInput);
positionLabel.append(positionInput);
officeLabel.append(officeSelect);
ageLabel.append(ageInput);
salaryLabel.append(salaryInput);

form.append(nameLabel);
form.append(positionLabel);
form.append(officeLabel);
form.append(ageLabel);
form.append(salaryLabel);
form.append(button);

body.append(form);

const showNotification = (type, title, description) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  notification.classList.add(type);

  const element = document.createElement('h2');

  element.classList.add('title');
  element.textContent = title;

  const message = document.createElement('p');

  message.classList.add('description');
  message.textContent = description;

  notification.appendChild(element);
  notification.appendChild(message);
  document.body.appendChild(notification);
};

form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  const formData = new FormData(evt.target);
  const nameForm = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  // const salary = Number(formData.get('salary'));

  if (nameForm.length < 4) {
    showNotification('error', 'Error', 'Name should be at least 4 letters');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Error', 'Wrong age');

    return;
  }

  if (!position || position.trim() === '') {
    showNotification('error', 'Error', 'Position is required');

    return;
  }

  const salaryValue = formData.get('salary');

  if (!salaryValue || salaryValue.trim() === '') {
    showNotification('error', 'Error', 'Salary is required');

    return;
  }

  const salary = Number(salaryValue);

  const tbodyForm = document.querySelector('tbody');
  const row = document.createElement('tr');
  const nameTd = document.createElement('td');
  const positionTd = document.createElement('td');
  const officeTd = document.createElement('td');
  const ageTd = document.createElement('td');
  const salaryTd = document.createElement('td');

  nameTd.textContent = nameForm;
  positionTd.textContent = position;
  officeTd.textContent = office;
  ageTd.textContent = age;
  salaryTd.textContent = '$' + salary.toLocaleString();

  row.append(nameTd, positionTd, officeTd, ageTd, salaryTd);

  tbodyForm.append(row);

  showNotification('success', 'Success', 'SUCCESS');
});

const tbodyEdit = document.querySelector('tbody');

tbodyEdit.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const existingInput = document.querySelector('.cell-input');

  if (existingInput) {
    const parentCell = existingInput.parentElement;
    const originalVal =
      parentCell.getAttribute('data-original') || existingInput.value;

    parentCell.textContent = existingInput.value || originalVal;
    parentCell.removeAttribute('data-original');
    existingInput.remove();
  }

  const originalValue = cell.textContent;

  cell.setAttribute('data-original', originalValue);
  cell.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.value = originalValue;
  input.className = 'cell-input';

  cell.append(input);
  input.focus();

  const saveValue = () => {
    const newValue = input.value;

    cell.textContent = newValue || originalValue;
    cell.removeAttribute('data-original');
  };

  input.addEventListener('blur', saveValue);

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      saveValue();
    }
  });
});

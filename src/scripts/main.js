'use strict';

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const tableHead = document.querySelector('thead');

tableBody.addEventListener('click', (e) => {
  const currentTarget = e.target.closest('tr');

  if (!currentTarget) {
    return;
  }

  const activeRow = tableBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  currentTarget.classList.add('active');
});

let lastIndex = null;
let sortDirection = 'asc';

tableHead.addEventListener('click', (e) => {
  const currentTarget = e.target;

  if (currentTarget.tagName === 'TH') {
    const index = currentTarget.cellIndex;

    const array = [...tableBody.rows];

    if (lastIndex === index) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection = 'asc';
    }

    lastIndex = index;

    const direction = sortDirection === 'asc' ? 1 : -1;

    array.sort((a, b) => {
      const aValue = a.cells[index].textContent.replace(/[$,]/g, '');
      const bValue = b.cells[index].textContent.replace(/[$,]/g, '');

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return direction * (aValue - bValue);
      }

      return direction * aValue.localeCompare(bValue);
    });

    array.forEach((elem) => {
      tableBody.appendChild(elem);
    });
  }
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');
const nameText = document.createTextNode('Name: ');

nameInput.dataset.qa = 'name';

nameInput.name = 'name';

nameLabel.append(nameText, nameInput);

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');
const positionText = document.createTextNode('Position: ');

positionInput.dataset.qa = 'position';

positionInput.name = 'position';

positionLabel.append(positionText, positionInput);

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');
const ageText = document.createTextNode('Age: ');

ageInput.type = 'number';

ageInput.dataset.qa = 'age';

ageInput.name = 'age';

ageLabel.append(ageText, ageInput);

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');
const salaryText = document.createTextNode('Salary: ');

salaryInput.type = 'number';

salaryInput.dataset.qa = 'salary';

salaryInput.name = 'salary';

salaryLabel.append(salaryText, salaryInput);

const citySelectLabel = document.createElement('label');
const citySelect = document.createElement('select');
const citySelectText = document.createTextNode('Office: ');

citySelectLabel.append(citySelectText, citySelect);

citySelect.dataset.qa = 'office';

citySelect.name = 'office';

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const city of cities) {
  const cityOption = document.createElement('option');

  cityOption.textContent = city;

  citySelect.appendChild(cityOption);
}

const save = document.createElement('button');

save.textContent = 'Save to table';

save.type = 'submit';

form.append(
  nameLabel,
  positionLabel,
  citySelectLabel,
  ageLabel,
  salaryLabel,
  save,
);

table.after(form);

const showNotification = (message, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);

  notification.dataset.qa = 'notification';

  const text = document.createElement('p');

  text.textContent = message;
  notification.appendChild(text);

  setTimeout(() => {
    notification.remove();
  }, 2000);

  document.body.appendChild(notification);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (nameInput.value.length < 4) {
    return showNotification('Wrong', 'error');
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    return showNotification('Wrong', 'error');
  }

  if (positionInput.value === '') {
    return showNotification('Wrong', 'error');
  }

  if (salaryInput.value === '') {
    return showNotification('Wrong', 'error');
  }

  showNotification('Success', 'success');

  const newRow = tableBody.insertRow(-1);
  const nameCell = newRow.insertCell();

  nameCell.textContent = nameInput.value;

  const positionCell = newRow.insertCell();

  positionCell.textContent = positionInput.value;

  const officeCell = newRow.insertCell();

  officeCell.textContent = citySelect.value;

  const ageCell = newRow.insertCell();

  ageCell.textContent = ageInput.value;

  const salaryCell = newRow.insertCell();

  salaryCell.textContent = `$${Number(salaryInput.value).toLocaleString()}`;

  nameInput.value = '';
  positionInput.value = '';
  citySelect.value = 'Tokyo';
  ageInput.value = '';
  salaryInput.value = '';
});

tableBody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  if (tableBody.querySelector('.cell-input')) {
    return;
  }

  const initialValue = td.textContent;

  td.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialValue;
  td.appendChild(input);

  input.focus();

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      td.textContent = input.value || initialValue;
    }
  });

  input.addEventListener('blur', () => {
    td.textContent = input.value || initialValue;
  });
});

'use strict';

const heads = document.querySelectorAll('th');
const rows = document.querySelectorAll('tbody > tr');
const tbody = document.querySelectorAll('tbody');
const body = document.querySelector('body');
let count = 0;
let countName = 0;
let countPosition = 0;
let countAge = 0;
let countSalary = 0;
let countOffice = 0;

function sortTable(type) {
  let index;

  switch (type) {
    case 'Name':
      index = 0;
      countName++;
      countPosition = 0;
      countAge = 0;
      countSalary = 0;
      countOffice = 0;
      count = countName;
      break;

    case 'Position':
      index = 1;
      countPosition++;
      countName = 0;
      countAge = 0;
      countSalary = 0;
      countOffice = 0;
      count = countPosition;
      break;

    case 'Office':
      index = 2;
      countOffice++;
      countPosition = 0;
      countName = 0;
      countSalary = 0;
      countAge = 0;
      count = countOffice;
      break;

    case 'Age':
      index = 3;
      countAge++;
      countPosition = 0;
      countName = 0;
      countSalary = 0;
      countOffice = 0;
      count = countAge;
      break;

    case 'Salary':
      index = 4;
      countSalary++;
      countPosition = 0;
      countAge = 0;
      countName = 0;
      countOffice = 0;
      count = countSalary;
      break;

    default:
      index = 0;
      break;
  }

  Array.from(rows).sort((a, b) => {
    let cellA = a.cells[index].textContent;
    let cellB = b.cells[index].textContent;
    
    if (index === 4) {
      const pattern = /[,$]/ig;

      cellA = cellA.replace(pattern, '');
      cellB = cellB.replace(pattern, '');
    }

    let value;

    if (index === 4 || index === 3) {
      value = count % 2 === 0 ? +cellB - +cellA : +cellA - +cellB;
    } else {
      value = count % 2 === 0 ? cellB.localeCompare(cellA) : cellA.localeCompare(cellB);
    }

    return value;
  }).forEach(row => tbody[0].appendChild(row));
}

function createNotification(text, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.textContent = text;
  body.append(notification);

  setTimeout(() => {
    body.removeChild(notification);
  }, 2000);
}

function createRow(values) {
  const newRow = document.createElement('tr');
  const nameTd = document.createElement('td');
  const positionTd = document.createElement('td');
  const officeTd = document.createElement('td');
  const ageTd = document.createElement('td');
  const salaryTd = document.createElement('td');
  const pattern = /(\d)(?=(\d{3})+(?!\d))/g;
  let salary = values.salary;

  salary = salary.toString().replace(pattern, '$1,');

  nameTd.textContent = values.name;
  positionTd.textContent = values.position;
  officeTd.textContent = values.office;
  ageTd.textContent = values.age;
  salaryTd.textContent = '$' + salary;

  newRow.append(nameTd);
  newRow.append(positionTd);
  newRow.append(officeTd);
  newRow.append(ageTd);
  newRow.append(salaryTd);
  tbody[0].append(newRow);

  createNotification('New employee is successfully added', 'success');
}

function addForm() {
  const form = document.createElement('form');
  const nameLabel = document.createElement('label');
  const positionLabel = document.createElement('label');
  const ageLabel = document.createElement('label');
  const salaryLabel = document.createElement('label');
  const officeLabel = document.createElement('label');
  const nameInput = document.createElement('input');
  const positionInput = document.createElement('input');
  const ageInput = document.createElement('input');
  const salaryInput = document.createElement('input');
  const officeSelect = document.createElement('select');
  const button = document.createElement('button');
  const cities = [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

  form.classList.add('new-employee-form');

  nameLabel.textContent = 'Name: ';
  positionLabel.textContent = 'Position: ';
  ageLabel.textContent = 'Age: ';
  salaryLabel.textContent = 'Salary: ';
  officeLabel.textContent = 'Office: ';
  button.textContent = 'Save to table';

  nameInput.type = 'text';
  positionInput.type = 'text';
  ageInput.type = 'number';
  salaryInput.type = 'number';
  button.type = 'submit';

  nameInput.dataset.qa = 'name';
  positionInput.dataset.qa = 'position';
  officeSelect.dataset.qa = 'office';
  ageInput.dataset.qa = 'age';
  salaryInput.dataset.qa = 'salary';

  cities.forEach((city) => {
    const cityOption = document.createElement('option');
    
    cityOption.textContent = city;
    officeSelect.append(cityOption);
  })

  nameLabel.append(nameInput);
  positionLabel.append(positionInput);
  ageLabel.append(ageInput);
  salaryLabel.append(salaryInput);
  officeLabel.append(officeSelect);

  form.append(nameLabel);
  form.append(positionLabel);
  form.append(officeLabel);
  form.append(ageLabel);
  form.append(salaryLabel);
  form.append(button);

  body.append(form);

  button.addEventListener('click', (e) => {
    e.preventDefault();

    const values = {
      name: nameInput.value,
      position: positionInput.value,
      office: officeSelect.value,
      age: ageInput.value,
      salary: salaryInput.value,
    };

    if (
      !nameInput.value
      || !positionInput.value
      || !officeSelect.value
      || !ageInput.value
      || !salaryInput.value
    ) {
      createNotification('All the fields are required', 'error');

      return;
    }

    if (nameInput.value.length < 4) {
      createNotification('Name can not be less than 4 characters', 'error');

      return;
    }

    if (+ageInput.value < 18) {
      createNotification('Age can not be less than 18', 'error');

      return;
    }

    if (+ageInput.value > 90) {
      createNotification('Age can not be more over 90', 'error');

      return;
    }

    createRow(values);

    nameInput.value = '';
    positionInput.value = '';
    officeSelect.value = cities[0];
    ageInput.value = '';
    salaryInput.value = '';
  });
}

function editHandler(input, initialText, cell) {
  let newValue = input.value;

  if (!newValue) {
    newValue = initialText;
  }

  cell.textContent = newValue;
}

heads.forEach(head => {
  head.addEventListener('click', () => {
    sortTable(head.textContent);
  });
});

tbody[0].addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  Array.from(tbody[0].children).forEach(r => {
    r.classList.remove('active');
  })

  row.classList.add('active');
});

tbody[0].addEventListener('dblclick', (e) => {
  const cell = e.target;
  const initialText = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialText;
  input.focus();
  e.target.closest('tr').classList.remove('active');
  cell.textContent = '';
  cell.append(input);

  input.addEventListener('blur', () => {
    editHandler(input, initialText, cell);
  });

  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      editHandler(input, initialText, cell);
    };
  });
});

addForm();

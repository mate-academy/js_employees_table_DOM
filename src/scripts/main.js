'use strict';

const table = document.querySelector('tbody');
const header = document.querySelectorAll('th');
const data = [];
const newInput = document.createElement('input');
let oldValue = '';
let rowIndex = '';
let cellIndex = '';

for (let i = 0; i < table.rows.length; i++) {
  data.push({
    name: table.rows[i].cells[0].innerHTML,
    position: table.rows[i].cells[1].innerHTML,
    office: table.rows[i].cells[2].innerHTML,
    age: table.rows[i].cells[3].innerHTML,
    salary: +table.rows[i].cells[4].innerHTML.replace(/\D/g, ''),
  });
}

for (let i = 0; i < header.length; i++) {
  header[i].setAttribute('state', true);

  header[i].addEventListener('click', () => {
    filterData(
      header[i].innerText,
      header[i].getAttribute('state'),
      header[i]
    );
  });
}

function clickRow(e) {
  rowIndex = [...table.rows].indexOf(e.currentTarget);
  cellIndex = [...e.currentTarget.cells].indexOf(e.target);

  oldValue = e.target.innerHTML;
  e.target.innerHTML = '';
  newInput.value = oldValue;
  e.target.append(newInput);

  newInput.addEventListener('keyup', () => {
    changeValue(e, rowIndex, cellIndex);
  });

  newInput.addEventListener('blur', () => {
    blurInput(rowIndex, cellIndex);
  });

  newInput.focus();

  removeClickRow();
}

function changeValue(e, row, cell) {
  if (window.event.key === 'Enter') {
    newInput.blur();
  }

  switch (cell) {
    case 0:
      data[row].name = newInput.value;
      break;

    case 1:
      data[row].position = newInput.value;
      break;

    case 2:
      data[row].office = newInput.value;
      break;

    case 3:
      data[row].age = +newInput.value.replace(/\D/g, '');
      break;

    case 4:
      data[row].salary = +newInput.value.replace(/\D/g, '');
      break;
  }
}

function blurInput(row, cell) {
  newInput.removeEventListener('keyup', () => {
    changeValue();
  });

  if (newInput.value === '') {
    switch (cell) {
      case 0:
        data[row].name = oldValue;
        break;
      case 1:
        data[row].position = oldValue;
        break;
      case 2:
        data[row].office = oldValue;
        break;
      case 3:
        data[row].age = oldValue;
        break;
      case 4:
        data[row].salary = +newInput.value.replace(/\D/g, '');
        break;
    }
  }

  createHTML();
}

function createHTML(e) {
  table.innerHTML = '';

  data.map((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.position}</td>
      <td>${item.office}</td>
      <td>${item.age}</td>
      <td>$${item.salary.toLocaleString('en')}</td>
    `;
    table.append(row);
    row.addEventListener('dblclick', clickRow);
    row.addEventListener('click', activeRow);
  });
}

function removeClickRow() {
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].removeEventListener('dblclick', clickRow);
  }
}

function activeRow(e) {
  const rows = table.rows;

  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove('active');
  }
  e.currentTarget.classList.toggle('active');
}

createHTML();

function filterData(filterName, state, element) {
  const key = filterName.toLowerCase();

  data.sort((a, b) => {
    return (
      state === 'true' ? a[key] > b[key] ? 1 : -1 : a[key] < b[key] ? 1 : -1
    );
  });

  element.setAttribute('state', state === 'true' ? 'false' : 'true');

  createHTML();
}

document.body.insertAdjacentHTML('beforeend', `
  <form class = "new-employee-form">
  <label>Name:
  <input required name="name" type="text" data-qa="name">
  </label>
  <label>Position:
  <input required name="position" type="text" data-qa="position" >
  </label>
  <label>Office:
  <select required name="office" data-qa="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
  </label>
  <label>Age:
  <input required name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
  <input required name="salary" type="number" data-qa="salary">
  </label>
  <button type="button">Save to table</button>
  </form>
`);

const form = document.querySelector('form');
const saveBtn = document.querySelector('button');

saveBtn.addEventListener('click', validationForm);

function addPerson() {
  const formData = new FormData(form);

  data.push({
    name: formData.get('name'),
    position: formData.get('position'),
    office: formData.get('office'),
    age: formData.get('age'),
    salary: +formData.get('salary').replace(/\D/g, ''),
  });

  createHTML();
}

function validationForm() {
  const formData = new FormData(form);

  if (
    formData.get('name').length === 0
    && formData.get('position').length === 0
    && formData.get('age').length === 0
    && formData.get('salary').length === 0
  ) {
    validationAlert(
      'error',
      'All fields are required'
    );
  } else {
    validationName(formData);
  }
}

function validationName(formData) {
  if (formData.get('name').length < 4) {
    validationAlert(
      'error',
      'Name must be more than 3 letters'
    );
  } else {
    validationPosition(formData);
  }
}

function validationPosition(formData) {
  if (formData.get('position').length < 2) {
    validationAlert(
      'error',
      'Indicate your position'
    );
  } else {
    validationAge(formData);
  }
}

function validationAge(formData) {
  if (+formData.get('age') < 18
    || +formData.get('age') > 90
  ) {
    validationAlert(
      'error',
      'Indicate age not less than 18 and not more than 90'
    );
  } else {
    validationSalary(formData);
  }
}

function validationSalary(formData) {
  if (+formData.get('salary').length === 0) {
    validationAlert(
      'error',
      'Please indicate salary'
    );
  } else {
    addPerson();

    validationAlert(
      'success',
      'Data added to table'
    );
  }
}

function validationAlert(className, text) {
  document.body.insertAdjacentHTML('beforeend', `
  <div class='notification ${className}'
  data-qa="notification">
  <h1 class='title'>${text}</h1>
  </div>
`);

  setTimeout(() => {
    document.querySelector('.notification').remove();
  }, 3000);
}

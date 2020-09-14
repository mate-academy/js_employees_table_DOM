'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');

function makeNumber(num) {
  return (+num) ? +num : +num.slice(1).split(',').join('');
};

function selectRow(event) {
  [...tbody.rows].map(elem => elem.classList.remove('active'));
  event.target.parentNode.classList.add('active');
}

let element;

function sortTable(event) {
  const index = event.target.cellIndex;
  const list = [...tbody.rows];

  if (element === event.target) {
    list.reverse();
  } else {
    element = event.target;

    list.sort((x, y) => {
      if (!makeNumber(x.cells[index].innerText)) {
        return x.cells[index].innerText.localeCompare(y.cells[index].innerText);
      }

      return makeNumber(x.cells[index].innerText)
      - makeNumber(y.cells[index].innerText);
    });
  }
  tbody.append(...list);
}

function createForm() {
  const arrCities = ['Tokyo', 'Singapore', 'London', 'New York',
    'Edinburgh', 'San Francisco'];
  const arrNames = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const button = document.createElement('button');

  form.classList.add('new-employee-form');

  for (const item of arrNames) {
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.textContent = `${item}:`;
    input.name = `${item.toLowerCase()}`;
    input.required = true;
    label.append(input);
    form.append(label);

    if (item === 'Office') {
      const options = arrCities.map(city => `<option>${city}</option>`);
      const select = document.createElement('select');

      select.name = item.toLowerCase();
      select.insertAdjacentHTML('afterbegin', options.join(''));
      input.remove();
      label.append(select);
    }

    if (item === 'Age' || item === 'Salary') {
      input.type = 'number';
    }
  }
  button.textContent = 'Save to table';
  button.type = 'submit';
  form.append(button);
  document.body.append(form);
}
createForm();

function pushNotification(title, description, type) {
  const container = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  container.classList.add('notification', type);
  h2.classList.add('title');
  h2.innerText = title;
  p.innerText = description;
  container.append(h2, p);
  document.body.append(container);

  setTimeout(() => container.remove(), 3000);
};

function validateForm() {
  switch (true) {
    case (form.age.value < 18):
      pushNotification('Error!', `Age can't be less then 18`, 'error');

      return false;
    case (form.age.value > 90):
      pushNotification('Error!', `Age can't be greater then 90`, 'error');

      return false;
    case (form.name.value.length < 4):
      pushNotification('Error!', `Name can't be less than 4 letters`, 'error');

      return false;
    case (+form.salary.value === 0):
      pushNotification('Error!', 'Incorrect salary value', 'error');

      return false;
    default:
      pushNotification('Success!', 'A new employee was added', 'success');

      return true;
  };
}

function addNewEmployee() {
  const employee = document.createElement('tr');

  employee.insertAdjacentHTML('afterbegin', `
    <td>${form.name.value}</td>
    <td>${form.position.value}</td>
    <td>${form.office.value}</td>
    <td>${form.age.value}</td>
    <td>$${(+form.salary.value).toLocaleString('en')}</td>
  `);
  tbody.append(employee);
}

function submitForm(event) {
  event.preventDefault();

  const newForm = event.target;

  if (!validateForm(newForm)) {
    return;
  }

  addNewEmployee(newForm);
  newForm.reset();
}

function saveValue(td, input, defaultValue) {
  if (!input.value) {
    td.textContent = defaultValue;

    return;
  }
  td.textContent = input.value;
}

function handleCellEditing(event) {
  const td = event.target;
  const defaultValue = td.textContent;
  const input = document.createElement('input');

  input.classList = 'cell-input';
  input.value = defaultValue;
  input.style.width = window.getComputedStyle(event.target).width;
  td.textContent = '';
  td.append(input);
  input.focus();

  input.addEventListener('blur', () =>
    saveValue(td, input, defaultValue));

  input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      saveValue(td, input, defaultValue);
    }
  });
}
tbody.addEventListener('click', selectRow);
thead.addEventListener('click', sortTable);
form.addEventListener('submit', submitForm);
tbody.addEventListener('dblclick', handleCellEditing);

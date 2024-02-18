'use strict';

const headRow = document.querySelector('thead tr');
const body = document.querySelector('tbody');
const bodyRows = Array.from(body.querySelectorAll('tr'));

// Sort & Toggle regions

const columnState = new Map([
  ['name', { sorted: false }],
  ['position', { sorted: false }],
  ['office', { sorted: false }],
  ['age', { sorted: false }],
  ['salary', { sorted: false }],
]);

const toggleSortState = (columnName) => {
  const state = columnState.get(columnName);

  state.sorted = !state.sorted;
};

const getSortComparator = (columnName, ascending) => {
  const multiplier = ascending ? 1 : -1;

  switch (columnName) {
    case 'name':
      return (a, b) => multiplier
        * a.cells[0].textContent.localeCompare(b.cells[0].textContent);
    case 'position':
      return (a, b) => multiplier
        * a.cells[1].textContent.localeCompare(b.cells[1].textContent);
    case 'office':
      return (a, b) => multiplier
        * a.cells[2].textContent.localeCompare(b.cells[2].textContent);
    case 'age':
      return (a, b) => multiplier
        * (parseInt(a.cells[3].textContent) - parseInt(b.cells[3].textContent));

    case 'salary':
      return (a, b) => {
        const aSalary = parseFloat(
          a.cells[4].textContent.replace(/[^\d.-]/g, ''));
        const bSalary = parseFloat(
          b.cells[4].textContent.replace(/[^\d.-]/g, ''));

        return multiplier * (aSalary - bSalary);
      };
    default:
      return null;
  }
};

const sortTable = (columnName, comparator) => {
  const sortedRows = bodyRows.slice().sort(comparator);

  sortedRows.forEach(row => body.appendChild(row));
};

const handleHeaderClick = (e) => {
  const columnName = e.target.textContent.toLowerCase();
  const state = columnState.get(columnName);

  if (!state) {
    return;
  }

  const ascending = !state.sorted;
  const comparator = getSortComparator(columnName, ascending);

  if (comparator) {
    sortTable(columnName, comparator);
    toggleSortState(columnName);
  }
};

const handleRowClick = (e) => {
  const clickedRow = e.currentTarget;

  bodyRows.forEach(row => row !== clickedRow && row.classList.remove('active'));
  clickedRow.classList.toggle('active');
};

headRow.addEventListener('click', handleHeaderClick);
bodyRows.forEach(row => row.addEventListener('click', handleRowClick));

// Form region

const employeeForm = createForm();
const select = createSelect();
const saveButton = createButton('Save to table');
const options = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

options.forEach(optionText => {
  const option = createOption(optionText);

  select.appendChild(option);
});

const selectLabel = createLabel('office');

select.dataset.qa = 'office';
select.setAttribute('name', 'office');
selectLabel.appendChild(select);

const inputLabels = ['name', 'position', 'age', 'salary'];

inputLabels.forEach(labelName => {
  const label = createLabel(labelName);
  const input = createInput(labelName);

  label.appendChild(input);
  employeeForm.appendChild(label);
});

function createForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  return newForm;
}

function createSelect() {
  return document.createElement('select');
}

function createButton(text) {
  const button = document.createElement('button');

  button.setAttribute('type', 'submit');
  button.textContent = text;

  return button;
}

function createOption(text) {
  const option = document.createElement('option');

  option.textContent = text;

  return option;
}

function createLabel(labelName) {
  const label = document.createElement('label');

  label.textContent = `${capitalize(labelName)}:`;

  return label;
}

function createInput(labelName) {
  const input = document.createElement('input');

  input.dataset.qa = labelName;
  input.setAttribute('name', labelName);

  input.setAttribute('type', labelName === 'age'
    || labelName === 'salary' ? 'number' : 'text');
  input.setAttribute('required', '');

  return input;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

employeeForm.insertBefore(selectLabel, employeeForm.children[1].nextSibling);
employeeForm.appendChild(saveButton);
document.body.appendChild(employeeForm);

const form = document.querySelector('.new-employee-form');

saveButton.addEventListener('click', handleSaveButtonClick);

function handleSaveButtonClick(e) {
  e.preventDefault();

  const namePerson = form.children[0].firstElementChild.value;
  const position = form.children[1].firstElementChild.value;
  const office = form.children[2].firstElementChild.value;
  const age = +form.children[3].firstElementChild.value;
  const salary = +form.children[4].firstElementChild.value;

  if (namePerson.length < 4
      || age < 18
      || age > 90
      || salary <= 0
      || !isNaN(+position)) {
    pushNotification(10, 10, 'Error', 'Incorrect data fields', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${namePerson}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;
  body.appendChild(newRow);
  bodyRows.push(newRow);

  newRow.addEventListener('click', handleRowClick);

  columnState.forEach((value, key) => {
    sortTable(key, getSortComparator(key, true));
  });

  pushNotification(10, 10,
    'Success', 'The employee was successfully added to the list', 'success');
  form.reset();
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageP = document.createElement('p');

  message.classList.add('notification');
  message.dataset.qa = 'notification';
  message.appendChild(messageTitle);
  message.appendChild(messageP);

  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';
  messageTitle.textContent = title;
  messageP.textContent = description;

  switch (type) {
    case 'warning':
      message.classList.add('warning');
      break;
    case 'success':
      message.classList.add('success');
      break;
    case 'error':
      message.classList.add('error');
      break;
    default:
      break;
  }

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.visibility = 'hidden';
  }, 2000);
};

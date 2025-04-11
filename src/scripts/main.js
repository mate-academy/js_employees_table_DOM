'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');
let currentSortColumn = -1;
let currentSortDirection = 'asc';

for (const el of headers) {
  el.addEventListener('click', function () {
    const currentRows = table.querySelectorAll('tbody tr');

    sort(currentRows, this.cellIndex);
  });
}

function sort(elements, index) {
  let sortedElement = [];

  if (index !== currentSortColumn) {
    currentSortDirection = 'asc';
  } else {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  }

  if (table.rows[1].cells[index].textContent.indexOf('$') !== -1) {
    sortedElement = Array.from(elements).sort((a, b) => {
      const comparison =
        a.cells[index].textContent.replace('$', '').replaceAll(',', '') -
        b.cells[index].textContent.replace('$', '').replaceAll(',', '');

      return currentSortDirection === 'asc' ? comparison : -comparison;
    });
  } else {
    sortedElement = Array.from(elements).sort((a, b) => {
      const comparison = a.cells[index].textContent.localeCompare(
        b.cells[index].textContent,
      );

      return currentSortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sortedElement.forEach((tr) => tbody.appendChild(tr));

  currentSortColumn = index;
}

tbody.addEventListener('click', function (e) {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  for (const row of tbody.querySelectorAll('tr')) {
    row.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList = 'new-employee-form';

function createInput(elementLabel, inputName, inputType) {
  const labelEl = document.createElement('label');
  const inputEl = document.createElement('input');

  labelEl.textContent = elementLabel;
  inputEl.setAttribute('name', inputName);
  inputEl.setAttribute('type', inputType);
  inputEl.setAttribute('required', true);
  inputEl.setAttribute('data-qa', inputName);
  labelEl.appendChild(inputEl);

  return labelEl;
}

function createSelect(elementLabel, selectName) {
  const labelEl = document.createElement('label');
  const selectEl = document.createElement('select');
  const cities = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  for (const city of cities) {
    const optionEl = document.createElement('option');

    optionEl.textContent = city;
    selectEl.appendChild(optionEl);
  }

  labelEl.textContent = elementLabel;
  selectEl.setAttribute('name', selectName);
  selectEl.setAttribute('required', true);
  selectEl.setAttribute('data-qa', selectName);
  labelEl.appendChild(selectEl);

  return labelEl;
}

const formSubmit = document.createElement('button');

formSubmit.textContent = 'Save to table';
formSubmit.setAttribute('type', 'submit');

form.appendChild(createInput('Name:', 'name', 'text'));
form.appendChild(createInput('Position:', 'position', 'text'));
form.appendChild(createSelect('Office:', 'office'));
form.appendChild(createInput('Age:', 'age', 'number'));
form.appendChild(createInput('Salary:', 'salary', 'number'));
form.appendChild(formSubmit);

document.querySelector('body').appendChild(form);

const newEmployeeForm = document.querySelector('.new-employee-form');

function showNotification(type, title, description) {
  const notification = document.createElement('div');
  const tagTitle = document.createElement('h2');
  const tagDescription = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  tagTitle.textContent = title;
  tagTitle.classList = 'title';
  tagDescription.textContent = description;

  notification.classList = 'notification ' + type;

  notification.appendChild(tagTitle);
  notification.appendChild(tagDescription);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

formSubmit.addEventListener('click', function (e) {
  e.preventDefault();

  if (newEmployeeForm.elements.name.value.length < 4) {
    showNotification('error', 'Error', 'Name should be more than 4 symbols');

    return;
  }

  if (
    newEmployeeForm.elements.age.value < 18 ||
    newEmployeeForm.elements.age.value > 90
  ) {
    showNotification(
      'error',
      'Error',
      'Age should be more than 18 and less than 90',
    );

    return;
  }

  if (
    !newEmployeeForm.elements.position.value ||
    !newEmployeeForm.elements.salary.value
  ) {
    showNotification('error', 'Error', 'Not allow empty fields');

    return;
  }

  if (newEmployeeForm.checkValidity()) {
    const newRow = document.createElement('tr');
    const nameTd = document.createElement('td');
    const positionTd = document.createElement('td');
    const officeTd = document.createElement('td');
    const ageTd = document.createElement('td');
    const salaryTd = document.createElement('td');

    nameTd.textContent = newEmployeeForm.elements.name.value;
    positionTd.textContent = newEmployeeForm.elements.position.value;
    officeTd.textContent = newEmployeeForm.elements.office.value;
    ageTd.textContent = newEmployeeForm.elements.age.value;

    salaryTd.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(newEmployeeForm.elements.salary.value);

    newRow.appendChild(nameTd);
    newRow.appendChild(positionTd);
    newRow.appendChild(officeTd);
    newRow.appendChild(ageTd);
    newRow.appendChild(salaryTd);

    table.querySelector('tbody').appendChild(newRow);

    showNotification('success', 'Success', 'Form submited');

    newEmployeeForm.reset();
  }
});

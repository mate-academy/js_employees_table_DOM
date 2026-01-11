'use strict';

const COLUMN_INDEX_AGE = 3;
const COLUMN_INDEX_SALARY = 4;
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const form = document.createElement('form');
const button = document.createElement('button');

let activeColumnTitle = 0;
let isAscending = false;

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const inputsData = [
  { name: 'name', type: 'text', placeholder: 'Name' },
  { name: 'position', type: 'text', placeholder: 'Position' },
  { name: 'office', type: 'text', placeholder: 'Office' },
  { name: 'age', type: 'number', placeholder: 'Age' },
  { name: 'salary', type: 'number', placeholder: 'Salary' },
];

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

tbody.addEventListener('click', (eventClickTbody) => {
  eventClickTbody.preventDefault();

  const clickedRow = eventClickTbody.target.closest('tr');
  const activeRow = document.querySelector('.active');

  if (activeRow !== null) {
    activeRow.classList.remove('active');
  }

  if (!clickedRow) {
    return;
  }

  clickedRow.classList.add('active');
});

thead.addEventListener('click', (eventClickThead) => {
  eventClickThead.preventDefault();

  const rowsArrayData = Array.from(tbody.querySelectorAll('tr'));
  const title = eventClickThead.target.closest('th');
  const index = title.cellIndex;

  if (!title) {
    return;
  }

  if (index === activeColumnTitle) {
    activeColumnTitle = index;
    isAscending = !isAscending;
  } else {
    activeColumnTitle = index;
    isAscending = true;
  }

  rowsArrayData.sort((firstRow, secondRow) => {
    const firstValue = firstRow.cells[index].textContent;
    const secondValue = secondRow.cells[index].textContent;

    let result = 0;

    if (index === COLUMN_INDEX_AGE || index === COLUMN_INDEX_SALARY) {
      result = getSalaryValue(firstValue) - getSalaryValue(secondValue);
    } else {
      result = firstValue.localeCompare(secondValue);
    }

    return isAscending ? result : -result;
  });

  tbody.append(...rowsArrayData);
});

form.classList.add('new-employee-form');
button.textContent = 'Save to table';
button.type = 'submit';

inputsData.forEach((field) => {
  const input = document.createElement('input');
  const label = document.createElement('label');

  label.textContent = `${field.placeholder}:`;

  Object.assign(input, field);

  if (field.name === 'office') {
    const select = document.createElement('select');

    select.name = field.name;
    select.required = true;
    select.dataset.qa = field.name;

    const defaultOption = document.createElement('option');

    defaultOption.value = '';
    defaultOption.textContent = 'Choose city...';
    defaultOption.selected = true;
    select.append(defaultOption);

    cities.forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      select.append(option);
    });

    select.dataset.qa = field.name;
    label.append(select);
  } else {
    input.required = true;
    input.dataset.qa = field.name;
    label.append(input);
  }

  form.append(label);
});

form.append(button);
document.body.append(form);

form.addEventListener('submit', (eventSubmit) => {
  eventSubmit.preventDefault();

  const formData = new FormData(form);
  const inputName = formData.get('name');
  const inputPosition = formData.get('position');
  const inputOffice = formData.get('office');
  const inputAge = formData.get('age');
  const inputSalary = formData.get('salary');

  if (inputName.length < 4) {
    return showNotification('Name is too short', 'error');
  }

  if (inputPosition.length < 4) {
    return showNotification('Position is too short', 'error');
  }

  if (inputAge < 18 || inputAge > 90) {
    return showNotification('The age is incorrect', 'error');
  }

  if (!inputOffice) {
    return showNotification('Please select an office', 'error');
  }

  if (Number(inputSalary) <= 0) {
    return showNotification('Salary must be greater than 0', 'error');
  }

  const formattedSalary = formatter.format(inputSalary);

  const newRow = document.createElement('tr');

  const newEmployee = [
    inputName,
    inputPosition,
    inputOffice,
    inputAge,
    formattedSalary,
  ];

  newEmployee.forEach((input) => {
    const newCell = document.createElement('td');

    newCell.textContent = input;
    newRow.append(newCell);
  });

  tbody.append(newRow);

  showNotification('Employee successfully added', 'success');
  form.reset();
});

tbody.addEventListener('dblclick', (eventDblClick) => {
  eventDblClick.preventDefault();

  const targetCell = eventDblClick.target.closest('td');

  if (!targetCell) {
    return;
  }

  const activeInput = document.querySelector('.cell-input');

  if (activeInput) {
    return;
  }

  const input = document.createElement('input');
  const initialValue = targetCell.textContent;

  input.className = 'cell-input';
  input.value = initialValue;
  targetCell.textContent = '';
  targetCell.append(input);
  input.focus();

  input.addEventListener('blur', (eventBlur) => {
    eventBlur.preventDefault();

    finishEditing(input, targetCell, initialValue);
  });

  input.addEventListener('keydown', (eventKeydown) => {
    if (eventKeydown.key !== 'Enter') {
      return;
    }

    finishEditing(input, targetCell, initialValue);
  });
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.textContent = message;

  form.after(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function finishEditing(input, targetCell, initialValue) {
  if (input.value.length === 0) {
    targetCell.textContent = initialValue;
  } else if (targetCell.cellIndex === COLUMN_INDEX_SALARY) {
    const numericValue = getSalaryValue(input.value);

    targetCell.textContent = formatter.format(numericValue);
  } else {
    targetCell.textContent = input.value;
  }
}

function getSalaryValue(salaryString) {
  return Number(salaryString.replace(/[^0-9.-]+/g, ''));
}

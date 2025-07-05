'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');
let lastSortedTh = null;

// реалізація сортування і віділення активного ряду
table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD' || e.target.tagName === 'TR') {
    const row = e.target.closest('tr');

    rows.forEach((tr) => tr.classList.remove('active'));
    row.classList.add('active');
  }

  if (e.target.tagName === 'TH') {
    const th = e.target;

    let direction = 'asc';

    if (lastSortedTh === th) {
      direction = th.dataset.direction === 'asc' ? 'desc' : 'asc';
    }

    th.dataset.direction = direction;

    if (lastSortedTh && lastSortedTh !== th) {
      delete lastSortedTh.dataset.direction;
    }

    lastSortedTh = th;

    sortTable(th.cellIndex, th.dataset.type, direction);
  }
});

// функція сортування рядків
function sortTable(colNum, type, direction = 'asc') {
  const rowsArr = Array.from(tbody.rows);

  let compare;

  switch (type) {
    case 'number':
      compare = function (rowA, rowB) {
        const a =
          parseFloat(rowA.cells[colNum].innerHTML.replace(/[^\d.-]/g, '')) || 0;
        const b =
          parseFloat(rowB.cells[colNum].innerHTML.replace(/[^\d.-]/g, '')) || 0;

        return direction === 'asc' ? a - b : b - a;
      };
      break;
    case 'string':
    default:
      compare = function (rowA, rowB) {
        const a = rowA.cells[colNum].innerHTML;
        const b = rowB.cells[colNum].innerHTML;

        const result = a.localeCompare(b);

        return direction === 'asc' ? result : -result;
      };
      break;
  }

  rowsArr.sort(compare);

  tbody.append(...rowsArr);
}

// create form
const form = document.createElement('form');

form.classList.add('new-employee-form');

// write function for creating inputs inside labels
function createInputLabel(labelText, inputName, inputType, dataQa) {
  const label = document.createElement('label');

  label.textContent = labelText + ':';

  const input = document.createElement('input');

  input.name = inputName;
  input.type = inputType;
  input.setAttribute('data-qa', dataQa);

  label.appendChild(input);

  return label;
}

// create 4 inputs
const nameLabel = createInputLabel('Name', 'name', 'text', 'name');
const positionLabel = createInputLabel(
  'Position',
  'position',
  'text',
  'position',
);
const ageLabel = createInputLabel('Age', 'age', 'number', 'age');
const salaryLabel = createInputLabel('Salary', 'salary', 'number', 'salary');

// create select input
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', 'office');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const office of offices) {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  select.appendChild(option);
}

officeLabel.appendChild(select);

// create button
const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.append(
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
  submitBtn,
);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = ['name', 'position', 'office', 'age', 'salary'];
  const values = {};

  fields.forEach((field) => {
    values[field] = form.querySelector(`[data-qa="${field}"]`).value.trim();
  });

  for (const field of fields) {
    if (!values[field] || values[field] === '') {
      pushNotification(
        { top: 10, right: 40 },
        'Error',
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        'error',
      );

      return; // Зупиняємо виконання
    }
  }

  if (values.name.length < 4) {
    pushNotification(
      { top: 10, right: 40 },
      'Error',
      'should be more than 4',
      'error',
    );

    return;
  }

  if (values.age < 18 || values.age > 90) {
    pushNotification(
      { top: 10, right: 40 },
      'Error',
      'can not be less of 18 and more than 90',
      'error',
    );

    return;
  }

  const newEmployee = document.createElement('tr');

  Object.keys(values).forEach((key) => {
    const newCell = document.createElement('td');

    if (key === 'salary') {
      const salaryNum = Number(values.salary);

      newCell.textContent = '$' + salaryNum.toLocaleString('en-US');
    } else {
      newCell.textContent = values[key];
    }

    newEmployee.appendChild(newCell);
  });

  pushNotification(
    { top: 10, right: 40 },
    'Success',
    'Employee was added',
    'success',
  );

  tbody.appendChild(newEmployee);
  form.reset();
});

const pushNotification = (coordinates, title, description, type) => {
  const block = document.createElement('div');

  block.classList.add('notification');
  block.setAttribute('data-qa', 'notification');
  block.classList.add(type);
  block.style.top = coordinates.top + 'px';
  block.style.right = coordinates.right + 'px';

  const blockTitle = document.createElement('h2');

  blockTitle.classList.add('title');
  blockTitle.textContent = title;

  const blockDecription = document.createElement('p');

  blockDecription.textContent = description;

  document.body.appendChild(block);
  block.appendChild(blockTitle);
  block.appendChild(blockDecription);

  setTimeout(() => {
    block.remove();
  }, 2000);
};

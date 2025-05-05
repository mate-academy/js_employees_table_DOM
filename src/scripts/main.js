'use strict';

// write code here
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

document.addEventListener('DOMContentLoaded', () => {
  const headers = table.querySelectorAll('th');

  const sortDirections = {};

  headers.forEach((header, colIndex) => {
    sortDirections[colIndex] = 'asc';

    header.addEventListener('click', () => {
      const rowsArray = Array.from(tbody.querySelectorAll('tr'));
      const direction = sortDirections[colIndex];
      const multiplier = direction === 'asc' ? 1 : -1;

      rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.children[colIndex].textContent.trim();
        const cellB = rowB.children[colIndex].textContent.trim();

        const a = parseCellValue(cellA);
        const b = parseCellValue(cellB);

        if (a < b) {
          return -1 * multiplier;
        }

        if (a > b) {
          return 1 * multiplier;
        }

        return 0;
      });

      rowsArray.forEach((row) => tbody.appendChild(row));

      sortDirections[colIndex] = direction === 'asc' ? 'desc' : 'asc';
    });
  });

  function parseCellValue(val) {
    if (val.startsWith('$')) {
      return parseFloat(val.replace(/[^0-9.-]+/g, ''));
    }

    if (!Number.isNaN(parseFloat(val))) {
      return parseFloat(val);
    }

    return val.toLowerCase();
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.classList.add('notification', type);
  div.setAttribute('data-qa', 'notification');

  const msgTitle = document.createElement('h2');

  msgTitle.classList.add('title');
  msgTitle.textContent = title;

  const msgDescription = document.createElement('p');

  msgDescription.textContent = description;

  div.appendChild(msgTitle);
  div.appendChild(msgDescription);

  div.style.position = 'absolute';
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

const form = document.createElement('form');

form.classList.add('new-employee-form');

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.type = 'text';
nameInput.name = 'name';
nameInput.setAttribute('data-qa', 'name');

nameLabel.appendChild(nameInput);

const posLabel = document.createElement('label');

posLabel.textContent = 'Position: ';

const posInput = document.createElement('input');

posInput.type = 'text';
posInput.name = 'position';
posInput.setAttribute('data-qa', 'position');

posLabel.appendChild(posInput);

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((city) => {
  const option = document.createElement('option');

  option.value = city.toLowerCase().replace(/\s/g, '-');
  option.textContent = city;
  officeSelect.appendChild(option);
});

officeLabel.appendChild(officeSelect);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.type = 'number';
ageInput.name = 'age';
ageInput.setAttribute('data-qa', 'age');

ageLabel.appendChild(ageInput);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.type = 'number';
salaryInput.name = 'salary';
salaryInput.setAttribute('data-qa', 'salary');

salaryLabel.appendChild(salaryInput);

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.append(nameLabel, posLabel, officeLabel, ageLabel, salaryLabel, submitBtn);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const workerName = nameInput.value.trim();
  const position = posInput.value.trim();
  const office = officeSelect.options[officeSelect.selectedIndex].text;
  const age = ageInput.valueAsNumber;
  const salary = Number(salaryInput.value);

  if (workerName.length < 4) {
    pushNotification(
      40,
      40,
      'Invalid Name',
      'Name must be at least 4 characters',
      'error',
    );

    return;
  }

  if (position.length < 4) {
    pushNotification(
      40,
      40,
      'Invalid Position',
      'Position must be at least 4 characters',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90 || Number.isNaN(age)) {
    pushNotification(
      40,
      40,
      'Invalid Age',
      'Age must be between 18 and 90',
      'error',
    );

    return;
  }

  if (Number.isNaN(salary) || salary <= 0) {
    pushNotification(
      40,
      40,
      'Invalid Salary',
      'Salary must be a positive number',
      'error',
    );

    return;
  }

  const row = document.createElement('tr');

  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  [workerName, position, office, age, formattedSalary].forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    row.appendChild(td);
  });

  tbody.appendChild(row);

  pushNotification(
    40,
    40,
    'Success',
    'New employee added to the table',
    'success',
  );

  form.reset();
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => {
    row.classList.remove('active');
  });

  clickedRow.classList.add('active');
});

let activeInput = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || activeInput) {
    return;
  }

  const row = cell.parentElement;
  const cells = Array.from(row.children);
  const cellIndex = cells.indexOf(cell);

  const initialValue = cell.textContent.trim();

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;
  cell.appendChild(input);
  input.focus();

  activeInput = input;

  const finishEdit = () => {
    let newValue = input.value.trim();

    if ((cellIndex === 0 || cellIndex === 1) && newValue.length < 4) {
      newValue = initialValue;
    }

    if (cellIndex === 3) {
      const num = Number(newValue);

      if (isNaN(num) || num < 18 || num > 90) {
        newValue = initialValue;
      }
    }

    if (cellIndex === 4) {
      const num = Number(newValue.replace(/[^0-9.-]+/g, ''));

      if (isNaN(num) || num <= 0) {
        newValue = initialValue;
      } else {
        newValue = `$${num.toLocaleString('en-US')}`;
      }
    }

    if (newValue === '') {
      newValue = initialValue;
    }

    cell.textContent = newValue;
    activeInput = null;
  };

  input.addEventListener('blur', finishEdit);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      finishEdit();
    }
  });
});

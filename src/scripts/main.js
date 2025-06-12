'use strict';

const head = document.querySelector('table thead');
const body = document.querySelector('table tbody');

let employeesArr = [];

// Sorting functionality
function extractEmployees() {
  const tr = body.querySelectorAll('tr');

  employeesArr = [];

  tr.forEach((row) => {
    const cells = row.querySelectorAll('td');

    employeesArr.push({
      name: cells[0].textContent,
      position: cells[1].textContent,
      office: cells[2].textContent,
      age: +cells[3].textContent,
      salary: Number(cells[4].textContent.slice(1).replace(/,/g, '')),
    });
  });
}

extractEmployees();

function renderTable(data) {
  body.innerHTML = '';

  data.forEach((emp) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.position}</td>
      <td>${emp.office}</td>
      <td>${emp.age}</td>
      <td>$${emp.salary.toLocaleString('en-US')}</td>
    `;

    body.appendChild(row);
  });
}

let sortDirection = 1;

head.querySelectorAll('th').forEach((title, index) => {
  title.addEventListener('click', () => {
    const keys = ['name', 'position', 'office', 'age', 'salary'];
    const key = keys[index];

    employeesArr.sort((a, b) => {
      if (typeof a[key] === 'number') {
        return (a[key] - b[key]) * sortDirection;
      } else {
        return a[key].localeCompare(b[key]) * sortDirection;
      }
    });

    sortDirection *= -1;
    renderTable(employeesArr);
  });
});

// Select row
body.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  body.querySelectorAll('tr').forEach((row) => {
    row.classList.remove('active');
  });

  clickedRow.classList.add('active');
});

// Create form to add new employee
const form = document.createElement('form');

form.classList.add('new-employee-form');

const inputName = addInput('text', 'name', 'data-qa', 'Name:');

form.appendChild(inputName);

const inputPosition = addInput('text', 'position', 'data-qa', 'Position:');

form.appendChild(inputPosition);

const inputOffice = addInput('select', 'office', 'data-qa', 'Office:', [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
]);

form.appendChild(inputOffice);

const inputAge = addInput('number', 'age', 'data-qa', 'Age:');

form.appendChild(inputAge);

const inputSalary = addInput('number', 'salary', 'data-qa', 'Salary:');

form.appendChild(inputSalary);

const button = document.createElement('button');

button.textContent = 'Save to table';
form.appendChild(button);

function addInput(type, nameOfInput, atribute, labelText = '', options = []) {
  let input;

  if (type === 'select') {
    input = document.createElement('select');
    input.name = nameOfInput;

    options.forEach((opt) => {
      const option = document.createElement('option');

      option.value = opt;
      option.textContent = opt;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = type;
    input.name = nameOfInput;
    input.required = true;
    input.setAttribute(atribute, nameOfInput);
  }

  if (labelText) {
    const label = document.createElement('label');

    label.textContent = labelText;
    label.appendChild(input);

    return label;
  }

  return input;
}

// Add new row to the table
button.addEventListener('click', (e) => {
  e.preventDefault();

  const naming = inputName.querySelector('input').value;
  const position = inputPosition.querySelector('input').value;
  const office = inputOffice.querySelector('select').value;
  const age = inputAge.querySelector('input').value;
  const salary = Number(inputSalary.querySelector('input').value);

  const formattedSalary = `$${salary.toLocaleString()}`;

  const errors = [];

  if (naming.length < 4) {
    errors.push('Name must be more than 4 symbols');
  }

  if (+age < 18 || +age > 90) {
    errors.push('Age must be between 18 and 90');
  }

  if (errors.length > 0) {
    pushNotification(
      'Title of Error message',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');

  [naming, position, office, age, formattedSalary].forEach((val) => {
    const td = document.createElement('td');

    td.textContent = val;
    newRow.appendChild(td);
  });

  body.appendChild(newRow);

  employeesArr.push({
    name: naming,
    position,
    office,
    age: +age,
    salary,
  });
  renderTable(employeesArr);

  form.reset();

  pushNotification(
    'Title of Success message',
    'Message example.\n ' +
      'Notification should contain title and description.',
    'success',
  );
});

document.body.appendChild(form);

// Add notification
const pushNotification = (title, description, type) => {
  const block = document.createElement('div');

  block.classList.add('notification', type);
  block.setAttribute('data-qa', 'notification');

  const titleEl = document.createElement('h2');

  titleEl.classList.add('title');
  titleEl.textContent = title;
  block.appendChild(titleEl);

  const descriptionEl = document.createElement('p');

  descriptionEl.classList.add('description');
  descriptionEl.textContent = description;
  block.appendChild(descriptionEl);

  document.body.appendChild(block);

  setTimeout(() => {
    block.style.display = 'none';
  }, 2000);
};

// Edit cell
body.addEventListener('dblclick', (ev) => {
  const clickedCell = ev.target.closest('td');

  if (!clickedCell) {
    return;
  }

  const currentText = clickedCell.textContent;
  const tr = clickedCell.parentElement;
  const rowIndex = Array.from(body.children).indexOf(tr);
  const colIndex = Array.from(tr.children).indexOf(clickedCell);


  const editInput = document.createElement('input');

  editInput.type = 'text';
  editInput.value = currentText;
  editInput.style.width = '100%';
  editInput.classList.add('cell-input');

  clickedCell.textContent = '';
  clickedCell.appendChild(editInput);
  editInput.focus();

  const save = () => {
    const newValue = editInput.value.trim() || currentText;

    clickedCell.textContent = newValue;

    const keys = ['name', 'position', 'office', 'age', 'salary'];
    const key = keys[colIndex];

    if (key === 'age' || key === 'salary') {
      employeesArr[rowIndex][key] = Number(newValue.replace(/[^0-9.-]+/g,"")) || employeesArr[rowIndex][key];
    } else {
      employeesArr[rowIndex][key] = newValue;
    }
  };

  editInput.addEventListener('blur', save);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      editInput.blur();
    } else if (e.key === 'Escape') {
      clickedCell.textContent = currentText;
    }
  });
});

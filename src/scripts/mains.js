'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

let lastSortedColumn = null;
let sortDirection = 'asc';

thead.addEventListener('click', (elem) => {
  if (elem.target.tagName === 'TH') {
    const columnIndex = elem.target.cellIndex;

    if (lastSortedColumn === columnIndex) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection = 'asc';
    }

    lastSortedColumn = columnIndex;

    const rows = Array.from(tbody.rows);

    const sorted = rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent.trim();
      const cellB = rowB.cells[columnIndex].textContent.trim();

      const compareResult = cellA.localeCompare(cellB, 'uk', { numeric: true });

      return sortDirection === 'asc' ? compareResult : -compareResult;
    });

    tbody.innerHTML = '';
    sorted.forEach((row) => tbody.appendChild(row));
  }
});

tbody.addEventListener('click', (even) => {
  const row = even.target.closest('tr');

  if (row) {
    const rowsTr = tbody.querySelectorAll('tr');

    rowsTr.forEach((rows) => rows.classList.remove('active'));
    row.classList.add('active');
  }
});

function createLabel(labelText, inputType, inputName, InputData) {
  const label = document.createElement('label');

  label.textContent = labelText;
  label.setAttribute('for', inputName);

  const input = document.createElement('input');

  input.setAttribute('type', inputType);
  input.setAttribute('name', inputName);
  input.setAttribute('data-qa', InputData);
  input.setAttribute('required', '');

  label.appendChild(input);

  return label;
}

function createEmployeeForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const office = document.createElement('label');

  office.textContent = 'office';
  office.setAttribute('for', 'office');

  const officeSelection = document.createElement('select');

  officeSelection.setAttribute('name', 'office');
  officeSelection.setAttribute('data-qa', 'office');
  officeSelection.setAttribute('required', '');

  const cities = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  cities.forEach((city) => {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;
    officeSelection.appendChild(option);
  });

  office.appendChild(officeSelection);

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  form.appendChild(createLabel('Name', 'text', 'name', 'name'));
  form.appendChild(createLabel('Position', 'text', 'position', 'position'));
  form.appendChild(office);
  form.appendChild(createLabel('Age', 'number', 'age', 'age'));
  form.appendChild(createLabel('Salary', 'number', 'salary', 'salary'));
  form.appendChild(button);

  document.body.appendChild(form);

  button.addEventListener('click', (elemForm) => {
    elemForm.preventDefault();

    const names = form.querySelector('[name="name"]').value.trim();
    const position = form.querySelector('[name="position"]').value;
    const offices = form.querySelector('[name="office"]').value;
    const age = form.querySelector('[name="age"]').value;
    const salary = form.querySelector('[name="salary"]').value;

    if (names.length < 4) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'Name must be at least 4 characters long!',
        'error',
      );

      return;
    }

    if (position.length < 4) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'Position cannot be empty.',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'Age must be between 18 and 90!.',
        'error',
      );

      return;
    }

    if (salary < 50) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'The salary cannot be less 50$.',
        'error',
      );

      return;
    }

    const row = document.createElement('tr');
    const formattedSalary = new Intl.NumberFormat('en-US').format(salary);

    row.innerHTML = `
      <td>${names}</td>
      <td>${position}</td>
      <td>${offices}</td>
      <td>${age}</td>
      <td>${`$${formattedSalary}`}</td>
    `;
    tbody.appendChild(row);
    form.reset();

    pushNotification(
      10,
      10,
      'Title of Success message',
      'Message example.\n ' + 'Employee successfully added.',
      'success',
    );
  });
}

createEmployeeForm();

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.classList = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  div.appendChild(h2);
  div.appendChild(p);

  div.style.position = 'absolute';
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

tbody.addEventListener('dblclick', function (element) {
  const cell = element.target;

  if (cell.querySelector('input')) {
    return;
  }

  const currentText = cell.textContent.trim();

  if (currentText.length <= 0) {
    return;
  }

  cell.innerHTML = `<input class="cell-input" value="">`;

  const inputField = cell.querySelector('input');

  inputField.focus();

  function saveValue() {
    const newValue = inputField.value.trim();

    if (newValue === '') {
      cell.textContent = currentText;
    } else {
      cell.textContent = newValue;
    }
  }
  inputField.addEventListener('blur', saveValue);

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveValue();
      inputField.blur();
    }
  });
});

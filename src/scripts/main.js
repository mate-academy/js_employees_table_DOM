'use strict';

const table = document.querySelector('table');
const tBody = table.tBodies[0];
let activeRow = null;

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const currentSort = {
  column: null,
  direction: 'asc',
};

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (th) {
    const columnIndex = th.cellIndex;

    if (currentSort.column === columnIndex) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = columnIndex;
      currentSort.direction = 'asc';
    }

    sortTable(table, columnIndex, currentSort.direction);
  }

  const tr = e.target.closest('tbody tr');

  if (tr) {
    if (activeRow) {
      activeRow.classList.remove('active');
    }
    tr.classList.add('active');
    activeRow = tr; // Store reference to the new active row
  }
});

function sortTable(tableToSort, columnIndex, direction = 'asc') {
  const tBodyToSort = tableToSort.tBodies[0];
  const rows = Array.from(tBody.rows);

  rows.sort((rowA, rowB) => {
    const valA = rowA.cells[columnIndex].textContent.trim();
    const valB = rowB.cells[columnIndex].textContent.trim();

    const numA = parseFloat(valA.replace(/[^0-9.]/g, ''));
    const numB = parseFloat(valB.replace(/[^0-9.]/g, ''));

    let compare = 0;

    if (!isNaN(numA) && !isNaN(numB)) {
      compare = numA - numB;
    } else {
      compare = valA.localeCompare(valB);
    }

    return direction === 'asc' ? compare : -compare;
  });

  tBodyToSort.innerHTML = '';
  rows.forEach((row) => tBody.appendChild(row));
}

function addForm() {
  const body = document.querySelector('body');

  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  const nameInput = createLabelWithInput('text', 'name');
  const positionInput = createLabelWithInput('text', 'position');
  const officeSelect = createLabelWithInput('select', 'office', offices);
  const ageInput = createLabelWithInput('number', 'age');
  const salaryInput = createLabelWithInput('number', 'salary');

  newForm.append(nameInput);
  newForm.append(positionInput);
  newForm.append(officeSelect);
  newForm.append(ageInput);
  newForm.append(salaryInput);

  const button = createSubmitButton('Save to table');

  newForm.append(button);

  body.append(newForm);
}

function createLabelWithInput(fieldType, content, options = []) {
  const label = document.createElement('label');

  label.textContent = `${content.charAt(0).toUpperCase() + content.slice(1).toLowerCase()}:`;

  let field;

  if (fieldType === 'select') {
    field = document.createElement('select');

    options.forEach((opt) => {
      const option = document.createElement('option');

      option.value = opt;
      option.textContent = opt;
      field.appendChild(option);
    });
  } else {
    field = document.createElement('input');
    field.type = fieldType;
  }

  field.setAttribute('data-qa', `${content.toLowerCase()}`);
  field.setAttribute('name', `${content.toLowerCase()}`);
  field.required = true;

  label.append(field);

  return label;
}

function createSubmitButton(buttonTextContent) {
  const button = document.createElement('button');

  button.textContent = buttonTextContent;

  return button;
}

addForm();

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = form.querySelector('[name="name"]').value;
  const position = form.querySelector('[name="position"]').value;
  const office = form.querySelector('[name="office"]').value;
  const age = Number(form.querySelector('[name="age"]').value);
  const salaryRaw = Number(form.querySelector('[name="salary"]').value);

  if (userName.length < 4) {
    showNotification('Name must be at least 4 letters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const salary = `$${salaryRaw.toLocaleString('us')}`;

  const tr = document.createElement('tr');

  [userName, position, office, age, salary].forEach((val) => {
    const td = document.createElement('td');

    td.textContent = val;
    tr.append(td);
  });

  tBody.append(tr);

  showNotification('Employee successfully added!', 'success');
  form.reset();
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);
  notification.textContent = message;

  document.body.append(notification);
  setTimeout(() => notification.remove(), 3000);
}

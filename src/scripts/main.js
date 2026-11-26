'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row || !tbody.contains(row)) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const cellIndex = th.cellIndex;
  const isAscending = th.classList.contains('asc');

  thead.querySelectorAll('th').forEach((header) => {
    header.classList.remove('asc', 'desc');
  });

  if (isAscending) {
    th.classList.add('desc');
  } else {
    th.classList.add('asc');
  }

  const rows = Array.from(tbody.rows);

  rows.sort((rowA, rowB) => {
    const textA = rowA.cells[cellIndex].textContent.trim();
    const textB = rowB.cells[cellIndex].textContent.trim();

    return !isAscending
      ? textA.localeCompare(textB, 'en', { numeric: true })
      : textB.localeCompare(textA, 'en', { numeric: true });
  });

  tbody.append(...rows);
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const titleElement = document.createElement('h2');

  titleElement.className = 'title';
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');

  descriptionElement.className = 'description';
  descriptionElement.textContent = description;

  notification.append(titleElement, descriptionElement);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.noValidate = true;

function createInputField(labelText, fullName, type) {
  const label = document.createElement('label');

  label.textContent = `${labelText}: `;

  const input = document.createElement('input');

  input.name = fullName;
  input.type = type;
  input.dataset.qa = fullName;

  label.append(input);

  return label;
}

const nameField = createInputField('Name', 'name', 'text');
const positionField = createInputField('Position', 'position', 'text');
const ageField = createInputField('Age', 'age', 'number');
const salaryField = createInputField('Salary', 'salary', 'number');

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';

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

  option.value = city;
  option.textContent = city;
  officeSelect.append(option);
});
officeLabel.append(officeSelect);

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.append(
  nameField,
  positionField,
  officeLabel,
  ageField,
  salaryField,
  submitBtn,
);
document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fullName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const age = Number(form.elements.age.value);

  if (form.elements.salary.value === '') {
    form.elements.salary.value = 0;
  }

  const rawSalary = Number(form.elements.salary.value);

  if (fullName.length < 4 || !position || !age || age < 18 || age > 90) {
    pushNotification(20, 20, 'Error', 'Invalid data provided', 'error');

    return;
  }

  const formattedSalary = `$${rawSalary.toLocaleString('en-US')}`;

  const tr = document.createElement('tr');
  const rowData = [fullName, position, office, age, formattedSalary];

  rowData.forEach((data) => {
    const td = document.createElement('td');

    td.textContent = data;
    tr.append(td);
  });

  tbody.append(tr);

  pushNotification(20, 20, 'Success', 'Employee added successfully', 'success');
  form.reset();
});

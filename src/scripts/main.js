'use strict';

const tbody = document.querySelector('tbody');
const th = document.querySelector('thead tr');

tbody.addEventListener('click', (e) => {
  const rowClicked = e.target.closest('tr');

  if (!rowClicked) {
    return;
  }

  const previousActive = tbody.querySelector('tr.active');

  if (previousActive && previousActive !== rowClicked) {
    previousActive.classList.remove('active');
  }

  rowClicked.classList.add('active');
});

let sortDirection = 'asc';
let currentColumn = -1;

th.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const rows = [...tbody.querySelectorAll('tr')];
  const index = e.target.cellIndex;

  if (currentColumn === index) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentColumn = index;
    sortDirection = 'asc';
  }

  rows.sort((a, b) => {
    const first = a.cells[index].textContent;
    const second = b.cells[index].textContent;

    const fn = first.replace('$', '').replaceAll(',', '');
    const sn = second.replace('$', '').replaceAll(',', '');

    if (!isNaN(fn) && !isNaN(sn)) {
      return sortDirection === 'asc'
        ? Number(fn) - Number(sn)
        : Number(sn) - Number(fn);
    }

    return sortDirection === 'asc'
      ? first.localeCompare(second)
      : second.localeCompare(first);
  });

  tbody.append(...rows);
});

const form = document.createElement('form');

const labelName = document.createElement('label');
const inputName = document.createElement('input');

form.className = 'new-employee-form ';

labelName.textContent = 'Name: ';
inputName.name = 'name';
inputName.type = 'text';
inputName.dataset.qa = 'name';

form.append(labelName);
labelName.append(inputName);

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

labelPosition.textContent = 'Position: ';
inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.dataset.qa = 'position';

form.append(labelPosition);
labelPosition.append(inputPosition);

const labelOffice = document.createElement('label');
const selectOffice = document.createElement('select');

labelOffice.textContent = 'Office: ';
selectOffice.name = 'office';
selectOffice.dataset.qa = 'office';

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  selectOffice.append(option);
});

form.append(labelOffice);
labelOffice.append(selectOffice);

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

labelAge.textContent = 'Age: ';
inputAge.name = 'age';
inputAge.type = 'number';
inputAge.dataset.qa = 'age';

form.append(labelAge);
labelAge.append(inputAge);

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

labelSalary.textContent = 'Salary: ';
inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.dataset.qa = 'salary';

form.append(labelSalary);
labelSalary.append(inputSalary);

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.append(button);
document.body.append(form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const titleElement = document.createElement('h2');

  titleElement.className = 'title';
  titleElement.textContent = title;
  notification.appendChild(titleElement);

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;
  notification.appendChild(descriptionElement);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameVal = inputName.value.trim();
  const positionVal = inputPosition.value.trim();
  const officeVal = selectOffice.value;
  const ageVal = Number(inputAge.value);
  const salaryVal = Number(inputSalary.value);

  if (
    !nameVal ||
    !positionVal ||
    !officeVal ||
    isNaN(ageVal) ||
    isNaN(salaryVal)
  ) {
    pushNotification(
      10,
      10,
      'Validation error',
      'All fields are required.',
      'error',
    );

    return;
  }

  if (nameVal.length < 4) {
    pushNotification(
      10,
      10,
      'Validation error',
      'Name must have at least 4 letters.',
      'error',
    );

    return;
  }

  if (ageVal < 18 || ageVal > 90) {
    pushNotification(
      10,
      10,
      'Validation error',
      'Age must be between 18 and 90.',
      'error',
    );

    return;
  }

  if (tbody) {
    const newRow = document.createElement('tr');

    const formattedSalary = '$' + Number(salaryVal).toLocaleString('en-US');

    const cells = [
      nameVal,
      positionVal,
      officeVal,
      ageVal,
      `${formattedSalary}`,
    ];

    cells.forEach((text) => {
      const td = document.createElement('td');

      td.textContent = text;
      newRow.append(td);
    });
    tbody.append(newRow);
  }

  pushNotification(
    10,
    10,
    'Success',
    'New employee successfully added.',
    'success',
  );

  form.reset();
});

let activateInput = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (activateInput) {
    activateInput.blur();
  }

  const inputEdit = document.createElement('input');
  const textNow = cell.textContent;

  inputEdit.className = 'cell-input';
  inputEdit.value = textNow;
  cell.textContent = '';
  cell.append(inputEdit);
  inputEdit.focus();

  activateInput = inputEdit;

  function save() {
    const newVal = inputEdit.value.trim();

    cell.textContent = newVal || textNow;

    activateInput = null;
  }

  inputEdit.addEventListener('blur', save);

  inputEdit.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      inputEdit.blur();
    }
  });
});

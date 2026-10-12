'use strict';

// Implement table sorting by clicking on the title (in two directions)

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

let previousColumnIndex;
let direction;

tableHead.addEventListener('click', (e) => {
  const clickedHeader = e.target.closest('th');
  const clickedHeaderText = clickedHeader.textContent;

  if (!clickedHeader) {
    return;
  }

  const bodyRows = [...tableBody.rows];
  const columnIndex = clickedHeader.cellIndex;

  if (columnIndex !== previousColumnIndex) {
    direction = 1;
  } else {
    direction *= -1;
  }

  previousColumnIndex = columnIndex;

  bodyRows.sort((firstRow, secondRow) => {
    const firstData = firstRow.cells[columnIndex].textContent;
    const secondData = secondRow.cells[columnIndex].textContent;

    const firstDataNormalized = Number(firstData.replace(/[^\d]/g, ''));
    const secondDataNormalized = Number(secondData.replace(/[^\d]/g, ''));

    if (clickedHeaderText === 'Age' || clickedHeaderText === 'Salary') {
      return (firstDataNormalized - secondDataNormalized) * direction;
    }

    return firstData.localeCompare(secondData) * direction;
  });

  tableBody.append(...bodyRows);
});

// When the user clicks on a row, it should become selected.

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  [...tableBody.rows].forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});

// Write a script to add a form to the document.

// The form should have class new-employee-form (to apply correct styles).

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');

newForm.noValidate = true;

// The form should have: 4 inputs: name, position, age, and salary
// <label>Name: <input name="name" type="text"></label>
// Add qa attributes for each input field:

function addInputs(inputName) {
  const input = document.createElement('input');
  const inputLabel = document.createElement('label');

  input.type =
    inputName === 'age' || inputName === 'salary' ? 'number' : 'text';
  input.name = inputName;
  input.dataset.qa = inputName;
  input.required = true;

  inputLabel.textContent = `${inputName[0].toUpperCase() + inputName.slice(1)}:`;

  inputLabel.append(input);
  newForm.append(inputLabel);
}

addInputs('name');
addInputs('position');
addInputs('age');
addInputs('salary');

// 1 select: office
// 6 options: Tokyo, Singapore, London, New York, Edinburgh, San Francisco

const select = document.createElement('select');

select.name = 'office';
select.dataset.qa = 'office';
select.required = true;

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  select.add(new Option(office, office));
});

const label = document.createElement('label');

label.textContent = 'Office:';
label.append(select);

newForm.elements.age.parentElement.before(label);

// Submit button.

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

newForm.append(submitButton);

document.body.append(newForm);

// Click on Save to table should run validation for form inputs.
// Notification titles and descriptions are up to you.
// Add qa attribute for notification: data-qa="notification"
// and class error/success depending on the result.

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  const titleElement = document.createElement('h2');

  titleElement.classList.add('title');
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;

  message.append(titleElement, descriptionElement);

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

// If the Name value has fewer than 4 letters, show error notification.
// If the Age value is less than 18 or more than 90, show an error notification.
// If a new employee is successfully added to the table, success notification.

newForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(newForm);

  if (!formData.get('position').trim()) {
    pushNotification(10, 10, 'Position error', 'Position is required', 'error');

    return;
  }

  if (formData.get('name').length < 4) {
    pushNotification(
      10,
      10,
      'Name error',
      'The name should contain more than 3 letters',
      'error',
    );

    return;
  }

  if (formData.get('age') < 18 || formData.get('age') > 90) {
    pushNotification(
      10,
      10,
      'Age error',
      'The age should not be less than 18 or more than 90',
      'error',
    );

    return;
  }

  // Click on Save to table; you should add a new employee to the table.
  // Don't forget to convert the string from the salary input to correct value

  const newRow = document.createElement('tr');

  formData.forEach((value, key) => {
    const newData = document.createElement('td');

    let normalizedValue = value;

    if (key === 'salary') {
      normalizedValue = `$${Number(value).toLocaleString('en-US')}`;
    }

    newData.textContent = normalizedValue;

    newRow.append(newData);
  });

  tableBody.append(newRow);

  pushNotification(
    10,
    10,
    'Successfully added',
    'The new employee has been successfully added',
    'success',
  );

  newForm.reset();
});

// Implement editing of table cells by double-clicking on them (optional).

tableBody.addEventListener('dblclick', (e) => {
  const dataCell = e.target.closest('td');

  if (!dataCell) {
    return;
  }

  if (document.querySelector('.cell-input')) {
    return;
  }

  const previousValue = dataCell.textContent;

  dataCell.textContent = '';

  const newInput = document.createElement('input');

  newInput.value = previousValue;

  newInput.classList.add('cell-input');

  dataCell.append(newInput);

  newInput.focus();

  newInput.onblur = () => {
    newInput.replaceWith(newInput.value.trim() || previousValue);
  };

  newInput.onkeydown = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      newInput.blur();
    }
  };
});

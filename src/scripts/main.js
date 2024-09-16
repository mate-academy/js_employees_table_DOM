'use strict';

const table = document.querySelector('table');
const headers = table.tHead.querySelectorAll('th');
const rows = table.tBodies[0].querySelectorAll('tr');

let currentSortColumn = null;
let isASC = true;

// sort section
headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (index === currentSortColumn) {
      isASC = !isASC;
    } else {
      currentSortColumn = index;
      isASC = true;
    }

    sortTable(header, isASC);
  });
});

function sortTable(column, sortedASC) {
  const rowsToSort = Array.from(table.tBodies[0].querySelectorAll('tr'));

  rowsToSort.sort((a, b) => {
    const aValue = a.cells[column.cellIndex].textContent;
    const bValue = b.cells[column.cellIndex].textContent;
    const aNumber = convertToNumber(aValue);
    const bNumber = convertToNumber(bValue);

    if (!aNumber) {
      return sortedASC
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortedASC
      ? aNumber - bNumber
      : bNumber - aNumber;
  });

  table.tBodies[0].append(...rowsToSort);
}

function convertToNumber(number) {
  return parseFloat(number.replace(/[$,]/g, ''));
}

// select the row section
rows.forEach(row => {
  row.addEventListener('click', () => {
    rows.forEach(everyRow => {
      everyRow.classList.remove('active');
    });

    row.classList.add('active');
  });
});

// create the form to add empoyees
const formToAddRow = document.createElement('form');

createForm(formToAddRow);

function createForm(form) {
  document.body.appendChild(form);
  form.classList = 'new-employee-form';

  const nameLabel = document.createElement('label');
  const nameInput = document.createElement('input');

  nameLabel.textContent = 'Name:';
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.setAttribute('data-qa', 'name');
  nameLabel.append(nameInput);

  const positionLabel = document.createElement('label');
  const positionInput = document.createElement('input');

  positionLabel.textContent = 'Position:';
  positionInput.type = 'text';
  positionInput.name = 'position';
  positionInput.setAttribute('data-qa', 'position');
  positionLabel.append(positionInput);

  const officeLabel = document.createElement('label');
  const officeSelect = document.createElement('select');
  const selectValues = [
    'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
  ];

  for (const value of selectValues) {
    const option = document.createElement('option');

    option.value = value;
    option.text = value;
    officeSelect.appendChild(option);
  }

  officeSelect.name = 'office';
  officeSelect.setAttribute('data-qa', 'office');
  officeLabel.textContent = 'Office:';
  officeLabel.append(officeSelect);

  const ageLabel = document.createElement('label');
  const ageInput = document.createElement('input');

  ageLabel.textContent = 'Age:';
  ageInput.type = 'number';
  ageInput.name = 'age';
  ageInput.setAttribute('data-qa', 'age');
  ageLabel.append(ageInput);

  const salaryLabel = document.createElement('label');
  const salaryInput = document.createElement('input');

  salaryLabel.textContent = 'Salary:';
  salaryInput.type = 'number';
  salaryInput.name = 'salary';
  salaryInput.setAttribute('data-qa', 'salary');
  salaryLabel.append(salaryInput);

  const button = document.createElement('button');

  button.type = 'submit';
  button.name = 'button';
  button.textContent = 'Save to table';

  form.append(nameLabel);
  form.append(positionLabel);
  form.append(officeLabel);
  form.append(ageLabel);
  form.append(salaryLabel);
  form.append(button);
}

// add the new row in table
formToAddRow.addEventListener('submit', e => {
  e.preventDefault();
  // console.log(e.target.elements);

  if (formValidation(e.target)) {
    const newRow = table.tBodies[0].insertRow();
    const nameCell = newRow.insertCell();
    const positinCell = newRow.insertCell();
    const officeCell = newRow.insertCell();
    const ageCell = newRow.insertCell();
    const salatyCell = newRow.insertCell();

    nameCell.innerHTML = e.target.elements.name.value;
    positinCell.innerHTML = e.target.elements.position.value;
    officeCell.innerHTML = e.target.elements.office.value;
    ageCell.innerHTML = e.target.elements.age.value;
    salatyCell.innerHTML = convertToDollars(e.target.elements.salary.value);

    formToAddRow.reset();
  }
});

function convertToDollars(number) {
  return parseInt(number).toLocaleString('en-US', {
    style: 'currency', currency: 'USD',
  }).split('.')[0];
}

// form data validation
function formValidation(checkForm) {
  const ageValid = parseInt(checkForm.elements.age.value);
  const minAge = 18;
  const maxAge = 90;
  const nameValid = checkForm.elements.name.value;
  const minNameLength = 4;

  if (areFieldNotEmpty(checkForm.querySelectorAll('input')) === false) {
    pushNotification(
      10, 10, 'No empty fields',
      'All fields must be filled', 'error'
    );

    return false;
  }

  if (ageValid < minAge || ageValid > maxAge) {
    pushNotification(
      10, 10, 'Incorect age',
      'Age should be more than 18 and less then 90', 'error'
    );

    return false;
  }

  if (nameValid.length < minNameLength) {
    pushNotification(
      10, 10, 'Incorect name', 'Name should contain at least 4 symbols', 'error'
    );

    return false;
  }

  pushNotification(
    10, 10, 'Employee added',
    'Employee was successfully added to the table', 'success'
  );

  return true;
}

function areFieldNotEmpty(inputs) {
  let isNotEmpty = true;

  inputs.forEach(input => {
    if (input.value.trim() === '') {
      isNotEmpty = false;
    }
  });

  return isNotEmpty;
}

// notifications constructor
const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');
  const message = document.createElement('div');

  body.appendChild(message);

  message.classList = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  const messageTitle = document.createElement('h2');

  message.appendChild(messageTitle);
  messageTitle.classList = 'title';
  messageTitle.innerText = title;

  const messageDesc = document.createElement('p');

  message.appendChild(messageDesc);
  messageDesc.innerText = description;

  setTimeout(() => {
    message.remove();
  }, 2000);
};

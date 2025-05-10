'use strict';

const body = document.querySelector('body');
const tHeadCells = document.querySelectorAll('table thead th');
const tbody = document.querySelector('table tbody');
const ageCellIndex = 3;
const salaryCellIndex = 4;
const adultAge = 18;
const maxAge = 90;

const officeOptions
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

employeeForm();

tHeadCells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    const receivedRows = sortByIdAndType(index);

    receivedRows.forEach(row => tbody.append(row));
  });
});

function sortByIdAndType(index) {
  const currentRows = [...tbody.querySelectorAll('tr')];
  const sortedRows = [...currentRows];

  sortedRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].innerText;
    const cellB = rowB.cells[index].innerText;

    return cellA.localeCompare(cellB, 'en', { numeric: true });
  });

  const currentRowsAsString
    = JSON.stringify(currentRows.map(row => row.innerText));
  const sortedRowsAsString
    = JSON.stringify(sortedRows.map(row => row.innerText));

  if (currentRowsAsString === sortedRowsAsString) {
    sortedRows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].innerText;
      const cellB = rowB.cells[index].innerText;

      return cellB.localeCompare(cellA, 'en', { numeric: true });
    });
  }

  return sortedRows;
}

// eslint-disable-next-line no-shadow
tbody.addEventListener('click', (event) => {
  if (event.target.parentElement.tagName !== 'TR') {
    return;
  }

  const activeClasses = tbody.querySelectorAll('.active');

  activeClasses.forEach((activeClass) => {
    activeClass.classList.remove('active');
  });

  event.target.parentElement.className = 'active';
});

// eslint-disable-next-line no-shadow
tbody.addEventListener('dblclick', (event) => {
  if (event.target.tagName !== 'TD') {
    return;
  }

  const row = [...document.querySelector('.active').children];

  const defaultValue = event.target.textContent.trim();

  let inputElement = document.createElement('input');

  if (row[2].textContent === event.target.textContent) {
    inputElement = createSelect('office', officeOptions);
  } else if (row[ageCellIndex].textContent === event.target.textContent) {
    inputElement.type = 'number';
    inputElement.min = '18';
    inputElement.max = '90';
    inputElement.style.width = ((defaultValue.length * 10) + 20) + 'px';
  } else {
    inputElement.type = 'text';
  }

  inputElement.classList.add('cell-input');
  inputElement.value = defaultValue;
  event.target.textContent = '';
  event.target.append(inputElement);
  inputElement.focus();

  inputElement.addEventListener('blur', () => {
    if (row[ageCellIndex].textContent === event.target.textContent) {
      if (inputElement.value < adultAge || inputElement.value > maxAge) {
        inputElement.value = '';
      }
    } else if (row[salaryCellIndex].textContent === event.target.textContent) {
      if (!inputElement.value.includes('$')
        || !inputElement.value.includes(',')
        || inputElement.value.length < 6
        || inputElement.value.length > 8) {
        inputElement.value = '';
      }
    }

    inputElement.parentElement.textContent
      = inputElement.value.trim() === '' ? defaultValue : inputElement.value;
  });

  // eslint-disable-next-line no-shadow
  inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (row[ageCellIndex].textContent === event.target.textContent) {
        if (inputElement.value < adultAge || inputElement.value > maxAge) {
          inputElement.value = '';
        }
      } else if (row[salaryCellIndex].textContent
        === event.target.textContent) {
        if (!inputElement.value.includes('$')
          || !inputElement.value.includes(',')
          || inputElement.value.length < 6
          || inputElement.value.length > 8) {
          inputElement.value = '';
        }
      }

      inputElement.parentElement.textContent
        = inputElement.value.trim() === '' ? defaultValue : inputElement.value;
    }
  });
});

function employeeForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const nameInput = createInput('name');

  createLabel('Name:', nameInput, form);

  const positionInput = createInput('position');

  createLabel('Position:', positionInput, form);

  const officeSelect = createSelect('office', officeOptions);

  createLabel('Office:', officeSelect, form);

  const ageInput = createInput('age', 'number');

  createLabel('Age:', ageInput, form);

  const salaryInput = createInput('salary', 'number');

  createLabel('Salary:', salaryInput, form);

  const saveButton = document.createElement('button');

  saveButton.type = 'submit';
  saveButton.textContent = 'Save to table';

  // eslint-disable-next-line no-shadow
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newEmployeeData = [...form.elements];
    const newRow = document.createElement('tr');
    let index = 0;
    const newRowData = {};

    newEmployeeData.forEach((element) => {
      if (element.tagName === 'BUTTON') {
        return;
      }

      const cell = document.createElement('td');

      if (element.tagName === 'SELECT') {
        cell.textContent = officeSelect.selectedOptions[0].innerText;
      }

      cell.textContent = element.name === 'salary'
        ? getSalary(element.value) : element.value;

      newRowData[tHeadCells[index].innerText.toLowerCase()] = cell.textContent;
      index++;
      newRow.append(cell);
    });

    if (formDataValidation(newRowData)) {
      tbody.append(newRow);
      form.reset();
    }
  });

  form.append(saveButton);
  body.append(form);
}

function createLabel(innerTextForLabel, inputElement, form) {
  const label = document.createElement('label');

  label.textContent = innerTextForLabel;
  label.append(inputElement);

  form.append(label);

  return label;
}

// eslint-disable-next-line no-shadow
function createInput(name, type = 'text') {
  const input = document.createElement('input');

  input.required = true;
  input.setAttribute('data-qa', name);
  input.name = name;
  input.type = type;

  if (type === 'number') {
    input.min = '0';
  }

  return input;
}

// eslint-disable-next-line no-shadow
function createSelect(name, options) {
  const select = document.createElement('select');

  select.name = name;
  select.setAttribute('data-qa', name);

  options.forEach((option) => {
    const optionHTML = document.createElement('option');

    optionHTML.value = option;
    optionHTML.textContent = option;
    select.append(optionHTML);
  });

  return select;
}

function getSalary(number) {
  return '$'
    + parseInt(number).toLocaleString('en-US');
}

function formDataValidation(newRowData) {
  let isCorrect = true;

  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');
  notification.style.textAlign = 'center';

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');

  const notificationMessage = document.createElement('p');

  const newEmployeeName = newRowData.name;
  const newEmployeeAge = newRowData.age;

  const minNameLength = newEmployeeName.length < 4;
  const minEmployeeAge = parseInt(newEmployeeAge, 10) < adultAge;
  const maxEmployeeAge = parseInt(newEmployeeAge, 10) > maxAge;

  if (minNameLength || minEmployeeAge || maxEmployeeAge) {
    if (minNameLength) {
      notification.classList.add('error');
      notificationTitle.textContent = 'Name length error';

      notificationMessage.textContent
        = 'Your name length should be more than 4 symbols';
    } else if (minEmployeeAge || maxEmployeeAge) {
      notification.classList.add('error');
      notificationTitle.textContent = 'Age error';
      notificationMessage.textContent = 'Your age can\'t be less than 18';

      if (maxEmployeeAge) {
        notification.classList.add('error');
        notificationMessage.textContent = 'Your age can\'t be more than 90';
      }
    }

    isCorrect = false;
  } else {
    notification.classList.add('success');
    notificationTitle.textContent = 'Success';
    notificationMessage.textContent = 'Data is correct';
  }

  notification.append(notificationTitle);
  notification.append(notificationMessage);

  body.append(notification);
  setTimeout(() => notification.remove(), 2500);

  return isCorrect;
}

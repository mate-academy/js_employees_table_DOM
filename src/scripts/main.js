'use strict';

/* eslint-disable */
const body = document.querySelector('body');
const tHeadCells = document.querySelectorAll('table thead th');
const tbody = document.querySelector('table tbody');
const rows = [...tbody.querySelectorAll('tr')];

const officeOptions
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

employeeForm();

tHeadCells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    const receivedRows = sortByIdAndType(index);
    receivedRows.forEach(row => tbody.append(row));
  })
})

function sortByIdAndType(index) {
  const currentRows = [...tbody.querySelectorAll('tr')];
  const rows = [...currentRows];

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].innerText;
    const cellB = rowB.cells[index].innerText;

    return cellA.localeCompare(cellB, 'en', { numeric: true });
  });

  if (JSON.stringify(rows.map(row => row.innerText))
    === JSON.stringify(currentRows.map(row => row.innerText))) {
    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].innerText;
      const cellB = rowB.cells[index].innerText;

      return cellB.localeCompare(cellA, 'en', { numeric: true });
    });
  }
  return rows;
}

tbody.addEventListener('click', (event) => {
  if (event.target.parentElement.tagName !== 'TR') {
    return;
  }

  const activeClasses = tbody.querySelectorAll('.active');
  activeClasses.forEach((activeClass) => {
    activeClass.classList.remove('active');
  })

  event.target.parentElement.className = 'active';
})

tbody.addEventListener('dblclick', (event) => {
  if (event.target.tagName !== 'TD') {
    return;
  }

  const defaultValue = event.target.textContent.trim();

  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.classList.add('cell-input');
  inputElement.style.width = defaultValue.length * 10 + 'px';
  inputElement.value = defaultValue;

  event.target.textContent = '';
  event.target.append(inputElement);
  inputElement.focus();

  inputElement.addEventListener('blur', () => {
    if (inputElement.value === '') {
      inputElement.parentElement.textContent = defaultValue;
    } else {
      inputElement.parentElement.textContent = inputElement.value;
    }
  })

  inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputElement.value === '') {
        inputElement.parentElement.textContent = defaultValue;
      } else {
        inputElement.parentElement.textContent = inputElement.value;
      }
    }
  })
})

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

      if (element.name === 'salary') {
        cell.textContent = getSalary(element.value);
      } else {
        cell.textContent = element.value;
      }

      newRowData[tHeadCells[index].innerText.toLowerCase()] = cell.textContent;
      index++;
      newRow.append(cell);
    })

    if (formDataValidation(newRowData)) {
      tbody.append(newRow)
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

function createSelect(name, options) {
  const select = document.createElement('select');
  select.name = name;
  select.setAttribute('data-qa', name);

  options.forEach((option) => {
    const optionHTML = document.createElement('option')
    optionHTML.value = option;
    optionHTML.textContent = option;
    select.append(optionHTML);
  })
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

  if (newEmployeeName.length < 4
    || parseInt(newEmployeeAge, 10) < 18
    || parseInt(newEmployeeAge, 10) > 90) {

    if (newEmployeeName.length < 4) {
      notification.classList.add('error');
      notificationTitle.textContent = 'Name length error';
      notificationMessage.textContent = 'Your name length should be more than 4 symbols';
    } else if (parseInt(newEmployeeAge, 10) < 18
      || parseInt(newEmployeeAge,  10) > 90) {
      notification.classList.add('error');
      notificationTitle.textContent = 'Age error';
      notificationMessage.textContent = 'Your age can\'t be less than 18';
      if (parseInt(newEmployeeAge) > 90) {
        notification.classList.add('error');
        notificationMessage.textContent = 'Your age can\'t be more than 90';
      }
    }

    isCorrect = false;
  } else {
    notification.classList.add('success');
    notificationTitle.textContent = 'Success'
    notificationMessage.textContent = 'Data is correct'
  }

  notification.append(notificationTitle);
  notification.append(notificationMessage);

  body.append(notification);
  setTimeout(() => notification.remove(), 2500);

  return isCorrect;
}

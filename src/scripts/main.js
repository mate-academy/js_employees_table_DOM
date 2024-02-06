'use strict';

const table = document.querySelector('table');
const tableContent = document.querySelector('tbody');
let lastSortedIndex = null;
let isAscending = true;

table.addEventListener('click', function(events) {
  const clickedCell = events.target;
  const rows = tableContent.querySelectorAll('tr');

  rows.forEach(row => {
    row.classList.remove('active');
  });

  if (clickedCell.tagName === 'TD') {
    clickedCell.parentNode.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const labels = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const inputIds = ['name', 'position', 'office', 'age', 'salary'];

  for (let i = 0; i < labels.length; i++) {
    const label = document.createElement('label');

    label.textContent = `${labels[i]}: `;

    const input = document.createElement('input');

    input.type = (i === 3 || i === 4) ? 'number' : 'text';

    input.name = inputIds[i];
    input.dataset.qa = inputIds[i];

    label.appendChild(input);

    if (labels[i] === 'Office') {
      const officeSelectLabel = document.createElement('label');

      officeSelectLabel.textContent = 'Office: ';

      const officeSelect = document.createElement('select');

      officeSelect.name = 'office';
      officeSelect.dataset.qa = 'office';

      // eslint-disable-next-line max-len
      const officeOptions = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

      for (const optionText of officeOptions) {
        const option = document.createElement('option');

        option.value = optionText;
        option.textContent = optionText;
        officeSelect.appendChild(option);
      }

      officeSelectLabel.appendChild(officeSelect);
      form.appendChild(officeSelectLabel);
    } else {
      form.appendChild(label);
    }
  }

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  document.body.appendChild(form);

  form.addEventListener('submit', function(events) {
    events.preventDefault();

    const formData = new FormData(form);
    const employeeData = {};

    formData.forEach((value, key) => {
      if (key === 'salary') {
        employeeData[key] = convertSalary(value);
      } else {
        employeeData[key] = value;
      }
    });

    const data = Object.fromEntries(formData.entries());

    if (data.name.length < 4) {
      // eslint-disable-next-line max-len
      pushNotification('error', 'Error', 'Name should be at least 4 characters long');
    } else if (data.age < 18 || data.age > 90) {
      // eslint-disable-next-line max-len
      pushNotification('error', 'Error', 'Age should be a number between 18 and 90');
    } else if (!data.position || !data.salary) {
      pushNotification('error', 'Error', 'All fields are required');
    } else {
      pushNotification('success', 'Success', 'Employee was added');
      addEmployeeToTable(employeeData);

      form.reset();
    }
  });

  function convertSalary(salaryString) {
    const parsedSalary = parseFloat(salaryString.replace(/[^\d]/g, ''));

    if (!isNaN(parsedSalary)) {
      return '$' + parsedSalary.toLocaleString('en-US');
    } else {
      return salaryString;
    }
  }

  function addEmployeeToTable(employeeData) {
    const newRow = tableContent.insertRow(-1);

    const cellsOrder = ['name', 'position', 'office', 'age', 'salary'];

    for (const key of cellsOrder) {
      const cell = newRow.insertCell();

      cell.textContent = employeeData[key];
    }
  }
});

table.addEventListener('click', function(e) {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  const cellIndex = header.cellIndex;

  if (cellIndex === lastSortedIndex) {
    isAscending = !isAscending;
  } else {
    isAscending = true;
    lastSortedIndex = cellIndex;
  }

  const sortedRows = sortRows(tableContent.children, cellIndex);

  tableContent.append(...sortedRows);
});

function sortRows([...rows], index) {
  const isSortingBySalary = index === 4;

  rows.sort((a, b) => {
    const dataA = a.cells[index].innerText;
    const dataB = b.cells[index].innerText;

    if (isSortingBySalary) {
      const normalize = (data) => data.slice(1).replace(',', '');

      if (isAscending) {
        return normalize(dataA) - normalize(dataB);
      } else {
        return normalize(dataB) - normalize(dataA);
      }
    }

    if (isAscending) {
      return dataA.localeCompare(dataB);
    } else {
      return dataB.localeCompare(dataA);
    }
  });

  return rows;
}

function pushNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  const titleElement = document.createElement('h2');

  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;
  notification.appendChild(titleElement);
  notification.appendChild(descriptionElement);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
}

table.addEventListener('dblclick', function(events) {
  const clickedCell = events.target.closest('td');

  if (!clickedCell) {
    return;
  }

  const oldValue = clickedCell.textContent;

  clickedCell.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');

  function saveChanges(cell, text) {
    const newValue = text.value.trim();

    if (newValue === '') {
      cell.textContent = oldValue;
    } else {
      cell.textContent = newValue;
    }
  }

  input.addEventListener('blur', function() {
    saveChanges(clickedCell, input);
  });

  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveChanges(clickedCell, input);
    }
  });

  clickedCell.appendChild(input);
  input.focus();
});

document.querySelector('body').style.alignItems = 'flex-start';

'use strict';

const titles = document.querySelectorAll('table th');
const rows = Array.from(document.querySelectorAll('tbody tr'));
let click = 0;

const form = document.createElement('form');
const label1 = document.createElement('label');
const label2 = document.createElement('label');
const selectLabel = document.createElement('label');
const label3 = document.createElement('label');
const label4 = document.createElement('label');
const input1 = document.createElement('input');
const input2 = document.createElement('input');
const select = document.createElement('select');
const input3 = document.createElement('input');
const input4 = document.createElement('input');
const button = document.createElement('button');

form.classList.add('new-employee-form');
label1.classList.add('label');
label1.textContent = 'Name:';
input1.classList.add('input');
input1.setAttribute('data-qa', 'name');

label2.classList.add('label');
label2.textContent = 'Position:';
input2.classList.add('input');
input2.setAttribute('data-qa', 'position');

selectLabel.classList.add('label');
selectLabel.textContent = 'Office:';
select.classList.add('input');
select.setAttribute('data-qa', 'office');

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

  option.setAttribute('value', office);
  option.textContent = office;
  select.appendChild(option);
});

label3.classList.add('label');
label3.textContent = 'Age:';
input3.classList.add('input');
input3.setAttribute('data-qa', 'age');

label4.classList.add('label');
label4.textContent = 'Salary:';
input4.classList.add('input');
input4.setAttribute('data-qa', 'salary');

button.classList.add('button');
button.textContent = 'Save to table';

document.body.appendChild(form);
form.appendChild(label1);
label1.appendChild(input1);
form.appendChild(label2);
label2.appendChild(input2);
form.appendChild(selectLabel);
selectLabel.appendChild(select);
form.appendChild(label3);
label3.appendChild(input3);
form.appendChild(label4);
label4.appendChild(input4);
form.appendChild(button);

Array.from(titles).forEach((title, text) => {
  title.addEventListener('click', () => {
    click++;

    if (click === 1) {
      sortElements(text);
    } else if (click === 2) {
      sortElementsSecond(text);
      click = 0;
    }
  });
});

Array.from(rows).forEach((row) => {
  row.addEventListener('click', () => {
    selectRow(row);
  });
});

// eslint-disable-next-line no-shadow
button.addEventListener('click', (event) => {
  event.preventDefault();
  createNewRow();
});

rows.forEach((row) => {
  const cells = row.querySelectorAll('td');

  cells.forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      clickOnCell(cell);
    });
  });
});

// const data = new FormData(form);

function createNewRow() {
  const nameData = form.querySelector('[data-qa="name"]').value;
  const positionData = form.querySelector('[data-qa="position"]').value;
  const officeData = form.querySelector('[data-qa="office"]').value;
  const ageData = form.querySelector('[data-qa="age"]').value;
  const salaryData = form.querySelector('[data-qa="salary"]').value;

  const newRow = document.createElement('tr');
  const age = parseInt(ageData);
  const salary = parseInt(salaryData, 10);

  if (nameData.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  if (isNaN(salary)) {
    showNotification('Salary should be numbers', 'error');

    return;
  }

  if (!positionData.trim()) {
    showNotification('Error', 'error');

    return;
  }

  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  newRow.classList.add('tr');
  nameCell.textContent = nameData;
  newRow.appendChild(nameCell);
  newRow.classList.add('tr');
  positionCell.textContent = positionData;
  newRow.appendChild(positionCell);
  newRow.classList.add('tr');

  officeCell.textContent =
    officeData.charAt(0).toUpperCase() + officeData.slice(1);
  newRow.appendChild(officeCell);
  newRow.classList.add('tr');
  ageCell.textContent = age;
  newRow.appendChild(ageCell);
  newRow.classList.add('tr');
  salaryCell.textContent = `$${salary.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  newRow.appendChild(salaryCell);

  document.querySelector('tbody').appendChild(newRow);
  showNotification('Employee added successfully', 'success');
}

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const title = document.createElement('span');

  title.classList.add('title');
  title.textContent = type.charAt(0).toUpperCase() + type.slice(1);

  const description = document.createElement('span');

  description.textContent = message;

  notification.appendChild(title);
  notification.appendChild(description);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function selectRow(row) {
  rows.forEach((item) => {
    item.classList.remove('active');
  });

  row.classList.add('active');
}

function sortElements(element) {
  rows.sort((a, b) => {
    const cellA = a.children[element].textContent.trim();
    const cellB = b.children[element].textContent.trim();

    const numberA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
    const numberB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

    if (!isNaN(numberA) && !isNaN(numberB)) {
      return numberA - numberB;
    } else {
      return cellA.localeCompare(cellB);
    }
  });

  const body = document.querySelector('tbody');

  rows.forEach((row) => body.appendChild(row));
}

function sortElementsSecond(element) {
  rows.sort((a, b) => {
    const cellA = a.children[element].textContent.trim();
    const cellB = b.children[element].textContent.trim();

    const numberA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
    const numberB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

    if (!isNaN(numberA) && !isNaN(numberB)) {
      return numberB - numberA;
    } else {
      return cellB.localeCompare(cellA);
    }
  });

  const body = document.querySelector('tbody');

  rows.forEach((row) => body.appendChild(row));
}

function clickOnCell(cell) {
  const originalText = cell.textContent.trim();

  cell.textContent = '';

  const inputAdd = document.createElement('input');

  inputAdd.type = 'text';
  inputAdd.classList.add('cell-input');
  inputAdd.value = originalText;

  cell.appendChild(inputAdd);
  inputAdd.focus();

  // eslint-disable-next-line no-shadow
  inputAdd.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      saveChanges(cell, inputAdd, originalText);
    }
  });
}

function saveChanges(cell, input, text) {
  const newText = input.value.trim();

  if (newText === '') {
    cell.textContent = text;
  } else {
    cell.textContent = newText;
  }

  cell.removeChild(input);
}

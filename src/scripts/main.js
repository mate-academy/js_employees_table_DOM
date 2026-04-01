'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

let lastSortedColumn = null;
let isAscending = true;

const body = document.querySelector('body');
const form = document.createElement('form');
const formMas = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const clickbutton = document.createElement('button');

clickbutton.textContent = 'Save to table';
clickbutton.setAttribute('type', 'button');
form.classList.add('new-employee-form');
body.append(form);

for (let i = 0; i < formMas.length; i++) {
  const label = document.createElement('label');

  label.textContent = formMas[i] + ':';

  const input = document.createElement('input');

  if (formMas[i] === 'Office') {
    const select = document.createElement('select');

    select.setAttribute('data-qa', formMas[i].toLowerCase());
    select.setAttribute('name', formMas[i].toLowerCase());

    const option1 = document.createElement('option');

    option1.textContent = 'Tokyo';

    const option2 = document.createElement('option');

    option2.textContent = 'Singapore';

    const option3 = document.createElement('option');

    option3.textContent = 'London';

    const option4 = document.createElement('option');

    option4.textContent = 'New York';

    const option5 = document.createElement('option');

    option5.textContent = 'Edinburgh';

    const option6 = document.createElement('option');

    option6.textContent = 'San Francisco';
    select.append(option1);
    select.append(option2);
    select.append(option3);
    select.append(option4);
    select.append(option5);
    select.append(option6);
    label.append(select);
  } else if (formMas[i] === 'Age' || formMas[i] === 'Salary') {
    input.setAttribute('data-qa', formMas[i].toLowerCase());
    input.setAttribute('name', formMas[i].toLowerCase());
    input.setAttribute('type', 'number');
    label.append(input);
  } else {
    input.setAttribute('data-qa', formMas[i].toLowerCase());
    input.setAttribute('name', formMas[i].toLowerCase());
    input.setAttribute('type', 'text');
    label.append(input);
  }

  form.append(label);
}

form.append(clickbutton);

form.addEventListener('click', (e) => {
  const button = e.target.closest('button');

  if (!button) {
    return;
  }

  const formData = new FormData(form);
  const userName = formData.get('name');
  const userAge = formData.get('age');
  const userSalary = formData.get('salary');
  const userPosition = formData.get('position');
  const userOffice = formData.get('office');

  if (
    !validateFormData(userName, userAge, userSalary, userPosition, userOffice)
  ) {
    return;
  }

  const newRow = document.createElement('tr');

  formMas.forEach((item) => {
    if (item === 'Salary') {
      const salaryValue = formData.get(item.toLowerCase());
      const formattedSalary = Number(salaryValue).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const cell = document.createElement('td');

      cell.textContent = formattedSalary;
      newRow.append(cell);

      return;
    }

    const newCell = document.createElement('td');

    newCell.textContent = formData.get(item.toLowerCase());
    newRow.append(newCell);
  });
  tbody.append(newRow);
  document.body.append(divNotification);
  form.reset();
});

const divError = document.createElement('div');
const errorText = document.createElement('p');
const errorTitle = document.createElement('h2');

divError.classList.add('notification', 'error');
divError.setAttribute('data-qa', 'notification');
divError.append(errorTitle);
divError.append(errorText);

const divNotification = document.createElement('div');
const notificationText = document.createElement('p');
const notificationTitle = document.createElement('h2');

divNotification.classList.add('notification', 'success');
divNotification.setAttribute('data-qa', 'notification');
divNotification.append(notificationTitle);
divNotification.append(notificationText);
divNotification.querySelector('h2').textContent = 'Success!';
divNotification.querySelector('p').textContent = 'Employee added successfully.';

function validateFormData(
  userName,
  userAge,
  userSalary,
  userPosition,
  userOffice,
) {
  const cleanName = userName.trim();
  const cleanPosition = userPosition.trim();
  const cleanOffice = userOffice.trim();
  const cleanAge = userAge.trim();
  const cleanSalary = userSalary.trim();
  const researchDivNotification = document.querySelector('.notification');

  if (researchDivNotification) {
    document.body.removeChild(researchDivNotification);
  }

  if (
    !cleanName ||
    !cleanPosition ||
    !cleanOffice ||
    !cleanAge ||
    !cleanSalary
  ) {
    divError.querySelector('h2').textContent = 'Invalid Input';
    divError.querySelector('p').textContent = 'All fields must be filled out.';
    document.body.append(divError);

    return false;
  }

  const age = Number(cleanAge);
  const salary = Number(cleanSalary);

  if (cleanName.length < 4) {
    divError.querySelector('h2').textContent = 'Invalid Input';

    divError.querySelector('p').textContent =
      'Name must contain at least 4 letters.';
    document.body.append(divError);

    return false;
  }

  if (age < 18 || age > 90) {
    divError.querySelector('h2').textContent = 'Invalid Input';
    divError.querySelector('p').textContent = 'Age must be between 18 and 90.';
    document.body.append(divError);

    return false;
  }

  if (salary < 0) {
    divError.querySelector('h2').textContent = 'Invalid Input';

    divError.querySelector('p').textContent =
      'Salary must be a positive number.';
    document.body.append(divError);

    return false;
  }

  return true;
}

let buttonActiveAddClass = null;

table.addEventListener('click', (e) => {
  const buttonSort = e.target.closest('thead th');
  const buttonActive = e.target.closest('tbody tr');

  if (!buttonSort && !buttonActive) {
    return;
  }

  if (buttonActive) {
    if (buttonActiveAddClass) {
      buttonActiveAddClass.classList.remove('active');
    }

    buttonActive.classList.add('active');
    buttonActiveAddClass = buttonActive;

    return;
  }

  const rows = Array.from(tbody.querySelectorAll('tr'));
  const celIndex = buttonSort.cellIndex;

  if (lastSortedColumn === celIndex) {
    isAscending = !isAscending;
  } else {
    isAscending = true;
    lastSortedColumn = celIndex;
  }

  const isNumberColamns = checkIsNumberColumn(rows, celIndex);

  rowsSort(rows, celIndex, isNumberColamns, isAscending);
});

function checkIsNumberColumn(rows, celIndex) {
  return rows.every((row) => {
    const value = row.children[celIndex].textContent.trim();
    const cleanValue = value.replace(/[$,]/g, '');

    return cleanValue !== '' && !Number.isNaN(Number(cleanValue));
  });
}

function rowsSort(rows, celIndex, isNumberColamns, sortAscending) {
  rows.sort((a, b) => {
    let argA = a.children[celIndex].textContent.trim();
    let argB = b.children[celIndex].textContent.trim();

    if (isNumberColamns) {
      argA = Number(argA.replace(/[$,]/g, ''));
      argB = Number(argB.replace(/[$,]/g, ''));

      return sortAscending ? argA - argB : argB - argA;
    }

    return sortAscending ? argA.localeCompare(argB) : argB.localeCompare(argA);
  });

  tbody.append(...rows);
}

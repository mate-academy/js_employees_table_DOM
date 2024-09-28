'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tableBody = table.querySelector('tbody');
const body = document.querySelector('body');

tableBody.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach((row) => row.classList.remove('active'));

    const isClickedRow = e.target.parentElement;

    isClickedRow.classList.add('active');
  }
});

tableBody.addEventListener('dblclick', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const td = e.target;
    const oldValue = td.textContent;
    const input = document.createElement('input');
    input.className = 'cell-input';
    input.setAttribute('type', 'text');
    input.setAttribute('value', oldValue);

    td.textContent = '';
    td.appendChild(input);

    input.addEventListener('blur', () => {
      const newValue = input.value.trim();
      if (newValue === '') {
        td.textContent = oldValue;
      } else {
        td.textContent = newValue;
      }
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const newValue = input.value.trim();
        if (newValue === '') {
          td.textContent = oldValue;
        } else {
          td.textContent = newValue;
        }
      }
    });
    input.focus();
  }
});

// #region notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  const notTitle = document.createElement('h2');

  notTitle.className = 'title';
  notTitle.textContent = title;

  const notContent = document.createElement('p');

  notContent.textContent = description;

  notification.appendChild(notTitle);
  notification.appendChild(notContent);

  notification.classList.add(type);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
    notification.remove();
  }, 2000);
};

// #endregion

// #region form

const employeeForm = document.createElement('form');

employeeForm.className = 'new-employee-form';

const selectOption = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const labelName = ['Name:', 'Position:', 'Office:', 'Age:', 'Salary:'];
const inputName = ['name', 'position', 'office', 'age', 'salary'];

labelName.forEach((lName, index) => {
  const label = document.createElement('label');

  label.innerText = lName;

  if (lName === 'Office:') {
    const select = document.createElement('select');

    selectOption.forEach((i) => {
      const option = document.createElement('option');

      option.innerHTML = i;
      select.setAttribute('data-qa', 'office');

      select.appendChild(option);
    });

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.setAttribute('name', inputName[index]);
    input.setAttribute('type', 'text');

    if (inputName[index] === 'name') {
      input.setAttribute('minlength', '4');
    }

    if (inputName[index] === 'age' || inputName[index] === 'salary') {
      input.setAttribute('type', 'number');
    }

    if (inputName[index] === 'age') {
      input.setAttribute('min', '18');
      input.setAttribute('max', '90');
    }

    input.setAttribute('data-qa', inputName[index]);

    label.appendChild(input);
  }

  employeeForm.appendChild(label);
});

const button = document.createElement('button');

button.textContent = 'Save to table';
employeeForm.appendChild(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const nameCell = document.querySelector('input[data-qa="name"]').value;
  const positionCell = document.querySelector(
    'input[data-qa="position"]',
  ).value;
  const officeCell = document.querySelector('select[data-qa="office"]').value;
  const ageCell = parseInt(
    document.querySelector('input[data-qa="age"]').value,
  );
  const salaryCell = document.querySelector('input[data-qa="salary"]').value;

  if (!nameCell || !positionCell || !officeCell || !ageCell || !salaryCell) {
    pushNotification(150, 10, 'Error', 'Please fill in all fields!', 'error');

    return;
  }

  if (nameCell.trim().length < 4) {
    pushNotification(150, 10, 'Error', 'Please fill walid name', 'error');

    return;
  }

  if (ageCell < 18 || ageCell > 90) {
    pushNotification(
      150,
      10,
      'Error',
      'Please enter a valid age (18-90)',
      'error',
    );

    return;
  }

  const formattedSalary = '$' + parseInt(salaryCell).toLocaleString('en-US');
  const tableTBody = document.querySelector('table tbody');
  const newRow = tableTBody.insertRow();

  newRow.insertCell(0).innerHTML = nameCell;
  newRow.insertCell(1).innerHTML = positionCell;
  newRow.insertCell(2).innerHTML = officeCell;
  newRow.insertCell(3).innerHTML = ageCell;
  newRow.insertCell(4).innerHTML = formattedSalary;

  pushNotification(10, 10, 'Success', 'Employee added to table!', 'success');
  employeeForm.reset();
});

body.appendChild(employeeForm);

// #endregion

// #region sortedForm

const directions = Array.from(headers).map(() => {
  return '';
});

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortColumn(index);
  });
});

const sortColumn = (index) => {
  const direction = directions[index] || 'asc';
  const multiplier = direction === 'asc' ? 1 : -1;
  const rows = Array.from(tableBody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index].innerHTML;
    const cellB = rowB.querySelectorAll('td')[index].innerHTML;

    const numA = parseFloat(cellA.replace(/\D/g, ''));
    const numB = parseFloat(cellB.replace(/\D/g, ''));

    if (!isNaN(numA) && !isNaN(numB)) {
      return (numA - numB) * multiplier;
    } else {
      return cellA.localeCompare(cellB) * multiplier;
    }
  });

  rows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
  directions[index] = direction === 'asc' ? 'desc' : 'asc';
};

// #endregion

'use strict';

// sort table
const headers = [...document.querySelectorAll('table thead tr th')];
let lastSortedKey = null;
let sortReverse = false;

headers.forEach((header) => {
  const indexHeader = headers.indexOf(header);
  const tBody = document.querySelector('table tbody');

  header.addEventListener('click', () => {
    const key = header.textContent.trim();
    const rows = [...document.querySelectorAll('table tbody tr')];

    if (key !== lastSortedKey) {
      sortReverse = false;
    }

    let sortedRows;

    if (['Name', 'Position', 'Office'].includes(key)) {
      sortedRows = [...rows].sort((a, b) => {
        const aRow = a.children[indexHeader].textContent.trim();
        const bRow = b.children[indexHeader].textContent.trim();

        return sortReverse
          ? bRow.localeCompare(aRow)
          : aRow.localeCompare(bRow);
      });
    } else if (key === 'Age') {
      sortedRows = [...rows].sort((a, b) => {
        const aNumber = Number(a.cells[indexHeader].textContent);
        const bNumber = Number(b.cells[indexHeader].textContent);

        return sortReverse ? bNumber - aNumber : aNumber - bNumber;
      });
    } else if (key === 'Salary') {
      sortedRows = [...rows].sort((a, b) => {
        const aSalary = Number(
          a.cells[indexHeader].textContent.replace(/[^0-9.-]+/g, ''),
        );
        const bSalary = Number(
          b.cells[indexHeader].textContent.replace(/[^0-9.-]+/g, ''),
        );

        return sortReverse ? bSalary - aSalary : aSalary - bSalary;
      });
    }

    tBody.replaceChildren(...sortedRows);

    lastSortedKey = key;
    sortReverse = !sortReverse;
  });
});

// add class 'active'
const tableBody = document.querySelector('table tbody');

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  tableBody
    .querySelectorAll('tr')
    .forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});

// add employee form
const body = document.querySelector('body');
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

body.append(employeeForm);

const labelName = document.createElement('label');

labelName.textContent = 'Name:';

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
inputName.setAttribute('required', '');
labelName.append(inputName);
employeeForm.append(labelName);

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position:';

const inputPosition = document.createElement('input');

inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');
inputPosition.setAttribute('required', '');
labelPosition.append(inputPosition);
employeeForm.append(labelPosition);

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office:';

const selectOffice = document.createElement('select');

selectOffice.name = 'office';
selectOffice.setAttribute('data-qa', 'office');
selectOffice.setAttribute('required', '');

[
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
].forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  selectOffice.append(option);
});
labelOffice.append(selectOffice);
employeeForm.append(labelOffice);

const labelAge = document.createElement('label');

labelAge.textContent = 'Age:';

const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');
inputAge.setAttribute('required', '');
labelAge.append(inputAge);
employeeForm.append(labelAge);

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary:';

const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.setAttribute('required', '');
labelSalary.append(inputSalary);
employeeForm.append(labelSalary);

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';
employeeForm.append(submitButton);

submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  const nameEmployee = inputName.value.trim();
  const position = inputPosition.value.trim();
  const office = selectOffice.value;
  const age = Number(inputAge.value);
  const salary = Number(inputSalary.value.replace(/[^0-9.-]+/g, ''));

  let notification = document.querySelector('[data-qa="notification"]');

  if (!notification) {
    notification = document.createElement('div');
    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('notification');
    employeeForm.insertAdjacentElement('afterend', notification);
  }
  notification.textContent = '';
  notification.className = '';

  if (nameEmployee.length < 4) {
    notification.textContent = 'Incorrect length of your name.';
    notification.classList.add('error');

    return;
  } else if (age < 18 || age > 90) {
    notification.textContent = 'Incorrect age';
    notification.classList.add('error');

    return;
  } else if (!position) {
    notification.textContent = 'Incorrect position';
    notification.classList.add('error');

    return;
  } else {
    notification.textContent = 'The employee successfully added in the table';
    notification.classList.add('success');
  }

  const newEmployee = document.createElement('tr');

  newEmployee.innerHTML = `
  <td>${nameEmployee}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tableBody.append(newEmployee);

  employeeForm.reset();
});

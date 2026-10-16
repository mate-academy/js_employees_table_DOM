'use strict';

const table = document.querySelector('table');
const tHeaders = table.querySelector('thead tr');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];

function getNumber(salary) {
  return +salary.replace('$', '').replace(',', '');
}

tHeaders.addEventListener('click', (e) => {
  let currentOrder = e.target.dataset.orderState;
  const colomnIndex = e.target.cellIndex;

  if (!currentOrder || currentOrder === 'desc') {
    currentOrder = 'asc';

    rows.sort((td1, td2) => {
      const str1 = td1.cells[colomnIndex].textContent;
      const str2 = td2.cells[colomnIndex].textContent;

      if (!Number.isNaN(getNumber(str1)) && !Number.isNaN(getNumber(str2))) {
        return getNumber(str1) - getNumber(str2);
      }

      return str1.localeCompare(str2);
    });

    e.target.dataset.orderState = currentOrder;
  } else if (currentOrder && currentOrder === 'asc') {
    currentOrder = 'desc';

    rows.sort((td1, td2) => {
      const str1 = td1.cells[colomnIndex].textContent;
      const str2 = td2.cells[colomnIndex].textContent;

      if (!Number.isNaN(getNumber(str1)) && !Number.isNaN(getNumber(str2))) {
        return getNumber(str2) - getNumber(str1);
      }

      return -str1.localeCompare(str2);
    });

    e.target.dataset.orderState = currentOrder;
  }

  rows.forEach((row) => tbody.append(row));
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  const isActive = tr.classList.contains('active');

  if (isActive) {
    return;
  }

  if (!isActive) {
    const tableRows = [...tbody.rows];

    const active = tableRows.find((row) => row.classList.contains('active'));

    if (active) {
      active.classList.remove('active');
    }
    tr.classList.add('active');
  }
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  const currentText = td.textContent;
  const input = document.createElement('input');

  input.value = currentText;
  input.classList.add('cell-input');
  td.textContent = '';
  td.append(input);
  input.focus();

  const saveChanges = () => {
    if (input.value === '') {
      input.remove();
      td.textContent = currentText;

      return;
    }

    td.textContent = input.value;
    input.remove();
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      saveChanges();
    }
  });
});

function showNotification(message, type, title) {
  const notification = document.createElement('div');
  const description = document.createElement('h2');
  const titleNtfc = document.createElement('p');

  description.textContent = message;

  titleNtfc.textContent = title;
  titleNtfc.classList.add('title');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notification.append(titleNtfc, description);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function addEmployeeToTable() {
  const tr = document.createElement('tr');
  const nameTd = document.createElement('td');
  const positionTd = document.createElement('td');
  const officeTd = document.createElement('td');
  const ageTd = document.createElement('td');
  const salaryTd = document.createElement('td');
  const convertedSalary = (+inputSalary.value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  nameTd.textContent = inputName.value;
  positionTd.textContent = inputPos.value;
  officeTd.textContent = selectOffice.value;
  ageTd.textContent = inputAge.value;
  salaryTd.textContent = convertedSalary;

  tr.append(nameTd);
  tr.append(positionTd);
  tr.append(officeTd);
  tr.append(ageTd);
  tr.append(salaryTd);
  tbody.append(tr);
}

const form = document.createElement('form');
const btn = document.createElement('button');
const selectOffice = document.createElement('select');

selectOffice.setAttribute('data-qa', 'office');
selectOffice.name = 'office';
selectOffice.required = true;

btn.type = 'submit';
btn.textContent = 'Save to table';

const labelName = document.createElement('label');
const labelPos = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');
const labelOffice = document.createElement('label');

labelName.textContent = 'Name: ';
labelPos.textContent = 'Position: ';
labelAge.textContent = 'Age: ';
labelSalary.textContent = 'Salary: ';
labelOffice.textContent = 'Office: ';

const inputName = document.createElement('input');
const inputPos = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
inputName.required = true;

inputPos.name = 'position';
inputPos.type = 'text';
inputPos.setAttribute('data-qa', 'position');
inputPos.required = true;

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');
inputAge.required = true;

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.required = true;

labelName.append(inputName);
labelPos.append(inputPos);
labelAge.append(inputAge);
labelSalary.append(inputSalary);
labelOffice.append(selectOffice);

const tokyoOpt = document.createElement('option');
const sngprOpt = document.createElement('option');
const londonOpt = document.createElement('option');
const nyOpt = document.createElement('option');
const ednbrghOpt = document.createElement('option');
const saOpt = document.createElement('option');

tokyoOpt.value = 'Tokyo';
tokyoOpt.textContent = 'Tokyo';

sngprOpt.value = 'Singapore';
sngprOpt.textContent = 'Singapore';

londonOpt.textContent = 'London';
londonOpt.value = 'London';

nyOpt.value = 'New York';
nyOpt.textContent = 'New York';

ednbrghOpt.value = 'Edinburgh';
ednbrghOpt.textContent = 'Edinburgh';

saOpt.value = 'San Francisco';
saOpt.textContent = 'San Francisco';

selectOffice.append(tokyoOpt, sngprOpt, londonOpt, nyOpt, ednbrghOpt, saOpt);

form.append(labelName, labelPos, labelOffice, labelAge, labelSalary, btn);

form.classList.add('new-employee-form');
form.noValidate = true;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const position = inputPos.value;
  const salary = inputSalary.value;
  const userName = inputName.value;
  const age = +inputAge.value;
  const nameErrorMessage = 'Name must have at least 4 letters or more';
  const ageErrorMessage = 'Age must be between 18 and 90';
  const successMessage = 'Employee has been successfully added to the table';

  if (!userName || userName.length < 4) {
    showNotification(nameErrorMessage, 'error', 'Error Message');

    return;
  }

  if (!position) {
    showNotification('Position is required!', 'error', 'Error Message');

    return;
  }

  if (!age || age < 18 || age > 90) {
    showNotification(ageErrorMessage, 'error', 'Error Message');

    return;
  }

  if (!salary) {
    showNotification('Salary is required!', 'error', 'Error Message');

    return;
  }

  addEmployeeToTable();
  showNotification(successMessage, 'success', 'Success message');
});

document.body.append(form);

'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');
const rows = Array.from(tbody.querySelectorAll('tr'));

let sortDirection = 'DESC';

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const isNumberColumn = index === 3 || index === 4;

    const sortedRows = rows.sort((a, b) => {
      const cellA = a.cells[index].innerText.trim();
      const cellB = b.cells[index].innerText.trim();

      if (isNumberColumn) {
        const numA = cellA.replace(/[$,]/g, '');
        const numB = cellB.replace(/[$,]+/g, '');

        return sortDirection === 'DESC' ? numA - numB : numB - numA;
      }

      return sortDirection === 'DESC'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    sortedRows.forEach((row) => tbody.appendChild(row));

    sortDirection = sortDirection === 'DESC' ? 'ASC' : 'DESC';
  });
});

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

function createInput(labelText, inputName, inputType, qa) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = `${labelText}`;
  input.name = inputName;
  input.type = inputType;
  input.setAttribute('data-qa', qa);

  label.appendChild(input);
  form.appendChild(label);
}

createInput('Name:', 'name', 'text', 'name');
createInput('Position:', 'position', 'text', 'position');

const labelOffice = document.createElement('label');
const selectOffice = document.createElement('select');

labelOffice.textContent = 'Office:';
selectOffice.name = 'office';
selectOffice.setAttribute('data-qa', 'office');

const offices = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  selectOffice.appendChild(option);
});

labelOffice.appendChild(selectOffice);
form.appendChild(labelOffice);

createInput('Age:', 'age', 'number', 'age');
createInput('Salary:', 'salary', 'number', 'salary');

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

table.insertAdjacentElement('afterend', form);

function checkValidation(nameValue, position, age) {
  if (nameValue.length < 4 || position.length < 1 || age < 18 || age > 90) {
    return false;
  }

  return true;
}

const notification = document.createElement('div');
const notificationTitle = document.createElement('title');
const notificationDesc = document.createElement('div');

submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  notification.classList.remove('success', 'error');

  const nameValue = form.name.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = form.age.value;
  const salary = `$${parseFloat(form.salary.value).toLocaleString('en-US')}`;

  notificationTitle.textContent = 'Notification';
  notificationTitle.classList.add('title');
  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');
  notification.appendChild(notificationTitle);

  if (checkValidation(nameValue, position, age)) {
    notification.classList.add('success');
    notificationDesc.textContent = 'The employee successfully added!';
    notification.appendChild(notificationDesc);

    form.insertAdjacentElement('afterend', notification);

    const newRow = document.createElement('tr');

    [nameValue, position, office, age, salary].forEach((value) => {
      const cell = document.createElement('td');

      cell.textContent = value;
      newRow.appendChild(cell);
    });

    tbody.appendChild(newRow);

    form.reset();
  } else {
    notification.classList.add('error');
    notificationDesc.textContent = 'The data is incorrect!';
    notification.appendChild(notificationDesc);
    form.insertAdjacentElement('afterend', notification);
  }
});

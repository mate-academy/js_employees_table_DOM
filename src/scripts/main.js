'use strict';

const form = document.createElement('form');

const nameInputLabel = document.createElement('label');
const positionInputLabel = document.createElement('label');
const officeInputLabel = document.createElement('label');
const ageInputLabel = document.createElement('label');
const salaryInputLabel = document.createElement('label');

nameInputLabel.textContent = 'Name: ';
positionInputLabel.textContent = 'Position: ';
officeInputLabel.textContent = 'Office: ';
ageInputLabel.textContent = 'Age: ';
salaryInputLabel.textContent = 'Salary: ';

const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const officeInput = document.createElement('select');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');
const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';

const optionTokyo = document.createElement('option');
const optionSingapore = document.createElement('option');
const optionLondon = document.createElement('option');
const optionNewYork = document.createElement('option');
const optionEdinburgh = document.createElement('option');
const optionSanFrancisco = document.createElement('option');

optionTokyo.textContent = 'Tokyo';
optionSingapore.textContent = 'Singapore';
optionLondon.textContent = 'London';
optionNewYork.textContent = 'New York';
optionEdinburgh.textContent = 'Edinburgh';
optionSanFrancisco.textContent = 'San Francisco';

ageInput.type = 'number';
salaryInput.type = 'number';

nameInput.dataset.qa = 'name';
positionInput.dataset.qa = 'position';
officeInput.dataset.qa = 'office';
ageInput.dataset.qa = 'age';
salaryInput.dataset.qa = 'salary';

nameInput.required = true;
positionInput.required = true;
officeInput.required = true;
ageInput.required = true;
salaryInput.required = true;

form.classList.add('new-employee-form');

document.body.appendChild(form);

form.appendChild(nameInputLabel);
form.appendChild(positionInputLabel);
form.appendChild(officeInputLabel);
form.appendChild(ageInputLabel);
form.appendChild(salaryInputLabel);
form.appendChild(submitButton);

nameInputLabel.appendChild(nameInput);
positionInputLabel.appendChild(positionInput);
officeInputLabel.appendChild(officeInput);

officeInput.appendChild(optionTokyo);
officeInput.appendChild(optionSingapore);
officeInput.appendChild(optionLondon);
officeInput.appendChild(optionNewYork);
officeInput.appendChild(optionEdinburgh);
officeInput.appendChild(optionSanFrancisco);

ageInputLabel.appendChild(ageInput);
salaryInputLabel.appendChild(salaryInput);

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
let rows = Array.from(table.tBodies[0].rows);

rows.forEach((row) => {
  row.classList.remove('active');

  row.addEventListener('click', () => {
    for (const r of rows) {
      r.classList.remove('active');
    }
    row.classList.add('active');
  });
});

function sortColumn(index) {
  rows.sort((a, b) => {
    const valA =
      a.cells[index].dataset.value ||
      a.cells[index].textContent.trim().replace(/[^0-9.-]/g, '');

    const valB =
      b.cells[index].dataset.value ||
      b.cells[index].textContent.trim().replace(/[^0-9.-]/g, '');

    if (currentSortOrder === 'asc') {
      if (Number.isFinite(Number(valA)) && Number.isFinite(Number(valB))) {
        return Number(valA) - Number(valB);
      } else {
        return valA.localeCompare(valB, 'uk', { numeric: true });
      }
    } else {
      if (Number.isFinite(Number(valA)) && Number.isFinite(Number(valB))) {
        return Number(valB) - Number(valA);
      } else {
        return valB.localeCompare(valA, 'uk', { numeric: true });
      }
    }
  });

  rows.forEach((row) => {
    table.tBodies[0].appendChild(row);
  });
  rows = Array.from(table.tBodies[0].rows);
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const container = document.createElement('div');

  container.classList.add('notification', type);
  container.style.right = `${posRight}` + 'px';
  container.style.top = `${posTop}` + 'px';
  container.dataset.qa = 'notification';

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');
  notificationTitle.textContent = title;

  const notificationMessage = document.createElement('p');

  notificationMessage.textContent = description;

  container.appendChild(notificationTitle);
  container.appendChild(notificationMessage);
  document.body.appendChild(container);

  setTimeout(() => {
    container.remove();
  }, 5000);
};

const formatSalary = (num) => {
  return '$' + Number(num).toLocaleString('en-US');
};

let currentSortOrder;
let currentSortColumn;

headers.forEach((header, i) => {
  header.addEventListener('click', () => {
    if (currentSortColumn === i) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = i;
      currentSortOrder = 'asc';
    }
    sortColumn(i);
  });
});

submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  const Name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeInput.value;
  const age = ageInput.value;
  const salary = salaryInput.value;

  if (!Name || !position || !office || !age || !salary) {
    return;
  }

  if (
    !Name ||
    Name.length < 4 ||
    !position ||
    !age ||
    !office ||
    Number(age) < 18 ||
    Number(age) > 90 ||
    !salary
  ) {
    pushNotification(10, 10, 'Error!', 'Incorrect data', 'error');

    return;
  } else {
    pushNotification(10, 10, 'Succes!', 'New employee created!', 'success');
  }

  const newRow = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.textContent = Name;

  const positionCell = document.createElement('td');

  positionCell.textContent = position;

  const officeCell = document.createElement('td');

  officeCell.textContent = office;

  const ageCell = document.createElement('td');

  ageCell.textContent = age;

  const salaryCell = document.createElement('td');

  salaryCell.dataset.value = Number(salary);
  salaryCell.textContent = formatSalary(salary);

  newRow.appendChild(nameCell);
  newRow.appendChild(positionCell);
  newRow.appendChild(officeCell);
  newRow.appendChild(ageCell);
  newRow.appendChild(salaryCell);

  table.tBodies[0].appendChild(newRow);

  newRow.addEventListener('click', () => {
    rows.forEach((row) => row.classList.remove('active'));
    newRow.classList.add('active');
  });

  rows.push(newRow);

  form.reset();
});

'use strict';

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');
const tBodyRows = tBody.rows;
const tHead = table.querySelector('thead');
const tRowHeaders = tHead.firstElementChild.cells;
let newBodyRow;

let ascending = true;

let lastColumnIndex = null;
let lastTbodyRowIndex = null;

[...tRowHeaders].forEach((header, index) => {
  header.addEventListener('click', () => {
    sortRows(index);
  });
});

tBody.addEventListener('click', (ev) => {
  const row = ev.target.closest('tr');

  if (!row) {
    return;
  }

  [...tBodyRows].forEach((r, index) => {
    if (lastTbodyRowIndex !== null && lastTbodyRowIndex !== index) {
      r[lastTbodyRowIndex].classList.remove('active');
    }
    row.classList.toggle('active');

    lastTbodyRowIndex = index;
  });
});

function sortRows(colIndex) {
  const rows = tBody.rows;

  if (lastColumnIndex !== colIndex) {
    ascending = true;
    lastColumnIndex = colIndex;
  } else {
    ascending = !ascending;
  }

  [...rows].sort((a, b) => {
    const aText = a.cells[colIndex].textContent.trim();
    const bText = b.cells[colIndex].textContent.trim();

    const aNum = parseFloat(aText.replace(/[^0-9.]/g, ''));
    const bNum = parseFloat(bText.replace(/[^0-9.]/g, ''));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return ascending ? aNum - bNum : bNum - aNum;
    }

    return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });

  rows.forEach((row) => tBody.appendChild(row));
}

const form = document.createElement('form');
const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');
const select = document.createElement('select');

form.classList.add('new-employee-form');

Object.assign(inputName, {
  name: 'name',
  type: 'text',
  id: 'name',
  required: true,
  minlength: 4,
});
inputName.setAttribute('data-qa', 'name');

Object.assign(inputPosition, {
  name: 'position',
  type: 'text',
  id: 'position',
  required: true,
});
inputPosition.setAttribute('data-qa', 'position');

Object.assign(select, {
  name: 'office',
  id: 'office',
  required: true,
});
select.setAttribute('data-qa', 'office');

Object.assign(inputAge, {
  name: 'age',
  type: 'number',
  id: 'age',
  required: true,
  min: 18,
  max: 90,
});
inputAge.setAttribute('data-qa', 'age');

Object.assign(inputSalary, {
  name: 'salary',
  type: 'number',
  id: 'salary',
  required: true,
});
inputSalary.setAttribute('data-qa', 'salary');

createOption('Tokyo');
createOption('Singapore');
createOption('London');
createOption('New York');
createOption('Edinburgh');
createOption('San Francisco');

function createOption(city) {
  const option = document.createElement('option');

  option.setAttribute('value', city);
  option.textContent = city;

  select.append(option);
}

const labelName = document.createElement('label');

labelName.textContent = 'Name:';

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position:';

const labelAge = document.createElement('label');

labelAge.textContent = 'Age:';

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary:';

const labelSelect = document.createElement('label');

labelSelect.textContent = 'Office:';

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';

labelName.append(inputName);
labelPosition.append(inputPosition);
labelSelect.append(select);
labelAge.append(inputAge);
labelSalary.append(inputSalary);

form.append(
  labelName,
  labelPosition,
  labelSelect,
  labelAge,
  labelSalary,
  submitButton,
);

document.body.appendChild(form);

form.addEventListener('submit', (ev) => {
  newBodyRow = document.createElement('tr');
  ev.preventDefault();

  if (!form.checkValidity()) {
    creatNotification('Error', 'error');

    return;
  }

  const nameValue = document.getElementById('name').value;
  const positionValue = document.getElementById('position').value;
  const selectValue = document.getElementById('office').value;
  const ageValue = document.getElementById('age').value;
  const salaryValue = document.getElementById('salary').value;

  const nf = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  const nfSalaryValue = nf.format(+salaryValue);

  tdCreator(nameValue);
  tdCreator(positionValue);
  tdCreator(selectValue);
  tdCreator(ageValue);
  tdCreator(nfSalaryValue);

  tBody.append(newBodyRow);

  creatNotification('Success', 'success');
});

function tdCreator(headName) {
  const td = document.createElement('td');

  td.textContent = headName;

  newBodyRow.append(td);
}

function creatNotification(title, result) {
  const div = document.createElement('div');
  const titleDiv = document.createElement('h1');

  div.append(titleDiv);

  titleDiv.textContent = title;
  titleDiv.classList.add(result);

  div.classList.add('notification');
  div.setAttribute('data-qa', 'notification');

  document.body.append(div);
}

'use strict';

const tbody = document.querySelector('tbody');
const trList = tbody.rows;

[...trList].forEach(tr => {
  tr.addEventListener('click', () => {
    [...trList].forEach(row =>
      row.classList.contains('active') ? row.classList.remove('active') : 1);

    tr.classList.add('active');
  });
});

const title = document.querySelector('thead');

title.addEventListener('click', (e) => {
  const item = e.target;
  const rows = [...tbody.rows];
  const colNum = item.cellIndex;

  switch (item.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      rows.sort((a, b) => a.children[colNum].innerText
        .localeCompare(b.children[colNum].innerText));
      break;

    case 'Age':
    case 'Salary':
      rows.sort((a, b) =>
        Number(a.children[colNum].innerText.replace(/[, $]/g, ''))
        - Number(b.children[colNum].innerText.replace(/[, $]/g, '')));
      break;
  }

  for (const row of rows) {
    tbody.append(row);
  }
});

const body = document.querySelector('body');
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.method = 'post';
body.append(form);

const inputName = document.createElement('input');
const labelName = document.createElement('label');

labelName.innerHTML = 'Name:';
inputName.type = Text;
inputName.name = 'Name';
form.append(labelName);
labelName.append(inputName);

const inputPosition = document.createElement('input');
const labelPosition = document.createElement('label');

labelPosition.innerHTML = 'Position:';
inputPosition.type = Text;
inputPosition.name = 'Position';
form.append(labelPosition);
labelPosition.append(inputPosition);

const labelOffice = document.createElement('label');
const selectOffice = document.createElement('select');
const optionTokio = document.createElement('option');
const optionSingapore = document.createElement('option');
const optionLondon = document.createElement('option');
const optionNewYork = document.createElement('option');
const optionEdinburgh = document.createElement('option');
const optionSanFrancisco = document.createElement('option');

labelOffice.innerText = 'Office:';
selectOffice.name = 'Office';
optionTokio.selected = 'selected';
optionTokio.innerText = 'Tokio';
optionSingapore.innerText = 'Singapore';
optionLondon.innerText = 'London';
optionNewYork.innerText = 'New York';
optionEdinburgh.innerText = 'Edinburgh';
optionSanFrancisco.innerText = 'San Fransisco';
form.append(labelOffice);
labelOffice.append(selectOffice);
selectOffice.append(optionTokio);
selectOffice.append(optionSingapore);
selectOffice.append(optionLondon);
selectOffice.append(optionNewYork);
selectOffice.append(optionEdinburgh);
selectOffice.append(optionSanFrancisco);

const inputAge = document.createElement('input');
const labelAge = document.createElement('label');

labelAge.innerHTML = 'Age:';
inputAge.type = 'Number';
inputAge.name = 'Age';
form.append(labelAge);
labelAge.append(inputAge);

const inputSalary = document.createElement('input');
const labelSalary = document.createElement('label');

labelSalary.innerHTML = 'Salary:';
inputSalary.type = 'Number';
inputSalary.name = 'Salary';
form.append(labelSalary);
labelSalary.append(inputSalary);

const button = document.createElement('button');

button.innerText = 'Save to table';
button.type = 'submit';
form.append(button);

button.addEventListener('submit', () => {
  const newRow = document.createElement('tr');
  const colName = document.createElement('td');
  const colPosition = document.createElement('td');
  const colOffice = document.createElement('td');
  const colAge = document.createElement('td');
  const colSalary = document.createElement('td');

  colName.innerText = inputName.value;
  colPosition.innerText = inputPosition.value;
  colOffice.innerText = selectOffice.value;
  colAge.innerText = inputAge.value;
  colSalary.innerText = inputSalary.value;

  tbody.append(newRow);
  newRow.append(colName);
  newRow.append(colPosition);
  newRow.append(colOffice);
  newRow.append(colAge);
  newRow.append(colSalary);
});
// <tr>
// tbody.insertAdjacentHTML('beforeend', `
//   <td>${inputName.value}</td>
//   <td>${inputPosition.value}</td>
//   <td>${selectOffice.value}</td>
//   <td>${inputAge.value}</td>
//   <td>$${inputSalary.value}</td>
// </tr>`);

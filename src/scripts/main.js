'use strict';

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

const sortingColumns = function (direction, rows, header) {
  const tr = header.closest('tr');
  const headers = tr.children;
  const index = [...headers].indexOf(header);
  let result = [];

  if (direction === 'asc') {
    result = [...rows].sort((a, b) => {
      const contentA = a.cells[index].textContent.replace(/[$,]/g, '');
      const contentB = b.cells[index].textContent.replace(/[$,]/g, '');
      const numA = Number(contentA);
      const numB = Number(contentB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      } else {
        return contentA.localeCompare(contentB);
      }
    });
  }

  if (direction === 'desc') {
    result = [...rows].sort((a, b) => {
      const contentA = a.cells[index].textContent.replace(/[$,]/g, '');
      const contentB = b.cells[index].textContent.replace(/[$,]/g, '');
      const numA = Number(contentA);
      const numB = Number(contentB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      } else {
        return contentB.localeCompare(contentA);
      }
    });
  }

  return result;
};

let lastHeader = null;
let lastDirection = 'asc';

tableHeader.addEventListener('click', (e) => {
  const currTh = e.target.closest('th');
  let sortedRows = [];

  if (!currTh) {
    return;
  }

  if (currTh !== lastHeader) {
    lastDirection = 'asc';
  }

  if (currTh === lastHeader) {
    if (lastDirection === 'asc') {
      lastDirection = 'desc';
    } else {
      lastDirection = 'asc';
    }
  }

  const bodyRows = tableBody.querySelectorAll('tr');

  sortedRows = sortingColumns(lastDirection, bodyRows, currTh);
  lastHeader = currTh;
  sortedRows.forEach((row) => tableBody.append(row));
});

let currRow = null;

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');

    if (!selectedRow) {
      return;
    }

    if (currRow) {
      currRow.classList.remove('active');
    }

    selectedRow.classList.add('active');
    currRow = selectedRow;
  });

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

const nameLab = document.createElement('label');

nameLab.textContent = 'Name:';

const nameInp = document.createElement('input');

nameInp.type = 'text';
nameInp.name = 'name';
nameInp.setAttribute('data-qa', 'name');
nameInp.setAttribute('required', '');

nameLab.append(nameInp);

const positionLab = document.createElement('label');

positionLab.textContent = 'Position:';

const positionInp = document.createElement('input');

positionInp.type = 'text';
positionInp.name = 'position';
positionInp.setAttribute('data-qa', 'position');
positionInp.setAttribute('required', '');
positionLab.append(positionInp);

const officeLab = document.createElement('label');

officeLab.textContent = 'Office:';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.value = '';
officeSelect.setAttribute('data-qa', 'office');
officeSelect.setAttribute('required', '');

const placeholder = document.createElement('option');

placeholder.textContent = 'Select office';
placeholder.value = '';
placeholder.disabled = true;
placeholder.selected = true;

officeSelect.append(placeholder);

const tokyo = document.createElement('option');

tokyo.textContent = `Tokyo`;
officeSelect.append(tokyo);

const singapore = document.createElement('option');

singapore.textContent = 'Singapore';
officeSelect.append(singapore);

const london = document.createElement('option');

london.textContent = 'London';
officeSelect.append(london);

const newYork = document.createElement('option');
newYork.textContent = 'New York';
officeSelect.append(newYork);

const edinburgh = document.createElement('option');

edinburgh.textContent = 'Edinburgh';
officeSelect.append(edinburgh);

const sanF = document.createElement('option');

sanF.textContent = 'San Francisco';
officeSelect.append(sanF);
officeLab.append(officeSelect);

const ageLab = document.createElement('label');

ageLab.textContent = 'Age:';

const ageInp = document.createElement('input');

ageInp.type = 'number';
ageInp.name = 'age';
ageInp.setAttribute('data-qa', 'age');
ageInp.setAttribute('required', '');
ageInp.min = 0;

ageLab.append(ageInp);

const salaryLab = document.createElement('label');

salaryLab.textContent = 'Salary:';

const salaryInp = document.createElement('input');

salaryInp.type = 'number';
salaryInp.name = 'salary';
salaryInp.setAttribute('data-qa', 'salary');
salaryInp.setAttribute('required', '');
salaryInp.min = 0;

salaryLab.append(salaryInp);

const submit = document.createElement('button');

submit.textContent = 'Save to table';
submit.type = 'submit';
submit.name = 'submit-button';

form.append(nameLab);
form.append(positionLab);
form.append(officeLab);
form.append(ageLab);
form.append(salaryLab);
form.append(submit);

document.body.append(form);

const success = document.createElement('div');

success.classList.add('success');

const successTitle = document.createElement('h2');

successTitle.textContent = 'Successful!';

const successDesc = document.createElement('p');

successDesc.textContent = 'New employee is successfully added';
success.append(successTitle);
success.append(successDesc);
success.hidden = true;
success.setAttribute('data-qa', 'notification');
form.after(success);

const errorName = document.createElement('div');

errorName.classList.add('error');

const errorNameTitle = document.createElement('h2');

errorNameTitle.textContent = 'Error!';

const errorNameDesc = document.createElement('p');

errorNameDesc.textContent = 'Name must be more than 4 letters';
errorName.append(errorNameTitle);
errorName.append(errorNameDesc);
errorName.hidden = true;
errorName.setAttribute('data-qa', 'notification');
nameLab.append(errorName);

const errorAge = document.createElement('div');

errorAge.classList.add('error');

const errorAgeTitle = document.createElement('h2');

errorAgeTitle.textContent = 'Error!';

const errorAgeDesc = document.createElement('p');

errorAgeDesc.textContent = 'Age must be more than 18 and less than 90 y.o.';
errorAge.append(errorAgeTitle);
errorAge.append(errorAgeDesc);
errorAge.hidden = true;
errorAge.setAttribute('data-qa', 'notification');
ageLab.append(errorAge);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorName.hidden = true;
  errorAge.hidden = true;
  success.hidden = true;

  let isValid = true;
  const age = Number(ageInp.value);

  if (nameInp.value.length < 4) {
    errorName.hidden = false;
    isValid = false;
  }

  if (age < 18 || age > 90) {
    errorAge.hidden = false;
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const newEmp = document.createElement('tr');
  const empName = document.createElement('td');

  empName.textContent = nameInp.value;
  newEmp.append(empName);

  const empPosition = document.createElement('td');

  empPosition.textContent = positionInp.value;
  newEmp.append(empPosition);

  const empOffice = document.createElement('td');

  empOffice.textContent = officeSelect.value;
  newEmp.append(empOffice);

  const empAge = document.createElement('td');

  empAge.textContent = ageInp.value;
  newEmp.append(empAge);

  const empSalary = document.createElement('td');
  const salary = Number(salaryInp.value);

  empSalary.textContent = '$' + salary.toLocaleString('en-US');
  newEmp.append(empSalary);

  tableBody.append(newEmp);
  success.hidden = false;
  form.reset();
});

let editingCell = null;

tableBody.addEventListener('dblclick', (e) => {
  const cellToEdit = e.target.closest('td');

  if (!cellToEdit) {
    return;
  }

   if (editingCell) {
    return;
  }

  const lastValue = cellToEdit.textContent;

  cellToEdit.textContent = '';

  const cellInp = document.createElement('input');

  cellInp.classList.add('cell-input');
  cellInp.value = lastValue;
  cellToEdit.append(cellInp);
  cellInp.focus();

  function saveValue() {
    cellToEdit.textContent = cellInp.value || lastValue;
    cellInp.remove();
    editingCell = null;
  }

  cellInp.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'Enter') {
      saveValue();
    }
  });

  cellInp.addEventListener('blur', saveValue);
});

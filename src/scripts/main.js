'use strict';

const table = document.querySelector('table');
const body = table.querySelector('tbody');
const rows = [...body.rows];
const firstRow = rows[0];
let currentEditingCell = null;

function addForm() {
  const form = document.createElement('form');
  const button = document.createElement('button');
  const selected = document.createElement('select');
  const labelSelect = document.createElement('label');

  const options = [
    new Option('Tokyo', 'Tokyo'),
    new Option('Singapore', 'Singapore'),
    new Option('London', 'London'),
    new Option('New York', 'New York'),
    new Option('Edinburgh', 'Edinburgh'),
    new Option('San Francisco', 'San Francisco'),
  ];

  options.forEach((option) => selected.add(option));

  labelSelect.textContent = 'Office:';
  labelSelect.append(selected);

  form.className = 'new-employee-form';
  button.textContent = 'Save to table';

  const nameForm = addInput('name', 'text', 'Name', 'name');
  const positionForm = addInput('position', 'text', 'Position', 'position');
  const ageForm = addInput('age', 'number', 'Age', 'age');
  const salaryForm = addInput('salary', 'number', 'Salary', 'salary');

  form.append(nameForm, positionForm, labelSelect, ageForm, salaryForm, button);

  button.addEventListener('click', (e) => {
    e.preventDefault();

    const nameEmploye = nameForm.querySelector('input').value.trim();
    const position = positionForm.querySelector('input').value.trim();
    const age = Number(ageForm.querySelector('input').value.trim());
    const salary = Number(salaryForm.querySelector('input').value.trim());
    const office = selected.value;

    if (nameEmploye.length < 4) {
      notification(false, 'Name Error', 'Name must be at least 4 characters.');

      return;
    }

    if (age < 18 || age > 90) {
      notification(false, 'Age Error', 'Age must be between 18 and 90.');

      return;
    }

    addEmployeeToTable(nameEmploye, position, office, age, salary);
    notification(true, 'Success', 'Employee added successfully.');
    form.reset();
  });

  document.body.append(form);
}

function addEmployeeToTable(...args) {
  const newRow = body.insertRow(-1);

  args.forEach((value, index) => {
    const newCell = newRow.insertCell(index);

    if (index === 4) {
      newCell.textContent = `$ ${value.toLocaleString()}`;
    } else {
      newCell.textContent = value;
    }
  });

  rows.push(newRow);
}

function addInput(nameInput, type, text, dataset) {
  const input = document.createElement('input');
  const label = document.createElement('label');

  input.type = type;
  input.name = nameInput;
  label.textContent = `${text}:`;
  input.dataset.qa = dataset;

  label.append(input);

  return label;
}

function notification(isSuccess, title, message) {
  const mes = document.createElement('div');

  mes.dataset.qa = 'notification';
  mes.classList.add('notification');

  if (isSuccess) {
    mes.classList.add('success');
  } else {
    mes.classList.add('error');
  }

  const titleMes = document.createElement('h3');

  titleMes.textContent = title;

  const messageText = document.createElement('p');

  messageText.textContent = message;

  mes.append(titleMes, messageText);

  document.body.append(mes);

  setTimeout(() => mes.remove(), 3000);
}

let currentSortColumn = null;
let isAscending = true;

table.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const index = e.target.cellIndex;
  const content = firstRow.cells[index].textContent.trim();
  const type = !isNaN(content.replace(/[,$]/g, '')) ? 'number' : 'string';

  if (currentSortColumn === index) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = index;
    isAscending = true;
  }

  rows.length = 0;
  rows.push(...body.rows);

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent.trim().replace(/[,$]/g, '');
    const cellB = rowB.cells[index].textContent.trim().replace(/[,$]/g, '');

    let result;

    if (type === 'number') {
      result = parseFloat(cellA) - parseFloat(cellB);
    } else {
      result = cellA.localeCompare(cellB);
    }

    return isAscending ? result : -result;
  });

  rows.forEach((child) => body.appendChild(child));
});

table.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  rows.forEach((row) => row.classList.remove('active'));

  const clickedRow = e.target.parentElement;

  clickedRow.classList.add('active');
});

table.addEventListener('dblclick', (e) => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  if (currentEditingCell) {
    return;
  }

  const cell = e.target;
  const initialValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.value = initialValue;
  input.classList.add('cell-input');

  cell.textContent = '';
  cell.appendChild(input);

  input.focus();

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      saveChanges(input, cell, initialValue);
    }
  });

  input.addEventListener('blur', () => {
    saveChanges(input, cell, initialValue);
  });

  currentEditingCell = cell;
});

function saveChanges(input, cell, initialValue) {
  const newValue = input.value.trim();

  if (newValue === '') {
    cell.textContent = initialValue;
  } else {
    cell.textContent = newValue;
  }

  currentEditingCell = null;
}

addForm();

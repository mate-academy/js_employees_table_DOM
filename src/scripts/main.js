'use strict';

// write code here

const table = document.querySelector('table');
const body = document.querySelector('tbody');
let data = document.querySelectorAll('tbody tr');

function salatyToNumber(string) {
  let number = string.split('$');

  number = number[1].split(',').join('');

  return number;
}

function sortTable(e) {
  if (e.target.tagName === 'TH') {
    const header = document.querySelectorAll('th');
    const childNumber = [...header].findIndex(item =>
      item.textContent === e.target.textContent);

    let sorted;

    data = document.querySelectorAll('tbody tr');

    switch (e.target.textContent) {
      case 'Age':
        if (!e.target.classList.contains('asc')) {
          sorted = [...data].sort((a, b) =>
            a.children[childNumber].textContent
            - b.children[childNumber].textContent);
          e.target.classList.toggle('asc');
        } else {
          sorted = [...data].sort((a, b) =>
            b.children[childNumber].textContent
            - a.children[childNumber].textContent);
          e.target.classList.toggle('asc');
        }
        break;

      case 'Salary':
        if (!e.target.classList.contains('asc')) {
          sorted = [...data].sort((a, b) =>
            salatyToNumber(a.children[childNumber].textContent)
            - salatyToNumber(b.children[childNumber].textContent));
          e.target.classList.toggle('asc');
        } else {
          sorted = [...data].sort((a, b) =>
            salatyToNumber(b.children[childNumber].textContent)
            - salatyToNumber(a.children[childNumber].textContent));
          e.target.classList.toggle('asc');
        }
        break;

      case 'Name':
      case 'Position':
      case 'Office':
        if (!e.target.classList.contains('asc')) {
          sorted = [...data].sort((a, b) =>
            a.children[childNumber].textContent.localeCompare(
              b.children[childNumber].textContent));
          e.target.classList.toggle('asc');
        } else {
          sorted = [...data].sort((a, b) =>
            b.children[childNumber].textContent.localeCompare(
              a.children[childNumber].textContent));
          e.target.classList.toggle('asc');
        }
        break;
    }

    sorted.forEach(item => {
      body.append(item);
    });
  };
}

table.addEventListener('click', sortTable);

body.addEventListener('click', event => {
  [...body.children].forEach(item => {
    item.classList.remove('active');
  });
  event.target.parentElement.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.querySelector('body').append(form);

function firstCapitalLetter(string) {
  const firstLetterOfInput = string.slice(0, 1).toUpperCase();
  const word = string.slice(1);

  return `${firstLetterOfInput}${word}:`;
}

function createInput(inputName, type) {
  const input = document.createElement('input');

  input.name = inputName;
  input.type = type;
  input.required = true;
  input.setAttribute('data-qa', inputName);

  const labelName = document.createElement('label');

  labelName.textContent = firstCapitalLetter(inputName);
  labelName.append(input);
  form.append(labelName);
}

function salaryInCorrectFormat(number) {
  const firstPart = number.toString().slice(0, -3);
  const lastPart = number.toString().slice(-3);

  return `$${firstPart},${lastPart}`;
}

createInput('name', 'text');
createInput('position', 'text');

const selectOffice = document.createElement('select');
selectOffice.name = 'office';
selectOffice.required = true;
selectOffice.setAttribute('data-qa', 'office');
const labelForSelect = document.createElement('label');
labelForSelect.textContent = 'Office:';
const array = [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

array.forEach(city => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  selectOffice.append(option);
});
labelForSelect.append(selectOffice);
form.append(labelForSelect);

createInput('age', 'number');
createInput('salary', 'number');

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

function notification(type, inputName) {
  const notifBody = document.createElement('div');

  notifBody.classList.add('notification');
  notifBody.classList.add(type);
  notifBody.setAttribute('data-qa', 'notification');

  const notifTitle = document.createElement('h2');

  notifTitle.textContent = type;
  notifBody.append(notifTitle);

  const notifText = document.createElement('p');

  if (type === 'success') {
    notifText.textContent = `New ${inputName} is added!`;
  } else {
    notifText.textContent = `Incorrect ${inputName}!`;
  }

  notifBody.append(notifText);
  body.append(notifBody);

  setTimeout(function() {
    notifBody.remove();
  }, 2000);
}

form.elements.name.addEventListener('blur', () => {
  if (!isNaN(form.elements.name.value)
  || [...form.elements.name.value].length < 4) {
  notification('error', 'name');
  form.elements.name.focus();
  }
})

form.elements.position.addEventListener('blur', () => {
  if (!isNaN(form.elements.position.value)) {
    notification('error', 'position');
    form.elements.position.focus();
  };
})

form.elements.age.addEventListener('blur', () => {
  if (typeof +form.elements.age.value !== 'number'
  || form.elements.age.value < 18 || form.elements.age.value > 90) {
  notification('error', 'age');
  form.elements.age.focus();
  };
})

form.elements.salary.addEventListener('blur', () => {
  if (typeof +form.elements.salary.value !== 'number') {
    notification('error', 'salary');
    form.elements.salary.focus();
  };
})

button.addEventListener('click', (e) => {
  const newRow = document.createElement('tr');

  const cellName = document.createElement('td');
  cellName.textContent = form.elements.name.value;

  const cellPosition = document.createElement('td');
  cellPosition.textContent = form.elements.position.value;

  const cellOffice = document.createElement('td');
  cellOffice.textContent = selectOffice.value;

  const cellAge = document.createElement('td');
  cellAge.textContent = form.elements.age.value;

  const cellSalary = document.createElement('td');
  cellSalary.textContent = salaryInCorrectFormat(form.elements.salary.value);

  if (!isNaN(form.elements.name.value)
  || [...form.elements.name.value].length < 4) {
    form.elements.name.focus();
    notification('error', 'name');
    return;
  } 

  if (!isNaN(form.elements.position.value)) {
    form.elements.position.focus();
    notification('error', 'position');
    return;
  };

  if (typeof +form.elements.age.value !== 'number'
  || form.elements.age.value < 18 || form.elements.age.value > 90) {
    form.elements.age.focus();
    notification('error', 'age');
    return;
  };

  if (typeof +form.elements.salary.value !== 'number') {
    form.elements.salary.focus();
    notification('error', 'salary');
    return;
  };

  newRow.append(cellName);
  newRow.append(cellPosition);
  newRow.append(cellOffice);
  newRow.append(cellAge);
  newRow.append(cellSalary);
  body.append(newRow);

  notification('success', 'employee');
  form.reset();
});

const cellInput = document.createElement('input');

cellInput.classList.add('cell-input');

body.addEventListener('dblclick', (e) => {
  const cellToChange = e.target;

  cellInput.value = cellToChange.textContent;
  cellToChange.textContent = '';
  cellToChange.append(cellInput);
  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    cellToChange.textContent = cellInput.value;
    cellInput.remove();
  });

  cellInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') {
      return;
    };
    cellToChange.textContent = cellInput.value;
    cellInput.remove();
  });
});

'use strict';

// write code here
const page = document.querySelector('body');
const table = document.querySelector('table');
const body = document.querySelector('tbody');
let data = document.querySelectorAll('tbody tr');

[...data].map(row => {
  row.cells[0].classList.add('name');
  row.cells[1].classList.add('position');
  row.cells[2].classList.add('office');
  row.cells[3].classList.add('age');
  row.cells[4].classList.add('salary');
})

const form = document.createElement('form');
form.classList.add('new-employee-form');
page.append(form);

createInput('name', 'text');
createInput('position', 'text');
createSelect(form, 'mainForm', 'office: ');
createInput('age', 'number');
createInput('salary', 'number');

const button = document.createElement('button');
button.textContent = 'Save to table';
form.append(button);

body.addEventListener('dblclick', makeChange);
body.addEventListener('click', event => {
  [...body.children].forEach(item => {
    item.classList.remove('active');
  });
  event.target.parentElement.classList.add('active');
});

table.addEventListener('click', sortTable);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newRow = document.createElement('tr');

  const cellName = document.createElement('td');
  cellName.classList.add('name');
  cellName.textContent = form.elements.name.value;

  const cellPosition = document.createElement('td');
  cellPosition.classList.add('position');
  cellPosition.textContent = form.elements.position.value;

  const cellOffice = document.createElement('td');
  cellOffice.classList.add('office');
  cellOffice.textContent = form.elements.office.value;

  const cellAge = document.createElement('td');
  cellAge.classList.add('age');
  cellAge.textContent = form.elements.age.value;

  const cellSalary = document.createElement('td');
  cellSalary.classList.add('salary');
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

  console.log(body);

  notification('success', 'employee');
  form.reset();
});

page.addEventListener('dblclick', (event) => {
  [...body.children].forEach(item => {
    item.classList.remove('active');
  });
})

function createSelect(element, labelName, inputName) {
  const selectOffice = document.createElement('select');
  selectOffice.name = 'office';
  selectOffice.required = true;
  selectOffice.setAttribute('data-qa', 'office');
  const labelForSelect = document.createElement('label');
  labelForSelect.classList.add(labelName);
  labelForSelect.textContent = inputName;
  const array = [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

  array.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    selectOffice.append(option);
  });

  labelForSelect.append(selectOffice);
  element.append(labelForSelect);
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

function validationName() {
  if (!isNaN(form.elements.name.value)
    || [...form.elements.name.value].length < 4) {
    form.elements.name.focus();
    notification('error', 'name');
  }
}

function validationPosition() {
  if (!isNaN(form.elements.position.value)) {
    notification('error', 'position');
    form.elements.position.focus();
  };
}

function validationAge() {
  if (typeof +form.elements.age.value !== 'number'
    || form.elements.age.value < 18 || form.elements.age.value > 90) {
    notification('error', 'age');
    form.elements.age.focus();
  };
}

function validationSalary() {
  if (typeof +form.elements.salary.value !== 'number') {
    notification('error', 'salary');
    form.elements.salary.focus();
  };
}

function makeChange(event) {
  const cellInput = document.createElement('input');
  cellInput.classList.add('cell-input');
  const cellToChange = event.target;

  if (event.target.classList.contains('name')) {

    cellInput.value = cellToChange.textContent;
    cellToChange.textContent = '';
    cellToChange.append(cellInput);
    cellInput.focus();

    cellInput.addEventListener('blur', (event) => {
      if (!isNaN(cellInput.value)
        || [...cellInput.value].length < 4) {
        notification('error', 'name');
        event.target.focus();
      } else {
        cellToChange.textContent = cellInput.value;
        cellInput.remove();
      }
    });

    cellInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (!isNaN(cellInput.value)
          || [...cellInput.value].length < 4) {
          notification('error', 'name');
          event.target.focus();
        } else {
          cellToChange.textContent = cellInput.value;
          cellInput.remove();
        }
      }
    });
  }

  if (event.target.classList.contains('position')) {

    cellInput.value = cellToChange.textContent;
    cellToChange.textContent = '';
    cellToChange.append(cellInput);
    cellInput.focus();

    cellInput.addEventListener('blur', (event) => {
      if (!isNaN(cellInput.value)) {
        notification('error', 'position');
        event.target.focus();
      } else {
        cellToChange.textContent = cellInput.value;
        cellInput.remove();
      }
    });

    cellInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (!isNaN(cellInput.value)) {
          notification('error', 'position');
          event.target.focus();
        } else {
          cellToChange.textContent = cellInput.value;
          cellInput.remove();
        }
      }
    });
  }

  if (event.target.classList.contains('office')) {
    cellToChange.textContent = '';
    createSelect(cellToChange, 'update', '');
    const newForm = document.querySelector('.update');
    newForm.addEventListener('change', () => {
      cellToChange.textContent = newForm.children[0].value;
      newForm.remove();
    });
  }

  if (event.target.classList.contains('age')) {

    cellInput.value = cellToChange.textContent;
    cellToChange.textContent = '';
    cellToChange.append(cellInput);
    cellInput.focus();

    cellInput.addEventListener('blur', (event) => {
      if (isNaN(cellInput.value)
        || cellInput.value < 18 || cellInput.value > 90) {
        notification('error', 'age');
        event.target.focus();
      } else {
        cellToChange.textContent = cellInput.value;
        cellInput.remove();
      }
    });

    cellInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (isNaN(cellInput.value)
          || cellInput.value < 18 || cellInput.value > 90) {
          notification('error', 'age');
          event.target.focus();
        } else {
          cellToChange.textContent = cellInput.value;
          cellInput.remove();
        }
      }
    });
  }

  if (event.target.classList.contains('salary')) {
    const input = document.createElement('input');
    input.classList.add('input__salary');
    input.value = salaryFronString(cellToChange.textContent);
    cellToChange.textContent = '';
    cellToChange.append(input);
    input.focus();

    input.addEventListener('blur', () => {
      if (!input.value || isNaN(+input.value)) {
        notification('error', 'salary');
        input.focus();
      } else {
        cellToChange.textContent = salaryInCorrectFormat(input.value);
        input.remove();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') {
        return;
      };
      if (!input.value || isNaN(+input.value)) {
        notification('error', 'salary');
        input.focus();
      } else {
        cellToChange.textContent = salaryInCorrectFormat((input.value).toString());
        input.remove();
      }
    });
  }
}

function salatyToNumber(string) {
  let number = string.split('$');

  number = number[1].split(',').join('');

  return number;
}

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

  setTimeout(function () {
    notifBody.remove();
  }, 2000);
}

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
  let string = number.toString();
  let count = 0;
  let result = '';
  for (let i = string.length - 1; i >= 0; i--) {
    if (count === 3) {
      result += ',';
      count = 0;
    }
    result += string[i];
    count++;
  }

  return `$${[...result].reverse().join('')}`;
}

function salaryFronString(string) {
  let input = [...string].slice(1);
  let salary = '';
  for (let letter of input) {
    if (!isNaN(+letter)) {
      salary += letter;
    }
  }
  return +salary;
}

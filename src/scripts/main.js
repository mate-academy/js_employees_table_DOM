'use strict';

const table = document.querySelector('table');
const listOfRows = document.querySelectorAll('tbody tr');
const columnHeaders = table.querySelectorAll('thead th');
const rows = table.querySelector('tbody');
let sortCounter = 0;

columnHeaders.forEach((header, i) => {
  header.addEventListener('click', () => {
    const rowsArray = Array.from(rows.querySelectorAll('tr'));
    const salaryColumn = header.textContent === 'Salary';

    sortCounter++;

    const isAscending = sortCounter % 2 === 1;

    const sortedArray = rowsArray.sort((a, b) => {
      const aValue = a.querySelectorAll('td')[i].textContent;
      const bValue = b.querySelectorAll('td')[i].textContent;

      if (salaryColumn) {
        const numericA = aValue.replace(/[$,]/g, '');
        const numericB = bValue.replace(/[$,]/g, '');

        return isAscending
          ? parseFloat(numericA) - parseFloat(numericB)
          : parseFloat(numericB) - parseFloat(numericA);
      } else {
        return isAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

    sortedArray.forEach(row => rows.appendChild(row));
  });
});

for (let i = 0; i < listOfRows.length; i++) {
  const row = listOfRows[i];

  row.addEventListener('click', function handleClick() {
    row.className = 'active';

    for (let j = 0; j < listOfRows.length; j++) {
      const otherRow = listOfRows[j];

      if (otherRow !== row) {
        otherRow.classList.remove('active');
      }
    }
  });
}

const form = document.createElement('form');

form.className = 'new-employee-form';

function inputMaker(input, label, textContent, inputName, type) {
  label.textContent = `${textContent}`;
  label.appendChild(input);
  input.dataset.qa = `${inputName}`;
  input.name = `${inputName}`;
  input.type = `${type}`;
  input.required = true;
  form.appendChild(label);
}

const nameInput = document.createElement('input');
const nameLabel = document.createElement('label');

inputMaker(nameInput, nameLabel, 'Name:', 'name', 'text');

const positionInput = document.createElement('input');
const positionLabel = document.createElement('label');

inputMaker(positionInput, positionLabel, 'Position:', 'position', 'text');

const officeSelect = document.createElement('select');
const officeLabel = document.createElement('label');
const options
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

for (let i = 0; i < options.length; i++) {
  const officeOption = document.createElement('option');

  officeOption.textContent = options[i];
  officeOption.value = options[i];
  officeSelect.appendChild(officeOption);
}

officeLabel.textContent = 'Office:';
officeLabel.appendChild(officeSelect);
officeSelect.dataset.qa = 'office';
officeSelect.name = 'office';
officeSelect.required = true;
form.appendChild(officeLabel);

const ageInput = document.createElement('input');
const ageLabel = document.createElement('label');

ageInput.min = 0;
inputMaker(ageInput, ageLabel, 'Age:', 'age', 'number');

const salaryInput = document.createElement('input');
const salaryLabel = document.createElement('label');

salaryInput.min = 0;
inputMaker(salaryInput, salaryLabel, 'Salary:', 'salary', 'number');

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
form.appendChild(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const row = document.createElement('tr');
  const tableContent = table.querySelector('tbody');

  if (nameInput.value.length < 4
      || ageInput.value > 90
      || ageInput.value < 18
      || salaryInput.value < 0
  ) {
    pushNotification(10, 10, 'Error.',
      'New employee wasn\'t added.\n '
      + `Please, check if all of the inputs was filled correctly.
        Name shouldn't be less than 4 letters.
        Age shouldn't be less than 18 y.o. and no more than 90 y.o.
        Salary amount can't be a negative value.`,
      'error'
    );

    return false;
  }

  for (let i = 0; i < form.length - 1; i++) {
    const value = form[i].value;
    const cell = document.createElement('td');

    if (i === form.elements.length - 2) {
      const salary = parseFloat(value);

      if (!isNaN(salary)) {
        const formattedSalary
          = salary.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 3,
          });

        cell.textContent = formattedSalary.replace('.', ',');
      }
    } else {
      cell.textContent = value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (value.length === 0) {
      pushNotification(10, 10, 'Error.',
        'New employee wasn\'t added.\n '
        + `Please, check if all of the inputs were filled correctly.
          Name should be not less than 4 letters.
          Age should be not less than 18 y.o. and no more than 90 y.o.`,
        'error'
      );

      return false;
    }

    row.appendChild(cell);
  }

  tableContent.insertBefore(row, rows.firstChild);
  form.reset();

  pushNotification(10, 10, 'Success!',
    'New employee was added.\n '
    + 'The addition process has been successful.', 'success'
  );
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList = `notification ${type}`;
  div.dataset.qa = 'notification';

  h2.className = 'title';
  h2.innerHTML = title;
  p.innerHTML = description.replace(/\n/g, '<br>');

  div.append(h2);
  div.append(p);

  div.style.top = posTop + 'px';
  div.style.right = posRight + 'px';

  document.body.appendChild(div);

  setTimeout(() => {
    document.body.removeChild(div);
  }, 5000);
};

const cells = document.querySelectorAll('td');

let currentEditCell = null;

for (let i = 0; i < cells.length; i++) {
  const cell = cells[i];
  let cellValue;

  cell.addEventListener('dblclick', (e) => {
    e.preventDefault();

    cellValue = cell.textContent.trim();
    cell.textContent = '';

    const editInput = document.createElement('input');

    editInput.className = 'cell-input';

    if (cellValue.match(/[0-9]/)) {
      editInput.type = 'number';
      editInput.min = 0;
    }

    cell.appendChild(editInput);
    editInput.focus();
    editInput.value = '';

    currentEditCell = cell;

    editInput.addEventListener('blur', () => {
      let value = editInput.value.trim();
      const isNumber = /^\d+$/.test(cellValue);
      const nameCell = currentEditCell.parentElement.firstElementChild;

      if (value === '') {
        pushNotification(10, 10, 'Error.',
          'Cell wasn\'t edited.\n '
          + `Please, check if input was filled correctly.`,
          'error'
        );

        value = cellValue;
      }

      if (cellValue.includes('$')) {
        const salary = parseFloat(value);

        if (!isNaN(salary) && value > 0) {
          const formattedSalary
          = salary.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 3,
          });

          currentEditCell.textContent = formattedSalary.replace('.', ',');
          currentEditCell = null;
        } else {
          pushNotification(10, 10, 'Error.',
            'Cell wasn\'t edited.\n '
            + `Please, check if input was filled correctly.
              Salary amount can't be a negative value.`,
            'error'
          );

          value = cellValue;
        }
      }

      if (isNumber) {
        const age = parseInt(value);

        if (!isNaN(age) && age >= 18 && age <= 90) {
          currentEditCell.textContent = age;
          currentEditCell = null;
        } else {
          pushNotification(10, 10, 'Error.',
            'Cell wasn\'t edited.\n '
            + `Please, check if input was filled correctly.
              Age shouldn't be less than 18 y.o. and no more than 90 y.o.`,
            'error'
          );

          value = cellValue;
        }
      }

      if (nameCell === currentEditCell && value.length < 4) {
        pushNotification(10, 10, 'Error.',
          'Cell wasn\'t edited.\n '
          + `Please, check if input was filled correctly.
            Name should contain more than 4 letters.`,
          'error'
        );

        value = cellValue;
      }

      editEvent(value);
    });

    editInput.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        let value = editInput.value.trim();
        const isNumber = /^\d+$/.test(cellValue);
        const nameCell = currentEditCell.parentElement.firstElementChild;

        if (value === '') {
          pushNotification(10, 10, 'Error.',
            'Cell wasn\'t edited.\n '
            + `Please, check if input was filled correctly.`,
            'error'
          );

          value = cellValue;
        }

        if (cellValue.includes('$')) {
          const salary = parseFloat(value);

          if (!isNaN(salary) && value > 0) {
            const formattedSalary
            = salary.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 3,
            });

            currentEditCell.textContent = formattedSalary.replace('.', ',');
            currentEditCell = null;
          } else {
            pushNotification(10, 10, 'Error.',
              'Cell wasn\'t edited.\n '
              + `Please, check if input was filled correctly.
                Salary amount can't be a negative value.`,
              'error'
            );

            value = cellValue;
          }
        }

        if (isNumber) {
          const age = parseInt(value);

          if (!isNaN(age) && age >= 18 && age <= 90) {
            currentEditCell.textContent = age;
            currentEditCell = null;
          } else {
            pushNotification(10, 10, 'Error.',
              'Cell wasn\'t edited.\n '
              + `Please, check if input was filled correctly.
                Age shouldn't be less than 18 y.o. and no more than 90 y.o.`,
              'error'
            );

            value = cellValue;
          }
        }

        if (nameCell === currentEditCell && value.length < 4) {
          pushNotification(10, 10, 'Error.',
            'Cell wasn\'t edited.\n '
            + `Please, check if input was filled correctly.
              Name should contain more than 4 letters.`,
            'error'
          );

          value = cellValue;
        }

        editEvent(value);
      }
    });
  });
}

function editEvent(value) {
  currentEditCell.textContent = value.charAt(0).toUpperCase() + value.slice(1);
  currentEditCell = null;
}

document.body.appendChild(form);

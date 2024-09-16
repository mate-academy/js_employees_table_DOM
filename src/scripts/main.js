'use strict';
// #region table parameters

const formAtributes = {
  name: 'Name',
  position: 'Position',
  office: 'Office',
  age: 'Age',
  salary: 'Salary',
};

const citiesSelect = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// #endregion
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const cellsOfHead = [...thead.querySelectorAll('th')];
const tbody = document.querySelector('tbody');
const employee = newForm(formAtributes, citiesSelect);
let clicksOnHeadCells = 1;
let indexOfHeadCells = null;
let indexOfRow = null;

employee.classList.add('new-employee-form');
document.body.appendChild(employee);

// #region creating a notification
function notificationMessage(text, type) {
  const notification = document.createElement('div');
  const titleNotification = document.createElement('h3');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  titleNotification.classList.add('title');

  notification.appendChild(titleNotification);

  notification.classList.add(type);
  titleNotification.textContent = text;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.querySelector('.notification').remove();
  }, 2000);
}
// #endregion

// #region salary formatting
function formatCurrency(numberStr) {
  const number = parseInt(numberStr, 10);

  return '$' + number.toLocaleString('en-US');
}
// #endregion

// #region creating a form (constructor)
function newForm(atributes, cities) {
  const form = document.createElement('form');

  for (const [key, value] of Object.entries(atributes)) {
    const label = document.createElement('label');

    if (value === 'Office') {
      const select = document.createElement('select');

      label.textContent = `${value}:`;
      select.setAttribute('data-qa', `${key}`);
      select.name = key;

      cities.forEach((city) => {
        const option = document.createElement('option');

        option.value = city;
        option.textContent = city;

        select.appendChild(option);
      });

      label.appendChild(select);
      form.appendChild(label);
    } else {
      const input = document.createElement('input');

      label.textContent = `${value}:`;
      input.setAttribute('data-qa', `${key}`);
      input.name = `${key}`;
      input.type = 'text';
      input.setAttribute('required', '');

      label.appendChild(input);
      form.appendChild(label);
    }
  }

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.type = 'submit';

  form.appendChild(button);

  return form;
}

// #endregion

// #region form submit event
employee.querySelector('button').addEventListener('click', (e) => {
  const valuesOfInputs = {
    name: employee.querySelector('[data-qa="name"]').value,
    position: employee.querySelector('[data-qa="position"]').value,
    office: employee.querySelector('[data-qa="office"]').value,
    age: employee.querySelector('[data-qa="age"]').value,
    salary: employee.querySelector('[data-qa="salary"]').value,
  };

  function checkInputParameters(inputs) {
    let emptyItem = '';

    for (const [key, value] of Object.entries(inputs)) {
      if (key === 'position') {
        if (!value.trim()) {
          notificationMessage('Please indicate your position', 'error');

          return false;
        }
      }

      if (!value.trim()) {
        emptyItem = `${key}`;

        notificationMessage(
          `${emptyItem.toUpperCase()} is empty, fill it in`,
          'warning',
        );

        return false;
      }

      if (key === 'name') {
        if (value.trim().length < 4) {
          notificationMessage('Your name is less than 4 characters', 'error');

          return false;
        }
      }

      if (key === 'age') {
        if (parseInt(value) < 18 || parseInt(value) > 90) {
          notificationMessage('Allowed age is between 18 and 90', 'error');

          return false;
        }
      }
    }

    return true;
  }

  if (checkInputParameters(valuesOfInputs)) {
    const row = document.createElement('tr');

    for (const [key, value] of Object.entries(valuesOfInputs)) {
      const cell = document.createElement('td');

      if (key === 'salary') {
        cell.textContent = formatCurrency(value);
      } else {
        cell.textContent = value;
      }

      row.appendChild(cell);
    }

    tbody.appendChild(row);

    notificationMessage('Adding successfully', 'success');

    e.preventDefault();

    employee.reset();
  }

  e.preventDefault();
});
// #endregion

// #region sorting rows
function sortedBodyRows(rows, index, nameOfCell) {
  if (nameOfCell === 'Age' || nameOfCell === 'Salary') {
    rows.sort(
      (a, b) =>
        stringToNumber(a.children[index].textContent) -
        stringToNumber(b.children[index].textContent),
    );
  } else {
    rows.sort((a, b) => {
      return a.children[index].textContent.localeCompare(
        b.children[index].textContent,
      );
    });
  }

  return rows;
}

// #endregion

// #region formatting a string to a number
function stringToNumber(str) {
  if (str.includes(',')) {
    return parseInt(
      str
        .split('')
        .filter((el) => Number.isInteger(parseInt(el)))
        .join(''),
    );
  } else {
    return parseInt(str);
  }
}
// #endregion

// #region activity class switch
[...tbody.querySelectorAll('tr')].forEach((row, index) => {
  row.addEventListener('click', () => {
    if (indexOfRow !== index) {
      [...tbody.querySelectorAll('tr')].forEach((element) => {
        element.classList.remove('active');
      });
    }
    indexOfRow = index;

    row.classList.add('active');
  });
});
// #endregion

// #region sorting in two directions
cellsOfHead.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (clicksOnHeadCells % 2 === 0 && indexOfHeadCells === index) {
      sortedBodyRows([...tbody.querySelectorAll('tr')], index, cell.textContent)
        .reverse()
        .forEach((row) => {
          tbody.appendChild(row);
        });

      clicksOnHeadCells--;
    } else {
      sortedBodyRows(
        [...tbody.querySelectorAll('tr')],
        index,
        cell.textContent,
      ).forEach((row) => {
        tbody.appendChild(row);
      });

      clicksOnHeadCells++;
    }

    indexOfHeadCells = index;
  });
});
// #endregion

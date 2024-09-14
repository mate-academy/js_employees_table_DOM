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
  }, 10000);
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
  const inputName = employee.querySelector('[data-qa="name"]');
  const inputPosition = employee.querySelector('[data-qa="position"]');
  const inputOffice = employee.querySelector('[data-qa="office"]');
  const inputAge = employee.querySelector('[data-qa="age"]');
  const inputSalary = employee.querySelector('[data-qa="salary"]');

  const valuesOfInputs = [
    inputName,
    inputPosition,
    inputOffice,
    inputAge,
    inputSalary,
  ];

  if (
    inputName.value.trim() !== '' &&
    inputName.value.length >= 4 &&
    inputAge.value.trim() !== '' &&
    parseInt(inputAge.value) >= 18 &&
    parseInt(inputAge.value) <= 90 &&
    inputPosition.value !== '' &&
    inputSalary.value !== ''
  ) {
    const row = document.createElement('tr');

    valuesOfInputs.forEach((input) => {
      const cell = document.createElement('td');

      if (input.getAttribute('data-qa') === 'salary') {
        cell.textContent = formatCurrency(input.value);
      } else {
        cell.textContent = input.value;
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);

    notificationMessage('Adding successfully', 'success');

    employee.reset();
  } else {
    if (inputName.value.length < 4) {
      notificationMessage('Name length is less than 4 characters', 'error');
    }

    if (parseInt(inputAge.value) < 18) {
      notificationMessage('Your age is too young :(', 'error');
    }

    if (parseInt(inputAge.value) > 90) {
      notificationMessage('Your age is too old :(', 'error');
    }

    if (inputPosition.value.trim() === '') {
      notificationMessage('Indicate position :(', 'error');
    }
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

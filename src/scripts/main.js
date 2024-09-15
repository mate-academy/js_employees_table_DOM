'use strict';

const table = document.querySelector('table');
const header = document.querySelector('thead');
const categories = header.querySelector('tr');
const tbody = [...table.tBodies][0];
const rows = tbody.rows;

// sorting
categories.addEventListener('click', (e) => {
  const sorted = e.target.classList.contains('ascending')
    ? sortDesc(e.target, rows, e.target.cellIndex)
    : sortAsc(e.target, rows, e.target.cellIndex);

  tbody.append(...sorted);
});

function sortAsc(target, collection, i) {
  const title = target.textContent;
  const array = [...collection];

  switch (true) {
    case (title === 'Name' || title === 'Position' || title === 'Office') :

      array.sort((a, b) => {
        const aWord = [...a.cells][i].textContent;
        const bWord = [...b.cells][i].textContent;

        return aWord.localeCompare(bWord);
      });

      break;

    case (title === 'Age') :
      array.sort((a, b) => {
        return [...a.cells][i].textContent - [...b.cells][i].textContent;
      });

      break;

    case (title === 'Salary') :
      array.sort((a, b) => {
        const aConverted = xChange([...a.cells][i].textContent);
        const bConverted = xChange([...b.cells][i].textContent);

        return aConverted - bConverted;
      });

      break;
  }

  [...categories.cells].forEach(cell => cell.classList.remove('ascending'));

  target.classList.add('ascending');

  return array;
}

function sortDesc(target, collection, i) {
  const title = target.textContent;
  const array = [...collection];

  switch (true) {
    case (title === 'Name' || title === 'Position' || title === 'Office') :

      array.sort((a, b) => {
        const aWord = [...a.cells][i].textContent;
        const bWord = [...b.cells][i].textContent;

        return bWord.localeCompare(aWord);
      });

      break;

    case (title === 'Age') :
      array.sort((a, b) => {
        return [...b.cells][i].textContent - [...a.cells][i].textContent;
      });

      break;

    case (title === 'Salary') :
      array.sort((a, b) => {
        const aConverted = xChange([...a.cells][i].textContent);
        const bConverted = xChange([...b.cells][i].textContent);

        return bConverted - aConverted;
      });

      break;
  }

  target.classList.remove('ascending');

  return array;
}

function xChange(val) {
  return !isNaN(val)
    ? val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 2,
    })
    : +val.split(',').join('').replace('$', '');
}

// active row
tbody.addEventListener('click', (e) => {
  [...rows].forEach(row => row.classList.remove('active'));
  e.target.parentNode.classList.add('active');
});

// form
const form = document.createElement('form');

form.className = 'new-employee-form';

form.insertAdjacentHTML('afterbegin',
  `<label >
    Name:
    <input name = "name" data-qa="name" type="text">
  </label>

  <label>
    Position:
    <input name="position" data-qa="position" type="text">
  </label>

  <label>
    Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label>
    Age:
    <input name="age" data-qa="age" type="number">
  </label>

  <label>
    Salary:
    <input name="salary" data-qa="salary" type="number">
  </label>

  <button id="button" type="submit">
    Save to table
  </button>
  `
);

document.body.append(form);

const button = document.querySelector('#button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const employeeForm = button.parentNode;
  const { name: firstName,
    position,
    office,
    age,
    salary } = employeeForm.elements;

  const newEmployee = {
    firstName,
    position,
    office,
    age,
    salary,
  };

  if (validateForm(newEmployee)) {
    const newRow = document.createElement('tr');

    newRow.insertAdjacentHTML('afterbegin',
      `<td>${firstName.value}</td>
      <td>${position.value}</td>
      <td>${office.value}</td>
      <td>${age.value}</td>
      <td>${xChange(+salary.value)}</td>`
    );

    tbody.append(newRow);

    pushNotification(10, 10,
      'Succesfully added',
      'New employee is successfully added',
      'success');
  }
});

function validateForm(obj) {
  const { firstName, age } = obj;

  for (const key in obj) {
    if (!obj[key].value) {
      pushNotification(10, 10,
        'All fields are required',
        'Not all fiealds are filled in',
        'error');

      return false;
    }
  }

  if (firstName.value.length < 4) {
    pushNotification(10, 10,
      'Invalid name',
      'Name should have at least 4 charachters',
      'error');

    return false;
  }

  if (+age.value < 18 || +age.value > 90) {
    pushNotification(10, 10,
      'Invalid age',
      'Age should be at least 18 and less than 90',
      'error');

    return false;
  }

  return true;
}

function pushNotification(posTop, posRight, title, description, type) {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.dataset.qa = 'notification';

  div.insertAdjacentHTML('afterbegin',
    `<h2 class="title">${title}</h2>
    <p>${description}</p>`);

  body.append(div);

  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  setTimeout(() => {
    div.remove();
  }, 2000);

  return div;
};

// editing
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const initial = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  cell.textContent = '';
  cell.append(input);
  input.focus();

  input.addEventListener('keydown', (inputE) => {
    const newValue = `${inputE.target.value}`;

    input.setAttribute('value', newValue);

    if (inputE.code === 'Enter') {
      insertNew(newValue);
    }
  });

  input.addEventListener('blur', (blurE) => {
    const newValue = `${blurE.target.value}`;

    input.setAttribute('value', newValue);
    insertNew(newValue);
  });

  function insertNew(value) {
    if (value === '') {
      cell.textContent = initial;
    } else {
      cell.textContent = value;
      input.remove();
    }
  }
});

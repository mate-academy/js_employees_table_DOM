'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const tRows = tbody.rows;

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < tRows.length; i++) {
  tRows[i].cells[0].classList.add('name');
  tRows[i].cells[1].classList.add('position');
  tRows[i].cells[2].classList.add('office');
  tRows[i].cells[3].classList.add('age');
  tRows[i].cells[4].classList.add('salary');
};

let counter = 0;

const getSort = (ev) => {
  const item = ev.target.closest('th');

  if (!item) {
    return;
  };

  const number = item.cellIndex;

  counter++;

  if (counter === 1) {
    const sorted = [...tbody.rows].sort((a, b) => {
      const aValue = a.cells[number].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[number].innerText.replace(/[$,]/g, '');

      if (!isNaN(aValue)) {
        return aValue - bValue;
      } else {
        return aValue.localeCompare(bValue);
      };
    });

    tbody.append(...sorted);
  } else {
    const sorted = [...tbody.rows].sort((a, b) => {
      const aValue = a.cells[number].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[number].innerText.replace(/[$,]/g, '');

      if (!isNaN(aValue)) {
        return bValue - aValue;
      } else {
        return bValue.localeCompare(aValue);
      };
    });

    tbody.append(...sorted);
    counter = 0;
  };
};

table.addEventListener('click', getSort);

const makeActiveRow = (e) => {
  const item = e.target.parentNode;
  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  item.classList.add('active');
};

body.insertAdjacentHTML('beforeend', `<form class = "new-employee-form">
  <label>Name:
    <input name="name" type="text" data-qa="name" minlength = "4" id="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position" id="position">
  </label>
  <label>Office:
    <select data-qa="office" id="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input
      name="age" type="number" data-qa="age" min = "18" max = "90" id="age"
    >
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" id="salary">
  </label>
  <button class="form-button" type="submit">Save to table</button>
</form>`);

const formNewEmployee = document.querySelector('.new-employee-form');
const inputs = formNewEmployee.querySelectorAll('input');
const submit = formNewEmployee.querySelector('.form-button');

for (const input of inputs) {
  input.setAttribute('required', true);
}

body.insertAdjacentHTML('beforeend', `
  <div class="notification success">
    <h2 class='title'>Success message</h2>
    <p class='description'>New employee is successfully added to the table</p>
  </div>
  <div class="notification error">
    <h2 class='title'>Error message</h2>
    <p class='description'>Correct the mistakes</p>
  </div>
`);

const messages = document.querySelectorAll('.notification');

for (const message of messages) {
  message.setAttribute('hidden', true);
  message.setAttribute('data-qa', 'notification');
}

const successNotification = document.querySelector('.success');
const errorNotification = document.querySelector('.error');

function showError() {
  for (const input of inputs) {
    if (input.validity.valueMissing) {
    // Если поле пустое, отображаем следующее сообщение об ошибке
      if (!errorNotification.querySelector('.noValue')) {
        errorNotification.insertAdjacentHTML('beforeend', `
          <p class="noValue">All fields must be filled</p>
        `);
        break;
      }
    } else if (input.validity.tooShort) {
    // Если имя слишком короткое
      if (!errorNotification.querySelector('.tooShort')) {
        errorNotification.insertAdjacentHTML('beforeend', `
          <p class="tooShort">Name must contain at least 4 characters</p>
        `);
      }
    } else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
    // Если возраст менее 18 лет или старше 90 лет
      errorNotification.insertAdjacentHTML('beforeend', `<p class="description">
        Age must be over 18 years old and less than 90 years
      </p>`);
    } else if (input.validity.typeMismatch) {
      // Если тип не соответстует заявленному
      errorNotification.insertAdjacentHTML('beforeend', `
        <p class="description">Fields age and salary must be of numeric type</p>
      `);
    }
    errorNotification.removeAttribute('hidden');
  };

  setTimeout(() => {
    errorNotification.setAttribute('hidden', true);
  }, 2000);
}

const saveToTable = (evForm) => {
  evForm.preventDefault();

  formNewEmployee.noValidate = true;

  for (const input of inputs) {
    if (input.validity.valid) {
      counter++;
    } else {
      showError();
    };
  }

  if (counter === inputs.length) {
    successNotification.removeAttribute('hidden');

    setTimeout(() => {
      successNotification.setAttribute('hidden', true);
    }, 2000);

    tbody.append(getData());

    for (const input of inputs) {
      input.value = '';
    };
  }

  function getData() {
    const newRows = tRows[0].cloneNode(true);

    newRows.cells[0].textContent = document.getElementById('name').value;
    newRows.cells[1].textContent = document.getElementById('position').value;
    newRows.cells[2].textContent = document.getElementById('office').value;
    newRows.cells[3].textContent = document.getElementById('age').value;

    const salaryValue = document.getElementById('salary').value;
    const valueDollar = Number(salaryValue).toLocaleString('en-EN', {
      style: 'currency', currency: 'USD',
    });

    newRows.cells[4].textContent = valueDollar.slice(0, valueDollar.length - 3);

    return newRows;
  }
};

submit.addEventListener('click', saveToTable);

const editCells = (cell) => {
  const activeCell = cell.target;

  const oldValue = activeCell.innerText;

  activeCell.innerText = '';

  const createSelect = () => {
    const select = document.createElement('select');

    select.classList.add('cell-input');

    for (const office of offices) {
      const option = document.createElement('option');

      option.innerText = office;
      select.append(option);
    };

    activeCell.append(select);
    select.focus();
  };

  const createInput = () => {
    const inputCell = document.createElement('input');

    inputCell.classList.add('cell-input');
    inputCell.setAttribute('value', oldValue);
    activeCell.append(inputCell);

    if (activeCell.classList.contains('name')) {
      inputCell.setAttribute('type', 'text');
      inputCell.setAttribute('minlenght', 4);
    }

    if (activeCell.classList.contains('position')) {
      inputCell.setAttribute('type', 'text');
    }

    if (activeCell.classList.contains('age')) {
      inputCell.setAttribute('type', 'number');
      inputCell.setAttribute('min', 18);
      inputCell.setAttribute('max', 90);
    }

    inputCell.focus();

    const saveChanges = () => {
      if (inputCell.value.length === 0) {
        activeCell.innerText = oldValue;
      };

      if (activeCell.classList.contains('salary')) {
        for (const char of inputCell.value) {
          if (typeof char !== 'number') {
            errorNotification.innerText = 'Salary must be of numeric type';

            setTimeout(() => {
              errorNotification.setAttribute('hidden', true);
            }, 2000);
            activeCell.innerText = oldValue;
            errorNotification.removeAttribute('hidden');
          } else {
            const valueSal = Number(inputCell.value).toLocaleString('en-EN', {
              style: 'currency', currency: 'USD',
            });

            activeCell.innerText = valueSal.slice(0, valueSal.length - 3);
            errorNotification.innerText = '';
          }
        }
      };

      if (activeCell.classList.contains('age')) {
        if (inputCell.value < 18 || inputCell.value > 90) {
          errorNotification.innerText = `
            Age must be over 18 years old and less than 90 years
          `;

          setTimeout(() => {
            errorNotification.setAttribute('hidden', true);
          }, 2000);
          activeCell.innerText = oldValue;
          errorNotification.removeAttribute('hidden');
        } else {
          activeCell.innerText = inputCell.value;
          errorNotification.innerText = '';
        }
      }

      if (activeCell.classList.contains('name')) {
        if (inputCell.value.length < 4) {
          errorNotification.innerText = `
            Name must contain at least 4 characters
          `;

          setTimeout(() => {
            errorNotification.setAttribute('hidden', true);
          }, 2000);
          activeCell.innerText = oldValue;
          errorNotification.removeAttribute('hidden');
        } else {
          activeCell.innerText = inputCell.value;
          errorNotification.innerText = '';
        }
      }

      if (activeCell.classList.contains('position')) {
        activeCell.innerText = inputCell.value;
      }
    };

    inputCell.addEventListener('blur', function() {
      saveChanges();
    });

    inputCell.addEventListener('keydown', evKey => {
      if (evKey.code === 'Enter') {
        saveChanges();
      }
    });
  };

  if (activeCell.classList.contains('office')) {
    createSelect();
  } else {
    createInput();
  };
};

tbody.addEventListener('click', makeActiveRow);
tbody.addEventListener('dblclick', editCells);

'use strict';

const body = document.querySelector('body');

body.insertAdjacentHTML('beforeend', `<form></form>`);

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const form = document.querySelector('form');
let sortedName = false;
let sortedPosition = false;
let sortedOffice = false;
let sortedAge = false;
let sortedSalary = false;

const checkDuplicateName = (inputName) => {
  const actualRows = [...tbody.rows];

  return actualRows.some((row) => row.children[0].textContent === inputName);
};

// highlight for row

const eventRow = (ev) => {
  const targetRow = ev.target.closest('tr');

  [...tbody.rows].forEach((row) => row.classList.remove('active'));
  targetRow.classList.add('active');
};

tbody.addEventListener('click', eventRow);

// sort switch

table.addEventListener('click', (ev) => {
  const targetTh = ev.target.closest('th');
  const rows = [...tbody.rows];

  if (!targetTh) {
    return;
  }

  if (targetTh) {
    switch (targetTh.textContent) {
      case 'Name':
        if (sortedName) {
          rows.sort(function (a, b) {
            return b.children[0].textContent.localeCompare(
              a.children[0].textContent,
            );
          });
        }

        if (!sortedName) {
          rows.sort(function (a, b) {
            return a.children[0].textContent.localeCompare(
              b.children[0].textContent,
            );
          });
        }

        sortedName = !sortedName;

        break;
      case 'Position':
        if (sortedPosition) {
          rows.sort(function (a, b) {
            return b.children[1].textContent.localeCompare(
              a.children[1].textContent,
            );
          });
        }

        if (!sortedPosition) {
          rows.sort(function (a, b) {
            return a.children[1].textContent.localeCompare(
              b.children[1].textContent,
            );
          });
        }

        sortedPosition = !sortedPosition;

        break;
      case 'Office':
        if (sortedOffice) {
          rows.sort(function (a, b) {
            return b.children[2].textContent.localeCompare(
              a.children[2].textContent,
            );
          });
        }

        if (!sortedOffice) {
          rows.sort(function (a, b) {
            return a.children[2].textContent.localeCompare(
              b.children[2].textContent,
            );
          });
        }

        sortedOffice = !sortedOffice;

        break;
      case 'Age':
        if (sortedAge) {
          rows.sort(function (a, b) {
            const ageA = Number(a.children[3].textContent);
            const ageB = Number(b.children[3].textContent);

            return ageB - ageA;
          });
        }

        if (!sortedAge) {
          rows.sort(function (a, b) {
            const ageA = Number(a.children[3].textContent);
            const ageB = Number(b.children[3].textContent);

            return ageA - ageB;
          });
        }

        sortedAge = !sortedAge;

        break;
      case 'Salary':
        rows.sort(function (a, b) {
          const salaryA = parseFloat(
            a.children[4].textContent.replace(/[$,]/g, ''),
          );
          const salaryB = parseFloat(
            b.children[4].textContent.replace(/[$,]/g, ''),
          );

          if (sortedSalary) {
            return salaryB - salaryA;
          }

          if (!sortedSalary) {
            return salaryA - salaryB;
          }
        });

        sortedSalary = !sortedSalary;
        break;
    }
  }

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
});

// new form
form.classList.add('new-employee-form');

form.insertAdjacentHTML(
  'beforeend',
  `<label>Name: <input data-qa="name" name="name" type="text" style="text-transform: capitalize;" minlength="4" pattern="[A-Za-zА-Яа-яЁёs ]+"></label>
  <label>Position: <input data-qa="position" name="position" type="text" style="text-transform: capitalize;" pattern="[A-Za-zА-Яа-яЁёs ]+" required></label>
  <label>Office: <select data-qa="office" name="office" id="selectedCountry">
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
  </select></label>
  <label>Age: <input data-qa="age"  name="age" type="number" min="18" max="90" required></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number" id="salaryInp" min="0" required></label>
  <button type="button">Save to table</button>`,
);

const salaryValue = document.getElementById('salaryInp');

salaryValue.addEventListener('input', (ev) => {
  const value = ev.target.value;

  parseFloat(value);
});

// send the form
const button = document.querySelector('button');

button.addEventListener('click', (ev) => {
  ev.preventDefault();

  const notifications = document.querySelectorAll(
    'span[data-qa="notification"]',
  );

  if (notifications.length) {
    notifications.forEach((note) => note.remove());
  }

  const employeeName = document.querySelector('input[name="name"]');
  const employeePos = document.querySelector('input[name="position"]');
  const employeeOffice = document.getElementById('selectedCountry');
  const employeeAge = document.querySelector('input[name="age"]');
  const employeeSalary = document.querySelector('input[name="salary"]');

  const isValidName = employeeName.checkValidity();
  const isValidPosition = employeePos.checkValidity();
  const isValidAge = employeeAge.checkValidity();
  const isValidSalary = employeeSalary.checkValidity();
  const isNameDuplicate = checkDuplicateName(employeeName.value);

  if (
    isValidName &&
    isValidPosition &&
    isValidAge &&
    isValidSalary &&
    !isNameDuplicate
  ) {
    tbody.insertAdjacentHTML(
      'beforeend',
      `<tr class="newRow">
        <td>${employeeName.value}</td>
        <td>${employeePos.value}</td>
        <td>${employeeOffice.value}</td>
        <td>${employeeAge.value}</td>
        <td>$${parseInt(employeeSalary.value).toLocaleString('en-US')}</td>
      </tr>`,
    );

    form.insertAdjacentHTML(
      'beforeend',
      `<span data-qa="notification" class="success" style="color: green; margin-top: 5px; text-align: center">A new employee is successfully added</span>`,
    );
  } else {
    if (!isValidName) {
      form.insertAdjacentHTML(
        'beforeend',
        `<span data-qa="notification" class="error" style="color: red; margin-top: 5px; text-align: center">Enter a valid name</span>`,
      );
    }

    if (!isValidPosition) {
      form.insertAdjacentHTML(
        'beforeend',
        `<span data-qa="notification" class="error" style="color: red; margin-top: 5px; text-align: center">Enter a valid position</span>`,
      );
    }

    if (!isValidAge) {
      form.insertAdjacentHTML(
        'beforeend',
        `<span data-qa="notification" class="error" style="color: red; margin-top: 5px; text-align: center">Enter a valid age</span>`,
      );
    }

    if (!isValidSalary) {
      form.insertAdjacentHTML(
        'beforeend',
        `<span data-qa="notification" class="error" style="color: red; margin-top: 5px; text-align: center">Enter a valid salary</span>`,
      );
    }

    if (isNameDuplicate) {
      form.insertAdjacentHTML(
        'beforeend',
        `<span data-qa="notification" class="error" style="color: red; margin-top: 5px; text-align: center">This employee is already registered</span>`,
      );
    }
  }
});

// change cell information

tbody.addEventListener('dblclick', (ev) => {
  const targetCell = ev.target.closest('td');
  const lastValue = targetCell.textContent;

  if (!targetCell) {
    return;
  }

  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  newInput.value = targetCell.textContent;
  targetCell.textContent = '';
  targetCell.append(newInput);
  // targetCell.replaceWith(newInput);

  // const newTD = document.createElement('td');

  let isEnterPressed = false;

  newInput.addEventListener('blur', () => {
    if (!isEnterPressed) {
      replaceInput();
    }
  });

  newInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      isEnterPressed = true;
      replaceInput();
    }
  });

  function replaceInput() {
    if (newInput.value.length !== 0) {
      targetCell.textContent = newInput.value;
      newInput.remove();
    } else {
      targetCell.textContent = lastValue;
      newInput.remove();
    }
  }
});

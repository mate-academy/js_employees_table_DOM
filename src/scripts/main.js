'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tbodyRows = [ ...tbody.rows ];
let clickedTitle = '';
let activeRow;

function fillSelect(selector) {
  const office
= ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

  for (const city of office) {
    const option = document.createElement('option');

    option.textContent = city;

    selector.append(option);
  }
}

function convertSalaryToTable(salary) {
  return '$' + (+salary).toLocaleString('ru-RU', { minimumFractionDigits: 3 });
}

/* -----add a form to the document----- */
const form = document.createElement('form');

form.className = 'new-employee-form';

form.insertAdjacentHTML('beforeend', `
  <label>
    Name:
    <input name="name" type="text">
  </label>

  <label>
    Position:
    <input name="position" type="text">
  </label>

  <label>
    Office:
    <select name="office">
    </select>
  </label>

  <label>
    Age:
    <input name="age" type="number">
  </label>

  <label>
    Salary:
    <input name="salary" type="number">
  </label>

  <button type="submit">
    Save to table
  </button>
`);

body.append(form);

const officeLabel = document.querySelector('select');

fillSelect(officeLabel);

for (const el of form) {
  if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
    el.dataset.qa = el.name;
    el.required = true;
  }
}

/* -----Show notification if form data is invalid and add new employee----- */

const pushNotification = (employeeName, employeeAge) => {
  const div = document.createElement('div');
  let haveError = false;

  div.classList = `notification`;

  if (employeeName && employeeName.length < 4) {
    div.insertAdjacentHTML('afterbegin', `
    <h2 class='title'>Error message</h2>
    <p>Name can not be less then 4 chars</p>
  `);
    div.classList.add('error');

    haveError = true;
  }

  if (employeeAge && (employeeAge < 18 || employeeAge > 90)) {
    div.insertAdjacentHTML('afterbegin', `
    <h2 class='title'>Error message</h2>
    <p>Age should be from 18 to 90 years old</p>
  `);
    div.classList.add('error');

    haveError = true;
  }

  if (haveError === false) {
    div.insertAdjacentHTML('afterbegin', `
    <h2 class='title'>Success message</h2>
    <p>You have successfully added an employee</p>
  `);
    div.classList.add('success');
  }

  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);

  return !haveError;
};

form.addEventListener('click', (eventObj) => {
  eventObj.preventDefault();

  const target = eventObj.target.closest('button');

  if (!target) {
    return;
  }

  pushNotification(form.elements.name.value, form.elements.age.value);

  if (form.elements.name.value.length < 4
      || form.elements.age.value < '18'
      || form.elements.age.value > '90') {
    return;
  } else {
    const newRow = document.createElement('tr');

    newRow.insertAdjacentHTML('beforeend', `
     <td>${form.elements.name.value}</td>
     <td>${form.elements.position.value}</td>
     <td>${form.elements.office.value}</td>
     <td>${form.elements.age.value}</td>
     <td>
       ${convertSalaryToTable(form.elements.salary.value)}
     </td>
   `);

    tbody.append(newRow);
  }

  form.elements.name.value = '';
  form.elements.position.value = '';
  form.elements.age.value = '';
  form.elements.salary.value = '';
});

/* -----Implement editing of table cells by double-clicking on it----- */

tbody.addEventListener('dblclick', (eventObj) => {
  const target = eventObj.target.closest('td');

  if (!target) {
    return;
  }

  const saveData = target.textContent;
  let editor;
  const cellIndex = target.cellIndex;

  if (target.cellIndex === 2) {
    editor = document.createElement('select');
    fillSelect(editor);
  } else {
    editor = document.createElement('input');
  }

  editor.className = 'cell-input';
  editor.style.width = (target.offsetWidth - 36) + 'px';
  target.textContent = '';
  editor.value = saveData;

  if (target.cellIndex === 3 || target.cellIndex === 4) {
    editor.type = 'number';
  }

  if (target.cellIndex === 4) {
    editor.value = +saveData.slice(1).replace(',', '.');
  }

  target.append(editor);
  editor.focus();

  editor.addEventListener('blur', action);
  editor.addEventListener('keydown', action);

  function action(e) {
    if (e.key === 'Enter' || e.type === 'blur') {
      let inputValue = editor.value;
      let isSuccess = true;

      switch (cellIndex) {
        case 0:
          isSuccess = pushNotification(inputValue);
          break;

        case 3:
          isSuccess = pushNotification(undefined, inputValue);
          break;

        default:
          pushNotification();
      }

      if (inputValue.length === 0 || !isSuccess) {
        inputValue = saveData;
      } else {
        if (cellIndex === 4) {
          inputValue = convertSalaryToTable(inputValue);
        }
      }

      target.textContent = inputValue;
      editor.remove();
    }
  };
});

/* -----table sorting by clicking on the title----- */

thead.addEventListener('click', (eventObj) => {
  const target = eventObj.target;

  if (!target) {
    return;
  }

  const i = target.cellIndex;

  switch (true) {
    case (i <= 2):
      if (target.innerText !== clickedTitle) {
        clickedTitle = target.innerText;

        tbodyRows.sort((row1, row2) =>
          row1.cells[i].innerText.localeCompare(row2.cells[i].innerText));
      } else {
        clickedTitle = '';

        tbodyRows.sort((row1, row2) =>
          row2.cells[i].innerText.localeCompare(row1.cells[i].innerText));
      }
      break;

    case (i === 3):
      if (target.innerText !== clickedTitle) {
        clickedTitle = target.innerText;

        tbodyRows.sort((row1, row2) => {
          const a = +row1.cells[i].innerText;
          const b = +row2.cells[i].innerText;

          return a - b;
        });
      } else {
        clickedTitle = '';

        tbodyRows.sort((row1, row2) => {
          const a = +row1.cells[i].innerText;
          const b = +row2.cells[i].innerText;

          return b - a;
        });
      }

      break;

    case (i === 4):
      if (clickedTitle !== target.innerText) {
        clickedTitle = target.innerText;

        tbodyRows.sort((row1, row2) => {
          const a = +row1.cells[i].innerText.slice(1).replace(',', '.');
          const b = +row2.cells[i].innerText.slice(1).replace(',', '.');

          return a - b;
        });
      } else {
        clickedTitle = '';

        tbodyRows.sort((row1, row2) => {
          const a = +row1.cells[i].innerText.slice(1).replace(',', '.');
          const b = +row2.cells[i].innerText.slice(1).replace(',', '.');

          return b - a;
        });

        break;
      }
  }

  tbody.append(...tbodyRows);
});

/* -----selected row----- */

tbody.addEventListener('click', (eventObj) => {
  const target = eventObj.target.closest('tr');

  if (activeRow && activeRow.className === 'active') {
    activeRow.className = '';
  }

  activeRow = target;

  target.className = 'active';
});

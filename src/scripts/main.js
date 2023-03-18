'use strict';

const tableBlock = document.querySelector('table');

const getNumbers = (num) => {
  return num.replaceAll(',', '').replace('$', '');
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const dataType = (value) => isNaN(+getNumbers(value)) ? 'string' : 'number';

const pushNotification = (posTop, posRight, title, description, type) => {
  document.body.insertAdjacentHTML('beforeend', `
    <div class='notification ${type}' data-qa='notification'>
      <h2 class='title'>${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const messageBlock = document.querySelector(`.${type}`);

  messageBlock.style.top = `${posTop}px`;
  messageBlock.style.right = `${posRight}px`;

  setTimeout(function() {
    messageBlock.remove();
  }, 1000);
};

function cellEditing(table) {
  const body = table.tBodies[0];

  body.addEventListener('dblclick', e => {
    const cell = e.target;
    const cellValue = e.target.textContent;

    cell.innerHTML = `
      <form name="cell-editing-form">
        <input class="cell-input">
      </form>
    `;

    const form = document.forms['cell-editing-form'];
    const input = form.elements[0];
    const handlerSubmit = (ev) => {
      ev.preventDefault();

      if (input.value) {
        if (dataType(cellValue) !== dataType(input.value)) {
          pushNotification(430, 255, 'Помилка',
            'Невірний тип даних введення', 'error');
          cell.textContent = cellValue;
        } else {
          cell.textContent = input.value;

          if (cellValue.includes('$')) {
            cell.textContent = formatter.format(input.value);
          }
        }
      } else {
        cell.textContent = cellValue;
      };
      form.remove();
    };

    input.focus();
    input.addEventListener('blur', handlerSubmit);
    form.addEventListener('submit', handlerSubmit);
  });
};

function addForm(table) {
  table.insertAdjacentHTML('afterend', `
  <form class="new-employee-form" name="add-table-row">
  <label>Name: <input
    name="name"
    type="text"
    data-qa="name"
    required>
  </label>

  <label>Position: <input
    name="position"
    type="text"
    data-qa="position"
    required>
  </label>

  <label>Office:
    <select
      name="office"
      data-qa="office"
      required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label>Age: <input
    name="age"
    type="text"
    data-qa="age"
    pattern='\\d+'
    required>
  </label>

  <label>Salary: <input
    name="salary"
    type="text"
    data-qa="salary"
    pattern='\\d+'
    required>
  </label>

  <button type="submit">Save to table</button>
</form>
  `);

  const form = document.forms['add-table-row'];
  const handlerSabmit = (e) => {
    e.preventDefault();

    const newName = form.elements.name.value;
    const position = form.elements.position.value;
    const office = form.elements.office.value;
    const age = form.elements.age.value;
    const salary = form.elements.salary.value;

    const minLenghtName = 4;
    const minAge = 18;
    const maxAge = 90;

    switch (true) {
      case String(newName).length < minLenghtName || newName[0] === ' ':
        pushNotification(430, 255, 'Помилка',
          'Довжина імені не може бути менше 4 літер', 'error');
        e.target.reset();
        break;

      case age < minAge || age > maxAge:
        pushNotification(430, 255, 'Помилка',
          'Вік не може бути менше 18 та більше 90', 'error');
        e.target.reset();
        break;

      default:
        const tableBody = tableBlock.querySelector('tbody');

        tableBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${newName}</td>
            <td>${position}</td>
            <td>${office}</td>
            <td>${age}</td>
            <td>${formatter.format(salary)}</td>
          </tr>
        `);

        e.target.reset();

        pushNotification(430, 255, 'Успіх',
          'Співробітник Успішно доданий', 'success');
    };
  };

  form.addEventListener('submit', handlerSabmit);
};

function activeRow(table) {
  const body = table.tBodies[0];
  let prevTarget = null;

  body.addEventListener('click', e => {
    const target = e.target.parentElement;

    if (prevTarget !== target) {
      if (prevTarget) {
        prevTarget.classList.remove('active');
      }
      target.classList.add('active');
      prevTarget = target;
    };
  });
};

function sortTables(table) {
  const head = table.tHead;
  const body = table.tBodies[0];
  const bodyItems = body.children;

  let position;

  function toggleClasses() {
    let prevTarget = null;

    head.addEventListener('click', e => {
      const target = e.target;

      target.classList.toggle('desc');

      if (prevTarget !== target) {
        if (prevTarget) {
          prevTarget.classList.remove('desc');
        }
        target.classList.toggle('desc');
        prevTarget = target;
      };
    });
  };
  toggleClasses(tableBlock);

  function sortHandler(e) {
    const item = e.target;

    position = item.cellIndex;

    const sortedNumbersAsc = (el1, el2) => {
      return getNumbers(el1.children[position].innerText)
        - getNumbers(el2.children[position].innerText);
    };

    const sortedStringsAsc = (el1, el2) => {
      return el1.children[position].innerText
        .localeCompare(el2.children[position].innerText);
    };

    function addSortedList(callback) {
      return [...bodyItems].sort(callback);
    }

    const type = dataType(bodyItems[0].children[position].textContent);

    switch (type) {
      case 'number':
        if (item.className === 'desc') {
          body.append(...addSortedList(sortedNumbersAsc).reverse());
        } else {
          body.append(...addSortedList(sortedNumbersAsc));
        }
        break;

      case 'string':
        if (item.className === 'desc') {
          body.append(...addSortedList(sortedStringsAsc).reverse());
        } else {
          body.append(...addSortedList(sortedStringsAsc));
        }
        break;

      default:
        alert('Invalid data type');
    };
  };

  head.addEventListener('click', sortHandler);
};

addForm(tableBlock);
activeRow(tableBlock);
cellEditing(tableBlock);
sortTables(tableBlock);

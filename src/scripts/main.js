'use strict';

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');
const sortedCols = {};
let cellEditing = null;
let cellInput = null;
let initialCellText = '';
let selectedRow;

const getSalary = (salary) => {
  return salary.innerText.slice(1).split(',').join('');
};

const sortByText = (rowsArray, index, inverseSort) => {
  if (inverseSort === true) {
    rowsArray.sort((a, b) => -a.cells[index].innerText
      .localeCompare(b.cells[index].innerText));
  } else {
    rowsArray.sort((a, b) => a.cells[index].innerText
      .localeCompare(b.cells[index].innerText));
  }
};

const sortByAge = (rowsArray, index, inverseSort) => {
  if (inverseSort === true) {
    rowsArray.sort((a, b) => -(+a.cells[index].innerText
    - +b.cells[index].innerText));
  } else {
    rowsArray.sort((a, b) => +a.cells[index].innerText
    - +b.cells[index].innerText);
  }
};

const sortBySalary = (rowsArray, index, inverseSort) => {
  if (inverseSort === true) {
    rowsArray.sort((a, b) =>
      -(+getSalary(a.cells[index]) - +getSalary(b.cells[index]))
    );
  } else {
    rowsArray.sort((a, b) =>
      +getSalary(a.cells[index]) - +getSalary(b.cells[index])
    );
  }
};

const sortTable = (columnIndex, columnType) => {
  if (columnIndex === -1) {
    return;
  }

  const rows = [];
  let sortInversely;

  if (sortedCols[columnType] === 'ASC') {
    sortInversely = true;
    sortedCols[columnType] = 'DESC';
  } else {
    sortInversely = false;
    sortedCols[columnType] = 'ASC';
  }

  for (const row of tBody.rows) {
    rows.push(row);
  }

  switch (columnType) {
    case 'age':
      sortByAge(rows, columnIndex, sortInversely);
      break;

    case 'salary':
      sortBySalary(rows, columnIndex, sortInversely);
      break;

    default:
      sortByText(rows, columnIndex, sortInversely);
      break;
  }

  for (const row of rows) {
    tBody.append(row);
  }
};

const createForm = () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
  <label for="name">
    Name:
    <input id="name" data-qa="name" type="text" required>
  </label>
  <label for="position">
    Position:
    <input id="position" data-qa="position" type="text" required>
  </label>
  <label for="office">
    Office:
    <select id="office" data-qa="office" required>
      <option value="Tokyo">
        Tokyo
      </option>
      <option value="Singapore">
        Singapore
      </option>
      <option value="London">
        London
      </option>
      <option value="New York">
        New York
      </option>
      <option value="Edinburgh">
        Edinburgh
      </option>
      <option value="San Francisco">
        San Francisco
      </option>
    </select>
  </label>
  <label for="age">
    Age:
    <input id="age" data-qa="age" type="number" required>
  </label>
  <label for="salary">
    Salary:
    <input id="salary" data-qa="salary" type="number" required>
  </label>
  <button type="submit">Save to table</button>
  `;

  return form;
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const messageBlock = document.createElement('div');

  messageBlock.classList.add('notification', type);
  messageBlock.setAttribute('data-qa', 'notification');

  messageBlock.innerHTML = `
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `;

  messageBlock.style.top = posTop + 'px';
  messageBlock.style.right = posRight + 'px';

  document.querySelector('body').appendChild(messageBlock);

  setTimeout(() => {
    messageBlock.remove();
  }, 5000);
};

const employeeForm = createForm();
const submitBtn = employeeForm.querySelector('button');

document.querySelector('body').appendChild(employeeForm);

submitBtn.addEventListener('click', e => {
  e.preventDefault();

  const row = document.createElement('tr');
  const formName = employeeForm.querySelector('#name');
  const formPosition = employeeForm.querySelector('#position');
  const formOffice = employeeForm.querySelector('#office');
  const formAge = employeeForm.querySelector('#age');
  const formSalary = employeeForm.querySelector('#salary');
  const salary = +formSalary.value;
  let errorCount = 0;

  if (formPosition.value === '' || formSalary.value === '') {
    pushNotification(
      10,
      10,
      'All fields must be filled',
      `Some fields are not filled with values😕 `,
      'error'
    );
    errorCount++;
  }

  if (formName.value.trim().length < 4) {
    pushNotification(
      10,
      10,
      'Name is invalid',
      `Name is shorter than 4 letters, 
        ${formName.value} is to small...🤭 can you change it?🤔`,
      'error'
    );

    errorCount++;
  }

  if (formAge.value < 18 || formAge.value > 90) {
    pushNotification(
      errorCount > 0 ? errorCount * 140 + 10 : 10,
      10,
      'Age is invalid',
      `The person is too ${formAge.value < 18 ? 'young👶' : 'old🧓'}`,
      'error'
    );

    errorCount++;
  }

  if (errorCount === 0) {
    row.innerHTML = `
    <td>
      ${formName.value.trim()}
    </td>
    <td>
      ${formPosition.value.trim()}
    </td>
    <td>
      ${formOffice.value}
    </td>
    <td>
      ${formAge.value}
    </td>
    <td>
      $${salary.toLocaleString('en-US')}
    </td>
  `;

    tBody.appendChild(row);

    formName.value = '';
    formPosition.value = '';
    formOffice.value = 'Tokyo';
    formAge.value = '';
    formSalary.value = '';

    pushNotification(
      10,
      10,
      'New employee was successfully added',
      `🥳🍾🥂🎂`,
      'success'
    );
  }
});

table.addEventListener('click', e => {
  if (e.target.parentNode.parentNode !== table.querySelector('thead')) {
    return;
  }

  sortTable(
    [...e.target.parentNode.cells].indexOf(e.target),
    e.target.innerText.toLowerCase()
  );
});

tBody.addEventListener('click', e => {
  const row = e.target.closest('tr');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }
  row.classList.add('active');
  selectedRow = row;
});

tBody.addEventListener('dblclick', e => {
  if (cellEditing) {
    return;
  }
  cellEditing = e.target.closest('td');
  cellInput = document.createElement('input');
  cellInput.classList.add('cell-input');
  cellInput.value = cellEditing.innerText;
  initialCellText = cellEditing.innerText;
  cellEditing.innerText = '';
  cellEditing.append(cellInput);

  cellInput.addEventListener('blur', eInput => {
    if (cellInput.value.trim() !== '') {
      cellEditing.innerText = cellInput.value;
    } else {
      cellEditing.innerText = initialCellText;
    }
    cellInput.remove();
    cellEditing = null;
  });
});

tBody.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (cellInput.value !== '') {
      cellEditing.innerText = cellInput.value;
    } else {
      cellEditing.innerText = initialCellText;
    }
    cellInput.remove();
    cellEditing = null;
  }
});

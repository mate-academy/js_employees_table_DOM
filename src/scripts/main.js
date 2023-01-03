'use strict';

const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');

let currentSortIndex = null;
let selectedRow = null;

tableHead.addEventListener('click', e => {
  const index = e.target.cellIndex;

  if (index === currentSortIndex) {
    reverseTable();

    return;
  }

  sortTable(index);
  currentSortIndex = index;
});

const sortTable = sortIndex => {
  const sorted = [...tableBody.rows].sort((a, b) => {
    const aText = a.cells[sortIndex].innerText;
    const bText = b.cells[sortIndex].innerText;

    switch (sortIndex) {
      case 0:
      case 1:
      case 2:
        return aText.localeCompare(bText);
      case 3:
        return +aText - +bText;
      case 4:
        return +aText.replace(/\W/g, '')
          - +bText.replace(/\W/g, '');
      default:
        throw new Error('unexpected cell index');
    }
  });

  tableBody.append(...sorted);
};

const reverseTable = () => {
  const reversed = [...tableBody.rows].reverse();

  tableBody.append(...reversed);
};

const selectRow = row => {
  if (row === selectedRow) {
    return;
  }

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  row.classList.add('active');
  selectedRow = row;
};

tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  selectRow(row);
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input name="name" type="text" data-qa="name">
  </label>

  <label>
    Position:
    <input name="position" type="text" data-qa="position">
  </label>

  <label>
    Office:
    <select name="office" data-qa="office" required>
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
    <input name="age" type="number" data-qa="age">
  </label>

  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>

  <button type="submit">Save to table</button>`;

document.body.append(form);

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);

  for (const key of data.keys()) {
    const inputValue = data.get(key);

    if (!inputValue) {
      pushNotification(
        'Validation Error',
        `Please fill the ${key} field`,
        'error'
      );

      return;
    }

    switch (key) {
      case 'name':
        if (inputValue.length < 4) {
          pushNotification(
            'Validation Error',
            'Name should be at least 4 characters long',
            'error'
          );

          return;
        }
        break;

      case 'age':
        if (inputValue < 18 || inputValue > 90) {
          pushNotification(
            'Validation Error',
            'Age limit is from 18 to 90',
            'error'
          );

          return;
        }

        break;
      default:
        // do nothing;
    }
  }

  const rowToAppend = document.createElement('tr');

  rowToAppend.innerHTML = `
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${data.get('age')}</td>
    <td>${formatSalary(data.get('salary'))}</td>
  `;

  tableBody.append(rowToAppend);
  form.reset();

  pushNotification(
    'Success',
    'New employee was added to the table',
    'success'
  );
});

const formatSalary = salaryString =>
  '$' + Number(salaryString).toLocaleString('GB-en');

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  document.body.append(message);

  setTimeout(() => message.remove(), 2000);
};

tableBody.addEventListener('dblclick', e => {
  const cell = e.target;
  const initialValue = e.target.innerText;
  const cellIndex = cell.cellIndex;
  const cellInput = document.createElement('input');

  cellInput.className = 'cell-input';

  switch (cellIndex) {
    case 0:
    case 1:
    case 2:
      cellInput.setAttribute('type', 'text');
      break;
    case 3:
    case 4:
      cellInput.setAttribute('type', 'number');
      break;
    default:
      throw new Error('Invalid cell index');
  }

  cell.innerHTML = '';
  cell.append(cellInput);

  cellInput.addEventListener('blur', () => {
    let toSave = cellInput.value;

    if (cellIndex === 4) {
      toSave = formatSalary(toSave);
    }

    if (!cellInput.value) {
      toSave = initialValue;
    }

    cell.innerHTML = toSave;

    cellInput.value = '';
    cellInput.remove();
  });

  cellInput.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      cellInput.blur();
    }
  });

  cellInput.focus();
});

'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');

let currSortIndex = null;
let selRow = null;

const reverseTable = () => {
  tBody.append(...([...tBody.rows].reverse()));
};

const sortTable = (sortIndex) => {
  const sorted = [...tBody.rows].sort((a, b) => {
    const aText = a.cells[sortIndex].innerText;
    const bText = b.cells[sortIndex].innerText;

    switch (sortIndex) {
      case 0:
      case 1:
      case 2:
        return +aText.localeCompare(bText);
      case 3:
        return +aText - +bText;
      case 4:
        return +aText.replace(/\W/g, '')
          - +bText.replace(/\W/g, '');
      default:
        throw new Error('unexpected cell index');
    }
  });

  tBody.append(...sorted);
};

tHead.addEventListener('click', e => {
  const i = e.target.cellIndex;

  if (i === currSortIndex) {
    reverseTable();

    return;
  }

  sortTable(i);
  currSortIndex = i;
});

const selectedRow = row => {
  if (row === selRow) {
    return;
  }

  // #region
  if (selRow) {
    selRow.classList.remove('active');
  }

  row.classList.add('active');
  selRow = row;
  // #endregion
};

tBody.addEventListener('click', e => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  selectedRow(row);
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
  <button type="submit">Save to table</button>
`;

const pushNotification = (title, description, type) => {
  const errorMessaage = document.createElement('div');

  errorMessaage.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  errorMessaage.classList.add('notification', type);
  errorMessaage.dataset.qa = 'notification';

  document.body.append(errorMessaage);

  setTimeout(() => errorMessaage.remove(), 3000);
};

document.body.append(form);

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);

  for (const key of data.keys()) {
    const inpVal = data.get(key);

    if (!inpVal) {
      pushNotification(
        'Data Error',
        `The ${key} field could not be ampty`,
        'error'
      );

      return;
    }

    switch (key) {
      case 'name':
        if (inpVal.length < 4) {
          pushNotification(
            'Data Error',
            `Name should be no less than 4 letters long`,
            'error'
          );

          return;
        }

        break;

      case 'age':
        if (inpVal < 18 || inpVal > 90) {
          pushNotification(
            'Data Error',
            `Age limit is between 18 and 90`,
            'error'
          );

          return;
        }

        break;
    }
  }

  const rowToAppend = document.createElement('tr');

  rowToAppend.innerHTML = `
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${data.get('age')}</td>
    <td>${formatedSalary(data.get('salary'))}</td>
  `;

  tBody.append(rowToAppend);
  form.reset();

  pushNotification(
    'Added!',
    'New employee was added to the very and',
    'success'
  );
});

const formatedSalary = salaryNumber =>
  '$' + Number(salaryNumber).toLocaleString('GB-en');

tBody.addEventListener('dblclick', el => {
  const cell = el.target;
  const value = el.target.innerText;
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
    let newData = cellInput.value;

    if (cellIndex === 4) {
      newData = formatedSalary(newData);
    }

    if (!cellInput.value || cellInput.value.trim() === '') {
      newData = value;
    }

    cell.innerHTML = newData;

    cellInput.value = '';
    cellInput.remove();
  });

  cellInput.addEventListener('keydown', element => {
    if (element.key === 'Enter') {
      cellInput.blur();
    }
  });

  cellInput.focus();
});

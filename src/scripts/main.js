'use strict';

const header = document.querySelector('thead');
const body = document.querySelector('tbody');
const rows = body.rows;
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

employeeForm.innerHTML = `
    <label>Name:
      <input type="text" name="name" data-qa="name">
    </label>
    <label>Position:
      <input type="text" name="position" data-qa="position">
    </label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input type="number" name="age" data-qa="age">
    </label>
    <label>Salary:
      <input type="number" name="salary" data-qa="salary">
    </label>
    <button type="submit">Save to table</button>
`;

const makeColFromForm = (attr, formater, validate) => {
  let value = document.querySelector(`[data-qa='${attr}']`).value;
  const col = document.createElement('td');

  if (formater) {
    value = formater(value);
  }

  let isValid = true;

  if (validate) {
    isValid = validate(value);

    if (!isValid) {
      return {
        isValid, col: null,
      };
    }
  }
  col.innerHTML = value;

  return {
    isValid, col,
  };
};

employeeForm.addEventListener('submit', e => {
  e.preventDefault();

  const row = document.createElement('tr');

  const cols = [];
  let result = makeColFromForm('name', null, (val) => val.length >= 4);

  cols.push(result);

  result = makeColFromForm('position', null, (val) => val.length >= 4);
  cols.push(result);
  result = makeColFromForm('office');
  cols.push(result);

  result = makeColFromForm('age', (val) => val.toString(), (val) =>
    +val >= 18 && +val <= 90);
  cols.push(result);
  result = makeColFromForm('salary', (val) => '$' + (+val).toLocaleString());
  cols.push(result);

  const isValid = cols.every(c => c.isValid);

  if (isValid) {
    row.append(...cols.map(co => co.col));
    showNotification('Success', 'Employee added', 'success');
    body.append(row);
    employeeForm.reset();
  } else {
    showNotification('Error', 'Validation error', 'error');
  }
});

document.body.append(employeeForm);

const makeComparableNumber = (row, cellIdx, normalized) => {
  return +makeComparable(row, cellIdx, normalized);
};

const makeComparable = (row, cellIdx, normalized) => {
  return normalized
    ? row.cells[cellIdx].innerHTML.slice(1).replace(',', '')
    : row.cells[cellIdx].innerHTML;
};

let sortOrder = 1;

header.addEventListener('click', e => {
  const headerEl = e.target.closest('th');
  const cellIndex = e.target.cellIndex;

  if (!headerEl) {
    return;
  }

  const sorted = [...rows];

  sorted.sort((rowA, rowB) => {
    if (cellIndex === 3) {
      return makeComparableNumber(sortOrder > 0 ? rowA : rowB, cellIndex)
        - makeComparableNumber(sortOrder > 0 ? rowB : rowA, cellIndex);
    }

    if (cellIndex === 4) {
      return makeComparableNumber(sortOrder > 0 ? rowA : rowB, cellIndex, true)
        - makeComparableNumber(sortOrder > 0 ? rowB : rowA, cellIndex, true);
    }

    return makeComparable(sortOrder > 0 ? rowA : rowB, cellIndex)
      .localeCompare(makeComparable(sortOrder > 0 ? rowB : rowA, cellIndex));
  });
  body.append(...sorted);
  sortOrder = -sortOrder;
});

body.addEventListener('click', e => {
  const bodyEl = e.target.closest('tr');

  if (!bodyEl) {
    return;
  }

  [...body.children].forEach(row => {
    row.classList.remove('active');
  });

  e.target.parentElement.classList.add('active');
});

const showNotification = (title, description, type) => {
  const bodyEl = document.body;

  bodyEl.insertAdjacentHTML('afterbegin', `
    <div class='notification ${type}' data-qa="notification">
      <h2 class='title'>
      ${title}
      </h2>
      <p>${description}</p>
    </div>
  `);

  const divEl = document.querySelector('div');

  divEl.style.marginTop = `440px`;
  divEl.style.marginLeft = `5px`;

  setTimeout(() => {
    const notifications = document.getElementsByClassName('notification');

    for (const el of notifications) {
      el.remove();
    }
  }, 3000);
};

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

  let result = {
    isValid: true,
    error: '',
  };

  if (validate) {
    result = validate(value);

    if (!result.isValid) {
      return {
        isValid: result.isValid,
        col: null,
        error: result.error,
      };
    }
  }
  col.innerHTML = value;

  return {
    isValid: result.isValid,
    col,
    error: '',
  };
};

employeeForm.addEventListener('submit', e => {
  e.preventDefault();

  const row = document.createElement('tr');

  const cols = [];
  let result = makeColFromForm('name', null, (val) => {
    return {
      isValid: val.length >= 4,
      error: 'Name length is less than 4 chars',
    };
  });

  cols.push(result);

  result = makeColFromForm('position', null, (val) => {
    return {
      isValid: val.length >= 4,
      error: 'Position length is less than 4 chars',
    };
  });
  cols.push(result);
  result = makeColFromForm('office');
  cols.push(result);

  result = makeColFromForm('age', (val) => val.toString(), (val) => {
    return {
      isValid: +val >= 18 && +val <= 90,
      error: 'Age is less than 18 y.o. or greater than 90 y.o.',
    };
  });
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
    const errors = cols.reduce((acc, curr) => {
      acc.error += '\n' + curr.error;

      return acc;
    }, { error: '' }).error;

    showNotification('Validation error', errors, 'error');
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
    switch (cellIndex) {
      case 3:
        return makeComparableNumber(sortOrder > 0
          ? rowA : rowB, cellIndex)
           - makeComparableNumber(sortOrder > 0
             ? rowB : rowA, cellIndex);
      case 4:
        return makeComparableNumber(sortOrder > 0
          ? rowA : rowB, cellIndex, true)
        - makeComparableNumber(sortOrder > 0
          ? rowB : rowA, cellIndex, true);
      default:
        return makeComparable(sortOrder > 0
          ? rowA : rowB, cellIndex)
          .localeCompare(makeComparable(sortOrder > 0
            ? rowB : rowA, cellIndex));
    }
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
  clearNotification();

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

  setTimeout(() => clearNotification(), 6000);
};

const clearNotification = () => {
  const notifications = document.getElementsByClassName('notification');

  for (const el of notifications) {
    el.remove();
  }
};

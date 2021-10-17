'use strict';

const body = document.body;

const newForm = document.createElement('form');

newForm.className = 'new-employee-form';

newForm.innerHTML = `
  <label for="name">Name:
    <input name="name" type="text" data-qa="name" required>
  </label>

  <label for="position">Position:
    <input name="position" type="text" data-qa="position" required>
  </label>

  <label for="office">Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label for="age">Age:
    <input name="number" type="number" data-qa="age" required>
  </label>

  <label for="salary">Salary
    <input name="salary" type="number" data-qa="salary" required>
  </label>

  <button>Save to table</button>
`;
body.append(newForm);

const table = document.querySelector('table');
const form = document.querySelector('form');
const buttonForm = form.querySelector('button');
const tableHead = document.querySelector('thead');
const tableHeadColumns = tableHead.querySelectorAll('th');
let tableContent = document.querySelector('tbody');
let rows = tableContent.querySelectorAll('tr');
let activeRow;
let activeCell = false;
const sort = {};

const salaryToNumber = (salary) => +salary.split(',').join('').replace('$', '');

tableHeadColumns.forEach((tableHeadColum) => {
  sort[tableHeadColum.textContent] = 'ASC';
});

tableHead.addEventListener('click', (events) => {
  tableContent = document.querySelector('tbody');

  const tableArr = [];
  const sortKey = events.target.textContent;

  rows.forEach((row) => {
    const rowObj = {};

    let i = 0;

    for (const tableHeadColum of tableHeadColumns) {
      const key = tableHeadColum.textContent;

      rowObj[key] = row.children[i].textContent;
      i++;
    };

    rowObj.salary2 = salaryToNumber(rowObj.Salary);
    rowObj.Age = +rowObj.Age;
    tableArr.push(rowObj);
  });

  sortTable(tableArr, sortKey);
  tableContent.remove();

  tableContent = document.createElement('tbody');

  table.children[0].after(tableContent);

  tableArr.forEach((row) => {
    const trElement = document.createElement('tr');

    trElement.insertAdjacentHTML('beforeend', `
      <td>${row.Name}</td>
      <td>${row.Position}</td>
      <td>${row.Office}</td>
      <td>${row.Age}</td>
      <td>${row.Salary}</td>`);
    tableContent.append(trElement);
    rowSelect();
  });
});

function sortTable(array, key) {
  const sortingDirection = sort[key];
  const sortKey = (key === 'Salary') ? 'salary2' : key;
  const typeField = typeof (array[0][sortKey]);

  if (sortingDirection === 'ASC') {
    if (typeField === 'string') {
      array.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
    } else {
      array.sort((x, y) => x[sortKey] - y[sortKey]);
    }
    sort[key] = 'DESC';
  } else {
    if (typeField === 'string') {
      array.sort((a, b) => b[sortKey].localeCompare(a[sortKey]));
    } else {
      array.sort((x, y) => y[sortKey] - x[sortKey]);
    }
    sort[key] = 'ASC';
  };
};

rowSelect();

function rowSelect() {
  tableContent.addEventListener('click', (events) => {
    if (activeRow !== undefined) {
      activeRow.className = '';
    }
    activeRow = events.path[1];
    activeRow.className = 'active';
  });

  tableContent.addEventListener('dblclick', (events) => {
    if (!activeCell) {
      const currentCell = events.target;
      const oldText = currentCell.textContent;

      currentCell.textContent = '';
      activeCell = true;

      const inputField = document.createElement('input');

      inputField.value = oldText;
      currentCell.append(inputField);

      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const newText = (inputField.value === '')
            ? oldText
            : inputField.value;

          inputField.remove();
          currentCell.textContent = newText;
          activeCell = false;
        };
      });
    };
  });
}

buttonForm.addEventListener('click', (events) => {
  events.preventDefault();

  let valid = true;

  if (form[0].value.length < 4) {
    valid = false;
    message(valid, 'Name', 'Name value has less than 4 letters');
  }

  if (valid && form[1].value === '') {
    valid = false;
    message(valid, 'Position', 'The field must be it is filled');
  };

  if (valid && (form[3].value < 18 || form[3].value > 90)) {
    valid = false;
    message(valid, 'Age', 'Age value is less than 18 or more than 90');
  }

  if (valid && form[4].value === '') {
    valid = false;
    message(valid, 'Salary', 'The field must be it is filled');
  }

  if (valid) {
    const newRow = document.createElement('tr');

    newRow.insertAdjacentHTML('beforeend', `
      <td>${form[0].value}</td>
      <td>${form[1].value}</td>
      <td>${form[2].value}</td>
      <td>${form[3].value}</td>
      <td>$${bitRate(form[4].value)}</td>
    `);

    tableContent.append(newRow);
    tableContent = document.querySelector('tbody');
    rows = tableContent.querySelectorAll('tr');

    form[0].value = '';
    form[1].value = '';
    form[2].selectedIndex = 0;
    form[3].value = '';
    form[4].value = '';

    message(valid, null, 'Add a new employee to the table');
  }
});

function message(type, stage = null, description) {
  const classMessage = (type) ? 'success' : 'error';
  const title = (stage === null) ? '' : `Error in field ${stage}`;
  const messageBlock = document.createElement('div');

  messageBlock.className = `notification ${classMessage}`;
  messageBlock.dataset.qa = 'notification';

  messageBlock.insertAdjacentHTML('beforeend', `
    <h2>
      ${title}
    </h2>
    <p>
      ${description}
    </p>`);

  messageBlock.innerHTML = `
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>`;

  body.append(messageBlock);

  buttonForm.addEventListener('mouseout', () => {
    messageBlock.remove();
  });
};

function bitRate(sum) {
  const arr = [];

  for (let j = sum.toString().length; j > 0; j = j - 3) {
    let step = 3;

    if (j < 3) {
      step = j;
    };

    arr.unshift(sum.toString().substr(j - step, step));
  };

  return arr.join(',');
}

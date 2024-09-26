'use strict';

// GLOBAL TABLE FIELDS ARRAY
const TABLE_FIELDS = [
  {
    title: 'Name',
    type: 'input',
    input: {
      name: 'name',
      type: 'text',
    },
    validate(value) {
      if (typeof value === 'undefined' || value === '') {
        pushNotification(
          10, 10,
          'Form data error',
          'Employee\'s name is required!',
          'error',
        );

        return false;
      }

      if (value.length < 4) {
        pushNotification(
          10, 10,
          'Form data error',
          'Employee\'s name needs to be at least 4 characters long!',
          'error',
        );

        return false;
      }

      return true;
    },
    sort(a, b) {
      return a.localeCompare(b);
    },
  },
  {
    title: 'Position',
    type: 'input',
    input: {
      name: 'position',
      type: 'text',
    },
    validate(value) {
      if (typeof value === 'undefined' || value === '') {
        pushNotification(
          10, 10,
          'Form data error',
          'Employee\'s position is required!',
          'error',
        );

        return false;
      }

      return true;
    },
    sort(a, b) {
      return a.localeCompare(b);
    },
  },
  {
    title: 'Office',
    type: 'select',
    select: {
      name: 'office',
    },
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
    sort(a, b) {
      return a.localeCompare(b);
    },
  },
  {
    title: 'Age',
    type: 'input',
    input: {
      name: 'age',
      type: 'number',
    },
    validate(value) {
      if (typeof value === 'undefined' || value === '') {
        pushNotification(
          10, 10,
          'Form data error',
          'Employee\'s age is required!',
          'error',
        );

        return false;
      }

      if (value < 18 || value > 90) {
        pushNotification(
          10, 10,
          'Form data error',
          'Employee\'s age needs to be in range between 18 and 90!',
          'error',
        );

        return false;
      }

      return true;
    },
    sort(a, b) {
      return a - b;
    },
  },
  {
    title: 'Salary',
    type: 'input',
    input: {
      name: 'salary',
      type: 'number',
    },
    formatForView(number) {
      let numberAsString = String(number);
      const parts = [];

      do {
        const part = numberAsString.slice(-3);

        parts.unshift(part);
        numberAsString = numberAsString.slice(0, -3);
      } while (numberAsString);

      return '$' + parts.join();
    },
    formatForEdit(value) {
      return String(value).replace(/\D/g, '');
    },
    validate(number) {
      if (number <= 0) {
        pushNotification(
          10, 10,
          'Form data error',
          'Employee\'s salary needs to be larger than 0!',
          'error',
        );

        return false;
      }

      return true;
    },
    sort(a, b) {
      const numA = +String(a).replace(/\D/g, '');
      const numB = +String(b).replace(/\D/g, '');

      return numA - numB;
    },
  },
];

// INITIALIZATION
window.addEventListener('load', () => {
  addForm();

  // LISTEN TO DOUBLECLICK
  // eslint-disable-next-line no-shadow
  document.addEventListener('dblclick', event => {
    const item = event.target;
    const cell = item.closest('td');

    if (!cell) {
      return;
    }

    addCellEditInput(cell);
  });

  // LISTEN TO CLICK
  // eslint-disable-next-line no-shadow
  document.addEventListener('click', event => {
    const item = event.target;
    const head = item.closest('thead');

    if (head) {
      sortTableColumns(item, head);

      return;
    }

    const row = item.closest('tr');

    if (row && !row.closest('tfoot')) {
      selectTableRow(row);
    }
  });
});

// SORTING COLUMNS
function sortTableColumns(item, head) {
  const table = document.querySelector('table');
  const sortedOrder = item.dataset.sorted;
  const colIndex = item.cellIndex;
  const tBody = table.tBodies[0];
  const rows = [...tBody.rows];
  const field = TABLE_FIELDS[colIndex];

  rows.sort((a, b) => {
    const sortDirection = !sortedOrder || sortedOrder === 'desc' ? 1 : -1;
    const cellA = a.cells[colIndex].textContent;
    const cellB = b.cells[colIndex].textContent;

    item.dataset.sorted = sortDirection === 1
      ? 'asc'
      : 'desc';

    return field.sort
      ? field.sort(cellA, cellB) * sortDirection
      : cellA.localeCompare(cellB) * sortDirection;
  });

  head.querySelectorAll('[data-sorted]').forEach(title => {
    if (title.cellIndex === colIndex) {
      return;
    }

    delete title.dataset.sorted;
  });

  rows.forEach(row => tBody.appendChild(row));
}

// SELECT ROW
function selectTableRow(row) {
  const table = document.querySelector('table');

  if (row.classList.contains('active')) {
    return;
  }

  table
    .querySelectorAll('tr.active')
    .forEach(active => active.classList.remove('active'));

  row.classList.add('active');
}

// ADD FORM
function addForm() {
  const table = document.querySelector('table');
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  TABLE_FIELDS.forEach(field => {
    const wrapper = document.createElement('label');

    wrapper.innerText = field.title;

    const fieldElement = createFormField(field);

    wrapper.appendChild(fieldElement);

    form.appendChild(wrapper);
  });

  const button = document.createElement('button');

  button.innerText = 'Save to table';
  form.appendChild(button);
  table.after(form);

  // eslint-disable-next-line no-shadow
  form.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(form);

    const isValidData = TABLE_FIELDS.every(({ type, ...field }) => {
      if (!field.validate) {
        return true;
      }

      return field.validate(formData.get(field[type].name));
    });

    if (!isValidData) {
      return;
    }

    pushNotification(
      10, 10,
      'Added to table',
      `${formData.get('name')} is successfully added to table`,
      'success',
    );

    addEmployeeToTable(formData);
    form.reset();
  });
}

// CREATE FIELD ELEMENT
function createFormField(field) {
  switch (field.type) {
    case 'input':
      const input = document.createElement('input');

      Object.assign(input, field.input);
      input.dataset.qa = field.input.name;

      return input;

    case 'select':
      const select = document.createElement('select');

      Object.assign(select, field.select);
      select.dataset.qa = field.select.name;

      field.options.forEach(value => {
        const option = document.createElement('option');

        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });

      return select;
  }
}

// NOTIFICATIONS
function pushNotification(posTop, posRight, title, description, type) {
  const messageContainer = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  messageContainer.className = `notification ${type}`;
  messageContainer.dataset.qa = `notification`;

  titleElement.className = 'title';
  titleElement.textContent = title;

  descriptionElement.textContent = description;

  messageContainer.appendChild(titleElement);
  messageContainer.appendChild(descriptionElement);
  document.body.appendChild(messageContainer);

  messageContainer.style.top = `${posTop}px`;
  messageContainer.style.right = `${posRight}px`;

  setTimeout(() => {
    messageContainer.remove();
  }, 2000);
};

// ADD NEW EMPLOYEE
function addEmployeeToTable(formData) {
  const table = document.querySelector('table');
  const tBody = table.tBodies[0];
  const lastRow = tBody.lastElementChild;
  const newRow = lastRow.cloneNode(true);

  TABLE_FIELDS.forEach(({ type, ...field }, i) => {
    const content = formData.get(field[type].name);

    newRow.cells[i].textContent = field.formatForView
      ? field.formatForView(content)
      : content;
  });

  lastRow.after(newRow);
}

// EDIT CELL
function addCellEditInput(cell) {
  const cellValue = cell.textContent;
  const cellIndex = cell.cellIndex;
  const field = TABLE_FIELDS[cellIndex];
  const cellInput = createFormField(field);

  cellInput.className = 'cell-input';

  cellInput.value = field.formatForEdit
    ? field.formatForEdit(cellValue)
    : cellValue;
  delete cellInput.dataset.qa;

  cell.textContent = '';
  cell.appendChild(cellInput);
  cellInput.focus();

  // eslint-disable-next-line no-shadow
  cellInput.addEventListener('keyup', event => {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      cellInput.blur();
    }
  });

  cellInput.addEventListener('blur', () => {
    const isValid = field.validate
      ? field.validate(cellInput.value)
      : true;

    const newValue = field.formatForView
      ? field.formatForView(cellInput.value)
      : cellInput.value;

    cell.innerHTML = '';

    cell.textContent = newValue !== '' && isValid
      ? newValue
      : cellValue;
  });
}

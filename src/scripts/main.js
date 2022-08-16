'use strict';

const TABLE_FIELDS = [
  {
    title: 'Name',
    type: 'input',
    input: {
      name: 'name',
      type: 'text',
      required: 'true',
      pattern: '.{4,}',
    },
  },
  {
    title: 'Position',
    type: 'input',
    input: {
      name: 'position',
      type: 'text',
      required: 'true',
    },
  },
  {
    title: 'Office',
    type: 'select',
    select: {
      name: 'office',
      required: 'true',
    },
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    title: 'Age',
    type: 'input',
    input: {
      name: 'age',
      type: 'number',
      required: 'true',
      min: '18',
      max: '90',
      step: '1',
    },
  },
  {
    title: 'Salary',
    type: 'input',
    input: {
      name: 'salary',
      type: 'number',
      required: 'true',
      min: '0',
    },
  },
];

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

// SORTING COLUMNS
function sortTableColumns(item, head) {
  const table = document.querySelector('table');
  const sortedOrder = item.dataset.sorted;
  const colIndex = item.cellIndex;
  const tBody = table.tBodies[0];
  const rows = [...tBody.rows];

  rows.sort((a, b) => {
    const cellA = !sortedOrder || sortedOrder === 'desc'
      ? a.cells[colIndex].textContent
      : b.cells[colIndex].textContent;
    const cellB = !sortedOrder || sortedOrder === 'desc'
      ? b.cells[colIndex].textContent
      : a.cells[colIndex].textContent;

    item.dataset.sorted = !sortedOrder || sortedOrder === 'desc'
      ? 'asc'
      : 'desc';

    switch (colIndex) {
      case 0:
      case 1:
      case 2:
      default:
        return cellA.localeCompare(cellB);

      case 3:
      case 4:
        const numA = +cellA.replace(/\D/g, '');
        const numB = +cellB.replace(/\D/g, '');

        return numA - numB;
    }
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

    switch (field.type) {
      case 'input':
        const input = document.createElement('input');

        Object.assign(input, field.input);
        input.dataset.qa = field.input.name;
        wrapper.appendChild(input);
        break;

      case 'select':
        const select = document.createElement('select');

        Object.assign(select, field.select);
        select.dataset.qa = field.select.name;
        wrapper.appendChild(select);

        field.options.forEach(value => {
          const option = document.createElement('option');

          option.value = value;
          option.textContent = value;
          select.appendChild(option);
        });
        break;
    }

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

    if (formData.get('age') < 18 || formData.get('age') > 90) {
      pushNotification(
        10, 10,
        'Form data error',
        'Employee\'s age needs to be in range between 18 and 90!',
        'error',
      );

      return;
    }

    if (formData.get('name').length < 4) {
      pushNotification(
        10, 10,
        'Form data error',
        'Employee\'s name needs to be at least 4 characters long!',
        'error',
      );

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

addForm();

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

  newRow.cells[0].textContent = formData.get('name');
  newRow.cells[1].textContent = formData.get('position');
  newRow.cells[2].textContent = formData.get('office');
  newRow.cells[3].textContent = formData.get('age');
  newRow.cells[4].textContent = formatSalary(formData.get('salary'));

  lastRow.after(newRow);
}

const formatSalary = number => {
  let numberAsString = String(number);
  const parts = [];

  do {
    const part = numberAsString.slice(-3);

    parts.unshift(part);
    numberAsString = numberAsString.slice(0, -3);
  } while (numberAsString);

  return '$' + parts.join();
};

// EDIT CELL
function addCellEditInput(cell) {
  const cellValue = cell.textContent;
  const cellInput = document.createElement('input');

  cellInput.className = 'cell-input';
  cellInput.value = cellValue;

  cell.textContent = '';
  cell.appendChild(cellInput);
  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    const newValue = cellInput.value;

    cell.innerHTML = '';
    cell.textContent = newValue !== '' ? newValue : cellValue;
  });
}

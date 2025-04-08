'use strict';

const table = document.querySelector('table');
const tableHead = table.tHead;
const tableHeaders = [...tableHead.rows[0].children];
const tableBody = table.tBodies[0];
const tableRows = [...tableBody.rows];
const formContent = [
  { name: 'Name', type: 'text', min: 4 },
  { name: 'Position', type: 'text' },
  {
    name: 'Office',
    type: 'select',
    options: [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ],
  },
  {
    name: 'Age',
    type: 'number',
    min: 18,
    max: 90,
  },
  { name: 'Salary', type: 'number' },
];

const sortTable = () => {
  const sortRows = function (a, b) {
    let aValue = a.children[this.index].textContent;
    let bValue = b.children[this.index].textContent;

    if (this.direction === 'DESC') {
      aValue = b.children[this.index].textContent;
      bValue = a.children[this.index].textContent;
    }

    if (aValue.includes('$')) {
      return parseSalary(aValue) - parseSalary(bValue);
    }

    if (isNaN(aValue) || isNaN(bValue)) {
      return aValue.localeCompare(bValue);
    }

    return aValue - bValue;
  };

  const parseSalary = (str) => {
    return +str.slice(1).split(',').join('');
  };

  let lastSortedColumnIndex = -1;

  tableHeaders.forEach((header) => {
    header.addEventListener('click', (e) => {
      const index = [...tableHead.rows[0].children].findIndex(
        (row) => row === e.target,
      );

      const direction = lastSortedColumnIndex === index ? 'DESC' : 'ASC';

      lastSortedColumnIndex = index;

      const sortRowsByIndex = sortRows.bind({ index, direction });

      const sortedRows = [...tableBody.rows].sort(sortRowsByIndex);

      sortedRows.forEach((row) => tableBody.appendChild(row));
    });
  });
};

const selectRow = () => {
  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    tableRows.forEach((tableRow) => tableRow.classList.remove('active'));

    row.classList.add('active');
  });
};

const addForm = () => {
  const numberWithCommas = (x) => {
    const parts = x.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  };

  const appendRow = (data) => {
    const row = document.createElement('tr');

    for (const value of Object.values(data)) {
      const cell = document.createElement('td');

      cell.textContent = value;
      row.append(cell);
    }

    tableBody.append(row);
  };

  const form = document.createElement('form');
  const button = document.createElement('button');

  for (const element of formContent) {
    const label = document.createElement('label');
    const elementName = element.name.toLowerCase();

    if (element.type !== 'select') {
      const input = document.createElement('input');

      input.setAttribute('name', elementName);
      input.setAttribute('type', element.type);
      input.setAttribute('data-qa', elementName);
      label.textContent = element.name + ': ';
      label.append(input);
    } else {
      const select = document.createElement('select');

      select.setAttribute('name', elementName);
      select.setAttribute('data-qa', elementName);

      element.options.forEach((value) => {
        const option = document.createElement('option');

        option.setAttribute('value', value);
        option.textContent = value;
        select.append(option);
      });
      label.textContent = element.name + ': ';
      label.append(select);
    }

    form.append(label);
  }

  button.setAttribute('type', 'submit');
  button.textContent = 'Save to table';
  form.append(button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);

    data.set('salary', '$' + numberWithCommas(data.get('salary')));

    if (!validateForm(Object.fromEntries(data.entries()))) {
      return;
    }

    appendRow(Object.fromEntries(data.entries()));

    pushNotification(`Success`, `Table row added!`, 'success');

    form.reset();
  });

  form.classList.add('new-employee-form');
  table.insertAdjacentElement('afterend', form);
};

function validateForm(data) {
  for (const element of formContent) {
    const elementName = element.name.toLowerCase();

    if (data[elementName].length === 0) {
      pushNotification(
        `Incorrect value in ${elementName}`,
        `Field is required`,
        'error',
      );

      return false;
    }

    if ('min' in element && element.type === 'text') {
      if (data[elementName].length < element.min) {
        pushNotification(
          `Incorrect value in ${elementName}`,
          `Min length is ${element.min}`,
          'error',
        );

        return false;
      }
    } else if ('min' in element) {
      if (data[elementName] < element.min) {
        pushNotification(
          `Incorrect value in ${elementName}`,
          `Min value is ${element.min}`,
          'error',
        );

        return false;
      }
    }

    if ('max' in element) {
      if (data[elementName] > element.max) {
        pushNotification(
          `Incorrect value in ${elementName}`,
          `Max value is ${element.max}`,
          'error',
        );

        return false;
      }
    }
  }

  return true;
}

function pushNotification(title, description, type) {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  messageTitle.textContent = title;
  messageDescription.textContent = description;

  message.classList.add('notification', type);
  messageTitle.classList.add('title');
  message.append(messageTitle, messageDescription);

  message.setAttribute('data-qa', 'notification');

  document.body.append(message);

  setTimeout(() => (message.style.display = 'none'), 2000);
}

const editCell = () => {
  tableBody.addEventListener('dblclick', (clickEvent) => {
    const cell = clickEvent.target.closest('td');

    if (!cell || cell.querySelector('input')) {
      return;
    }

    const cellValue = cell.textContent;
    const input = document.createElement('input');

    cell.textContent = '';
    input.classList.add('cell-input');
    input.value = cellValue;
    cell.append(input);

    input.addEventListener('blur', () => {
      const inputValue = input.value;

      input.remove();
      cell.textContent = inputValue || cellValue;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  });
};

sortTable();
selectRow();
addForm();
editCell();

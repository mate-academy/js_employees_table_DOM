'use strict';

const notifications = {
  name: {
    title: 'Invalid name',
    description: 'Name should be at least 4 letters long',
  },
  age: {
    title: 'Invalid age',
    description: 'Age should be between 18 and 90',
  },
  success: {
    title: 'Success',
    description: 'New employee has been added to the table',
  },
};

const body = document.querySelector('body');
const table = body.querySelector('table');
const tableBody = table.querySelector('tbody');
const headerRow = table.querySelector('thead tr');

let lastClikedSortBy = '';
let orderBy = '';

const pushNotification = (type, notificationType) => {
  const notification = document.createElement('div');

  notification.className = `notification ${notificationType}`;
  notification.dataset.qa = 'notification';
  notification.style.top = '10px';
  notification.style.right = '100px';

  const notificationTitle = document.createElement('h2');

  notificationTitle.textContent = notifications[type].title;
  notificationTitle.className = 'title';

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = notifications[type].description;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  body.appendChild(notification);

  setTimeout(() => (notification.style.display = 'none'), 2000);
};

headerRow.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (th) {
    if (th !== lastClikedSortBy) {
      orderBy = 'ASC';
      lastClikedSortBy = th;
    } else if (orderBy === 'ASC') {
      orderBy = 'DESC';
    } else {
      orderBy = 'ASC';
    }

    const sortBy = th.cellIndex;

    const sortData = (row1, row2) => {
      const row1Content = row1.cells[sortBy].textContent;
      const row2Content = row2.cells[sortBy].textContent;

      return row1Content.localeCompare(row2Content, undefined, {
        numeric: true,
      });
    };

    const tableBodyContent = Array.from(tableBody.querySelectorAll('tr'));

    tableBodyContent.sort(sortData);

    if (orderBy === 'DESC') {
      tableBodyContent.reverse();
    }

    tableBodyContent.forEach((tr) => {
      tableBody.append(tr);
    });
  }
});

tableBody.addEventListener('click', (e) => {
  const rowWithActiveClass = tableBody.querySelector('.active');

  if (rowWithActiveClass) {
    rowWithActiveClass.classList.remove('active');
  }

  const clickedRow = e.target.closest('tr');

  if (clickedRow) {
    clickedRow.classList.add('active');
  }
});

tableBody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (td) {
    const tdValue = td.textContent;

    td.textContent = '';

    const input = document.createElement('input');

    input.classList.add('cell-input');

    input.value = tdValue;

    td.appendChild(input);
    input.focus();

    const saveValue = () => {
      td.textContent = input.value || tdValue;
    };

    input.addEventListener('blur', saveValue);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveValue();
      }
    });
  }
});

const tableForm = document.createElement('form');

tableForm.classList.add('new-employee-form');

const fields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Position', name: 'position', type: 'text' },
  { label: 'Office', name: 'office', type: 'select' },
  { label: 'Age', name: 'age', type: 'number' },
  { label: 'Salary', name: 'salary', type: 'number' },
];

fields.forEach((field) => {
  if (field.type === 'select') {
    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    const select = document.createElement('select');

    select.name = field.name;
    select.dataset.qa = field.name;

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.value = office;
      option.textContent = office;

      select.append(option);
    });

    const label = document.createElement('label');

    label.textContent = field.label;
    label.value = field.name;

    label.appendChild(select);

    tableForm.append(label);
  } else {
    const label = document.createElement('label');

    label.textContent = field.label;
    label.htmlFor = field.name;

    const input = document.createElement('input');

    input.type = field.type;
    input.name = field.name;
    input.required = true;
    input.dataset.qa = field.name;

    label.appendChild(input);

    tableForm.append(label);
  }
});

const saveToTableButton = document.createElement('button');

saveToTableButton.textContent = 'Save to table';
tableForm.append(saveToTableButton);

body.append(tableForm);

tableForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(tableForm);

  const nameValue = data.get('name');
  const ageValue = parseInt(data.get('age'));

  if (nameValue.trim().length < 4) {
    pushNotification('name', 'error');

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    pushNotification('age', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  data.forEach((value, key) => {
    const cell = document.createElement('td');

    if (key === 'salary') {
      cell.textContent = '$' + parseInt(value).toLocaleString('en-US');
    } else {
      cell.textContent = value;
    }

    newRow.append(cell);
  });

  tableBody.append(newRow);
  pushNotification('success', 'success');
  tableForm.reset();
});

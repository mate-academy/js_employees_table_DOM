'use strict';

// write code here
const table = document.querySelector('table');
let officeRow = '';
let sortColumn;
let commonTextContent;
let pointOfSortingColumn;
let needReverseSortingForNewEmployee;
const headerIndex = {
  Name: 0,
  Position: 1,
  Office: 2,
  Age: 3,
  Salary: 4,
};

const notifications = {
  shortName: {
    title: 'Wrong name',
    description: 'Name value has less than 4 letters',
    type: 'error',
  },
  young: {
    title: 'Wrong age',
    description: 'Age value is less than 18',
    type: 'error',
  },
  old: {
    title: 'Wrong age',
    description: 'Age value is bigger than 90',
    type: 'error',
  },
  success: {
    title: 'Succefully added',
    description: 'A new employee successfully added to the table',
    type: 'success',
  },
};

const offices = {
  tokyo: 'Tokyo',
  singapore: 'Singapore',
  london: 'London',
  newyork: 'New York',
  edinburgh: 'Edinburgh',
  sanfrancisco: 'San Francisco',
};

table.tHead.addEventListener('click', (event) => {
  const item = event.target;

  switch (item.textContent) {
    case 'Name':
      if (sortColumn !== item.textContent) {
        sortColumn = item.textContent;
        pointOfSortingColumn = sortColumn;
        handleTableSort(headerIndex.Name);
        needReverseSortingForNewEmployee = 'no';
      } else {
        pointOfSortingColumn = sortColumn;
        reverseColumn(headerIndex.Name);
        sortColumn = '';
        needReverseSortingForNewEmployee = 'yes';
      }
      break;
    case 'Position':
      if (sortColumn !== item.textContent) {
        sortColumn = item.textContent;
        pointOfSortingColumn = sortColumn;
        handleTableSort(headerIndex.Position);
        needReverseSortingForNewEmployee = 'no';
      } else {
        pointOfSortingColumn = sortColumn;
        reverseColumn(headerIndex.Position);
        sortColumn = '';
        needReverseSortingForNewEmployee = 'yes';
      }
      break;
    case 'Office':
      if (sortColumn !== item.textContent) {
        sortColumn = item.textContent;
        pointOfSortingColumn = sortColumn;
        handleTableSort(headerIndex.Office);
        needReverseSortingForNewEmployee = 'no';
      } else {
        pointOfSortingColumn = sortColumn;
        reverseColumn(headerIndex.Office);
        sortColumn = '';
        needReverseSortingForNewEmployee = 'yes';
      }
      break;
    case 'Age':
      if (sortColumn !== item.textContent) {
        sortColumn = item.textContent;
        pointOfSortingColumn = sortColumn;
        handleTableSort(headerIndex.Age);
        needReverseSortingForNewEmployee = 'no';
      } else {
        pointOfSortingColumn = sortColumn;
        reverseColumn(headerIndex.Age);
        sortColumn = '';
        needReverseSortingForNewEmployee = 'yes';
      }
      break;
    case 'Salary':
      if (sortColumn !== item.textContent) {
        sortColumn = item.textContent;
        pointOfSortingColumn = sortColumn;
        handleTableSort(headerIndex.Salary);
        needReverseSortingForNewEmployee = 'no';
      } else {
        pointOfSortingColumn = sortColumn;
        reverseColumn(headerIndex.Salary);
        sortColumn = '';
        needReverseSortingForNewEmployee = 'yes';
      }
      break;
  }
});

function handleTableSort(column) {
  const rows = [...table.tBodies[0].children].sort(function(a, b) {
    if (column === headerIndex.Salary) {
      return formatNumber(a.children[column].textContent)
      - formatNumber(b.children[column].textContent);
    } else {
      return a.children[column].textContent
        .localeCompare(b.children[column].textContent);
    }
  });

  table.tBodies[0].append(...rows);
}

function formatNumber(salary) {
  return +salary.substr(1).split(',').join('');
}

function reverseColumn() {
  const reversedTable = [...table.tBodies[0].children].reverse();

  for (const row of reversedTable) {
    table.tBodies[0].append(row);
  }
}

table.tBodies[0].addEventListener('click', event => {
  const selectedRow = event.target.parentElement;
  const person = [...table.tBodies[0].children];

  person.map(children => children.classList.remove('active'));
  selectedRow.classList.add('active');
});

function tableForRegisterNewEmployee() {
  const createForm = document.createElement('form');

  createForm.classList = 'new-employee-form';
  createForm.method = 'GET';
  createForm.action = '/';

  for (const officeTown in offices) {
    officeRow += `<option value="${officeTown}">
    ${offices[officeTown]}</option>`;
  }

  createForm.innerHTML = `
<label>Name: <input name="name" type="text" required></label>
<label>Position: <input name="position" type="text" required></label>
<label>Office: <select name="office">${officeRow}</select></label>
<label>Age: <input name="age" type="text" required></label>
<label>Salary: <input name="salary" type="text" required></label>
<button type="submit">Save to table</button>`;
  table.parentElement.append(createForm);
}

tableForRegisterNewEmployee();

const form = document.querySelector('form');

const addNotification = ({ title, description, type }) => {
  const message = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  message.classList.add('notification', type);
  titleMessage.classList.add('title');
  titleMessage.innerText = title;
  descriptionMessage.innerText = description;
  message.append(titleMessage, descriptionMessage);
  table.parentElement.append(message);

  const notification = document.querySelector('.notification');

  setTimeout(() => notification.remove(), 2000);
};

function rulesToAddNewEmployee(formData) {
  const { age, name, salary } = formData;

  if (name.length < 4) {
    addNotification(notifications.shortName);

    return false;
  }

  if (age < 18) {
    addNotification(notifications.young);

    return false;
  } else if (age > 90) {
    addNotification(notifications.old);

    return false;
  }

  if (!Number.isNaN(+age) && !Number.isNaN(+salary)) {
    return true;
  }
}

function formatToAddToSalary(salary) {
  return `$${new Intl.NumberFormat('en-us').format(salary)}`;
}

function rowForNewEmployee(employee) {
  const { name, position, office, age, salary } = employee;
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${name}</td>
    <td>${position}</td>
    <td>${offices[office]}</td>
    <td>${age}</td>
    <td>${formatToAddToSalary(salary)}</td>
  `;

  return newRow;
}

function SaveToTableNewEmployee(event) {
  event.preventDefault();

  // eslint-disable-next-line no-undef
  const data = new FormData(form);
  const employee = Object.fromEntries(data.entries());

  if (rulesToAddNewEmployee(employee)) {
    table.tBodies[0].append(rowForNewEmployee(employee));

    addNotification(notifications.success);
  }

  if (needReverseSortingForNewEmployee === 'no') {
    handleTableSort(headerIndex[pointOfSortingColumn]);
  } else if (needReverseSortingForNewEmployee === 'yes') {
    handleTableSort(headerIndex[pointOfSortingColumn]);
    reverseColumn();
  }
}

form.addEventListener('submit', SaveToTableNewEmployee);

function saveNewInputValue() {
  const inputItem = table.tBodies[0].querySelector('input');

  if (inputItem.value !== '1') {
    inputItem.parentElement.textContent = inputItem.value;
  } else {
    inputItem.parentElement.textContent = commonTextContent;
  }
  inputItem.remove();
}

table.tBodies[0].addEventListener('dblclick', event => {
  if (table.tBodies[0].querySelector('input')) {
    saveNewInputValue();
  }

  const item = event.target;
  const newInput = document.createElement('input');

  commonTextContent = item.textContent;
  newInput.classList = 'cell-input';
  newInput.value = item.textContent;
  item.textContent = '';
  item.append(newInput);
  newInput.addEventListener('blur', saveNewInputValue);
});

table.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    saveNewInputValue();
  }
});

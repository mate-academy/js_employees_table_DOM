'use strict';

// write code here
function sortTableByColumn(columnIndex, sortParam, table) {
  const tableCopy = [...table];

  tableCopy.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent;
    const cellB = b.cells[columnIndex].textContent;

    if (sortParam === 'Salary') {
      const salaryA = +cellA.replace(/\D/g, '');
      const salaryB = +cellB.replace(/\D/g, '');

      return salaryA - salaryB;
    }

    return cellA.localeCompare(cellB);
  });

  if (sortField === sortParam && !isDescending) {
    isDescending = true;

    tableCopy.reverse();
  } else {
    isDescending = false;
    sortField = sortParam;
  }

  return tableCopy;
}

function getUniqueCities() {
  const tableBodyRows = [...document.querySelector('tbody').rows];

  return [...new Set(tableBodyRows.map((row) => row.cells[2].textContent))];
}

function getForm() {
  const form = document.createElement('form');

  form.setAttribute('class', 'new-employee-form');

  tableHead.forEach((el) => {
    const title = el.textContent;
    const label = document.createElement('label');

    label.textContent = `${title}:`;

    if (title === 'Office') {
      const select = document.createElement('select');

      select.setAttribute('data-qa', `${title}`.toLowerCase());
      getOptionCities(select);

      select.setAttribute('name', `${title}`.toLowerCase());
      label.append(select);
    } else {
      const input = document.createElement('input');
      const typeInput =
        title === 'Age' || title === 'Salary' ? 'number' : 'text';

      input.setAttribute('name', `${title}`.toLowerCase());
      input.setAttribute('type', `${typeInput}`);
      input.setAttribute('data-qa', `${title}`.toLowerCase());

      label.append(input);
    }

    form.append(label);
  });

  submitButton.setAttribute('type', 'submit');
  submitButton.textContent = 'Save to table';

  form.append(submitButton);

  return form;
}

function validateEmployeeData(employee) {
  const { nameValue, position, age, salary } = employee;

  switch (true) {
    case !nameValue:
      document.getElementsByName('name')[0].focus();

      return { text: 'Please, enter a name' };

    case nameValue.length > 0 && nameValue.length < 4:
      document.getElementsByName('name')[0].focus();

      return { text: 'Name has less than 4 letters' };

    case !position:
      document.getElementsByName('position')[0].focus();

      return { text: 'Please, enter position' };

    case !age:
      document.getElementsByName('age')[0].focus();

      return { text: 'Please, enter age' };

    case age < 18 || age > 90:
      document.getElementsByName('age')[0].focus();

      return { text: 'Age must be between 18 and 90' };

    case !salary:
      document.getElementsByName('salary')[0].focus();

      return { text: 'Please, enter the amount of salary' };

    default:
      return { text: 'Employee successfully added', type: 'success' };
  }
}

function createNewEmployee() {
  const employee = {
    nameValue: [...document.getElementsByName('name')][0].value.trim(),
    position: [...document.getElementsByName('position')][0].value,
    city: [...document.getElementsByName('office')][0].value,
    age: +[...document.getElementsByName('age')][0].value,
    salary: +[...document.getElementsByName('salary')][0].value,
  };

  const validationResult = validateEmployeeData(employee);

  getNotification(validationResult);

  if (validationResult.type === 'success') {
    document.querySelector('tbody').append(getEmployee(employee));
    document.querySelector('.new-employee-form').reset();
  }
}

function getNotification({ text, type = 'error' }) {
  const notification = document.createElement('div');
  const title = document.createElement('h1');
  const message = document.createElement('p');

  title.style.textTransform = 'capitalize';

  notification.setAttribute('class', `notification ${type}`);
  notification.setAttribute('data-qa', 'notification');
  title.textContent = type;
  message.textContent = text;

  notification.append(title);
  notification.append(message);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function getEmployee(employee) {
  const row = document.createElement('tr');

  Object.keys(employee).forEach((key) => {
    const cell = document.createElement('td');

    cell.textContent =
      key === 'salary'
        ? `$${employee[key].toLocaleString('en')}`
        : employee[key];

    row.append(cell);
  });

  return row;
}

function validateEditInput(value) {
  const type = 'warning';

  if (
    editingCell.includes('$') &&
    (+value.replace(/\D/g, '') === 0 || !value)
  ) {
    const text = 'Please, enter a salary';

    getNotification({ text, type });

    return null;
  }

  if (!editingCell.includes('$') && (value < 18 || value > 90)) {
    const text = 'Age must be between 18 and 90';

    getNotification({ text, type });

    return null;
  }

  if (editingCell.includes('$')) {
    const normalizedValue = +value.replace(/\D/g, '');

    return `$${normalizedValue.toLocaleString('en')}`;
  }

  return value;
}

function processEditInput() {
  const editInput = activeRow.querySelector('.cell-input');
  const normalizedValue = validateEditInput(editInput.value);

  switch (normalizedValue) {
    case null:
      document.querySelector('.cell-input').focus();
      break;

    case normalizedValue:
      editInput.parentElement.textContent = normalizedValue;
      editInput.remove();
      edit = '';
      break;
  }
}

function getOptionCities(select) {
  officeCities.forEach((city) => {
    const option = document.createElement('option');

    option.textContent = `${city}`;
    option.setAttribute('value', `${city}`);

    if (city === editingCell) {
      option.setAttribute('selected', 'selected');
    }

    select.append(option);
  });
}

function getEditCity(selectedCell) {
  selectedCell.textContent = '';

  const select = document.createElement('select');

  select.setAttribute('name', 'edit-city');
  select.style.width = '150px';
  select.style.boxSizing = 'border-box';
  select.style.border = '1px solid #808080';
  select.style.borderRadius = '4px';
  select.style.color = '#808080';
  select.style.padding = '4px';
  select.style.outlineColor = '#808080';

  getOptionCities(select);

  selectedCell.append(select);
}

function processEditCity() {
  const editCity = document.getElementsByName('edit-city')[0];

  editCity.parentElement.textContent = editCity.value;
  editCity.remove();
  edit = '';
}

const tableHead = [...document.querySelector('thead').querySelectorAll('th')];
const submitButton = document.createElement('button');
const officeCities = getUniqueCities();

let sortField = '';
let isDescending = false;
let activeRow = null;
let edit = '';
let editingCell = '';

document.body.append(getForm());

addEventListener('click', (e) => {
  e.preventDefault();

  const selectedRow = e.target.parentElement;
  const tableBodyRows = [...document.querySelector('tbody').rows];

  if (tableHead.includes(e.target)) {
    const index = tableHead.findIndex((cell) => cell === e.target);
    const sortBy = e.target.textContent;

    const sortedRows = sortTableByColumn(index, sortBy, tableBodyRows);
    const tableBody = document.querySelector('tbody');
    const newTableBody = document.createElement('tbody');

    sortedRows.forEach((row) => newTableBody.append(row));
    tableBody.replaceWith(newTableBody);
  }

  if (
    (activeRow &&
      activeRow !== selectedRow &&
      tableBodyRows.includes(selectedRow)) ||
    (activeRow &&
      !tableBodyRows.includes(selectedRow) &&
      selectedRow.parentElement !== document.querySelector('thead'))
  ) {
    activeRow.removeAttribute('class');
  }

  if (tableBodyRows.includes(selectedRow) && !edit) {
    selectedRow.setAttribute('class', 'active');
    activeRow = selectedRow;
  }

  if (e.target === submitButton) {
    createNewEmployee();
  }

  if (edit && edit !== 'city' && activeRow && selectedRow !== activeRow) {
    processEditInput();
  }

  if (edit === 'city' && activeRow && selectedRow.parentElement !== activeRow) {
    processEditCity();
  }
});

addEventListener('dblclick', (e) => {
  const tableBodyRows = [...document.querySelector('tbody').rows];

  if (!tableBodyRows.includes(e.target.parentElement)) {
    return;
  }

  const selectedCell = e.target;
  const cityCell = selectedCell.parentElement.querySelectorAll('td')[2];

  activeRow.removeAttribute('class');
  editingCell = e.target.textContent;

  if (selectedCell === cityCell) {
    edit = 'city';
    getEditCity(selectedCell);

    return;
  }

  const input = document.createElement('input');

  input.setAttribute('class', 'cell-input');
  input.value = editingCell;
  e.target.textContent = '';
  e.target.append(input);

  activeRow = e.target;
  input.focus();
  edit = 'other';
});

addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && edit === 'other') {
    processEditInput();
  }

  if (e.key === 'Escape' && edit === 'other') {
    const editInput = activeRow.querySelector('.cell-input');

    editInput.parentElement.textContent = editingCell;
    editInput.remove();
    edit = '';
  }

  if (e.key === 'Escape' && edit === 'city') {
    processEditCity();
  }
});

addEventListener('change', () => {
  if (officeCities.includes(editingCell)) {
    processEditCity();
  }
});

'use strict';

const FORM_FIELDS_PROPERTY = [
  { type: 'text', name: 'Name', decorate: decorateString },
  { type: 'text', name: 'Position', decorate: decorateString },
  {
    type: 'select',
    name: 'Office',
    selectValues: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
    decorate: decorateString,
  },
  { type: 'number', name: 'Age', decorate: decorateNumber },
  { type: 'number', name: 'Salary', decorate: decorateSalary },
];

const tableElement = document.querySelector('table');
const theadElement = document.querySelector('thead');
const tbodyElement = document.querySelector('tbody');

function determineSortOrder(element) {
  const sortedColumnIndex = element.target.cellIndex;

  if (parseInt(tableElement.dataset.sortIndex) === sortedColumnIndex) {
    if (tableElement.dataset.sortOrder === 'asc') {
      tableElement.dataset.sortOrder = 'desc';
    } else {
      tableElement.dataset.sortOrder = 'asc';
    }
  } else {
    tableElement.dataset.sortIndex = sortedColumnIndex;
    tableElement.dataset.sortOrder = 'asc';
  }

  sortTable();
}

function sortTable() {
  const sortedList = Object.values(tbodyElement.rows).sort(
    (firstEl, secondEl) => {
      const firstValue = cellValueFromRow(firstEl);
      const secondValue = cellValueFromRow(secondEl);

      switch (firstValue.localeCompare(secondValue, 'en', { numeric: true })) {
        case 1:
          return sortByAsc() ? -1 : 1;
        case -1:
          return sortByAsc() ? 1 : -1;
        case 0:
          return 0;
      }
    },
  );

  for (const elem of sortedList) {
    tbodyElement.prepend(elem);
  }
}

function selectRow(element) {
  const previousSelectedElement = document.querySelector('.active');

  if (previousSelectedElement) {
    previousSelectedElement.classList.remove('active');
  }

  element.target.parentElement.classList.add('active');
}

function loadEmployeeForm() {
  const formElement = document.createElement('form');

  formElement.classList.add('new-employee-form');

  tableElement.after(formElement);

  buildFormInputs(formElement);

  const submitButton = document.createElement('button');

  submitButton.textContent = 'Save to table';

  formElement.append(submitButton);

  formElement.addEventListener('submit', (el) => addNewElement(el));
}

function buildFormInputs(form) {
  for (const field of FORM_FIELDS_PROPERTY) {
    const label = document.createElement('label');

    label.textContent = `${field.name}: `;

    if (field.selectValues) {
      const select = document.createElement('select');

      select.name = field.name.toLowerCase();

      select.dataset.qa = field.name.toLowerCase();

      for (const selectOption of field.selectValues) {
        const option = document.createElement('option');

        option.value = selectOption.toLowerCase();
        option.textContent = selectOption;

        select.append(option);
      }

      label.append(select);
    } else {
      const input = document.createElement('input');

      input.name = field.name.toLowerCase();
      input.type = field.type;
      input.required = true;

      input.dataset.qa = field.name.toLowerCase();

      label.append(input);
    }

    form.append(label);
  }
}

const sortByAsc = () => tableElement.dataset.sortOrder !== 'desc';
const sortByRowIndex = () => parseInt(tableElement.dataset.sortIndex) || 0;

const cellValueFromRow = (row) => row.cells[sortByRowIndex()].textContent;

const addNewElement = (form) => {
  const trElement = document.createElement('tr');

  form.preventDefault();

  for (const input of FORM_FIELDS_PROPERTY) {
    const inputElement = document.querySelector(
      `[name="${input.name.toLowerCase()}"]`,
    );
    const tdElement = document.createElement('td');

    tdElement.textContent = input.decorate(inputElement.value);

    trElement.append(tdElement);
  }

  tbodyElement.append(trElement);

  sortTable();
};

function decorateString(value) {
  const decoratedResult = [];

  for (const word of value.split(' ')) {
    const decoratedValue = word[0].toUpperCase() + word.slice(1).toLowerCase();

    decoratedResult.push(decoratedValue);
  }

  return decoratedResult.join(' ');
}

function decorateNumber(value) {
  return parseInt(value);
}

function decorateSalary(value) {
  const decoratedValue = value.split('');

  for (let i = decoratedValue.length - 3; i > 0; i -= 3) {
    decoratedValue.splice(i, 0, ',');
  }

  return `$${decoratedValue.join('')}`;
}

theadElement.addEventListener('click', (element) => {
  determineSortOrder(element);
});

tbodyElement.addEventListener('click', (element) => selectRow(element));

window.addEventListener('load', loadEmployeeForm);

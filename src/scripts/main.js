'use strict';

// #region utils
const compareNumbers = (a, b) => +a.replace(/\D/g, '') - +b.replace(/\D/g, '');
const compareStrings = (a, b) => a.localeCompare(b);
const capitalize = (string) =>
  string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
const isInRange = (value, { min = 0, max = Infinity }) =>
  value >= min && value <= max;
const salaryToString = (salary) => '$' + salary.toLocaleString('en-US');
// #endregion

// #region createSortListener
function createSortListener() {
  let currentOrderBy = null;

  return (e) => {
    if (e.target.tagName !== 'TH' || !e.target.closest('thead')) {
      return;
    }

    let colIndex = 0;

    for (
      let node = e.target.previousElementSibling;
      node;
      node = node.previousElementSibling
    ) {
      colIndex++;
    }

    const table = e.target.closest('table');

    if (!table) {
      throw new Error('th not isnsie table');
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const title = e.target.innerText;

    if (e.target === currentOrderBy) {
      rows.reverse();
    } else {
      sortRows(title, rows, colIndex);
      currentOrderBy = e.target;
    }

    const tbody = table.querySelector('tbody');

    rows.forEach((row) => tbody.append(row));
  };
}

function sortRows(title, rows, colIndex) {
  let isNumber;

  switch (title.toUpperCase()) {
    case 'AGE':
    case 'SALARY':
      isNumber = true;
      break;
    default:
      isNumber = false;
  }

  rows.sort((a, b) => {
    const textA = a.children.item(colIndex).innerText;
    const textB = b.children.item(colIndex).innerText;

    return isNumber
      ? compareNumbers(textA, textB)
      : compareStrings(textA, textB);
  });

  return rows;
}
// #endregion

// #region createSelectLister
function createSelectListener() {
  let activeRow = null;

  return (e) => {
    if (!e.target.closest('tbody')) {
      return;
    }

    const row = e.target.closest('tr');

    if (!row) {
      throw new Error('not inside tr tag');
    }

    if (activeRow) {
      if (activeRow === row) {
        return;
      }

      activeRow.classList.toggle('active');
    }
    activeRow = row;
    activeRow.classList.toggle('active');
  };
}
// #endregion

// #region createForm
function createForm(formFields) {
  const form = document.createElement('FORM');

  form.className = 'new-employee-form';

  formFields.forEach((data) => {
    let field;

    switch (data.type) {
      case 'select':
        field = createSelect(data);
        break;
      case 'button':
        field = createButton(data);
        break;
      default:
        field = createInput(data);
    }

    form.append(field);
  });

  return form;
}

function createInput({ name: inputName, type }) {
  const label = document.createElement('LABEL');
  const input = document.createElement('INPUT');

  input.name = inputName;
  input.type = type;
  input.dataset.qa = inputName;

  label.append(capitalize(inputName), input);

  return label;
}

function createSelect({ name: selectName, options }) {
  const label = document.createElement('LABEL');
  const select = document.createElement('SELECT');

  select.name = selectName;
  select.dataset.qa = selectName;

  options.forEach((optionName) => {
    const option = document.createElement('OPTION');

    option.value = optionName;
    option.innerText = optionName;
    select.append(option);
  });

  label.append(capitalize(selectName), select);

  return label;
}

function createButton({ name: buttonName }) {
  const button = document.createElement('BUTTON');

  button.type = 'submit';
  button.append(buttonName);

  return button;
}
// #endregion

// #region createFormValidation
function createFormValidation(formFields, table) {
  return (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const employee = {};

    for (const [key, value] of formData) {
      if (value.length < 1) {
        pushNotification(
          0,
          0,
          'Empty field',
          `Field ${key} was empty`,
          'error',
        );

        return;
      }

      const field = formFields.find((el) => el.name === key);
      let isFieldValid = true;

      switch (field.type) {
        case 'number':
          isFieldValid = isInRange(+value, field);
          break;
        case 'text':
          isFieldValid = isInRange(value.length, field);
          break;
      }

      if (isFieldValid) {
        employee[key] = value;
      } else {
        pushNotification(
          0,
          0,
          'Invalid Data',
          `Data in ${key} was invalid`,
          'error',
        );

        return;
      }
    }

    addRow(table, employee);

    pushNotification(
      0,
      0,
      'Employee added',
      'Employee was successfully added to the table',
      'success',
    );
    form.reset();
  };
}
// #endregion

// #region addRow
function addRow(table, { name: employeeName, position, office, age, salary }) {
  const row = document.createElement('TR');
  const nameElement = document.createElement('TD');
  const positionElement = document.createElement('TD');
  const officeElement = document.createElement('TD');
  const ageElement = document.createElement('TD');
  const salaryElement = document.createElement('TD');

  nameElement.innerText = employeeName;
  positionElement.innerText = position;
  officeElement.innerText = office;
  ageElement.innerText = age;
  salaryElement.innerText = salaryToString(+salary);

  row.append(
    nameElement,
    positionElement,
    officeElement,
    ageElement,
    salaryElement,
  );

  table.append(row);
}
// #endregion

// #region pushNotification
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('DIV');
  const titleElement = document.createElement('H2');
  const descriptionElement = document.createElement('P');

  titleElement.className = 'title';
  titleElement.innerText = title;

  descriptionElement.innerText = description;

  notification.className = `notification ${type}`;
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.dataset.qa = 'notification';

  notification.append(titleElement, descriptionElement);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);

  return notification;
};
// #endregion

// #region createEditListener
function createEditListener() {
  let inEdit = false;

  return async (e) => {
    if (e.target.tagName !== 'TD' || inEdit) {
      return;
    }

    const cell = e.target;
    const currentText = cell.innerText;
    const input = document.createElement('INPUT');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = currentText;

    cell.innerText = '';
    cell.append(input);
    input.focus();

    try {
      inEdit = true;
      cell.append(await getInputValue(input));
    } catch (error) {
      cell.innerText = currentText;
    } finally {
      input.remove();
      inEdit = false;
    }
  };
}

function getInputValue(input) {
  const resolver = (resolve, reject) => {
    const inputEventHandler = () => {
      if (input.value.length < 1) {
        reject();

        return;
      }

      resolve(input.value);
    };

    input.addEventListener('blur', inputEventHandler);

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        inputEventHandler();
      }
    });
  };

  return new Promise(resolver);
}
// #endregion

const FORM_FIELDS = [
  {
    name: 'name',
    type: 'text',
    min: 4,
  },
  {
    name: 'position',
    type: 'text',
  },
  {
    name: 'office',
    type: 'select',
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
    name: 'age',
    type: 'number',
    min: 18,
    max: 90,
  },
  {
    name: 'salary',
    type: 'number',
  },
  {
    name: 'Save to table',
    type: 'button',
  },
];

const formElement = createForm(FORM_FIELDS);
const tbodyElement = document.querySelector('table tbody');

document.body.append(formElement);

const sortListener = createSortListener();
const selectListener = createSelectListener();
const edditListenr = createEditListener();
const formValidation = createFormValidation(FORM_FIELDS, tbodyElement);

document.addEventListener('click', sortListener);
document.addEventListener('click', selectListener);
document.addEventListener('dblclick', edditListenr);
formElement.addEventListener('submit', formValidation);

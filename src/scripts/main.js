'use strict';

const table = document.querySelector('.employees-table');
const headings = document.querySelector('.employees-table__headings');
const tableData = document.querySelector('.employees-table__content');

const TABLE_COLUMNS = [
  'Name',
  'Position',
  'Office',
  'Age',
  'Salary',
];

const FORM_FIELDS = [
  {
    fieldType: 'input',
    label: 'Name: ',
    name: 'name',
    dataQa: 'name',
    type: 'text',
  },
  {
    fieldType: 'input',
    label: 'Position: ',
    name: 'position',
    dataQa: 'position',
    type: 'text',
  },
  {
    fieldType: 'select',
    label: 'Office: ',
    name: 'office',
    dataQa: 'office',
  },
  {
    fieldType: 'input',
    label: 'Age: ',
    name: 'age',
    dataQa: 'age',
    type: 'number',
  },
  {
    fieldType: 'input',
    label: 'Salary: ',
    name: 'salary',
    dataQa: 'salary',
    type: 'number',
  },
];

const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

createForm();
selectRow();
sortTable();
editCell();

function sortTable() {
  let sortingColumn = null;

  table.addEventListener('click', sortData);

  function sortData(clickEvent) {
    const target = clickEvent.target.closest('.employees-table__heading-title');

    if (target && headings.contains(target)) {
      const columnIndex = target.cellIndex;

      switch (target.textContent) {
        /* eslint-disable no-fallthrough, padding-line-between-statements */
        case 'Age':
        case 'Salary': {
          const sorted = sortNumbers(tableData.children, columnIndex);

          sortingColumn = columnIndex;

          tableData.append(...sorted);
          break;
        }
        /* eslint-enable no-fallthrough, padding-line-between-statements */

        default: {
          const sorted = sortStrings(tableData.children, columnIndex);

          sortingColumn = columnIndex;

          tableData.append(...sorted);
          break;
        }
      }
    }
  }

  function sortNumbers([...data], cellIndex) {
    if (cellIndex === sortingColumn) {
      return data.reverse();
    }

    const sorted = data.sort((rowA, rowB) => {
      const valA = [...rowA.children][cellIndex].textContent;
      const valB = [...rowB.children][cellIndex].textContent;

      return makeNumber(valA) - makeNumber(valB);
    });

    return sorted;
  };

  function sortStrings([...data], cellIndex) {
    if (cellIndex === sortingColumn) {
      return data.reverse();
    }

    const sorted = data.sort((rowA, rowB) => {
      const valA = [...rowA.children][cellIndex].textContent;
      const valB = [...rowB.children][cellIndex].textContent;

      return valA.localeCompare(valB);
    });

    return sorted;
  };
}

function selectRow() {
  table.addEventListener('click', activateRow);

  function activateRow(clickEvent) {
    const target = clickEvent.target.closest('tr');

    if (target && tableData.contains(target)) {
      const currentActive = document.querySelector('.active');

      if (currentActive) {
        currentActive.classList.remove('active');
      }

      target.classList.add('active');
    }
  }
}

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  for (const field of FORM_FIELDS) {
    const label = document.createElement('label');

    label.innerHTML = field.label;

    let input;

    if (field.fieldType === 'select') {
      input = document.createElement('select');

      input.name = field.name;
      input.dataset.qa = field.dataQa;

      input.innerHTML = `
        ${OFFICES.map(office => `<option>${office}</option>`).join('/n')}
      `;
    }

    if (field.fieldType === 'input') {
      input = document.createElement('input');

      input.name = field.name;
      input.dataset.qa = field.dataQa;
      input.type = field.type;
      input.required = field.required;

      if (input.type === 'text') {
        input.minLength = field.minLength;
      }
    }

    label.append(input);
    form.append(label);
  }

  const submitButton = document.createElement('button');

  submitButton.textContent = 'Save to table';
  submitButton.type = 'submit';

  submitButton.addEventListener('click', submitForm);

  form.append(submitButton);
  table.after(form);
}

function submitForm(submitEvent) {
  submitEvent.preventDefault();

  const form = document.querySelector('.new-employee-form');

  const formFields
    = [...form.elements]
      .filter(input => input.tagName.toUpperCase() !== 'BUTTON');

  for (const input of formFields) {
    const result = validateInput(input);

    if (!result) {
      return;
    }
  }

  const formData = new FormData(form);
  const employee = Object.fromEntries(formData.entries());

  appendEmployee(employee);

  form.reset();

  pushNotification(
    'Success!',
    `New employee is added`,
    'success',
  );
}

function appendEmployee(employee) {
  const employeeRow = document.createElement('tr');

  employeeRow.innerHTML = `
    <td>
      ${employee.name.split(' ').map(word => capitalize(word)).join(' ')}
    </td>
    <td>
      ${capitalize(employee.position)}
    </td>
    <td>
      ${employee.office}
    </td>
    <td>
      ${employee.age}
    </td>
    <td>
      ${makeMoneyFormat(employee.salary)}
    </td>
  `;

  tableData.append(employeeRow);
}

function validateInput(input) {
  const { value } = input;

  switch (input.name) {
    case 'name' : {
      if (value.length === 0) {
        pushNotification(
          'Empty field',
          'Name field is empty',
          'error',
        );

        return false;
      }

      if (value.length < 4) {
        pushNotification(
          'A short name',
          'Minimum length of the name is 4 symbols',
          'error',
        );

        return false;
      }

      if (!isNaN(value)) {
        pushNotification(
          'Error',
          'Name should start with a letter',
          'error',
        );

        return false;
      }

      return true;
    }

    case 'position' : {
      if (value.length === 0) {
        pushNotification(
          'Empty field',
          'Position field is empty',
          'error',
        );

        return false;
      }

      if (value.length < 2) {
        pushNotification(
          'The shortest one is HR',
          'Minimum length of the position is 2 symbols',
          'error',
        );

        return false;
      }

      if (!isNaN(value)) {
        pushNotification(
          'Not a position',
          'Position can\'t start with a number',
          'error',
        );

        return false;
      }

      return true;
    }

    case 'age' : {
      if (value.length === 0) {
        pushNotification(
          'Empty field',
          'Age field is empty',
          'error',
        );

        return false;
      }

      if (isNaN(value)) {
        pushNotification(
          'Not a number',
          'Age should be a number',
          'error',
        );

        return false;
      }

      if (value < 0) {
        pushNotification(
          'wuuuut?',
          'Age can\'t be negative',
          'error',
        );

        return false;
      }

      if (+value < 18) {
        pushNotification(
          'Too Young',
          'Minimum age is 18',
          'error',
        );

        return false;
      }

      if (+value > 90) {
        pushNotification(
          'Too old',
          'Maximum age is 90',
          'error',
        );

        return false;
      }

      return true;
    }

    case 'salary' : {
      if (value.length === 0) {
        pushNotification(
          'Empty field',
          'Salary field is empty',
          'error',
        );

        return false;
      }

      if (isNaN(value)) {
        pushNotification(
          'Not a number',
          'Salary should be a number',
          'error',
        );

        return false;
      }

      if (value < 0) {
        pushNotification(
          'We don\' need your money',
          'Salary can\'t be negative',
          'error',
        );

        return false;
      }

      return true;
    }

    default: {
      return true;
    }
  }
}

function editCell() {
  tableData.addEventListener('dblclick', editCellContent);

  function editCellContent(clickEvent) {
    if (clickEvent.target.closest('input')
      || clickEvent.target.closest('select')) {
      return;
    };

    const target = clickEvent.target.closest('td');
    let input;

    target.textContent += '';

    if (target.cellIndex === 2) {
      input = document.createElement('select');

      const options = OFFICES.map(office => {
        if (target.textContent.trim() === office) {
          return `<option selected>${office}</option>`;
        }

        return `<option>${office}</option>`;
      }).join('/n');

      setTimeout(() => {
        input.innerHTML = options;
      }, 0);
    } else {
      input = document.createElement('input');
    }

    input.oldValue = target.textContent.trim();
    input.placeholder = TABLE_COLUMNS[target.cellIndex];
    input.name = TABLE_COLUMNS[target.cellIndex].toLowerCase();

    if (TABLE_COLUMNS[target.cellIndex] === 'Salary') {
      input.value = makeNumber(input.oldValue);
    } else {
      input.value = input.oldValue;
    }

    target.textContent = '';
    target.append(input);
    target.style.position = 'relative';

    input.classList.add('cell-input');
    input.style.position = 'absolute';
    input.style.inset = 0;
    input.style.margin = 'auto';
    input.style.paddingLeft = '20px';
    input.focus();

    input.addEventListener('keyup', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        input.blur();
      }
    });

    input.addEventListener('click', (optionClick) => {
      const targetOption = optionClick.target.closest('option');

      if (targetOption) {
        input.blur();
      }
    });

    input.addEventListener('blur', inputLeave);
  }
}

function inputLeave(blurEvent) {
  const target = blurEvent.target;
  const filledCorrectly = validateInput(target);

  if (!filledCorrectly) {
    target.parentElement.style.border = '2px solid red';

    window.setTimeout(() => target.focus(), 0);

    return;
  }

  const cell = document.createElement('td');
  let newValue;

  if (target.oldValue.includes('$') && target.value.length > 0) {
    newValue = makeMoneyFormat(target.value);
  } else {
    newValue
      = target.value.split(' ').map(word => capitalize(word)).join(' ');
  }

  cell.textContent
  = newValue || target.oldValue;

  target.parentElement.style.border = 'none';
  target.outerHTML = cell.outerHTML;
}

function pushNotification(title, description, type) {
  const container = document.createElement('DIV');

  container.innerHTML = ` 
    <h2 class = 'title'>${title}</h2>
    <p>${description}</p>
  `;
  container.classList.add('notification', type);
  container.style.top = '20px';
  container.style.right = '20px';
  document.body.appendChild(container);
  container.dataset.qa = 'notification';
  setTimeout(() => container.remove(), 4000);
};

function makeMoneyFormat(num) {
  return '$' + Number(num).toLocaleString('en-US');
}

function makeNumber(str) {
  return +str.replace(/\D/g, '');
}

function capitalize(str) {
  if (str.length === 0) {
    return;
  }

  return str[0].toUpperCase() + str.slice(1);
}

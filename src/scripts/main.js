'use strict';

const types = {
  number: 'number',
  text: 'text',
  salary: 'salary',
};

const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const tableRows = table.rows;

const headRow = tableRows[0];
const headElements = [...headRow.children];

const newEmployee = {
  name: '',
  position: '',
  office: '',
  age: 0,
  salary: 0,
};

const dataType = (value) => {
  switch (value) {
    case 'Age':
      return types.number;

    case 'Salary':
      return types.salary;

    case 'Name':
      return types.text;

    case 'Position':
      return types.text;

    case 'Office':
      return types.text;

    default:
      return types.text;
  }
};

// #region sort
const ascOrder = 'asc';
const descOrder = 'desc';

let sortTitle = '';
let order = ascOrder;

thead.addEventListener('click', (e) => {
  const appendTable = (list) => {
    list.forEach((tr) => {
      tbody.appendChild(tr);
    });
  };

  const changeOrder = () => {
    order = order === ascOrder ? descOrder : ascOrder;
  };

  const link = e.target.closest('th');

  if (link.textContent === sortTitle) {
    changeOrder();
  } else {
    order = ascOrder;
  }

  sortTitle = link.textContent;

  if (!link) {
    return;
  }

  const index = headElements.findIndex(
    (el) => el.textContent === link.textContent,
  );

  const tbodyCopy = tbody.cloneNode(true);

  const sortedList = [...tbodyCopy.children].sort((rowA, rowB) => {
    const firstEl = Array.from(rowA.children)[index].textContent;
    const secondEl = Array.from(rowB.children)[index].textContent;

    if (dataType(link.textContent) === types.salary) {
      const salaryNum = (salary) => Number(salary.slice(1).split(',').join(''));

      return salaryNum(firstEl) - salaryNum(secondEl);
    }

    if (dataType(link.textContent) === types.number) {
      return Number(firstEl) - Number(secondEl);
    }

    if (dataType(link.textContent) === types.text) {
      return firstEl.localeCompare(secondEl);
    }
  });

  tbody.textContent = '';

  return order === ascOrder
    ? appendTable(sortedList)
    : appendTable(sortedList.reverse());
});

// #endregion

// #region selected row

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  const selectedRow = document.querySelector('.active');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  if (!row) {
    return;
  }

  row.setAttribute('class', 'active');
});

// #endregion

// #region messeges

const error = (message) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.setAttribute('class', 'notification error');

  const title = document.createElement('h2');

  title.textContent = 'Error!';

  const description = document.createElement('p');

  description.textContent = message;

  notification.append(title);
  notification.append(description);

  document.body.append(notification);
};

const success = () => {
  const errorMessage = document.querySelector('.error');

  if (errorMessage) {
    errorMessage.remove();
  }

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.setAttribute('class', 'notification success');

  const title = document.createElement('h2');

  title.textContent = 'Success!';

  const description = document.createElement('p');

  description.textContent = 'New employee added with success!';

  notification.append(title);
  notification.append(description);

  document.body.append(notification);
};

// #endregion

// #region converters
const salaryConvertValue = (value) => {
  const formattedNum = value.toLocaleString('en-US');

  return '$' + String(formattedNum);
};

const wordConvert = (word) => {
  return word.trim().charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

// #endregion

// #region validationFunc
const validation = () => {
  const employeeName = document.querySelector("[data-qa='name']").value;
  const position = document.querySelector("[data-qa='position']").value;
  const office = document.querySelector("[data-qa='office']").value;
  const age = Number(document.querySelector("[data-qa='age']").value);
  const salary = Number(document.querySelector("[data-qa='salary']").value);

  if (employeeName.trim().length < 4) {
    const message = 'Name has less than 4 letters';

    return error(message);
  } else {
    newEmployee.name = wordConvert(employeeName);
  }

  if (position.trim().length < 4) {
    const message = 'Position has less than 4 letters';

    return error(message);
  } else {
    newEmployee.position = position;
  }

  newEmployee.office = office;

  if (age < 18 || age > 90) {
    const message = 'Age is less than 18 or more than 90';

    return error(message);
  } else {
    newEmployee.age = age;
  }

  newEmployee.salary = salaryConvertValue(salary);

  return true;
};
// #endregion

// #region submitFunc

const addEmployee = () => {
  const tr = document.createElement('tr');

  if (validation()) {
    for (const key in newEmployee) {
      const td = document.createElement('td');

      td.textContent = newEmployee[key];

      tr.append(td);
    }

    tbody.append(tr);

    reset();
    success();
  }
};

// #endregion

// #region resetFunc

const reset = () => {
  const inputs = [...document.querySelectorAll('input')];

  inputs.forEach((input) => {
    input.value = '';
  });

  const selects = [...document.querySelectorAll('select')];

  selects.forEach((select) => (select.value = select.children[0].value));
};

// #endregion

// #region form

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

const inputField = (labelText, inputType) => {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.setAttribute('type', inputType);
  input.setAttribute('name', labelText.toLowerCase());
  input.setAttribute('data-qa', labelText.toLowerCase());
  input.setAttribute('required', '');

  label.appendChild(input);

  return label;
};

const selectField = (labelText) => {
  const selectLabel = document.createElement('label');
  const select = document.createElement('select');

  selectLabel.textContent = labelText;

  select.setAttribute('name', labelText.toLowerCase());
  select.setAttribute('data-qa', labelText.toLowerCase());
  select.setAttribute('required', '');

  const optionField = (value) => {
    const option = document.createElement('option');

    option.textContent = value;

    option.setAttribute('value', value);

    return option;
  };

  select.append(optionField('Tokyo'));
  select.append(optionField('Singapore'));
  select.append(optionField('London'));
  select.append(optionField('New York'));
  select.append(optionField('Edinburgh'));
  select.append(optionField('San Francisco'));

  selectLabel.appendChild(select);

  return selectLabel;
};

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

form.append(inputField('Name', 'text'));
form.append(inputField('Position', 'text'));
form.append(selectField('Office'));
form.append(inputField('Age', 'number'));
form.append(inputField('Salary', 'number'));

form.append(button);

document.body.append(form);

button.addEventListener('click', (e) => {
  e.preventDefault();

  return addEmployee();
});

// #endregion

// #region update
tbody.addEventListener('dblclick', (e) => {
  e.preventDefault();

  const cell = e.target.closest('td');

  const currentValue = cell.textContent;
  let newValue = '';

  const parentRow = cell.parentElement;

  const cellIndex = [...parentRow.children].findIndex((child) => {
    return child === cell;
  });

  const cellType = headElements[cellIndex].textContent;

  let inputType = dataType(cellType);
  let valueType = inputType;

  if (inputType === 'salary') {
    inputType = 'number';
    valueType = 'salary';
  }

  cell.textContent = '';

  const input = document.createElement('input');

  input.setAttribute('class', 'cell-input');
  input.setAttribute('type', inputType);

  cell.append(input);
  input.focus();

  input.addEventListener('change', (inputE) => {
    newValue = inputE.target.value;
    input.setAttribute('value', newValue);
  });

  const saveChanges = () => {
    input.remove();

    const updatedValue = newValue !== '' ? newValue : currentValue;

    const convertedValue = () => {
      if (valueType === types.text) {
        return wordConvert(updatedValue);
      }

      if (valueType === types.salary) {
        return salaryConvertValue(updatedValue);
      }

      if (valueType === types.number) {
        return Number(updatedValue);
      }
    };

    cell.textContent = convertedValue();
  };

  input.addEventListener('blur', () => {
    return saveChanges();
  });

  input.addEventListener('keypress', (keyE) => {
    if (keyE.key === 'Enter') {
      keyE.preventDefault();

      saveChanges();
    }
  });
});
// #endregion

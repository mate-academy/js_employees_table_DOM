'use strict';

const tableHeaders = [...document.querySelectorAll('thead th')];
const tableRows = [...document.querySelectorAll('tbody tr')];
const tbody = document.querySelector('tbody');

const form = document.createElement('form');

form.classList.add('new-employee-form');

const createInput = (type, value, dataQa) => {
  const input = document.createElement('input');

  input.setAttribute('type', type);
  input.setAttribute('name', value);
  input.setAttribute('data-qa', dataQa);
  input.setAttribute('required', true);

  return input;
};

const createLabel = (text) => {
  const label = document.createElement('label');

  label.textContent = text;

  return label;
};

const createOption = (text, value) => {
  const option = document.createElement('option');

  option.textContent = text;
  option.setAttribute('value', value);

  return option;
};

const inputName = createInput('text', 'name', 'name');
const inputPosition = createInput('text', 'position', 'position');
const inputAge = createInput('number', 'age', 'age');
const inputSalary = createInput('number', 'salary', 'salary');

const button = document.createElement('button');

button.textContent = 'Save to table';

const labelName = createLabel('Name:');
const labelPosition = createLabel('Position:');
const labelCountry = createLabel('Country:');
const labelAge = createLabel('Age:');
const labelSalary = createLabel('Salary:');

const selectCountry = document.createElement('select');

form.setAttribute('id', 'formEmployees');
selectCountry.setAttribute('name', 'office');
selectCountry.setAttribute('data-qa', 'office');
button.setAttribute('type', 'submit');
button.setAttribute('form', 'formEmployees');

const countries = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

countries.forEach((c) => selectCountry.appendChild(createOption(c, c)));

labelName.appendChild(inputName);
labelPosition.appendChild(inputPosition);
labelCountry.appendChild(selectCountry);
labelAge.appendChild(inputAge);
labelSalary.appendChild(inputSalary);

form.append(
  labelName,
  labelPosition,
  labelCountry,
  labelAge,
  labelSalary,
  button,
);

document.body.appendChild(form);

const showNotification = (message, type) => {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.classList.add('notification', type);
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.alignItems = 'center';
  div.textContent = message;
  document.body.appendChild(div);

  setTimeout(() => {
    div.setAttribute('hidden', 'true');
  }, 3000);
};

const validateInput = (obj) => {
  if (obj.name.length < 4 || !obj.name.trim()) {
    showNotification('Name must be at least 4 letters', 'error');

    return false;
  }

  if (obj.position.length === 0 || !obj.position.trim()) {
    showNotification('Position is required', 'error');

    return false;
  }

  if (obj.age < 18 || obj.age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return false;
  }

  if (obj.salary.length === 0) {
    showNotification('Salary is required', 'error');

    return false;
  }

  return true;
};

const addComa = (value) => {
  const improvedValue = ('' + value).split('').reverse();
  let result = '';

  for (let i = 0; i < improvedValue.length; i++) {
    if (improvedValue.length >= 3) {
      if (i % 3 === 0) {
        result += ',';
      }
      result += improvedValue[i];
    } else {
      return value;
    }
  }

  result = result.split('').reverse().join('');

  if (result.endsWith(',')) {
    result = result.slice(0, -1);
  }

  return result;
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const formDataObj = Object.fromEntries(formData);

  if (validateInput(formDataObj)) {
    const tr = document.createElement('tr');

    for (const key in formDataObj) {
      const td = document.createElement('td');
      const value = formDataObj[key];

      if (key === 'salary') {
        td.textContent = `$${addComa(value)}`;
      } else {
        td.textContent = value;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    showNotification('You added the new employee', 'success');
    editRow(tr);

    for (const input of form) {
      input.value = '';
    }
  }
});

let orderSort = true;
let lastClickedHeader = null;
let indexRow = null;

tableRows.forEach((row, i) => {
  row.addEventListener('click', () => {
    const selectedRow = tableRows.find((r) => r.classList.contains('active'));

    if (indexRow !== i) {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      row.classList.add('active');
      indexRow = i;
    }
  });
});

const editRow = (row) => {
  row.addEventListener('dblclick', (e) => {
    const input = document.createElement('input');
    const target = e.target;
    const oldContent = e.target.textContent;

    input.classList.add('cell-input');
    target.textContent = '';
    target.appendChild(input);
    input.focus();

    const saveChanges = () => {
      const newValue = input.value.trim();

      target.textContent = newValue === '' ? oldContent : newValue;
    };

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveChanges();
      }
    });
  });
};

tableRows.forEach((value) => {
  editRow(value);
});

function sortByText(rows, pos) {
  rows.sort((a, b) => {
    const textOne = a.children[pos].textContent;
    const textTwo = b.children[pos].textContent;

    return orderSort
      ? textOne.localeCompare(textTwo)
      : textTwo.localeCompare(textOne);
  });
}

function sortByNumber(rows, pos) {
  rows.sort((a, b) => {
    const numOne = a.children[pos].textContent
      .replace(',', '')
      .replace('$', '');
    const numTwo = b.children[pos].textContent
      .replace(',', '')
      .replace('$', '');

    return orderSort ? numOne - numTwo : numTwo - numOne;
  });
}

function updateTable(rows) {
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

tableHeaders.forEach((th, index) => {
  th.addEventListener('click', (e) => {
    const copyTableRows = [...tableRows];

    if (e.currentTarget !== lastClickedHeader) {
      orderSort = true;
    } else {
      orderSort = !orderSort;
    }
    lastClickedHeader = e.currentTarget;

    switch (e.currentTarget.textContent) {
      case 'Name':
      case 'Position':
      case 'Office':
        sortByText(copyTableRows, index);
        break;
      case 'Age':
      case 'Salary':
        sortByNumber(copyTableRows, index);
        break;
      default:
        return;
    }
    updateTable(copyTableRows);
  });
});

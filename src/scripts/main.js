'use strict';

const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const headers = thead.querySelectorAll('th');

[ ...headers ].forEach(th => {
  th.sortDirection = '';

  return th.sortDirection;
});

const conversationToNumber = (value) => {
  const result = value.split('')
    .filter(element => element !== ' ')
    .filter(element => !isNaN(Number(element)));

  if (result.length === 0) {
    return value;
  }

  return Number(result.join(''));
};

const tableSorting = (e) => {
  const th = e.target.closest('th');

  if (!th || !thead.contains(th)) {
    return;
  }

  switch (headers[th.cellIndex].sortDirection) {
    case '':
      headers[th.cellIndex].sortDirection = 'ASC';
      break;
    case 'ASC':
      headers[th.cellIndex].sortDirection = 'DESC';
      break;
    default:
      headers[th.cellIndex].sortDirection = 'ASC';
  };

  const type = conversationToNumber(
    [ ...tbody.rows ][0].cells[th.cellIndex].innerHTML);

  let sortTable;

  if (typeof (type) === 'string') {
    sortTable = (headers[th.cellIndex].sortDirection === 'ASC')
      ? [ ...tbody.rows ].sort((row1, row2) =>
        row1.cells[th.cellIndex].innerHTML
          .localeCompare(row2.cells[th.cellIndex].innerHTML))
      : [ ...tbody.rows ].sort((row1, row2) =>
        row2.cells[th.cellIndex].innerHTML
          .localeCompare(row1.cells[th.cellIndex].innerHTML));
  };

  if (typeof (type) === 'number') {
    sortTable = (headers[th.cellIndex].sortDirection === 'ASC')
      ? [ ...tbody.rows ].sort((row1, row2) =>
        conversationToNumber(row1.cells[th.cellIndex].innerHTML)
          - conversationToNumber(row2.cells[th.cellIndex].innerHTML))
      : [ ...tbody.rows ].sort((row1, row2) =>
        conversationToNumber(row2.cells[th.cellIndex].innerHTML)
          - conversationToNumber(row1.cells[th.cellIndex].innerHTML));
  }
  tbody.append(...sortTable);
};

thead.addEventListener('click', tableSorting);

const selectRow = (e) => {
  const tr = e.target.closest('tr');

  if (!tr || !tbody.contains(tr)) {
    return;
  }

  [ ...tbody.rows ].forEach(row => row.classList.remove('active'));
  tr.classList.add('active');
};

tbody.addEventListener('click', selectRow);

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('novalidate', true);
table.after(form);

const inputNames = [ ...headers ].map(header => header.innerHTML);

const countriesOffice = [ ...tbody.rows ].map(row =>
  row.cells[inputNames.findIndex(input => input === 'Office')].innerHTML);

const countriesOptions = countriesOffice.filter((country, index) =>
  countriesOffice.indexOf(country) === index);

form.innerHTML = `
${inputNames.map(inputName =>
    (inputName !== 'Office')
      ? ` <label>${inputName}:
            <input name="${inputName.toLowerCase()}" type="text"
              data-qa="${inputName.toLowerCase()}" required>
          </label>`
      : ` <label>${inputName}:
            <select name="${inputName.toLowerCase()}"
              data-qa="${inputName.toLowerCase()}">
              ${countriesOptions.map(option => `<option value="${option}">
                ${option}
              </option>`).join('')}
            </select>
          </label>`
  ).join('')}
  <button type="submit">Save to table</button> `;

form.elements.age.attributes.type.value = 'number';
form.elements.salary.attributes.type.value = 'number';

const regexpName = /[A-Za-z]{4,}/;
const regexpPosition = /[A-Za-z]+/;
const regexpOffice
  = /Tokyo|Singapore|London|New York|Edinburgh|San Francisco/;
const regexpAge
  = /^(1[8-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|90)$/;
const regexpSalary = /[0-9]+/;

const validateForm = (regexp, value) => regexp.test(value);

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');
  form.after(div);
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;
  h2.className = 'title';
  h2.textContent = title;
  div.append(h2);
  p.innerText = description;
  div.append(p);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

const addNewEmployee = (e) => {
  e.preventDefault();

  if (!validateForm(regexpName, form.elements.name.value)) {
    pushNotification(10, 5, 'Error',
      'Enter Name.\n '
  + 'Minimum allowed number of characters: 4', 'error');
  } else if (!validateForm(regexpPosition, form.elements.position.value)) {
    pushNotification(10, 5, 'Error',
      'Enter Position', 'error');
  } else if (!validateForm(regexpAge, form.elements.age.value)) {
    pushNotification(10, 5, 'Error',
      'Enter Age.\n '
  + 'The value must be less than 18 or greater than 90', 'error');
  } else if (!validateForm(regexpSalary, form.elements.salary.value)) {
    pushNotification(10, 5, 'Error',
      'Enter Salary', 'error');
  } else {
    const data = new FormData(form);
    const dataNewEmployee = Object.fromEntries(data.entries());

    tbody.append(tbody.lastElementChild.cloneNode());

    tbody.lastElementChild.innerHTML = `
      <td>${dataNewEmployee.name}</td>
      <td>${dataNewEmployee.position}</td>
      <td>${dataNewEmployee.office}</td>
      <td>${dataNewEmployee.age}</td>
      <td>$${Number(dataNewEmployee.salary).toLocaleString('en')}</td>`;

    pushNotification(10, 5, 'Success',
      'New employee has been successfully added to the table', 'success');

    form.reset();
  }
};

form.addEventListener('submit', addNewEmployee);

const editingCell = (e) => {
  const td = e.target.closest('td');

  if (!td || !tbody.contains(td)) {
    return;
  }

  const initialValue = td.innerHTML;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = '';

  td.innerHTML = '';
  td.append(input);
  input.focus();

  const savingChangesCell = () => {
    switch (td.cellIndex) {
      case 0:
        if (validateForm(regexpName, input.value)) {
          td.innerHTML = input.value;
          input.remove();
        } else {
          td.innerHTML = initialValue;
        }
        break;

      case 1:
        if (validateForm(regexpPosition, input.value)) {
          td.innerHTML = input.value;
          input.remove();
        } else {
          td.innerHTML = initialValue;
        }
        break;

      case 2:
        if (validateForm(regexpOffice, input.value)) {
          td.innerHTML = input.value;
          input.remove();
        } else {
          td.innerHTML = initialValue;
        }
        break;

      case 3:
        if (validateForm(regexpAge, input.value)) {
          td.innerHTML = input.value;
          input.remove();
        } else {
          td.innerHTML = initialValue;
        }
        break;

      case 4:
        if (validateForm(regexpSalary, input.value)) {
          td.innerHTML = `$${Number(input.value).toLocaleString('en')}`;
          input.remove();
        } else {
          td.innerHTML = initialValue;
        }
        break;
      default:
        break;
    }
  };

  input.addEventListener('blur', savingChangesCell);

  input.addEventListener('keydown', keyboardEvent => {
    if (keyboardEvent.code === 'Enter') {
      keyboardEvent.target.blur();
    }
  });
};

tbody.addEventListener('dblclick', editingCell);

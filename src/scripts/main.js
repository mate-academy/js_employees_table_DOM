'use strict';

const table = document.querySelector('table');
const body = document.querySelector('tbody');
let isAscending = true;
let isMatched;
let oldData;

const errors = [
  'Enter valid name',
  'Enter valid position',
  'Office was not changed',
  'Enter valid age',
  'Enter valid salary',
];

const inputTypes = [
  'textInput',
  'textInput',
  'select',
  'age',
  'salary',
];

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

form.insertAdjacentHTML('afterbegin', `
<label>Name: <input data-qa="name" name="name" type="text"></label>
<label>Position: <input data-qa="position" name="position" type="text"></label>
<label>Office: <select data-qa="office" name="office">
  <option value = "Tokyo">Tokyo</option>
  <option value = "Singapore">Singapore</option>
  <option value = "London">London</option>
  <option value = "New York">New York</option>
  <option value = "Edinburgh">Edinburgh</option>
  <option value = "San Francisco">San Francisco</option>
</select></label>
<label>Age: <input data-qa="age" name="age" type="number"></label>
<label>Salary: <input data-qa="salary" name="salary" type="number"></label>
<button>Save to table</button>
`);

const inputs = document.querySelectorAll('input');

for (let i = 0; i < inputs.length; i++) {
  inputs[i].required = true;
}

const button = document.querySelector('button');

button.addEventListener('click', e => {
  e.preventDefault();

  const employeeName = document.querySelector('input[name="name"]');
  const position = document.querySelector('input[name="position"]');
  const office = document.querySelector('select[name="office"]');
  const age = document.querySelector('input[name="age"]');
  const salary = document.querySelector('input[name="salary"]');
  const finalRow = document.createElement('tr');

  finalRow.insertAdjacentHTML('afterbegin', `
    <td>${employeeName.value}</td>
    <td>${position.value}</td>
    <td>${office.value}</td>
    <td>${age.value}</td>
    <td>$${salary.value}</td>
  `);

  if (employeeName.value.length < 4) {
    showMessage('error', 'Enter valid name');
  } else if (age.value < 18 || age.value > 90) {
    showMessage('error', 'Enter valid age');
  } else if (!salary.value || salary.value < 0) {
    showMessage('error', 'Enter valid salary');
  } else if (!position.value) {
    showMessage('error', 'Enter valid position');
  } else {
    showMessage('success', 'A new employee was added!');
    body.append(finalRow);
  }

  convertSalary();
});

table.addEventListener('click', e => {
  const item = e.target;

  if (item.tagName === 'TH') {
    const index = e.target.cellIndex;

    toSortColumns(index);
  }

  if (item.tagName === 'TD') {
    toHighlight(item);
  }
});

body.addEventListener('dblclick', e => {
  const item = e.target;
  const index = item.cellIndex;
  const style = getComputedStyle(item);
  const width = style.width;

  if (item.tagName === 'TD') {
    if (index === 2) {
      const selectInput = document.createElement('select');

      oldData = item.innerHTML;
      item.innerHTML = '';

      selectInput.innerHTML = `
        <select data-qa="office" name="office">
          <option value = "Tokyo">Tokyo</option>
          <option value = "Singapore">Singapore</option>
          <option value = "London">London</option>
          <option value = "New York">New York</option>
          <option value = "Edinburgh">Edinburgh</option>
          <option value = "San Francisco">San Francisco</option>
        </select>
      `;
      selectInput.classList.add('cell-input');
      selectInput.value = oldData;
      item.append(selectInput);
      selectInput.focus();
    } else {
      const editInput = document.createElement('input');

      editInput.style.maxWidth = width;
      oldData = item.innerHTML;
      editInput.classList.add('cell-input');
      item.innerHTML = '';
      editInput.value = oldData;
      item.append(editInput);

      editInput.focus();
    }
  }
});

body.addEventListener('focusout', e => {
  const item = e.target;
  const index = item.parentElement.cellIndex;

  if (item.classList.contains('cell-input')) {
    changeData(inputTypes[index], item, errors[index]);
  }
});

document.body.addEventListener('keydown', e => {
  const item = e.target;

  if (!item.classList.contains('cell-input')) {
    return;
  }

  if (e.code === 'Enter') {
    e.target.blur();
  }
});

function showMessage(type, text) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  notification.style.width = '200px';

  notification.insertAdjacentHTML('afterbegin', `
    <h3 class="title"></h3>
    <p></p>
  `);
  document.body.append(notification);

  switch (type) {
    case 'error':
      notification.firstElementChild.innerHTML = 'Warning!';

      notification.lastElementChild.innerHTML
        = text;
      notification.classList.add('error');
      break;

    case 'success':
      notification.firstElementChild.innerHTML = 'Congrats!';
      notification.lastElementChild.innerHTML = text;
      notification.classList.add('success');
      notification.style.top = '140px';
      break;
  };

  setTimeout(() => notification.remove(), 2000);
};

function toSortColumns(index) {
  if (isMatched === index) {
    isAscending = !isAscending;
  } else {
    isMatched = index;
    isAscending = true;
  }

  for (let i = 0; i < table.children[1].rows.length; i++) {
    const arrRows = [...table.children[1].rows];
    const sorted = arrRows.sort((a, b) => {
      const valueA = a.cells[index].innerHTML.replace(/\$|,/g, '');
      const valueB = b.cells[index].innerHTML.replace(/\$|,/g, '');

      if (isAscending) {
        return isNaN(valueA) ? valueA.localeCompare(valueB) : valueA - valueB;
      } else {
        return isNaN(valueA) ? valueB.localeCompare(valueA) : valueB - valueA;
      };
    });

    body.append(...sorted);
  }
};

function toHighlight(item) {
  for (let i = 0; i < table.children[1].rows.length; i++) {
    table.children[1].rows[i].classList.remove('active');
  }
  item.parentElement.classList.add('active');
}

function convertSalary() {
  for (let i = 0; i < table.children[1].rows.length; i++) {
    const target = table.children[1].rows;
    const string
      = target[i].children[4].innerHTML.split('$').join('').split(',').join('');
    const num = +string;

    target[i].children[4].innerHTML
      = `$${num.toLocaleString('en-US')}`;
  }
}

function changeData(type, target, error) {
  switch (type) {
    case 'textInput':
      if (target.value.trim().length === 0) {
        showMessage('error', error);
        target.value = oldData;
        target.focus();
      } else {
        target.parentElement.innerHTML = target.value;
      };
      break;

    case 'select':

      target.parentElement.innerHTML = target.value;
      break;

    case 'age':
      if (target.value < 18 || target.value > 90 || isNaN(target.value)) {
        showMessage('error', error);
        target.value = oldData;
        target.focus();
      } else {
        target.parentElement.innerHTML = target.value;
      };
      break;

    case 'salary':
      const salary = target.value.split('$').join('').split(',').join('');

      if (!salary.trim() || salary < 0 || isNaN(salary)) {
        showMessage('error', error);
        target.value = oldData;
        target.focus();
      } else {
        const num = +salary;

        target.parentElement.innerHTML = `$${num.toLocaleString('en-US')}`;
      };
      break;
  }
}

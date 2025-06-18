'use strict';

function convertToNumber(currencyString) {
  return Number(currencyString.replace('$', '').replace(/,/g, ''));
}

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const rows = Array.from(tbody.rows);
const fisrtClick = [];
let sortedRows;

table.addEventListener('click', function (e) {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const i = Array.from(e.target.parentElement.cells).indexOf(e.target);

  if (fisrtClick.length === 0) {
    fisrtClick.push(i);
  } else {
    sortedRows = rows.reverse();

    tbody.innerHTML = '';
    tbody.append(...sortedRows);
    fisrtClick.length = 0;

    return;
  }

  sortedRows = rows.sort((a, b) => {
    if (
      !isNaN(convertToNumber(a.cells[i].textContent)) &&
      !isNaN(convertToNumber(b.cells[i].textContent))
    ) {
      return (
        convertToNumber(a.cells[i].textContent) -
        convertToNumber(b.cells[i].textContent)
      );
    }

    return a.cells[i].textContent.localeCompare(b.cells[i].textContent);
  });

  tbody.innerHTML = '';
  tbody.append(...sortedRows);
});

tbody.addEventListener('click', function (e) {
  const target = e.target.closest('tr');

  if (!target) {
    return;
  }

  if (tbody.getElementsByClassName('active')[0]) {
    tbody.getElementsByClassName('active')[0].classList.remove('active');
  }

  target.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';
document.body.append(form);

form.insertAdjacentHTML(
  'afterbegin',
  `
  <label>Name:
    <input name="name" type="text" data-qa="name" required minlength= "4">
    </input>
  </label>

  <label>Position: <input name="position" type="text" data-qa="position" required></input></label>

  <label>Office: <select name="office" data-qa="office" required>
    <option value="Tokyo" selected> Tokyo </option>
    <option value="Singapore"> Singapore </option>
    <option value="London"> London </option>
    <option value="New York"> New York </option>
    <option value="Edinburgh"> Edinburgh </option>
    <option value="San Francisco"> San Francisco </option>
   </select>
  </label>

  <label>Age:
    <input name="age" type="number" data-qa="age" required min="18" max="90">
    </input>
  </label>

  <label>Salary: <input name="salary" type="number" data-qa="salary" required></input></label>
  <button type="submit"> Save to table </button>`,
);

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const tr = document.createElement('tr');

  tbody.prepend(tr);

  function addElement(x) {
    const td = document.createElement('td');

    tr.append(td);
    td.append(x);
  }

  addElement(form.elements.name.value);
  addElement(form.elements.position.value);
  addElement(form.elements.office.value);
  addElement(form.elements.age.value);
  addElement(form.elements.salary.value);
});

const notification = document.createElement('div');

document.body.append(notification);
notification.setAttribute('data-qa', 'notification');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const inputName = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = parseInt(form.elements.age.value);
  const salary = parseFloat(form.elements.salary.value.replace(/[^\d.]/g, ''));

  if (inputName.length < 4) {
    showNotification('Error', 'Name must have at least 4 characters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${inputName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  `;

  table.append(row);

  showNotification('Success', 'Employee added to table', 'success');

  form.reset();
});

function showNotification(title, message, type) {
  notification.innerHTML = `<strong>${title}:</strong> ${message}`;
  notification.className = type;
}

let isEditing = false;

tbody.addEventListener('dblclick', function (e) {
  const target = e.target.closest('td');

  if (target.tagName !== 'TD' || isEditing === true) {
    return;
  }

  const initialValue = target.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  target.innerHTML = '';
  target.append(input);
  input.focus();

  isEditing = true;

  input.addEventListener('keydown', function (x) {
    if (x.key === 'Enter') {
      saveInputChanges(target);
    }
  });

  input.addEventListener('blur', function (y) {
    saveInputChanges(target);
  });

  target.dataset.original = initialValue;
});

function saveInputChanges(cell) {
  const input = cell.querySelector('input');

  if (!input) {
    return;
  }

  const value = input.value;
  const original = cell.dataset.original;

  cell.textContent = value === '' ? original : value;

  isEditing = false;
}

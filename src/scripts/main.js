'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const currentActiveRow = tbody.querySelector('.active');

  if (currentActiveRow) {
    currentActiveRow.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const thead = table.querySelector('thead');

let currentSortColumn = -1;
let isAscending = true;

thead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const th = e.target;
  const cellIndex = Array.from(th.parentNode.children).indexOf(th);

  if (currentSortColumn === cellIndex) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = cellIndex;
    isAscending = true;
  }

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    let cellA = rowA.children[cellIndex].textContent.trim();
    let cellB = rowB.children[cellIndex].textContent.trim();

    cellA = cellA.replace(/[$,]/g, '');
    cellB = cellB.replace(/[$,]/g, '');

    if (!isNaN(cellA) && !isNaN(cellB)) {
      if (isAscending) {
        return Number(cellA) - Number(cellB);
      } else {
        return Number(cellB) - Number(cellA);
      }
    }

    if (isAscending) {
      return cellA.localeCompare(cellB);
    } else {
      return cellB.localeCompare(cellA);
    }
  });

  tbody.append(...rows);
});

const formHTML = `
  <form class="new-employee-form">
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>Position: <input name="position" type="text" data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>

    <button type="submit">Save to table</button>
  </form>
`;

document.body.insertAdjacentHTML('beforeend', formHTML);

const form = document.querySelector('.new-employee-form');

function showNotification(type, title, message) {
  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notificationHTML = `
    <div class="notification ${type}" data-qa="notification">
      <span class="title">${title}</span>
      <span>${message}</span>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', notificationHTML);

  setTimeout(() => {
    const currentNotif = document.querySelector('.notification');

    if (currentNotif) {
      currentNotif.remove();
    }
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employeeName = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  const salary = formData.get('salary').trim();

  if (!employeeName || !position || !office || !age || !salary) {
    showNotification('error', 'Error!', 'All fields are required.');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('error', 'Error!', 'Name must have at least 4 letters.');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Invalid Age!', 'Age must be between 18 and 90.');

    return;
  }

  const formattedSalary = '$' + Number(salary).toLocaleString('en-US');

  const newRowHTML = `
    <tr>
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formattedSalary}</td>
    </tr>
  `;

  tbody.insertAdjacentHTML('beforeend', newRowHTML);

  showNotification('success', 'Success!', 'Employee added successfully.');
  form.reset();
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (cell.querySelector('.cell-input')) {
    return;
  }

  const existingInput = tbody.querySelector('.cell-input');

  if (existingInput) {
    existingInput.blur();
  }

  const initialText = cell.textContent.trim();

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialText;

  cell.appendChild(input);

  input.focus();

  const saveChanges = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue === '' ? initialText : newValue;
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

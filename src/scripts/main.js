'use strict';

const body = document.querySelector('body');

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

body.insertAdjacentHTML('beforeend', formHTML);

const form = document.querySelector('.new-employee-form');
const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const allRows = tbody.querySelectorAll('tr');

  allRows.forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});

function showNotification(title, message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);

  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <span class="title">${title}</span>
    <span>${message}</span>
  `;

  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements['name'].value.trim();
  const position = form.elements['position'].value.trim();
  const office = form.elements['office'].value;

  const age = Number(form.elements['age'].value);
  const salary = Number(form.elements['salary'].value);

  if (employeeName.length < 4) {
    showNotification('Error', 'Name must be at least 4 characters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  if (position.length === 0) {
    showNotification('Error', 'Position is required', 'error');

    return;
  }

  if (!office) {
    showNotification('Error', 'Office is required', 'error');

    return;
  }

  if (salary <= 0 || isNaN(salary)) {
    showNotification('Error', 'Salary must be a positive number', 'error');

    return;
  }

  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.append(newRow);

  showNotification('Success', 'Employee successfully added!', 'success');
  form.reset();
});

const thead = document.querySelector('thead');
let currentSortColumn = -1;
let isAsc = true;

function getCellValue(row, columnIndex) {
  const cellText = row.cells[columnIndex].textContent.trim();

  if (cellText.includes('$')) {
    const cleanNumber = cellText.replace('$', '').replaceAll(',', '');

    return Number(cleanNumber);
  }

  if (cellText !== '' && !isNaN(Number(cellText))) {
    return Number(cellText);
  }

  return cellText;
}

thead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const th = e.target;
  const columnIndex = Array.from(th.parentNode.children).indexOf(th);

  if (currentSortColumn === columnIndex) {
    isAsc = !isAsc;
  } else {
    isAsc = true;
    currentSortColumn = columnIndex;
  }

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const valueA = getCellValue(rowA, columnIndex);
    const valueB = getCellValue(rowB, columnIndex);

    if (valueA < valueB) {
      return isAsc ? -1 : 1;
    }

    if (valueA > valueB) {
      return isAsc ? 1 : -1;
    }

    return 0;
  });

  tbody.innerHTML = '';

  tbody.append(...rows);
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || td.querySelector('.cell-input')) {
    return;
  }

  const originalText = td.textContent.trim();

  td.innerHTML = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalText;

  td.append(input);
  input.focus();

  function finishEditing() {
    const newValue = input.value.trim();

    if (newValue === '') {
      td.textContent = originalText;
    } else {
      td.textContent = newValue;
    }
  }

  input.addEventListener('blur', () => {
    finishEditing();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      finishEditing();
    }
  });
});

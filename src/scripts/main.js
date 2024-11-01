'use strict';

const tableHeaderRow = document.querySelector('thead tr');
const tbody = document.querySelector('tbody');
const rows = Array.from(tbody.querySelectorAll('tr'));

let isAscending = true;
let lastSortedColumn = null;

function sortElements(columnIndex) {
  rows.sort((a, b) => {
    let aValue = a.cells[columnIndex].textContent;
    let bValue = b.cells[columnIndex].textContent;

    if (columnIndex >= 3) {
      aValue = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
      bValue = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
    }

    if (aValue < bValue) {
      return isAscending ? -1 : 1;
    } else if (aValue > bValue) {
      return isAscending ? 1 : -1;
    } else {
      return 0;
    }
  });

  rows.forEach((row) => {
    tbody.appendChild(row);
  });
}

function selectedRow(tableRow) {
  rows.forEach((row) => row.classList.remove('active'));
  tableRow.classList.add('active');
}

tableHeaderRow.addEventListener('click', (e) => {
  const columnIndex = Array.from(tableHeaderRow.children).indexOf(e.target);

  if (lastSortedColumn === columnIndex) {
    isAscending = !isAscending;
  } else {
    isAscending = true;
  }

  lastSortedColumn = columnIndex;
  sortElements(columnIndex);
});

tbody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('tr');

  if (targetRow && targetRow.parentNode.tagName === 'TBODY') {
    selectedRow(targetRow);
  }
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Employee Name: <input name="employeeName" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label> Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

function pushNotification(posTop, posRight, title, description, type) {
  const message = document.createElement('div');

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  message.classList.add('notification', type);

  const titleElement = document.createElement('h2');

  titleElement.classList.add('title');
  titleElement.textContent = title;
  message.appendChild(titleElement);

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;
  message.appendChild(descriptionElement);

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.employeeName.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = form.elements.age.value;
  const salary = form.elements.salary.value;

  const existingMessage = document.querySelector('.notifications');

  if (existingMessage) {
    document.body.removeChild(existingMessage);
  }

  if (
    employeeName.length <= 2 ||
    /\d/.test(employeeName) ||
    !position ||
    /\d/.test(position) ||
    !office ||
    age < 18 ||
    salary <= 0
  ) {
    pushNotification(
      100,
      50,
      'Error!',
      'Please enter valid data for all fields',
      'error',
    );
  } else {
    pushNotification(
      100,
      50,
      'Success!',
      'Employee added successfully',
      'success',
    );

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salary}</td>
    `;
    tbody.appendChild(newRow);
  }
});

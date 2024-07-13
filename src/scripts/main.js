'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortTableByColumn(index);
  });
});

function sortTableByColumn(columnIndex) {
  const rowsArray = Array.from(tbody.querySelectorAll('tr'));
  const sortedRows = rowsArray.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].innerText;
    const cellB = rowB.cells[columnIndex].innerText;

    if (headers[columnIndex].innerText === 'Age') {
      return parseInt(cellA) - parseInt(cellB);
    }

    if (headers[columnIndex].innerText === 'Salary') {
      return (
        parseFloat(cellA.replace(/[$,]/g, '')) -
        parseFloat(cellB.replace(/[$,]/g, ''))
      );
    }

    return cellA.localeCompare(cellB);
  });

  sortedRows.forEach((row) => tbody.appendChild(row));
}

tbody.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const row = e.target.parentNode;

    tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
    row.classList.add('active');
  }
});

const pushNotification = (title, description, type) => {
  const posTop = 100;
  const posRight = 5;
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;
  notification.appendChild(h2);
  notification.appendChild(p);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <h3>Add New Employee</h3>
  <label for="employeeName">Name:</label>
  <input type="text" id="employeeName" name="employeeName"><br>
  <label for="position">Position:</label>
  <input type="text" id="position" name="position"><br>
  <label for="office">Office:</label>
  <input type="text" id="office" name="office"><br>
  <label for="age">Age:</label>
  <input type="number" id="age" name="age"><br>
  <label for="salary">Salary:</label>
  <input type="text" id="salary" name="salary"><br>
  <button type="submit">Add Employee</button>
`;

document.body.appendChild(form);

function salaryFormat(number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.employeeName.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = form.age.value;
  const salary = salaryFormat(parseFloat(form.salary.value));

  if (employeeName && position && office && age && salary) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salary}</td>
  `;
    tbody.appendChild(newRow);
    form.reset();

    pushNotification('Success', 'Employee was successfully added', 'success');
  } else {
    pushNotification('Error', 'All fields must be filled!', 'error');
  }
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const cell = e.target;
    const originalContent = cell.innerText;
    const input = document.createElement('input');

    input.type = 'text';
    input.value = originalContent;
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      saveCellContent(cell, input, originalContent);
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveCellContent(cell, input, originalContent);
      }
    });
  }
});

function saveCellContent(cell, input, originalContent) {
  const newContent = input.value.trim();

  if (newContent) {
    if (cell.innerText === 'Salary') {
      const salary = parseFloat(newContent.replace(/[$,]/g, ''));

      if (!isNaN(salary)) {
        cell.innerText = salaryFormat(salary);
      } else {
        cell.innerText = originalContent;
        pushNotification('Error', 'Invalid salary format!', 'error');
      }
    } else {
      cell.innerText = newContent;
    }
  } else {
    cell.innerText = originalContent;
  }
}

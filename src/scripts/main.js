'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');

headers.forEach((header, index) => {
  let sortDirection = 1;

  header.addEventListener('click', () => {
    const rows = Array.from(tbody.rows);

    rows.sort((rowA, rowB) => {
      let cellA = rowA.cells[index].textContent.trim();
      let cellB = rowB.cells[index].textContent.trim();

      if (index === 4 || index === 3) {
        cellA = parseFloat(cellA.replace(/[^0-9.-]+/g, '')) || 0;
        cellB = parseFloat(cellB.replace(/[^0-9.-]+/g, '')) || 0;

        return (cellA - cellB) * sortDirection;
      }

      return cellA > cellB ? sortDirection : -1 * sortDirection;
    });

    sortDirection *= -1;
    tbody.append(...rows);
  });
});

table.querySelector('tbody').addEventListener('click', (e) => {
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach((row) => row.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const employeeName = data.get('name');
  const position = data.get('position');
  const office = data.get('office');
  const age = Number(data.get('age'));
  const salary = Number(data.get('salary'));

  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');
  document.body.append(notification);

  if (employeeName.length < 4) {
    notification.classList.add('error');
    notification.innerText = 'Error: Name must be longer than 4 characters';

    setTimeout(() => {
      notification.remove();
    }, 3000);

    return;
  }

  if (age < 18 || age > 90) {
    notification.classList.add('error');
    notification.innerText = 'Error: Age should be between 18 and 90 years';

    setTimeout(() => {
      notification.remove();
    }, 3000);

    return;
  }

  notification.classList.add('success');
  notification.innerText = 'Employee successfully added!';

  setTimeout(() => {
    notification.remove();
  }, 3000);

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(newRow);
  form.reset();
});

table.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  const initialValue = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;
  cell.innerText = '';
  cell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    const newValue = input.value.trim();

    cell.innerText = newValue || initialValue;
  });

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

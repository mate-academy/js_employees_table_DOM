'use strict';

// write code here
'use strict';

// write code here
'use strict';

// write code here
'use strict';

// table sort
const body = document.querySelector('body');
const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tableBody = table.querySelector('tbody');

let rows = Array.from(tableBody.querySelectorAll('tr'));

let currentHeader = null;
let direction = 'asc';

let currentRow = null;
const activeRow = 'active';

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentHeader === header) {
      direction = direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentHeader = header;
      direction = 'asc';
    }

    const sortedRows = rows.sort((a, b) => {
      const cellA = a.querySelectorAll('td')[index].textContent.trim();
      const cellB = b.querySelectorAll('td')[index].textContent.trim();

      let result;

      if (header.textContent === 'Age') {
        result = parseInt(cellA) - parseInt(cellB);
      } else if (header.textContent === 'Salary') {
        result = parseFloat(cellA.slice(1)) - parseFloat(cellB.slice(1));
      } else {
        result = cellA.localeCompare(cellB);
      }

      return direction === 'asc' ? result : -result;
    });

    sortedRows.forEach((row) => {
      tableBody.appendChild(row);
    });
  });
});

function activateRow(row) {
  row.addEventListener('click', () => {
    row.classList.toggle(activeRow);

    if (currentRow !== row) {
      currentRow?.classList.remove(activeRow);
    }

    currentRow = row;
  });
}

function updateRows() {
  rows = Array.from(tableBody.querySelectorAll('tr'));
}

// activate existing rows
rows.forEach(activateRow);

// create form
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('novalidate', 'novalidate');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <button type="submit" data-qa="add-employee">
    Save to table
  </button>
`;

body.appendChild(form);

// form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newRow = document.createElement('tr');
  const userName = formData.get('name');
  const age = formData.get('age');
  const salary = formData.get('salary');
  const position = formData.get('position');
  const office = formData.get('office');

  const salaryFormatted = Number(salary).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${userName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salaryFormatted}</td>
  `;

  // form validation
  if (userName.length < 4) {
    notify('Name must be at least 4 characters long.', 'Error', 'error');

    return;
  }

  if (!position.trim()) {
    notify('Position is required.', 'Error', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    notify('Age must be between 18 and 90.', 'Error', 'error');

    return;
  }

  tableBody.appendChild(newRow);
  notify('New employee added successfully!', 'Success', 'success');

  updateRows();
  activateRow(newRow);
});

// notification
function notify(message, title, type) {
  const notification = document.createElement('div');

  const notifyTitle = document.createElement('h2');

  notifyTitle.textContent = title;
  notifyTitle.classList.add('title');

  const notifyMessage = document.createElement('p');

  notifyMessage.textContent = message;

  notification.appendChild(notifyTitle);
  notification.appendChild(notifyMessage);

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', type);

  body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

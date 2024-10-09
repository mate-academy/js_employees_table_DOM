'use strict';

const table = document.querySelector('table');
let sortDirection = true;
let activeRow = null;

// 1. Implement table sorting by clicking on the title (in two directions).
function sortTable(columnIndex) {
  const rows = [...table.querySelectorAll('tbody tr')];

  rows.sort((rowA, rowB) => {
    let cellA = rowA.children[columnIndex].innerText;
    let cellB = rowB.children[columnIndex].innerText;

    if (columnIndex === 3) {
      cellA = parseInt(cellA);
      cellB = parseInt(cellB);
    }

    if (columnIndex === 4) {
      cellA = parseFloat(cellA.slice(1).split(',').join(''));
      cellB = parseFloat(cellB.slice(1).split(',').join(''));
    }

    if (sortDirection) {
      return cellA > cellB ? 1 : -1;
    }

    return cellA > cellB ? -1 : 1;
  });

  rows.forEach((row) => table.querySelector('tbody').appendChild(row));
  sortDirection = !sortDirection;
}

table.querySelectorAll('th').forEach((header, index) => {
  header.addEventListener('click', () => sortTable(index));
});

// 2. When user clicks on a row, it should become selected.
table.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    activeRow?.classList.remove('active');
    row.classList.add('active');
    activeRow = row;
  });
});

// 3. Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
const formHtml = `
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
  <button type="button" id="save-button">Save to table</button>
</form>
`;

document.body.insertAdjacentHTML('beforeend', formHtml);

const form = document.querySelector('.new-employee-form');

// 4. Show notification if form data is invalid
// (use notification from the previous tasks).
const notification = document.createElement('div');

notification.className = 'notification';
notification.setAttribute('data-qa', 'notification');
document.body.appendChild(notification);

const showNotification = (message, type) => {
  notification.innerHTML = `<span class="title">${type.toUpperCase()}</span> ${message}`;
  notification.className = `notification ${type}`;

  setTimeout(() => (notification.className = 'notification'), 2000);
};

document.getElementById('save-button').addEventListener('click', () => {
  const formData = [...form.elements].reduce(
    (acc, input) => ({ ...acc, [input.name]: input.value }),
    {},
  );
  let isValid = true;

  if (formData.name.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');
    isValid = false;
  }

  if (formData.age < 18 || formData.age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');
    isValid = false;
  }

  if (!formData.position || !formData.office || !formData.salary) {
    showNotification('All fields are required.', 'error');
    isValid = false;
  }

  if (isValid) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `<td>${formData.name}</td><td>${formData.position}</td><td>${formData.office}</td><td>${formData.age}</td><td>$${parseInt(formData.salary).toLocaleString('en-US')}</td>`;
    table.querySelector('tbody').appendChild(newRow);
    showNotification('Employee added successfully!', 'success');
    form.reset();
  }
});

// 5. Implement editing of table cells by double-clicking on it. (optional)
table.querySelectorAll('tbody td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialValue = cell.innerText;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    cell.innerText = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener(
      'blur',
      () => (cell.innerText = input.value || initialValue),
    );

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        cell.innerText = input.value || initialValue;
      }
    });
  });
});

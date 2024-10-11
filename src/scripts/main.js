'use strict';

const table = document.querySelector('table');
let sortDirection = true;

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
let activeRow = null;

table.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    if (activeRow) {
      activeRow.classList.remove('active');
    }

    row.classList.add('active');
    activeRow = row;
  });
});

// 3. Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
const formHtml = `
  <form class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
      />
    </label>
    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
      />
    </label>
    <label>
      Office:
      <select
        name="office"
        data-qa="office"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
      />
    </label>
    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      />
    </label>
    <button
      type="button"
      id="save-button"
    >
      Save to table
    </button>
  </form>
  `;

table.insertAdjacentHTML('afterend', formHtml);

// 4. Show notification if form data is invalid
function pushNotification(message, type) {
  const notification = document.createElement('div');
  const titleSpan = document.createElement('span');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  titleSpan.className = 'title';
  titleSpan.textContent = type.toUpperCase();

  notification.appendChild(titleSpan);
  notification.innerHTML += ` <span>${message}</span>`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

function validateFormData(formData) {
  if (formData.name.length < 4) {
    pushNotification('Name must be at least 4 characters long.', 'error');

    return false;
  }

  if (formData.age < 18 || formData.age > 90) {
    pushNotification('Age must be between 18 and 90.', 'error');

    return false;
  }

  if (!formData.position || !formData.office || !formData.salary) {
    pushNotification('All fields are required.', 'error');

    return false;
  }

  return true;
}

const form = document.querySelector('.new-employee-form');

document.getElementById('save-button').addEventListener('click', () => {
  const formData = [...form.elements].reduce((acc, formInput) => {
    if (formInput.name) {
      acc[formInput.name] = formInput.value;
    }

    return acc;
  }, {});

  if (validateFormData(formData)) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${formData.name}</td>
      <td>${formData.position}</td>
      <td>${formData.office}</td>
      <td>${formData.age}</td>
      <td>$${parseInt(formData.salary).toLocaleString('en-US')}</td>`;

    table.querySelector('tbody').appendChild(newRow);
    pushNotification('Employee added successfully!', 'success');
    form.reset();
  }
});

// 5. Implement editing of table cells by double-clicking on it. (optional)
const input = document.createElement('input');

input.className = 'cell-input';

input.addEventListener('blur', () => {
  const cell = input.parentElement;

  cell.innerText = input.value || input.getAttribute('data-initial');
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const cell = input.parentElement;

    cell.innerText = input.value || input.getAttribute('data-initial');
  }
});

document.querySelectorAll('tbody td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialValue = cell.innerText;

    input.setAttribute('data-initial', initialValue);
    input.value = initialValue;

    cell.innerText = '';
    cell.appendChild(input);
    input.focus();
  });
});

'use strict';

// Create a form
document.body.innerHTML += `
  <form>
    <label>Name:<input type='text' id='name' required data-qa='name'></label>
    <label>Position:<input type='text' id='position' required  data-qa='position'></label>
    <label>Office:
      <select id='office' required data-qa='office'>
        <option value='Tokyo'>Tokyo</option>
        <option value='Singapore'>Singapore</option>

        <option value='London'>London</option>
        <option value='New York'>New York</option>
        <option value='Edinburgh'>Edinburgh</option>
        <option value='San Francisco'>San Francisco</option>
      </select>
    </label>
    <label>Age:<input type='number' id='age' min='18' max='90' required data-qa='age'></label>
    <label>Salary:<input type='number' id='salary' required data-qa='salary'></label>


    <button type='submit' id='submit-btn'>Save to table</button>
  </form>
`;

const form = document.querySelector('form');

form.classList.add('new-employee-form');

// Get the table element from the document
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

// Function to sort data in columns in ascending order
function sortTableAsc(columnIndex) {
  const rows = Array.from(tbody.rows);

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    // Special condition for column 5 (Salary) and converting data to numbers
    if (columnIndex === 4) {
      const salaryA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      const salaryB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

      return salaryA - salaryB;
    }

    // Convert to numbers for other columns and handle non-numeric values
    const valueA = parseFloat(cellA);
    const valueB = parseFloat(cellB);

    // Check if both values are numeric and compare
    if (!Number.isNaN(valueA) && !Number.isNaN(valueB)) {
      return valueA - valueB;
    } else {
      return cellA.localeCompare(cellB);
    }
  });

  // Rebuild the table with sorted rows
  rows.forEach((row) => tbody.appendChild(row));
}

// Function to sort data in columns in adescending order
function sortTableDesc(columnIndex) {
  const rows = Array.from(tbody.rows);

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    // Special condition for column 5 (Salary) and converting data to numbers
    if (columnIndex === 4) {
      const salaryA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      const salaryB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

      return salaryB - salaryA; // Sort as numbers
    }

    // Convert to numbers for other columns and handle non-numeric values
    const valueA = parseFloat(cellA);
    const valueB = parseFloat(cellB);

    // Check if both values are numeric and compare
    if (!Number.isNaN(valueA) && !Number.isNaN(valueB)) {
      return valueB - valueA; // Sort as numbers
    } else {
      return cellB.localeCompare(cellA); // Compare strings alphabetically
    }
  });

  // Rebuild the table with sorted rows
  rows.forEach((row) => tbody.appendChild(row));
}

// Function to reset the style of table headers
function resetHeaderColors() {
  const headers = table.querySelectorAll('thead th');

  headers.forEach((header) => {
    header.style.color = '';
  });
}

// Create an array of headers, including their text content and index
const columnHeaders = [
  { columnName: 'Name', index: 0 },
  { columnName: 'Position', index: 1 },
  { columnName: 'Office', index: 2 },
  { columnName: 'Age', index: 3 },
  { columnName: 'Salary', index: 4 },
];

// Main functionality for click event: sorting and style change
const headerCells = Array.from(table.querySelectorAll('thead th'));

const sortState = {};

columnHeaders.forEach(({ columnName, index }) => {
  const headerCell = headerCells.find(
    (cell) => cell.textContent.trim() === columnName,
  );

  headerCell.addEventListener('click', () => {
    resetHeaderColors();
    headerCell.style.color = 'orange';

    if (!sortState[index] || sortState[index] === 'desc') {
      sortTableAsc(index);
      sortState[index] = 'asc';
    } else {
      sortTableDesc(index);
      sortState[index] = 'desc';
    }
  });
});

function selectRow(ev) {
  const tableRows = Array.from(table.querySelectorAll('tbody tr'));

  tableRows.forEach((r) => r.classList.remove('active'));
  ev.currentTarget.classList.add('active');
}

function attachRowListeners() {
  const tableRows = Array.from(table.querySelectorAll('tbody tr'));

  tableRows.forEach((row) => {
    row.addEventListener('click', selectRow);
  });
}

attachRowListeners();

// Function for creating a new row
function addRowToTable() {
  const empName = document.getElementById('name').value.trim();
  const position = document.getElementById('position').value.trim();
  const office = document.getElementById('office').value;
  const age = document.getElementById('age').value.trim();
  const salary = document.getElementById('salary').value.trim();

  // Format salary as currency ($)
  const formattedSalary = `$${parseFloat(salary).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

  // Check that all fields are filled
  if (!empName || !position || !office || !age || !salary) {
    showNotification('Please fill in all fields.', 'error');

    return;
  }

  // Check that name and position are written in Latin letters
  // and fieilds contain at least 4 characters
  const latinRegex = /^[A-Za-z\s]+$/;

  if (!empName || empName.length < 4 || !latinRegex.test(empName)) {
    showNotification(
      `Name must be at least 4 characters long
      and contain only Latin letters.`,
      'error',
    );

    return;
  }

  const formattedName = empName;

  if (!position || position.length < 4 || !latinRegex.test(position)) {
    showNotification('Please, fill in the correct position.', 'error');

    return;
  }

  const formattedPosition = position;

  // Check that age value is between 18 and 90
  if (!age || isNaN(age) || parseInt(age) < 18 || parseInt(age) > 90) {
    showNotification('Please, fill in the correct age.', 'error');

    return;
  }

  // Check that salary is filled in corrrect format
  if (
    !salary || // field is not empty
    isNaN(salary) || // value is Number
    parseFloat(salary) <= 0 || // value is greater than 0
    !/^[1-9]\d{4,}$/.test(salary) // value consists of digits
    // and has at least 5 digits, without leading zeros
  ) {
    showNotification('Please, fill in the correct salary.', 'error');

    return;
  }

  // Create a new row with data receiving from the user
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${formattedName}</td>
    <td>${formattedPosition}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  // Add event for row selection
  row.addEventListener('click', selectRow);

  // Add row to the table
  tbody.appendChild(row);

  showNotification(
    `Your data has been successfully added to the table.`,
    'success',
  );

  // Clear the form after adding a row
  document.querySelector('form').reset();
}

// Function for choosing between different types of notifications
function showNotification(
  message = `Your data has been successfully added to the table.`,
  type = `success`,
) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notificationBox = document.createElement('div');

  notificationBox.setAttribute('data-qa', 'notification');

  const messageTypes = {
    success: 'success',
    error: 'error',
  };

  notificationBox.classList.add('notification');
  notificationBox.textContent = message;

  if (messageTypes[type]) {
    notificationBox.classList.add(messageTypes[type]);
  }

  document.body.appendChild(notificationBox);

  setTimeout(() => {
    notificationBox.remove();
  }, 5000);
}
// Add functionality for creating a new row on the submit button

document.getElementById('submit-btn').addEventListener('click', (ev) => {
  ev.preventDefault();
  addRowToTable();
});

'use strict';

const tableData = {
  isSorted: {
    asc: false,
    desc: false,
    sortedByColumn: null,
  },
  tableBody: document.querySelector('tbody'),
  tableHead: document.querySelector('thead'),
  tableFooter: document.querySelector('tfoot'),
  rows: [],
  columns: ['name', 'position', 'office', 'age', 'salary'],
  tableTitles: ['Name', 'Position', 'Office', 'Age', 'Salary'],
};

function sortTable() {
  const rows = tableData.rows;
  const { asc, sortedByColumn } = tableData.isSorted;

  if (sortedByColumn === 4) {
    sortRowsBySalary(rows, asc);
  } else {
    sortRows(rows, asc, sortedByColumn);
  }

  tableData.isSorted.asc = !asc;
  tableData.isSorted.desc = asc;
}

function sortRows(rows, asc, column) {
  rows.sort((a, b) => {
    const textA = a.cells[column].textContent;
    const textB = b.cells[column].textContent;

    return !asc ? (textA > textB ? 1 : -1) : textA < textB ? 1 : -1;
  });
}

function sortRowsBySalary(rows, asc) {
  rows.sort((a, b) => {
    const salaryA = parseFloat(a.cells[4].textContent.replace(/[$,]/g, ''));
    const salaryB = parseFloat(b.cells[4].textContent.replace(/[$,]/g, ''));

    return !asc ? salaryA - salaryB : salaryB - salaryA;
  });
}

function rowTarget(row) {
  return row.classList.contains('active') ? null : row;
}

function formatCurrency(number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
    .format(number)
    .slice(0, -3);
}

function createFormNewEmployee() {
  const form = document.createElement('form');

  form.id = 'new-employee-form';
  form.classList.add('new-employee-form');

  form.setAttribute('novalidate', 'novalidate');

  const fields = [
    { label: 'Name', type: 'text', name: 'name' },
    { label: 'Position', type: 'text', name: 'position' },
    { label: 'Office', type: 'select', name: 'office' },
    { label: 'Age', type: 'number', name: 'age' },
    { label: 'Salary', type: 'text', name: 'salary' },
  ];

  fields.forEach((field) => {
    const label = document.createElement('label');

    label.textContent = field.label;

    if (field.type === 'select') {
      const select = document.createElement('select');

      select.setAttribute('data-qa', field.name);
      select.required = true;

      const offices = [
        'San Francisco',
        'New York',
        'London',
        'Paris',
        'Tokyo',
        'Sydney',
        'Singapore',
      ];

      offices.forEach((office) => {
        const option = document.createElement('option');

        option.value = office;
        option.textContent = office;
        select.appendChild(option);
      });

      select.name = field.name;
      form.appendChild(label);
      form.appendChild(select);
      form.appendChild(document.createElement('br'));

      return;
    }

    const input = document.createElement('input');

    input.type = field.type;
    input.required = true;
    input.name = field.name;
    input.setAttribute('data-qa', field.name);
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(document.createElement('br'));
  });

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  return form;
}

// eslint-disable-next-line no-shadow
function addEmployee(event) {
  // eslint-disable-next-line max-len
  event.preventDefault(); // Prevent the form from submitting the traditional way

  const form = document.getElementById('new-employee-form');
  const formData = new FormData(form);
  const newRow = document.createElement('tr');

  let hasError = false;

  tableData.columns.forEach((_column, index) => {
    const cell = document.createElement('td');
    let input = [...formData.entries()][index][1];

    if (index === 4) {
      input = formatCurrency(input);
    }

    if (!input) {
      hasError = true;
    }

    if (
      (index === 3 && (input < 18 || input > 90)) ||
      (index === 0 && input.length < 4) ||
      (index === 2 && input.length === 0)
    ) {
      hasError = true;
    }

    cell.textContent = input || ''; // Ensure empty string if no data
    newRow.appendChild(cell);
  });

  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach((field) => {
    if (!field.value) {
      hasError = true;
    }
  });

  if (hasError) {
    showNotification(
      'Error: Please fill in all required fields correctly.',
      'error',
    );

    return;
  }

  showNotification('Success: Employee added successfully!', 'success');

  newRow.addEventListener('click', () => {
    const target = rowTarget(newRow);

    if (target) {
      tableData.rows.forEach((row) => row.classList.remove('active'));
      target.classList.add('active');
    }
  });

  tableData.tableBody.appendChild(newRow);
  tableData.rows.push(newRow);

  form.reset(); // Clear the form after submission
}

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const form = createFormNewEmployee();

  table.parentNode.insertBefore(form, table.nextSibling);

  tableData.rows = Array.from(tableData.tableBody.rows);

  tableData.rows.forEach((row) => {
    row.addEventListener('click', () => {
      const target = rowTarget(row);

      if (target) {
        // eslint-disable-next-line no-shadow
        tableData.rows.forEach((row) => row.classList.remove('active'));
        target.classList.add('active');
      } else {
        row.classList.remove('active');
      }
    });
  });

  // Add event listener for form submission
  form.addEventListener('submit', addEmployee);
});

function main() {
  const { tableBody, tableHead } = tableData;

  const tableColumns = tableHead.rows[0].cells;

  tableData.columns = Array.from(tableColumns).map((column, index) => {
    column.addEventListener('click', () => {
      tableData.isSorted.sortedByColumn = index;
      sortTable();
      tableBody.innerHTML = '';
      tableData.rows.forEach((row) => tableBody.appendChild(row));
    });

    return column.textContent;
  });
}

main();

function enableCellEditing() {
  let currentInput = null;

  tableData.tableBody.addEventListener('dblclick', (event) => {
    const cell = event.target;

    if (cell.tagName !== 'TD' || cell.querySelector('input')) {
      return;
    }

    if (currentInput) {
      saveCell(currentInput);
    }

    const initialValue = cell.textContent;
    const input = document.createElement('input');

    input.type = 'text';
    input.value = initialValue;
    input.className = 'cell-input';
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => saveCell(input, initialValue));

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveCell(input, initialValue);
      }
    });

    currentInput = input;
  });

  function saveCell(input, initialValue) {
    const cell = input.parentElement;
    const newValue = input.value.trim();

    cell.textContent = newValue || initialValue;
    currentInput = null;
  }
}

enableCellEditing();

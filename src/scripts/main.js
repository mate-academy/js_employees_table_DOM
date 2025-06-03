'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const form = createEmployeeForm(document.body);

  setupFormHandler(form, table);

  table.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (th) {
      sortTable(th.cellIndex, th.dataset.type);

      return;
    }

    const tr = e.target.closest('tr');

    if (tr && tr.parentElement.tagName === 'TBODY') {
      const activeRows = document.querySelectorAll('tbody tr');

      activeRows.forEach((activeRow) => activeRow.classList.remove('active'));

      tr.classList.add('active');
    }
  });

  let lastSortedCol = null;
  let sortDirection = 'asc';

  function sortTable(colNum, type) {
    const tbody = table.querySelector('tbody');
    const rowsArray = Array.from(tbody.rows);
    let compare;

    if (lastSortedCol === colNum) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection = 'asc';
    }

    switch (type) {
      case 'number':
        compare = function (rowA, rowB) {
          const a = Number(rowA.cells[colNum].textContent);
          const b = Number(rowB.cells[colNum].textContent);

          return sortDirection === 'asc' ? a - b : b - a;
        };
        break;

      case 'string':
        compare = function (rowA, rowB) {
          const a = rowA.cells[colNum].textContent.trim();
          const b = rowB.cells[colNum].textContent.trim();

          return sortDirection === 'asc'
            ? a.localeCompare(b)
            : b.localeCompare(a);
        };
        break;

      case 'salary':
        compare = function (rowA, rowB) {
          const a = parseSalary(rowA.cells[colNum].textContent);
          const b = parseSalary(rowB.cells[colNum].textContent);

          return sortDirection === 'asc' ? a - b : b - a;
        };
        break;
    }

    function parseSalary(salaryStr) {
      return Number(salaryStr.replace(/[$,]/g, ''));
    }

    rowsArray.sort(compare);
    rowsArray.forEach((row) => tbody.appendChild(row));
    lastSortedCol = colNum;
  }

  // addEmployeeToTable();
});

function createEmployeeForm(container) {
  // const body = document.body;
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  // body.appendChild(form);

  const createLabelInput = (labelText, type = 'text', userName = '') => {
    const label = document.createElement('label');

    label.textContent = labelText;

    const input = document.createElement('input');

    input.type = type;
    input.name = userName;
    input.required = true;
    input.setAttribute('data-qa', name);

    label.appendChild(input);
    form.appendChild(label);

    return input;
  };

  createLabelInput('Name:', 'text', 'name');
  createLabelInput('Position', 'text', 'position');
  createLabelInput('Age', 'number', 'age');
  createLabelInput('Salary', 'number', 'salary');

  const labelOffice = document.createElement('label');

  labelOffice.textContent = 'Office';

  const select = document.createElement('select');

  select.name = 'office';
  select.required = true;
  select.setAttribute('data-qa', 'office');

  const options = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  options.forEach((optionText) => {
    const option = document.createElement('option');

    option.value = optionText;
    option.textContent = optionText;
    select.appendChild(option);
  });
  labelOffice.appendChild(select);
  form.appendChild(labelOffice);

  const submitBtn = document.createElement('button');

  submitBtn.type = 'submit';
  submitBtn.textContent = 'Save to table';
  form.appendChild(submitBtn);

  container.appendChild(form);

  return form;
}

function setupFormHandler(form, table) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const empName = formData.get('name')?.trim();
    const position = formData.get('position');
    const office = formData.get('office');
    const age = Number(formData.get('age'));
    const salary = Number(formData.get('salary'));

    if (empName.length < 4) {
      showNotification('Name must be at least 4 characters long', 'error');

      return;
    }

    if (isNaN(age) || age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    if (!position || !office || isNaN(salary)) {
      showNotification(
        'All fields are required and salary must be a number',
        'error',
      );

      return;
    }

    const tbody = table.querySelector('tbody');
    const row = tbody.insertRow();

    [
      empName,
      position,
      office,
      age,
      `$${Number(salary).toLocaleString('en-US')}`,
    ].forEach((text) => {
      const cell = row.insertCell();

      cell.textContent = text;
    });

    showNotification('Employee successfully added!', 'success');
    form.reset();
  });

  function showNotification(message, type) {
    const existing = document.querySelector('[data-qa="notification"]');

    if (existing) {
      existing.remove();
    }

    const note = document.createElement('div');

    note.setAttribute('data-qa', 'notification');
    note.className = type === 'error' ? 'error' : 'success';
    note.textContent = message;

    form.insertBefore(note, form.querySelector('button'));

    setTimeout(() => note.remove(), 3000);
  }
}

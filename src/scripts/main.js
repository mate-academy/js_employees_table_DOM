'use strict';

const table = document.querySelector('table');
const tableContent = document.querySelector('tbody');
let lastSortedIndex = null;
let isAscending = true;

table.addEventListener('click', function(e) {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  const cellIndex = header.cellIndex;

  if (cellIndex === lastSortedIndex) {
    isAscending = !isAscending;
  } else {
    isAscending = true;
    lastSortedIndex = cellIndex;
  }

  const sortedRows = sortRows(tableContent.children, cellIndex);

  tableContent.append(...sortedRows);
});

function sortRows([...rows], index) {
  const isSortingBySalary = index === 4;

  rows.sort((a, b) => {
    const dataA = a.cells[index].innerText;
    const dataB = b.cells[index].innerText;

    if (isSortingBySalary) {
      const normalize = (data) => data.slice(1).replace(',', '');

      if (isAscending) {
        return normalize(dataA) - normalize(dataB);
      } else {
        return normalize(dataB) - normalize(dataA);
      }
    }

    if (isAscending) {
      return dataA.localeCompare(dataB);
    } else {
      return dataB.localeCompare(dataA);
    }
  });

  return rows;
}

table.addEventListener('click', function(events) {
  const clickedCell = events.target;
  const rows = tableContent.querySelectorAll('tr');

  rows.forEach(row => {
    row.classList.remove('active');
  });

  if (clickedCell.tagName === 'TD') {
    clickedCell.parentNode.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const labels = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const inputIds = ['name', 'position', 'office', 'age', 'salary'];

  for (let i = 0; i < labels.length; i++) {
    const label = document.createElement('label');

    label.textContent = `${labels[i]}: `;

    const input = document.createElement('input');

    input.type = (i === 3 || i === 4) ? 'number' : 'text';

    input.name = inputIds[i];
    input.dataset.qa = inputIds[i];
    input.required = true;

    label.appendChild(input);

    if (labels[i] === 'Office') {
      const officeSelectLabel = document.createElement('label');

      officeSelectLabel.textContent = 'Office: ';

      const officeSelect = document.createElement('select');

      officeSelect.name = 'office';
      officeSelect.dataset.qa = 'office';
      officeSelect.required = true;

      // eslint-disable-next-line max-len
      const officeOptions = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

      for (const optionText of officeOptions) {
        const option = document.createElement('option');

        option.value = optionText;
        option.textContent = optionText;
        officeSelect.appendChild(option);
      }

      officeSelectLabel.appendChild(officeSelect);
      form.appendChild(officeSelectLabel);
    } else {
      form.appendChild(label);
    }
  }

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  document.body.appendChild(form);

  form.addEventListener('submit', function(events) {
    events.preventDefault();

    const formData = new FormData(form);
    const employeeData = {};

    formData.forEach((value, key) => {
      if (key === 'salary') {
        employeeData[key] = convertSalary(value);
      } else {
        employeeData[key] = value;
      }
    });

    addEmployeeToTable(employeeData);

    form.reset();
  });

  function convertSalary(salaryString) {
    const parsedSalary = parseFloat(salaryString.replace(/[^\d]/g, ''));

    if (!isNaN(parsedSalary)) {
      return '$' + parsedSalary.toLocaleString('en-US');
    } else {
      return salaryString;
    }
  }

  function addEmployeeToTable(employeeData) {
    // eslint-disable-next-line max-len
    const newRow = tableContent.insertRow(-1);

    const cellsOrder = ['name', 'position', 'office', 'age', 'salary'];

    for (const key of cellsOrder) {
      const cell = newRow.insertCell();

      cell.textContent = employeeData[key];
    }
  }
});

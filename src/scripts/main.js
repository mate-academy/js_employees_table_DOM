'use strict';

const sourceTable = document.querySelector('table');
const tableHeaders = sourceTable.querySelector('thead');
const tableRowsDOM = sourceTable.querySelector('tbody');
const tableRows = sourceTable.querySelector('tbody').children;

[...tableHeaders.rows[0].cells].forEach((header) => {
  header.setAttribute('data-qa', '');
});

tableHeaders.addEventListener('click', (e) => {
  if (e.target.closest('th') === null) {
    return;
  }

  const headerIndex = e.target.closest('th').cellIndex;
  const copyRows = [...tableRows];
  const headerDataQa =
    tableHeaders.rows[0].cells[headerIndex].getAttribute('data-qa');

  if (headerIndex === 3) {
    if (headerDataQa !== 'asc') {
      tableHeaders.rows[0].cells[headerIndex].setAttribute('data-qa', 'asc');

      copyRows.sort((firstRow, secondRow) => {
        return (
          Number(firstRow.cells[headerIndex].textContent) -
          Number(secondRow.cells[headerIndex].textContent)
        );
      });
    } else {
      tableHeaders.rows[0].cells[headerIndex].setAttribute('data-qa', 'desc');

      copyRows.sort((firstRow, secondRow) => {
        return (
          Number(secondRow.cells[headerIndex].textContent) -
          Number(firstRow.cells[headerIndex].textContent)
        );
      });
    }
  } else if (headerIndex === 4) {
    if (headerDataQa !== 'asc') {
      tableHeaders.rows[0].cells[headerIndex].setAttribute('data-qa', 'asc');

      copyRows.sort((firstRow, secondRow) => {
        const firstSalary = Number(
          firstRow.cells[headerIndex].textContent.replace(/[$,]/g, ''),
        );

        const secondSalary = Number(
          secondRow.cells[headerIndex].textContent.replace(/[$,]/g, ''),
        );

        return firstSalary - secondSalary;
      });
    } else {
      tableHeaders.rows[0].cells[headerIndex].setAttribute('data-qa', 'desc');

      copyRows.sort((firstRow, secondRow) => {
        const firstSalary = Number(
          firstRow.cells[headerIndex].textContent.replace(/[$,]/g, ''),
        );

        const secondSalary = Number(
          secondRow.cells[headerIndex].textContent.replace(/[$,]/g, ''),
        );

        return secondSalary - firstSalary;
      });
    }
  } else {
    if (headerDataQa !== 'asc') {
      tableHeaders.rows[0].cells[headerIndex].setAttribute('data-qa', 'asc');

      copyRows.sort((firstRow, secondRow) => {
        const firsеText = firstRow.cells[headerIndex].textContent;
        const secondText = secondRow.cells[headerIndex].textContent;

        return firsеText.localeCompare(secondText);
      });
    } else {
      tableHeaders.rows[0].cells[headerIndex].setAttribute('data-qa', 'desc');

      copyRows.sort((firstRow, secondRow) => {
        const firstText = firstRow.cells[headerIndex].textContent;
        const secondText = secondRow.cells[headerIndex].textContent;

        return secondText.localeCompare(firstText);
      });
    }
  }

  copyRows.forEach((row) => tableRowsDOM.appendChild(row));
});

tableRowsDOM.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row || row.parentElement !== tableRowsDOM) {
    return;
  }

  const wasActive = row.classList.contains('active');

  [...tableRowsDOM.rows].forEach((otherRow) => {
    otherRow.classList.remove('active');
  });

  if (!wasActive) {
    row.classList.add('active');
  }
});

const form = document.createElement('form');
const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

form.classList.add('new-employee-form');

function createForm(formToAdd) {
  const labels = ['Name: ', 'Position: ', 'Age: ', 'Salary: '];
  const inputs = ['name', 'position', 'age', 'salary'];

  for (let i = 0; i < labels.length; i++) {
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.textContent = labels[i];
    input.name = inputs[i];
    input.type = ['age', 'salary'].includes(inputs[i]) ? 'number' : 'text';
    input.required = true;
    input.setAttribute('data-qa', inputs[i]);

    label.appendChild(input);
    formToAdd.appendChild(label);
  }

  const select = document.createElement('select');
  const labelSelect = document.createElement('label');
  const submitButton = document.createElement('button');

  select.name = 'office';
  select.required = true;
  select.setAttribute('data-qa', 'office');
  labelSelect.textContent = 'Office: ';

  for (const option of officeOptions) {
    const addOption = document.createElement('option');

    addOption.textContent = option;

    select.appendChild(addOption);
  }

  labelSelect.appendChild(select);
  submitButton.textContent = 'Save to table';
  submitButton.type = 'submit';
  formToAdd.insertBefore(labelSelect, formToAdd.children[2]);
  formToAdd.appendChild(submitButton);

  return form;
}

document.body.appendChild(createForm(form));
form.noValidate = true;

function showNotification(type, message) {
  document.querySelector('[data-qa="notification"]')?.remove();

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  notification.textContent = message;

  document.body.append(notification);
}

function formatSalary(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const personName = form.elements['name'].value.trim();
  const position = form.elements['position'].value.trim();
  const office = form.elements['office'].value;
  const ageValue = form.elements['age'].value;
  const salaryValue = form.elements['salary'].value;

  if (
    [personName, position, office, ageValue, salaryValue].some(
      (value) => value.trim().length === 0,
    )
  ) {
    showNotification('error', 'All fields must be filled!');
  } else if (personName.length < 4) {
    showNotification('error', 'The name must be at least 4 characters long!');
  } else if (Number(ageValue) < 18 || Number(ageValue) > 90) {
    showNotification(
      'error',
      'The age of the person must be between 18 and 90 years',
    );
  } else {
    const salary = formatSalary(salaryValue);
    const newRow = document.createElement('tr');

    [personName, position, office, ageValue, salary].forEach((item) => {
      const newCell = document.createElement('td');

      newCell.textContent = item;

      newRow.appendChild(newCell);
    });

    tableRowsDOM.appendChild(newRow);

    showNotification('success', 'New employee successfully added!');
  }
});

tableRowsDOM.addEventListener('dblclick', (e) => {
  const editCell = e.target.closest('td');

  if (!editCell || editCell.closest('tr')?.parentElement !== tableRowsDOM) {
    return;
  }

  const activeInput = tableRowsDOM.querySelector('.cell-input');

  if (activeInput) {
    if (editCell.contains(activeInput)) {
      return;
    }

    activeInput.blur();
  }

  const initialText = editCell.textContent;
  const columnIndex = editCell.cellIndex;
  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  newInput.type = [3, 4].includes(columnIndex) ? 'number' : 'text';

  newInput.value =
    columnIndex === 4 ? initialText.replace(/[$,]/g, '') : initialText;

  newInput.addEventListener('blur', () => {
    const editedValue = newInput.value.trim();

    if (!editedValue) {
      editCell.textContent = initialText;

      return;
    }

    if (columnIndex === 0 && editedValue.length < 4) {
      showNotification('error', 'The name must be at least 4 characters long!');
      editCell.textContent = initialText;

      return;
    }

    if (columnIndex === 3) {
      const age = Number(editedValue);

      if (!Number.isFinite(age) || age < 18 || age > 90) {
        showNotification(
          'error',
          'The age of the person must be between 18 and 90 years',
        );
        editCell.textContent = initialText;

        return;
      }

      editCell.textContent = String(age);

      return;
    }

    if (columnIndex === 2 && !officeOptions.includes(editedValue)) {
      showNotification('error', 'Please select a valid office.');
      editCell.textContent = initialText;

      return;
    }

    if (columnIndex === 4) {
      const salary = Number(editedValue);

      if (!Number.isFinite(salary)) {
        showNotification('error', 'Salary must be a valid number.');
        editCell.textContent = initialText;

        return;
      }

      editCell.textContent = formatSalary(salary);

      return;
    }

    editCell.textContent = editedValue;
  });

  newInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      newInput.blur();
    }
  });

  editCell.replaceChildren(newInput);
  newInput.focus();
  newInput.select();
});

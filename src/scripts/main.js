'use strict';

const VALIDATION = {
  NAME_MIN_LENGTH: 4,
  AGE_MIN: 18,
  AGE_MAX: 90,
  NOTIFICATION_TIMEOUT: 3000,
};

const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const tHeaderTitles = document.querySelectorAll('thead tr th');
const tBody = document.querySelector('tbody');
let lastSortedHeader = null;

tHeaderTitles.forEach((title, colIndex) => {
  title.addEventListener('click', () => {
    const tRows = tBody.querySelectorAll('tr');
    const rowArray = Array.from(tRows);

    rowArray.sort((rowA, rowB) => {
      const cellA = rowA.cells[colIndex].textContent;
      const cellB = rowB.cells[colIndex].textContent;
      const textA = cellA.replace('$', '').replace(',', '').trim();
      const textB = cellB.replace('$', '').replace(',', '').trim();
      const numA = parseFloat(textA);
      const numB = parseFloat(textB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      return textA.localeCompare(textB, 'uk-UA');
    });

    if (lastSortedHeader === title && title.ascSorted === true) {
      rowArray.reverse();
      title.ascSorted = false;
    } else {
      if (lastSortedHeader && lastSortedHeader !== title) {
        lastSortedHeader.ascSorted = undefined;
      }
      title.ascSorted = true;
      lastSortedHeader = title;
    }

    tBody.append(...rowArray);
  });
});

function attachRowClickListener(row) {
  row.addEventListener('click', () => {
    const previousActive = document.querySelectorAll('tr.active');

    if (previousActive) {
      previousActive.forEach((activeRow) => {
        activeRow.classList.remove('active');
      });
    }

    row.classList.add('active');
  });

  const cells = row.querySelectorAll('td');

  cells.forEach((cell) => {
    attachCellEditListener(cell);
  });
}

const rows = tBody.querySelectorAll('tr');

rows.forEach((row) => {
  attachRowClickListener(row);
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

function createInputField(labelText, type, fieldName, qa, options = {}) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.type = type;
  input.name = fieldName;
  input.dataset.qa = qa;

  Object.assign(input, options);

  label.append(input);

  return label;
}

form.append(
  createInputField('Name: ', 'text', 'name', 'name'),
  createInputField('Position: ', 'text', 'position', 'position'),
  createInputField('Age: ', 'number', 'age', 'age'),
  createInputField('Salary: ', 'number', 'salary', 'salary', { step: '0.01' }),
);

const selectOfficeLabel = document.createElement('label');

selectOfficeLabel.textContent = 'Office: ';

const selectOffice = document.createElement('select');

selectOfficeLabel.append(selectOffice);
selectOffice.name = 'office';
selectOffice.required = true;
selectOffice.dataset.qa = 'office';

const defaultOption = document.createElement('option');

defaultOption.value = '';
defaultOption.textContent = 'Choose an office';
defaultOption.selected = true;
selectOffice.append(defaultOption);

OFFICES.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  selectOffice.append(option);
});

form.append(selectOfficeLabel);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(submitButton);

document.body.append(form);

const nameInput = form.querySelector('input[name="name"]');
const positionInput = form.querySelector('input[name="position"]');
const ageInput = form.querySelector('input[name="age"]');
const salaryInput = form.querySelector('input[name="salary"]');

function validateFormData() {
  if (nameInput.value.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    return {
      valid: false,
      message: 'Name must be at least 4 characters long.',
    };
  }

  if (positionInput.value.trim() === '') {
    return { valid: false, message: 'Position cannot be empty.' };
  }

  if (selectOffice.value === '') {
    return { valid: false, message: 'Please select an office.' };
  }

  const age = parseInt(ageInput.value);

  if (isNaN(age) || age < VALIDATION.AGE_MIN || age > VALIDATION.AGE_MAX) {
    return { valid: false, message: 'Age must be between 18 and 90.' };
  }

  const salary = parseFloat(salaryInput.value);

  if (!salary || salary <= 0) {
    return { valid: false, message: 'Salary must be a positive number.' };
  }

  return { valid: true };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const validation = validateFormData();

  if (!validation.valid) {
    showNotification(validation.message, 'error');

    return;
  }

  const newRow = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.textContent = nameInput.value;
  newRow.append(nameCell);

  const positionCell = document.createElement('td');

  positionCell.textContent = positionInput.value;
  newRow.append(positionCell);

  const officeCell = document.createElement('td');

  officeCell.textContent = selectOffice.value;
  newRow.append(officeCell);

  const ageCell = document.createElement('td');

  ageCell.textContent = ageInput.value;
  newRow.append(ageCell);

  const salaryCell = document.createElement('td');

  salaryCell.textContent = `$${parseFloat(salaryInput.value).toLocaleString()}`;
  newRow.append(salaryCell);

  tBody.append(newRow);

  attachRowClickListener(newRow);

  showNotification('All data saved successfully.', 'success');

  form.reset();
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, VALIDATION.NOTIFICATION_TIMEOUT);
}

function attachCellEditListener(cell) {
  cell.addEventListener('dblclick', () => {
    const originalText = cell.textContent;
    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = originalText;

    cell.textContent = '';
    cell.append(input);
    input.focus();

    function saveEdit() {
      cell.textContent = input.value || originalText;
    }

    input.addEventListener('blur', saveEdit);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveEdit();
      }
    });
  });
}

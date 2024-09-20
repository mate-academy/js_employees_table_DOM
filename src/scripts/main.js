'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');

let sortDirection = 1;
let currentIndex = -1;
let activeInputCell = null;

const removeActiveClass = () => {
  table.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));
};

const removeActiveInput = () => {
  if (activeInputCell) {
    const input = activeInputCell.querySelector('input');
    const originalText = input.getAttribute('data-original-value');

    activeInputCell.textContent = input.value || originalText;
    activeInputCell = null;
  }
};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentIndex === index) {
      sortDirection *= -1;
    } else {
      sortDirection = 1;
      currentIndex = index;
    }

    removeActiveClass();
    sortTable(index, sortDirection);
  });
});

table.querySelector('tbody').addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    removeActiveClass();
    e.target.parentElement.classList.add('active');
  }
});

const validateInput = (field, value) => {
  const lettersOnlyRegex = /^[A-Za-z\s'`]+$/;

  if (field === 'name' && (!lettersOnlyRegex.test(value) || value.length < 4)) {
    displayNotification(
      'Name must contain only letters and be at least 4 characters long',
      'error',
    );

    return false;
  }

  if (field === 'position' && !lettersOnlyRegex.test(value)) {
    displayNotification('Position must contain only letters', 'error');

    return false;
  }

  if (field === 'age') {
    const age = +value;

    if (age < 18 || age > 90) {
      displayNotification('Age must be between 18 and 90', 'error');

      return false;
    }
  }

  return true;
};

const createEditableCell = (cell) => {
  const originalContent = cell.textContent.trim();
  const field = cell.getAttribute('data-qa');

  removeActiveInput();

  cell.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.value = originalContent;
  input.className = 'cell-input';
  input.setAttribute('data-original-value', originalContent);

  cell.appendChild(input);
  input.focus();

  const saveOrCancelInput = () => {
    const newValue = input.value.trim();

    if (!validateInput(field, newValue)) {
      cell.textContent = originalContent;
      displayNotification(`Invalid value for ${field}`, 'error');
    } else {
      cell.textContent = newValue || originalContent;

      displayNotification(`Value for ${field} successfully updated`, 'success');
    }
  };

  input.addEventListener('blur', saveOrCancelInput);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveOrCancelInput();
    }
  });
};

table.querySelectorAll('tbody td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    createEditableCell(cell);
  });
});

const sortTable = (columnIndex, direction) => {
  const tableBody = table.querySelector('tbody');
  const rows = [...tableBody.querySelectorAll('tr')];

  const sortedRows = rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();

    if (columnIndex === 4) {
      const aSalary = parseFloat(aText.replace(/[$,]/g, ''));
      const bSalary = parseFloat(bText.replace(/[$,]/g, ''));

      return (aSalary - bSalary) * direction;
    }

    if (+aText && +bText) {
      return (+aText - +bText) * direction;
    }

    return aText.localeCompare(bText) * direction;
  });

  tableBody.innerHTML = '';
  tableBody.append(...sortedRows);
};

const form = document.createElement('form');

form.classList.add('new-employee-form');

const createInput = (labelText, inputName, qaValue, type = 'text') => {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.name = inputName;
  input.type = type;
  input.setAttribute('data-qa', qaValue);
  input.required = true;

  label.appendChild(input);

  return label;
};

const createSelect = (labelText, selectName, options, qaValue) => {
  const label = document.createElement('label');

  label.textContent = labelText;

  const select = document.createElement('select');

  select.name = selectName;
  select.setAttribute('data-qa', qaValue);
  select.required = true;

  options.forEach((optionText) => {
    const option = document.createElement('option');

    option.value = optionText;
    option.textContent = optionText;
    select.appendChild(option);
  });

  label.appendChild(select);

  return label;
};

const notificationDiv = document.createElement('div');

notificationDiv.setAttribute('data-qa', 'notification');

document.body.appendChild(notificationDiv);

form.appendChild(createInput('Name:', 'name', 'name'));
form.appendChild(createInput('Position:', 'position', 'position'));

form.appendChild(
  createSelect(
    'Office:',
    'office',
    ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'],
    'office',
  ),
);

form.appendChild(createInput('Age:', 'age', 'age', 'number'));
form.appendChild(createInput('Salary:', 'salary', 'salary', 'number'));

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

document.body.appendChild(form);

const displayNotification = (message, type) => {
  notificationDiv.textContent = message;
  notificationDiv.className = `notification ${type}`;

  notificationDiv.style.display = 'block';

  setTimeout(() => {
    notificationDiv.style.display = 'none';
  }, 5000);
};

const clearNotification = () => {
  notificationDiv.textContent = '';
  notificationDiv.style.display = 'none';
};

const attachEditableEvent = (cell) => {
  cell.addEventListener('dblclick', () => {
    createEditableCell(cell);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;
  const formData = new FormData(form);
  const employeeName = formData.get('name');
  const position = formData.get('position');
  const age = +formData.get('age');

  const lettersOnlyRegex = /^[A-Za-z\s'`]+$/;

  if (!lettersOnlyRegex.test(employeeName)) {
    displayNotification('Name must contain only letters', 'error');
    isValid = false;
  } else if (!lettersOnlyRegex.test(position)) {
    displayNotification('Position must contain only letters', 'error');
    isValid = false;
  } else if (employeeName.length < 4) {
    displayNotification('Name must be at least 4 characters long', 'error');
    isValid = false;
  } else if (age < 18 || age > 90) {
    displayNotification('Age must be between 18 and 90', 'error');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  removeActiveClass();
  clearNotification();

  const newRow = document.createElement('tr');

  ['name', 'position', 'office', 'age', 'salary'].forEach((field) => {
    const cell = document.createElement('td');

    let value = formData.get(field);

    if (field === 'salary') {
      value = `$${parseFloat(value).toLocaleString('en-US')}`;
    }

    cell.textContent = value;
    cell.setAttribute('data-qa', field);

    attachEditableEvent(cell);

    newRow.appendChild(cell);
  });

  table.querySelector('tbody').appendChild(newRow);

  if (currentIndex !== -1) {
    sortTable(currentIndex, sortDirection);
  }

  form.reset();

  displayNotification('Employee added successfully!', 'success');
});

'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');
const rows = Array.from(tbody.querySelectorAll('tr'));

let lastSortedColumn = null;
let selectedRowIndex = null;
let isDescending = false;

const convertToNumber = (str) => {
  if (typeof str === 'string') {
    return Number(str.replace(/[^0-9.-]+/g, ''));
  }

  return NaN;
};

const sortTable = (columnIndex, DESC) => {
  return [...rows].sort((a, b) => {
    const aValue = a.children[columnIndex].textContent.trim();
    const bValue = b.children[columnIndex].textContent.trim();
    let comparison;

    if (columnIndex === 3 || columnIndex === 4) {
      comparison = convertToNumber(aValue) - convertToNumber(bValue);
    } else {
      comparison = aValue.localeCompare(bValue);
    }

    return DESC ? -comparison : comparison;
  });
};

const upDateTable = (sortedRows) => {
  tbody.innerHTML = '';
  sortedRows.forEach((row) => tbody.appendChild(row));
};

const setRowSelected = (rowIndex) => {
  rows.forEach((row, index) => {
    row.classList.toggle('active', index === rowIndex);
  });
};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (lastSortedColumn === index) {
      isDescending = !isDescending;
    } else {
      lastSortedColumn = index;
      isDescending = false;
    }

    const sortedRows = sortTable(index, isDescending);

    upDateTable(sortedRows);
  });
});

rows.forEach((row, index) => {
  row.addEventListener('click', () => {
    selectedRowIndex = selectedRowIndex === index ? null : index;
    setRowSelected(selectedRowIndex);
  });
});

const pushNotification = (title, description, type) => {
  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const titleElement = document.createElement('h2');

  titleElement.classList.add('title');
  titleElement.textContent = title;
  notification.appendChild(titleElement);

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;
  notification.appendChild(descriptionElement);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const validatePosition = (position) => {
  if (
    !position ||
    !position.trim() ||
    /\d/.test(position) ||
    position.trim().length < 2
  ) {
    return false;
  }

  return true;
};

const formFields = {
  name: {
    label: 'Name:',
    type: 'text',
    qa: 'name',
    required: true,
  },
  position: {
    label: 'Position:',
    type: 'text',
    qa: 'position',
    required: true,
  },
  office: {
    label: 'Office:',
    type: 'select',
    qa: 'office',
    required: true,
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  age: {
    label: 'Age:',
    type: 'number',
    qa: 'age',
    required: true,
  },
  salary: {
    label: 'Salary:',
    type: 'number',
    qa: 'salary',
    required: true,
  },
};

const form = document.createElement('form');

form.className = 'new-employee-form';

for (const field in formFields) {
  const fieldConfig = formFields[field];
  const label = document.createElement('label');

  label.textContent = fieldConfig.label;

  let input;

  if (fieldConfig.type === 'select') {
    input = document.createElement('select');

    fieldConfig.options.forEach((optionValue) => {
      const option = document.createElement('option');

      option.value = optionValue;
      option.textContent = optionValue;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = fieldConfig.type;
  }

  input.name = field;
  input.setAttribute('data-qa', fieldConfig.qa);
  label.appendChild(input);
  form.appendChild(label);
}

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {};

  for (const field in formFields) {
    formData[field] = form.querySelector(`[name="${field}"]`).value.trim();
  }

  if (
    !formData.name ||
    !formData.position ||
    !formData.office ||
    !formData.age ||
    !formData.salary
  ) {
    pushNotification('Error', 'All fields are required', 'error');

    return;
  }

  if (formData.name.length < 4) {
    pushNotification(
      'Error',
      'Name must be at least 4 characters long',
      'error',
    );

    return;
  }

  if (!validatePosition(formData.position)) {
    pushNotification(
      'Error',
      'Position must be at least 2 characters long and cannot contain numbers',
      'error',
    );

    return;
  }

  const ageValue = Number(formData.age);

  if (ageValue < 18 || ageValue > 90) {
    pushNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  const salaryValue = Number(formData.salary);
  const newEmployeeData = {
    name: formData.name,
    position: formData.position,
    office: formData.office,
    age: ageValue,
    salary: `$${salaryValue.toLocaleString('en-US')}`,
  };

  const newRow = tbody.insertRow();

  for (const data in newEmployeeData) {
    const newCell = newRow.insertCell();

    newCell.textContent = newEmployeeData[data];
  }

  pushNotification('Success', 'Employee added to the table', 'success');
  form.reset();
});

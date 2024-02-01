/* eslint-disable max-len */
'use strict';

const headers = document.querySelectorAll('th');

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortByOrder(index);
  });
});

let isAsc = true;
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = Array.from(tbody.querySelectorAll('tr'));

function sortByOrder(cellIndex) {
  rows.sort((a, b) => {
    const aVal = a.cells[cellIndex].textContent.replace(/[$,]/g, '');
    const bVal = b.cells[cellIndex].textContent.replace(/[$,]/g, '');

    if (cellIndex === 3 || cellIndex === 4) {
      if (isAsc) {
        return Number(aVal) - Number(bVal);
      } else {
        return Number(bVal) - Number(aVal);
      }
    } else {
      if (isAsc) {
        return aVal.localeCompare(bVal,
          {
            numeric: 'true', sensitivity: 'base',
          });
      } else {
        return bVal.localeCompare(aVal,
          {
            numeric: 'true', sensitivity: 'base',
          });
      }
    }
  });

  rows.forEach((row) => {
    tbody.removeChild(row);
  });

  rows.forEach((row) => {
    tbody.appendChild(row);
  });

  isAsc = !isAsc;
}

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => {
      r.classList.remove('active');
    });

    row.classList.add('active');
  });
});

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const formContent = [
    {
      label: 'Name:',
      type: 'text',
      name: 'name',
      'data-qa': 'name',
      required: true,
    },
    {
      label: 'Position:',
      type: 'text',
      name: 'position',
      'data-qa': 'position',
      required: true,
    },
    {
      label: 'Office:',
      type: 'select',
      name: 'office',
      'data-qa': 'office',
      options: ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'],
      required: true,
    },
    {
      label: 'Age:',
      type: 'number',
      name: 'age',
      'data-qa': 'age',
      required: true,
    },
    {
      label: 'Salary:',
      type: 'number',
      name: 'salary',
      'data-qa': 'salary',
      required: true,
    },
  ];

  // eslint-disable-next-line no-shadow
  formContent.forEach(({ label, type, name, 'data-qa': dataQa, options, required }) => {
    const theLabel = document.createElement('label');

    theLabel.textContent = `${label}`;

    if (type === 'select') {
      const select = document.createElement('select');

      select.name = name;
      select.dataset.qa = dataQa;

      if (required) {
        select.setAttribute('required', true);
      }

      if (options) {
        options.forEach((option) => {
          const theOption = document.createElement('option');

          theOption.value = option;
          theOption.textContent = option;
          select.appendChild(theOption);
        });
      }
      theLabel.appendChild(select);
    } else {
      const input = document.createElement('input');

      input.name = name;
      input.type = type;
      input.dataset.qa = dataQa;

      if (required) {
        input.setAttribute('required', true);
      }
      theLabel.appendChild(input);
    }

    form.appendChild(theLabel);
  });

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);
  document.body.appendChild(form);

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (form.checkValidity()) {
      const formData = {};
      const inputTypes = form.querySelectorAll('select, input');

      inputTypes.forEach((input) => {
        formData[input.name] = input.type === 'number' ? parseInt(input.value, 10) : input.value;
      });
      getValidForm(formData);
    } else {
      form.reportValidity();
    }
  });
}

function getNotification(message, type) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.textContent = message;
  notification.classList.add(type);
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
}

function addRow(formData) {
  const newRow = document.createElement('tr');
  const dataArray = Object.values(formData);

  dataArray.forEach((val, index) => {
    const cell = document.createElement('td');

    if (index === 4) {
      cell.textContent = '$' + new Intl.NumberFormat('en-US').format(val);
    } else {
      cell.textContent = val;
    }
    newRow.appendChild(cell);
  });
  tbody.appendChild(newRow);
}

function getValidForm(formData) {
  if (formData.name.length < 4) {
    getNotification('Name should have at least four letters', 'error');

    return false;
  }

  if (formData.age < 18 || formData.age > 90) {
    getNotification('Please insert an age between 18 - 90', 'error');

    return false;
  }

  if (formData.salary <= 0) {
    getNotification('Please insert a valid salary', 'error');

    return false;
  }

  addRow(formData);
  getNotification('Thanks for submitting your data', 'success');

  return true;
}

createForm();

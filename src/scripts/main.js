'use strict';

document.addEventListener('DOMContentLoaded', function() {
  const table = document.querySelector('table');
  const tableBody = table.querySelector('tbody');
  const tableHeaders = table.querySelectorAll('th');
  const form = document.createElement('form');
  const notification = document.createElement('div');

  let sortOrder = -1;
  let editedCell = false;

  notification.setAttribute('data-qa', 'notification');

  form.className = 'new-employee-form';

  const formInputs = [
    {
      label: 'Name',
      type: 'text',
      fieldName: 'name',
      qa: 'name',
    },
    {
      label: 'position',
      type: 'text',
      fieldName: 'position',
      qa: 'position',
    },
    {
      label: 'Office',
      type: 'select',
      fieldName: 'office',
      qa: 'office',
      options: ['Tokyo', 'Singapore', 'London', 'New York',
        'Edinburgh', 'San Francisco'],
    },
    {
      label: 'age',
      type: 'number',
      fieldName: 'age',
      qa: 'age',
    },
    {
      label: 'salary',
      type: 'number',
      fieldName: 'salary',
      qa: 'salary',
    },
  ];

  const createForm = ({ label, type, fieldName, qa, options }) => {
    const inputLabel = document.createElement('label');
    const input = type === 'select'
      ? document.createElement('select')
      : document.createElement('input');

    input.name = fieldName;

    if (type === 'select') {
      options.forEach((elem) => {
        const option = document.createElement('option');

        option.value = elem;
        option.textContent = elem;

        input.append(option);
      });
    } else {
      input.type = type;
    }

    if (fieldName === 'name') {
      input.setAttribute('minLength', '4');
      input.setAttribute('maxLength', '50');
      input.setAttribute('placeholder', 'length between 4-50');
    }

    if (fieldName === 'age') {
      input.setAttribute('min', '18');
      input.setAttribute('max', '90');
      input.setAttribute('placeholder', 'age between 18-90');
    }

    inputLabel.setAttribute('data-qa', qa);
    inputLabel.innerHTML = `${label}: `;
    inputLabel.append(input);
    form.append(inputLabel);

    return input;
  };

  function showNotification(type, message) {
    notification.className = type;
    notification.textContent = message;
  }

  formInputs.forEach(createForm);

  document.body.appendChild(form);

  const submitButton = document.createElement('button');

  submitButton.className = 'button';
  submitButton.textContent = 'Save to table';

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    employeeValidation();
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  });
  form.append(submitButton);

  function addEmployeeToTable(employee) {
    const newRow = document.createElement('tr');

    Object.values(employee).forEach((value) => {
      const cell = document.createElement('td');

      cell.textContent = value;
      newRow.append(cell);
    });
    tableBody.append(newRow);
  }

  function employeeValidation() {
    const newEmployee = {};
    let isCorrect = true;

    formInputs.forEach(({ fieldName }) => {
      const input = form.querySelector(`[name='${fieldName}']`);

      newEmployee[fieldName] = fieldName === 'salary'
        ? `$${parseFloat(input.value).toLocaleString(
          'en-US')}`
        : input.value;

      if (input.value.trim() === '') {
        isCorrect = false;

        showNotification('error',
          'all fields required');
      }

      if (!input.checkValidity()) {
        isCorrect = false;

        showNotification('error',
          'check values in inputs ');
      }
    });

    if (isCorrect) {
      addEmployeeToTable(newEmployee);
      showNotification('success', 'success, new Person in our team!!');
      form.reset();
    }
  }

  tableBody.addEventListener('dblclick', cellRename);

  function save(cell, input) {
    cell.textContent = input.value;
    input.remove();
    editedCell = false;
  }

  function cellRename(e) {
    const cell = e.target.closest('td');
    const input = document.createElement('input');
    const prevValue = cell.textContent;

    if (cell && !editedCell) {
      editedCell = true;

      input.addEventListener('blur', function() {
        save(cell, input);
      });

      input.addEventListener('keydown', function(ev) {
        if (ev.key === 'Enter') {
          save(cell, input);
        }
      });

      input.value = prevValue;
      input.className = 'cell-input';
      input.style.width = `${cell.getBoundingClientRect().width - 36}px`;
      cell.textContent = '';
      cell.appendChild(input);
    }
  }

  tableHeaders.forEach((header, index) => {
    header.addEventListener('click', () => sortAb(index));
  });

  function sortAb(index) {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));

    sortOrder = -sortOrder;

    rows.sort((a, b) => {
      const aValue
      = parseFloat(a.children[index].textContent.replace(/[$,]/g, ''))
      || a.children[index].textContent;
      const bValue
      = parseFloat(b.children[index].textContent.replace(/[$,]/g, ''))
      || b.children[index].textContent;

      if (aValue < bValue) {
        return 1 * sortOrder;
      }

      if (aValue > bValue) {
        return -1 * sortOrder;
      } else {
        return 0;
      }
    });
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
  }

  tableBody.addEventListener('click', function(e) {
    const clickedRow = e.target.closest('tr');

    if (clickedRow) {
      const index = Array.from(tableBody.children).indexOf(clickedRow);

      selectRow(index);
    }
  });

  function selectRow(index) {
    const tableBodyRows = Array.from(
      document.querySelectorAll('table tbody tr'));

    const selectedRow = tableBodyRows[index];

    if (selectedRow) {
      tableBodyRows.forEach(row => row.classList.remove('active'));
      selectedRow.className = 'active';
    }
  }
});

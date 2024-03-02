'use strict';

document.addEventListener('DOMContentLoaded', function() {
  const table = document.querySelector('table tbody');
  const tableHeaders = document.querySelectorAll('table th');
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const formInputs = [
    {
      label: 'Name', type: 'text', name: 'name', qa: 'name',
    },
    {
      label: 'Position', type: 'text', name: 'position', qa: 'position',
    },
    {
      label: 'Office',
      type: 'select',
      name: 'office',
      qa: 'office',
      options: ['Tokyo', 'Singapore', 'London',
        'New York', 'Edinburgh', 'San Francisco'],
    },
    {
      label: 'Age', type: 'number', name: 'age', qa: 'age',
    },
    {
      label: 'Salary', type: 'number', name: 'salary', qa: 'salary',
    },
  ];

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');

  let editableCell = null;

  const createFormInput = ({ label, type, name, qa, options }) => {
    const inputWrapper = document.createElement('label');
    const input = type === 'select'
      ? document.createElement('select')
      : document.createElement('input');

    input.name = name;
    input.type = type;

    if (type === 'select') {
      options.forEach((optionText) => {
        const option = document.createElement('option');

        option.value = optionText;
        option.text = optionText;
        input.appendChild(option);
      });
    }

    inputWrapper.innerHTML = `${label}: `;
    inputWrapper.appendChild(input);
    inputWrapper.setAttribute('data-qa', qa);
    form.appendChild(inputWrapper);

    return input;
  };

  formInputs.forEach(createFormInput);

  const submitButton = document.createElement('button');

  submitButton.type = 'button';
  submitButton.textContent = 'Save to table';
  submitButton.addEventListener('click', handleFormSubmit);
  form.appendChild(submitButton);

  document.body.appendChild(form);
  document.body.appendChild(notification);

  tableHeaders.forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
  });

  table.addEventListener('click', (event) => selectRow(event));

  table.addEventListener('dblclick', (event) => startEditingCell(event));

  function handleFormSubmit() {
    const formData = {};
    let isValid = true;

    formInputs.forEach(({ name, type, qa }) => {
      const input = form.querySelector(`[name="${name}"]`);

      formData[name] = type === 'number'
        ? parseFloat(input.value)
        : input.value;

      if (!input.checkValidity() || input.value.trim() === '') {
        isValid = false;

        showNotification('error',
          'All fields are required. Please fill in all the inputs.');
      }
    });

    if (isValid) {
      addEmployeeToTable(formData);
      showNotification('success', 'Employee added successfully.');
      form.reset();
    }
  }

  function addEmployeeToTable(employee) {
    const newRow = document.createElement('tr');

    Object.values(employee).forEach((value) => {
      const cell = document.createElement('td');

      cell.textContent = value;
      newRow.appendChild(cell);
    });
    table.appendChild(newRow);
  }

  function showNotification(type, message) {
    notification.className = type;
    notification.textContent = message;

    setTimeout(() => {
      notification.textContent = '';
    }, 3000);
  }

  function sortTable(columnIndex) {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));

    const sortOrder = rows[0].children[columnIndex]
      .textContent.toLowerCase() === 'name' ? 1 : -1;

    rows.sort((a, b) => {
      const aValue = a.children[columnIndex].textContent;
      const bValue = b.children[columnIndex].textContent;

      if (aValue < bValue) {
        return -1 * sortOrder;
      } else if (aValue > bValue) {
        return 1 * sortOrder;
      } else {
        return 0;
      }
    });

    const tbody = document.querySelector('table tbody');

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
  }

  function selectRow(event) {
    const selectedRow = event.target.closest('tr');

    if (selectedRow && !selectedRow.classList.contains('active')) {
      const rows = document.querySelectorAll('table tbody tr');

      rows.forEach(row => row.classList.remove('active'));

      selectedRow.classList.add('active');
    }
  }

  function startEditingCell(event) {
    const cell = event.target.closest('td');

    if (cell && !editableCell) {
      editableCell = cell;

      const oldValue = cell.textContent;
      const input = document.createElement('input');

      input.className = 'cell-input';
      input.value = oldValue;

      input.addEventListener('blur', () => {
        saveChanges(input.value);
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveChanges(input.value);
        }
      });

      cell.textContent = '';
      cell.appendChild(input);
      input.focus();
    }
  }

  function saveChanges(newValue) {
    if (editableCell) {
      editableCell.textContent = newValue;
      editableCell = null;
    }
  }
});

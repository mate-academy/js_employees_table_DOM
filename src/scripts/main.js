'use strict';

// write code here

/* eslint-disable indent */

document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  let currentSortIndex = -1; // Index of the currently sorted column
  let currentSortOrder = 1; // 1 for ascending, -1 for descending

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // To sort columns
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      // const tbody = table.querySelector('tbody');
      // const rows = Array.from(tbody.querySelectorAll('tr'));

      // Always sort in ascending order when a new header is clicked
      if (index !== currentSortIndex) {
        currentSortOrder = 1; // Reset to ascending order for new column
        currentSortIndex = index; // Update current sort index
      } else {
        // Toggle sort order for the same column
        currentSortOrder *= -1;
      }

      rows.sort((a, b) => {
        const cellA = a.cells[index].textContent.trim();
        const cellB = b.cells[index].textContent.trim();

        // Handle different data types
        if (index === 3) {
          // Age column
          return (Number(cellA) - Number(cellB)) * currentSortOrder;
        } else if (index === 4) {
          // Salary column
          const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
          const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

          return (numA - numB) * currentSortOrder;
        } else {
          return cellA.localeCompare(cellB) * currentSortOrder;
        }
      });

      // Clear existing sort classes from headers
      headers.forEach((th) => th.classList.remove('ascending', 'descending'));

      // Add the appropriate class to the sorted column header
      if (currentSortOrder === 1) {
        headers[index].classList.add('ascending');
      } else {
        headers[index].classList.add('descending');
      }

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // To highlight the row
  tbody.addEventListener('click', (el) => {
    const clickedRow = el.target.closest('tr');

    if (clickedRow) {
      tbody
        .querySelectorAll('tr.active')
        .forEach((row) => row.classList.remove('active'));
      clickedRow.classList.add('active');
    }
  });

  // Form
  const form = document.createElement('form');

  form.setAttribute('id', 'form');
  form.setAttribute('class', 'new-employee-form');

  const labelName = document.createElement('label');

  labelName.textContent = 'Name: ';
  form.appendChild(labelName);

  const inputName = document.createElement('input');

  inputName.setAttribute('data-qa', 'name');
  inputName.setAttribute('name', 'name');
  inputName.setAttribute('type', 'text');
  inputName.setAttribute('required', '');
  labelName.appendChild(inputName);

  const labelPosition = document.createElement('label');

  labelPosition.textContent = 'Position: ';
  form.appendChild(labelPosition);

  const inputPosition = document.createElement('input');

  inputPosition.setAttribute('data-qa', 'position');
  inputPosition.setAttribute('name', 'position');
  inputPosition.setAttribute('type', 'text');
  inputPosition.setAttribute('required', '');
  labelPosition.appendChild(inputPosition);

  const labelOffice = document.createElement('label');

  labelOffice.textContent = 'Office: ';

  const selectOffice = document.createElement('select');

  selectOffice.setAttribute('data-qa', 'office');

  const options = [
    { value: 'Tokyo', text: 'Tokyo' },
    { value: 'Singapore', text: 'Singapore' },
    { value: 'London', text: 'London' },
    { value: 'New York', text: 'New York' },
    { value: 'San Francisco', text: 'San Francisco' },
    { value: 'Edinburgh', text: 'Edinburgh' },
  ];

  options.forEach((optionData) => {
    const option = document.createElement('option');

    option.value = optionData.value;
    option.textContent = optionData.text;
    selectOffice.appendChild(option);
  });

  labelOffice.appendChild(selectOffice);
  selectOffice.setAttribute('required', '');
  form.appendChild(labelOffice);

  const labelAge = document.createElement('label');

  labelAge.textContent = 'Age: ';
  form.appendChild(labelAge);

  const inputAge = document.createElement('input');

  inputAge.setAttribute('data-qa', 'age');
  inputAge.setAttribute('name', 'age');
  inputAge.setAttribute('type', 'number');
  inputAge.setAttribute('required', '');
  labelAge.appendChild(inputAge);

  const labelSalary = document.createElement('label');

  labelSalary.textContent = 'Salary: ';
  form.appendChild(labelSalary);

  const inputSalary = document.createElement('input');

  inputSalary.setAttribute('data-qa', 'salary');
  inputSalary.setAttribute('name', 'salary');
  inputSalary.setAttribute('type', 'text');
  inputSalary.setAttribute('required', '');
  labelSalary.appendChild(inputSalary);

  // Format salary input with a $ sign and thousands separators
  function formatSalary(value) {
    // Remove any non-digit characters
    const rawValue = value.replace(/[^0-9]/g, '');

    // Convert to number and format with commas and dollar sign
    return rawValue
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(parseInt(rawValue))
      : '';
  }

  inputSalary.addEventListener('input', (events) => {
    events.target.value = formatSalary(events.target.value);
  });

  inputSalary.addEventListener('blur', (events) => {
    events.target.value = formatSalary(events.target.value);
  });

  inputSalary.addEventListener('input', () => {
    const cursorPosition = inputSalary.selectionStart;
    const oldLength = inputSalary.value.length;

    inputSalary.value = formatSalary(inputSalary.value);

    const newLength = inputSalary.value.length;

    // Adjust cursor position if a $ was added
    inputSalary.setSelectionRange(
      cursorPosition + (newLength - oldLength),
      cursorPosition + (newLength - oldLength),
    );
  });

  inputSalary.addEventListener('blur', () => {
    inputSalary.value = formatSalary(inputSalary.value);
  });

  function showNotification(type, title, message) {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.setAttribute('data-qa', 'notification');

    const titleElement = document.createElement('span');

    titleElement.classList.add('title');
    titleElement.textContent = title;

    const messageElement = document.createElement('p');

    messageElement.textContent = message;

    notification.appendChild(titleElement);
    notification.appendChild(messageElement);
    body.appendChild(notification);

    setTimeout(() => {
      body.removeChild(notification);
    }, 3000);
  }

  // Button to add a new row
  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.setAttribute('type', 'submit');
  button.setAttribute('data-qa', 'save-button');

  button.addEventListener('click', (events) => {
    events.preventDefault();

    const nameEntered = inputName.value.trim();
    const age = parseInt(inputAge.value.trim(), 10);
    const position = inputPosition.value.trim();

    if (nameEntered.length < 4) {
      showNotification(
        'error',
        'Invalid Data',
        'Name must be at least 4 characters long.',
      );

      return;
    }

    if (isNaN(age) || age < 18 || age > 90) {
      showNotification(
        'error',
        'Invalid Age',
        'Age must be between 18 and 90.',
      );

      return;
    }

    if (!position) {
      showNotification(
        'error',
        'Position undefrined',
        'Position should be added.',
      );

      return;
    }

    const newTr = document.createElement('tr');

    tbody.appendChild(newTr);

    const inputs = form.querySelectorAll('input, select');

    inputs.forEach((input) => {
      const newTd = document.createElement('td');

      newTd.textContent = input.value;
      newTr.appendChild(newTd);
    });

    showNotification(
      'success',
      'Employee Added',
      'New employee successfully added to the table.',
    );
    form.reset();
  });

  form.appendChild(button);
  body.appendChild(form);
});

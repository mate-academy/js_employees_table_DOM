'use strict';

// function capitalize text

function capitalize(text) {
  return text.trim().replace(/\b\w/g, (char) => char.toUpperCase());
}

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  let isAscending = true;
  let currenColumn = null;

  // notification function
  const pushNotification = (title, description, type) => {
    const message = document.createElement('div');
    const messageTitle = document.createElement('h2');
    const messageDescription = document.createElement('p');

    message.classList.add(type);
    message.setAttribute('data-qa', 'notification');

    messageTitle.innerText = title;
    messageDescription.innerText = description;

    message.append(messageTitle, messageDescription);

    document.body.append(message);

    setTimeout(() => {
      message.hidden = true;
    }, 2000);
  };

  // sorting of the table
  thead.addEventListener('click', (e) => {
    const headerList = thead.querySelectorAll('th');
    const target = e.target;

    if (target.tagName === 'TH') {
      const columnIndex = Array.from(headerList).indexOf(target);
      const rowsArray = Array.from(tbody.rows);

      if (currenColumn === columnIndex) {
        isAscending = !isAscending;
      } else {
        currenColumn = columnIndex;
        isAscending = true;
      }

      rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim().toLowerCase();
        const cellB = rowB.cells[columnIndex].textContent.trim().toLowerCase();

        const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

        let comparison;

        if (!isNaN(numA) && !isNaN(numB)) {
          comparison = numA - numB;
        } else {
          comparison = cellA.localeCompare(cellB);
        }

        return isAscending ? comparison : -comparison;
      });

      rowsArray.forEach((row) => tbody.appendChild(row));
    }
  });

  // highlighting the selected column

  tbody.addEventListener('click', (e) => {
    const selectedRow = e.target.closest('tr');

    if (selectedRow) {
      Array.from(tbody.rows).forEach((row) => row.classList.remove('active'));
    }

    selectedRow.classList.toggle('active');
  });

  // adding a form
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  // adding a label and an input for the name
  const nameLabel = document.createElement('label');

  nameLabel.setAttribute('for', 'name');
  nameLabel.textContent = 'Name:';

  const nameInput = document.createElement('input');

  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('id', 'name');
  nameInput.setAttribute('data-qa', 'name');

  nameLabel.appendChild(nameInput);
  form.appendChild(nameLabel);

  // adding a label and an input for the position

  const positionLabel = document.createElement('label');

  positionLabel.setAttribute('for', 'position');
  positionLabel.textContent = 'Position:';

  const positionInput = document.createElement('input');

  positionInput.setAttribute('type', 'text');
  positionInput.setAttribute('name', 'position');
  positionInput.setAttribute('id', 'position');
  positionInput.setAttribute('data-qa', 'position');

  positionLabel.appendChild(positionInput);
  form.appendChild(positionLabel);

  // adding select and options
  const selectLabel = document.createElement('label');

  selectLabel.setAttribute('for', 'office');
  selectLabel.textContent = 'Office:';

  const select = document.createElement('select');

  select.setAttribute('name', 'office');
  select.setAttribute('id', 'office');
  select.setAttribute('data-qa', 'office');

  const optionsArray = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  optionsArray.forEach((option) => {
    const optionElement = document.createElement('option');

    optionElement.setAttribute('value', option);
    optionElement.textContent = option;

    select.appendChild(optionElement);
  });

  selectLabel.appendChild(select);
  form.appendChild(selectLabel);

  // adding a label and an input for the age
  const ageLabel = document.createElement('label');

  ageLabel.setAttribute('for', 'age');
  ageLabel.textContent = 'Age:';

  const ageInput = document.createElement('input');

  ageInput.setAttribute('type', 'number');
  ageInput.setAttribute('name', 'age');
  ageInput.setAttribute('id', 'age');
  ageInput.setAttribute('data-qa', 'age');

  ageLabel.appendChild(ageInput);
  form.appendChild(ageLabel);

  // adding a label and an input for the salary
  const salaryLabel = document.createElement('label');

  salaryLabel.setAttribute('for', 'salary');
  salaryLabel.textContent = 'Salary:';

  const salaryInput = document.createElement('input');

  salaryInput.setAttribute('type', 'number');
  salaryInput.setAttribute('name', 'salary');
  salaryInput.setAttribute('id', 'salary');
  salaryInput.setAttribute('data-qa', 'salary');

  salaryLabel.appendChild(salaryInput);
  form.appendChild(salaryLabel);

  // adding a submit button
  const submitButton = document.createElement('button');

  submitButton.setAttribute('type', 'submit');
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  document.body.appendChild(form);

  // adding a new employee to the table by click

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newName = nameInput.value.trim();
    const newPosition = positionInput.value.trim();
    const newOffice = select.value;
    const newAge = parseFloat(ageInput.value);
    const newSalary = salaryInput.value;

    // showing errors
    if (newName.length < 4) {
      pushNotification(
        'Error message',
        'Name must be at least 4 characters long',
        'error',
      );

      return;
    }

    if (!newPosition) {
      pushNotification(
        'Error message',
        'Position must be at least 4 characters long',
        'error',
      );

      return;
    }

    if (newAge < 18 || newAge > 90) {
      pushNotification(
        'Error message',
        'Age must be between 18 and 90.',
        'error',
      );

      return;
    }

    if (newName && newPosition && newOffice && newAge && newSalary) {
      const newRow = document.createElement('tr');

      // adding a name cell
      const nameCell = document.createElement('td');

      nameCell.textContent = capitalize(newName);
      newRow.appendChild(nameCell);

      // adding a position cell
      const positionCell = document.createElement('td');

      positionCell.textContent = capitalize(newPosition);
      newRow.appendChild(positionCell);

      // adding an office cell
      const officeCell = document.createElement('td');

      officeCell.textContent = newOffice;
      newRow.appendChild(officeCell);

      // adding an age cell or pushing the notification
      const ageCell = document.createElement('td');

      ageCell.textContent = newAge;
      newRow.appendChild(ageCell);

      // adding salary sell and format the salary value to a currency format
      const salaryCell = document.createElement('td');

      salaryCell.textContent = `$${parseFloat(newSalary).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        },
      )}`;
      newRow.appendChild(salaryCell);

      tbody.appendChild(newRow);

      pushNotification(
        'Success message',
        'New employee has been successfully added to the table',
        'success',
      );

      form.reset();
    }
  });

  // editing the cell
  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (cell.tagName === 'TD') {
      const originalText = cell.textContent;
      const newInput = document.createElement('input');

      newInput.setAttribute('type', 'text');
      newInput.setAttribute('value', originalText);
      newInput.classList.add('cell-input');

      cell.textContent = '';
      cell.appendChild(newInput);
      newInput.focus();

      const save = () => {
        const newValue = newInput.value.trim();

        cell.textContent = newValue || originalText;
      };

      newInput.addEventListener('blur', save);

      newInput.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter') {
          evt.preventDefault();
          newInput.blur();
        }
      });
    }
  });
});

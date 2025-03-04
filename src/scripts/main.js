'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = Array.from(table.querySelectorAll('thead th'));
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const sortDirection = {};

  const isNumeric = (str) => {
    const cleanedStr = str.replace(/[^0-9.-]/g, '').trim();

    return !isNaN(parseFloat(cleanedStr)) && isFinite(cleanedStr);
  };

  const sortTable = (columnIndex) => {
    const compare = (a, b) => {
      const valA = a.children[columnIndex].textContent.trim();
      const valB = b.children[columnIndex].textContent.trim();

      if (isNumeric(valA) && isNumeric(valB)) {
        const numA = parseFloat(valA.replace(/[^0-9.-]/g, '').trim());
        const numB = parseFloat(valB.replace(/[^0-9.-]/g, '').trim());

        return numA - numB;
      }

      return valA.localeCompare(valB);
    };

    const currentDirection = sortDirection[columnIndex] || 'ascending';

    rows.sort((a, b) => {
      const result = compare(a, b);

      return currentDirection === 'ascending' ? result : -result;
    });

    sortDirection[columnIndex] =
      currentDirection === 'ascending' ? 'descending' : 'ascending';

    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  };

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      sortTable(index);
    });
  });

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));

      row.classList.add('active');
    });
  });

  const createdFormField = document.createElement('form');
  const createdButton = document.createElement('button');
  const selectTagOptions = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ];

  createdFormField.setAttribute('class', 'new-employee-form');
  createdButton.textContent = 'Save to table';

  headers.forEach((header) => {
    const newLabel = document.createElement('label');
    let newElement;

    if (header.textContent !== 'Office') {
      newElement = document.createElement('input');
    } else {
      newElement = document.createElement('select');

      selectTagOptions.forEach((option) => {
        const newOption = document.createElement('option');

        newOption.textContent = option;
        newElement.append(newOption);
      });
    }

    newElement.setAttribute(
      'type',
      header.textContent === 'Age' || header.textContent === 'Salary'
        ? 'number'
        : 'text',
    );
    newElement.setAttribute('data-qa', header.textContent.toLowerCase());
    newElement.setAttribute('name', header.textContent.toLowerCase());

    newElement.setAttribute(
      'class',
      `cell-input ${header.textContent.toLowerCase()}`,
    );

    newLabel.textContent = `${header.textContent}:`;
    newLabel.append(newElement);
    createdFormField.append(newLabel);
  });

  const validateForm = () => {
    const inputNameValue = document.querySelector('.name').value.trim();
    const inputPositionValue = document.querySelector('.position').value.trim();
    const inputAgeValue = document.querySelector('.age').value.trim();
    const inputSalaryValue = document.querySelector('.salary').value.trim();

    if (inputNameValue.length < 4) {
      pushNotification(
        'Invalid Input',
        'Name must be at least 4 characters',
        'error',
      );

      return false;
    } else if (inputPositionValue.length === 0) {
      pushNotification('Invalid Input', 'Position cannot be empty', 'error');

      return false;
    } else if (Number(inputAgeValue) < 18 || Number(inputAgeValue) > 90) {
      pushNotification('Invalid Age', 'Age must be between 18 and 90', 'error');

      return false;
    } else if (inputSalaryValue.length < 1) {
      pushNotification('Invalid Salary', 'Salary cannot be empty', 'error');

      return false;
    }

    return true;
  };

  createdButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const allLabels = Array.from(document.querySelectorAll('label'));
    const newRow = document.createElement('tr');

    allLabels.forEach((label) => {
      const newTd = document.createElement('td');
      const value = label.lastChild.value;

      if (label.textContent === 'Salary:') {
        newTd.textContent = `$${Number(value).toLocaleString('en-US')}`;
      } else {
        newTd.textContent = value;
      }

      newRow.append(newTd);
    });

    pushNotification(
      'Employee Added',
      'New employee data saved successfully',
      'success',
    );
    document.querySelector('tbody').append(newRow);
    rows.push(newRow);

    allLabels.forEach((item) => (item.lastChild.value = ''));
    document.querySelector('select').firstElementChild.selected = true;
  });

  document.body.append(createdFormField);
  createdFormField.append(createdButton);
});

const pushNotification = (title, description, type) => {
  const createdElement = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationMessage = document.createElement('p');

  notificationTitle.textContent = title;
  notificationMessage.textContent = description;

  notificationTitle.setAttribute('class', 'title');
  createdElement.setAttribute('class', `notification ${type}`);

  createdElement.append(notificationTitle);
  createdElement.append(notificationMessage);
  document.body.append(createdElement);

  setTimeout(() => {
    createdElement.style.display = 'none';
  }, 2000);
};

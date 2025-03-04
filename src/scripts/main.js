'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = Array.from(table.querySelectorAll('thead th'));
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const sortDirection = {};

  const sortTable = (columnIndex) => {
    const isNumeric = (str) => {
      const cleanedStr = str.replace(/[^0-9.-]/g, '').trim();

      return !isNaN(parseFloat(cleanedStr)) && isFinite(cleanedStr);
    };

    const compare = (a, b) => {
      const valA = a.children[columnIndex].textContent.trim();
      const valB = b.children[columnIndex].textContent.trim();

      if (isNumeric(valA) && isNumeric(valB)) {
        const numA = parseFloat(valA.replace(/[^0-9.-]/g, '').trim());
        const numB = parseFloat(valB.replace(/[^0-9.-]/g, '').trim());

        return numA - numB;
      }

      if (valA < valB) {
        return -1;
      }

      if (valA > valB) {
        return 1;
      }

      return 0;
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

  for (const header of headers) {
    const newLabel = document.createElement('label');
    let newElement;

    if (header.textContent !== 'Office') {
      newElement = document.createElement('input');
    } else {
      newElement = document.createElement('select');

      for (const option of selectTagOptions) {
        const newOption = document.createElement('option');

        newOption.textContent = option;
        newElement.append(newOption);
      }
    }

    if (header.textContent !== 'Age' && header.textContent !== 'Salary') {
      newElement.setAttribute('type', 'text');
    } else {
      newElement.setAttribute('type', 'number');
    }

    newElement.setAttribute('data-qa', header.textContent.toLocaleLowerCase());
    newElement.setAttribute('name', header.textContent.toLocaleLowerCase());

    newElement.setAttribute(
      'class',
      `cell-input ${header.textContent.toLocaleLowerCase()}`,
    );
    newLabel.textContent = header.textContent + ':';
    newLabel.append(newElement);
    createdFormField.append(newLabel);
  }

  createdButton.addEventListener('click', (e) => {
    e.preventDefault();

    const allLabels = Array.from(document.querySelectorAll('label'));
    let isValid = true;

    const inputNameValue = document.querySelector('.name').value.trim();
    const inputPositionValue = document.querySelector('.position').value.trim();
    const iputAgeValue = document.querySelector('.age').value.trim();
    const inputSalaryValue = document.querySelector('.salary').value.trim();

    if (inputNameValue.length < 4) {
      pushNotification(
        'Please enter correct name',
        'Minimum length of name is 4',
        'error',
      );
      isValid = false;
    } else if (inputPositionValue.length === 0) {
      pushNotification(
        'Please enter correct position',
        'Position is empty',
        'error',
      );
      isValid = false;
    } else if (Number(iputAgeValue) < 18 || Number(iputAgeValue) > 90) {
      pushNotification(
        'Age is lower than 18 or empty',
        'Age should be more than 17 and less than 90',
        'error',
      );
      isValid = false;
    } else if (inputSalaryValue.length < 1) {
      pushNotification('Invalid data', 'Empty salary', 'error');
      isValid = false;
    }

    const newRow = document.createElement('tr');

    for (const label of allLabels) {
      const newTd = document.createElement('td');

      if (label.textContent === 'Salary:') {
        newTd.textContent =
          '$' + Number(label.lastChild.value).toLocaleString('en-US');
        newRow.append(newTd);
        continue;
      }

      newTd.textContent = label.lastChild.value;
      newRow.append(newTd);
    }

    if (isValid) {
      pushNotification('New employee added', 'Correct data', 'success');
      document.querySelector('tbody').append(newRow);
      rows.push(newRow);

      for (const item of allLabels) {
        if (item.firstChild.textContent === 'Office:') {
          document.querySelector('select').firstElementChild.selected = true;
          continue;
        }

        item.lastChild.value = '';
      }
    }
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

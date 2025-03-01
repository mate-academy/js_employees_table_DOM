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
  const dataQaTitles = ['name', 'position', 'office', 'age', 'salary'];
  const typesForInputs = ['text', 'text', 'text', 'number', 'number'];

  createdFormField.setAttribute('class', 'new-employee-form');
  createdButton.textContent = 'Save to table';

  for (let i = 0; i < headers.length; i++) {
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');

    if (i === 2) {
      const newSelect = document.createElement('select');

      for (const option of selectTagOptions) {
        const newOption = document.createElement('option');

        newOption.textContent = option;
        newSelect.append(newOption);
      }

      newSelect.setAttribute('data-qa', dataQaTitles[i]);
      newSelect.setAttribute('name', dataQaTitles[i]);
      newSelect.setAttribute('type', typesForInputs[i]);
      newLabel.textContent = headers[i].textContent + ':';
      newLabel.append(newSelect);
      createdFormField.append(newLabel);

      continue;
    }

    newInput.setAttribute('data-qa', dataQaTitles[i]);
    newInput.setAttribute('name', dataQaTitles[i]);
    newInput.setAttribute('type', typesForInputs[i]);
    newInput.required = true;
    newLabel.textContent = headers[i].textContent + ':';
    newLabel.append(newInput);
    createdFormField.append(newLabel);
  }

  createdButton.addEventListener('click', (e) => {
    e.preventDefault();

    const allInputs = Array.from(document.querySelectorAll('label'));
    let isValid = true;

    const clientName = allInputs[0].lastChild.value.trim();
    const position = allInputs[1].lastChild.value.trim();
    const age = allInputs[3].lastChild.value.trim();
    const salary = allInputs[4].lastChild.value.trim();

    if (clientName.length < 4) {
      pushNotification(
        'Please enter correct name',
        'Minimum length of name is 4',
        'success',
      );
      isValid = false;
    } else if (position.length === 0) {
      pushNotification(
        'Please enter correct position',
        'Position is empty',
        'error',
      );
      isValid = false;
    } else if (Number(age) < 18) {
      pushNotification(
        'Age is lower than 18 or empty',
        'Age should be more than 17',
        'error',
      );
      isValid = false;
    } else if (salary.length < 1) {
      pushNotification('Invalid data', 'Empty salary', 'error');
      isValid = false;
    }

    const newTr = document.createElement('tr');

    for (let i = 0; i < headers.length; i++) {
      const newTd = document.createElement('td');

      if (i === 4) {
        newTd.textContent =
          '$' + Number(allInputs[i].lastChild.value).toLocaleString('en-US');
        newTr.append(newTd);
        continue;
      }

      newTd.textContent = allInputs[i].lastChild.value;
      newTr.append(newTd);
    }

    if (isValid) {
      pushNotification('New employee added', 'Correct data', 'success');
      document.querySelector('tbody').append(newTr);
      rows.push(newTr);
    }
  });

  createdFormField.append(createdButton);
  document.body.append(createdFormField);
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
    createdElement.remove();
  }, 2000);
};

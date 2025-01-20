'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const form = createForm();
  const button = createButton('Save to table');
  const titlesList = document.querySelectorAll('thead th');
  const tbody = document.querySelector('tbody');
  let rows = Array.from(tbody.querySelectorAll('tr'));
  let order;
  let lastIndex = -1;

  body.appendChild(form);
  form.appendChild(button);
  addRowActive();

  titlesList.forEach((title, index) => {
    const label = createLabel(title.textContent);
    const inputType = index === 3 || index === 4 ? 'number' : 'text';
    const qaAttr = title.textContent.trim().toLowerCase();

    if (index !== 2) {
      const input = createInput(qaAttr, inputType, index);

      label.appendChild(input);
    } else {
      const select = createSelect(qaAttr);

      label.appendChild(select);
    }

    form.appendChild(label);
    title.addEventListener('click', () => handleTitleClick(index));
  });

  button.addEventListener('click', handleFormSubmit);

  function createForm() {
    const newForm = document.createElement('form');

    newForm.classList.add('new-employee-form');

    return newForm;
  }

  function createButton(text) {
    const newButton = document.createElement('button');

    newButton.textContent = text;

    return newButton;
  }

  function createLabel(text) {
    const label = document.createElement('label');

    label.textContent = `${text}:`;

    return label;
  }

  function createInput(inputName, type, index) {
    const input = document.createElement('input');

    input.setAttribute('name', inputName);
    input.setAttribute('type', type);
    input.setAttribute('data-qa', inputName);

    if (index === 0 || index === 1) {
      input.setAttribute('required', '');
    }

    return input;
  }

  function createSelect(selectName) {
    const select = document.createElement('select');

    select.setAttribute('name', selectName);
    select.setAttribute('data-qa', selectName);
    select.setAttribute('required', '');

    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    options.forEach((option) => {
      const opt = document.createElement('option');

      opt.textContent = option;
      select.appendChild(opt);
    });

    return select;
  }

  function handleTitleClick(index) {
    order = lastIndex !== index ? 'ASC' : order === 'ASC' ? 'DESC' : 'ASC';
    lastIndex = index;

    const dataType = index === 3 || index === 4 ? 'number' : 'text';

    sortTable(index, dataType, order);
    rows.forEach((row) => tbody.appendChild(row));
  }

  function sortTable(columnIndex, dataType, sortOrder) {
    rows.sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('td')[columnIndex].textContent.trim();
      const cellB = rowB.querySelectorAll('td')[columnIndex].textContent.trim();

      if (dataType === 'number') {
        return sortOrder === 'ASC'
          ? helper(cellA) - helper(cellB)
          : helper(cellB) - helper(cellA);
      } else {
        return sortOrder === 'ASC'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = getFormData();

    if (!validateFormData(formData)) {
      return;
    }

    const newRow = createTableRow(formData);

    tbody.appendChild(newRow);
    pushNotification('Success', 'New employee added successfully.', 'success');
    form.reset();
    rows = Array.from(tbody.querySelectorAll('tr'));
    addRowActive();
  }

  function getFormData() {
    const values = form.querySelectorAll('input, select');
    const formData = {};

    values.forEach((v) => (formData[v.name] = v.value.trim()));

    return formData;
  }

  function validateFormData(formData) {
    if (formData.name.length < 4) {
      pushNotification(
        'Error',
        'Name should be at least 4 characters.',
        'error',
      );

      return false;
    }

    if (!formData.position) {
      pushNotification('Error', 'Position is required.', 'error');

      return false;
    }

    const age = parseInt(formData.age, 10);

    if (isNaN(age) || age < 18 || age > 90) {
      pushNotification('Error', 'Age should be between 18 and 90.', 'error');

      return false;
    }

    if (!/^\d+$/.test(formData.salary)) {
      pushNotification('Error', 'Salary should be a valid number.', 'error');

      return false;
    }

    return true;
  }

  function createTableRow(formData) {
    const newRow = document.createElement('tr');

    Object.values(formData).forEach((data, index) => {
      const newCell = document.createElement('td');
      let value = data;

      if (index === 3) {
        value = Number(data);
      }

      if (index === 4) {
        value = `$${Number(data).toLocaleString('en-US')}`;
      }
      newCell.textContent = value;
      newRow.appendChild(newCell);
    });

    return newRow;
  }

  function pushNotification(title, description, type) {
    const message = document.createElement('div');

    message.className = `notification ${type}`;
    message.setAttribute('data-qa', 'notification');

    const messageTitle = document.createElement('h2');

    messageTitle.className = 'title';
    messageTitle.textContent = title;

    const notification = document.createElement('p');

    notification.textContent = description;

    message.appendChild(messageTitle);
    message.appendChild(notification);
    document.body.appendChild(message);

    setTimeout(() => message.remove(), 3000);
  }

  function addRowActive() {
    rows.forEach((row) => {
      row.addEventListener('click', () => {
        rows.forEach((r) => r.classList.remove('active'));
        row.classList.add('active');
      });
    });
  }

  function helper(string) {
    return Number(string.replace(/[^0-9.-]+/g, ''));
  }
});

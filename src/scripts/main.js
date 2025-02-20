'use strict';

const theadElement = document.querySelector('thead');
const tBodyItem = document.querySelector('tbody');

theadElement.addEventListener('click', (e) => {
  const touchedElement = e.target.closest('th');

  if (!touchedElement) {
    return;
  }

  const columnToRemoveFirstChar = 4;
  const indexCell = touchedElement.cellIndex;
  const rows = Array.from(tBodyItem.rows);

  const sortOrder = touchedElement.dataset.sortOrder === 'asc' ? 'desc' : 'asc';

  touchedElement.dataset.sortOrder = sortOrder;

  const sortedRows = rows.sort((rowA, rowB) => {
    let textA = rowA.cells[indexCell].textContent.trim();
    let textB = rowB.cells[indexCell].textContent.trim();

    if (indexCell === columnToRemoveFirstChar) {
      textA = Number(textA.slice(1).replaceAll(',', ''));
      textB = Number(textB.slice(1).replaceAll(',', ''));
    }

    if (typeof textA === 'string' && typeof textB === 'string') {
      return sortOrder === 'desc'
        ? textB.localeCompare(textA, 'en', { numeric: true })
        : textA.localeCompare(textB, 'en', { numeric: true });
    } else {
      return sortOrder === 'desc' ? textB - textA : textA - textB;
    }
  });

  tBodyItem.innerHTML = '';
  sortedRows.forEach((row) => tBodyItem.appendChild(row));
});

tBodyItem.addEventListener('click', (e) => {
  const closestItem = e.target.closest('tr');

  if (!closestItem) {
    return;
  }

  closestItem.classList.add('active');

  const activesItems = document.querySelectorAll('.active');

  [...activesItems].forEach((el) => {
    if (el !== closestItem) {
      el.classList.remove('active');
    }
  });
});

const formTitels = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function createForm() {
  const formItem = document.createElement('form');
  const buttonItem = document.createElement('button');

  formItem.classList.add('new-employee-form');

  for (let i = 0; i < formTitels.length; i++) {
    const inputItem = document.createElement('input');
    const labelItem = document.createElement('label');

    inputItem.setAttribute('name', formTitels[i].toLowerCase());

    if (formTitels[i] === 'Office') {
      const selectItem = document.createElement('select');

      selectItem.setAttribute('data-qa', formTitels[i].toLowerCase());
      selectItem.setAttribute('required', 'true');

      labelItem.textContent = formTitels[i];

      for (let j = 0; j < offices.length; j++) {
        const optionItem = document.createElement('option');

        optionItem.value = offices[j];
        optionItem.textContent = offices[j];

        selectItem.append(optionItem);
      }

      labelItem.append(selectItem);
      formItem.append(labelItem);

      continue;
    }

    if (formTitels[i] === 'Age' || formTitels[i] === 'Salary') {
      inputItem.setAttribute('type', 'number');
    } else {
      inputItem.setAttribute('type', 'text');
      // inputItem.setAttribute('pattern', '[A-Za-zА-Яа-яЁёІіЇїЄєs ]+');
    }

    inputItem.setAttribute('data-qa', formTitels[i].toLowerCase());
    labelItem.textContent = formTitels[i];
    labelItem.append(inputItem);
    formItem.append(labelItem);
  }

  buttonItem.textContent = 'Save to table';
  formItem.append(buttonItem);
  document.body.append(formItem);
}

createForm();

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll('[data-qa]');
  const trItem = document.createElement('tr');

  if (!inputs) {
    return;
  }

  for (let i = 0; i < inputs.length; i++) {
    if (formTitels[i] === 'Name') {
      if (inputs[i].value === '') {
        showNotification('Error', '.....', 'error');

        return;
      }

      if (!isNaN(inputs[i].value)) {
        showNotification('Error', 'Name should not be a number!', 'error');

        return;
      }

      if (inputs[i].value.length < 4) {
        showNotification('Error', 'Name length must be longer than 3', 'error');

        return;
      }
    }

    if (formTitels[i] === 'Age') {
      if (inputs[i].value === '') {
        showNotification('Error', '.....', 'error');

        return;
      }

      if (inputs[i].value < 18 || inputs[i].value > 90) {
        showNotification('Error', 'Age must be between 18 and 90', 'error');

        return;
      }
    }

    if (formTitels[i] === 'Position') {
      if (inputs[i].value === '') {
        showNotification('Error', '.....', 'error');

        return;
      }

      if (!isNaN(inputs[i].value)) {
        showNotification('Error', 'Position should not be a number!', 'error');

        return;
      }

      if (!inputs[i].value || inputs[i].value.length < 3) {
        showNotification('Error', 'Invalid position input!', 'error');

        return;
      }
    }

    const tdItem = document.createElement('td');

    if (formTitels[i] === 'Salary') {
      tdItem.textContent = `$${Number(inputs[i].value).toLocaleString('en-US')}`;
    } else {
      tdItem.textContent = inputs[i].value;
    }

    trItem.append(tdItem);
  }

  for (let i = 0; i < formTitels.length; i++) {
    inputs[i].value = '';
  }

  tBodyItem.append(trItem);

  showNotification('Success', 'Person successfully added to table', 'success');
});

function showNotification(type, message, className) {
  const messageItem = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  messageTitle.textContent = type;
  messageDescription.textContent = message;

  messageItem.classList.add('notification', className);
  messageItem.setAttribute('data-qa', 'notification');

  messageItem.append(messageTitle, messageDescription);
  document.body.append(messageItem);

  setTimeout(() => {
    messageItem.remove();
  }, 4000);
}

'use strict';

// write code here
const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const tablerows = document.querySelectorAll('tbody tr');
const tablerowsArray = Array.from(tablerows);

const offices = [`Tokyo`, `Singapore`,
  `London`, `New York`, `Edinburgh`, `San Francisco`];

const formFields = {
  'name': 'text',
  'position': 'text',
  'office': 'select',
  'age': 'number',
  'salary': 'number',
};

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let listOrder = true;

table.addEventListener('click', function(evt) {
  evt.preventDefault();

  if (evt.target.tagName === 'TH') {
    const clickCol = evt.target.cellIndex + 1;

    const sorted = tablerowsArray.sort((a, b) => {
      const itemOne = a.querySelector(`td:nth-child(${clickCol}`).innerHTML;
      const itemTwo = b.querySelector(`td:nth-child(${clickCol}`).innerHTML;

      if (listOrder === true) {
        return itemOne.localeCompare(itemTwo, 'en', { numeric: 'true' });
      }

      if (listOrder === false) {
        return itemTwo.localeCompare(itemOne, 'en', { numeric: 'true' });
      }
    });

    listOrder = !listOrder;

    sorted.forEach(row => {
      tableBody.appendChild(row);
    });
  }

  if (evt.target.tagName === 'TD') {
    evt.stopPropagation();
    tablerows.forEach(rowClass => rowClass.classList.remove('active'));
    evt.target.parentNode.classList = 'active';
    evt.target.contentEditable = true;
  }
});

// form

const form = document.createElement('form');

form.classList.add(`new-employee-form`);

for (const value in formFields) {
  const newEntry = document.createElement('label');

  newEntry.textContent = capitalise(value);
  newEntry.for = value;
  form.appendChild(newEntry);

  const newInput = document.createElement('input');

  newInput.setAttribute('data-qa', value);
  newInput.type = formFields[value];
  newInput.name = value;
  newEntry.appendChild(newInput);

  if (formFields[value] === 'select') {
    newInput.remove();

    const officeSelect = document.createElement('select');

    officeSelect.name = 'office';
    officeSelect.setAttribute('data-qa', value);

    offices.forEach(office => {
      const newOffice = document.createElement('option');

      newOffice.value = office;
      newOffice.textContent = office;
      officeSelect.appendChild(newOffice);
    });

    newEntry.appendChild(officeSelect);
    form.appendChild(newEntry);
  }
}

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
button.classList.add('button__select');

form.appendChild(button);

table.insertAdjacentElement('afterend', form);

const formFilled = document.querySelector('.new-employee-form');

formFilled.addEventListener('submit', function(evt) {
  evt.preventDefault();

  const formData = new FormData(evt.target);
  const rowToInsert = document.createElement('tr');
  const enteredName = formData.get('name');
  const enteredAge = formData.get('age');
  const enteredPosition = formData.get('position');

  rowToInsert.setAttribute('data-qa', 'success');

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  notificationTitle.classList.add('title');

  let message = 'All field are correct and the table will be updated';
  let messageClass = 'success';

  if (enteredName.length < 4) {
    message = 'Text entries must be longer than four characters in length';
    messageClass = 'error';
  }

  if (enteredPosition <= 0) {
    message = 'Position must be entered';
    messageClass = 'error';
  }

  if (enteredAge < 18 || enteredAge > 90) {
    message = 'Age entry must be between 18 years and 90 years';
    messageClass = 'error';
  }

  notificationTitle.textContent = message;
  notification.classList.add(messageClass);
  notification.append(notificationTitle);
  form.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);

  if (messageClass === 'success') {
    for (const entry of formData) {
      const dataToInsert = document.createElement('td');

      if (entry[0] === 'salary') {
        entry[1] = '$' + Number(entry[1]).toLocaleString();
      }

      dataToInsert.textContent = capitalise(entry[1]);
      rowToInsert.appendChild(dataToInsert);
    }

    tableBody.appendChild(rowToInsert);
    tablerowsArray.push(rowToInsert);

    evt.target.reset();
  }
});

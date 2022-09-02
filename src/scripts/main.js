'use strict';

const table = document.querySelector('table');
const headers = document.querySelectorAll('thead > tr > th');
const sortTable = (e) => {
  let rows = document.querySelectorAll('tbody > tr');

  for (let i = 0; i < 5; i++) {
    if (e.target === headers[i]) {
      rows = [...rows].sort((a, b) => {
        let dataA = a.querySelectorAll('td')[i].innerText;
        let dataB = b.querySelectorAll('td')[i].innerText;

        if (e.target.innerText === 'Age') {
          return e.target.isSorted
            ? +dataB - +dataA : +dataA - +dataB;
        }

        if (e.target.innerText === 'Salary') {
          dataA = parseFloat(dataA.slice(1));
          dataB = parseFloat(dataB.slice(1));

          return e.target.isSorted
            ? +dataB - +dataA : +dataA - +dataB;
        }

        return e.target.isSorted
          ? dataB.localeCompare(dataA) : dataA.localeCompare(dataB);
      });
    }
  }

  for (const row of rows) {
    document.querySelector('tbody').append(row);
  }

  if (e.target.isSorted) {
    e.target.isSorted = false;
  } else {
    e.target.isSorted = true;
  }

  for (const header of headers) {
    if (header !== e.target) {
      header.isSorted = false;
    }
  }
};

table.addEventListener('click', sortTable);

document.querySelector('table').addEventListener('click', e => {
  const rows = document.querySelectorAll('tbody > tr');

  for (const row of rows) {
    if (e.target.closest('tr') === row) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  }
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const formFields = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const cities
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

function createOptions(data, element) {
  for (let i = 0; i < data.length; i++) {
    const option = document.createElement('option');

    option.value = data[i].toLocaleLowerCase();
    option.innerText = data[i];
    element.append(option);
  }
}

for (let i = 0; i < 5; i++) {
  const label = document.createElement('label');
  let input = document.createElement('input');

  label.innerText = formFields[i] + ':';
  input.type = 'text';

  if (formFields[i] === 'Age' || formFields[i] === 'Salary') {
    input.type = 'number';
  }

  if (formFields[i] === 'Office') {
    input = document.createElement('select');
    createOptions(cities, input);
  }
  input.dataset.qa = formFields[i].toLocaleLowerCase();
  input.name = formFields[i].toLocaleLowerCase();
  input.required = true;
  input.id = formFields[i].toLocaleLowerCase();
  label.htmlFor = input.id;

  label.append(input);
  form.append(label);
}

const button = document.createElement('button');

button.innerText = 'Save to table';
button.formMethod = 'POST';
button.type = 'submit';

form.append(button);

document.body.append(form);

button.addEventListener('click', e => {
  e.preventDefault();

  const newRow = document.createElement('tr');
  const data = new FormData(form);

  if (data.get('name').length < 4) {
    pushNotification(
      'Name is too short. Minimal name length is 4 letter.', 'error'
    );

    return;
  } else if (+data.get('age') > 90 || +data.get('age') < 18) {
    pushNotification('Аge must be between 18 and 90 years old', 'error');

    return;
  }

  if (data.get('position') === '' || data.get('salary') === '') {
    pushNotification('Fill in all fields of the form', 'error');

    return;
  }

  for (let i = 0; i < formFields.length; i++) {
    const newData = document.createElement('td');

    if (formFields[i].toLocaleLowerCase() === 'salary') {
      newData.innerText = '$' + (+data.get(formFields[i].toLocaleLowerCase()))
        .toLocaleString('en-US');
    } else {
      newData.innerText
        = cpitalizeIt(data.get(formFields[i].toLocaleLowerCase()));
    }

    newRow.append(newData);
  }

  pushNotification(
    'New employee is successfully added to the table.', 'success'
  );

  table.querySelector('tbody').append(newRow);
});

function cpitalizeIt(text) {
  let result = text.slice(0, 1).toUpperCase();

  for (let i = 1; i < text.length; i++) {
    if (text[i - 1] === ' ') {
      result += ' ' + text[i].toLocaleUpperCase();
    } else {
      result += text[i];
    }
  }

  return result;
};

const pushNotification = (description, type) => {
  // write code here
  const notification = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const message = document.createElement('p');
  let title = '';

  switch (type) {
    case 'error':
      title = 'Error!';
      break;
    case 'success':
      title = 'Done!';
      break;
    default:
      title = 'Try again.';
  }

  notification.classList.add('notification');
  notification.classList.add(type);
  messageTitle.className = 'title';
  messageTitle.innerText = title;
  message.innerText = description;

  notification.style.bottom = `10px`;
  notification.style.right = `10px`;
  notification.append(messageTitle);
  notification.append(message);
  notification.dataset.qa = 'notification';

  document.body.append(notification);

  setTimeout(() => {
    notification.hidden = true;
  }, 2000);
};

for (const cell of document.querySelectorAll('td')) {
  cell.addEventListener('dblclick', e => {
    const newInput = document.createElement('input');
    const initialValue = e.target.innerText;

    newInput.className = 'cell-input';
    newInput.type = 'text';
    newInput.value = e.target.innerText;
    e.target.innerText = '';

    e.target.append(newInput);
    newInput.focus();

    newInput.addEventListener('blur', ev => {
      if (newInput.value !== '') {
        cell.innerText = newInput.value;
      } else {
        cell.innerText = initialValue;
      }
      ev.target.remove();
    });

    newInput.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && newInput.value !== '') {
        cell.innerText = newInput.value;
      } else if (ev.key === 'Enter') {
        cell.innerText = initialValue;
      }
    });
  });
}

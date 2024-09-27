'use strict';

const table = document.querySelector('table');
const thElements = document.querySelectorAll('th');
const trElements = document.querySelectorAll('tr');
const thText = [...thElements].map((element) => element.firstChild);
const clickCount = {};

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.innerHTML = `<h2 class='title'>${title}</h2><p>${description}</p>`;

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const formHTML = document.createElement('form');

formHTML.className = 'new-employee-form';
formHTML.setAttribute('onsubmit', '{return false;}');

function createElement(type, props) {
  const element = document.createElement(type);

  Object.keys(props).forEach((key) => {
    if (key === 'dataset') {
      Object.keys(props[key]).forEach((dataKey) => {
        return element.setAttribute(`data-${dataKey}`, props[key][dataKey]);
      });
    } else {
      element[key] = props[key];
    }
  });

  return element;
}

const offices = [
  { value: 'Tokyo', textContent: 'Tokyo' },
  { value: 'Singapore', textContent: 'Singapore' },
  { value: 'London', textContent: 'London' },
  { value: 'New York', textContent: 'New York' },
  { value: 'Edinburgh', textContent: 'Edinburgh' },
  { value: 'San Francisco', textContent: 'San Francisco' },
];

const nameLabel = createElement('label', { textContent: 'Name:' });
const nameInput = createElement('input', {
  name: 'Name',
  dataset: { qa: 'name' },
  type: 'text',
  required: true,
});

nameLabel.appendChild(nameInput);
formHTML.appendChild(nameLabel);

const positionLabel = createElement('label', { textContent: 'Position:' });
const positionInput = createElement('input', {
  name: 'Position',
  dataset: { qa: 'position' },
  type: 'text',
  required: true,
});

positionLabel.appendChild(positionInput);
formHTML.appendChild(positionLabel);

const officeLabel = createElement('label', { textContent: 'Office:' });
const officeSelect = createElement('select', {
  name: 'Office',
  dataset: { qa: 'office' },
  required: true,
});

offices.forEach((option) => {
  const createOption = createElement('option', option);

  officeSelect.appendChild(createOption);
});

officeLabel.appendChild(officeSelect);
formHTML.appendChild(officeLabel);

const ageLabel = createElement('label', { textContent: 'Age:' });
const ageInput = createElement('input', {
  name: 'Age',
  dataset: { qa: 'age' },
  type: 'number',
  required: true,
});

ageLabel.appendChild(ageInput);
formHTML.appendChild(ageLabel);

const salaryLabel = createElement('label', { textContent: 'Salary:' });
const salaryInput = createElement('input', {
  name: 'Salary',
  dataset: { qa: 'salary' },
  type: 'number',
  required: true,
});

salaryLabel.appendChild(salaryInput);
formHTML.appendChild(salaryLabel);

const formButton = createElement('button', {
  type: 'submit',
  textContent: 'Save to table',
});

formHTML.appendChild(formButton);

table.insertAdjacentHTML('afterend', formHTML.outerHTML);

const form = document.querySelector('form');

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');
  const tr = e.target.closest('tr');

  let indexColumn;
  let rows = [];

  for (const row of table.rows) {
    rows.push([...row.cells].map((element) => element.innerHTML));
  }

  if (e.target.tagName === 'TD') {
    trElements.forEach((element) => element.classList.remove('active'));
    tr.classList.add('active');
  }

  if (th) {
    indexColumn = thText.indexOf(th.firstChild);

    if (!clickCount[indexColumn]) {
      clickCount[indexColumn] = 0;
    }

    if (clickCount[indexColumn] === 2) {
      clickCount[indexColumn] = 0;
    }

    clickCount[indexColumn]++;
  } else {
    return;
  }

  rows = rows
    .slice(1, -1)
    .map((row) => {
      return row.map((element) => {
        if (element.includes('$')) {
          return Number(element.slice(1).replace(',', ''));
        }

        return +element ? +element : element;
      });
    })
    .sort((a, b) => {
      if (clickCount[indexColumn] === 1) {
        if (typeof a[indexColumn] === 'number') {
          return a[indexColumn] - b[indexColumn];
        }

        return a[indexColumn].localeCompare(b[indexColumn]);
      } else {
        if (typeof a[indexColumn] === 'number') {
          return b[indexColumn] - a[indexColumn];
        }

        return b[indexColumn].localeCompare(a[indexColumn]);
      }
    })
    .map((row) => {
      return row.map((element) => {
        if (row.indexOf(element) === 4) {
          return '$' + element.toLocaleString();
        }

        return String(element);
      });
    });

  for (let i = 0; i < rows.length; i++) {
    for (let cell = 0; cell < table.rows[i + 1].cells.length; cell++) {
      table.rows[i + 1].cells[cell].innerHTML = rows[i][cell];
    }
  }
});

form.addEventListener('click', (e) => {
  const button = e.target.closest('button');

  if (!button) {
    return;
  }

  button.type = 'submit';

  const formData = new FormData(form);
  const userData = {};

  for (const [key, value] of formData.entries()) {
    if (key === 'Salary') {
      userData[key] = '$' + Number(value).toLocaleString();
    } else {
      userData[key] = value;
    }
  }

  function validateForm(data) {
    if (data['Name'].length < 4) {
      pushNotification(
        10,
        10,
        'Error',
        'Name value has less than 4 letters.',
        'error',
      );

      return false;
    }

    if (data['Age'] < 18 || data['Age'] > 90) {
      pushNotification(
        10,
        10,
        'Error',
        'Age value is less than 18 or more than 90',
        'error',
      );

      return false;
    }

    if (Object.values(data).indexOf('') !== -1) {
      pushNotification(10, 10, 'Error', 'Field with invalid input', 'error');

      return false;
    }

    pushNotification(
      10,
      10,
      'Success',
      'A new employee is successfully added to the table',
      'success',
    );

    return true;
  }

  if (validateForm(userData)) {
    button.type = 'reset';

    table.rows[table.rows.length - 2].insertAdjacentHTML(
      'afterend',
      `<tr><td>${userData['Name']}</td><td>${userData['Position']}</td><td>${userData['Office']}</td><td>${userData['Age']}</td><td>${userData['Salary']}</td></tr>`,
    );
  }
});

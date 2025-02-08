'use strict';

const table = document.querySelector('table');
const rows = document.querySelectorAll('table tbody tr');
const form = document.createElement('form');
const arrOfHeaders = [...table.children[0].children[0].children];
const people = [];
const addButton = document.createElement('button');
let previousTarget;
let currentSortType = 'DESC';
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function buildPeople() {
  people.length = 0;

  for (let i = 0; i < rows.length; i++) {
    people.push({
      name: rows[i].querySelectorAll('td')[0].textContent.trim(),
      position: rows[i].querySelectorAll('td')[1].textContent.trim(),
      office: rows[i].querySelectorAll('td')[2].textContent.trim(),
      age: rows[i].querySelectorAll('td')[3].textContent.trim(),
      salary: rows[i].querySelectorAll('td')[4].textContent.trim(),
    });
  }
}

function sortTable(header, previous, target, array) {
  switch (header) {
    case 'office':
    case 'name':
    case 'position':
      if (currentSortType === 'ASC' && previous === target) {
        array.sort((a, b) => {
          return b[header].localeCompare(a[header]);
        });
        currentSortType = 'DESC';
      } else {
        array.sort((a, b) => {
          return a[header].localeCompare(b[header]);
        });
        currentSortType = 'ASC';
      }
      break;
    case 'age':
      if (currentSortType === 'ASC' && previousTarget === target) {
        people.sort((a, b) => {
          return b[header] - a[header];
        });
        currentSortType = 'DESC';
      } else {
        people.sort((a, b) => {
          return a[header] - b[header];
        });
        currentSortType = 'ASC';
      }
      break;

    case 'salary':
      if (currentSortType === 'ASC' && previousTarget === target) {
        people.sort((a, b) => {
          return (
            b[header].replace('$', '').replace(',', '') -
            a[header].replace('$', '').replace(',', '')
          );
        });
        currentSortType = 'DESC';
      } else {
        people.sort((a, b) => {
          return (
            a[header].replace('$', '').replace(',', '') -
            b[header].replace('$', '').replace(',', '')
          );
        });
        currentSortType = 'ASC';
      }
  }
}

function arrPrinter(arr) {
  document.querySelector('table tbody').remove();

  const tbody = document.createElement('tbody');

  for (let i = 0; i < people.length; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < arrOfHeaders.length; j++) {
      const td = document.createElement('td');

      td.textContent = Object.values(people[i])[j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.insertBefore(tbody, document.querySelector('table tfoot'));

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].querySelectorAll('td').length; j++) {
      rows[i].querySelectorAll('td')[j].textContent = Object.values(people[i])[
        j
      ];
    }
  }
  addClass();
}

function addClass() {
  [...table.rows].splice(1, table.rows.length - 2).forEach((item, i, arr) => {
    item.addEventListener('click', (e) => {
      arr.forEach((elem) => {
        elem.classList.remove('active');
      });
      item.classList.add('active');
    });
  });
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const header = document.createElement('h2');
  const content = document.createElement('p');

  notification.appendChild(header);
  notification.appendChild(content);

  notification.classList.add('notification', type);
  header.classList.add('title');

  content.innerText = description;
  header.innerText = title;

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.hidden = true;
  }, 2000);
}

buildPeople();
addClass();
sortTable();
arrPrinter(people);

arrOfHeaders.forEach((item) => {
  item.addEventListener('click', (e) => {
    const crytery = e.target.textContent.toLowerCase();

    sortTable(crytery, previousTarget, e.target, people);
    previousTarget = e.target;
    arrPrinter(people);
  });
});

for (let i = 0; i < Object.keys(people[0]).length; i++) {
  const label = document.createElement('label');

  label.textContent = arrOfHeaders[i].textContent + ':';
  label.setAttribute('data-qa', Object.keys(people[0])[i]);

  if (Object.keys(people[0])[i] === 'office') {
    const select = document.createElement('select');

    select.name = 'office';

    for (const office of offices) {
      const option = document.createElement('option');

      option.textContent = office;
      select.appendChild(option);
    }
    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    if (
      Object.keys(people[0])[i] === 'salary' ||
      Object.keys(people[0])[i] === 'age'
    ) {
      input.type = 'number';
    } else {
      input.type = 'text';
    }
    input.setAttribute('required', true);
    input.name = Object.keys(people[0])[i];
    label.appendChild(input);
  }
  form.appendChild(label);
}

form.classList.add('new-employee-form');
form.id = 'form';
addButton.textContent = 'Add to table';
form.appendChild(addButton);
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newPerson = {};

  if (
    formData.get('name').length < 4 ||
    formData.get('age') < 18 ||
    formData.get('age') > 90
  ) {
    pushNotification(
      10,
      10,
      'Error',
      'You inputed invalid data.\n ' + 'Please change something and try again.',
      'error',
    );
  } else {
    for (const key of Object.keys(people[0])) {
      newPerson[key] = formData.get(key);

      if (key === 'salary') {
        newPerson[key] = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(newPerson[key]);

        newPerson[key] = newPerson[key]
          .split('')
          .splice(0, newPerson[key].length - 3)
          .join('');
      }
    }

    pushNotification(
      10,
      10,
      'Success',
      'Great!\n ' + 'Employee successfully added.',
      'success',
    );
    people.push(newPerson);
    arrPrinter(people);
    form.reset();
  }
});

[...document.querySelectorAll('table tbody td')].forEach((item, i, arr) => {
  item.addEventListener('dblclick', (e) => {
    arr.forEach((elem) => {
      elem.classList.remove('cell-input');
    });

    const input = document.createElement('input');
    const previousContent = item.textContent;

    input.classList.add('cell-input');
    item.textContent = '';
    item.appendChild(input);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();

        if (input.value === '') {
          item.textContent = previousContent;
        } else {
          item.textContent = input.value;
        }
        item.removeChild(input);
        buildPeople();
      }
    });
  });
});

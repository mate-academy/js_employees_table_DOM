'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const thThead = [...thead.querySelectorAll('th')];
const form = document.createElement('form');
const notification = document.createElement('div');
const title = document.createElement('h1');
const massage = document.createElement('p');
const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;
const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
  'Kharkov',
];
const citySelection = OFFICES.map(
  (office) => `<option value="${office}"> ${office} </option>`,
).join('');

let currentSortColumn = null;
let isAscending = true;

form.action = '/';
form.method = 'POST';
form.dataset.qa = 'new-employee-form';
form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name:
    <input name="name" type="text" data-qa="name" />
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position" />
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      ${citySelection}
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age" />
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" />
  </label>
  <button type="button">Save to table</button>
`;
body.appendChild(form);

const button = document.querySelector('button');

function parseValue(value) {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const number = Number(cleaned);

  return cleaned === '' || Number.isNaN(number) ? value : number;
}

// eslint-disable-next-line no-shadow
thead.addEventListener('click', (event) => {
  const tr = [...tbody.querySelectorAll('tr')];
  const sorting = event.target.closest('th');
  const indexSorting = thThead.indexOf(sorting);
  const columnIndex = sorting.cellIndex;

  if (currentSortColumn === columnIndex) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = columnIndex;
    isAscending = true;
  }

  if (!sorting) {
    return;
  }

  tr.sort((element1, element2) => {
    const a = parseValue(element1.children[indexSorting].textContent.trim());
    const b = parseValue(element2.children[indexSorting].textContent.trim());

    if (isAscending === true) {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }

      return a.localeCompare(b);
    }

    if (isAscending === false) {
      if (typeof a === 'number' && typeof b === 'number') {
        return b - a;
      }

      return b.localeCompare(a);
    }
  }).forEach((element) => tbody.appendChild(element));
});

// Add highlighting to the selected row
// eslint-disable-next-line no-shadow
tbody.addEventListener('click', (event) => {
  const anotherString = tbody.querySelector('.active');
  const string = event.target.closest('tr');

  if (anotherString) {
    anotherString.classList.toggle('active');
  }
  string.className = 'active';
});

// Add ability to edit row cells
// eslint-disable-next-line no-shadow
tbody.addEventListener('dblclick', (event) => {
  const selectedСell = event.target.closest('td');
  const initialText = selectedСell.textContent;
  const input = document.createElement('input');

  if (!selectedСell || selectedСell.querySelector('.cell-input')) {
    return;
  }

  input.classList.add('cell-input');
  input.value = initialText;

  selectedСell.textContent = '';
  selectedСell.append(input);
  input.focus();

  const save = () => {
    const value = input.value.trim();

    selectedСell.textContent = value === '' ? initialText : value;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});

notification.setAttribute('data-qa', 'notification');
notification.className = 'notification';
notification.classList.toggle('success');
notification.style.display = 'none';

title.className = 'title';
title.innerText = 'success';

massage.classList = 'success';
massage.innerText = 'This is a success';

notification.appendChild(title);
notification.appendChild(massage);
body.appendChild(notification);

button.onclick = () => {
  const dateNewPosition = [...document.querySelectorAll('[name]')];
  const tr = document.createElement('tr');

  notification.style.display = 'none';
  dateNewPosition.shift();

  if (
    dateNewPosition[0].value.length >= MIN_NAME_LENGTH &&
    dateNewPosition[1].value &&
    dateNewPosition[2].value &&
    dateNewPosition[3].value > MIN_AGE &&
    dateNewPosition[3].value <= MAX_AGE &&
    dateNewPosition[4].value
  ) {
    dateNewPosition.forEach((element) => {
      const td = document.createElement('td');

      if (element.getAttribute('name') === 'salary') {
        const salary = String(element.value);

        td.innerText =
          '$' +
          salary.slice(0, salary.length - 3) +
          ',' +
          salary.slice(salary.length - 3, salary.length);
      } else {
        td.innerText = element.value;
      }

      tr.appendChild(td);
    });
  } else {
    title.innerText = 'error';

    if (notification.className.includes('success')) {
      notification.classList.toggle('success');
      notification.classList.toggle('error');
    }

    notification.style.display = 'block';

    // checking the length of a name
    if (dateNewPosition[0].value.length < MIN_NAME_LENGTH) {
      massage.innerText = 'Short name. It is worth giving a full name';
      process.exit();
    } else {
      // checking the age
      if (
        dateNewPosition[3].value < MIN_AGE ||
        dateNewPosition[3].value >= MAX_AGE
      ) {
        massage.innerText = 'Age does not match';
        process.exit();
      }
    }
  }
  form.reset();

  tbody.appendChild(tr);
};

'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const thThead = [...thead.querySelectorAll('th')];
const form = document.createElement('form');
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
      <option value="Tokyo" selected>Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
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

  // console.log(columnIndex);

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

  if (anotherString === string) {
    const arrayOfOutputFields = [...document.querySelectorAll('[name]')];
    const stringElements = [...string.querySelectorAll('td')];
    const cell = event.target.closest('td');
    const initialText = cell.textContent;
    const input = document.createElement('input');

    if (!cell || cell.querySelector('.cell-input')) {
      return;
    }

    const save = () => {
      const value = input.value.trim();

      cell.textContent = value === '' ? initialText : value;
    };

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        input.blur();
      }
    });

    string.remove();

    // console.log('lets go doing');
    // console.log(string);

    // eslint-disable-next-line no-undef
    arrayOfOutputFields.shift();

    for (let i = 0; i < arrayOfOutputFields.length; i++) {
      // console.log(arrayOfOutputFields[i]);
      // console.log(stringElements[i].innerText);

      if (arrayOfOutputFields[i].type === 'number') {
        arrayOfOutputFields[i].value = parseValue(stringElements[i].innerText);
      } else {
        arrayOfOutputFields[i].value = stringElements[i].innerText;
      }
    }
  }

  // console.log(anotherString);

  if (anotherString) {
    anotherString.classList.toggle('active');
  }
  string.className = 'active';
});

const notification = document.createElement('div');
const title = document.createElement('h1');
const massage = document.createElement('p');

button.onclick = () => {
  const dateNewPosition = [...document.querySelectorAll('[name]')];
  const tr = document.createElement('tr');

  notification.setAttribute('data-qa', 'notification');
  notification.className = 'notification';
  notification.classList.toggle('success');

  title.className = 'title';
  title.innerText = 'success';

  massage.classList = 'success';
  massage.innerText = 'This is a success';

  dateNewPosition.shift();

  if (
    dateNewPosition[0].value.length >= 4 &&
    dateNewPosition[1].value &&
    dateNewPosition[2].value &&
    dateNewPosition[3].value >= 18 &&
    dateNewPosition[3].value < 90 &&
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
        // element.value = '';
      }

      tr.appendChild(td);
    });
  } else {
    // checking the length of a name
    if (dateNewPosition[0].length < 4) {
      notification.classList.toggle('success');
      notification.classList.toggle('error');
      title.innerText = 'error';
      massage.innerText = 'Короткое имя. Стоит дать полное имя';
    }

    // checking the age
    if (dateNewPosition[3].value >= 18 || dateNewPosition[3].value < 90) {
      notification.classList.toggle('success');
      notification.classList.add('error');
      title.innerText = 'error';
      massage.innerText = 'Возрост не соответствует';
    }
  }

  form.reset();

  notification.appendChild(title);
  notification.appendChild(massage);
  tbody.appendChild(tr);
  body.appendChild(notification);
};

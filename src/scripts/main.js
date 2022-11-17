'use strict';

const table = document.querySelector('table');

let count = 1;
let target = {};

table.tHead.addEventListener('click', (happening) => {
  const item = happening.target;
  const cell = item.cellIndex;
  const row = [];

  for (let i = 1; i < table.rows.length - 1; i++) {
    const cellValuesArray = [];

    for (let j = 0; j < table.rows[0].cells.length; j++) {
      const valueOfCell = table.rows[i].cells[j].innerText;

      cellValuesArray.push(valueOfCell);
    }

    row.push(cellValuesArray);
  }

  if (target.innerText !== item.innerText) {
    count = 1;
  }

  row.sort((a, b) => {
    const ifIncludeNumber = convertToNumber(a[cell]);

    return ifIncludeNumber
      ? count % 2 === 1
        ? convertToNumber(a[cell]) - convertToNumber(b[cell])
        : convertToNumber(b[cell]) - convertToNumber(a[cell])
      : count % 2 === 1
        ? a[cell].localeCompare(b[cell])
        : b[cell].localeCompare(a[cell]);
  });

  for (let i = 1; i < table.rows.length - 1; i++) {
    const itemCell = table.rows[i].cells;

    [...itemCell].forEach((el, indexOfEl) => {
      el.innerText = row[i - 1][indexOfEl];
    });
  }
  count++;
  target = item;
});

table.tBodies[0].addEventListener('click', (happening) => {
  const item = happening.target.closest('tr');

  [...table.tBodies[0].children].forEach(el => el.classList.remove('active'));
  item.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

document.querySelector('body').append(form);

const nameAndTypeOfFormItem = [['name', 'text'],
  ['position', 'text'],
  ['age', 'number'],
  ['salary', 'number']];

form.innerHTML = nameAndTypeOfFormItem.map(item => `
  <label>${capitalized(item[0])}: 
  <input name=${item[0]} type=${item[1]} data-qa=${item[0]} required>
  </label>
`).join('');

const select = document.createElement('label');

form.children[1].after(select);

const valueOfSelectOptions
= [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

select.innerHTML = `Office:
<select name='office' data-qa='office' required>
${valueOfSelectOptions.map(item => `<option value=${item}>${item}</option>
`)}
</select>
`;

const button = document.createElement('button');

button.innerText = 'Save to table';
button.setAttribute('type', 'submit');
form.append(button);

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  if (form.children[0].childNodes[1].value.length < 4) {
    pushNotification(10, 10, 'Error!',
      'Name must be longer than three characters', 'error');

    return;
  }

  if (form.children[3].childNodes[1].value < 18
    || form.children[3].childNodes[1].value > 90) {
    pushNotification(10, 10, 'Error!',
      'Sorry, but the age value does not fit. Value must be between 18 and 90',
      'error');

    return;
  }

  const row = table.tBodies[0].insertRow();

  for (let i = 0; i < table.rows[0].cells.length; i++) {
    const cell = document.createElement('td');

    cell.innerText = form.children[i].childNodes[1].name === 'salary'
      ? '$'
        + Number(form.children[i].childNodes[1].value).toLocaleString('en-US')
      : form.children[i].childNodes[1].value;
    row.append(cell);
  }

  form.reset();

  pushNotification(10, 10, 'Success!',
    'Employee has been added to the list!', 'success');
});

table.tBodies[0].addEventListener('dblclick', (happening) => {
  const cellsList = document.querySelectorAll('td');

  [...cellsList].forEach(el => {
    if (el.children[0]) {
      el.children[0].remove();
    }
  });

  const item = happening.target.closest('td');
  const itemOldValue = item.innerText;
  const input = document.createElement('input');

  input.className = 'cell-input';

  const cellIndex = item.cellIndex;

  if (table.rows[0].cells[cellIndex].innerText === 'Salary'
  || table.rows[0].cells[cellIndex].innerText === 'Age') {
    input.type = 'number';
  }
  item.innerText = '';

  item.appendChild(input);
  input.focus();

  input.addEventListener('blur', (ev) => {
    const i = ev.target.closest('td');

    if ((input.value < 18
      || input.value > 90)
      && table.rows[0].cells[cellIndex].innerText === 'Age') {
      pushNotification(10, 10, 'Error!',
        'Sorry, but the age value does not fit.'
        + 'Value must be between 18 and 90. Try again!',
        'error');

      input.value = '';
    }

    if (input.value.length < 4
      && table.rows[0].cells[cellIndex].innerText === 'Name') {
      pushNotification(10, 10, 'Error!',
        'Name must be longer than three characters. Try again!', 'error');

      input.value = '';
    }

    i.innerText = !input.value
      ? itemOldValue
      : table.rows[0].cells[cellIndex].innerText === 'Salary'
        ? '$'
        + Number(input.value).toLocaleString('en-US')
        : input.value;
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
      input.blur();
    }
  });
});

function convertToNumber(string) {
  let filterResult = '';

  for (const char of string) {
    if (isFinite(char)) {
      filterResult += char;
    }
  }

  return Number(filterResult);
}

function capitalized(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function pushNotification(posTop, posRight, title, description, type) {
  const message = document.createElement('div');

  message.classList.add('notification', `${type}`);

  document.querySelector('body').append(message);

  message.style.top = `${posTop}` + 'px';
  message.style.right = `${posRight}` + 'px';
  message.dataset.qa = 'notification';
  message.style.position = 'fixed';

  message.innerHTML = `<h2 class = "title">${title}</h2>\n
  <p>${description}</p>`;
  setTimeout(() => message.remove(), 2000);
};

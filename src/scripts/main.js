'use strict';

const tbody = document.querySelector('tbody');
const table = document.querySelector('table');
const th = document.querySelectorAll('th');
let previous = '';

for (const cell of th) {
  cell.setAttribute('data-Asc', true);
}

function toNumber(string) {
  const number = string.slice(1).split('').filter(el => el !== ',').join('');

  return +number;
}

function stringCompare(a, b, child) {
  const result
  = a.children[child].textContent.localeCompare(b.children[child].textContent);

  return result;
}

const sort = (ev) => {
  const tr = document.querySelectorAll('tr');
  const tableContent = [...tr].slice(1, tr.length - 1);
  const targetDataAtr = ev.target.dataset.asc;

  tbody.innerHTML = '';

  if (targetDataAtr === 'true'
  || (targetDataAtr === 'false' && previous !== ev.target.innerText)) {
    switch (ev.target.innerText) {
      case 'Name':
        tableContent.sort((a, b) =>
          stringCompare(a, b, 0)
        );
        break;
      case 'Position':
        tableContent.sort((a, b) =>
          stringCompare(a, b, 1)
        );
        break;
      case 'Office':
        tableContent.sort((a, b) =>
          stringCompare(a, b, 2)
        );
        break;
      case 'Age':
        tableContent.sort((a, b) =>
          a.children[3].textContent - b.children[3].textContent
        );
        break;
      case 'Salary':
        tableContent.sort((a, b) =>
          toNumber(a.children[4].textContent)
           - toNumber(b.children[4].textContent)
        );
        break;
      default:
        break;
    }

    ev.target.dataset.asc = 'false';
    previous = ev.target.innerText;
  } else {
    switch (ev.target.innerText) {
      case 'Name':
        tableContent.sort((a, b) =>
          stringCompare(b, a, 0)
        );
        break;
      case 'Position':
        tableContent.sort((a, b) =>
          stringCompare(b, a, 1)
        );
        break;
      case 'Office':
        tableContent.sort((a, b) =>
          stringCompare(b, a, 2)
        );
        break;
      case 'Age':
        tableContent.sort((a, b) =>
          b.children[3].textContent - a.children[3].textContent
        );
        break;
      case 'Salary':
        tableContent.sort((a, b) =>
          toNumber(b.children[4].textContent)
           - toNumber(a.children[4].textContent)
        );
        break;
      default:
        break;
    }
    ev.target.dataset.asc = 'true';
  }

  for (let row = 0; row < tableContent.length; row++) {
    tbody.append(tableContent[row]);
  }
};

table.addEventListener('click', sort);

const handlerSelect = (ev) => {
  const tr = document.getElementsByTagName('tr');

  for (const row of tr) {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  }
  ev.target.parentElement.classList.add('active');
};

tbody.addEventListener('click', handlerSelect);

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.textContent = title;
  p.textContent = description;
  h2.className = 'title';
  div.classList.add(type);
  div.classList.add('notification');
  div.setAttribute('data-qa', 'notification');
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;
  h2.style.whiteSpace = 'nowrap';
  div.append(h2, p);

  document.body.querySelector('form').append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

document.body.insertAdjacentHTML('beforeend', `
<form name="adder" class="new-employee-form">
    <label>Name: 
    <input 
      type="text" 
      name="name" 
      data-qa="name" 
      required
    >
    </label>
    <label>Position: 
    <input 
      type="text" name="position" 
      data-qa="position" 
      required
    >
    </label>
    <label>Office: 
      <select name="office" data-qa="office" required>
        <option value=""disabled selected>Choose your office</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: 
    <input 
      type="text" 
      name="age" 
      data-qa="age" 
      required
    >
    </label>
    <label>Salary: 
    <input 
      type="text" 
      name="salary" 
      data-qa="salary" 
      required
    >
    </label>
    <button>Save to table</button>
  </form>
`);

const button = document.querySelector('button');
const validate = (ev) => {
  ev.preventDefault();

  const form = document.forms[0];
  const element = form.elements;
  const nameElem = element.name.value;
  const position = element.position.value;
  const office = element.office.value;
  const salary = element.salary.value;
  const age = element.age.value;

  if (nameElem.length <= 4 || !nameElem.trim().length) {
    pushNotification(280, -15, 'Warning',
      'Name has less than 4 letters.', 'warning');
  } else if ((age < 18 || age > 90) || age.toUpperCase()
  !== age.toLowerCase()) {
    pushNotification(280, -15, 'Warning',
      'Age should be between 18 and 90 and do not contain letters', 'warning');
  } else if (!position.trim().length) {
    pushNotification(280, -15, 'Warning',
      'You should enter a position', 'warning');
  } else if (!office.length) {
    pushNotification(280, -15, 'Warning',
      'You should choose an office', 'warning');
  } else if (
    salary.toUpperCase() !== salary.toLowerCase() || !salary.length
    || salary <= 0) {
    pushNotification(280, -15, 'Warning',
      'Salary should contain only digits', 'warning');
  } else {
    tbody.insertAdjacentHTML('beforeend', `
    <tr>
            <td>${nameElem}</td>
            <td>${position}</td>
            <td>${office}</td>
            <td>${age}</td>
            <td>$${new Intl.NumberFormat('en-US').format(salary)}</td>
          </tr>
    `);

    pushNotification(280, -15, 'Success',
      'Employee added to list', 'success');
    form.reset();
  }
};

button.addEventListener('click', validate);

tbody.addEventListener('dblclick', (ev) => {
  const text = ev.target.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.setAttribute('type', 'text');
  input.value = text;
  ev.target.textContent = '';
  ev.target.append(input);
  input.focus();

  const officeCity = [
    'tokyo', 'singapore', 'london', 'new york', 'edinburgh', 'san francisco',
  ];
  const cellIndex = ev.target.cellIndex;
  const columnName = table.rows[0].children[cellIndex].textContent;

  input.addEventListener('blur', () => {
    if (!input.value) {
      input.replaceWith(text);

      return;
    }

    if (columnName === 'Name') {
      if (input.value.length > 4 && input.value.trim().length !== 0) {
        input.replaceWith(input.value);
      } else {
        pushNotification(280, -15, 'Error',
          'Name has less than 4 letters.', 'error');
        input.replaceWith(text);
      }
    }

    if (columnName === 'Salary') {
      if (input.value.toUpperCase() === input.value.toLowerCase()
      && input.value >= 0) {
        input.replaceWith(`
        $${new Intl.NumberFormat('en-US').format(input.value)}
        `);
      } else {
        pushNotification(280, -15, 'Error',
          'Salary should contain only digits', 'error');
        input.replaceWith(text);
      }
    }

    if (columnName === 'Office') {
      if (officeCity.includes(input.value.toLowerCase())) {
        input.replaceWith(input.value);
      } else {
        pushNotification(280, -15, 'Error',
          'Such office does not exist', 'error');
        input.replaceWith(text);
      }
    }

    if (columnName === 'Age') {
      if (input.value >= 18 && input.value <= 90 && input.value.toUpperCase()
       === input.value.toLowerCase()) {
        input.replaceWith(input.value);
      } else {
        pushNotification(280, -15, 'Error',
          'Age should be between 18 and 90 and do not contain letters',
          'error');
        input.replaceWith(text);
      }
    }

    if (columnName === 'Position') {
      if (input.value.trim().length !== 0) {
        input.replaceWith(input.value);
      } else {
        pushNotification(280, -15, 'Error',
          'Name has less than 4 letters.', 'error');
        input.replaceWith(text);
      }
    }
  });

  input.addEventListener('keypress', enter => {
    if (enter.key === 'Enter') {
      input.blur();
    }
  });
});

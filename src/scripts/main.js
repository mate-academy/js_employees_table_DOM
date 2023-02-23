'use strict';

const table = document.querySelector('table');
const tBody = document.querySelector('tbody');

table.addEventListener('click', (e) => {
  const employees = tBody.querySelectorAll('tr');

  if (e.target.tagName === 'TD') {
    const hasActive = [...employees]
      .find(element => element.classList.contains('active'));

    if (hasActive) {
      hasActive.removeAttribute('class');
    }

    const tr = e.target.closest('tr');

    tr.classList.add('active');
  }

  if (e.target.tagName === 'TH') {
    sortGrid(e.target.cellIndex, [...employees]);
  }
});

document.addEventListener('click', (e) => {
  const employees = tBody.querySelectorAll('tr');

  const hasActive = [...employees]
    .find(element => element.classList.contains('active'));

  if (e.target.tagName === 'BODY' && hasActive) {
    hasActive.removeAttribute('class');
  }
});

let wasSorted = false;

function sortGrid(index, array) {
  array.sort((a, b) => {
    const first = a.cells[index].innerText.replace(/[$,]/g, '');
    const second = b.cells[index].innerText.replace(/[$,]/g, '');

    const sortA = wasSorted ? second : first;
    const sortB = wasSorted ? first : second;

    if (isNaN(sortA)) {
      return sortA.localeCompare(sortB);
    }

    return sortA - sortB;
  });

  wasSorted = !wasSorted;

  tBody.append(...array);
}

function setNewEmployees() {
  const html = `
    <form 
      class="new-employee-form" 
      method="POST" 
      id="employeesForm"
    >
      <label>
        Name: 
        <input 
          data-qa="name"
          type="text" 
          name="name"
        >
      </label>

      <label>
        Position: 
        <input
          data-qa="position" 
          type="text" 
          name="position"
        >
      </label>

      <label>
        Office
        <select 
          data-qa="office" 
          name="office" 
          form="employeesForm"
        >
          <option value="tokyo">Tokyo</option>
          <option value="singapore">Singapore</option>
          <option value="london">London</option>
          <option value="new york">New York</option>
          <option value="edinburgh">Edinburgh</option>
          <option value="san francisco">San Francisco</option>
        </select>
      </label>

      <label>
        Age: 
        <input 
          data-qa="age" 
          type="number" 
          name="age"
        >
      </label>

      <label>
        Salary: 
        <input 
          data-qa="salary"
          type="number" 
          name="salary"
        >
      </label>

      <button type="submit">Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const form = document.querySelector('#employeesForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);

    for (const [inputName] of data) {
      const input = e.target.elements[inputName];

      validateForm(input);

      if (input.value === '') {
        pushNotification(10, 250, 'Error message',
          'You need to fill in each field', 'error');

        return;
      }
    }

    form.reset();

    pushNotification(10, 10, 'Success message',
      'A new employee is successfully added to the table', 'success');

    const info = Object.fromEntries(data.entries());

    info.salary = `$${Intl.NumberFormat('en-US').format(info.salary)}`;

    const tr = document.createElement('tr');

    for (const key in info) {
      const td = document.createElement('td');

      td.innerText = info[key]
        .split(' ')
        .map(item => item[0].toUpperCase() + item.slice(1))
        .join(' ');

      tr.append(td);
    }

    tBody.prepend(tr);
  });
};

tBody.addEventListener('dblclick', (e) => {
  const value = e.target.innerText;
  const input = document.createElement('input');
  const td = e.target.closest('td');

  input.classList.add('cell-input');
  td.innerHTML = '';
  td.append(input);
  input.style.width = '90px';
  input.focus();

  const title = [...document.querySelectorAll('th')].find(item => {
    return item.cellIndex === td.cellIndex;
  });

  const formInput = title.innerText !== 'Office'
    ? document.querySelector(`input[name="${title.innerText.toLowerCase()}"]`)
    : document.querySelector(`select[name="${title.innerText.toLowerCase()}"]`);

  input.name = formInput.name;

  input.addEventListener('focusout', () => {
    if (e.checked) {
      return;
    }

    td.innerText = value;
  });

  input.addEventListener('keyup', (keyEvent) => {
    const offices = [
      'tokyo', 'san francisco', 'london',
      'edinburgh', 'singapore', 'new york',
    ];

    if (keyEvent.key === 'Enter') {
      e.checked = true;

      td.innerText = validateForm(input) === ''
        ? value
        : normalize(input.value);

      if (formInput.tagName === 'SELECT') {
        td.innerText = offices.includes(input.value.toLowerCase())
          ? normalize(input.value.toLowerCase())
          : pushNotification(10, 10, 'Error message',
            'Sorry, we don\'t have an office in this city',
            'error', value);
      }

      if (value.includes('$')) {
        td.innerText = `
          $${Intl.NumberFormat('en-US').format(input.value.replaceAll('$', ''))}
        `;

        [...td.children].forEach(child => child.remove());

        if (td.innerText === '$NaN') {
          td.innerText = value;
        }
      }

      if (td.innerText !== value) {
        pushNotification(10, 10, 'Success message',
          'Employee\'s information is successfully changed', 'success');
      }

      if (offices.includes(input.value.toLowerCase())) {
        pushNotification(10, 10, 'Success message',
          'Employee\'s information is successfully changed', 'success');
      }
    }
  });
});

setNewEmployees();

function validateForm(input) {
  if (input.name === 'name') {
    input.value = input.value.length >= 4
      ? input.value
      : pushNotification(10, 10, 'Error message',
        'Value of name has less than 4 letters', 'error');
  }

  if (input.name === 'age') {
    input.value = input.value >= 18 && input.value < 90
      ? input.value
      : pushNotification(10, 10, 'Error message',
        'Value of age is less than 18 or more than 90 or not a number',
        'error');
  }

  if (input.name === 'position') {
    input.value = input.value.length >= 6
      ? input.value
      : pushNotification(10, 10, 'Error message',
        'Value of position is less than 6', 'error');
  }

  return input.value;
}

const pushNotification = (
  posTop, posRight, title, description, type = '', exception
) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.value = `notification ${type}`;
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;
  div.setAttribute('data-qa', 'notification');

  h2.classList.add('title');
  h2.innerText = title;
  h2.style.fontSize = '16px';

  p.innerText = description;
  p.style.fontSize = '12px';

  div.append(h2, p);
  document.body.append(div);
  setTimeout(() => div.remove(), 3000);

  return exception || '';
};

function normalize(str) {
  return str.split(' ')
    .map(element => element[0].toUpperCase() + element.slice(1))
    .join(' ');
};

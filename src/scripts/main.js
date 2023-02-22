'use strict';

const table = document.querySelector('table');
const tBody = document.querySelector('tbody');

table.addEventListener('click', (e) => {
  const employees = document.querySelector('tbody').querySelectorAll('tr');

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
          type="text" 
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

    for (const inputName of data) {
      const input = e.target.elements[inputName[0]];

      validateForm(input.value, input);

      if (input.value === '') {
        pushNotification(10, 250, 'Error message',
          'You need to fill in each field', 'error');

        return;
      }
    }

    pushNotification(10, 10, 'Success message',
      'A new employee is successfully added to the table', 'success');

    const info = Object.fromEntries(data.entries());
    const salary = info.salary.split('');
    let str = '';

    for (let i = salary.length - 1; i >= 0; i--) {
      if ((i - 1) % 3 === 0 && i !== salary.length - 1) {
        salary[i] += ',';
      }
      str = salary[i] + str;
    }

    info.salary = '$' + str;

    const tr = document.createElement('tr');

    for (const key in info) {
      const td = document.createElement('td');

      td.innerText = info[key]
        .split(' ')
        .map(item => item[0].toUpperCase() + item.slice(1))
        .join(' ');

      tr.append(td);
    }

    tBody.append(tr);
  });
};

tBody.addEventListener('dblclick', (e) => {
  const value = e.target.innerText;
  const input = document.createElement('input');
  const td = e.target.closest('td');

  input.classList.add('cell-input');
  td.innerHTML = '';
  td.append(input);
  input.focus();

  if (!isNaN(td.innerText)) {
    input.type = 'number';
  }

  input.onblur = () => {
    if (input.value) {
      return;
    }
    td.innerText = value;
  };

  input.addEventListener('keyup', (keyEvent) => {
    if (keyEvent.key === 'Enter' && input.value.length !== 0) {
      td.innerText = input.value;
    }
  });
});

setNewEmployees();

function validateForm(inputValue, input) {
  if (input.name === 'name') {
    input.value = inputValue.length >= 4
      ? inputValue
      : pushNotification(10, 10, 'Error message',
        'Value of name has less than 4 letters', 'error');
  }

  if (input.name === 'age') {
    input.value = inputValue >= 18 && inputValue < 90
      ? inputValue
      : pushNotification(10, 10, 'Error message',
        'Value of age is less than 18 or more than 90', 'error');
  }

  if (input.name === 'position') {
    input.value = inputValue.length >= 6
      ? inputValue
      : pushNotification(10, 10, 'Error message',
        'Value of position is less than 6', 'error');
  }
}

const pushNotification = (posTop, posRight, title, description, type = '') => {
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

  return '';
};

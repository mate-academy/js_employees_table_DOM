'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const tHead = document.querySelector('thead');
const thHead = [...[...tHead.rows][0].children];

// sorting
tHead.addEventListener('click', (e) => {
  const i = thHead.indexOf(e.target);

  e.target.classList.toggle('on');

  const sorted = [...tbody.rows]
    .sort((a, b) => {
      if (e.target.textContent === 'Salary') {
        return e.target.classList.value === 'on'
          ? parseSalary(a.cells[i].innerHTML)
            - parseSalary(b.cells[i].innerHTML)
          : parseSalary(b.cells[i].innerHTML)
            - parseSalary(a.cells[i].innerHTML);
      }

      return e.target.classList.value === 'on'
        ? a.cells[i].innerHTML > b.cells[i].innerHTML ? 1 : -1
        : a.cells[i].innerHTML < b.cells[i].innerHTML ? 1 : -1;
    });

  tbody.append(...sorted);
});

// selecting a row
tbody.addEventListener('click', (e) => {
  for (const row of [...tbody.rows]) {
    row.classList.remove('active');
  }
  e.target.parentNode.classList.toggle('active');
});

// creating a form
const data = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const newForm = document.createElement('form');

newForm.className = 'new-employee-form';

for (const element of data) {
  let type;

  element === 'Age' || element === 'Salary'
    ? type = 'number'
    : type = 'text';

  element !== 'Office'
    ? newForm.insertAdjacentHTML('beforeend', `
        <label>
          ${element}:
          <input
            name="${element.toLowerCase()}"
            type="${type}"
            data-qa="${element.toLowerCase()}">
        </label>
      `)
    : newForm.insertAdjacentHTML('beforeend', `
        <label>
          ${element}:
          <select
            name="${element.toLowerCase()}"
            type="${type}"
            data-qa="${element.toLowerCase()}">
              <option>Tokyo</option>
              <option>Singapore</option>
              <option>London</option>
              <option>New York</option>
              <option>Edinburgh</option>
              <option>San Francisco</option>
          </select>
        </label>
      `);
}

newForm.insertAdjacentHTML('beforeend', `
  <button>Save to table</button>
`);
body.append(newForm);

// adding and validating a new row
newForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (body.querySelector('.notification')) {
    body.querySelector('.notification').remove();
  }

  const newRow = document.createElement('tr');
  const labels = [...document.querySelectorAll('label')];
  let validatedInputs = 0;
  let errorMessage = '';

  for (const label of labels) {
    const input = label.children[0];

    if (input.value.length === 0) {
      errorMessage += `The field '${input.name}' shoudn't be empty. `;
    } else if (input.name === 'name' && input.value.length < 4) {
      errorMessage += 'The name should have at least 4 characters. ';
    } else if (input.name === 'age' && input.value < 18) {
      errorMessage += 'The age shouldn\'t be less than 18. ';
    } else if (input.name === 'age' && input.value > 90) {
      errorMessage += 'The age shouldn\'t be more than 90. ';
    } else {
      input.name === 'salary'
        ? newRow.insertAdjacentHTML('beforeend', `
            <td>${editSalary(input.value)}</td >
          `)
        : newRow.insertAdjacentHTML('beforeend', `
            <td>${input.value}</td >
          `);

      validatedInputs++;
    }
  }

  if (labels.length === validatedInputs) {
    tbody.append(newRow);

    pushNotification('success',
      'A new employee was successfully added!'
    );
  } else {
    pushNotification('error', errorMessage);
  }

  validatedInputs = 0;
});

// editing of table
tbody.addEventListener('dblclick', (e) => {
  const newInput = document.createElement('input');
  const initialValue = e.target.textContent;

  newInput.className = 'cell-input';
  newInput.value = e.target.textContent;
  e.target.textContent = '';
  e.target.append(newInput);

  e.target.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      if (newInput.value === '') {
        e.target.textContent = initialValue;
      } else {
        e.target.textContent = newInput.value;
      }
    }
  });

  newInput.addEventListener('blur', (ev) => {
    if (newInput.value === '') {
      e.target.textContent = initialValue;
    } else {
      e.target.textContent = newInput.value;
    }
  });
});

function parseSalary(str) {
  return +(str.replace(/\D/g, ''));
};

function editSalary(num) {
  return `$${num}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function pushNotification(result, message) {
  body.insertAdjacentHTML('beforeend', `
    <div class="notification ${result}" data-qa="notification">
      <h2 class="title">${message}</h2>
    </div>
  `);
}

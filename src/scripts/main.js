'use strict';

const table = document.querySelector('table');
const tr = table.querySelectorAll('tr');
const sortedRows = [...tr].slice(1, [...tr].length - 1);
let reverse = true;

function checkOrSalary(index) {
  if (table.rows[1].cells[index].textContent.slice(0, 1) === '$') {
    sortedRows
      .sort((a, b) =>
        +(a.cells[index].textContent.split(',').join('').replace('$', ''))
        - +(b.cells[index].textContent.split(',').join('').replace('$', ''))
      );
  };
};

function checkOrSalaryReverse(index) {
  if (table.rows[0].cells[index].textContent === 'Salary') {
    sortedRows
      .sort((a, b) =>
        +(b.cells[index].textContent.split(',').join('').replace('$', ''))
        - +(a.cells[index].textContent.split(',').join('').replace('$', ''))
      );
  };
};

table.addEventListener('click', e => {
  const asc = table.rows[0].cells;
  const index = [ ...asc ].indexOf(e.target);

  if (e.target.tagName === 'TD') {
    const indexSelectedRow = [ ...sortedRows ].indexOf(e.target.parentNode);

    [ ...sortedRows ].forEach(el => el.classList.remove('active'));
    [ ...sortedRows ][indexSelectedRow].classList.add('active');

    return;
  }

  if (reverse) {
    sortedRows
      .sort((a, b) =>
        a.cells[index].textContent.localeCompare(b.cells[index].textContent)
      );
    checkOrSalary(index);
    reverse = false;
  } else {
    sortedRows
      .sort((a, b) =>
        b.cells[index].textContent.localeCompare(a.cells[index].textContent)
      );
    checkOrSalaryReverse(index);
    reverse = true;
  }

  table.tBodies[0].append(...sortedRows);
});

const form = document.createElement('form');
const body = document.querySelector('body');
const button = document.createElement('button');

form.className = 'new-employee-form';
button.textContent = 'Save to table';
body.append(form);

function createInput(container, nameName, type, id, dataSet, labelText) {
  const element = document.createElement('input');
  const label = document.createElement('label');

  element.name = nameName;
  element.type = type;
  element.dataset.qa = dataSet;
  element.id = id;
  label.for = id;
  label.textContent = labelText;
  label.append(element);
  container.append(label);
}

const select = document.createElement('select');
const labelSelect = document.createElement('label');

select.dataset.qa = 'office';

select.insertAdjacentHTML('beforeend', `
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
`);

labelSelect.textContent = 'Office';
labelSelect.append(select);

createInput(form, 'name', 'text', 'name', 'name', 'Name');
createInput(form, 'position', 'text', 'position', 'position', 'Position');
form.append(labelSelect);
createInput(form, 'age', 'number', 'age', 'age', 'Age');
createInput(form, 'salary', 'number', 'salary', 'salary', 'Salary');
form.append(button);

const nameInput = document.querySelector('#name');
const positionInput = document.querySelector('#position');
const ageInput = document.querySelector('#age');

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (nameInput.value.length < 4
    || +ageInput.value < 18
    || +ageInput.value > 90
    || positionInput.value === '') {
    pushNotification(150, 10, 'Wrong type of data',
      '-`Name`  should be not less than 4 letters.\n '
      + '- `Age` value should be not less than 18 or more than 90 ', 'error');
  } else {
    const savedRow = document.createElement('tr');

    [ ...form.elements ].forEach(el => {
      if (el.value !== '') {
        const td = document.createElement('td');

        if (el.name === 'salary') {
          const salary = +el.value;

          td.textContent = '$' + salary.toLocaleString();
        } else {
          td.textContent = el.value;
        }
        savedRow.append(td);
      }
    });
    table.querySelector('tbody').append(savedRow);

    pushNotification(10, 10, 'Succes!',
      'Your data were added.', 'success');
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
  if (document.querySelector('.notification')) {
    document.querySelector('.notification').remove();
  }

  const root = document.querySelector('body');

  const element = document.createElement('div');

  element.className = 'notification ' + type;
  element.dataset.qa = 'notification';

  const elTitle = document.createElement('h2');

  elTitle.className = 'title';
  elTitle.textContent = title;
  element.append(elTitle);

  const elDescription = document.createElement('p');

  elDescription.textContent = description;
  elDescription.className = 'description';
  element.append(elDescription);
  element.style.top = posTop + 'px';
  element.style.right = posRight + 'px';
  root.append(element);
  setTimeout(() => element.remove(), 2000);
};

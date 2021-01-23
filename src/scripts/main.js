'use strict';

const table = document.querySelector('table');
const tr = table.querySelectorAll('tr');
const sortedRows = [...tr].slice(1, [...tr].length - 1);
let reverse = true;

table.addEventListener('click', e => {
  const asc = table.rows[0].cells;
  const index = [ ...asc ].indexOf(e.target);

  if (e.target.tagName === 'TD') {
    return;
  }

  function checkOrSalary() {
    if (table.rows[1].cells[index].textContent.slice(0, 1) === '$') {
      sortedRows
        .sort((a, b) =>
          +(a.cells[index].textContent.split(',').join('').replace('$', ''))
          - +(b.cells[index].textContent.split(',').join('').replace('$', ''))
        );
    };
  };

  function checkOrSalaryReverse() {
    if (table.rows[0].cells[index].textContent === 'Salary') {
      sortedRows
        .sort((a, b) =>
          +(b.cells[index].textContent.split(',').join('').replace('$', ''))
          - +(a.cells[index].textContent.split(',').join('').replace('$', ''))
        );
    };
  };

  if (reverse) {
    sortedRows
      .sort((a, b) =>
        a.cells[index].textContent.localeCompare(b.cells[index].textContent)
      );
    checkOrSalary();
    reverse = false;
  } else {
    sortedRows
      .sort((a, b) =>
        b.cells[index].textContent.localeCompare(a.cells[index].textContent)
      );
    checkOrSalaryReverse();
    reverse = true;
  }

  table.tBodies[0].append(...sortedRows);
});

table.addEventListener('click', e => {
  if (e.target.tagName === 'TH') {
    return;
  }

  const indexSelectedRow = [ ...sortedRows ].indexOf(e.target.parentNode);

  [ ...sortedRows ].forEach(el => el.classList.remove('active'));
  [ ...sortedRows ][indexSelectedRow].classList.add('active');
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
createInput(form, 'age', 'number', 'position', 'age', 'Age');
createInput(form, 'salary', 'number', 'position', 'salary', 'Salary');
form.append(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (form.elements[0].value.length < 4
    || +form.elements[3].value < 18
    || +form.elements[3].value > 90
    || form.elements[1].value === '') {
    pushNotification(150, 10, 'Title of Error message',
      'Message example.\n '
      + 'Notification should contain title and description.', 'error');
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

    pushNotification(10, 10, 'Title of Success message',
      'Message example.\n '
    + 'Notification should contain title and description.', 'success');
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
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

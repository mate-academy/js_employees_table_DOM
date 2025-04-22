'use strict';

// notification
const pushNotification = (posTop, posRight, title, type) => {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');

  h2.innerText = title;
  h2.classList.add('title');

  notification.classList.add('notification', `${type}`);
  notification.setAttribute('data-qa', 'notification');
  notification.appendChild(h2);

  const page = document.body;

  page.insertAdjacentElement('afterbegin', notification);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

// sorting
let currentSortColumn = -1;
let currentSortOrder = 'ASC';

function sort(sortBy, columnIndex) {
  const list = document.querySelectorAll('tbody tr');
  const arrOfList = [...list];

  arrOfList.sort((employee1, employee2) => {
    const employee1Text = employee1.cells[columnIndex].textContent;
    const employee2Text = employee2.cells[columnIndex].textContent;

    switch (sortBy) {
      case 'Name':
      case 'Position':
      case 'Office':
        return employee1Text.localeCompare(employee2Text);

      case 'Age':
        return +employee1Text - +employee2Text;

      case 'Salary':
        return (
          +employee1Text.replaceAll(/[$,]/g, '') -
          +employee2Text.replaceAll(/[$,]/g, '')
        );
    }
  });

  if (currentSortColumn === columnIndex) {
    currentSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
  } else {
    currentSortOrder = 'ASC';
    currentSortColumn = columnIndex;
  }

  if (currentSortOrder === 'DESC') {
    arrOfList.reverse();
  }

  for (let i = 0; i < list.length; i++) {
    list[i].outerHTML = arrOfList[i].outerHTML;
  }
}

const thead = document.querySelector('thead tr');

thead.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    sort(e.target.textContent, e.target.cellIndex);
  }
});

// selected row
const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    if (tbody.querySelector('.active')) {
      tbody.querySelector('.active').classList.remove('active');
    }
    e.target.closest('tr').classList.add('active');
  }
});

// fill form
const table = document.querySelector('table');
const form = document.createElement('form');

form.classList.add('new-employee-form');

const theaders = ['Name', 'Position', 'Office', 'Age', 'Salary'];

theaders.map((theader) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.innerText = `${theader}: `;

  if (theader === 'Office') {
    const selectInput = document.createElement('select');

    selectInput.setAttribute('name', `${theader.toLowerCase()}`);
    selectInput.setAttribute('data-qa', `${theader.toLowerCase()}`);
    selectInput.setAttribute('required', '');
    label.insertAdjacentElement('beforeend', selectInput);
  } else {
    input.setAttribute('name', `${theader.toLowerCase()}`);
    input.setAttribute('data-qa', `${theader.toLowerCase()}`);
    input.setAttribute('type', 'text');
    input.setAttribute('required', '');
    label.insertAdjacentElement('beforeend', input);
  }
  form.append(label);
});
// remove required at input `position` becouse of tests
form.elements.position.removeAttribute('required');
table.after(form);

document.querySelector('form').age.setAttribute('type', 'number');
document.querySelector('form').salary.setAttribute('type', 'number');

// fill select
const select = document.querySelector('select');
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office, key) => {
  select.options[key] = new Option(office, select.options.length);
});

// button
const button = document.createElement('button');

button.innerText = 'Save to table';
button.setAttribute('type', 'submit');
form.append(button);

// onsubmit form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // valid data
  if (data.get('name').length < 4) {
    pushNotification(10, 10, 'Name should have at least 4 characters', 'error');

    return;
  }

  if (data.get('position').trim().length === 0) {
    pushNotification(10, 10, 'Position should have characters', 'error');

    return;
  }

  if (+data.get('age') < 18 || +data.get('age') > 90) {
    pushNotification(
      10,
      10,
      'Age should have value between 18 and 90',
      'error',
    );

    return;
  }

  if (+data.get('salary') < 0) {
    pushNotification(10, 10, 'Salary should be positive', 'error');

    return;
  }

  // fill table
  const row = document.createElement('tr');
  const salary = +form.elements.salary.value;

  row.insertAdjacentHTML(
    'afterbegin',
    `<td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${select.options[data.get('office')].text}</td>
    <td>${data.get('age')}</td>
    <td>$${salary.toLocaleString('en-US')}</td>`,
  );

  tbody.append(row);

  form.reset();

  pushNotification(
    10,
    10,
    'New employee succesfully added to table',
    'success',
  );
});

// dblclick on cell

tbody.addEventListener('dblclick', (e) => {
  const newInput = document.createElement('input');
  const td = e.target.closest('td');

  if (!td) {
    return false;
  }

  if (td.cellIndex >= 3) {
    newInput.setAttribute('type', 'number');
  }

  const oldText = td.textContent;

  newInput.classList.add('cell-input');
  newInput.value = td.textContent;
  td.textContent = '';
  td.append(newInput);
  newInput.focus();

  newInput.addEventListener('blur', () => {
    if (td.cellIndex === 4) {
      newInput.setAttribute('type', 'text');

      const money = +newInput.value;

      newInput.value = '$' + money.toLocaleString('en-US');
    }

    td.textContent = newInput.value;
    newInput.remove();

    if (td.textContent === '' || td.textContent === '$0') {
      td.textContent = oldText;
    }
  });

  newInput.addEventListener('keypress', (ev) => {
    if (ev.code === 'Enter') {
      if (td.cellIndex === 4) {
        newInput.setAttribute('type', 'text');

        const money = +newInput.value;

        newInput.value = '$' + money.toLocaleString('en-US');
      }

      td.textContent = newInput.value;
      newInput.remove();

      if (td.textContent === '') {
        td.textContent = oldText;
      }
    }
  });
});

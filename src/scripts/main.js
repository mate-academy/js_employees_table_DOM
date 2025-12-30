'use strict';

const table = document.querySelector('table');
const head = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const body = document.querySelector('body');
const fields = ['name', 'position', 'office', 'age', 'salary'];
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// #region Sort table

let lastIndex = null;

head.addEventListener('click', (e) => {
  const listUsers = [...table.tBodies[0].rows];

  const sortedUser = listUsers.sort((a, b) => {
    const one = a.cells[e.target.cellIndex].innerHTML;
    const two = b.cells[e.target.cellIndex].innerHTML;
    const numA = Number(one.replaceAll(',', '').slice(1));
    const numB = Number(two.replaceAll(',', '').slice(1));

    if (one.includes('$')) {
      return lastIndex !== e.target.cellIndex ? numA - numB : numB - numA;
    }

    if (e.target.cellIndex === 3) {
      return lastIndex !== e.target.cellIndex ? one - two : two - one;
    }

    return lastIndex !== e.target.cellIndex
      ? one.localeCompare(two)
      : two.localeCompare(one);
  });

  lastIndex = e.target.cellIndex;

  table.tBodies[0].append(...sortedUser);
});

// #endregion Sort table

// #region select row

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (row) {
    const allRows = tableBody.querySelectorAll('tr');

    allRows.forEach((roww) => {
      roww.classList.remove('active');
    });
  }

  row.classList.add('active');
});

// #endregion select row

// #region add a form to the document

const form = document.createElement('form');
const button = document.createElement('button');

form.noValidate = true;

form.classList.add('new-employee-form');
button.innerText = 'Save to table';
button.type = 'submit';

fields.forEach((field) => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');
  let newField = input;

  if (field === 'office') {
    newField = select;

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.value = office;
      option.innerText = office.charAt(0).toUpperCase() + office.slice(1);
      newField.append(option);
    });
  }

  newField.name = field;

  if (newField.name === 'age' || newField.name === 'salary') {
    newField.type = 'number';
  } else if (newField.name !== 'office') {
    newField.type = 'text';
  }

  newField.setAttribute('data-qa', field);
  newField.required = true;
  label.innerText = field.charAt(0).toUpperCase() + field.slice(1) + ':';
  label.append(newField);
  form.append(label);
});

form.append(button);
body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const names = formData.get('name');
  const age = formData.get('age');
  const position = formData.get('position');
  const salary = formData.get('salary');

  if (!salary || salary <= 0) {
    pushNotifications(
      'Title of error message',
      'Wrong salary! Please enter a correct salary!.',
      'error',
    );
    form.reset();

    return;
  }

  if (!position || position.trim() === '') {
    pushNotifications(
      'Title of error message',
      'Wrong position! Please enter a correct position!.',
      'error',
    );
    form.reset();

    return;
  }

  if (names.length < 4) {
    pushNotifications(
      'Title of error message',
      'Wrong name! Please enter name > 3 symbol.',
      'error',
    );
    form.reset();

    return;
  }

  if (+age < 18 || +age > 90) {
    pushNotifications(
      'Title of error message',
      'Wrong age! Please enter a valid age',
      'error',
    );
    form.reset();

    return;
  }

  createNewEmployee(formData);

  pushNotifications(
    'Title of Success message',
    'New employee added to the table',
    'success',
  );
  form.reset();
});

// #endregion add a form to the document

// #region notifications

const pushNotifications = (title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add('notification');
  div.classList.add(`${type}`);
  div.setAttribute('data-qa', 'notification');

  h2.classList.add('title');
  h2.innerText = title;

  p.innerText = description;

  div.append(h2, p);
  body.append(div);

  setTimeout(() => {
    div.style.visibility = 'hidden';
  }, 2000);
};

// #endregion notifications

// #region create new employee

const createNewEmployee = (data) => {
  const entries = Object.fromEntries(data);
  const tr = document.createElement('tr');

  for (const el in entries) {
    const td = document.createElement('td');
    let formattedSalary = null;

    if (el === 'salary') {
      formattedSalary = '$' + Number(entries[el]).toLocaleString('en-US');
    }

    td.innerText = formattedSalary || entries[el];
    tr.appendChild(td);
  }

  tableBody.append(tr);
};

// #endregion create new employee

// #region editing of table cells by double-clicking on them

tableBody.addEventListener('dblclick', (e) => {
  const chosenCell = e.target.closest('td');
  const input = document.createElement('input');

  if (!chosenCell) {
    return;
  }

  if (chosenCell.querySelector('input')) {
    return;
  }

  const originaltext = chosenCell.textContent;

  input.type = 'text';
  input.classList.add('cell-input');
  input.value = chosenCell.textContent;

  chosenCell.textContent = '';
  chosenCell.appendChild(input);

  input.focus();

  input.addEventListener('blur', () => {
    if (!input.value) {
      chosenCell.textContent = originaltext;
      input.remove();

      return;
    }

    chosenCell.textContent = input.value;
    input.remove();
  });

  input.addEventListener('keydown', (press) => {
    if (press.key === 'Enter') {
      if (!input.value) {
        chosenCell.textContent = originaltext;
        input.remove();

        return;
      }
      chosenCell.textContent = input.value;
      input.remove();
    }

    if (press.key === 'Escape') {
      chosenCell.textContent = originaltext;
      input.remove();
    }
  });
});

// #endregion editing of table cells by double-clicking on them

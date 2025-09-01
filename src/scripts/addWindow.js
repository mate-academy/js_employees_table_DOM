'use strict';

const body = document.querySelector('body');
const addForm = document.createElement('form');

addForm.className = 'new-employee-form';

const firstTr = document.querySelector('thead tr');

firstTr.querySelectorAll('th').forEach((el) => {
  const label = document.createElement('label');

  label.className = 'label';

  label.textContent = el.textContent;

  let inputForm;

  if (el.textContent === 'Office') {
    const office = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    inputForm = document.createElement('select');

    office.forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      inputForm.appendChild(option);
    });

    inputForm.className = 'select';
  } else {
    inputForm = document.createElement('input');
    inputForm.className = 'input';

    if (el.textContent === 'Age' || el.textContent === 'Salary') {
      inputForm.type = 'number';
    } else {
      inputForm.type = 'text';
    }

    inputForm.name = el.textContent.toLocaleLowerCase();
  }
  inputForm.required = true;
  inputForm.dataset.qa = el.textContent.toLowerCase();
  label.appendChild(inputForm);
  addForm.appendChild(label);
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const block = document.createElement('div');

  block.style.position = 'absolute';
  block.className = `${type}`;
  block.dataset.qa = 'notification';
  block.style.top = posTop + 'px';
  block.style.right = posRight + 'px';

  const text = document.createElement('h2');

  text.className = 'title';
  text.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  block.appendChild(text);
  block.appendChild(p);
  document.body.appendChild(block);

  setTimeout(() => {
    block.style.display = 'none';
  }, 5000);
};

const checked = (input) => {
  const field = input.dataset.qa;
  const value =
    field === 'age' || field === 'salary' ? Number(input.value) : input.value;

  if (field === 'name') {
    return value.length >= 4;
  }

  if (field === 'age') {
    return value >= 18 && value <= 90;
  }

  return true;
};

const button = document.createElement('button');

button.className = 'button';
button.textContent = 'Save to table';

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (addForm.checkValidity()) {
    let valid = true;
    const toTable = document.querySelector('tbody');
    const newTr = document.createElement('tr');

    addForm.querySelectorAll('[data-qa]').forEach((inputForm) => {
      if (!checked(inputForm)) {
        valid = false;
      }

      const td = document.createElement('td');

      if (inputForm.dataset.qa === 'salary') {
        td.textContent = `$${Number(inputForm.value).toLocaleString('en-US')}`;
      } else {
        td.textContent = inputForm.value;
      }
      newTr.appendChild(td);
    });

    if (valid) {
      toTable.appendChild(newTr);
      pushNotification(500, 10, 'Success', 'Added successfully', 'success');
    } else {
      pushNotification(500, 10, 'Error', 'Invalid data', 'error');
    }
  } else {
    pushNotification(500, 10, 'Error', 'Invalid data', 'error');
  }
});

addForm.appendChild(button);

body.appendChild(addForm);

// pushNotification(
//   10,
//   10,
//   'Title of Success message',
//   'Message example.\n '
//   'success',
// );

// pushNotification(
//   150,
//   10,
//   'Title of Error message',
//   'Message example.\n '
//   'error',
// );

// pushNotification(
//   290,
//   10,
//   'Title of Warning message',
//   'Message example.\n '
//   'warning',
// );

'use strict';

const thead = document.querySelector('thead tr');
const tbody = document.querySelector('tbody');

function getNumber(salary) {
  return +salary.slice(1).split(',').join('');
}

let prevClick;

thead.addEventListener('click', e => {
  const people = [...document.querySelectorAll('tbody tr')];
  const i = e.target.cellIndex;

  if (e.target.textContent === 'Salary') {
    people.sort((a, b) =>
      getNumber(a.children[i].textContent)
      - getNumber(b.children[i].textContent));
  } else {
    people.sort((a, b) =>
      a.children[i].textContent.localeCompare(b.children[i].textContent));
  }

  if (e.target.textContent === prevClick) {
    tbody.append(...people.reverse());
    prevClick = null;
  } else {
    tbody.append(...people);
    prevClick = e.target.textContent;
  }
});

tbody.addEventListener('click', e => {
  [...tbody.rows].forEach(el => el.classList.remove('active'));

  e.target.parentNode.classList.toggle('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

const office
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

[...thead.children].forEach(el => {
  const label = document.createElement('label');
  const elName = el.textContent;

  label.textContent = el.textContent;

  if (elName === 'Office') {
    const select = document.createElement('select');

    select.name = elName.toLowerCase();
    select.dataset.qa = elName.toLowerCase();
    select.required = true;

    office.forEach(item => {
      const option = document.createElement('option');

      option.value = item;
      option.textContent = item;
      select.append(option);
      label.append(select);
      form.append(label);
    });
  } else {
    const input = document.createElement('input');

    input.name = elName.toLowerCase();
    input.dataset.qa = elName.toLowerCase();
    input.required = true;

    switch (elName) {
      case 'Age':
      case 'Salary':
        input.type = 'number';
        break;

      default:
        input.type = 'text';
    }

    label.append(input);
    form.append(label);
  }
});

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

button.addEventListener('click', e => {
  e.preventDefault();

  if (!form.name.value.trim() || !form.age.value || !form.position.value.trim()
    || !form.office.value || !form.salary.value) {
    pushNotification(450, 20, 'Error',
      'Please fill all fields.', 'error');

    return;
  }

  if (form.name.value.length < 4 && form.name.value.length > 0) {
    pushNotification(450, 20, 'Error',
      'Employee\'s name has less then 4 letters.', 'error');

    return;
  }

  if (form.age.value < 18 || form.age.value > 90) {
    pushNotification(450, 20, 'Error',
      'Employee\'s age is less than 18 or more than 90.', 'error');

    return;
  }

  if (form.salary.value < 0) {
    pushNotification(450, 20, 'Error',
      'Employee\'s salary is less than 0.', 'error');

    return;
  }

  const data = new FormData(form);
  const newRow = document.createElement('tr');
  const dataInfo = Object.fromEntries(data.entries());

  for (const info in dataInfo) {
    const item = document.createElement('td');

    if (info === 'salary') {
      item.textContent = '$'
      + Number(dataInfo[info]).toLocaleString('en-US');
    } else {
      item.textContent = dataInfo[info];
    }

    newRow.append(item);
  }

  tbody.append(newRow);
  form.reset();

  pushNotification(450, 20, 'Success',
    'New employee is successfully added to the table.', 'success');
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  document.body.append(message);

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  const messageTitle = document.createElement('h2');

  messageTitle.className = 'title';
  messageTitle.textContent = title;
  message.append(messageTitle);

  const messageText = document.createElement('p');

  messageText.textContent = description;
  message.append(messageText);

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  setTimeout(() => {
    message.hidden = true;
  }, 3000);
};

tbody.addEventListener('dblclick', e => {
  const changeEl = e.target.closest('td');
  let input = document.createElement('input');
  const prevText = e.target.textContent;
  const index = e.target.cellIndex;

  if (index < 2) {
    input.type = 'text';
  }

  if (index === 2) {
    input = document.createElement('select');

    office.forEach(item => {
      const option = document.createElement('option');

      option.value = item;
      option.textContent = item;
      input.append(option);
    });
  }

  if (index > 2) {
    input.type = 'number';
  }

  input.classList.add('cell-input');
  changeEl.textContent = '';

  changeEl.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    let text = input.value.trim();

    if (!text) {
      text = prevText;
    }

    if (index === 4 && input.value) {
      if (input.value < 0) {
        text = prevText;
      } else {
        text = '$' + Number(text).toLocaleString('en-US');
      }
    }

    if (input.value.length < 4 && index === 0 && input.value) {
      pushNotification(450, 20, 'Error',
        'Employee\'s name has less then 4 letters.', 'error');

      text = prevText;
    }

    if ((input.value < 18 || input.value > 90) && index === 3 && input.value) {
      pushNotification(450, 20, 'Error',
        'Employee\'s age is less than 18 or more than 90.', 'error');

      text = prevText;
    }

    input.parentElement.textContent = text;
    input.remove();
  });

  input.addEventListener('keydown', evnt => {
    if (evnt.code === 'Enter') {
      input.blur();
    }
  });
});

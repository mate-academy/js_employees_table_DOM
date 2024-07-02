'use strict';

const getUpper = (el) => el[0].toUpperCase() + el.slice(1);
const getOffices = (select) => {
  [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ].forEach((office) => {
    const option = document.createElement('option');

    option.textContent = office;
    option.setAttribute('value', office);
    select.append(option);
  });
};
const createForm = () => {
  const form = document.createElement('form');
  const button = document.createElement('button');
  const inputs = ['name', 'position', 'office', 'age', 'salary'];

  form.classList.add('new-employee-form');
  document.body.firstElementChild.after(form);
  button.textContent = 'Save to table';
  button.type = 'submit';

  inputs.forEach((el, i) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const select = document.createElement('select');

    label.textContent = getUpper(el);

    if (i === 2) {
      select.setAttribute('data-qa', el);
      getOffices(select);
      label.setAttribute('htmlFor', select.dataset);
      label.append(select);
    } else {
      input.setAttribute('data-qa', el);
      input.setAttribute('type', 'text');
      label.setAttribute('htmlFor', input.dataset);
      label.append(input);
    }

    form.append(label);
  });

  form.append(button);
};
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const tit = document.createElement('h3');
  const desc = document.createElement('p');

  notification.classList.add(type, 'notification');
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  tit.innerText = title;
  tit.classList.add('title');
  desc.innerText = description;
  notification.append(tit);
  notification.append(desc);
  document.body.prepend(notification);
  setTimeout(() => notification.remove(), 2000);
};

createForm();

document.addEventListener('keydown', (e) => {
  const input = e.target.closest('input');

  if (!input) {
    return;
  }
  input.value = e.target.value;
});

document.addEventListener('click', (e) => {
  e.preventDefault();

  const tbody = document.querySelector('tbody');
  const button = document.querySelector('button');

  if (button !== e.target) {
    return 0;
  }

  const inputs = document.querySelectorAll('input');
  const select = document.querySelector('select');
  const tr = document.createElement('tr');

  [...[...inputs].slice(0, 2), select, ...[...inputs].slice(-2)].forEach(
    (param, index) => {
      const td = document.createElement('td');

      if (index === 4) {
        td.textContent = `$${Number(param.value).toLocaleString('en-US')}`;
      } else {
        td.textContent = param.value;
      }
      tr.append(td);
    },
  );

  const nameCondition = tr.children[0].textContent.length < 4;
  const ageIsNaN =
    +tr.children[3].textContent / +tr.children[3].textContent !== 1;
  const ageCondition =
    ageIsNaN ||
    +tr.children[3].textContent < 18 ||
    +tr.children[3].textContent > 90;
  const someInputsIsEmpty = [...tr.children].some(
    (input) => input.textContent.trim() === '',
  );
  const fixSalary = +tr.children[4].textContent.slice(1).split(',').join('');
  const salaryIsNaN = fixSalary / fixSalary !== 1;

  if (someInputsIsEmpty) {
    pushNotification(
      10,
      10,
      'Inputs Message',
      'All fields must be filled.',
      'error',
    );
  } else {
    pushNotification(
      10,
      10,
      'Inputs Message',
      'All fields must be filled.',
      'success',
    );
  }

  if (nameCondition) {
    pushNotification(
      130,
      10,
      'Name Message',
      'The Name field must contain at least 4 letters.',
      'error',
    );
  } else {
    pushNotification(
      130,
      10,
      'Name Message',
      'The Name field must contain at least 4 letters.',
      'success',
    );
  }

  if (ageIsNaN) {
    pushNotification(
      260,
      10,
      'Age Message',
      'The value of the Age field must be a number.',
      'error',
    );
  } else {
    pushNotification(
      260,
      10,
      'Age Message',
      'The value of the Age field must be a number.',
      'success',
    );
  }

  if (ageCondition) {
    pushNotification(
      390,
      10,
      'Age Message',
      'The Age field must be in the range from 18 to 90 years.',
      'error',
    );
  } else {
    pushNotification(
      390,
      10,
      'Age Message',
      'The Age field must be in the range from 18 to 90 years.',
      'success',
    );
  }

  if (salaryIsNaN) {
    pushNotification(
      520,
      10,
      'Salary Message',
      'The value of the Salary field must be a number.',
      'error',
    );
  } else {
    pushNotification(
      520,
      10,
      'Salary Message',
      'The value of the Salary field must be a number.',
      'success',
    );
  }

  if (
    !nameCondition &&
    !ageCondition &&
    !someInputsIsEmpty &&
    !ageIsNaN &&
    !salaryIsNaN
  ) {
    pushNotification(
      650,
      10,
      'Form Message',
      'Employee successfully added!',
      'success',
    );

    tbody.append(tr);
    inputs.forEach((input) => (input.value = null));
    select.value = select.firstChild.value;
  }
});

const getSalary = (number) =>
  +number.children[4].textContent.slice(1).split(',').join('');

const localeCompare = (a, b, index) =>
  b.children[index].textContent.localeCompare(a.children[index].textContent);

let isReversed = false;
let currentTh = '';

document.addEventListener('click', (e) => {
  const tbody = document.getElementsByTagName('tbody')[0];
  const param = e.target.closest('th');

  if (!param) {
    return;
  }

  const newList = Array(...tbody.children).sort((a, b) => {
    switch (param.textContent) {
      case 'Name':
        return localeCompare(a, b, 0);
      case 'Position':
        return localeCompare(a, b, 1);
      case 'Office':
        return localeCompare(a, b, 2);
      case 'Age':
        return +b.children[3].textContent - +a.children[3].textContent;
      default:
        return getSalary(b) - getSalary(a);
    }
  });

  if (isReversed && currentTh === param.textContent) {
    newList.reverse();
    isReversed = false;
  } else {
    isReversed = true;
  }
  currentTh = param.textContent;
  newList.forEach((element) => tbody.prepend(element));
});

document.addEventListener('click', (e) => {
  const tbodyChildrens = [...document.querySelector('tbody').children];
  const tr = e.target.parentElement;

  if (e.target.parentElement.parentElement.tagName !== 'TBODY') {
    return;
  }
  tbodyChildrens.forEach((children) => children.classList.remove('active'));
  tr.classList.add('active');
});

document.addEventListener('dblclick', (e) => {
  const newTd = e.target;
  const newInput = document.createElement('input');
  const currentTdText = newTd.textContent;

  if (e.target.tagName !== 'TD') {
    return;
  }

  newInput.classList.add('cell-input');
  newInput.value = newTd.textContent;
  newTd.innerHTML = null;
  newTd.append(newInput);
  newInput.focus();

  newInput.onblur = () => {
    newTd.innerHTML = null;

    if (newInput.value.trim() === '') {
      newTd.textContent = currentTdText;
    } else {
      newTd.textContent = newInput.value;
    }
  };

  newInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      newInput.blur();
    }
  });
});

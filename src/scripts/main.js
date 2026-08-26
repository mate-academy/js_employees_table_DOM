'use strict';

const head = document.querySelector('thead tr');
const headers = [...document.querySelectorAll('thead th')];
const body = document.querySelector('tbody');
const count = [];

headers.forEach(() => count.push(0));

head.addEventListener('click', (e) => {
  const rows = [...document.querySelectorAll('tbody tr')];
  const index = headers.indexOf(e.target);

  count[index]++;

  let sorted = [];

  if (count[index] % 2 === 1) {
    sorted = rows.sort((el1, el2) => sorting(el1, el2, index));
  } else {
    sorted = rows.sort((el1, el2) => sorting(el2, el1, index));
  }

  sorted.forEach((line) => body.append(line));
});

function sortSalary(el) {
  return +el.replaceAll('$', '').replaceAll(',', '');
}

function sorting(el1, el2, index) {
  let result;
  const element1 = sortSalary(el1.children[index].textContent);

  if (element1 === +element1) {
    result = element1 - sortSalary(el2.children[index].textContent);
  } else {
    result = el1.children[index].textContent.localeCompare(
      el2.children[index].textContent,
    );
  }

  return result;
}

body.addEventListener('click', (e) => {
  const selected = [...body.children].findIndex((el) => {
    return el.classList.contains('active');
  });

  if (selected !== -1) {
    body.children[selected].classList.remove('active');
  }

  e.target.closest('tr').classList.toggle('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML(
  'afterbegin',
  '<button type="submit">Save to table</button>',
);
numInputInsert('Salary', 'salary');
numInputInsert('Age', 'age');

form.insertAdjacentHTML(
  'afterbegin',
  // eslint-disable-next-line max-len
  '<label>Office: <select name="office" data-qa="office" required></select></label>',
);

form.insertAdjacentHTML(
  'afterbegin',
  `<label>Position: <input name="position" type="text" data-qa="position"></label>`,
);

inputInsert('Name', 'name');

const table = document.querySelector('table');

table.after(form);

const select = document.querySelector('select');

optionsInsert('Tokyo');
optionsInsert('Singapore');
optionsInsert('London');
optionsInsert('New York');
optionsInsert('Edinburgh');
optionsInsert('San Francisco');

function inputInsert(label, Name) {
  form.insertAdjacentHTML(
    'afterbegin',
    `<label>${label}: <input name="${Name}" type="text" data-qa="${Name}" required></label>`,
  );
}

function numInputInsert(label, Name) {
  form.insertAdjacentHTML(
    'afterbegin',
    `<label>${label}: <input name="${Name}" type="number" data-qa="${Name}" required></label>`,
  );
}

function optionsInsert(option) {
  return select.insertAdjacentHTML(
    'afterbegin',
    `<option value="${option}">${option}</option>`,
  );
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const Name = data.get('name');
  const position = data.get('position');
  const office = data.get('office');
  const age = data.get('age');
  const salary = makeSalary(data.get('salary'));

  if (
    Name.length < 4 ||
    age < 18 ||
    age > 90 ||
    position.length < 5 ||
    !office
  ) {
    showNotification('error', 'Error', 'Wrong input');
  } else {
    showNotification('success', 'Success!', 'Information added');

    const tr = document.createElement('tr');

    tr.insertAdjacentHTML('beforeend', `<td>${Name}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td>${position}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td>${office}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td>${age}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td>${salary}</td>`);

    body.append(tr);
  }
});

function makeSalary(num) {
  const arr = num.split('');

  for (let i = arr.length - 3; i > 0; i -= 3) {
    arr.splice(i, 0, ',');
  }

  return '$' + arr.join('');
}

function showNotification(type, title, description) {
  const notification = document.createElement('div');
  const h1 = document.createElement('h1');
  const desc = document.createElement('p');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');
  notification.classList.add(type);
  h1.classList.add('title');

  h1.textContent = title;
  desc.textContent = description;

  notification.append(h1);
  notification.append(desc);

  notification.style.top = '300px';
  notification.style.left = 0;
  notification.style.color = 'black';

  form.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

let currentInput = null;

body.addEventListener('dblclick', (e) => {
  if (e.target.querySelector('input')) {
    return;
  }

  const target = e.target.textContent;

  e.target.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  e.target.append(input);

  currentInput = input;

  currentInput.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      rewrite(currentInput, e, target);
    }
  });

  currentInput.addEventListener('blur', () => {
    rewrite(currentInput, e, target);
  });
});

function rewrite(input, e, target) {
  if (input.value === '') {
    e.target.textContent = target;
  } else {
    e.target.textContent = input.value;
  }
  input.remove();
  currentInput = null;
}

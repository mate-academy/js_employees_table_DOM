'use strict';

function getNumber(str) {
  return str.includes('$')
    ? +str.slice(1).replaceAll(',', '')
    : +str;
}

function replaceFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function pushNotification(type, text, titleText) {
  const boxNotification = document.createElement('div');
  const h1 = document.createElement('h1');
  const p = document.createElement('p');

  boxNotification.append(h1, p);
  boxNotification.classList.add('notification', type);
  h1.className = 'title';
  h1.innerText = titleText;
  p.innerText = text;
  document.body.append(boxNotification);

  setTimeout(() => {
    boxNotification.remove();
  }, 3000);
}

function getThousandSeparator(number) {
  return number.toLocaleString('en-Us');
}

const data = ['name', 'position', 'office', 'age', 'salary'];
const offices = ['Tokyo',
  'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];
const employees = document.querySelector('tbody');
const form = document.createElement('form');
const button = document.createElement('button');

button.innerText = 'Save to table';

form.className = 'new-employee-form';

document.querySelector('body').append(form);

for (let i = 0; i < 5; i++) {
  const label = document.createElement('label');

  label.innerText = replaceFirstLetter(data[i]) + ':';

  if (i === 2) {
    const select = document.createElement('select');
    const option = document.createElement('option');

    select.name = data[i];
    select.setAttribute('data-qa', data[i]);

    for (const country of offices) {
      option.innerText = country;
      select.append(option.cloneNode(true));
    }

    label.append(select);
  } else {
    const input = document.createElement('input');

    input.name = data[i];
    input.setAttribute('data-qa', data[i]);

    if (data[i] === 'age' || data[i] === 'salary') {
      input.type = 'number';
      input.min = 0;
    } else {
      input.type = 'text';
    }
    label.append(input.cloneNode(true));
  }

  label.children[0].ariaRequired = true;
  form.append(label.cloneNode(true));
}

form.append(button);

let count = 0;
let target = '';

document.body.addEventListener('click', e => {
  count = target.innerText !== e.target.innerText ? 1 : count + 1;
  target = e.target;

  if (count === 2) {
    e.preventDefault();
    count = 0;
  }

  const sort = [...employees.children].sort((a, b) => {
    const isCompareAsString = e.target
      .innerText === 'Name' || e.target
      .innerText === 'Position' || e.target
      .innerText === 'Office';

    const isCompareAsNumber = e.target
      .innerText === 'Age' || e.target.innerText === 'Salary';

    if (isCompareAsString) {
      let cellIndex = 0;

      if (e.target.innerText === 'Position') {
        cellIndex = 1;
      } else if (e.target.innerText === 'Office') {
        cellIndex = 2;
      }

      const first = a.children[cellIndex].innerText;
      const second = b.children[cellIndex].innerText;

      if (e.defaultPrevented) {
        return second.localeCompare(first);
      }

      return first.localeCompare(second);
    }

    if (isCompareAsNumber) {
      const cellIndex = e.target.innerText === 'Age' ? 3 : 4;

      const first = getNumber(a.children[cellIndex].innerText);
      const second = getNumber(b.children[cellIndex].innerText);

      if (e.defaultPrevented) {
        return second - first;
      }

      return first - second;
    }
  });

  for (let i = 0; i < sort.length; i++) {
    let newTr = document.createElement('tr');

    newTr = sort[i];
    employees.append(newTr);
  }
});

employees.addEventListener('click', e => {
  const item = e.target.closest('tr');

  if (!item || !employees.contains(item)) {
    return;
  }

  if (target.parentElement) {
    document.querySelector('.active').classList.remove('active');
  }

  target = e.target;
  target.parentElement.classList.add('active');
});

form.addEventListener('submit', e => {
  e.preventDefault();

  let type = 'Success';
  let titleText = 'Great';
  let text = 'New employee successfully added!';
  const dataForm = Object.fromEntries(new FormData(form).entries());
  const isEmptyField = dataForm.position.length === 0
    || dataForm.salary.length === 0
    || dataForm.name.length === 0
    || dataForm.age.length === 0;
  const isCorrectName = dataForm.name.length >= 4;
  const isCorrectAge = dataForm.age >= 18 && dataForm.age <= 90;

  if (isEmptyField) {
    type = 'error';
    titleText = 'Missing data';
    text = 'Please, fill all fields!';
  } else if (!isCorrectAge) {
    type = 'error';
    titleText = 'Invalid age';
    text = 'Enter the correct age!';
  } else if (!isCorrectName) {
    type = 'succes';
    titleText = 'Invalid name';
    text = 'Name is too shot, please enter the correct name!';
  } else {
    const tr = document.createElement('tr');

    for (let i = 0; i < 5; i++) {
      const td = document.createElement('td');

      if (data[i] === 'salary') {
        td.innerText = '$' + getThousandSeparator(+dataForm[data[i]]);
      } else {
        td.innerText = dataForm[data[i]];
      }

      tr.append(td);
    }
    employees.append(tr);
    form.reset();
  }

  pushNotification(type, text, titleText);
});

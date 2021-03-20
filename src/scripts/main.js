'use strict';

// write code here
const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

let willReverse;

tableHead.addEventListener('click', (e) => {
  const targetOnHead = e.target.innerText;
  const targeIndex = e.target.cellIndex;
  const toReverse = willReverse === targetOnHead;

  [...tableBody.children].sort((a, b) => {
    const firstElement = a.cells[targeIndex].innerText;
    const secondElement = b.cells[targeIndex].innerText;

    if (targetOnHead === 'Age' || targetOnHead === 'Salary') {
      const A = +(firstElement.replace('$', '').replace(/,/g, ''));
      const B = +(secondElement.replace('$', '').replace(/,/g, ''));

      return toReverse
        ? B - A
        : A - B;
    }

    return toReverse
      ? secondElement.localeCompare(firstElement)
      : firstElement.localeCompare(secondElement);
  }).forEach(element => {
    tableBody.append(element);
  });

  willReverse = willReverse === targetOnHead
    ? undefined
    : targetOnHead;
});

let targetTag;

tableBody.addEventListener('click', (e) => {
  if (targetTag) {
    targetTag.classList.remove('active');
  };

  targetTag = e.target.closest('tr');
  e.target.closest('tr').classList.add('active');
});

const form = document.createElement('form');

form.classList.add(`new-employee-form`);

body.append(form);

const headTitles = tableHead.innerText.trim().split(/\s+/);

const cities = [`Tokyo`, `Singapore`, `London`, `New York`,
  `Edinburgh`, `San Francisco`];

const button = document.createElement('button');

button.innerText = 'Save to table';
button.type = 'button';

headTitles.forEach(text => {
  const label = document.createElement('label');

  label.innerText = text + ':';

  if (text === 'Office') {
    const select = document.createElement('select');

    select.name = text.toLowerCase();
    select.setAttribute('data-qa', text.toLowerCase());

    cities.forEach(citie => {
      const option = document.createElement('option');

      option.innerText = citie;
      select.append(option);
      label.append(select);
    });

    form.append(label);

    return;
  }

  const input = document.createElement('input');

  input.name = text.toLowerCase();

  input.setAttribute('data-qa', text.toLowerCase());

  text === 'Age' || text === 'Salary'
    ? input.type = 'number'
    : input.type = 'text';

  label.append(input);
  form.append(label, button);
  // form.append();
});

const forms = document.querySelector('form');

tableBody.addEventListener('dblclick', (e) => {
  const input = document.createElement('input');
  const targetTextContent = e.target.innerText;

  input.className = `cell-input`;
  input.value = e.target.innerText;

  e.target.innerText = '';
  e.target.append(input);

  input.focus();

  input.addEventListener('keydown', (push) => {
    if (push.code === 'Enter') {
      e.target.innerText = input.value || targetTextContent;
    }
  });

  input.addEventListener('blur', () => {
    e.target.innerText = input.value || targetTextContent;
  });
});

button.addEventListener('click', (e) => {
  const nameValue = form.children[0].firstElementChild.value;
  const positionValue = form.children[1].firstElementChild.value;
  const ageValue = form.children[3].firstElementChild.value;

  const result = validation(ageValue, nameValue, positionValue);

  if (result) {
    createEmploy(forms);
    showMessage(message, 'success');
  } else {
    showMessage(message, 'error');
  }
});

let message;

function validation(ageValue, nameValue, positionValue) {
  if (nameValue.length < 4 || ageValue > 90 || ageValue < 18) {
    message = nameValue.length < 4
      ? 'The name must contain no less than 4 letters'
      : 'The age must be more than 18 and less than 90 year';

    return false;
  }

  if (positionValue.length < 1) {
    message = 'Please, write your position';

    return false;
  } else {
    message = 'Employee is successfully added to the table';

    return true;
  }
}

function showMessage(info, statusInfo) {
  const container = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('p');

  container.setAttribute('data-qa', 'notification');
  container.classList.add(`notification`, statusInfo);

  title.innerText = statusInfo.toUpperCase();

  description.innerText = info;
  container.append(title, description);
  body.append(container);

  setTimeout(() => {
    container.remove();
  }, 3000);
}

function createEmploy(formInputs) {
  const tr = document.createElement('tr');

  [...formInputs].forEach(input => {
    if (input.type !== 'button') {
      const td = document.createElement('td');

      td.innerText = input.value;

      if (input.name === 'salary') {
        td.innerText = input.value > 0
          ? '$' + (+input.value).toLocaleString('en')
          : '$' + 0;
      }

      if (input.name !== 'office') {
        input.value = '';
      }

      tr.append(td);
    }
  });

  tableBody.append(tr);
}

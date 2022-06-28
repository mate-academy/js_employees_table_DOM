'use strict';

// Sort
const thead = document.querySelector('thead').children[0];
const colHead = thead.innerText.split('\t');
const sortStatus = Array(5).fill(false);

thead.addEventListener('click', (click) => {
  if (click.target.tagName !== 'TH') {
    return false;
  }

  const index = colHead.findIndex((colName) =>
    colName === click.target.innerText);

  const rows = [...document.querySelectorAll('tbody tr')];

  const sort = (tr1, tr2) => {
    const text1 = tr1.children[index].innerText;
    const text2 = tr2.children[index].innerText;
    let result = null;

    switch (colHead[index]) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (sortStatus[index]) {
          result = text2.localeCompare(text1);
        } else {
          result = text1.localeCompare(text2);
        }
        break;
      case 'Age':
        if (sortStatus[index]) {
          result = Number(text2) - Number(text1);
        } else {
          result = Number(text1) - Number(text2);
        }
        break;
      case 'Salary':
        const salary1 = text1.split(',').join('').slice(1);
        const salary2 = text2.split(',').join('').slice(1);

        if (sortStatus[index]) {
          result = Number(salary2) - Number(salary1);
        } else {
          result = Number(salary1) - Number(salary2);
        }
        break;
    }

    return result;
  };

  rows.sort(sort);
  sortStatus[index] = !sortStatus[index];

  document.querySelector('tbody').innerHTML = `
    ${rows.map((tr) => tr.outerHTML).join('\n')}
  `;
});

// Create form
const form = document.createElement('form');
const offices = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];

form.className = 'new-employee-form';

for (let i = 0; i <= 4; i++) {
  const label = document.createElement('label');
  let input = document.createElement('input');

  input.required = true;

  switch (colHead[i]) {
    case 'Name':
      input.minLength = '4';
      break;
    case 'Office':
      input = document.createElement('select');

      for (const office of offices) {
        input.append(new Option(office, office));
      }
      break;
    case 'Age':
      input.type = 'number';
      input.min = 18;
      input.max = 90;
      break;
    case 'Salary':
      input.type = 'number';
  }

  label.textContent = colHead[i] + ': ';
  input.name = colHead[i].toLowerCase();
  input.setAttribute('data-qa', input.name);
  label.htmlFor = input.name;

  label.append(input);
  form.append(label);
}

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);
document.body.append(form);

function showMessage(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const titleNotification = document.createElement('h2');
  const messageNotification = document.createElement('p');

  notification.className = 'notification ' + type;
  titleNotification.className = 'title';
  notification.setAttribute('data-qa', 'notification');

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px ';
  notification.style.boxSizing = 'content-box';

  titleNotification.textContent = title;
  messageNotification.textContent = description;

  notification.append(titleNotification);
  notification.append(messageNotification);

  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
}

button.addEventListener('click', click => {
  const data = [...((new FormData(form)).entries())];

  if (data.every((input) => input[1].length > 0)) {
    click.preventDefault();
  } else {
    showMessage(10, 10, 'Error', 'Incorrect data !', 'error');

    return;
  }

  data[4][1] = '$' + Number(data[4][1]).toLocaleString('en-US');

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    ${data.map((entry) => `
    <td>
      ${entry[1]}
    </td>
    `).join('')}
  `;

  document.querySelector('tbody').append(newRow);

  showMessage(10, 10, 'Success', 'Data added !', 'success');
  form.reset();
});

document.querySelector('tbody').addEventListener('click', makeActive());

function makeActive() {
  let isActive = false;

  const addActive = (click) => {
    if (click.target.tagName === 'TD') {
      if (isActive) {
        const rows = [...document.querySelectorAll('tr')];

        rows.find((row) =>
          row.matches('.active')).classList.remove('active');
      }
      isActive = true;
      click.target.parentElement.className = 'active';
    }
  };

  return addActive;
};

document.querySelector('tbody').addEventListener('dblclick', changeValue());

function changeValue() {
  let previouslyValue = null;
  let input = null;
  let td = null;

  function createInput(dblclick) {
    if (dblclick.target.tagName !== 'TD') {
      return false;
    }

    const parentElem = dblclick.target.parentElement;
    const index = [...parentElem.children].findIndex((elem) =>
      elem === dblclick.target);

    input = form.elements[index].cloneNode(true);
    previouslyValue = dblclick.target.textContent;
    td = dblclick.target;

    input.classList.add('cell-input');
    dblclick.target.textContent = '';
    dblclick.target.append(input);
    input.focus();

    input.addEventListener('blur', saveValue);
    input.addEventListener('keydown', saveValue);
  }

  function saveValue(eventt) {
    if (eventt.key !== 'Enter' && eventt.type === 'keydown') {
      return;
    }

    if (input.value === '') {
      td.textContent = previouslyValue;
      input.remove();

      return;
    }

    switch (eventt.target.name) {
      case 'name':
        const nameLength = eventt.target.value.length;

        if (nameLength < 4) {
          td.textContent = previouslyValue;
          input.remove();

          showMessage(10, 10, 'Error', 'Incorrect data !', 'error');

          return;
        }
        break;

      case 'age':
        const age = Number(eventt.target.value);

        if (age < 18 || age > 90) {
          td.textContent = previouslyValue;
          input.remove();

          showMessage(10, 10, 'Error', 'Incorrect data !', 'error');

          return;
        }
    }

    if (input.name === 'salary') {
      eventt.target.parentElement.textContent = '$'
        + Number(input.value).toLocaleString('en-US');
    } else {
      eventt.target.parentElement.textContent = input.value;
    }
    input.remove();

    showMessage(10, 10, 'Success', 'Data added !', 'success');
  }

  return createInput;
}

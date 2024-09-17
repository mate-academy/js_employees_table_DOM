'use strict';

const header = document.querySelector('thead');
const th = document.querySelectorAll('th');
const tr = document.querySelector('tr');
const td = document.createElement('td');
const tBody = document.querySelector('tbody');

// sort

header.addEventListener('click', (elem) => {
  const index = elem.target.cellIndex;

  elem.target.classList.toggle('DESC');

  if (elem.target.className === 'DESC') {
    [...th].map(item => item.classList.remove('DESC'));
    elem.target.classList.add('DESC');
  }

  if (elem.target.tagName === 'TH') {
    sortCol(tBody, index, elem.target.className !== 'DESC');
  }
});

function sortCol(list, col, reverse) {
  function toNumber(text) {
    return text.replace(/\D+/g, '');
  }

  let sorted = [...list.children]
    .sort((a, b) => {
      const aCol = a.children[col].innerText;
      const bCol = b.children[col].innerText;

      if ((toNumber(aCol)) === '') {
        return aCol.localeCompare(bCol);
      } else {
        return toNumber(aCol) - toNumber(bCol);
      }
    });

  if (reverse) {
    sorted = sorted.reverse();
  }

  tBody.append(...sorted);
}

// select row

tBody.addEventListener('click', (row) => {
  if (!row.target.closest('TR')) {
    return;
  }

  const isActive = tBody.querySelector('.active');

  if (isActive) {
    isActive.classList.remove('active');
  }
  row.target.parentNode.classList.add('active');
});

// add form

const form = document.createElement('form');
const label = document.createElement('label');
const btn = document.createElement('button');
const input = document.createElement('input');
const selectBar = document.createElement('select');
const option = document.createElement('option');

document.body.append(form);
form.classList.add('new-employee-form');
form.setAttribute('method', 'post');

const formFields = [...tr.children].map(item => item.innerText);

for (const item of formFields) {
  label.textContent = `${item}:`;

  if (item === 'Office') {
    const cityList = ['Tokyo', 'Singapore', 'London',
      'New York', 'Edinburgh', 'San Francisco'];

    selectBar.setAttribute('data-qa', `${item.toLowerCase()}`);
    selectBar.setAttribute('id', 'citySelect');

    for (const city of cityList) {
      option.setAttribute('value', city);
      option.textContent = `${city}`;
      selectBar.append(option.cloneNode(true));
    }

    label.append(selectBar);
  } else {
    input.setAttribute(`name`, `${item.toLowerCase()}`);

    if (item === 'Age' || item === 'Salary') {
      input.setAttribute('type', 'number');
    } else {
      input.setAttribute('type', 'text');
    }

    input.setAttribute('data-qa', `${item.toLowerCase()}`);
    label.append(input);
  };
  form.append(label.cloneNode(true));
}

form.append(btn);

btn.textContent = 'Save to table';

const inputText = document.querySelectorAll('input');

btn.addEventListener('click', (event2) => {
  event2.preventDefault();

  const cityValue = document.querySelector('#citySelect').value;

  const iName = inputText[0].value;
  const iPosition = inputText[1].value;
  const iOffice = cityValue;
  const iAge = inputText[2].value;
  let iSalary = inputText[3].value;

  if (iName.length < 4) {
    pushNotification(10, 10, 'Error', 'Please, rewrite the '
    + '<b>Name</b> to have more than 4 characters', 'error');
  } else if (iAge < 18 || iAge > 90) {
    pushNotification(10, 10, 'Error', 'Please, rewrite the '
    + '<b>Age</b> to have more than 4 characters', 'error');
  } else if (!iName || !iAge || !iPosition || !iSalary) {
    pushNotification(10, 10, 'Error', 'Please, fill in all fields', 'error');
  } else {
    iSalary = `$${(+iSalary).toLocaleString('ja-JP')}`;

    const row = [iName, iPosition, iOffice, iAge, iSalary];

    const newRow = document.createElement('tr');

    for (let i = 0; i < row.length; i++) {
      td.textContent = `${row[i]}`;
      newRow.append(td.cloneNode(true));
    }

    tBody.append(newRow);

    pushNotification(10, 10, 'Success', 'Congratulations!!! '
    + 'You add a new employee', 'success');

    inputText.forEach((e) => {
      e.value = '';
    });
  }
});

// Notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.classList.add('notification', type);
  div.innerHTML = `<h2>${title}</h2>` + `<p>${description}</p>`;
  div.setAttribute('data-qa', 'notification');
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;
  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
};

// Double-clicking or 'enter' editing

tBody.addEventListener('dblclick', (event3) => {
  const cell = event3.target;

  if (cell.tagName === 'TD') {
    const cellText = cell.textContent;

    cell.textContent = '';
    cell.innerHTML = `<input>`;
    cell.children[0].classList.add('cell-input');

    const cellInput = tBody.querySelector('.cell-input');

    cellInput.addEventListener('keypress', event4 => {
      if (event4.key === 'Enter') {
        const inputValue = cellInput.value;

        if (!inputValue) {
          cell.textContent = cellText;
        } else {
          cell.innerHTML = inputValue;
        }
      }
    });

    cellInput.addEventListener('blur', event5 => {
      if (event5.target.tagName === 'INPUT') {
        const inputValue = cellInput.value;

        if (!inputValue) {
          cell.textContent = cellText;
        } else {
          cell.innerHTML = inputValue;
        }
      }
    });
  }
});

'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

let clickCounter = 0;

thead.addEventListener('click', e => {
  const item = e.target;

  clickCounter++;

  sortFunc(item.textContent, item.cellIndex);
});

tbody.addEventListener('click', e => {
  const item = e.target;

  for (let i = 0; i < tbody.children.length; i++) {
    if (tbody.children[i].classList.value === 'active') {
      tbody.children[i].classList.remove('active');
    }
  }

  item.parentNode.classList.add('active');
});

function sortFunc(type, index) {
  const tr = tbody.querySelectorAll('tr');
  const rowArr = [...tr];

  let compare;

  switch (type) {
    case 'Name':
    case 'Position':
    case 'Office':
      compare = (a, b) => {
        if (clickCounter % 2 === 0) {
          return b.children[index].textContent
            .localeCompare(a.children[index].textContent);
        } else {
          return a.children[index].textContent
            .localeCompare(b.children[index].textContent);
        }
      };
      break;

    case 'Age':
      compare = (a, b) => {
        if (clickCounter % 2 === 0) {
          return b.children[index].textContent - a.children[index].textContent;
        } else {
          return a.children[index].textContent - b.children[index].textContent;
        }
      };
      break;

    case 'Salary':
      compare = (a, b) => {
        const rowA = a.children[index].textContent
          .split('$').join('').split(',').join('');
        const rowB = b.children[index].textContent
          .split('$').join('').split(',').join('');

        if (clickCounter % 2 === 0) {
          return rowB - rowA;
        } else {
          return rowA - rowB;
        }
      };
      break;
  }

  rowArr.sort(compare);

  tbody.append(...rowArr);
}

const form = document.createElement('form');
const body = document.querySelector('body');
const button = document.createElement('button');
const select = document.createElement('select');

button.setAttribute('name', 'button');
button.setAttribute('type', 'button');
button.innerHTML = 'Save to table';
form.setAttribute('class', 'new-employee-form');
body.append(form);

const namesArr = ['name', 'position', 'office', 'age', 'salary'];
const namesMass = ['Name:', 'Position:', 'Office:', 'Age:', 'Salary:'];
const selectOptions
  = [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

for (let i = 0; i < namesArr.length; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.setAttribute('required', '');
  input.setAttribute('name', namesArr[i]);
  input.setAttribute('type', 'text');
  input.setAttribute('data-qa', namesArr[i]);
  label.innerHTML = namesMass[i];
  label.append(input);
  form.append(label);

  if (input.name === 'office') {
    input.remove();

    select.setAttribute('required', '');
    select.setAttribute('name', 'office');
    select.setAttribute('data-qa', 'office');

    for (let j = 0; j < selectOptions.length; j++) {
      const option = document.createElement('option');

      option.innerHTML = selectOptions[j];

      select.append(option);
    }
    label.append(select);
  }

  if (input.name === 'age' || input.name === 'salary') {
    input.type = 'number';
  }
}

form.append(button);

button.addEventListener('click', e => {
  const item = e.target;

  if (item) {
    return fillTable();
  }
});

function fillTable() {
  const row = tbody.insertRow(tbody.children.length);
  const cellOne = row.insertCell(0);
  const cellTwo = row.insertCell(1);
  const cellThree = row.insertCell(2);
  const cellFour = row.insertCell(3);
  const cellFive = row.insertCell(4);

  cellOne.innerText = form.querySelector('[name = "name"]').value;
  cellTwo.innerText = form.querySelector('[name = "position"]').value;
  cellThree.innerText = form.querySelector('[name = "office"]').value;
  cellFour.innerText = form.querySelector('[name = "age"]').value;

  cellFive.innerText = '$' + new Intl.NumberFormat('en-Us')
    .format(form.querySelector('[name = "salary"]').value);

  if (cellOne.innerText.length === 0
    && cellTwo.innerText.length === 0
    && cellFour.innerText === ''
    && cellFive.innerText === '$0') {
    row.remove();
    notification('All fields are required', 'warning');
  } else {
    if (cellOne.innerText.length < 4) {
      row.remove();

      notification('Name must be more than 3 letters', 'error');

      return;
    }

    if (cellTwo.innerText.length < 2) {
      row.remove();

      notification('Position is undefined', 'error');

      return;
    }

    if (cellFour.innerText < 18 || cellFour.innerText > 90) {
      row.remove();

      notification('Age is not less then 18 and not more then 90', 'error');

      return;
    }

    if (cellFive.innerText === '$0') {
      row.remove();

      notification('Salary is undefined', 'error');
    }
  }
}

function notification(title, type) {
  const block = document.createElement('div');
  const titleElement = document.createElement('h1');

  titleElement.classList = 'title';
  titleElement.innerText = title;
  block.setAttribute('class', `notification ${type}`);
  block.setAttribute('data-qa', 'notification');
  block.append(titleElement);
  body.append(block);

  setTimeout(() => block.remove(), 2000);
}

tbody.addEventListener('dblclick', e => {
  const input = document.createElement('input');
  const el = e.target;

  input.setAttribute('class', 'cell-input');
  input.value = el.innerHTML;
  el.innerHTML = '';
  el.append(input);
  input.focus();

  input.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      el.innerHTML = input.value;
      input.blur();
    }
  });

  tbody.addEventListener('click', (eve) => {
    if (eve.target !== undefined) {
      el.innerHTML = input.value;
      input.blur();
    }
  });
});

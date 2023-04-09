'use strict';

const table = document.querySelector('table');

let countForSort = 0;

table.addEventListener('click', (e) => {
  const colum = e.target;

  if (colum.tagName !== 'TH') {
    return false;
  }

  sortRows(table, colum.cellIndex);
  countForSort++;
});

function sortRows(tab, row) {
  const rowArray = Array.from(tab.rows).slice(1, tab.rows.length - 1);
  const result = rowArray.sort((a, b) => {
    let one = a.cells[row].innerText.replace(/\W/g, '');
    let two = b.cells[row].innerText.replace(/\W/g, '');

    if (countForSort % 2 !== 0) {
      one = b.cells[row].innerText.replace(/\W/g, '');
      two = a.cells[row].innerText.replace(/\W/g, '');
    }

    if (!isNaN(one)) {
      return one - two;
    }

    return one.localeCompare(two);
  });

  // console.log(rowArray)

  table.tBodies[0].append(...result);
};

table.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TD') {
    return false;
  }

  [...table.tBodies[0].children].forEach((item) => {
    if (item.classList.contains('active')) {
      item.classList.remove('active');
    } else {
      e.target.parentElement.classList.add('active');
    }
  });
});

// create form
const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.append(form);

function addInput(type, nameInput) {
  const label = document.createElement('label');

  label.innerText = nameInput[0].toUpperCase() + nameInput.slice(1) + ':';

  const input = document.createElement('input');

  input.classList.add(`input_${nameInput}`);

  input.setAttribute('type', type);
  input.setAttribute('name', nameInput);
  input.dataset.qa = nameInput;

  label.append(input);

  form.append(label);
}

addInput('text', 'name');
addInput('text', 'position');

const labelOffice = document.createElement('label');

labelOffice.innerText = 'Office:';

const inputOffice = document.createElement('select');

function addOptionOffice(optionName) {
  const option = document.createElement('option');

  option.setAttribute('value', optionName);

  const text = document.createTextNode(optionName);

  option.append(text);
  inputOffice.appendChild(option);
}

addOptionOffice('Tokyo');
addOptionOffice('Singapore');
addOptionOffice('London');
addOptionOffice('New York');
addOptionOffice('Edinburgh');
addOptionOffice('San Francisco');

inputOffice.setAttribute('name', 'office');
inputOffice.dataset.qa = 'office';

labelOffice.append(inputOffice);
form.append(labelOffice);

addInput('number', 'age');
addInput('number', 'salary');

const button = document.createElement('button');

button.innerText = 'Save to table';

form.append(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const inputName = document.querySelector('.input_name').value;
  const inputPosition = document.querySelector('.input_position').value;
  const inputbtnOffice = document.querySelector('select').value;
  const inputAge = document.querySelector('.input_age').value;
  const inputSalary = document.querySelector('.input_salary').value;

  if (inputName.length < 4
    || inputPosition === ''
    || inputAge < 18 || inputAge > 90
    || inputSalary.length < 3) {
    showMessage('error', 'check');
  } else {
    const inputResult = [inputName, inputPosition, inputbtnOffice,
      inputAge, `$${(+inputSalary).toLocaleString('en-US')}`];

    addPerson(inputResult);

    showMessage('success', 'Person added to table');
    form.reset();
  }
});

const showMessage = (title, messag) => {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';

  const messageTitle = document.createElement('h2');
  const messageText = document.createElement('p');

  notification.classList.add('notification', title);

  messageTitle.className = 'title';
  messageTitle.textContent = title;

  messageText.textContent = messag;

  notification.append(messageTitle);
  notification.append(messageText);

  const body = document.querySelector('body').appendChild(notification);

  setTimeout(function() {
    body.remove(notification);
  }, 2000);
};

function addPerson(data) {
  const tr = document.createElement('tr');

  data.forEach((item) => {
    const td = document.createElement('td');

    td.innerText = item;
    tr.append(td);
  });

  table.tBodies[0].append(tr);
}

const last = document.querySelectorAll('td');

[...last].forEach((item) => {
  item.parentElement.children[0].classList.add('name');
  item.parentElement.children[1].classList.add('position');
  item.parentElement.children[2].classList.add('office');
  item.parentElement.children[3].classList.add('age');
  item.parentElement.children[4].classList.add('salary');
});

table.addEventListener('dblclick', (e) => {
  if (!e.target.classList.contains('name')
    && !e.target.classList.contains('position')) {
    return false;
  }

  const prev = e.target.innerText;

  const newInput = document.createElement('input');

  e.target.innerText = '';

  e.target.append(newInput);
  newInput.className = 'cell-input';

  newInput.onblur = () => {
    if (newInput.value.trim().length < 4) {
      newInput.value = prev;
      showMessage('error', 'check');
    }
  };
});

table.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('office')) {
    e.target.innerText = '';

    const tableSelect = document.createElement('select');

    tableSelect.className = 'cell-input';

    addTableOptionOffice('Tokyo', tableSelect);
    addTableOptionOffice('Singapore', tableSelect);
    addTableOptionOffice('London', tableSelect);
    addTableOptionOffice('New York', tableSelect);
    addTableOptionOffice('Edinburgh', tableSelect);
    addTableOptionOffice('San Francisco', tableSelect);
  }

  function addTableOptionOffice(optionName, tableOff) {
    const option = document.createElement('option');

    option.setAttribute('value', optionName);

    const text = document.createTextNode(optionName);

    option.append(text);
    tableOff.append(option);
    e.target.append(tableOff);
  };
});

table.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('age')) {
    const prev = e.target.innerText;

    const newInput = document.createElement('input');

    newInput.setAttribute('type', 'number');

    e.target.innerText = '';

    e.target.append(newInput);
    newInput.className = 'cell-input';

    newInput.onblur = () => {
      if (newInput.value < 18 || newInput.value > 90) {
        newInput.value = prev;
        showMessage('error', 'check');
      }
    };
  }
});

table.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('salary')) {
    const prev = e.target.innerText.slice(1).replace(',', '');

    const newInput = document.createElement('input');

    newInput.setAttribute('type', 'number');

    e.target.innerText = '';

    e.target.append(newInput);
    newInput.className = 'cell-input';

    newInput.onblur = () => {
      if (newInput.value.length < 3) {
        newInput.setAttribute('type', 'text');
        newInput.value = `$${(+prev).toLocaleString('en-US')}`;
      } else {
        newInput.setAttribute('type', 'text');
        newInput.value = `$${(+newInput.value).toLocaleString('en-US')}`;
      }
    };
  }
});

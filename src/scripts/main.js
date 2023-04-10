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
    const formatFirst = a.cells[row].innerText.replace(/\W/g, '');
    const formatSecond = b.cells[row].innerText.replace(/\W/g, '');

    const isOdd = countForSort % 2 !== 0;
    const first = isOdd ? formatSecond : formatFirst;
    const second = isOdd ? formatFirst : formatSecond;

    if (isNaN(formatFirst)) {
      return first.localeCompare(second);
    } else {
      return first - second;
    }
  });

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

  if (!isNaN(inputName) || !isNaN(inputPosition)) {
    showMessage('error', 'you can\'t write num in name or position row');
  } else if (inputName.length < 4) {
    showMessage('error', 'check the correctness of the field name data');
  } else if (inputPosition === '') {
    showMessage('error', 'check the correctness of the field position data');
  } else if (inputAge < 18 || inputAge > 90) {
    showMessage('error', 'check the correctness of the field age data');
  } else if (inputSalary.length < 1) {
    showMessage('error', 'check the correctness of the field salary data');
  } else {
    const inputResult = [getName(inputName), getName(inputPosition),
      inputbtnOffice, inputAge, `$${(+inputSalary).toLocaleString('en-US')}`];

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

  newInput.style.width = '90px';

  newInput.setAttribute('type', 'text');

  e.target.innerText = '';

  e.target.append(newInput);
  newInput.className = 'cell-input';
  newInput.focus();

  newInput.addEventListener('blur', () => {
    if (newInput.value.trim().length < 4 || typeof +newInput === 'number') {
      e.target.innerText = prev;

      showMessage('error', `check the correctness of the data,
      there can only be letters`);
    } else {
      e.target.innerText = getName(newInput.value);
      newInput.blur();
    }
  });

  newInput.onkeydown = (evt) => {
    if (evt.key === 'Enter') {
      if (newInput.value.trim().length < 4 || typeof +newInput === 'number') {
        newInput.value = prev;

        showMessage('error', `check the correctness of the data,
        there can only be letters`);
      }
      e.target.innerText = getName(newInput.value);
      newInput.blur();
    }
  };
});

table.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('office')) {
    e.target.innerText = '';

    const tableSelect = document.createElement('select');

    tableSelect.style.width = '90px';

    tableSelect.className = 'cell-input';

    addTableOptionOffice('Tokyo', tableSelect);
    addTableOptionOffice('Singapore', tableSelect);
    addTableOptionOffice('London', tableSelect);
    addTableOptionOffice('New York', tableSelect);
    addTableOptionOffice('Edinburgh', tableSelect);
    addTableOptionOffice('San Francisco', tableSelect);
    tableSelect.focus();

    tableSelect.onblur = () => {
      e.target.innerText = tableSelect.value;
      tableSelect.blur();
    };
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
    newInput.style.width = '40px';

    e.target.innerText = '';
    e.target.append(newInput);
    newInput.className = 'cell-input';
    newInput.focus();

    newInput.onblur = () => {
      if (newInput.value < 18 || newInput.value > 90) {
        e.target.innerText = prev;
        showMessage('error', 'check the correctness of the age data');
      }
      newInput.blur();
    };

    newInput.onkeydown = (evt) => {
      if (evt.key === 'Enter') {
        if (newInput.value < 18 || newInput.value > 90) {
          newInput.value = prev;
          showMessage('error', 'check the correctness of the age data');
        }
        newInput.blur();
        e.target.innerText = newInput.value;
      }
    };
  }
});

table.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('salary')) {
    const prev = e.target.innerText.replace(/\W/g, '');

    const newInput = document.createElement('input');

    newInput.setAttribute('type', 'number');
    newInput.style.width = '90px';

    e.target.innerText = '';

    e.target.append(newInput);
    newInput.className = 'cell-input';
    newInput.focus();

    newInput.onblur = () => {
      if (newInput.value.length < 1) {
        newInput.setAttribute('type', 'text');
        e.target.innerText = `$${(+prev).toLocaleString('en-US')}`;
        showMessage('error', 'check the correctness of the salary data');
      } else {
        e.target.innerText = `$${(+newInput.value).toLocaleString('en-US')}`;
        newInput.blur();
      }
    };

    newInput.onkeydown = (evt) => {
      if (evt.key === 'Enter') {
        if (newInput.value.length < 1) {
          newInput.setAttribute('type', 'text');
          e.target.innerText = `$${(+prev).toLocaleString('en-US')}`;
          showMessage('error', 'check the correctness of the salary data');
        } else {
          e.target.innerText = `$${(+newInput.value).toLocaleString('en-US')}`;
          newInput.blur();
        }
      }
    };
  }
});

function getName(personName) {
  return personName[0].toLocaleUpperCase() + personName.slice(1);
}

'use strict';

const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const headers = tableHead.querySelectorAll('th');
const tableBody = document.querySelector('tbody');
const headerText = {};
const sortOrder = {};
let rows;
let prevElement;
let count;
let activeRow = tableBody.children[0];
let activeInput = false;
const form = document.createElement('form');
const button = document.createElement('button');

function replace(prev, current, compareCondition) {
  if (compareCondition) {
    count++;

    const prevContent = prev.innerHTML;
    const currentContent = current.innerHTML;

    prev.innerHTML = currentContent;
    current.innerHTML = prevContent;
  }
}

function toNumber(text) {
  return Number(text.split(',').join('').split('$').join(''));
}

function toThousands(number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

form.className = 'new-employee-form';
button.textContent = 'Save to table';
body.append(form);

for (let i = 0; i < [...headers].length; i++) {
  const label = document.createElement('label');
  let field;

  label.textContent = `${headers[i].textContent}:`;
  form.append(label);

  if (label.textContent === 'Office:') {
    field = document.createElement('select');

    field.innerHTML = `
      <option value="value1" selected>Tokyo</option>
      <option value="value2">Singapore</option>
      <option value="value3">London</option>
      <option value="value3">New York</option>
      <option value="value4">Edinburgh</option>
      <option value="value5">San Francisco</option>
    `;
  } else {
    field = document.createElement('input');

    if (label.textContent === 'Age:' || label.textContent === 'Salary:') {
      field.type = 'number';
    } else {
      field.type = 'text';
    }
  }

  field.name = headers[i].textContent.toLocaleLowerCase();
  field.required = true;
  label.append(field);
  form.append(button);

  headerText[headers[i].textContent] = i;
  sortOrder[headers[i].textContent] = false;
}

form.addEventListener('submit', action => {
  const fields = form.querySelectorAll('label');
  const newEmployee = document.createElement('tr');

  function newMessage(title, text, type) {
    const message = document.createElement('div');
    const messageTitle = document.createElement('h2');
    const messageDescription = document.createElement('p');

    message.className = `notification ${type}`;
    message.dataset.qa = 'notification';
    messageTitle.className = 'title';
    messageTitle.style.letterSpacing = '-1.2px';
    messageTitle.textContent = title.toLocaleUpperCase();
    messageDescription.style.margin = '0';
    messageDescription.style.paddingBottom = '16px';
    message.append(messageTitle);
    message.append(messageDescription);
    messageDescription.textContent = text;

    body.append(message);

    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  function removeOldMessage() {
    if (body.lastElementChild.matches('.notification')) {
      body.lastElementChild.remove();
    }
  }

  action.preventDefault();

  [...fields].map(field => {
    const text = document.createElement('td');

    if (field.children[0].matches('select')) {
      const selectedOfficeIndex = field.children[0].selectedIndex;

      text.textContent
        = field.children[0].children[selectedOfficeIndex].textContent;
    } else if (field.children[0].name === 'salary') {
      text.textContent = `$${toThousands(field.children[0].value)}`;
    } else {
      text.textContent = field.children[0].value;
    }

    newEmployee.append(text);
  });

  if (fields[0].children[0].value.length < 4) {
    removeOldMessage();

    newMessage('Invalid name'
      , 'Name length should be more then 3 letters.', 'error');
  } else if (fields[3].children[0].value < 18
      || fields[3].children[0].value > 90) {
    removeOldMessage();

    newMessage('Invalid age'
      , 'Age should be more then 17 years, and less then 91 years.', 'error');
  } else {
    removeOldMessage();

    newMessage('Success'
      , 'New employee was successfully added.', 'success');
    tableBody.append(newEmployee);

    [...fields].map(field => {
      if (!field.children[0].matches('select')) {
        field.children[0].value = null;
      } else {
        field.children[0].children[0].selected = true;
      }
    });
  }
});

tableHead.addEventListener('click', action => {
  rows = tableBody.querySelectorAll('tr');

  const targetElement = action.target;
  const columntIndex = headerText[targetElement.textContent];

  targetElement.className = 'active';

  if (prevElement === targetElement.textContent) {
    sortOrder[targetElement.textContent]
      = !sortOrder[targetElement.textContent];
  } else {
    sortOrder[targetElement.textContent] = true;
  }

  if (!targetElement.matches('th')) {
    return;
  }

  do {
    count = 0;

    [...rows].sort((currentRow, prevRow) => {
      const prevText = prevRow.children[columntIndex].textContent;
      const currentText = currentRow.children[columntIndex].textContent;

      if (prevText[0].match(/[A-Z]/i)) {
        if (sortOrder[targetElement.textContent]) {
          replace(prevRow, currentRow
            , prevText.localeCompare(currentText) === 1);
        } else {
          replace(prevRow, currentRow
            , prevText.localeCompare(currentText) === -1);
        }
      } else {
        const prevNumber = toNumber(prevText);
        const currentNumber = toNumber(currentText);

        if (sortOrder[targetElement.textContent]) {
          replace(prevRow, currentRow
            , prevNumber > currentNumber);
        } else {
          replace(prevRow, currentRow
            , prevNumber < currentNumber);
        }
      }
    });
  } while (count > 0);

  prevElement = targetElement.textContent;
});

tableBody.addEventListener('click', action => {
  const targetRow = action.target.closest('tr');

  if (!targetRow.matches('tr')) {
    return;
  }

  activeRow.className = undefined;
  targetRow.className = 'active';
  activeRow = targetRow;
});

tableBody.addEventListener('dblclick', action => {
  const targetElement = action.target;
  const cellInput = document.createElement('input');
  const activeElement = targetElement;
  const previousText = activeElement.textContent;

  function changeInput(act) {
    tableBody.addEventListener(act, e => {
      const active = e.target;

      if (!active.matches('td')) {
        return;
      }

      if (active !== activeElement) {
        saveInput();
      }
    });
  }

  function saveInput() {
    if (cellInput.value === '') {
      activeElement.textContent = previousText;
    } else {
      activeElement.textContent = cellInput.value;
    }

    cellInput.remove();
    activeInput = false;
  }

  if (!activeElement.matches('td')) {
    return;
  }

  if (activeInput === false) {
    activeInput = true;
    cellInput.className = 'cell-input';
    cellInput.value = activeElement.textContent;
    cellInput.style.width = `${activeElement.clientWidth - (18 * 2)}px`;
    activeElement.textContent = '';
    activeElement.append(cellInput);

    changeInput('click');
    changeInput('dblclick');

    activeElement.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        saveInput();
      }
    });
  }
});

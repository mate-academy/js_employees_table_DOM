'use strict';
import { compareValues, sortFunction} from './sortFunc.js'
import { callbackFunc } from './tableEdit.js'

let cellData;

/*const compareValues = (a, b) => {
  const element1 = (a.innerText).replace(/\$/g, '');
  const element2 = (b.innerText).replace(/\$/g, '');
  const operand1 = parseFloat(element1.replace(/,/g, ''));
  const operand2 = parseFloat(element2.replace(/,/g, ''));

  if (!isNaN(operand1) && !isNaN(operand2)) {
    if (operand1 === operand2) {
      return 0;
    }

    return operand1 > operand2 ? 1 : -1;
  } else {
    return (a.innerText.localeCompare(b.innerText));
  }
};*/

/*const sortFunction = function(cellInx, callback, rowsCollection, flag) {
  let count;

  do {
    count = 0;

    for (let indx = 2; indx < rowsCollection.length - 1; indx++) {
      const a = rowsCollection[indx - 1].cells[cellInx];
      const b = rowsCollection[indx].cells[cellInx];

      if (callback(a, b) > 0 && flag === false) {
        rowsCollection[indx].after(rowsCollection[indx - 1]);
        count++;
      }

      if ((callback(a, b) < 0) && flag === true) {
        rowsCollection[indx].after(rowsCollection[indx - 1]);
        count++;
      }
    }
  } while (count > 0);
};*/

const getEvent = function() {
  let clickCheck = false;

  return function(e) {
    const element = e.target;

    if (element.matches('th')) {
      const rows = table.rows;
      const cellIndex = element.cellIndex;

      sortFunction(cellIndex, compareValues, rows, clickCheck);
      clickCheck = !clickCheck;
    } else if (element.closest('tr')) {
      element.classList.toggle('.active');
    }
  };
};

const createForm = function(className) {
  const arrayOfFields = ['Name', 'Position', 'Age', 'Salary'];
  const arrayOfCities = ['Tokyo', 'Singapore', 'London',
    'New York', 'Edinburgh', 'San Francisco'];
  const form = document.createElement('form');

  form.className = className;
  form.id = 'mainForm';

  form.innerHTML = `${arrayOfFields.map(item =>
    `<label>
     ${item}: <input name='${item}'>
     </label>`).join('')} 
    <button>Save to table</button>`;

  document.body.append(form);

  const label = document.createElement('label');
  const select = document.createElement('select');

  select.setAttribute('name', 'Office');

  select.innerHTML = `${arrayOfCities.map(item =>
    `<option value="${item}">
        ${item}
        </option>`)}`;
  label.innerHTML = 'Office:';
  label.append(select);
  form.children[2].before(label);
  form.elements[3].setAttribute('type', 'number');
  form.elements[4].setAttribute('type', 'number');

  return form;
};

const showNotification = function(type, message) {
  const div = document.createElement('div');

  div.innerHTML = `<h2 class=".title">
  Notification<p>${message}</p></h2>`;
  div.className = 'notification';
  div.classList.toggle(type);
  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

const validateForm = function() {
  let message;

  for (let indx = 0; indx < this.elements.length; indx++) {
    const currentField = this.elements[indx];

    if (currentField.type !== 'text' && currentField.type !== 'number') {
      continue;
    }

    const flag = validateInput(currentField);

    if (flag === -1) {
      message = `Error! Wrong input in 
      "${currentField.name}" field. Check your input!`;
      showNotification('error', message);

      return false;
    }
  }
  message = `Success! All data is correct! Adding row to the table!`;
  showNotification('success', message);

  return true;
};

const validateInput = function(field) {
  let pattern, value, check;

  switch (field.name) {
    case 'Name':
    case 'Position':
      pattern = /^([a-zA-Zа-яёA-ЯË\s]){4,}$/;
      value = field.value;
      check = value.search(pattern);
      break;
    case 'Age':
      value = field.value;

      const num = parseInt(value);

      check = (!(num >= 18 && num <= 90)) ? -1 : 0;
      break;
    case 'Salary':
      value = field.value;
      check = (!value.length) ? -1 : 0;
      break;
  }

  return check;
};

const getDataFromFrom = function(data) {
  const objectFromForm = Object.fromEntries(data.entries());

  for (const prop in objectFromForm) {
    if (prop === 'Name' || prop === 'Position') {
      const tempArray = objectFromForm[prop].split(' ');
      const tempString = tempArray.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1);
      });

      objectFromForm[prop] = tempString.join(' ');
    }

    if (prop === 'Salary') {
      objectFromForm[prop] = `$
      ${Number(objectFromForm[prop]).toLocaleString()}`;
    }
  }

  return objectFromForm;
};

const appendNewRow = function(form, callback) {
  const formDataObj = new FormData(form);
  const transformedObjData = callback(formDataObj);
  const ObjDataArray = Object.values(transformedObjData);
  const newRow = table.rows[1].cloneNode(true);

  for (let cell = 0; cell < newRow.cells.length; cell++) {
    newRow.cells[cell].innerHTML = ObjDataArray[cell];
  }
  table.append(newRow);
};

const processForm = function(e) {
  e.preventDefault();

  if (!validateForm.call(this)) {
    return;
  };

  appendNewRow(mainForm, getDataFromFrom);
};

const editTable = function(e) {
  const element = e.target;

  if (element.matches('td')) {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.type = 'text';
    cellData = element.innerText;
    element.innerHTML = '';
    element.append(input);

    input.addEventListener('keydown', callbackFunc);
    input.addEventListener('focusout', callbackFunc);
  }
};

/*const callbackFunc = function(e) {
  if (e.key !== 'Enter' && e.type !== 'focusout') {
    return;
  }

  const elem = e.path[0].parentElement;
  const input = e.path[0];
  const inputData = e.path[0].value;

  elem.innerHTML = inputData;

  if (inputData === '') {
    elem.innerHTML = cellData;
  }

  return (e.type === 'focusout')
    ? input.removeEventListener('keydown', callbackFunc)
    : input.removeEventListener('focusout', callbackFunc);
};*/

const mainForm = createForm('new-employee-form');
const clicked = getEvent();
const table = document.querySelector('table');

table.addEventListener('click', clicked);
mainForm.addEventListener('submit', processForm);
table.addEventListener('dblclick', editTable);

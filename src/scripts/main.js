'use strict';

const tableHead = document.querySelector('thead');
const allRows = [...document.querySelector('table').rows];
const minAge = 18;
const maxAge = 90;

const sortingColumns = (e) => {
  const updatedAllRows = [...document.querySelector('table').rows];
  const sortByColumn = e.target.innerText;
  const tableDataToSort = [];

  for (let i = 1; i < updatedAllRows.length - 1; i++) {
    const cells = updatedAllRows[i].cells;
    const person = {
      Name: cells[0].innerText,
      Position: cells[1].innerText,
      Office: cells[2].innerText,
      Age: cells[3].innerText,
      Salary: cells[4].innerText,
    };

    tableDataToSort.push(person);
  }

  let sortCallback;
  let sortAscending;

  if (e.target.dataset.clicked === 'true') {
    sortAscending = false;
  } else {
    const clickedTitle = document.querySelector('[data-clicked="true"]');

    if (clickedTitle) {
      clickedTitle.dataset.clicked = false;
    }
    sortAscending = true;
  }

  switch (sortByColumn) {
    case 'Salary':
      sortCallback = (a, b) => {
        const toNumberA = a.Salary.match(/\d+/g).join('');
        const toNumberB = b.Salary.match(/\d+/g).join('');

        return toNumberA - toNumberB;
      };
      break;
    default:
      sortCallback = (a, b) => a[sortByColumn].localeCompare(b[sortByColumn]);
      break;
  }

  tableDataToSort.sort((a, b) => {
    const result = sortCallback(a, b);

    return sortAscending ? result : -result;
  });

  for (let i = 1; i < updatedAllRows.length - 1; i++) {
    const tableRow = updatedAllRows[i];
    const { Name, Position, Office, Age, Salary } = tableDataToSort[i - 1];

    tableRow.innerHTML = `
      <td>${Name}</td>
      <td>${Position}</td>
      <td>${Office}</td>
      <td>${Age}</td>
      <td>${Salary}</td>
    `;
  }

  e.target.dataset.clicked = sortAscending ? 'true' : 'false';
};

tableHead.addEventListener('click', sortingColumns);

const tableBody = document.querySelector('tbody');

const selectRow = (e) => {
  const activatedRow = allRows.find(el => el.className === 'active');
  const pressedRow = e.target.parentElement;

  if (pressedRow.className) {
    pressedRow.className = '';

    return;
  }

  if (activatedRow) {
    activatedRow.className = '';
  }

  pressedRow.className = 'active';
};

tableBody.addEventListener('click', selectRow);

const body = document.body;
const form = document.createElement('form');

for (let i = 0; i < 5; i++) {
  const input = document.createElement('input');
  const label = document.createElement('label');

  input.name = allRows[0].cells[i].innerText.toLocaleLowerCase();
  input.dataset.qa = allRows[0].cells[i].innerText.toLocaleLowerCase();
  input.type = 'text';
  input.setAttribute('required', true);

  label.innerText = allRows[0].cells[i].innerText;
  label.append(input);
  form.append(label);
}

form.className = 'new-employee-form';
body.append(form);

const nameInput = document.querySelector('[data-qa="name"]');
const positionInput = document.querySelector('[data-qa="position"]');
const officeInput = document.querySelector('input[name="office"]');
const ageInput = document.querySelector('[data-qa="age"]');
const salaryInput = document.querySelector('[data-qa="salary"]');

ageInput.type = 'number';
salaryInput.type = 'number';

const officeSelect = document.createElement('select');

const cities = ['Tokyo', 'Singapore', 'London', 'New York',
  'Edinburgh', 'San Francisco'];

for (let i = 0; i < cities.length; i++) {
  const option = document.createElement('option');

  option.text = cities[i];
  officeSelect.appendChild(option);
}

officeSelect.name = allRows[0].cells[2].innerText.toLocaleLowerCase();
officeSelect.dataset.qa = allRows[0].cells[2].innerText.toLocaleLowerCase();

officeInput.replaceWith(officeSelect);

const button = document.createElement('button');

button.innerText = 'Save to table';
form.append(button);

const pushNotification = (type, message) => {
  const block = document.createElement('div');
  const titleBlock = document.createElement('h2');
  const messageBlock = document.createElement('p');

  block.classList.add('notification', type);
  block.dataset.qa = 'notification';

  titleBlock.className = 'title';
  titleBlock.innerText = `${type[0].toUpperCase() + type.slice(1)}`;

  messageBlock.innerText = message;

  block.append(titleBlock);
  block.append(messageBlock);

  block.style.top = `0px`;
  block.style.right = `0px`;

  const parentElement = document.querySelector('body');

  parentElement.append(block);

  setTimeout(() => {
    block.remove();
  }, 2000);
};

const buttonHandler = (e) => {
  e.preventDefault();

  const newPerosn = {};

  newPerosn.Name = nameInput.value;
  newPerosn.Position = positionInput.value;
  newPerosn.Office = officeSelect.value;
  newPerosn.Age = ageInput.value;
  newPerosn.Salary = `$${Number(salaryInput.value).toLocaleString()}`;

  const newRow = document.createElement('tr');

  for (const key in newPerosn) {
    const newTd = document.createElement('td');

    newTd.innerText = newPerosn[key];
    newRow.append(newTd);
  }

  if (!newPerosn.Name.trim() || newPerosn.Name.length < 4) {
    pushNotification('error',
      'Name can\'t be empty string or shorter than 4 characters');

    return;
  }

  if (!newPerosn.Position.trim()) {
    pushNotification('error', 'Position can\'t be empty string');

    return;
  }

  if (newPerosn.Age < minAge || newPerosn.Age > maxAge) {
    pushNotification('error', 'Age must be greater 18 and bellow 90');

    return;
  }

  if (Number(salaryInput.value < 0 || !salaryInput.value.trim())) {
    pushNotification('error', 'Salary can\'t be less than $0 or empty field');

    return;
  }

  tableBody.append(newRow);
  pushNotification('success', 'Person is successfully added to the table!');

  form.reset();
};

button.addEventListener('click', buttonHandler);

const editCells = (e) => {
  const target = e.target;
  const cellIndex = target.cellIndex;
  const originalText = target.innerHTML;
  const newInput = document.createElement('input');
  const newSelect = document.createElement('select');
  const cellInput = cellIndex === 2 ? newSelect : newInput;

  cellInput.className = 'cell-input';

  const nameColumn = 0;
  const officeColumn = 2;
  const ageGolumn = 3;
  const salaryColumn = 4;

  target.innerText = '';

  if (cellIndex === ageGolumn) {
    cellInput.style.width = '30px';
  }

  if (cellIndex === officeColumn) {
    cellInput.style.width = '60px';

    newSelect.innerHTML = `
      <option selected disabled=true">Please choose the city</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `;

    target.append(newSelect);
    cellInput.focus();
  } else {
    cellInput.value = originalText;
    target.append(cellInput);
    cellInput.focus();
  }

  const cellEditHandler = () => {
    if (cellIndex === officeColumn) {
      if (cellInput.value === 'Please choose the city') {
        target.innerText = originalText;

        return;
      }
    }

    if ((cellIndex === ageGolumn || cellIndex === salaryColumn)
      && !+(cellInput.value.match(/\d+/g).join(''))) {
      e.target.innerText = originalText;

      pushNotification('error',
        'Only numbers for Age and Salary fields. Thank you!');

      return;
    };

    if (cellIndex === ageGolumn
      && (cellInput.value < minAge || cellInput.value > maxAge)) {
      e.target.innerText = originalText;
      pushNotification('error', 'Age must be greater 18 and bellow 90');

      return;
    }

    if (cellIndex === salaryColumn) {
      let cellInputValue = cellInput.value;

      if (cellInput.value.includes('$')) {
        cellInputValue = cellInput.value.match(/\d+/g).join('');
      }

      if (Number(cellInputValue) < 0) {
        target.innerText = originalText;
        pushNotification('error', 'Salary can\'t be less than $0');

        return;
      }

      target.innerText = `$${Number(cellInputValue).toLocaleString()}`;
    } else {
      target.innerText = cellInput.value || originalText;
    }

    if (cellIndex === nameColumn && cellInput.value.length < 4) {
      pushNotification('error',
        'Name can\'t be empty string or shorter than 4 characters');

      target.innerText = originalText;

      return;
    }

    if (!target.innerText.trim()) {
      target.innerText = originalText;
      pushNotification('error', 'Table data can\'t be empty string');
    }

    cellInput.replaceWith(target.innerText);
    cellInput.blur();
  };

  cellInput.onblur = cellEditHandler;

  cellInput.onkeydown = (eve) => {
    if (eve.key === 'Enter') {
      cellEditHandler();
    };
  };
};

tableBody.addEventListener('dblclick', editCells);

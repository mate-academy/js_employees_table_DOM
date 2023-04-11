'use strict';

const tableHead = document.querySelector('thead');
const allRows = [...document.querySelector('table').rows];

const sortingColumns = (e) => {
  const updatedAllRows = [...document.querySelector('table').rows];
  const sortByColumn = e.target.innerText;
  const tableDataToSort = [];

  for (let i = 1; i < updatedAllRows.length - 1; i++) {
    const cells = updatedAllRows[i].cells;
    const person = {};

    person.Name = cells[0].innerText;
    person.Position = cells[1].innerText;
    person.Office = cells[2].innerText;
    person.Age = cells[3].innerText;
    person.Salary = cells[4].innerText;

    tableDataToSort.push(person);
  }

  if (e.target.dataset.clicked === 'true') {
    if (sortByColumn === 'Salary') {
      tableDataToSort.sort((a, b) => {
        const toNumberA = a.Salary.match(/\d+/g).join('');
        const toNumberB = b.Salary.match(/\d+/g).join('');

        return toNumberB - toNumberA;
      });
    } else {
      tableDataToSort.sort((a, b) =>
        b[sortByColumn].localeCompare(a[sortByColumn]));
    }
    e.target.dataset.clicked = false;
  } else {
    const clicedTitile = document.querySelector('[data-clicked="true"]');

    if (clicedTitile) {
      clicedTitile.dataset.clicked = false;
    }

    if (sortByColumn === 'Salary') {
      tableDataToSort.sort((a, b) => {
        const toNumberA = a.Salary.match(/\d+/g).join('');
        const toNumberB = b.Salary.match(/\d+/g).join('');

        return toNumberA - toNumberB;
      });
    } else {
      tableDataToSort.sort((a, b) =>
        a[sortByColumn].localeCompare(b[sortByColumn]));
    }
    e.target.dataset.clicked = true;
  }

  for (let i = 1; i < updatedAllRows.length - 1; i++) {
    const tableRow = updatedAllRows[i];

    tableRow.innerHTML = `
      <td>${tableDataToSort[i - 1].Name}</td>
      <td>${tableDataToSort[i - 1].Position}</td>
      <td>${tableDataToSort[i - 1].Office}</td>
      <td>${tableDataToSort[i - 1].Age}</td>
      <td>${tableDataToSort[i - 1].Salary}</td>
    `;
  }
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

  if (newPerosn.Age < 18 || newPerosn.Age > 90) {
    pushNotification('error', 'Age must be greater 18 and bellow 90');

    return;
  }

  tableBody.append(newRow);
  pushNotification('success', 'Person is successfully added to the table!');
};

button.addEventListener('click', buttonHandler);

const editCells = (e) => {
  const target = e.target;
  const cellInput = document.createElement('input');
  const originalText = target.innerHTML;

  cellInput.style.width = '50px';
  target.innerText = '';
  cellInput.className = 'cell-input';
  target.append(cellInput);
  cellInput.focus();

  const cellEditHandler = () => {
    const cellIndex = target.cellIndex;

    if (cellIndex === 3 || cellIndex === 4) {
      if (!+cellInput.value) {
        e.target.innerText = originalText;

        pushNotification('error',
          'Only numbers for Age and Salary fields. Thank you!');

        return;
      };
    };

    if (cellIndex === 3) {
      if (cellInput.value < 18 || cellInput.value > 90) {
        e.target.innerText = originalText;
        pushNotification('error', 'Age must be greater 18 and bellow 90');

        return;
      }
    }

    if (cellIndex === 4) {
      target.innerText = `$${Number(cellInput.value).toLocaleString()}`;
    } else {
      target.innerText = cellInput.value || originalText;
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

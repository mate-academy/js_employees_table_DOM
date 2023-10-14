'use strict';

// write code here
const body = document.querySelector('body');
const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const form = document.createElement('form');
const button = document.createElement('button');
const formLableName = [...table.rows[0].cells];
const selectValues = [
  `Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];
let addSwitcher = true;
let prevRow = document.createElement('tr');
let prevItem;
let clickCount = 2;

prevRow.className = 'active';
form.className = 'new-employee-form';

const pushNotification = (posTop, posRight, title, description, type) => {
  const infoBlock = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  infoBlock.classList.add('notification');
  infoBlock.classList.add(`${type}`);
  messageTitle.classList.add('title');

  messageTitle.textContent = title;
  messageDescription.textContent = description;

  infoBlock.style.width = '315px';
  infoBlock.style.right = `${posRight}px`;
  infoBlock.style.top = `${posTop}px`;

  infoBlock.appendChild(messageTitle);
  infoBlock.appendChild(messageDescription);
  body.appendChild(infoBlock);

  setTimeout(() => {
    body.removeChild(infoBlock);
  }, 2000);
};

const showError = function() {
  pushNotification(10, 10, 'Error',
    'Houston we have trubles!\n '
  + 'Check inputs values again.', 'error');

  addSwitcher = false;
};

const showSuccess = function() {
  pushNotification(10, 10, 'Success',
    'All good! \n'
  + 'New employee added to list.', 'success');
};

const nameRequire = function(personName) {
  if (personName.length < 4) {
    showError();
  }

  for (const letter of personName) {
    if (letter.toLowerCase() === letter.toUpperCase()) {
      showError();
    }
  }
};

const ageRequire = function(personAge) {
  if (+personAge < 18 || +personAge > 90) {
    showError();
  }
};

const startTableBody = document.querySelector('tbody');

let arr = [...startTableBody.rows];

const convertToNumber = function(letters) {
  let correctSalary = '';

  for (const letter of letters) {
    if (letter !== '$' && letter !== ',') {
      correctSalary += letter;
    }
  }

  return +correctSalary;
};

const convertToString = function(str) {
  return str.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
};

formLableName.forEach((element, index) => {
  const lable = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');

  lable.textContent = `${element.textContent}:`;

  selectValues.forEach(city => {
    const option = document.createElement('option');

    option.textContent = city;
    select.append(option);
  });

  if (element.textContent !== 'Office') {
    lable.append(input);
  } else {
    lable.append(select);
  }

  input.name = `${element.textContent.toLowerCase()}`;
  select.name = `${element.textContent.toLowerCase()}`;
  input.dataset.qa = `${element.textContent.toLowerCase()}`;
  select.dataset.qa = `${element.textContent.toLowerCase()}`;

  if (index === 3 || index === 4) {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  form.append(lable);
});

button.textContent = 'Save to table';

form.append(button);

body.append(form);

let hasActive = false;

const newFunction = function() {
  const newTd = document.querySelectorAll('td');

  [...newTd].forEach((cell, index) => {
    cell.addEventListener('dblclick', function func(e) {
      const item = e.target;
      const input = document.createElement('input');
      const itemText = item.innerHTML;

      if (hasActive) {
        return;
      }

      hasActive = true;

      input.className = 'cell-input';
      input.value = itemText;
      item.innerHTML = '';
      item.appendChild(input);

      input.addEventListener('blur', action => {
        const actionItem = action.target;

        item.innerHTML = actionItem.value;

        if (actionItem.value === '') {
          item.innerHTML = itemText;
        }

        hasActive = false;

        item.addEventListener('dblclick', func);
      });

      input.addEventListener('keyup', action => {
        if (action.code === 'Enter') {
          const actionItem = action.target;

          hasActive = false;

          item.innerHTML = actionItem.value;

          if (actionItem.value === '') {
            item.innerHTML = itemText;
          }

          item.addEventListener('dblclick', func);
        }
      });

      item.removeEventListener('dblclick', func);
    });
  });
};

newFunction();

form.addEventListener('submit', e => {
  e.preventDefault();

  addSwitcher = true;

  const tBody = document.querySelector('tbody');
  const newPerson = document.createElement('tr');
  const myformData = new FormData(form);

  for (const data of myformData) {
    const personInfo = document.createElement('td');

    if (data[0] === 'salary') {
      personInfo.textContent = convertToString(+data[1]);
    } else {
      personInfo.textContent = data[1];
    }

    newPerson.append(personInfo);
  }

  const cellsOfNewPerson = [...newPerson.cells];

  newPerson.lastChild.textContent
  = convertToString(newPerson.lastChild.textContent);

  cellsOfNewPerson.forEach((cell, index) => {
    switch (index) {
      case 0:
        nameRequire(cell.textContent);
        break;

      case 3:
        ageRequire(cell.textContent);
        break;
    }

    if (cell.textContent.length === 0) {
      showError();
    }
  }
  );

  if (addSwitcher === true) {
    tBody.append(newPerson);

    showSuccess();
    form.reset();
  }

  arr = [...tableBody.rows];

  newFunction();
});

const sortList = function(index) {
  const compare = function(rowA, rowB) {
    let rowAContent = rowA.cells[index].innerHTML;
    let rowBContent = rowB.cells[index].innerHTML;

    if (index === 4) {
      rowAContent = convertToNumber(rowA.cells[index].innerHTML);
      rowBContent = convertToNumber(rowB.cells[index].innerHTML);
    }

    if (clickCount % 2 === 0) {
      switch (index) {
        case 0:
        case 1:
        case 2:
          return rowAContent.localeCompare(rowBContent);
        case 3:
        case 4:
          return rowBContent - rowAContent;
      }
    } else {
      switch (index) {
        case 0:
        case 1:
        case 2:
          return rowBContent.localeCompare(rowAContent);
        case 3:
        case 4:
          return rowAContent - rowBContent;
      }
    }
  };

  arr.sort(compare);

  table.removeChild(tableBody);

  for (let i = 0; i < arr.length; i++) {
    tableBody.appendChild(arr[i]);
  }

  table.appendChild(tableBody);
};

table.rows[0].addEventListener('click', e => {
  const item = e.target;

  if (prevItem !== item) {
    clickCount = 2;
  } else {
    clickCount++;
  }

  const itemIndex = item.cellIndex;

  prevItem = item;

  sortList(itemIndex);
});

tableBody.addEventListener('click', e => {
  const item = e.target;

  item.parentElement.classList.add('active');

  if (prevRow !== item.parentElement) {
    prevRow.classList.remove('active');
  }

  prevRow = item.parentElement;
}
);

'use strict';

const personArray = document.querySelector('tbody');
const namesColumnArray = document.querySelector('thead');

// Table sorting by clicking on the title

function getNumberFromString(value) {
  const result = Number(
    value.replace(/,/g, '').replace('$', '')
  );

  return result;
}

function sortListASC(columnN) {
  const newPersonArray = [...personArray.children].sort((a, b) => {
    const value = a.children[columnN].innerText;
    const nextValue = b.children[columnN].innerText;

    if (!isNaN(getNumberFromString(value))) {
      return getNumberFromString(value) - getNumberFromString(nextValue);
    }

    return value.localeCompare(nextValue);
  });

  newPersonArray.forEach(person => personArray.append(person));
}

const isClickedArray = [];

namesColumnArray.addEventListener('click', (e) => {
  const titles = e.target.parentElement.children;

  if (!e.target.matches('th')) {
    return;
  }

  const i = [...titles].indexOf(e.target);

  const column = isClickedArray.find(item => {
    return item === e.target.innerText;
  });

  if (!column) {
    sortListASC(i);
    isClickedArray.push(e.target.innerText);
  } else {
    [...personArray.children].reverse().forEach(item => {
      item.parentNode.append(item);
    });
  }
}, true);

// Selected row.

personArray.addEventListener('click', (e) => {
  if (!e.target.matches('td')) {
    return;
  }

  const selectedPerson = personArray.querySelector('.active');

  if (selectedPerson !== null) {
    selectedPerson.classList.remove('active');
  }

  e.target.parentElement.classList.add('active');
});

// Adding new employees to the spreadsheet.

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

const objInput = {
  'Name': 'text',
  'Position': 'text',
  'Office':
    [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`],
  'Age': 'number',
  'Salary': 'number',
};

for (const element in objInput) {
  const label = document.createElement('label');

  if (element !== 'Office') {
    label.innerHTML = `
    ${element}: <input name="name" type="${objInput[element]}">
  `;
  }

  if (element === 'Office') {
    label.innerHTML += `
    ${element}:
    <select name ="office">
      ${objInput[element].map(el => {
    return `<option>${el}</option>`;
  }).join('')}
    </select>
  `;
  }

  label.setAttribute('data-qa', element.toLowerCase());

  form.append(label);

  objInput[element] = label;
}

const button = document.createElement('button');

button.innerText = 'Save to table';
button.type = 'submit';

form.append(button);

// Notification if form data is invalid.

const pushNotification = (posTop, posRight, title, description, type) => {
  const elementMessage = document.createElement('div');

  elementMessage.classList.add(type, 'notification');

  function createNewElement(element, textOfElement) {
    const creatElem = document.createElement(element);

    creatElem.innerHTML = `${textOfElement.replace('.', '. </br>')}`;
    creatElem.setAttribute('data-qa', 'notification');
    elementMessage.append(creatElem);

    return creatElem;
  }

  const titleElement = createNewElement('h2', title);

  titleElement.className = 'title';

  createNewElement('p', description);

  document.body.append(elementMessage);

  elementMessage.style.right
    = `${parseFloat(getComputedStyle(elementMessage).right) + posRight}px`;

  elementMessage.style.top
    = `${window.screen.height
      - parseFloat(getComputedStyle(elementMessage).height) + posTop}px`;
  elementMessage.style.boxSizing = 'content-box';

  setTimeout(() => {
    elementMessage.remove();
  }, 2000);
};

let textNotification = '';

function checkValue(columnN, cellValue) {
  if (cellValue === '') {
    textNotification
      += 'Fill in all the details. ';
  }

  if (columnN === 0 && cellValue.length < 4) {
    textNotification
      += 'The number of letters in the name must be more than 4.';
  }

  if (columnN === 3 && (cellValue < 18 || cellValue > 90)) {
    textNotification += ' Age must be between 18 and 90 years old. ';
  }

  if (columnN !== 0 && columnN !== 3) {
    textNotification += '';
  }

  return textNotification;
}

button.addEventListener('click', (e) => {
  e.preventDefault();

  const row = document.createElement('tr');

  let count = 0;
  let checked = 0;

  for (const element in objInput) {
    const cell = document.createElement('td');

    let textValue = objInput[element].firstElementChild.value;

    if (objInput[element].dataset.qa === 'salary') {
      textValue
        = `$${Number(objInput[element]
          .firstElementChild.value).toLocaleString('en-US')}`;
    }

    if (checkValue(count, textValue) === '') {
      cell.innerText = textValue;
      row.append(cell);
      checked++;
    }

    count++;
  }

  if (count === checked) {
    personArray.append(row);

    pushNotification(10, 10, 'Data entered correctly',
      'Data added to table.', 'success');
  } else {
    pushNotification(10, 10, 'Data entered incorrectly',
      `${textNotification}`, 'error');

    textNotification = '';
  }

  for (const element in objInput) {
    objInput[element].firstElementChild.value = '';
  }
});

// Editing of table cells by double-clicking on it (optional).

function createNewCell(target, initialValue, newTextString) {
  if ((target.parentElement.lastElementChild === target
        && Number.isNaN(getNumberFromString(newTextString)))
      || (target.parentElement.lastElementChild.previousElementSibling
          === target
        && Number.isNaN(Number(newTextString)))
  ) {
    return pushNotification(10, 10, 'Data entered incorrectly',
      `Data must be a number`, 'error');
  }

  if (target.parentElement.firstElementChild === target
    && newTextString.length < 4) {
    return pushNotification(10, 10, 'Data entered incorrectly',
      `The number of letters in the name must be more than 4.`, 'error');
  }

  if (target.parentElement.lastElementChild.previousElementSibling
      === target
    && (newTextString < 18 || newTextString > 90)) {
    return pushNotification(10, 10, 'Data entered incorrectly',
      `Age must be between 18 and 90 years old.`, 'error');
  }

  initialValue.remove();
  target.classList.remove('cell-input');
  target.innerText = newTextString;
}

personArray.addEventListener('dblclick', (e) => {
  const selectedCell = personArray.querySelector('input');
  let newText = e.target.innerText;

  if (!e.target.matches('td') || selectedCell !== null) {
    return;
  }

  const cell = document.createElement('input');

  e.target.innerText = '';
  e.target.append(cell);

  e.target.classList.add('cell-input');

  e.target.addEventListener('blur', () => {
    createNewCell(e.target, cell, newText);
  }, true);

  e.target.addEventListener('keydown', (ev) => {
    if (cell.value !== '') {
      newText = cell.value;
    }

    if (e.target.parentElement.lastElementChild === e.target) {
      newText = `$${Number(newText).toLocaleString('en-US')}`;
    }

    if (ev.code === 'Enter') {
      createNewCell(e.target, cell, newText);
    }
  });
});

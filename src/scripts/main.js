'use strict';

// #region variables
const body = document.body;
const headings = [...document.querySelectorAll('thead th')].map(
  (elem) => elem.textContent,
);
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let clickCounter = 0;
let prevClicked = '';
let prevRow;

// #endregion
const createOptionsSelect = () => {
  const select = document.querySelector('[data-qa=office]');

  const options = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  options.forEach((city) => {
    const option = document.createElement('option');

    option.textContent = city;
    select.add(option);
  });
};

const createForm = () => {
  const button = document.createElement('button');
  const form = document.createElement('form');
  const inputName = ['name', 'position', 'office', 'age', 'salary'];

  form.classList.add('new-employee-form');

  for (let i = 0; i < inputName.length; i++) {
    const label = document.createElement('label');
    const elemToAdd =
      i === 2
        ? document.createElement('select')
        : document.createElement('input');

    if (elemToAdd.tagName === 'INPUT') {
      elemToAdd.setAttribute('type', 'text');
    }

    elemToAdd.setAttribute('name', inputName[i]);
    elemToAdd.setAttribute('data-qa', inputName[i]);

    const lblTextContent =
      inputName[i].slice(0, 1).toUpperCase() + inputName[i].slice(1);

    label.textContent = lblTextContent + ':';
    label.append(elemToAdd);
    form.append(label);
  }
  button.textContent = 'Save to table';
  form.append(button);

  body.append(form);
  createOptionsSelect();
};

createForm();

// #region listeners
thead.addEventListener('click', (e) => {
  const actualBody = document.querySelector('tbody');
  const rows = [...document.querySelectorAll('tbody tr')];
  const headClicked = e.target.textContent;
  const indexHead = headings.indexOf(headClicked);

  if (prevClicked !== headClicked) {
    clickCounter = 0;
  }

  clickCounter++;

  const sortedRow = rows.sort((elem1, elem2) => {
    const value1 = elem1.children[indexHead].textContent;
    const value2 = elem2.children[indexHead].textContent;
    const howTowSort = clickCounter % 2 !== 0;

    if (indexHead === 3 || indexHead === 4) {
      const num1 = indexHead === 4 ? +value1.replace(/[^0-9]+/g, '') : +value1;
      const num2 = indexHead === 4 ? +value2.replace(/[^0-9]+/g, '') : +value2;

      return howTowSort ? num1 - num2 : num2 - num1;
    }

    return howTowSort
      ? value1.localeCompare(value2)
      : value2.localeCompare(value1);
  });

  actualBody.innerHTML = '';

  sortedRow.forEach((row) => {
    actualBody.append(row);
  });
  prevClicked = headClicked;
});

tbody.addEventListener('click', (e) => {
  const selectedElem = e.target;
  const rows = [...document.querySelectorAll('tbody tr')];

  if (prevRow !== undefined) {
    prevRow.classList.remove('active');
  }

  const row = rows.find((elem) => {
    const childrenOfRow = [...elem.children];

    return childrenOfRow[childrenOfRow.indexOf(selectedElem)];
  });

  row.classList.toggle('active');
  prevRow = row;
});

tbody.addEventListener('dblclick', (e) => {
  const selectedElem = e.target;
  const oldText = e.target.textContent;
  const newValue = document.createElement('input');

  newValue.classList.add('cell-input');
  newValue.value = selectedElem.textContent;

  const row = selectedElem.closest('tr');

  if (row) {
    selectedElem.textContent = '';
    selectedElem.appendChild(newValue);
    newValue.focus();

    ['blur', 'keydown'].forEach((value) => {
      newValue.addEventListener(value, (keyPress) => {
        if (
          value === 'blur' ||
          (value === 'keydown' && keyPress.key === 'Enter')
        ) {
          selectedElem.textContent =
            newValue.value === '' ? oldText : newValue.value;
        }
      });
    });
  }
});
// #endregion

const buttonAdd = document.querySelector('form button');

buttonAdd.addEventListener('click', (e) => {
  e.preventDefault();

  let isValid = false;
  const valuesToAdd = [];
  const elemForm = document.querySelectorAll('[data-qa]');

  elemForm.forEach((elem) => {
    valuesToAdd[valuesToAdd.length] = elem.value;
  });

  if (validData(valuesToAdd)) {
    isValid = true;
    valuesToAdd[4] = '$' + Number(valuesToAdd[4]).toLocaleString('en-us');

    const newRow = document.createElement('tr');

    valuesToAdd.forEach((value) => {
      const column = document.createElement('td');

      column.textContent = value;
      newRow.append(column);
    });
    tbody.append(newRow);
  }

  const div = document.createElement('div');
  const divTitle = document.createElement('h1');

  divTitle.classList.add('title');
  div.classList.add('notification');
  div.setAttribute('data-qa', 'notification');

  if (isValid) {
    div.classList.add('success');
    divTitle.textContent = 'Success!';
  } else {
    div.classList.add('error');
    divTitle.textContent = 'Error!';
  }
  div.append(divTitle);
  body.append(div);
  setTimeout(() => div.remove(), 3000);
});

const validData = (array) => {
  const [nameFromArray, position, office, age, salary] = array;
  const div = document.createElement('div');

  div.classList.add('notification');
  div.setAttribute('data-qa', 'notification');

  if (
    nameFromArray.length < 4 ||
    +age < 18 ||
    +age > 90 ||
    isNaN(age) ||
    position === '' ||
    office === '' ||
    salary === '' ||
    isNaN(salary)
  ) {
    return false;
  }

  return true;
};

/* eslint-disable no-shadow */
/* eslint-disable function-paren-newline */
'use strict';

const table = document.querySelector('table');
const thead = table.tHead.rows[0];

// #region cells

const nameCell = thead.cells[0];
const positionCell = thead.cells[1];
const officeCell = thead.cells[2];
const ageCell = thead.cells[3];
const salaryCell = thead.cells[4];

// #endregion

const tbody = table.tBodies[0].rows;
const tbodyArr = [...tbody];

// #region add 'active' class for tr

table.tBodies[0].addEventListener('click', (_event) => {
  const targetElement = _event.target.closest('tr');

  tbodyArr.forEach((row) => row.classList.remove('active'));

  targetElement.classList.add('active');
});

// #endregion
// #region add sort on click

let isClicked = true;

thead.addEventListener('click', (_event) => {
  switch (_event.target) {
    case nameCell:
      if (isClicked) {
        sortByString(true, 0);
      } else {
        sortByString(false, 0);
      }

      break;
    case positionCell:
      if (isClicked) {
        sortByString(true, 1);
      } else {
        sortByString(false, 1);
      }

      break;
    case officeCell:
      if (isClicked) {
        sortByString(true, 2);
      } else {
        sortByString(false, 2);
      }

      break;
    case ageCell:
      if (isClicked) {
        sortByAge(true);
      } else {
        sortByAge(false);
      }

      break;
    case salaryCell:
      if (isClicked) {
        sortBySalary(true);
      } else {
        sortBySalary(false);
      }

      break;
  }

  isClicked = !isClicked;

  for (let i = 0; i < tbodyArr.length; i++) {
    tbody[i].outerHTML = tbodyArr[i].outerHTML;
  }
});

// #endregion
// #region clickFunctions

function sortByString(isReverse, i) {
  const result = tbodyArr.sort((personA, personB) =>
    personA.cells[i].innerHTML.localeCompare(personB.cells[i].innerHTML),
  );

  if (!isReverse) {
    return result.reverse();
  }

  return result;
}

function sortByAge(isReverse) {
  const result = tbodyArr.sort(
    (personA, personB) =>
      personA.cells[3].innerHTML - personB.cells[3].innerHTML,
  );

  if (!isReverse) {
    return result.reverse();
  }

  return result;
}

function sortBySalary(isReverse) {
  const result = tbodyArr.sort(
    (personA, personB) =>
      Number(personA.cells[4].innerHTML.replace(/[$,]/g, '')) -
      Number(personB.cells[4].innerHTML.replace(/[$,]/g, '')),
  );

  if (!isReverse) {
    return result.reverse();
  }

  return result;
}

// #endregion
// #region form

const form = document.createElement('form');

form.className = 'new-employee-form';

for (let i = 0; i < 5; i++) {
  const label = document.createElement('label');

  if (i === 2) {
    const select = document.createElement('select');

    label.append(select);
    form.append(label);

    continue;
  }

  const input = document.createElement('input');

  label.append(input);
  form.append(label);
}

document.body.append(form);

const inputs = document.querySelectorAll('input');
const select = document.querySelector('select');
const labels = document.querySelectorAll('label');
const valuesForInputsQa = ['name', 'position', 'age', 'salary'];

for (let i = 0; i < 4; i++) {
  inputs[i].setAttribute('data-qa', valuesForInputsQa[i]);
  inputs[i].setAttribute('name', valuesForInputsQa[i]);
  inputs[i].setAttribute('required', '');

  if (i > 1) {
    inputs[i].setAttribute('type', 'number');
  }
}

select.setAttribute('data-qa', 'office');

const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < selectOptions.length; i++) {
  const option = document.createElement('option');

  option.setAttribute('value', selectOptions[i]);
  option.textContent = selectOptions[i];
  select.append(option);
}

labels.forEach((label) => {
  const textForLabel = textForLabels(label.firstChild.dataset.qa);

  label.prepend(textForLabel);
});

function textForLabels(word) {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}:`;
}

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.innerHTML = 'Save to table';

form.append(button);

// #region button
const notification = document.createElement('div');
const notifyTitle = document.createElement('h1');
const notifyDescr = document.createElement('div');

button.addEventListener('click', (_event) => {
  _event.preventDefault();

  const tr = document.createElement('tr');

  for (let i = 0; i < 5; i++) {
    const td = document.createElement('td');

    td.innerHTML = labels[i].lastChild.value;

    if (i === 4) {
      td.innerHTML = `$${new Intl.NumberFormat('en-US').format(td.innerHTML)}`;
    }

    tr.append(td);
  }

  notifyTitle.className = 'title';
  notification.append(notifyTitle, notifyDescr);
  notification.setAttribute('data-qa', 'notification');
  form.append(notification);

  const nameField = tr.children[0];
  const ageField = tr.children[3];

  if (
    nameField.innerHTML.length < 4 ||
    ageField.innerHTML < 18 ||
    ageField.innerHTML > 90
  ) {
    notification.className = 'error';
    notifyTitle.textContent = 'Error';
  }

  if (nameField.innerHTML.length < 4) {
    notifyDescr.innerHTML = `
      Sorry. The employee's name is less than 4 letters long.
    `;

    return;
  }

  if (ageField.innerHTML < 18) {
    notifyDescr.innerHTML = `Sorry. Employee is too young for this`;

    return;
  }

  if (ageField.innerHTML > 90) {
    notifyDescr.innerHTML = `Sorry. Employee is too old for this`;

    return;
  }

  notifyTitle.textContent = 'Success!';
  notification.className = 'success';
  notifyDescr.innerHTML = 'Employee is in the table now!';

  table.tBodies[0].append(tr);
  form.reset();
});

// #endregion

// #endregion
// #region editing of cells

table.tBodies[0].addEventListener('dblclick', (_event) => {
  const targetCell = _event.target;
  const initialText = targetCell.innerHTML;
  const computedOfTargetCell = window.getComputedStyle(targetCell);
  const rectOfTargetCell = targetCell.getBoundingClientRect();
  const input = document.createElement('input');
  const td = document.createElement('td');

  input.className = 'cell-input';
  input.style.boxSizing = 'border-box';
  input.style.width = `${rectOfTargetCell.width}px`;
  input.style.height = `${rectOfTargetCell.height}px`;
  input.style.padding = computedOfTargetCell.padding;
  targetCell.replaceWith(input);
  input.focus();

  ['blur', 'keydown'].forEach((type) => {
    input.addEventListener(type, (listener) => {
      const inputValue = input.value;

      function saveText() {
        input.replaceWith(td);

        if (inputValue === '') {
          td.innerHTML = initialText;

          return;
        }

        td.innerHTML = inputValue;
      }

      if (
        (type === 'keydown' && listener.key === 'Enter') ||
        type !== 'keydown'
      ) {
        saveText();
      }
    });
  });
});

// #endregion

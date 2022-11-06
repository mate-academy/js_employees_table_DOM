'use strict';

const tbody = document.querySelector('tbody');
const rows = tbody.getElementsByTagName('tr');
const titles = document.querySelector('tr');
const allCells = document.querySelectorAll('td');
const headings = titles.children;

const modeOrder = (value1, value2) =>
  value1.textContent.localeCompare(value2.textContent);

const replaceExtra = (row) =>
  row.textContent.replaceAll(',', '').slice(1);

const ascSorter = (index) => [...rows].sort((row1, row2) =>
  modeOrder(row1.children[index], row2.children[index]));

const descSorter = (index) => [...rows].sort((row1, row2) =>
  modeOrder(row2.children[index], row1.children[index]));

const ascSorterForSalary = (index) => [...rows].sort((row1, row2) =>
  replaceExtra(row1.children[index]) - replaceExtra(row2.children[index]));

const descSorterForSalary = (index) => [...rows].sort((row1, row2) =>
  replaceExtra(row2.children[index]) - replaceExtra(row1.children[index]));

[...headings].map(heading => {
  let isSortedAsc = false;

  const targetHandler = (index) => {
    if (isSortedAsc) {
      addHTML(descSorter(index));
      selectTheRow(descSorter(index));

      isSortedAsc = false;

      return;
    };

    addHTML(ascSorter(index));
    selectTheRow(ascSorter(index));

    isSortedAsc = true;
  };

  heading.addEventListener('click', (e) => {
    const targetHeading = e.target.textContent;

    if (targetHeading === 'Name') {
      targetHandler(0);
    };

    if (targetHeading === 'Position') {
      targetHandler(1);
    };

    if (targetHeading === 'Office') {
      targetHandler(2);
    };

    if (targetHeading === 'Age') {
      targetHandler(3);
    };

    if (targetHeading === 'Salary') {
      targetHandler(4);
    };
  });
});

const addHTML = (sorted) => {
  tbody.innerHTML = `
  ${[...sorted].map(value => `
  <tr>${value.innerHTML}</tr>
  `).join('')}`;
};

const selectTheRow = () => {
  [...rows].map(row =>
    row.addEventListener('click', (e) => {
      const targetRow = e.currentTarget;
      const activeCell = tbody.querySelector('.active');

      targetRow.classList.toggle('active');

      if (activeCell) {
        activeCell.classList.remove('active');
      }
    }));
};

selectTheRow([...rows]);

const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.append(form);

const createInForm = (element, text) => {
  const newElement = document.createElement(`${element}`);
  const label = document.createElement('label');

  if (element === 'button') {
    newElement.textContent = text;
    form.append(newElement);

    return;
  };

  label.textContent = text;

  form.append(label);
  label.append(newElement);
};

createInForm('input', 'Name:');
createInForm('input', 'Position:');
createInForm('select', 'Office:');
createInForm('input', 'Age:');
createInForm('input', 'Salary:');
createInForm('button', 'Save to table');

const nameOfThePerson = form.children[0].firstElementChild;
const position = form.children[1].firstElementChild;
const select = form.children[2].firstElementChild;
const age = form.children[3].firstElementChild;
const salary = form.children[4].firstElementChild;
const button = form.lastElementChild;

const addDataQa = (element, value) =>
  element.setAttribute('data-qa', `${value}`);

addDataQa(nameOfThePerson, 'name');
addDataQa(position, 'position');
addDataQa(select, 'office');
addDataQa(age, 'age');
addDataQa(salary, 'salary');

age.type = 'number';
salary.type = 'number';

const createOption = (text) => {
  const option = document.createElement('option');

  option.append(text);
  select.append(option);
};

createOption('Tokyo');
createOption('Singapore');
createOption('London');
createOption('New York');
createOption('Edinburgh');
createOption('San Francisco');

const createCell = () => document.createElement('td');

const addToNewCell = (newCell, formInput) => {
  newCell.textContent = formInput;
};

button.addEventListener('click', (e) => {
  const newLine = document.createElement('tr');

  e.preventDefault();

  newLine.append(createCell());
  newLine.append(createCell());
  newLine.append(createCell());
  newLine.append(createCell());
  newLine.append(createCell());

  addToNewCell(newLine.children[0], nameOfThePerson.value);
  addToNewCell(newLine.children[1], position.value);
  addToNewCell(newLine.children[2], select.value);
  addToNewCell(newLine.children[3], age.value);

  newLine.children[4].textContent = '$'
  + (+salary.value).toLocaleString();

  if (nameOfThePerson.value.length < 4) {
    pushNotification(630, 10, 'Ooops, we\'ve got a trouble',
      'Please, fill in at least 4 letters to add a new employee', 'error');

    return;
  }

  if (!position.value) {
    pushNotification(630, 10, 'Ooops, we\'ve got a trouble',
      'Please, add an employee\'s position ', 'error');

    return;
  }

  if (age.value < 18 || age.value > 90) {
    pushNotification(630, 10, 'Ooops, we\'ve got a trouble',
      'Please, note that employee\'s age has got to be between '
      + '18 and 90 range. Give it another try!', 'error');

    return;
  }

  if (!salary.value) {
    pushNotification(630, 10, 'Ooops, we\'ve got a trouble',
      'Please, add an employee\'s salary', 'error');

    return;
  }

  tbody.append(newLine);

  pushNotification(630, 10, 'Success!',
    'New employee has been added to the table', 'success');

  [...form].map(formInput => {
    formInput.value = '';
  });

  ascSorter(0);
  ascSorter(1);
  ascSorter(2);
  ascSorter(3);
  ascSorterForSalary(4);
  descSorter(0);
  descSorter(1);
  descSorter(2);
  descSorter(3);
  descSorterForSalary(4);
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const box = document.createElement('div');
  const boxH2 = document.createElement('h2');
  const boxP = document.createElement('p');

  boxH2.append(title);
  boxP.append(description);
  box.append(boxH2, boxP);
  document.body.append(box);

  box.style.cssText = `top: ${posTop}px; right: ${posRight}px`;

  box.classList.add('notification');
  box.classList.add(type);
  boxH2.classList.add('title');
  addDataQa(box, 'notification');

  setTimeout(() => box.remove(), 2000);
};

[...allCells].map(cell => {
  const tableInput = document.createElement('input');

  let cellCopy;

  const enableCursor = () => {
    [...allCells].map(element => {
      element.style.pointerEvents = '';
    });
  };

  const addRightCellText = () => {
    switch (tableInput.value.length > 0) {
      case true:
        cell.textContent = tableInput.value;
        break;

      case false:
        cell.textContent = cellCopy.textContent;
        break;
    }
  };

  cell.addEventListener('dblclick', (e) => {
    const targetCell = e.target;

    tableInput.style.width = getComputedStyle(cell).width;
    tableInput.classList.add('cell-input');

    cellCopy = targetCell.cloneNode(true);

    targetCell.textContent = '';
    tableInput.value = '';
    tableInput.autofocus = true;

    targetCell.append(tableInput);

    [...allCells].map(element => {
      element.style.pointerEvents = 'none';
      cell.style.pointerEvents = '';
    });
  });

  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addRightCellText();
    }
  });

  tableInput.addEventListener('blur', () => {
    addRightCellText();
    enableCursor();
  });
});

'use strict';

const tbody = document.querySelector('tbody');
const rows = tbody.getElementsByTagName('tr');
const titles = document.querySelector('tr');
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

let ascNames = ascSorter(0);
let ascPosition = ascSorter(1);
let ascOffice = ascSorter(2);
let ascAge = ascSorter(3);
let ascSalary = ascSorterForSalary(4);

let descNames = descSorter(0);
let descPosition = descSorter(1);
let descOffice = descSorter(2);
let descAge = descSorter(3);
let descSalary = descSorterForSalary(4);

[...headings].map(heading => {
  const titleName = heading.textContent;

  let isSortedAsc = false;

  if (titleName === 'Name') {
    heading.addEventListener('click', () => {
      if (isSortedAsc) {
        addHTML(descNames);
        selectTheRow(descNames);

        isSortedAsc = false;

        return;
      };

      addHTML(ascNames);
      selectTheRow(ascNames);

      isSortedAsc = true;
    });
  };

  if (titleName === 'Position') {
    heading.addEventListener('click', () => {
      if (isSortedAsc) {
        addHTML(descPosition);
        selectTheRow(descPosition);

        isSortedAsc = false;

        return;
      };

      addHTML(ascPosition);
      selectTheRow(ascPosition);

      isSortedAsc = true;
    });
  };

  if (titleName === 'Office') {
    heading.addEventListener('click', () => {
      if (isSortedAsc) {
        addHTML(descOffice);
        selectTheRow(descOffice);

        isSortedAsc = false;

        return;
      };

      addHTML(ascOffice);
      selectTheRow(ascOffice);

      isSortedAsc = true;
    });
  };

  if (titleName === 'Age') {
    heading.addEventListener('click', () => {
      if (isSortedAsc) {
        addHTML(descAge);
        selectTheRow(descAge);

        isSortedAsc = false;

        return;
      };

      addHTML(ascAge);
      selectTheRow(ascAge);

      isSortedAsc = true;
    });
  };

  if (titleName === 'Salary') {
    heading.addEventListener('click', () => {
      if (isSortedAsc) {
        addHTML(descSalary);
        selectTheRow(descSalary);

        isSortedAsc = false;

        return;
      };

      addHTML(ascSalary);
      selectTheRow(ascSalary);

      isSortedAsc = true;
    });
  };
});

const addHTML = (sorted) => {
  tbody.innerHTML = `
  ${[...sorted].map(value => `
  <tr>${value.innerHTML}</tr>
  `).join('')}`;
};

const selectTheRow = () => {
  [...rows].map(row => row.addEventListener('click', () => {
    if (!row.classList.contains('active')) {
      [...rows].map(line => line.classList.remove('active'));
    };

    row.classList.toggle('active');
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

const addDataQa = (element, value) =>
  element.setAttribute('data-qa', `${value}`);

const nameOfThePerson = form.children[0].firstElementChild;
const position = form.children[1].firstElementChild;
const select = form.children[2].firstElementChild;
const age = form.children[3].firstElementChild;
const salary = form.children[4].firstElementChild;
const button = form.lastElementChild;

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

  const employeeName = form.children[0].firstElementChild;
  const employeePosition = form.children[1].firstElementChild;
  const employeeOffice = form.children[2].firstElementChild;
  const employeeAge = form.children[3].firstElementChild;
  const employeeSalary = form.children[4].firstElementChild;

  e.preventDefault();

  newLine.append(createCell());
  newLine.append(createCell());
  newLine.append(createCell());
  newLine.append(createCell());
  newLine.append(createCell());

  addToNewCell(newLine.children[0], employeeName.value);
  addToNewCell(newLine.children[1], employeePosition.value);
  addToNewCell(newLine.children[2], employeeOffice.value);
  addToNewCell(newLine.children[3], employeeAge.value);

  newLine.children[4].textContent = '$'
  + (+employeeSalary.value).toLocaleString();

  if (employeeName.value.length < 4) {
    pushNotification(630, 10, 'Ooops, we\'ve got a trouble',
      'Please, fill in at least 4 letters to add a new employee', 'error');

    return;
  }

  if (!position.value) {
    pushNotification(630, 10, 'Ooops, we\'ve got a trouble',
      'Please, add an employee\'s position ', 'error');

    return;
  }

  if (employeeAge.value < 18 || employeeAge.value > 90) {
    pushNotification(630, 10, 'Ooops, we\'ve got a trouble',
      'Please, note that employee\'s age has got to be between '
      + '18 and 90 range. Give it another try!', 'error');

    return;
  }

  tbody.append(newLine);

  pushNotification(630, 10, 'Success!',
    'New employee has been added to the table', 'success');

  ascNames = ascSorter(0);
  ascPosition = ascSorter(1);
  ascOffice = ascSorter(2);
  ascAge = ascSorter(3);
  ascSalary = ascSorterForSalary(4);

  descNames = descSorter(0);
  descPosition = descSorter(1);
  descOffice = descSorter(2);
  descAge = descSorter(3);
  descSalary = descSorterForSalary(4);
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

'use strict';

/* TABLE COLUMNS ASC DESC ORDER SORTING ____________________________________ */

const heading = document.querySelector('thead').firstElementChild;
const headingItems = [...heading.querySelectorAll('th')];
const tableBody = document.querySelector('tbody');
const tableRows = [...tableBody.children];

headingItems.forEach(item => item.setAttribute('class', 'column'));

for (const item of headingItems.slice(0, 3)) {
  item.dataset.type = 'text';
}
headingItems[3].dataset.type = 'number';
headingItems[4].dataset.type = 'salary';

function tableSort(column) {
  const index = headingItems.indexOf(column);

  const callbackSort = (rowA, rowB) => {
    const one = rowA.children[index].innerText;
    const two = rowB.children[index].innerText;
    let first = one;
    let second = two;

    if (column.dataset.order === 'asc') {
      first = two;
      second = one;
    }

    const transformSalary = (cell) => {
      return cell.slice(1).split(',').join('');
    };

    if (column.dataset.type === 'text') {
      return first.localeCompare(second);
    } else if (column.dataset.type === 'salary') {
      return transformSalary(first)
      - transformSalary(second);
    } else if (column.dataset.type === 'number') {
      return first - second;
    }
  };
  const sorted = [...tableBody.children].sort(callbackSort);

  tableRows.forEach(item => item.remove());
  sorted.forEach(item => tableBody.append(item));

  if (!column.hasAttribute('data-order')
  || column.dataset.order === 'desc') {
    column.dataset.order = 'asc';
  } else {
    column.dataset.order = 'desc';
  }
}

heading.addEventListener('click', (e) => {
  const item = e.target.closest('.column');

  if (!item || !heading.contains(item)) {
    return;
  }

  tableSort(item);
});

/* SELECTING ROW IN A TABLE ________________________________________________ */

tableRows.forEach(item => item.setAttribute('class', 'row'));

tableBody.addEventListener('click', (e) => {
  const item = e.target.closest('.row');

  if (!item || !tableBody.contains(item)) {
    return;
  }

  for (const cell of tableRows) {
    if (cell.classList.contains('active')) {
      cell.classList.remove('active');
      [...cell.children].forEach(unit => unit.classList.remove('cell-active'));
    }
  }

  item.classList.add('active');

  [...item.children].forEach(cell => cell.classList.add('cell-active'));
});

/* NEW EMPLOYEE FORM _______________________________________________________ */

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');
document.body.insertBefore(form, document.body.lastChild);

const inputs = ['name', 'position', 'age', 'salary'];

const inputsArray = inputs.map(item =>
  `<label for = "${item}">${item[0].toUpperCase() + item.slice(1)}:\
  <input name="${item}" type="text" id = "${item}" \
  data-qa = "${item}"></label>`
);

inputsArray.forEach(item => form.insertAdjacentHTML('beforeend', item));

const age = document.querySelector('#age');
const salary = document.querySelector('#salary');

age.type = 'number';
salary.type = 'number';

/** select item */

const selectLabel = document.createElement('label');

selectLabel.htmlFor = 'office';

const select = document.createElement('select');

select.setAttribute('id', 'office');
select.setAttribute('name', 'office');
select.dataset.qa = 'office';
select.setAttribute('required', '');

const optionsValues = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];
const optionCollection = optionsValues.map(item =>
  `<option>${item}</option>`
);

optionCollection.forEach(item =>
  select.insertAdjacentHTML('beforeend', item));

selectLabel.append(select);

form.insertBefore(selectLabel, form.children[2]);

selectLabel.insertAdjacentText('afterbegin', 'Office:');

/** form button, adding a new row to the form */

const button = document.createElement('button');

button.type = 'submit';

button.innerText = 'Save to table';

form.append(button);

const editSalary = (elem) => {
  return `$${Number(elem).toLocaleString()}`;
};

const transformUpperCase = (person) => {
  const nameArr = person.split(' ');

  return nameArr.map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
};

const addRow = (e) => {
  e.preventDefault();

  const newTr = document.createElement('tr');

  newTr.className = 'row';

  const data = new FormData(form);
  const dataInput = Object.fromEntries(data.entries());

  newTr.innerHTML = `
      <td>${transformUpperCase(dataInput.name)}</td>
      <td>${dataInput.position}</td>
      <td>${dataInput.office}</td>
      <td>${dataInput.age}</td>
      <td>${editSalary(dataInput.salary)}</td>
  `;

  if (dataInput.name.length < 4) {
    return notification(wrongNameMessage, 'error');
  } else if (dataInput.position.length <= 0) {
    return notification(wrongPosition, 'error');
  } else if (dataInput.age < 18) {
    return notification(smallAgeMessage, 'error');
  } else if (dataInput.age > 90) {
    return notification(bigAgeMessage, 'error');
  }

  notification(success, 'success');

  tableBody.append(newTr);
};

form.addEventListener('submit', addRow);

/* NOTIFICATION WINDOW ______________________________________________________ */

const alertTable = document.createElement('div');

alertTable.style.top = '5px';
alertTable.style.right = '-300px';
alertTable.style.position = 'fixed';
alertTable.style.textAlign = 'center';
alertTable.style.display = 'flex';
alertTable.style.alignItems = 'center';
alertTable.style.justifyContent = 'center';
alertTable.style.color = '#5A5A5A';
alertTable.dataset.qa = 'notification';
alertTable.style.transition = 'all 1s ease';
document.body.append(alertTable);

const smallAgeMessage = 'Sorry, you are too young for this game';
const bigAgeMessage = 'Sorry, you are too old for this game';
const wrongNameMessage = 'Please, enter valid name';
const wrongPosition = 'Please, enter valid position';
const success = 'Employee successfully added';

const notification = (message, type) => {
  const adjust = () => {
    const element = document.querySelector(`.${type}`);

    element.style.right = '-300px';
    element.style.opacity = '0';
  };

  alertTable.className = `notification ${type}`;
  alertTable.innerHTML = `<p class="title">${message}</p>`;
  alertTable.style.right = '5px';
  alertTable.style.opacity = '1';

  setTimeout(adjust, '2800');
};

/* TABLE CELLS EDITING ______________________________________________________ */

tableBody.addEventListener('dblclick', (e) => {
  const cellInput = e.target.closest('.cell-active');
  const activeCell = document.querySelector('.cell-active--mod');

  if (!cellInput || !tableBody.contains(cellInput)) {
    return;
  } else if (activeCell) {
    activeCell.classList.remove('cell-active--mod');
  }
  cellInput.className += '--mod';

  cellInput.innerHTML
  = `<input class="cell-input" value="${cellInput.innerText}"></input>`;
});

const itemMod = () => {
  const inputMod = document.querySelector('.cell-input');
  const cellMod = document.querySelector('.cell-active--mod');
  const cellText = inputMod.value;

  if (!inputMod || !tableBody.contains(inputMod)) {
    return;
  } else if (!cellText) {
    cellMod.innerText = `${inputMod.getAttribute('value')}`;
  } else {
    cellMod.innerText = `${cellText}`;
  }

  cellMod.classList.remove('cell-active--mod');
};

tableBody.addEventListener('blur', itemMod, true);

tableBody.addEventListener('keydown', (e) => {
  if (e.code !== 'Enter') {
    return;
  }
  itemMod();
});

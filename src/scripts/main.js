'use strict';

const table = document.querySelector('table');

const head = table.querySelector('thead');

const bodyTable = table.querySelector('tbody');

let click;

head.addEventListener('click', (push) => {
  const th = push.target;

  if (th.innerText === click) {
    click = '';

    return sortDesc(th.cellIndex, push.target.textContent);
  }

  sortAsc(th.cellIndex, push.target.textContent);

  click = th.innerText;
});

bodyTable.addEventListener('click', (e) => {
  const row = e.target;

  if (row.parentElement.classList.length !== 0) {
    return row.parentElement.classList.remove('active');
  };

  for (let i = 0; i < bodyTable.children.length; i++) {
    const isActive = bodyTable.children[i];

    if (isActive.classList.length !== 0) {
      isActive.classList.remove('active');
    }
  };

  row.parentElement.setAttribute('class', 'active');
});

function sortAsc(numCol, nameCol) {
  const sorted = [...bodyTable.rows];

  sorted.sort((a, b) => {
    if (nameCol === 'Salary') {
      return conv(a.cells[numCol].innerHTML) - conv(b.cells[numCol].innerHTML);
    };

    return a.cells[numCol].innerHTML > b.cells[numCol].innerHTML ? 1 : -1;
  });

  bodyTable.append(...sorted);
};

function sortDesc(numCol, nameCol) {
  const sorted = [...bodyTable.rows];

  sorted.sort((a, b) => {
    if (nameCol === 'Salary') {
      return conv(b.cells[numCol].innerHTML) - conv(a.cells[numCol].innerHTML);
    };

    return b.cells[numCol].innerHTML > a.cells[numCol].innerHTML ? 1 : -1;
  });

  bodyTable.append(...sorted);
};

function conv(item) {
  return +(item.replace(/\D/g, ''));
};

const body = document.querySelector('body');

const form = document.createElement('form');

form.className = 'new-employee-form';
body.append(form);

const headTr = head.querySelector('tr');

for (let i = 0; i < headTr.cells.length; i++) {
  const item = headTr.cells[i].innerText;

  const label = document.createElement('label');

  label.innerText = `${item}: `;

  if (item === 'Office') {
    const select = document.createElement('select');

    const cities = ['Tokyo', 'Singapore',
      'London', 'New York', 'Edinburgh', 'San Francisco'];

    for (const city of cities) {
      const option = document.createElement('option');

      option.innerText = city;
      select.append(option);
    };

    select.setAttribute('data-qa', item.toLowerCase());

    label.append(select);
    form.append(label);
  } else {
    const input = document.createElement('input');

    input.setAttribute('data-qa', item.toLowerCase());

    if (item === 'Age' || item === 'Salary') {
      input.setAttribute('type', 'number');
    };

    label.append(input);
    form.append(label);
  };
};

const button = document.createElement('button');

button.innerText = 'Save to table';
button.setAttribute('type', 'submit');

form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const addRow = document.createElement('tr');

  for (const issue of form) {
    if (issue.tagName !== 'BUTTON') {
      const tdAdd = document.createElement('td');

      if (issue.dataset.qa === 'salary') {
        const salary = issue.value.split('');
        let rightSalary = '';
        let count = 1;

        for (let i = salary.length - 1; i >= 0; i--) {
          if (count % 3 === 0 && i !== 0) {
            rightSalary = `,${salary[i]}` + rightSalary;
          } else {
            rightSalary = salary[i] + rightSalary;
          }

          count++;
        };

        tdAdd.innerText = `$${rightSalary}`;
      } else {
        tdAdd.innerText = issue.value;
      };

      addRow.append(tdAdd.cloneNode(true));
    };
  };

  if (addRow.cells[0].innerText.length < 4) {
    return pushNotification('WRONG NAME',
      'Name should have more than 3 letters.\n'
      + 'Push right name!', 'error');
  };

  if (addRow.cells[1].innerText.length === 0) {
    return pushNotification('WRONG INPUT',
      'Possition should be decleared.\n'
      + 'Push right possition!', 'error');
  };

  if (+addRow.cells[3].innerText < 18 || +addRow.cells[3].innerText > 90) {
    return pushNotification('WRONG AGE',
      'Age should be more than 18 years and less than 90 years inclusive.\n'
      + 'Push right age!', 'error');
  };

  bodyTable.append(addRow);

  pushNotification('SUCCESS', 'You added a new employee to the table!',
    'success');
});

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.setAttribute('class', type);
  body.append(div);

  const messageTitle = document.createElement('h2');

  messageTitle.setAttribute('class', 'title');
  messageTitle.innerText = title;
  div.append(messageTitle);

  const messageText = document.createElement('p');

  messageText.innerText = description;
  div.append(messageText);
};

bodyTable.addEventListener('dblclick', (e) => {
  const cell = e.target;

  const cellText = cell.textContent;

  cell.textContent = '';

  const cellInput = document.createElement('input');

  cellInput.setAttribute('class', 'cell-input');
  cellInput.setAttribute('value', cellText);

  cell.append(cellInput);

  cellInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      cellInput.remove();

      cell.textContent = (cellInput.value === '')
        ? cellText
        : cellInput.value;
    };
  });

  cellInput.addEventListener('blur', (even) => {
    cellInput.remove();

    cell.textContent = (cellInput.value === '')
      ? cellText
      : cellInput.value;
  });
});

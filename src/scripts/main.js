'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const directions = new Array(thead.length).fill('');
const employeesForm = document.createElement('form');
const offices = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

employeesForm.setAttribute('method', 'post');
employeesForm.className = 'new-employee-form';

for (const attribute of thead.rows[0].cells) {
  if (attribute.innerText === 'Office') {
    employeesForm.insertAdjacentHTML('beforeend',
      `<label>${attribute.innerHTML}: 
        <select name='${attribute.innerHTML}'
          data-qa='${attribute.innerHTML.toLowerCase()}'>
          <option value='${offices[0]}'>${offices[0]}</option>
          <option value='${offices[1]}'>${offices[1]}</option>
          <option value='${offices[2]}'>${offices[2]}</option>
          <option value='${offices[3]}'>${offices[3]}</option>
          <option value='${offices[4]}'>${offices[4]}</option>
          <option value='${offices[5]}'>${offices[5]}</option>
        </select>
      </label>`
    );
  }

  if (attribute.innerText === 'Age') {
    employeesForm.insertAdjacentHTML('beforeend',
      `<label>${attribute.innerHTML}: 
        <input name='${attribute.innerHTML}'
        type='number'
        data-qa='${attribute.innerHTML.toLowerCase()}'>
      </label>`
    );
  }

  if (attribute.innerText === 'Salary') {
    employeesForm.insertAdjacentHTML('beforeend',
      `<label>${attribute.innerHTML}: 
        <input name='${attribute.innerHTML}'
        type='number'
        data-qa='${attribute.innerHTML.toLowerCase()}'>
      </label>`
    );
  }

  if (attribute.innerText === 'Name' || attribute.innerText === 'Position') {
    employeesForm.insertAdjacentHTML('beforeend',
      `<label>${attribute.innerHTML}: 
        <input name='${attribute.innerHTML}'
        type='text'
        data-qa='${attribute.innerHTML.toLowerCase()}'>
      </label>`
    );
  }
}

employeesForm.insertAdjacentHTML('beforeend',
  `<button type='submit'>Save to table</button>`);

body.append(employeesForm);

function sortTable(i) {
  const direction = directions[i] || 'asc';
  const isDirection = (direction === 'asc') ? 1 : 0;

  const sortedRows = [ ...tbody.rows ]
    .sort((rowA, rowB) => {
      const valueA = rowA.cells[i].innerHTML.replaceAll(/\W/g, '');
      const valueB = rowB.cells[i].innerHTML.replaceAll(/\W/g, '');

      if (isDirection) {
        return isNaN(valueA)
          ? valueA.localeCompare(valueB)
          : valueA - valueB;
      } else {
        return isNaN(valueA)
          ? valueB.localeCompare(valueA)
          : valueB - valueA;
      }
    });

  directions[i] = (direction === 'asc') ? 'desc' : 'asc';

  tbody.append(...sortedRows);
}

thead.addEventListener('click', e => {
  const index = e.target.cellIndex;

  sortTable(index);
});

tbody.addEventListener('click', e => {
  const target = e.target.closest('tr');

  for (const tableRow of tbody.rows) {
    tableRow.classList.remove('active');
  }

  target.classList.add('active');
});

tbody.addEventListener('dblclick', e => {
  const target = e.target.closest('td');
  const initialCellValue = target.textContent;

  target.innerHTML = '';

  target.insertAdjacentHTML('beforeend', `
    <input
      type='text'
      class='cell-input'
      value='${initialCellValue}'
      size='${initialCellValue.length}'>
  `);

  const cellInput = document.querySelector('.cell-input');

  cellInput.focus();

  cellInput.onblur = function() {
    if (!cellInput.value) {
      target.innerHTML = initialCellValue;
    } else {
      target.innerHTML = cellInput.value;
    }
    cellInput.remove();
  };

  cellInput.onchange = function() {
    if (!cellInput.value) {
      target.innerHTML = initialCellValue;
    } else {
      target.innerHTML = cellInput.value;
    }
    cellInput.remove();
  };
});

const button = document.querySelector('button');
const inputs = document.querySelectorAll('input');
const select = document.querySelector('select');

button.addEventListener('click', e => {
  e.preventDefault();

  const isValidNameLength = inputs[0].value.length > 3;
  const isValidPositionLength = inputs[1].value.length > 3;
  const isValidAge = +(inputs[2].value) > 17 && +(inputs[2].value) < 91;
  const isValidSalary = inputs[3].value > 0;
  let blockHeightReserve = 0;

  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].value) {
      pushNotification(10 + blockHeightReserve, 10, 'Warning',
        `Data is invalid. ${inputs[i].name} cant be blank`, 'warning');
      blockHeightReserve += 120;
    }
  }

  if (!isValidNameLength) {
    pushNotification(10 + blockHeightReserve, 10, 'Error',
      `Name value has less than 4 letters.`, 'error');

    blockHeightReserve += 120;
  }

  if (!isValidPositionLength) {
    pushNotification(10 + blockHeightReserve, 10, 'Error',
      `Position value has less than 4 letters.`, 'error');

    blockHeightReserve += 120;
  }

  if (!isValidAge) {
    pushNotification(10 + blockHeightReserve, 10, 'Error',
      'Age value is less than 18 or more than 90.', 'error');

    blockHeightReserve += 120;
  }

  if (!isValidSalary) {
    pushNotification(10 + blockHeightReserve, 10, 'Error',
      'Salary value is less than 0.', 'error');
  }

  if (isValidNameLength
      && isValidPositionLength
      && isValidAge
      && isValidSalary
  ) {
    tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${inputs[0].value}</td>
      <td>${inputs[1].value}</td>
      <td>${select.value}</td>
      <td>${inputs[2].value}</td>
      <td>${(+(inputs[3].value)).toLocaleString('en-US',
    {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }
  )}</td>
    </tr>
  `);

    pushNotification(10, 10, 'Success',
      'A new employee is successfully added to the table.', 'success');

    inputs.forEach(input => {
      input.value = '';
    });
    select.selectedIndex = 0;
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const container = document.createElement('div');
  const blockTitle = document.createElement('h2');
  const desc = document.createElement('p');

  container.classList.add('notification', type);
  container.dataset.qa = 'notification';
  document.body.append(container);

  blockTitle.classList.add('title');
  blockTitle.textContent = title;
  desc.textContent = description;

  container.append(blockTitle);
  container.append(desc);

  container.style.top = posTop + 'px';
  container.style.right = posRight + 'px';

  setTimeout(() => container.remove(), 2000);
};

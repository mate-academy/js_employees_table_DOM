/* eslint-disable function-paren-newline */
'use strict';

let editedCell = false;

document.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  if (editedCell) {
    return;
  }

  editedCell = true;

  const cell = e.target;
  const initialCellTextContent = cell.textContent;
  const input = document.createElement('input');

  cell.textContent = '';
  cell.appendChild(input);
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'fname');
  input.setAttribute('class', 'cell-input');
  input.value = initialCellTextContent;

  input.onblur = function () {
    saveCellTextContent(cell, initialCellTextContent);
  };

  input.onkeyup = function (eKey) {
    myFunction(eKey);
  };

  function myFunction(eKey) {
    if (eKey.key === 'Enter') {
      saveCellTextContent(cell, initialCellTextContent);
    }
  }
});

function saveCellTextContent(td, text) {
  const input = document.getElementById('fname');

  if (input.value.length === 0) {
    td.textContent = text;
    input.remove();
  }

  if (input.value.length > 0) {
    td.textContent = input.value;
    input.remove();
  }

  editedCell = false;
}

document.body.insertAdjacentHTML(
  'beforeend',
  `
  <form
      class="new-employee-form"
      data-qa="small"
    >
      <label>Name: <input name="name" type="text" data-qa="name"></label>
      <label>Position: <input name="position" type="text" data-qa="position"></label>
      <label>Office:
        <select name="office" data-qa="office">
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age: <input name="age" type="number" data-qa="age"></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
      <button type="submit">Save to table</button>
    </form>
`,
);

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');
  const elementTitle = document.createElement('h2');
  const elementDescription = document.createElement('p');

  elementTitle.innerHTML = title;
  elementTitle.setAttribute('class', 'title');
  elementDescription.innerText = description;
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  message.style.width = '320px';

  message.setAttribute('class', `notification ${type}`);
  message.setAttribute('data-qa', 'notification');

  document.body.append(message);
  message.append(elementTitle);
  message.append(elementDescription);

  setTimeout(() => message.remove(), 2000);
};

const form = document.querySelector('.new-employee-form');
const tableBodie = document.querySelector('table').tBodies[0];
const colectionRow = tableBodie.children;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = form.elements.name.value;
  const positionValue = form.elements.position.value;
  const officeValue = form.elements.office.value;
  const ageValue = form.elements.age.value;
  const salaryValue = form.elements.salary.value;

  if (nameValue.length < 4) {
    pushNotification(
      150,
      10,
      'Incorrect name value',
      'The value of the name must contain more than 4 letters',
      'error',
    );

    return;
  }

  if (positionValue.length < 4) {
    pushNotification(
      150,
      10,
      'Incorrect position value',
      'The value of the position must contain more than 4 letters',
      'error',
    );

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    pushNotification(
      150,
      10,
      'Incorrect age value',
      'The age value must be greater than 18 or less than 90 years',
      'error',
    );

    return;
  }

  if (salaryValue <= 0) {
    pushNotification(
      150,
      10,
      'Incorrect salary value',
      'The salary value must be greater than 0',
      'error',
    );

    return;
  }

  const cloneRow = colectionRow[0].cloneNode(true);

  cloneRow.children[0].textContent = nameValue;
  cloneRow.children[1].textContent = positionValue;
  cloneRow.children[2].textContent = officeValue;
  cloneRow.children[3].textContent = ageValue;

  const salary = +salaryValue;
  const formatedSalary = salary.toLocaleString('en-US');

  cloneRow.children[4].textContent = `$${formatedSalary}`;

  tableBodie.appendChild(cloneRow);
  form.reset();

  pushNotification(
    10,
    10,
    'Success',
    'New employee is successfully added to the table',
    'success',
  );
});

// sorting table
let secondClickName = false;
let secondClickPosition = false;
let secondClickOffice = false;
let secondClickAge = false;
let secondClickSalary = false;

document.addEventListener('click', function (e) {
  const id = e.target.closest('thead');

  if (!id) {
    return;
  }

  const table = document.querySelector('table').tBodies[0];
  const colectionRows = table.children;
  const arrRow = Array.from(colectionRows);
  let sorted;

  if (e.target.innerText === 'Name') {
    if (secondClickName) {
      sorted = arrRow.sort((row1, row2) =>
        row2.cells[0].innerText.localeCompare(row1.cells[0].innerText),
      );
    } else {
      sorted = arrRow.sort((row1, row2) =>
        row1.cells[0].innerText.localeCompare(row2.cells[0].innerText),
      );
    }

    secondClickName = !secondClickName;
    secondClickPosition = false;
    secondClickOffice = false;
    secondClickAge = false;
    secondClickSalary = false;
  }

  if (e.target.innerText === 'Position') {
    if (secondClickPosition) {
      sorted = arrRow.sort((row1, row2) =>
        row2.cells[1].innerText.localeCompare(row1.cells[1].innerText),
      );
    } else {
      sorted = arrRow.sort((row1, row2) =>
        row1.cells[1].innerText.localeCompare(row2.cells[1].innerText),
      );
    }

    secondClickPosition = !secondClickPosition;
    secondClickName = false;
    secondClickOffice = false;
    secondClickAge = false;
    secondClickSalary = false;
  }

  if (e.target.innerText === 'Office') {
    if (secondClickOffice) {
      sorted = arrRow.sort((row1, row2) =>
        row2.cells[2].innerText.localeCompare(row1.cells[2].innerText),
      );
    } else {
      sorted = arrRow.sort((row1, row2) =>
        row1.cells[2].innerText.localeCompare(row2.cells[2].innerText),
      );
    }

    secondClickOffice = !secondClickOffice;
    secondClickName = false;
    secondClickPosition = false;
    secondClickAge = false;
    secondClickSalary = false;
  }

  if (e.target.innerText === 'Age') {
    if (secondClickAge) {
      sorted = arrRow.sort(
        (row1, row2) => +row2.cells[3].innerText - +row1.cells[3].innerText,
      );
    } else {
      sorted = arrRow.sort(
        (row1, row2) => +row1.cells[3].innerText - +row2.cells[3].innerText,
      );
    }

    secondClickAge = !secondClickAge;
    secondClickName = false;
    secondClickPosition = false;
    secondClickOffice = false;
    secondClickSalary = false;
  }

  if (e.target.innerText === 'Salary') {
    if (secondClickSalary) {
      sorted = arrRow.sort(
        (row1, row2) =>
          +row2.cells[4].innerText.slice(1).split(',').join('') -
          +row1.cells[4].innerText.slice(1).split(',').join(''),
      );
    } else {
      sorted = arrRow.sort(
        (row1, row2) =>
          +row1.cells[4].innerText.slice(1).split(',').join('') -
          +row2.cells[4].innerText.slice(1).split(',').join(''),
      );
    }

    secondClickSalary = !secondClickSalary;
    secondClickName = false;
    secondClickPosition = false;
    secondClickOffice = false;
    secondClickAge = false;
  }

  sorted.forEach((row) => tableBodie.appendChild(row));
});

document.addEventListener('click', function (e) {
  const id = e.target.closest('tbody');
  const table = document.querySelector('table').tBodies[0];
  const colectionRows = table.children;
  const arrRow = Array.from(colectionRows);

  if (!id) {
    return;
  }

  const tr = e.target.closest('tr');

  arrRow.forEach((row) => {
    if (row.hasAttribute('class')) {
      row.removeAttribute('class');
    }
  });

  tr.setAttribute('class', 'active');
});

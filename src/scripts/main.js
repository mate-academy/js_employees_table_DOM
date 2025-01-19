'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = document.querySelector('tbody');

headers.forEach((header) => (header.toggle = 'ASC'));

function sortTable(columnNumber) {
  const rows = Array.from(tbody.rows);

  function isNumeric(value) {
    const data = value.replace(/[$,]/g, '');

    return !isNaN(data) && !isNaN(parseFloat(data));
  }

  let sortedData;

  if (isNumeric(rows[0].cells[columnNumber].textContent.trim())) {
    sortedData = rows.sort((row1, row2) => {
      const cellA = parseFloat(
        row1.cells[columnNumber].textContent.trim().replace(/[$,]/g, ''),
      );
      const cellB = parseFloat(
        row2.cells[columnNumber].textContent.trim().replace(/[$,]/g, ''),
      );

      if (headers[columnNumber].toggle === 'ASC') {
        return cellA - cellB;
      }

      if (headers[columnNumber].toggle === 'DESC') {
        return cellB - cellA;
      }
    });
  } else {
    sortedData = rows.sort((row1, row2) => {
      const cellA = row1.cells[columnNumber].textContent.trim();
      const cellB = row2.cells[columnNumber].textContent.trim();

      if (headers[columnNumber].toggle === 'ASC') {
        return cellA.localeCompare(cellB);
      }

      if (headers[columnNumber].toggle === 'DESC') {
        return cellB.localeCompare(cellA);
      }
    });
  }

  headers[columnNumber].toggle =
    headers[columnNumber].toggle === 'ASC' ? 'DESC' : 'ASC';

  tbody.append(...sortedData);
}

function createForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  newForm.innerHTML = `
  <label>Name:&nbsp;<input data-qa="name" name="name" type="text" required></label>
  <label>Position:&nbsp;<input data-qa="position" name="position" type="text" required></label>
  <label>Office:&nbsp;
    <select data-qa="office" name="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="NewYork">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="SanFrancisco">San Francisco</option>
    </select>
  </label>
  <label>Age:&nbsp;<input data-qa="age" name="age" type="number" required></label>
  <label>Salary:&nbsp;<input data-qa="salary" name="salary" type="number" required></label>
  <button name="action" value="save">Save to table</button>
`;

  body.append(newForm);
}

createForm();

const form = document.querySelector('.new-employee-form');
const formButton = form.querySelector('.new-employee-form button');

function getFormValidation(data) {
  if (data.name.length < 4) {
    pushNotification(
      150,
      10,
      'Error name',
      'Name value must be longer than 4 letters.',
      'error',
    );

    return;
  }

  if (Number(data.age) < 18 || Number(data.age) > 90) {
    pushNotification(
      290,
      10,
      'Error age',
      'Age value must be bigger than 18 or smaller than 90.',
      'error',
    );

    return;
  }

  pushNotification(
    290,
    10,
    'Success',
    'Your form has been successfully submitted.',
    'success',
  );
}

function addNewEmployee(data) {
  const row = document.createElement('tr');
  const colsAmount = table.rows[0].cells.length;
  const cells = [];

  for (let i = 0; i < colsAmount; i++) {
    const cell = document.createElement('td');
    const dataKey = headers[i].textContent.toLowerCase();
    let text = data[dataKey];

    if (dataKey === 'salary') {
      text = '$' + Number(text).toLocaleString('en-US');
    }

    cell.textContent = text;
    cells.push(cell);
  }

  row.append(...cells);
  tbody.append(row);
}

formButton.addEventListener('click', (ev) => {
  ev.preventDefault();

  const data = new FormData(form);
  const employeeData = {
    name: data.get('name'),
    position: data.get('position'),
    office: data.get('office'),
    age: data.get('age'),
    salary: data.get('salary'),
  };

  getFormValidation(employeeData);
  addNewEmployee(employeeData);
  form.reset();
});

table.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'TH') {
    const header = ev.target;

    sortTable(header.cellIndex);
  }
});

[...tbody.rows].forEach((row) => {
  row.addEventListener('click', (ev) => {
    [...tbody.rows].forEach((line) => line.classList.remove('active'));
    row.classList.add('active');
  });
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  const heading = document.createElement('h2');

  heading.classList.add('title');
  heading.textContent = title;
  message.appendChild(heading);

  const text = document.createElement('p');

  text.textContent = description;
  message.appendChild(text);

  document.body.appendChild(message);
  setTimeout(() => message.remove(), 2000);
};

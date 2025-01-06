'use strict';

// write code here
const mainTable = document.querySelector('table');
const thead = mainTable.querySelector('thead');
const tbody = mainTable.querySelector('ttbody');
const sortAttrName = 'sort-dr';

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name:&nbsp;<input data-qa="name" name="name" type="text"></label>
  <label>Position:&nbsp;<input data-qa="position" name="position" type="text"></label>
  <label>Office:&nbsp;
    <select data-qa="office" name="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="NewYork">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="SanFrancisco">San Francisco</option>
    </select>
  </label>
  <label>Age:&nbsp;<input data-qa="age" name="age" type="number"></label>
  <label>Salary:&nbsp;<input data-qa="salary" name="salary" type="number"></label>
  <button name="action" value="save">Save to table</button>
`;

document.body.appendChild(form);

form.querySelector('button').addEventListener('click', (e) => {
  e.preventDefault();

  const tr = document.createElement('tr');
  const formatter = new Intl.NumberFormat('en-US');
  const salary = formatter.format(form.salary.value);

  if (form.name.value.length < 4) {
    const title = 'invalid name value';
    const message = 'must be at leat 4 letters';

    pushNotification(title, message, 'error');

    return;
  }

  if (form.age.value < 18 || form.age.value > 90) {
    const title = 'invalid name value';
    const message = 'age must be between 18 and 90';

    pushNotification(title, message, 'error');

    return;
  }

  tr.innerHTML = `  <td>${form.name.value}</td>
                    <td>${form.position.value}</td>
                    <td>${form.office.value}</td>
                    <td>${form.age.value}</td>
                    <td>$${salary}</td>`;
  tbody.appendChild(tr);

  pushNotification('success', '', 'success');
});

thead.addEventListener('click', (e) => {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  const headers = thead.querySelectorAll('th');
  const index = [...headers].indexOf(header);
  const rows = Array.from(tbody.rows);
  const sortStatus = header.getAttribute(sortAttrName);

  if (sortStatus) {
    if (sortStatus === 'ASC') {
      header.setAttribute(sortAttrName, 'DESC');
      rows.sort((a, b) => sortBackFunction(a, b, index));
    } else {
      header.setAttribute(sortAttrName, 'ASC');
      rows.sort((a, b) => sortASCFunction(a, b, index));
    }
  } else {
    const sortedColumn = thead.querySelector(`th[${sortAttrName}]`);

    if (sortedColumn) {
      sortedColumn.removeAttribute(sortAttrName);
    }

    header.setAttribute(sortAttrName, 'ASC');
    rows.sort((a, b) => sortASCFunction(a, b, index));
  }
  tbody.innerHTML = '';

  rows.forEach((row) => tbody.appendChild(row));
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  const activeRow = tbody.querySelector('.active');

  if (activeRow && activeRow !== row) {
    activeRow.classList.remove('active');
  }

  row.classList.toggle('active');
});

function sortASCFunction(a, b, index) {
  let valueA = a.cells[index].innerText;
  let valueB = b.cells[index].innerText;

  if (!Number.isNaN(+valueA) && !Number.isNaN(+valueB)) {
    return valueA - valueB;
  }

  if (valueA[0] === '$') {
    valueA = valueA.slice(1).split(',').join('');
    valueB = valueB.slice(1).split(',').join('');

    return valueA - valueB;
  }

  return valueA.localeCompare(valueB, undefined, { sensitivity: 'base' });
}

function sortBackFunction(a, b, index) {
  let valueA = a.cells[index].innerText;
  let valueB = b.cells[index].innerText;

  if (!Number.isNaN(+valueA) && !Number.isNaN(+valueB)) {
    return valueB - valueA;
  }

  if (valueA[0] === '$') {
    valueA = valueA.slice(1).split(',').join('');
    valueB = valueB.slice(1).split(',').join('');

    return valueB - valueA;
  }

  return valueB.localeCompare(valueA, undefined, { sensitivity: 'base' });
}

function pushNotification(title, description, type) {
  // write code here
  const note = document.createElement('div');
  const noteTitle = document.createElement('h2');
  const message = document.createElement('p');

  note.classList.add('notification', type);
  noteTitle.innerText = title;
  noteTitle.classList.add('title');
  note.setAttribute('data-qa', 'notification');
  message.innerText = description;

  note.appendChild(noteTitle);
  note.appendChild(message);
  document.tbody.appendChild(note);

  window.setTimeout(() => note.remove(), 3000);
}

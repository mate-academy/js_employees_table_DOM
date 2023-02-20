'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];

let sortDirection = 'ASC';
let previousIndex = null;

const sortTable = (e) => {
  if (e.target.tagName === 'TH') {
    const headerIndex = [...e.target.parentNode.children].indexOf(e.target);

    rows.sort((a, b) => {
      const aData = a.children[headerIndex].textContent;
      const bData = b.children[headerIndex].textContent;

      if (previousIndex === headerIndex) {
        const sortOrder = sortDirection === 'ASC' ? 1 : -1;

        return sortOrder * aData.localeCompare(bData, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      } else {
        return aData.localeCompare(bData, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      }
    });

    previousIndex = headerIndex;

    sortDirection === 'ASC'
      ? sortDirection = 'DESC'
      : sortDirection = 'ASC';

    rows.forEach((row) => tbody.appendChild(row));
  }
};

const selectRow = (e) => {
  if (e.target.tagName === 'TD') {
    const targetRow = e.target.parentNode;
    const activeRow = rows.find(row => row.classList.contains('active'));

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    targetRow.classList.add('active');
  }
};

document.body.insertAdjacentHTML('beforeend', `
  <form
    class="new-employee-form"
    action="#"
    method="POST"
  >
    <label>Name:
      <input
        name="name"
        type="text"
        data-qa="name"
      ></label>

    <label>Position:
      <input
      name="position"
      type="text"
      data-qa="position"
      ></label>

    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
    <input
      name="age"
      type="number"
      data-qa="age"
      ></label>

    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      ></label>

      <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('form');

const addNewEmployee = (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const newEmployee = Object.values(Object.fromEntries(data.entries()));

  newEmployee[4] = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(newEmployee[4]);

  const row = tbody.insertRow(-1);

  [...table.rows[0].cells].forEach((_, i) => {
    row.insertCell(i);
    row.children[i].innerText = newEmployee[i];
  });

  rows.push(row);
  form.reset();
};

form.addEventListener('submit', addNewEmployee);
table.addEventListener('click', sortTable);
table.addEventListener('click', selectRow);

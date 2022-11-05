'use strict';
// работа с ячейками

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (ev) => {
  const activeRow = ev.target.closest('tr');

  [...tbody.rows].forEach((row) => row.classList.remove('active'));
  activeRow.classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" action="#" method="get">
    <label>
      Name:
      <input
        type="text"
        name="name"
        data-qa="name"
        required
      >
    </label>
    <label>
      Position:
      <input
        type="text"
        name="position"
        data-qa="position"
        required
      >
    </label>
    <label>
      Office:
      <select
        name="office"
        name="office"
        data-qa="office"
        required
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        type="number"
        name="age"
        data-qa="age"
        required
      >
    </label>
    <label>
      Salary:
      <input
        type="number"
        name="salary"
        data-qa="salary"
        required
      >
    </label>
    <button class="button"> Save to table </button>
  </form>
`);

function notification(type, title, text) {
  body.insertAdjacentHTML('beforeend', `
  <div
    class="notification ${type}"
    data-qa="notification"
  >
    <h1 class="title">
      ${title}
    </h1>
    <p>
      ${text}
    </p>
  </div>
  `);

  setTimeout(() =>
    body.removeChild(document.querySelector('.notification')), 2000);
};

function strEdited(str) {
  return (str[0].toUpperCase() + str.slice(1));
};

function salaryEdited(salary) {
  const newFormat = new Intl.NumberFormat('en-US');

  return ('$' + newFormat.format(salary));
};

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const dataFromForm = new FormData(form);
  const nameData = dataFromForm.get('name');
  const positionData = dataFromForm.get('position');
  const officeData = dataFromForm.get('office');
  const ageData = dataFromForm.get('age');
  const salaryData = dataFromForm.get('salary');

  if (nameData.length < 4) {
    notification('error', 'Error', 'Name must have min 4 letters');
  } else if (ageData < 18) {
    notification('warning', 'Warning', 'Sorry, You are too young !');
  } else if (ageData > 90) {
    notification('warning', 'Warning', `
    Sorry, We are looking for younger specialist !
    `);
  } else {
    tbody.insertAdjacentHTML('afterbegin', `
      <tr>
        <td>${strEdited(nameData)}</td>
        <td>${strEdited(positionData)}</td>
        <td>${officeData}</td>
        <td>${ageData}</td>
        <td>${salaryEdited(salaryData)}</td>
      </tr>
    `);

    notification('success', 'Success', 'A new employee has been added !');
  }
});

const thead = document.querySelector('thead');
let columnThatWasSorted = 0;

thead.addEventListener('click', (ev) => {
  const columnThatWeSort = ev.target.cellIndex;

  const sortedRows = [...tbody.rows].sort((row1, row2) => {
    let value1 = row1.cells[columnThatWeSort].innerHTML;
    let value2 = row2.cells[columnThatWeSort].innerHTML;

    if (value1.includes('$')) {
      value1 = value1.replace(/[$,]/g, '');
      value2 = value2.replace(/[$,]/g, '');
    }

    return isNaN(value1)
      ? value1.localeCompare(value2)
      : (value1 - value2);
  });

  if (columnThatWeSort !== columnThatWasSorted) {
    tbody.append(...sortedRows);
    columnThatWasSorted = columnThatWeSort;
  } else {
    tbody.append(...sortedRows.reverse());
    columnThatWasSorted = 10;
  }
});

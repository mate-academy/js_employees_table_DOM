'use strict';

const body = document.querySelector('body');

body.insertAdjacentHTML('beforeend',
  `<form action="#" method="get"
  class="new-employee-form">
  <label>Name: 
    <input 
    name="name" 
    type="text" 
    data-qa="name" 
    maxlength="25" 
    required>
  </label>
  <label>Position: 
    <input 
    name="position" 
    type="text" 
    data-qa="position" 
    minlength="2"
    maxlength="25" 
    required>
  </label>
   <label>Office:
      <select 
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
  <label>Age: 
    <input 
    name="age" 
    type="number" 
    data-qa="age" 
    required>
  </label>
  <label>Salary: 
    <input 
    name="salary" 
    type="number" 
    data-qa="salary" 
    min="0" required>
  </label>
  <button type="submit">Save to table</button>
</form>`);

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const form = document.querySelector('form');

function onFormSubmit(evt) {
  evt.preventDefault();

  const allData = new FormData(form);
  const employeeName = allData.get('name');
  const employeeAge = allData.get('age');
  const employeeSalary = allData.get('salary');
  const newEmployeeSalary = '$' + String(employeeSalary);

  if (employeeName.length < 4) {
    makeANotification('warning', 'Warning',
      'Please, enter at least 4 charachers');
  } else if (employeeAge < 18 || employeeAge > 90) {
    makeANotification('error', 'Error', 'Please enter a valid age');
  } else {
    tableBody.insertAdjacentHTML('beforeend',
      `<tr>
          <td>${employeeName}</td>
          <td>${allData.get('position')}</td>
          <td>${allData.get('office')}</td>
          <td>${employeeAge}</td>
          <td>${newEmployeeSalary}</td>
        </tr>`);
    makeANotification('success', 'Success', 'Employee was added to the table');
    form.reset();
  };
}

function makeANotification(type, title, description) {
  body.insertAdjacentHTML('beforeend', `
  <div 
    class="notification ${type}"
    data-qa="notification"
  >
    <h1 class="title">
      ${title}
    </h1>
    <p>
      ${description}
    </p>
  </div
`);

  setTimeout(() => document.querySelector('.notification').remove(), 3000);
}

function convertSalaryToNumber(salary) {
  return Number(salary.slice(1).split(',').join(''));
};

let thIndex = -1;

function onClick(e) {
  if (e.target.tagName !== 'TH') {
    return;
  };

  const cellNumber = e.target.cellIndex;
  const sorted = [...tableBody.rows].sort((rowA, rowB) => {
    let cellA = rowA.cells[cellNumber].innerHTML;
    let cellB = rowB.cells[cellNumber].innerHTML;

    if (cellA.includes('$')) {
      cellA = convertSalaryToNumber(cellA);
      cellB = convertSalaryToNumber(cellB);

      return cellA - cellB;
    }

    return cellA.localeCompare(cellB);
  });

  if (thIndex === cellNumber) {
    tableBody.append(...sorted.reverse());
    thIndex = -1;
  } else {
    tableBody.append(...sorted);
    thIndex = cellNumber;
  }
};

function onSelectedRow(e) {
  const selectedRow = e.target.closest('tr');

  [...tableBody.rows].forEach(row => row.classList.remove('active'));
  selectedRow.classList.add('active');
}

function onSelectedCell(e) {
  const selectedCell = e.target.closest('td');

  const text = selectedCell.innerText;

  selectedCell.innerText = '';

  let input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'text';
  input.value = text;

  if (selectedCell.cellIndex === 2) {
    const select = document.createElement('select');

    select.insertAdjacentHTML('afterbegin', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
      `);
    input = select;
  };

  if (selectedCell.cellIndex === 3
  || selectedCell.cellIndex === 4) {
    input.type = 'number';
  };

  selectedCell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (input.value === '') {
      selectedCell.innerText = text;

      return;
    };

    if (selectedCell.cellIndex === 0
      && input.value.length < 4) {
      selectedCell.innerText = text;

      return;
    };

    if (input.value > 90 && selectedCell.cellIndex === 3) {
      selectedCell.innerText = text;

      return;
    };

    if (input.value < 18 && selectedCell.cellIndex === 3) {
      selectedCell.innerText = text;

      return;
    };

    if (selectedCell.cellIndex === 4) {
      selectedCell.innerText = '$' + String(input.value);

      return;
    };

    selectedCell.innerText = input.value;
    input.remove();
  });

  input.addEventListener('keypress', (ev) => {
    if (ev.code === 'Enter') {
      input.blur();
    }
  });
}

form.addEventListener('submit', onFormSubmit);
tableHead.addEventListener('click', onClick);
tableBody.addEventListener('dblclick', onSelectedCell);
tableBody.addEventListener('click', onSelectedRow);

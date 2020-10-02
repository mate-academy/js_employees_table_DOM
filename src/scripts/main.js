'use strict';

// write code here
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

// 1.Implement table sorting by clicking on the title.
const rows = [...tableBody.rows];

let sortedColumn;

function sortTable(event) {
  const columnIndex = event.target.cellIndex;

  if (event.target.textContent === sortedColumn) {
    rows.reverse();
  } else {
    sortedColumn = event.target.textContent;

    rows.sort((a, b) => {
      if (!toNumber(a.cells[columnIndex].innerText)) {
        return a.cells[columnIndex].innerText
          .localeCompare(b.cells[columnIndex].innerText);
      }

      return toNumber(a.cells[columnIndex].innerText)
    - toNumber(b.cells[columnIndex].innerText);
    });
  }

  tableBody.append(...rows);
}

function toNumber(value) {
  if (+value) {
    return +value;
  } else {
    return +value.slice(1).split(',').join('');
  }
};

tableHead.addEventListener('click', sortTable);

// 2. When you click on a row of the table, it should become selected.
// add or remove tr.active class for the row
function selectRow(event) {
  [...tableBody.rows].forEach(elem => elem.classList.remove('active'));
  event.target.parentNode.classList.add('active');
}

tableBody.addEventListener('click', selectRow);

// 5. Implement editing of table cells by double-clicking on it (Optional)

function doCellEdit(event) {
  const selectedCell = event.target;

  const input = document.createElement('input');

  input.classList = 'cell-input';
  input.style.width = window.getComputedStyle(event.target).width;
  input.defaultValue = selectedCell.textContent;
  selectedCell.textContent = '';
  selectedCell.append(input);

  input.addEventListener('keydown', (event1) => {
    if (event1.code === 'Enter') {
      if (input.value) {
        selectedCell.textContent = input.value;
      } else {
        selectedCell.textContent = input.defaultValue;
      }
    }
  });
}

tableBody.addEventListener('dblclick', doCellEdit);

/* 3 Use a script to add a form to the document
 that will allow you to add new employees to the spreadsheet. */

const form = document.createElement('form');

function addForm() {
  form.classList.add('new-employee-form');

  const formLabels = ['name', 'position', 'office', 'age', 'salary'];
  //  name
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.name = formLabels[0];
  input.required = true;
  label.textContent = formLabels[0];
  label.append(input);
  form.append(label);

  //  position
  const label1 = document.createElement('label');
  const input1 = document.createElement('input');

  input1.name = formLabels[1];
  input1.required = true;
  label1.textContent = formLabels[1];
  label1.append(input1);
  form.append(label1);

  //  office
  const label2 = document.createElement('label');

  label2.textContent = formLabels[2];

  const select = document.createElement('select');

  select.required = true;

  const officeCityArray
  = [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

  const options = officeCityArray.map(city => `<option>${city}</option>`);

  select.name = formLabels[2];
  select.insertAdjacentHTML('afterbegin', options.join(''));

  label2.append(select);
  form.append(label2);

  //  age
  const label3 = document.createElement('label');
  const input2 = document.createElement('input');

  input2.name = formLabels[3];
  input2.required = true;
  label3.textContent = formLabels[3];
  label3.append(input2);
  form.append(label3);

  //  selary
  const label4 = document.createElement('label');
  const input3 = document.createElement('input');

  input3.name = formLabels[4];
  input3.required = true;
  label4.textContent = formLabels[4];
  label4.append(input3);
  form.append(label4);

  // button
  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to table';
  form.append(button);

  document.body.append(form);
}

addForm();

//  4. Throw notification from previous tasks if form data is invalid.

function pushNotification(title, description, type) {
  const container = document.createElement('div');

  container.className = (`notification ${type}`);

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.innerText = title;

  const p = document.createElement('p');

  p.innerText = description;

  container.append(h2, p);

  document.body.append(container);
  setTimeout(() => container.remove(), 2000);
};

function validate() {
  //   const formLabels = ['name', 'position', 'office', 'age', 'salary'];
  if (form.age.value < 18 || form.age.value > 90) {
    pushNotification('Retry', `Age is more then 18 & less then 90`, 'error');

    return false;
  }

  const nameString = form.name.value;

  if (nameString.length < 4) {
    pushNotification('Retry!', `Name can't be less than 4 letters`, 'error');

    return false;
  }

  if (+form.salary.value === 0) {
    pushNotification('Retry!', 'Salary must be more then 0', 'error');

    return false;
  }

  pushNotification('Success!', 'New employee was added', 'success');

  return true;
}

function addEmployee() {
  const employee = document.createElement('tr');

  employee.insertAdjacentHTML('afterbegin', `
    <td>${form.name.value}</td>
    <td>${form.position.value}</td>
    <td>${form.office.value}</td>
    <td>${form.age.value}</td>
    <td>$${(+form.salary.value).toLocaleString('en')}</td>
  `);
  tableBody.append(employee);
}

function submit(event) {
  event.preventDefault();

  const inputForm = event.target;

  if (validate(inputForm)) {
    addEmployee(inputForm);
    inputForm.reset();
  }
}

form.addEventListener('submit', submit);

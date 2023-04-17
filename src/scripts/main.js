'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');

// let clickCounter = 0;
let isDescOrder;
let LastClickedTarget;

// sorting
table.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  if (LastClickedTarget !== e.target) {
    isDescOrder = true;
  }
  LastClickedTarget = e.target;

  const rows = Array.from(tbody.querySelectorAll('tr'));

  if (isDescOrder) {
    isDescOrder = false;

    rows.sort((a, b) => {
      const cell1 = a.cells[e.target.cellIndex].textContent;
      const cell2 = b.cells[e.target.cellIndex].textContent;

      if (e.target.textContent === 'Salary') {
        const num1 = cell1.replace(/[$,]/g, '');
        const num2 = cell2.replace(/[$,]/g, '');

        return num1 - num2;
      }

      return cell1.localeCompare(cell2);
    });
  } else {
    isDescOrder = true;

    rows.sort((a, b) => {
      const cell1 = a.cells[e.target.cellIndex].textContent;
      const cell2 = b.cells[e.target.cellIndex].textContent;

      if (e.target.textContent === 'Salary') {
        const num1 = cell1.replace(/[$,]/g, '');
        const num2 = cell2.replace(/[$,]/g, '');

        return num2 - num1;
      }

      return cell2.localeCompare(cell1);
    });
  }
  tbody.append(...rows);
});

// selecting
tbody.addEventListener('click', (e) => {
  if (document.querySelector('.active')) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
<label>Name: 
  <input 
    name="name" 
    type="text" 
    data-qa="name" 
    minlength="4"
    required
  >
</label>

<label>Position: 
  <input 
    name="position" 
    type="text" 
    data-qa="position" 
    required
  >
</label>

<label>Office: 
  <select name="office" data-qa="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore" selected>Singapore</option>
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
    min="18" 
    max="90"
    required
  >
</label>

<label>Salary: 
  <input 
    name="salary" 
    type="text" 
    data-qa="salary" 
    required
  >
</label>

<button type="submit">Save to table</button>
`;

body.append(form);

// form validation & adding info to the table
document.querySelector('button').addEventListener('click', (e) => {
  e.preventDefault();

  let validity = true;
  let errorText = '';

  for (const input of form) {
    if (!input.checkValidity()) {
      errorText += `Invalid value in '${input.name}' field. `;
      validity = false;
    }
  }

  const div = document.createElement('div');

  div.className = 'notification';

  if (validity) {
    div.textContent = 'SUCCESS';
    div.classList.add('success');

    const tr = document.createElement('tr');

    for (let inputIndex = 0; inputIndex < form.length - 1; inputIndex++) {
      const td = document.createElement('td');

      let value = form[inputIndex].value;

      if (form[inputIndex] === form.salary) {
        value = +value;
        value = '$' + value.toLocaleString('en-US');
      }
      td.textContent = value;
      tr.append(td);
    }
    tbody.append(tr);
  } else {
    div.textContent = errorText;
    div.classList.add('error');
  }
  body.append(div);
  setTimeout(() => div.remove(), 3000);
});

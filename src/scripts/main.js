'use strict';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

let counter = 0;
let previusTHindex = null;

tHead.addEventListener('click', (e) => {
  if (e.target.nodeName !== 'TH') {
    return null;
  }

  counter++;

  const th = e.target;
  const columnIndex = th.cellIndex;

  if (previusTHindex !== columnIndex) {
    previusTHindex = columnIndex;
    counter = 1;
  }

  const rowsToSort = Array.from(tBody.rows);

  rowsToSort.sort((a, b) => {
    const contentA = a.cells[columnIndex].textContent.trim();
    const contentB = b.cells[columnIndex].textContent.trim();

    const maybeNum = parseFloat(contentA.replace(/[^0-9.-]+/g, ''));
    const maybeNum2 = parseFloat(contentB.replace(/[^0-9.-]+/g, ''));

    if (!isNaN(maybeNum) && !isNaN(maybeNum2)) {
      if (counter % 2 !== 0) {
        return maybeNum - maybeNum2;
      } else {
        return maybeNum2 - maybeNum;
      }
    }

    if (counter % 2 !== 0) {
      return contentA.localeCompare(contentB);
    } else {
      return contentB.localeCompare(contentA);
    }
  });

  tBody.append(...rowsToSort);
});

let previusTR = null;

tBody.addEventListener('click', (e) => {
  const clickedTR = e.target.closest('tr');

  if (!clickedTR) {
    return;
  }

  if (previusTR) {
    previusTR.classList.remove('active');
  }

  clickedTR.classList.add('active');
  previusTR = clickedTR;
});

function addForm() {
  const formHTML = `
  <form novalidate class="new-employee-form" >
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  </form>
`;

  document.body.insertAdjacentHTML('beforeend', formHTML);
}

addForm();

const form = document.querySelector('.new-employee-form');

const handleNotification = (message, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');

  h2.textContent = message;
  h2.classList.add('title');
  div.appendChild(h2);
  div.setAttribute('data-qa', 'notification');
  div.classList.add('notification', type);

  document.body.appendChild(div);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const employeeData = Object.fromEntries(formData.entries());

  if (employeeData.name.trim().length < 4) {
    handleNotification('Print name more than four letters', 'error');

    return;
  }

  if (employeeData.position.trim() === '') {
    handleNotification('Position must be', 'error');

    return;
  }

  if (employeeData.age < 18 || employeeData.age > 90) {
    handleNotification('Print new age', 'error');

    return;
  }

  if (Number(employeeData.salary) <= 0) {
    handleNotification('Salary must be', 'error');

    return;
  }

  const salary = Number(employeeData.salary);
  const salaryToSave = '$' + salary.toLocaleString('en-US');

  const dataToSave = {
    ...employeeData,
    salary: salaryToSave,
  };

  addEmployeeRow(dataToSave);
  handleNotification('added new employee', 'success');
  form.reset();
});

function addEmployeeRow(employeeData) {
  if (!tBody) {
    return;
  }

  const row = tBody.insertRow();

  ['name', 'position', 'office', 'age', 'salary'].forEach((key) => {
    row.insertCell().textContent = employeeData[key];
  });
}

'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];
let ascName = true;
let ascPosition = true;
let ascOffice = true;
let ascAge = true;
let ascSalary = true;
const body = document.querySelector('body');
const form = document.createElement('form');
const notification = document.createElement('div');
const newRow = document.createElement('tr');

body.appendChild(notification);
body.appendChild(form);

form.outerHTML = `<form class="new-employee-form">
<label>Name: <input name="name" type="text" data-qa="name" ></label>
<label>Position: <input name="position" type="text" data-qa="position" >
</label>
<label>Office: <select name="office" data-qa="office">
<option value="Tokyo">Tokyo</option>
<option value="Singapore">Singapore</option>
<option value="London">London</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>
</select>
</label>
<label>Age: <input name="age" type="number" data-qa="age" ></label>
<label>Salary: <input name="salary" type="number"  data-qa="salary" ></label>
<button name="button">Save to table</button>
</form>`;

const nameInput = document.querySelector('input[name="name"]');
const positionInput = document.querySelector('input[name="position"]');
const officeInput = document.querySelector('select[name="office"]');
const ageInput = document.querySelector('input[name="age"]');
const salaryInput = document.querySelector('input[name="salary"]');
const button = document.querySelector('button');

thead.addEventListener('click', e => {
  const columnIndex = e.target.cellIndex;

  if (e.target.cellIndex === 0) {
    if (ascName) {
      rows.sort((a, b) => {
        const current = a.cells[columnIndex].innerHTML;
        const next = b.cells[columnIndex].innerHTML;

        ascName = false;

        return current.localeCompare(next);
      });
    } else {
      rows.sort((a, b) => {
        const current = b.cells[columnIndex].innerHTML;
        const next = a.cells[columnIndex].innerHTML;

        ascName = true;

        return current.localeCompare(next);
      });
    }
  }

  if (e.target.cellIndex === 1) {
    if (ascPosition) {
      rows.sort((a, b) => {
        const current = a.cells[columnIndex].innerHTML;
        const next = b.cells[columnIndex].innerHTML;

        ascPosition = false;

        return current.localeCompare(next);
      });
    } else {
      rows.sort((a, b) => {
        const current = b.cells[columnIndex].innerHTML;
        const next = a.cells[columnIndex].innerHTML;

        ascPosition = true;

        return current.localeCompare(next);
      });
    }
  }

  if (e.target.cellIndex === 2) {
    if (ascOffice) {
      rows.sort((a, b) => {
        const current = a.cells[columnIndex].innerHTML;
        const next = b.cells[columnIndex].innerHTML;

        ascOffice = false;

        return current.localeCompare(next);
      });
    } else {
      rows.sort((a, b) => {
        const current = b.cells[columnIndex].innerHTML;
        const next = a.cells[columnIndex].innerHTML;

        ascOffice = true;

        return current.localeCompare(next);
      });
    }
  }

  if (e.target.cellIndex === 3) {
    if (ascAge) {
      rows.sort((a, b) => {
        const current = a.cells[columnIndex].innerHTML;
        const next = b.cells[columnIndex].innerHTML;

        ascAge = false;

        return Number(current) - Number(next);
      });
    } else {
      rows.sort((a, b) => {
        const current = b.cells[columnIndex].innerHTML;
        const next = a.cells[columnIndex].innerHTML;

        ascAge = true;

        return Number(current) - Number(next);
      });
    }
  }

  if (e.target.cellIndex === 4) {
    if (ascSalary) {
      rows.sort((a, b) => {
        const current = a.cells[columnIndex].innerHTML;
        const next = b.cells[columnIndex].innerHTML;

        ascSalary = false;

        return salaryToNumber(current) - salaryToNumber(next);
      });
    } else {
      rows.sort((a, b) => {
        const current = b.cells[columnIndex].innerHTML;
        const next = a.cells[columnIndex].innerHTML;

        ascSalary = true;

        return salaryToNumber(current) - salaryToNumber(next);
      });
    }
  }
  rows.forEach(x => tbody.appendChild(x));
});

tbody.addEventListener('click', e => {
  rows.map(row => row.classList.remove('active'));
  e.target.parentNode.classList.add('active');
});

button.addEventListener('click', (e) => {
  e.preventDefault();
  tbody.appendChild(newRow);
  notification.setAttribute('data-qa', 'notification');

  if (!nameInput.value || !ageInput.value || !officeInput.value
    || !positionInput.value || !salaryInput.value) {
    notification.classList.add('error');
    notification.textContent = 'at least one of the fields is empty';
  } else if (nameInput.value.length < 4) {
    notification.classList.add('error');
    notification.textContent = 'Name must have at least 4 letters';
  } else if (ageInput.value < 18 || ageInput.value > 90) {
    notification.classList.add('error');
    notification.textContent = 'Age must be between 18 and 90';
  } else {
    newRow.outerHTML = `<tr>
    <td>${nameInput.value}</td>
    <td>${positionInput.value}</td>
    <td>${officeInput.value}</td>
    <td>${ageInput.value}</td>
    <td>$${Number(salaryInput.value).toLocaleString('en-US')}</td>
    </tr>`;
    notification.classList.add('success');
    notification.textContent = 'You have added a new employee';
    nameInput.value = '';
    positionInput.value = '';
    officeInput.value = 'Tokyo';
    ageInput.value = '';
    salaryInput.value = '';
  }
});

function salaryToNumber(string) {
  return Number(string.slice(1).replaceAll(',', ''));
}

'use strict';

const employeeTable = document.querySelector('table');
const tableBody = document.querySelector('tbody');
let lastSortedColumn = null;
let isAscending = true;

employeeTable.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const colIndex = e.target.cellIndex;

  if (colIndex === lastSortedColumn) {
    isAscending = !isAscending;
  } else {
    isAscending = true;
    lastSortedColumn = colIndex;
  }

  const allSortedTr = Array.from(tableBody.querySelectorAll('tr')).sort(
    (rowA, rowB) => {
      const textA = rowA.cells[colIndex].textContent;
      const textB = rowB.cells[colIndex].textContent;

      if (isAscending === true) {
        return textA.localeCompare(textB, undefined, { numeric: true });
      } else {
        return textB.localeCompare(textA, undefined, { numeric: true });
      }
    },
  );

  for (const tr of allSortedTr) {
    tableBody.append(tr);
  }
});

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const activeRow = tableBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const formHTML = `<form class = 'new-employee-form' novalidate>
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position: <input name="position" type="text" data-qa="position" required></label>
<label>Office:
  <select name="office" data-qa="office" required>
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
  </select>
</label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
<button type="submit">Save to table</button>
</form>`;

document.body.insertAdjacentHTML('beforeend', formHTML);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = e.target.name.value;
  const positionValue = e.target.position.value;
  const officeValue = e.target.office.value;
  const ageValue = Number(e.target.age.value);
  const salaryValue = Number(e.target.salary.value);

  if (
    !nameValue ||
    !positionValue ||
    !officeValue ||
    !ageValue ||
    !salaryValue
  ) {
    showNotification('All fields are required', 'error');

    return;
  }

  if (nameValue.length < 4) {
    showNotification('Name must be at least 4 characters long', 'error');

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const formattedSalary = '$' + salaryValue.toLocaleString('en-US');

  const values = [
    nameValue,
    positionValue,
    officeValue,
    ageValue,
    formattedSalary,
  ];

  const newTr = document.createElement('tr');

  for (const val of values) {
    const newTd = document.createElement('td');

    newTd.textContent = val;
    newTr.append(newTd);
  }

  tableBody.append(newTr);

  e.target.reset();
  showNotification('New employee successfully added!', 'success');
});

function showNotification(text, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.textContent = text;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

tableBody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || td.querySelector('.cell-input')) {
    return;
  }

  const initialText = td.textContent;

  td.textContent = '';

  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  newInput.value = initialText;

  td.append(newInput);
  newInput.focus();

  function saveLogic() {
    if (newInput.value.trim() === '') {
      td.textContent = initialText;
    } else {
      td.textContent = newInput.value;
    }
  }

  newInput.addEventListener('blur', () => {
    saveLogic();
  });

  newInput.addEventListener('keydown', (ee) => {
    if (ee.key === 'Enter') {
      saveLogic();
    }
  });
});

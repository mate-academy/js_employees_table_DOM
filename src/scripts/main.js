'use strict';

const headers = document.querySelectorAll('thead th');
let currentColumn = null;
let isAsc = true;

headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    if (currentColumn === index) {
      isAsc = !isAsc;
    } else {
      isAsc = true;
      currentColumn = index;
    }
    sortByColumn(index, isAsc);
  });
});

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

function sortByColumn(colIndex, asc) {
  const rowsArray = Array.from(tbody.rows);

  rowsArray.sort((a, b) => {
    const contentA = a.cells[colIndex].textContent.trim();
    const contentB = b.cells[colIndex].textContent.trim();
    const numA = parseFloat(contentA.replace(/[$,]/g, ''));
    const numB = parseFloat(contentB.replace(/[$,]/g, ''));

    let comparison = 0;

    if (!isNaN(numA) && !isNaN(numB)) {
      comparison = numA - numB;
    } else {
      comparison = contentA.localeCompare(contentB);
    }

    return asc ? comparison : -comparison;
  });
  tbody.append(...rowsArray);
}

tbody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('tr');

  if (!targetRow || !tbody.contains(targetRow)) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  targetRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('novalidate', true);

form.innerHTML = `
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
`;

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = form.elements.name.value.trim();
  const positionValue = form.elements.position.value.trim();
  const officeValue = form.elements.office.value;
  const ageRaw = form.elements.age.value.trim();
  const salaryRaw = form.elements.salary.value.trim();

  if (!nameValue || !positionValue || !ageRaw || !salaryRaw) {
    showNotification('All fields are required', true);

    return;
  }

  if (nameValue.length < 4) {
    showNotification('Name is too short', true);

    return;
  }

  if (positionValue.length < 4) {
    showNotification('Position is too short', true);

    return;
  }

  const ageNum = Number(ageRaw);

  if (ageNum < 18 || ageNum > 90) {
    showNotification('Age must be between 18 and 90', true);

    return;
  }

  const salaryNum = Number(salaryRaw);
  const formattedSalary = '$' + salaryNum.toLocaleString('en-US');

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameValue}</td>
    <td>${positionValue}</td>
    <td>${officeValue}</td>
    <td>${ageNum}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.appendChild(newRow);
  showNotification('Employee added successfully!', false);
  form.reset();
});

function showNotification(message, isError) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');

  if (isError) {
    notification.classList.add('error');
  } else {
    notification.classList.add('success');
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 2000);
}

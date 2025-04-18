'use strict';

// write code here
const body = document.getElementsByTagName('tbody')[0];
const rows = [...body.getElementsByTagName('tr')];

const head = document.getElementsByTagName('thead')[0];
const headCol = [...head.getElementsByTagName('th')];

for (const th of headCol) {
  th.addEventListener('click', function () {
    const index = headCol.indexOf(th);

    sortingTable(index);
  });
}

let sortAsc = true;
let previous;

function sortingTable(index) {
  if (index === previous) {
    sortAsc = false;
    previous = null;
  } else {
    previous = index;
    sortAsc = true;
  }

  const sortedRows = rows.sort((rowA, rowB) => {
    const cellA = rowA.children[index].innerText.trim();
    const cellB = rowB.children[index].innerText.trim();
    const valA = parseCell(cellA, index);
    const valB = parseCell(cellB, index);

    if (valA < valB) {
      return sortAsc ? -1 : 1;
    }

    if (valA > valB) {
      return sortAsc ? 1 : -1;
    }

    return 0;
  });

  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  sortedRows.forEach((row) => {
    body.appendChild(row);
  });
}

function parseCell(value, index) {
  if (index === headCol.length - 1) {
    return parseFloat(value.replace(/[$,]/g, '')) || 0;
  }

  return isNaN(value) ? value.toLowerCase() : parseFloat(value);
}

for (const row of rows) {
  row.addEventListener('click', function () {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.toggle('active');
  });
}

const form = document.createElement('form');

form.classList.add('new-employee-form');

// Optionally add some content or inputs
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

// Append it to the body (or any other container)
document.body.appendChild(form);

document
  .getElementsByTagName('form')[0]
  .addEventListener('submit', function (e) {
    const nameValue = document.getElementsByName('name')[0].value;
    let ageValidation = true;
    let nameValidation = true;

    if (nameValue.length < 4) {
      e.preventDefault();
      showNotification('error', 'name is too short');
      nameValidation = false;
    }

    const ageValue = document.getElementsByName('age')[0].value;

    if (ageValue < 18 || ageValue > 90) {
      e.preventDefault();
      showNotification('error', 'age is not valid');
      ageValidation = false;
    }

    if (ageValidation && nameValidation) {
      e.preventDefault();
      saveDataToTable();
      showNotification('success', 'Data is saved');
    }
  });

function showNotification(result, message) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = result;
  notification.innerHTML = message;

  document.getElementsByTagName('form')[0].appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 10000);
}

function saveDataToTable() {
  const row = document.createElement('tr');
  const nameValue = document.getElementsByName('name')[0].value;
  const positionValue = document.getElementsByName('position')[0].value;
  const officeValue = document.getElementsByName('office')[0].value;
  const ageValue = document.getElementsByName('age')[0].value;
  const salaryValue = Number(
    document.getElementsByName('salary')[0].value,
  ).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
  const values = [nameValue, positionValue, officeValue, ageValue, salaryValue];

  for (let i = 0; i < 5; i++) {
    const td = document.createElement('td');

    td.textContent = values[i];
    row.appendChild(td);
  }
  body.appendChild(row);
  document.getElementsByTagName('form')[0].reset();
}

const tdElements = [...body.getElementsByTagName('td')];
let currentEditingCell = null;

for (const td of tdElements) {
  td.addEventListener('dblclick', function () {
    if (currentEditingCell) {
      return;
    }

    const originalText = td.textContent.trim();

    td.textContent = '';

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = originalText;
    td.appendChild(input);
    input.focus();

    currentEditingCell = td;

    function save() {
      const newValue = input.value.trim();

      td.textContent = newValue !== '' ? newValue : originalText;
      currentEditingCell = null;
    }

    input.addEventListener('blur', save);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        save();
      }
    });
  });
}

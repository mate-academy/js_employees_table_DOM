'use strict';

function makeNumber(str) {
  return Number(str.replace(/[$,]/g, ''));
}

function detectDataType(value) {
  if (!isNaN(value) || !isNaN(makeNumber(value))) {
    return 'number';
  } else {
    return 'string';
  }
}

const body = document.querySelector('body');
const table = document.querySelector('table');
const headers = document.querySelectorAll('th');
const firstRow = table.querySelector('tbody tr');
const tableBody = table.querySelector('tbody');
const tableRows = Array.from(tableBody.rows);

if (firstRow) {
  headers.forEach((header, index) => {
    const firstCell = firstRow.cells[index];

    if (firstCell) {
      const firstCellValue = firstCell.textContent.trim();

      header.dataset.type = detectDataType(firstCellValue);
      header.dataset.sortASC = 'true';

      header.addEventListener('click', () => {
        const isAscending = header.dataset.sortASC === 'true';

        header.dataset.sortASC = isAscending ? 'false' : 'true';

        const sortedRows = tableRows.sort((a, b) => {
          const aContent = a.cells[index].textContent.trim();
          const bContent = b.cells[index].textContent.trim();

          let comparison = 0;

          if (header.dataset.type === 'number') {
            comparison = makeNumber(aContent) - makeNumber(bContent);
          } else {
            comparison = aContent.localeCompare(bContent);
          }

          return isAscending ? comparison : -comparison;
        });

        tableBody.innerHTML = '';

        sortedRows.forEach((row) => {
          tableBody.appendChild(row);
        });
      });
    }
  });
}

let selectedRow = null;

tableRows.forEach((row) => {
  row.addEventListener('click', (e) => {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }

    const currentRow = e.currentTarget;

    currentRow.classList.add('active');

    selectedRow = currentRow;
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';
form.action = '#';
form.method = 'POST';
form.setAttribute('novalidate', true);

form.innerHTML = `
  <label>
    Name:
    <input
      data-qa="name"
      type="text"
      name="name"
      required
    />
  </label>

  <label>
    Position:
    <input
      data-qa="position"
      type="text"
      name="position"
      required
    />
  </label>

  <label>
    Office:
    <select
      data-qa="office"
      name="office"
      required
    >
      <option value="empty">Select office</option>
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
      data-qa="age"
      type="number"
      name="age"
      required
    />
  </label>

  <label>
    Salary:
    <input
      data-qa="salary"
      type="number"
      name="salary"
      required
    />
  </label>
  <button type="submit">Save to table</button>
`;

body.append(form);

const pushNotification = (posTop, posRight, title, description, type = '') => {
  const message = document.createElement('div');

  message.className = 'notification';
  message.dataset.qa = 'notification';
  message.classList.add(type);
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  message.innerHTML = `
    <h2 class='title'>
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `;

  body.append(message);

  setTimeout(() => {
    message.remove();
  }, 5000);
};

const checkData = (data) => {
  const { name: employeeName, position, office, age, salary } = data;

  if (!employeeName || employeeName.trim().length < 4) {
    pushNotification(
      10,
      10,
      'Error!',
      'Name must be at least 4 characters long',
      'error',
    );

    return false;
  }

  if (!position.trim()) {
    pushNotification(
      10,
      10,
      'Error!',
      'Position field cannot be empty!',
      'error',
    );

    return false;
  }

  if (!office || office === 'empty') {
    pushNotification(
      10,
      10,
      'Error!',
      'Office field cannot be empty!',
      'error',
    );

    return false;
  }

  if (!age || age < 18 || age > 90) {
    pushNotification(
      10,
      10,
      'Error!',
      'Age must be between 18 and 90',
      'error',
    );

    return false;
  }

  if (!salary || isNaN(salary)) {
    pushNotification(500, 10, 'Error!', 'Salary must be a number', 'error');

    return false;
  }

  return true;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formObj = Object.fromEntries(formData.entries());

  if (!checkData(formObj)) {
    return;
  }

  const newRow = document.createElement('tr');

  const formattedSalary = Number(formObj.salary).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${formObj.name}</td>
    <td>${formObj.position}</td>
    <td>${formObj.office}</td>
    <td>${formObj.age}</td>
    <td>$${formattedSalary}</td>
    `;

  tableBody.append(newRow);

  pushNotification(
    10,
    10,
    'Success!',
    'New employee added to the table',
    'success',
  );

  form.reset();
});

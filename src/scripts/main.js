const table = document.querySelector('table');
const headers = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');
const rows = [...tbody.rows];

document.addEventListener('DOMContentLoaded', () => {
  headers.forEach((header, index) => {
    let sortDirection = 'asc';
    let activeHeader = null;

    header.addEventListener('click', () => {
      if (activeHeader !== header) {
        sortDirection = 'asc';
        activeHeader = header;
      } else {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      }

      sortTable(table, index, sortDirection);
    });
  });
});

function sortTable(tableT, columnIndex, direction) {
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim().toLowerCase();
    const cellB = rowB.cells[columnIndex].textContent.trim().toLowerCase();

    let valueA, valueB;

    if (columnIndex === 3 || columnIndex === 4) {
      valueA = parseFloat(cellA.replace(/[$, ]/g, ''));
      valueB = parseFloat(cellB.replace(/[$, ]/g, ''));
    } else {
      valueA = cellA;
      valueB = cellB;
    }

    if (direction === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });

  rows.forEach((row) => tableT.querySelector('tbody').appendChild(row));
}

tbody.addEventListener('click', (e) => {
  rows.forEach((row) => {
    row.classList.remove('active');
  });

  e.target.parentNode.classList.add('active');
});

table.insertAdjacentHTML(
  'afterend',
  `
  <form class="new-employee-form">
    <label>
      Name: <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position: <input name="position" type="text" data-qa="position" required>
    </label>
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
    <label>
      Age: <input name="age" type="number"
      data-qa="age" required>
    </label>
    <label>
      Salary: <input name="salary" type="number"
        data-qa="salary" required>
    </label>
    <button name="button" type="submit">Save to table</button>
  </form>
`,
);

const form = document.querySelector('.new-employee-form');

function createNotification(type, description) {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="notification ${type}" data-qa="notification">
      <span class="title">${type}</span>
      <p>${description}</p>
    </div>
  `,
  );

  const message = document.querySelector('.notification');

  setTimeout(() => {
    message.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmp = form.name.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = Number(form.age.value);
  const salary = Number(form.salary.value);

  let errorMessage = '';
  let isValid = true;

  if (nameEmp.length < 4) {
    errorMessage += 'Name must be at least 4 characters long';
    isValid = false;
  }

  if (age < 18 || age > 90) {
    errorMessage += 'Age must be between 18 and 90 years';
    isValid = false;
  }

  if (!isValid) {
    createNotification('error', errorMessage);

    return;
  }

  tbody.insertAdjacentHTML(
    'beforeend',
    `
    <tr>
      <td>${nameEmp}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${`$${salary.toLocaleString('en-US')}`}</td>
    </tr>
  `,
  );

  rows.push(tbody.lastElementChild);

  createNotification('success', 'Success! Employee added to the table');
  form.reset();
});

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;

  if (target.tagName === 'TD') {
    const currentText = target.textContent.trim();
    const input = document.createElement('input');

    input.value = currentText;
    input.className = 'cell-input';
    target.textContent = '';
    target.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      const newValue = input.value.trim();

      if (newValue === '') {
        target.textContent = currentText;
      } else {
        target.textContent = newValue;
      }
    });

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        const newValue = input.value.trim();

        if (newValue === '') {
          target.textContent = currentText;
        } else {
          target.textContent = newValue;
        }
        input.blur();
      }
    });
  }
});

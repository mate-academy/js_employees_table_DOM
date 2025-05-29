'use strict';

const headers = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');
const employees = [];
let sortAscending = true;
let activeSortingKey = '';

const getRowData = (row) => {
  return Array.from(row.cells).map((cell) => cell.textContent);
};

const rowsEqual = (rowData1, rowData2) => {
  return (
    rowData1.length === rowData2.length &&
    rowData1.every((val, i) => val === rowData2[i])
  );
};

const setActiveRow = (row) => {
  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
};

const bindRowClick = (row) => {
  row.addEventListener('click', () => setActiveRow(row));
};

const renderTable = (activeRowData = null) => {
  tbody.innerHTML = employees
    .map((emp) => {
      const values = Object.values(emp);
      const isActive = activeRowData && rowsEqual(values, activeRowData);

      return `<tr class="${isActive ? 'active' : ''}">${values.map((v) => `<td>${v}</td>`).join('')}</tr>`;
    })
    .join('');

  Array.from(tbody.rows).forEach(bindRowClick);
};

Array.from(tbody.rows).forEach((row) => {
  const employee = {};

  row.querySelectorAll('td').forEach((cell, i) => {
    employee[headers[i].textContent.toLowerCase()] = cell.textContent;
  });
  employees.push(employee);
  bindRowClick(row);
});

const sortEmployeesByKey = (key) => {
  if (activeSortingKey === key) {
    sortAscending = !sortAscending;
  } else {
    activeSortingKey = key;
    sortAscending = true;
  }

  employees.sort((a, b) => {
    const valA = a[key].trim();
    const valB = b[key].trim();
    const numA = +valA.replace(/[$,]/g, '');
    const numB = +valB.replace(/[$,]/g, '');

    const compare =
      !isNaN(numA) && !isNaN(numB) ? numA - numB : valA.localeCompare(valB);

    return sortAscending ? compare : -compare;
  });

  const activeRow = tbody.querySelector('tr.active');
  const activeData = activeRow ? getRowData(activeRow) : null;

  renderTable(activeData);
};

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const key = header.textContent.toLowerCase();

    sortEmployeesByKey(key);
  });
});

const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

employeeForm.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office"required>
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
document.body.appendChild(employeeForm);

employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const rawData = new FormData(employeeForm);

  const formData = Object.fromEntries(
    Array.from(rawData.entries()).map(([key, value]) => [
      key.toLowerCase(),
      value,
    ]),
  );

  const salaryNumber = Number(formData.salary);

  formData.salary = `$${salaryNumber.toLocaleString('en-US')}`;

  employees.push(formData);
  renderTable(Object.values(formData));
  employeeForm.reset();
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  const titleElement = document.createElement('h2');

  titleElement.classList.add('title');
  titleElement.textContent = title;
  notification.appendChild(titleElement);

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;
  notification.appendChild(descriptionElement);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};

const saveButton = employeeForm.querySelector('button');

saveButton.addEventListener('click', (e) => {
  e.preventDefault();

  const { name: n, age: a, position: p } = employeeForm.elements;
  const nameVal = n.value.trim();
  const positionVal = p.value.trim();
  const ageVal = +a.value;

  if (nameVal.length < 4) {
    return pushNotification(
      10,
      10,
      'Name too short',
      'Name must be at least 4 characters long',
      'error',
    );
  }

  if (!positionVal) {
    return pushNotification(
      10,
      10,
      'Position required',
      'Position cannot be empty',
      'error',
    );
  }

  if (ageVal < 18 || ageVal > 90) {
    return pushNotification(
      10,
      10,
      'Invalid Age',
      'Age must be between 18 and 90',
      'error',
    );
  }

  pushNotification(
    10,
    10,
    'Success',
    'Employee was successfully added to the table',
    'success',
  );

  employeeForm.dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true }),
  );
});

tbody.addEventListener('dblclick', (changeEvent) => {
  const cell = changeEvent.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  const originalText = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalText;
  cell.appendChild(input);
  input.focus();

  const save = () => {
    const newValue = input.value.trim() === '' ? originalText : input.value;
    const rowElement = cell.parentElement;
    const rowIndex = Array.from(tbody.rows).indexOf(rowElement);
    const cellIndex = Array.from(rowElement.cells).indexOf(cell);

    const key = headers[cellIndex].textContent.toLowerCase();

    employees[rowIndex][key] = newValue;

    renderTable();
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
});

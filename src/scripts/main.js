'use strict';

// ---------- dom references ----------

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

// ---------- helpers ----------

const getRows = () => [...tbody.querySelectorAll('tr')];

const parseCellValue = (text) => {
  const cleaned = text.replace(/[$,]/g, '');
  const number = Number(cleaned);

  return isNaN(number) ? text : number;
};

const clearHeaderOrder = (headers) => {
  headers.forEach((th) => delete th.dataset.order);
};

// ---------- sorting ----------

thead.addEventListener('click', (ev) => {
  const th = ev.target.closest('th');

  if (!th) {
    return;
  }

  const headers = [...th.parentElement.children];
  const columnIndex = headers.indexOf(th);

  const order = th.dataset.order === 'asc' ? 'desc' : 'asc';

  clearHeaderOrder(headers);
  th.dataset.order = order;

  const rows = getRows();

  rows.sort((a, b) => {
    const aValue = parseCellValue(a.children[columnIndex].textContent.trim());
    const bValue = parseCellValue(b.children[columnIndex].textContent.trim());

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue;
    }

    return String(aValue).localeCompare(String(bValue));
  });

  if (order === 'desc') {
    rows.reverse();
  }

  rows.forEach((row) => tbody.appendChild(row));
});

// ---------- row selection ----------

tbody.addEventListener('click', (ev) => {
  const row = ev.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelector('.active')?.classList.remove('active');
  row.classList.add('active');
});

// ---------- form ----------

const createForm = () => {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" data-qa="name"></label>
    <label>Position: <input name="position" data-qa="position"></label>
    <label>
      Office:
      <select name="office" data-qa="office">
        <option value="">Select office</option>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input type="number" name="age" data-qa="age"></label>
    <label>Salary: <input type="number" name="salary" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  `;

  form.addEventListener('submit', handleFormSubmit);
  table.after(form);
};

// ---------- form logic ----------

const handleFormSubmit = (ev) => {
  ev.preventDefault();

  const data = Object.fromEntries(new FormData(ev.target));

  data.age = Number(data.age);
  data.salary = Number(data.salary);

  const error = validateEmployee(data);

  if (error) {
    notify('Validation error', error, 'error');

    return;
  }

  addEmployee(data);
  notify('Success', 'Employee added successfully', 'success');
  ev.target.reset();
};

const validateEmployee = ({ name: empName, position, office, age, salary }) => {
  if (!empName || !position || !office || !age || !salary) {
    return 'All fields are required';
  }

  if (empName.length < 4) {
    return 'Name must contain at least 4 letters';
  }

  if (age < 18 || age > 90) {
    return 'Age must be between 18 and 90';
  }

  return null;
};

// ---------- table ----------

const addEmployee = ({ name: empName, position, office, age, salary }) => {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${empName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(row);
};

// ---------- notification ----------

const notify = (title, description, type) => {
  document.querySelector('.notification')?.remove();

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  notification.style.top = '10px';
  notification.style.right = '10px';

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 6000);
};

// ---------- cell editing ----------

let activeInput = null;

tbody.addEventListener('dblclick', (ev) => {
  const cell = ev.target.closest('td');

  if (!cell || activeInput) {
    return;
  }

  const oldValue = cell.textContent.trim();

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.textContent = '';
  cell.appendChild(input);
  activeInput = input;
  input.focus();

  const save = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue || oldValue;
    activeInput = null;
  };

  const cancel = () => {
    cell.textContent = oldValue;
    activeInput = null;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      save();
    }

    if (e.key === 'Escape') {
      cancel();
    }
  });
});

// ---------- init ----------

createForm();

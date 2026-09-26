'use strict';

const tab = document.querySelector('table');

const tHead = tab.querySelector('thead');
const tBody = tab.querySelector('tbody');

let currentColIndex = null;
let isAsc = true;

const filterByType = (id, lowGrowSort, a, b) => {
  const txtA = a.cells[id].textContent;
  const txtB = b.cells[id].textContent;

  if (id === 3 || id === 4) {
    const numA = txtA.replace(/\D/g, '');
    const numB = txtB.replace(/\D/g, '');

    return lowGrowSort
      ? Number(numA) - Number(numB)
      : Number(numB) - Number(numA);
  } else {
    return lowGrowSort ? txtA.localeCompare(txtB) : txtB.localeCompare(txtA);
  }
};

tHead.addEventListener('click', (e) => {
  const rows = [...tBody.rows];
  const thSelect = e.target.closest('th');

  if (!thSelect) {
    return;
  }

  const colId = thSelect.cellIndex;

  if (colId === currentColIndex) {
    isAsc = !isAsc;
  } else {
    currentColIndex = colId;
    isAsc = true;
  }

  rows.sort((a, b) => filterByType(colId, isAsc, a, b));

  tBody.append(...rows);
});

tBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = tBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

const formHTML = `
  <form class="new-employee-form">
    <label>
      Name:
      <input name="name" type="text" data-qa="name">
    </label>

    <label>
      Position:
      <input name="position" type="text" data-qa="position">
    </label>

    <label>
      Office:
      <select name="office" data-qa="office">
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
      <input name="age" type="number" data-qa="age">
    </label>

    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary">
    </label>

    <button type="submit">Save to table</button>
  </form>
`;

tab.insertAdjacentHTML('afterend', formHTML);

const form = document.querySelector('.new-employee-form');

const formatSalary = (amount) => {
  return `$${Number(amount).toLocaleString('en-US')}`;
};

const showNotification = (message, type) => {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;

  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;

  document.body.append(notification);

  setTimeout(() => notification.remove(), 3000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const employeeName = data.name.trim();
  const position = data.position.trim();
  const office = data.office;
  const age = Number(data.age);
  const salary = Number(data.salary);

  if (!employeeName || !position || !office || !data.age || !data.salary) {
    showNotification('All fields are required!', 'error');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 characters long', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formatSalary(salary)}</td>
  `;

  tBody.append(tr);

  showNotification('Employee successfully added!', 'success');
  form.reset();
});

tBody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || td.querySelector('input')) {
    return;
  }

  const initialValue = td.textContent.trim();

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialValue;

  td.textContent = '';
  td.append(input);
  input.focus();

  const saveValue = () => {
    const newValue = input.value.trim();

    td.textContent = newValue !== '' ? newValue : initialValue;
  };

  input.addEventListener('blur', saveValue);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveValue();
    }
  });
});

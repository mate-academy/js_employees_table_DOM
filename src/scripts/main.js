'use strict';

const body = document.body;
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

function compareRowsByColAsc(colIndex, numeric = false) {
  return (rowA, rowB) => {
    const a = (rowA.cells[colIndex]?.textContent || '').trim();
    const b = (rowB.cells[colIndex]?.textContent || '').trim();

    if (numeric) {
      const na = parseFloat(a.replace(',', '.'));
      const nb = parseFloat(b.replace(',', '.'));

      return na - nb;
    }

    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  };
}

function compareRowsByColDesc(colIndex, numeric = false) {
  return (rowA, rowB) => {
    const a = (rowA.cells[colIndex]?.textContent || '').trim();
    const b = (rowB.cells[colIndex]?.textContent || '').trim();

    if (numeric) {
      const na = parseFloat(a.replace(',', '.'));
      const nb = parseFloat(b.replace(',', '.'));

      return nb - na;
    }

    return b.localeCompare(a, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  };
}

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const th = e.target.closest('th');
    const colIndex = th.cellIndex;
    const isNumeric = th.dataset.type === 'number';
    const rows = Array.from(tbody.rows);
    const currentSort = th.dataset.sort;
    let newSortDirection;

    if (currentSort === 'asc') {
      newSortDirection = 'desc';
    } else {
      newSortDirection = 'asc';
    }

    table.querySelectorAll('th').forEach((el) => {
      if (el !== th) {
        el.dataset.sort = '';
      }
    });

    let comparator;

    if (newSortDirection === 'asc') {
      comparator = compareRowsByColAsc(colIndex, isNumeric);
    } else {
      comparator = compareRowsByColDesc(colIndex, isNumeric);
    }

    rows.sort(comparator);
    rows.forEach((r) => tbody.appendChild(r));
    th.dataset.sort = newSortDirection;
  }
});

tbody.addEventListener('click', (e) => {
  const allTr = tbody.querySelectorAll('tr');
  const tr = e.target.closest('tr');

  allTr.forEach((el) => {
    el.classList.remove('active');
  });

  if (tr) {
    tr.classList.add('active');
  }
});

let title;
let message;
let type;

const pushNotification = (titleText, description, typeText) => {
  const popup = document.createElement('div');
  const h2 = document.createElement('h2');
  const text = document.createElement('p');

  popup.classList.add('notification', typeText);
  popup.setAttribute('data-qa', 'notification');
  h2.classList.add('title');
  h2.textContent = titleText;
  text.textContent = description;
  popup.append(h2, text);
  body.appendChild(popup);

  setTimeout(() => popup.remove(), 4000);
};

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="" disabled selected>Select office</option>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
  `;
body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employee = {
    name: formData.get('name').trim(),
    position: formData.get('position').trim(),
    office: formData.get('office'),
    age: Number(formData.get('age')),
    salary: Number(formData.get('salary')),
  };

  if (
    employee.name.length < 4 ||
    employee.age < 18 ||
    employee.age > 90 ||
    employee.position.length === 0 ||
    !employee.office ||
    !employee.salary ||
    employee.salary <= 0
  ) {
    type = 'error';
    message = 'Введіть коректні дані';
    title = 'Помилка';

    pushNotification(title, message, type);
  } else {
    type = 'success';
    message = 'Працівника додано!';
    title = 'Успіх';

    addEmployeeToTable(employee);
    pushNotification(title, message, type);
    form.reset();
  }
});

function addEmployeeToTable(employee) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>$${employee.salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(tr);
}

tbody.addEventListener('dblclick', (e) => {
  const currentCell = e.target.closest('td');

  if (!currentCell) {
    return;
  }

  const existingInput = tbody.querySelector('input.cell-input');

  if (existingInput) {
    return;
  }

  const oldValue = currentCell.textContent.trim();
  const input = document.createElement('input');

  input.value = oldValue;
  input.classList.add('cell-input');

  currentCell.textContent = '';
  currentCell.append(input);
  input.focus();

  const saveValue = () => {
    const newValue = input.value.trim();

    currentCell.textContent = newValue || oldValue;
  };

  input.addEventListener('blur', saveValue);

  input.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'Enter') {
      saveValue();
    }
  });
});

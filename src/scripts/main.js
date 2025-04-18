'use strict';

// Search
const columnTitles = document.querySelector('thead');

columnTitles.addEventListener('click', (e) => {
  const rows = [...document.querySelectorAll('tbody tr')];
  const reverse = e.target.classList.contains('reverse');

  switch (e.target.textContent) {
    case 'Name': {
      sort(rows, 0, 'text', reverse);
      e.target.classList.toggle('reverse');
      break;
    }

    case 'Position': {
      sort(rows, 1, 'text', reverse);
      e.target.classList.toggle('reverse');
      break;
    }

    case 'Office': {
      sort(rows, 2, 'text', reverse);
      e.target.classList.toggle('reverse');
      break;
    }

    case 'Age': {
      sort(rows, 3, 'number', reverse);
      e.target.classList.toggle('reverse');
      break;
    }

    default: {
      sort(rows, 4, 'salary', reverse);
      e.target.classList.toggle('reverse');
      break;
    }
  }
});

function sort(rows, ind, type, reverse) {
  rows.sort((r1, r2) => {
    const cells1 = r1.querySelectorAll('td');
    const cells2 = r2.querySelectorAll('td');
    const value1 = cells1[ind].textContent;
    const value2 = cells2[ind].textContent;

    if (type === 'text') {
      if (reverse) {
        return value2.trim().localeCompare(value1.trim());
      }

      return value1.trim().localeCompare(value2.trim());
    }

    if (type === 'number') {
      if (reverse) {
        return value2 - value1;
      }

      return value1 - value2;
    }

    if (type === 'salary') {
      if (reverse) {
        return parseSalary(value2) - parseSalary(value1);
      }

      return parseSalary(value1) - parseSalary(value2);
    }
  });

  rows.forEach((row) => {
    document.querySelector('tbody').appendChild(row);
  });
}

function parseSalary(salaryStr) {
  return parseInt(salaryStr.replace(/[^0-9.-]+/g, ''));
}

// Row selection
const tableBody = document.querySelector('tbody');

tableBody.addEventListener('click', (e) => {
  [...document.querySelectorAll('tr')].map((row) => {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  });
  e.target.closest('tr').classList.add('active');
});

// Form
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name:
    <input type="text" name="name" data-qa="name" required />
  </label>
  <label>Position:
    <input type="text" name="position" data-qa="position" required />
  </label>
  <label>Office:
    <select name="location"  data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input type="number" name="age" data-qa="age" required />
  </label>
  <label>Salary:
    <input type="number" name="salary" data-qa="salary" required />
  </label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);
form.setAttribute('novalidate', true);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const person = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.location.value;
  const age = parseInt(form.age.value, 10);
  const salary = parseFloat(form.salary.value);

  if (!person || person.length < 4) {
    notify('Error!', 'Name must be at least 4 characters long.', 'error');

    return;
  }

  if (!position) {
    notify('Error!', 'Position cannot be empty.', 'error');

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    notify('Error!', 'Age must be between 18 and 90.', 'error');

    return;
  }

  if (isNaN(salary) || salary <= 0) {
    notify('Error!', 'Salary must be a positive number.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${person}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salary.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</td>
  `;
  tableBody.appendChild(newRow);
  notify('Success!', 'New employee added successfully.', 'success');
  form.reset();
});

// Notifications
function notify(title, description, type, posTop = 10, posRight = 10) {
  const message = document.createElement('div');

  message.classList.add('notification');
  message.classList.add(type);
  message.setAttribute('data-qa', 'notification');

  const messageTitle = document.createElement('h2');
  const text = document.createElement('p');

  messageTitle.classList.add('title');
  messageTitle.textContent = title;
  text.textContent = description;
  message.append(messageTitle);
  message.append(text);
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  document.body.appendChild(message);

  setTimeout(() => {
    message.style.opacity = '0';
    message.style.transition = 'opacity 0.3s';

    setTimeout(() => {
      if (message.parentElement) {
        message.parentElement.removeChild(message);
      }
    }, 300);
  }, 2000);
}

// Cell editing
let currentEditingInput = null;
let originalValue = '';

document.querySelector('table tbody').addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || currentEditingInput) {
    return;
  }
  originalValue = cell.textContent.trim();

  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = originalValue;
  cell.textContent = '';
  cell.appendChild(input);
  currentEditingInput = input;
  input.focus();

  input.addEventListener('blur', () => {
    saveEdit(cell, input);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

function saveEdit(cell, input) {
  const newValue = input.value.trim();

  cell.textContent = newValue !== '' ? newValue : originalValue;
  currentEditingInput = null;
}

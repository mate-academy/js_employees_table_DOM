'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const theadList = thead.querySelectorAll('th');

const currentSort = {};

// Initialize currentSort object
theadList.forEach((el, index) => {
  currentSort[index] = null;
});

// Sort table in two directions
thead.addEventListener('click', (e) => {
  let theadIndex = null;

  theadList.forEach((el, index) => {
    if (el === e.target) {
      theadIndex = index;

      return index;
    }
  });

  let sortDirection = null;

  if (currentSort[theadIndex] || currentSort[theadIndex] === null) {
    if (currentSort[theadIndex] === null) {
      currentSort[theadIndex] = 'asc';
      sortDirection = 'asc';
    } else if (currentSort[theadIndex] === 'desc') {
      currentSort[theadIndex] = 'asc';
      sortDirection = 'asc';
    } else if (currentSort[theadIndex] === 'asc') {
      currentSort[theadIndex] = 'desc';
      sortDirection = 'desc';
    }
  }

  // Reset other columns sort state
  Object.keys(currentSort).forEach((key) => {
    if (Number(key) !== theadIndex) {
      currentSort[key] = null;
    }
  });

  const rows = Array.from(tbody.querySelectorAll('tr'));
  const isNum = (v) => v !== '' && !Number.isNaN(parseFloat(v)) && isFinite(v);

  const val = (row, idx) => {
    const cell = row.children[idx];

    return cell ? cell.textContent.trim() : '';
  };

  rows.sort((a, b) => {
    const aVal = val(a, theadIndex);
    const bVal = val(b, theadIndex);

    if (sortDirection === 'asc') {
      if (isNum(convertSalary(aVal)) && isNum(convertSalary(bVal))) {
        return (
          parseFloat(convertSalary(aVal)) - parseFloat(convertSalary(bVal))
        );
      }

      return aVal.localeCompare(bVal);
    }

    if (sortDirection === 'desc') {
      if (isNum(convertSalary(aVal)) && isNum(convertSalary(bVal))) {
        return (
          parseFloat(convertSalary(bVal)) - parseFloat(convertSalary(aVal))
        );
      }

      return bVal.localeCompare(aVal);
    }
  });

  rows.forEach((row) => tbody.appendChild(row));
});

// Convert salary and string to number
function convertSalary(salary) {
  if (!Number.isFinite(+salary[0])) {
    return +salary.slice(1).replace(/,/g, '');
  }

  return +salary;
}

// Select row
tbody.addEventListener('click', (e) => {
  Array.from(tbody.children).forEach((row) => row.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

// Create new row
window.addEventListener('load', () => {
  const employeesForm = document.createElement('form');

  employeesForm.classList.add('new-employee-form');

  employeesForm.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office: <select name="office" data-qa="office" required>
      <option value="Tokyo" selected>Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
      </select></label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;

  // Form submission
  employeesForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(employeesForm);

    // Form validation
    if (/^[a-zA-Z]+$/.test(formData.get('name')) === false) {
      pushNotification(
        10,
        10,
        'Error',
        'Name must contain only letters',
        'error',
      );
      employeesForm.reset();

      return;
    }

    if (formData.get('name').length < 4) {
      pushNotification(
        10,
        10,
        'Error',
        'Name must be at least 4 characters long',
        'error',
      );
      employeesForm.reset();

      return;
    }

    if (Number(formData.get('age')) < 18 || Number(formData.get('age')) > 90) {
      pushNotification(
        10,
        10,
        'Error',
        'Age must be at least 18 and age at most 90',
        'error',
      );
      employeesForm.reset();

      return;
    }

    // Add new row to the table
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${formData.get('name')}</td>
      <td>${formData.get('position')}</td>
      <td>${formData.get('office')}</td>
      <td>${formData.get('age')}</td>
      <td>$${Number(formData.get('salary')).toLocaleString('en-US')}</td>
    `;

    tbody.appendChild(newRow);

    employeesForm.reset();

    pushNotification(
      10,
      10,
      'Success',
      'New employee added successfully',
      'success',
    );
  });

  document.body.appendChild(employeesForm);
});

// Push notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notificationTitle.textContent = title;
  notificationDescription.textContent = description;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');
  notificationTitle.classList.add('title');

  switch (type) {
    case 'success':
      notification.classList.add('success');
      break;
    case 'error':
      notification.classList.add('error');
      break;
    case 'warning':
      notification.classList.add('warning');
      break;
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

// Edit cell on double click
tbody.addEventListener('dblclick', (e) => {
  const targetCell = e.target;
  const originalValue = targetCell.textContent;
  const input = document.createElement('input');

  const allCellInputs = tbody.querySelectorAll('.cell-input');

  allCellInputs.forEach((cellInput) => {
    cellInput.remove();
    cellInput.parentElement.textContent = originalValue;
  });

  input.type = 'text';
  input.classList.add('cell-input');
  input.value = originalValue;
  targetCell.textContent = '';
  targetCell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    const newValue = input.value.trim();

    if (newValue === '') {
      targetCell.textContent = originalValue;
    } else {
      targetCell.textContent = newValue;
      pushNotification(10, 10, 'Success', 'Cell updated', 'success');
    }
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

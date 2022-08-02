'use strict';

const table = document.querySelector('table');
const headers = table.querySelector('tr').children;
const tableBody = table.querySelector('tbody');
const rows = tableBody.querySelectorAll('tr');

const directions = Array.from(headers).map(function(header) {
  return '';
});

[].forEach.call(headers, function(header, index) {
  header.addEventListener('click', function() {
    sortColumn(index);
  });
});

const sortColumn = function(index) {
  const newRows = Array.from(rows);
  const direction = directions[index] || 'asc';
  const multiplier = (direction === 'asc') ? 1 : -1;

  newRows.sort(function(rowA, rowB) {
    let cellA = rowA.querySelectorAll('td')[index].innerHTML;
    let cellB = rowB.querySelectorAll('td')[index].innerHTML;

    if (cellA.includes('$') || !isNaN(cellB)) {
      cellA = +cellA.replace(/[$,]/g, '');
      cellB = +cellB.replace(/[$,]/g, '');
    }

    switch (true) {
      case cellA > cellB:
        return 1 * multiplier;
      case cellA < cellB:
        return -1 * multiplier;
      case cellA === cellB:
        return 0;
    }
  });

  directions[index] = direction === 'asc' ? 'desc' : 'asc';

  [].forEach.call(rows, function(row) {
    tableBody.removeChild(row);
  });

  newRows.forEach(function(newRow) {
    tableBody.appendChild(newRow);
  });
};

tableBody.addEventListener('click', (e) => {
  [...tableBody.children].forEach(item => {
    item.classList.remove('active');
  });

  e.target.closest('tr').classList.toggle('active');
});

table.insertAdjacentHTML('afterend', `
  <form class="new-employee-form">
    <label>Name: <input
      name="name"
      type="text"
      data-qa="name"
      required
    >
    </label>

    <label>Position: <input
      name="position"
      type="text"
      data-qa="position"
      required
    >
    </label>

    <label>Office:
      <select
        name="office"
        type="text"
        data-qa="office"
        required
      >
        <option value="Tokyo" selected>Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age: <input
      name="age"
      type="number"
      data-qa="age"
      required
    >
    </label>

    <label>Salary: <input
      name="salary"
      type="number"
      data-qa="salary"
      required
    >
    </label>

    <button type="submit"">
      Save to table
    </button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

function addNotification(type, description) {
  form.insertAdjacentHTML('afterend', `
    <div class="notification" data-qa="notification">
      <h1 class="title"></h1>
      <p></p>
    </div>
  `);

  const notification = document.querySelector('.notification');
  const notificationTitle = notification.querySelector('.title');
  const notificationDescription = notification.querySelector('p');

  switch (type) {
    case 'error':
      notification.classList.add('error');
      notificationTitle.innerHTML = 'ERROR';
      break;

    case 'success':
      notification.classList.add('success');
      notificationTitle.innerHTML = 'SUCCESS';
      break;

    default:
      return;
  }

  notificationDescription.innerHTML = description;

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function validation(key, value) {
  if (key === 'name' && value.length < 4) {
    addNotification('error', 'Name length should be at least 4 letters');

    return false;
  }

  if (key === 'age' && (Number(value) < 18 || Number(value) > 90)) {
    addNotification('error', 'Age should be from 18 to 90');

    return false;
  }

  return true;
}

function normalize(key, value) {
  return key === 'salary'
    ? `$${(Number(value)).toLocaleString('en-US')}`
    : value;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tr = document.createElement('tr');

  for (const [key, value] of formData) {
    if (!validation(key, value)) {
      return;
    }

    tr.insertAdjacentHTML('beforeend', `
      <td>${normalize(key, value)}</td>
    `);
  }

  tableBody.append(tr);
  form.reset();
  addNotification('success', 'New information added to the table');
});

tableBody.addEventListener('dblclick', e => {
  const target = e.target;
  const targetCell = target.cellIndex;
  const startValue = target.innerText;
  const normalizeValue = startValue.replace(/[$,]/g, '');
  const input = form.querySelectorAll('[name]')[targetCell].cloneNode(true);

  input.classList.add('cell-input');
  input.value = normalizeValue;
  target.firstChild.replaceWith(input);
  input.focus();

  input.addEventListener('keypress', eventKey => {
    if (eventKey.key === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', ev => {
    if (!validation(input.name, input.value) || !input.value) {
      target.innerText = startValue;

      return;
    }

    target.innerText = normalize(input.name, input.value);
  });
});

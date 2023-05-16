'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const td = document.querySelectorAll('td');
const rows = [...tbody.rows];
const sortState = {};
const indexCompare = [];
const minLength = 4;
const minAge = 18;
const maxAge = 90;

let valid = true;

// sort
thead.addEventListener('click', e => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = th.cellIndex;
  const number = string => string.replace(/[$,]/g, '');
  const currentSortState = sortState[index];
  const isAscending = currentSortState === 'asc';

  const sortData = rows.map(row => {
    const cell = row.children[index];
    const value = number(cell.textContent);

    return {
      row, value,
    };
  });

  sortData.sort((a, b) => {
    const compareResult = (
      isNaN(a.value) && isNaN(b.value)
        ? a.value.localeCompare(b.value) : a.value - b.value
    );

    return isAscending ? compareResult : -compareResult;
  });

  sortState[index] = isAscending ? 'desc' : 'asc';
  tbody.innerHTML = '';

  sortData.forEach(data => {
    tbody.appendChild(data.row);
  });
});

// active
tbody.addEventListener('click', e => {
  const tr = e.target.closest('tr');

  tbody.querySelectorAll('tr.active').forEach(row => {
    row.classList.remove('active');
  });

  tr.classList.add('active');
});

// form
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label> Name:
    <input type="text" name = "name" data-qa="name" required>
  </label>
  <label> Position:
    <input type="text" name = "position" data-qa="position">
  </label>
  <label> Office:
    <select name = "office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label> Age:
    <input type="number" name = "age" data-qa="age" required>
  </label>
  <label> Salary:
    <input type="number" name = "salary" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`;

body.append(form);

// notification
function pushNotification(title, description, type) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  Object.assign(notification.style, {
    position: 'fixed',
    top: '0px',
    right: '0px',
  });

  notificationTitle.textContent = title;
  notificationDescription.textContent = description;

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notificationTitle.classList.add('title');

  notification.append(notificationTitle, notificationDescription);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
}

function validForm(data) {
  valid = true;

  switch (true) {
    case (data.get('name').trim().length < minLength
      || /\d/.test(data.get('name'))):
      pushNotification(
        'Enter a correct name!',
        'Name must be at least 4 letters without numbers',
        'error'
      );
      valid = false;
      break;
    case data.get('age') < minAge || data.get('age') > maxAge:
      pushNotification(
        'Enter a correct age!',
        'Your age must be from 18 to 90 years',
        'error'
      );
      valid = false;
      break;
    case data.get('position').trim().length < minLength:
      pushNotification(
        'Enter a correct position!',
        'Your position must contain at least 4 letters',
        'error'
      );
      valid = false;
      break;
    case data.get('salary') <= 0:
      pushNotification(
        'Enter a correct salary!',
        'Salary must be more than 0',
        'error'
      );
      valid = false;
      break;
  }
}

// sending data to the table
form.addEventListener('submit', (e) => {
  const data = new FormData(form);
  const salaryResult = `$${Number(data.get('salary')).toLocaleString('de-DE')}`;

  e.preventDefault();
  validForm(data);

  if (!valid) {
    return;
  }

  const newRow = tbody.insertRow();

  newRow.insertCell(0).innerText = data.get('name');
  newRow.insertCell(1).innerText = data.get('position');
  newRow.insertCell(2).innerText = data.get('office');
  newRow.insertCell(3).innerText = data.get('age');
  newRow.insertCell(4).innerText = salaryResult.split('.').join(',');

  rows.push(newRow);
  form.reset();

  pushNotification(
    'Validation Success',
    'Employee is successfully added',
    'success');
});

// table editing
const changeCellOnInput = (e) => {
  switch (e.target.cellIndex) {
    case 0:
    case 1:
      e.target.innerHTML
        = `<input type="text" class="cell-input">`;
      break;

    case 2:
      e.target.innerHTML
      = `
    <select class="cell-input">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
      `;
      break;

    case 3:
    case 4:
      e.target.innerHTML
      = `<input type="number" class="cell-input">`;
      break;
  }

  e.target.firstElementChild.focus();
};

// valid cell
const validCell = (e) => {
  const input = document.querySelector('.cell-input');
  const isValid = () => {
    e.target.firstElementChild.focus();
    valid = true;
  };

  valid = false;

  if (!input.value.length) {
    return valid;
  }

  switch (e.target.cellIndex) {
    case 0:
      if (input.value.length < minLength) {
        isValid();

        pushNotification(
          'Name is not correct',
          'Name must be at least 4 letters without numbers',
          'error'
        );
      }
      break;
    case 1:
      if (input.value.length < minLength) {
        isValid();

        pushNotification(
          'Enter a correct position!',
          'Your position must contain at least 4 letters',
          'error'
        );
      }
      break;
    case 3:
      if (input.value < minAge || input.value > maxAge) {
        isValid();

        pushNotification(
          'Age is not correct',
          'Your age must be from 18 to 90 years',
          'error'
        );
      }
      break;
    default:
      return valid;
  }
};

const editCells = (el, prev) => {
  const newText = el.target.firstElementChild.value;

  if (newText === '' || newText === '0') {
    el.target.innerHTML = prev;
  } else {
    el.target.cellIndex !== 4
      ? el.target.innerHTML = newText
      : el.target.innerHTML = `
        $${Number(newText).toLocaleString('de-DE').split('.').join(',')}
      `;

    if (el.target.cellIndex !== 2) {
      pushNotification(
        'Validation Success',
        'Employee is successfully edited',
        'success');
    }
  }
};

const saveChanges = (e, prev) => {
  validCell(e);

  if (!valid) {
    indexCompare.length = 0;

    return editCells(e, prev);
  }
};

// dblclick
td.forEach((cell, index) => {
  cell.addEventListener('dblclick', (e) => {
    indexCompare.push(index);

    if (indexCompare[0] !== index) {
      return;
    }

    const prevText = e.target.innerText;

    changeCellOnInput(e, prevText);

    const field = e.target.firstElementChild;

    field.addEventListener('blur', () => {
      saveChanges(e, prevText);
    });

    field.addEventListener('keyup', (ev) => {
      if (ev.key === 'Enter') {
        field.blur();
      }
    });
  });
});

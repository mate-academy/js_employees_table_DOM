'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const heads = thead.querySelectorAll('th');

// #region Sorting
heads.forEach(h => {
  h.addEventListener('click', (e) => {
    heads.forEach(head => {
      if (head.classList.contains('asc') && head !== e.target) {
        head.classList.remove('asc');
      }
    });

    e.target.classList.toggle('asc');

    const index = e.target.cellIndex;

    const sorted = [...tbody.rows].sort((a, b) => {
      let aCell = a.cells[index].innerHTML;
      let bCell = b.cells[index].innerHTML;

      if (index === 4) {
        aCell = Number(aCell.slice(1).replace(',', ''));
        bCell = Number(bCell.slice(1).replace(',', ''));

        if (e.target.classList.contains('asc')) {
          return aCell - bCell;
        } else {
          return bCell - aCell;
        }
      }

      if (index === 3) {
        if (e.target.classList.contains('asc')) {
          return aCell - bCell;
        } else {
          return bCell - aCell;
        }
      }

      if (e.target.classList.contains('asc')) {
        return aCell.localeCompare(bCell);
      } else {
        return bCell.localeCompare(aCell);
      }
    });

    tbody.innerHTML = '';

    sorted.forEach(row => {
      tbody.append(row);
    });
  });
});
// #endregion

// #region Row
tbody.addEventListener('click', (e) => {
  [...tbody.rows].forEach(row => {
    row.classList.remove('active');
  });

  e.target.parentElement.classList.add('active');
});
// #endregion

// #region Form
const form = document.createElement('form');

form.classList.add('new-employee-form');

heads.forEach(head => {
  const label = document.createElement('label');

  label.textContent = head.textContent;

  if (head.textContent === 'Office') {
    const select = document.createElement('select');
    const options = [`Tokyo`, `Singapore`,
      `London`, `New York`, `Edinburgh`, `San Francisco`];

    options.forEach(option => {
      const city = document.createElement('option');

      city.textContent = option;
      select.append(city);
    });

    select.name = head.textContent.toLowerCase();
    select.dataset.qa = head.textContent.toLowerCase();

    label.append(select);
  } else {
    const input = document.createElement('input');

    if (head.textContent === 'Age' || head.textContent === 'Salary') {
      input.type = 'number';
    }

    if (head.textContent === 'Salary') {
      input.step = 1000;
    }

    input.name = head.textContent.toLowerCase();
    input.dataset.qa = head.textContent.toLowerCase();

    label.append(input);
  }

  form.append(label);
});

document.body.append(form);
// #endregion

// #region Submit Button
const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

const hiringFunction = (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());

  if (dataObject.name.length < 4) {
    pushNotification('error', 'Error',
      'Name should contain more than 4 letters');
  } else if (+dataObject.age < 18 || +dataObject.age > 90) {
    pushNotification('error', 'Error',
      'Age does not meet the requirements');
  } else if (!dataObject.position || !dataObject.salary) {
    pushNotification('error', 'Error',
      'All fields are required');
  } else {
    pushNotification('success', 'Success', 'New employee was added');

    const newRow = document.createElement('tr');

    dataObject.salary = '$' + Number(dataObject.salary).toLocaleString('en-US');

    Object.values(dataObject).forEach(value => {
      const cell = document.createElement('td');

      cell.textContent = value;

      newRow.append(cell);
    });

    tbody.append(newRow);

    form.querySelectorAll('input').forEach(field => {
      field.value = '';
    });
  }
};

button.addEventListener('click', hiringFunction);
// #endregion

// #region Editing
const editing = (e) => {
  const index = e.target.cellIndex;
  const prevText = e.target.textContent;

  e.target.textContent = '';

  let input = document.createElement('input');

  input.style.width = '118px';

  input.classList.add('cell-input');

  if (index === 2) {
    const select = document.createElement('select');
    const options = [`Tokyo`, `Singapore`,
      `London`, `New York`, `Edinburgh`, `San Francisco`];

    options.forEach(option => {
      const city = document.createElement('option');

      city.textContent = option;
      select.append(city);
    });
    select.style.width = '100px';
    select.style.height = '18px';
    input = select;
  }

  if (index === 3) {
    input.style.width = '30px';
    input.type = 'number';
  }

  if (index === 4) {
    input.style.width = '66px';
    input.type = 'number';
    input.step = 1000;
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (index) {
      case 0:
        if (input.value.length < 4) {
          pushNotification('error', 'Error',
            'Name should contain more than 4 letters');
          e.target.textContent = prevText;

          return;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 1:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          pushNotification('error', 'Error', 'Enter data, please');
          e.target.textContent = prevText;

          return;
        }
        break;

      case 2:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          e.target.textContent = prevText;
        }
        break;

      case 3:
        if (input.value < 18 || input.value > 90) {
          pushNotification('error', 'Error',
            'Age does not meet the requirements');
          e.target.textContent = prevText;

          return;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 4:
        if (input.value) {
          e.target.textContent = '$'
          + Number(input.value).toLocaleString('en-US');
        } else {
          pushNotification('error', 'Error', 'Enter data, please');
          e.target.textContent = prevText;

          return;
        }
        break;

      default:
        pushNotification('error', 'Error', 'Unexpected error...');
    }

    input.remove();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
};

tbody.addEventListener('dblclick', editing);

// #endregion

// #region Notification
const pushNotification = (type, title, description) => {
  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  message.append(h2, p);

  message.classList.add('notification', type);

  message.setAttribute('data-qa', 'notification');

  message.style.top = `10px`;
  message.style.right = `10px`;

  h2.innerText = title;
  h2.classList.add('title');
  p.innerText = description;

  document.querySelector('body').append(message);

  setTimeout(() => {
    message.remove();
  }, 2500);
};
// #endregion

// #region align-items
document.querySelector('body').style.alignItems = 'flex-start';
// #endregion

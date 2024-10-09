import { selectMarkup } from './markups.js';

export function sortTable(body, columnIndex, direction) {
  const rows = [...body.rows];

  const sorted = rows.sort((rowA, rowB) => {
    let cellA = [...rowA.cells][columnIndex].textContent;
    let cellB = [...rowB.cells][columnIndex].textContent;

    if (cellA.includes('$') || !isNaN(+cellA)) {
      cellA = +cellA.replace('$', '').replaceAll(',', '');
      cellB = +cellB.replace('$', '').replaceAll(',', '');

      return (cellA - cellB) * direction;
    }

    return cellA.localeCompare(cellB) * direction;
  });

  body.append(...sorted);
}

export function setActiveRow(row) {
  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  if (activeRow === row) {
    row.classList.remove('active');
  } else {
    row.classList.add('active');
  }
}

function pushNotification(title, description, type) {
  const notificationMarkup = `<div
  class = 'notification ${type}' data-qa="notification">
    <h2 class='title'>${title}</h2>
    <p>${description}</p>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', notificationMarkup);

  const notification = document.querySelector('.notification');

  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

export function validateNewEmployee(form) {
  // eslint-disable-next-line no-shadow
  const { name, position, office, age, salary } = form.elements;

  if (name.value.trim().length < 4) {
    return pushNotification(
      'Error! Incorrect Name',
      'Please enter Name longer than 4 characters',
      'error',
    );
  }

  if (position.value.trim().length < 4) {
    return pushNotification(
      'Error! Incorrect Position',
      'Please enter Position longer than 4 characters',
      'error',
    );
  }

  if (age.value < 18 || age.value > 90) {
    return pushNotification(
      'Error! Incorrect Age',
      'Please enter Age value between 18 and 99',
      'error',
    );
  }

  const convertedSalary = `$${salary.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const newEmployee = {
    name: name.value.trim(),
    position: position.value.trim(),
    office: office.value,
    age: age.value,
    salary: convertedSalary,
  };

  pushNotification('Success', 'New employee was added in to table', 'success');

  return newEmployee;
}

export function cellsOfficeHandler(cell) {
  const content = cell.textContent;

  cell.textContent = '';

  cell.insertAdjacentHTML('beforeend', selectMarkup);

  const select = cell.querySelector('.cell-input');

  select.focus();

  select.addEventListener('change', () => {
    cell.textContent = select.value;
  });

  select.addEventListener('blur', (e) => {
    e.preventDefault();
    cell.textContent = content;
  });

  select.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      cell.textContent = content;
      select.remove();
    }
  });
}

export function cellsNameAndPositionHandler(cell) {
  const content = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'text';
  cell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (input.value.trim().length < 4) {
      cell.textContent = content;
      input.remove();

      return pushNotification(
        'Error!',
        'Enter more than 4 characters',
        'warning',
      );
    }

    cell.textContent = input.value.trim();
    input.remove();
  });

  input.addEventListener('keyup', (e) => {
    e.preventDefault();

    if (e.key === 'Enter') {
      if (input.value.trim().length < 4) {
        cell.textContent = content;
        input.remove();

        return pushNotification(
          'Error!',
          'Enter more than 4 characters',
          'warning',
        );
      }

      cell.textContent = input.value.trim();
      input.remove();
    }

    if (e.key === 'Escape') {
      cell.textContent = content;
      input.remove();
    }
  });
}

export function cellsAgeHandler(cell) {
  const content = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'number';
  cell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (+input.value < 18 || +input.value > 90) {
      cell.innerText = +content;
      input.remove();

      return pushNotification(
        'Error! Incorrect Age',
        'Please enter Age value between 18 and 99',
        'error',
      );
    }

    cell.textContent = +input.value;
    input.remove();
  });

  input.addEventListener('keyup', (e) => {
    e.preventDefault();

    if (e.key === 'Enter') {
      if (+input.value < 18 || +input.value > 90) {
        cell.innerText = +content;
        input.remove();

        return pushNotification(
          'Error! Incorrect Age',
          'Please enter Age value between 18 and 99',
          'error',
        );
      }

      cell.textContent = +input.value;
      input.remove();
    }

    if (e.key === 'Escape') {
      cell.textContent = +content;
      input.remove();
    }
  });
}

export function cellSalaryHandler(cell) {
  const content = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'number';
  cell.append(input);
  input.focus();

  const formatCurrency = (value) => {
    return `$${(+value).toLocaleString('en-US')}`;
  };

  input.addEventListener('blur', () => {
    if (input.value < 0 || !input.value) {
      cell.textContent = content;
      input.remove();

      return pushNotification(
        'Error!',
        'Salary have to be more than 0',
        'error',
      );
    }

    cell.textContent = formatCurrency(input.value);
    input.remove();
  });

  input.addEventListener('keyup', (e) => {
    e.preventDefault();

    if (e.key === 'Enter') {
      if (input.value < 0 || !input.value) {
        cell.innerText = content;
        input.remove();

        return pushNotification(
          'Error!',
          'Salary have to be more than 0',
          'error',
        );
      }

      cell.textContent = formatCurrency(input.value);
      input.remove();
    }

    if (e.key === 'Escape') {
      cell.textContent = content;
      input.remove();
    }
  });
}

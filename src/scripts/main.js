'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const headerRow = thead.querySelector('tr');
const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');

newEmployeeForm.innerHTML = `
  <label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position: <input data-qa="position" name="position" type="text"></label>
  <label>
  Office:
    <select data-qa="office" name="office">
      <option value="tokyo">Tokyo</option>
      <option value="singapore">Singapore</option>
      <option value="london">London</option>
      <option value="new-york">New York</option>
      <option value="edinburgh">Edinburgh</option>
      <option value="san-francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number"></label>
  <button type="submit">Save to table</button>
  `;

document.body.insertBefore(newEmployeeForm, document.body.lastChild);

addNewTable();
sortingTable();
selectRow();
edititingTableCells();

function sortingTable() {
  headerRow.addEventListener('click', (e) => {
    const index = Array.from(headerRow.children).indexOf(e.target);
    const dataRows = Array.from(tbody.querySelectorAll('tr'));

    dataRows.sort((a, b) => {
      const cellA = a.children[index].textContent;
      const cellB = b.children[index].textContent;

      if (index === 3) {
        const numA = parseFloat(cellA);
        const numB = parseFloat(cellB);

        return numA - numB;
      } else if (index === 4) {
        const dateA = cellA
          .split('')
          .filter((char) => char !== '$' && char !== ',')
          .join('');
        const dateB = cellB
          .split('')
          .filter((char) => char !== '$' && char !== ',')
          .join('');

        return parseFloat(dateA) - parseFloat(dateB);
      } else {
        return cellA.localeCompare(cellB);
      }
    });

    dataRows.forEach((row) => {
      tbody.appendChild(row);
    });

    const sortDirection =
      e.target.getAttribute('data-sort-direction') || 'desc';
    const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

    e.target.setAttribute('data-sort-direction', newSortDirection);

    if (newSortDirection === 'desc') {
      dataRows.reverse();

      dataRows.forEach((row) => {
        tbody.appendChild(row);
      });
    }
  });
}

function selectRow() {
  tbody.addEventListener('click', (ev) => {
    const row = ev.target.closest('tr');

    if (!row) {
      return;
    }

    const selectedRow = tbody.querySelector('.active');

    if (selectedRow && selectedRow !== row) {
      selectedRow.classList.remove('active');
    }

    row.classList.toggle('active');
  });
}

function addNewTable() {
  const button = document.querySelector('button[type="submit"]');

  button.addEventListener('click', (ev) => {
    ev.preventDefault();

    const newEmployee = document.createElement('tr');
    const nameValue = newEmployeeForm.querySelector('input[name="name"]').value;
    const positionValue = newEmployeeForm.querySelector(
      'input[name="position"]',
    ).value;
    const officeValue = newEmployeeForm.querySelector(
      'select[name="office"]',
    ).value;
    const ageValue = newEmployeeForm.querySelector('input[name="age"]').value;
    const salaryValue = newEmployeeForm.querySelector(
      'input[name="salary"]',
    ).value;
    const currectSalaryFormat = `$${Number(salaryValue).toLocaleString('en-US')}`;

    newEmployee.append(
      createCell(nameValue),
      createCell(positionValue),
      createCell(officeValue),
      createCell(ageValue),
      createCell(currectSalaryFormat),
    );

    if (validation(nameValue, ageValue, positionValue, salaryValue)) {
      tbody.appendChild(newEmployee);
    }
  });
}

function createCell(value) {
  const td = document.createElement('td');

  td.textContent = value;

  return td;
}

function validation(names, age, position, salary) {
  if (names.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Incorrect format of input\n ' + 'Please, change to currect.',
      'error',
    );

    return false;
  } else if (age > 90 || age < 18) {
    pushNotification(
      10,
      10,
      'Error',
      'Incorrect format of input.\n ' + 'Please, change to currect.',
      'error',
    );

    return false;
  } else if (position.length < 0 || position === '') {
    pushNotification(
      10,
      10,
      'Error',
      'Incorrect format of input.\n ' + 'Please, change to currect.',
      'error',
    );

    return false;
  } else if (salary === '' || Number(salary) < 0) {
    pushNotification(
      10,
      10,
      'Error',
      'Incorrect format of input.\n ' + 'Please, change to currect.',
      'error',
    );

    return false;
  } else {
    pushNotification(
      10,
      10,
      'Success',
      'All is currect.\n ' + 'New table is added.',
      'success',
    );

    return true;
  }
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.innerHTML = `<h2 class="title"> ${title} </h2><p class="description"> ${description} </p>`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 2000);
};

let oldInputText = '';

function edititingTableCells() {
  tbody.addEventListener('dblclick', (ev) => {
    const cell = ev.target.closest('td');

    if (!cell) {
      return;
    }

    if (tbody.querySelector('.cell-input')) {
      return;
    }

    ev.preventDefault();
    oldInputText = ev.target.textContent;

    const newInput = document.createElement('input');

    newInput.classList.add('cell-input');
    newInput.value = oldInputText;
    ev.target.textContent = '';
    ev.target.appendChild(newInput);
    newInput.focus();

    const finishEditing = () => {
      const newValue = newInput.value.trim();

      cell.textContent = newValue === '' ? oldInputText : newValue;
    };

    newInput.addEventListener('blur', finishEditing);

    newInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        finishEditing();
      }
    });
  });
}

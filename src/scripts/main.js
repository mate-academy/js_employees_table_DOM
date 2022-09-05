'use strict';

// ASC/DSC table sorting

const cellValue = function(tr, index) {
  return tr.children[index].innerText || tr.children[index].textContent;
};

const salaryCleaner = function(string) {
  return string.slice(1).split(',').join('');
};

document
  .querySelectorAll('th')
  .forEach(th => th.addEventListener('click', () => {
    const thTable = th.closest('table');
    const tbody = thTable.querySelector('tbody');

    Array.from(tbody.querySelectorAll('tr'))
      .sort(comparer(Array.from(th.parentNode.children)
        .indexOf(th), this.asc = !this.asc))
      .forEach(tr => tbody.appendChild(tr));
  }));

function comparer(index, asc) {
  return function(a, b) {
    return (function(actualCell, nextCell) {
      let actualCellCopy = actualCell;
      let nextCellCopy = nextCell;

      if (actualCell.includes('$') || nextCell.includes('$')) {
        actualCellCopy = salaryCleaner(actualCell);
        nextCellCopy = salaryCleaner(nextCell);
      }

      return (actualCellCopy - nextCellCopy
      || actualCellCopy.localeCompare(nextCellCopy));
    }(cellValue(asc ? a : b, index), cellValue(asc ? b : a, index)));
  };
};

// Selected row indicator

const tbodyRows = document.querySelectorAll('tbody > tr');

tbodyRows.forEach(row => {
  row.addEventListener('click', e => {
    if (!e.target.closest('tbody > tr')) {
      return;
    }

    tbodyRows.forEach(activeRemove => {
      activeRemove.classList.remove('active');
    });

    row.classList.add('active');
  });
});

// Adding new employee form

const body = document.querySelector('body');

body.insertAdjacentHTML('beforeend',
  `
  <form class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>

    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>

    <label>Office:
      <select name="office" type="text" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" type="number" data-qa="age">
    </label>

    <label>Salary:
      <input name="salary" type="number" data-qa="salary">
    </label>

    <button type="submit" value="Submit">Save to table</button>
  </form>
  `);

// Push notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const messageBox = document.createElement('div');
  const titleBox = document.createElement('h2');
  const descriptionBox = document.createElement('p');

  messageBox.classList.add('notification', type);
  messageBox.dataset.qa = 'notification';
  titleBox.classList.add('title');
  titleBox.textContent = title;
  descriptionBox.innerText = description;

  messageBox.append(titleBox);
  messageBox.append(descriptionBox);

  messageBox.style.top = `${posTop}px`;
  messageBox.style.right = `${posRight}px`;
  document.body.append(messageBox);

  setTimeout(() => {
    messageBox.hidden = true;
  }, 2000);
};

// Submit button script

const button = document.querySelector('button');

button.addEventListener('click', e => {
  e.preventDefault();

  const tbodyAdd = document.querySelector('tbody');
  const nameValue = document.querySelector('input[name="name"]').value;
  const positionValue = document.querySelector('input[name="position"]').value;
  const selector = document.querySelector('select[name="office"]');
  const officeValue = selector.options[selector.selectedIndex].value;
  const ageValue = document.querySelector('input[name="age"]').value;
  let salaryValue = document.querySelector('input[name="salary"]').value;

  if (nameValue.length < 4) {
    pushNotification(10, 10, 'Name is too short!',
      'Name should contain more then 3 letters...',
      'error');

    return;
  }

  if (ageValue < 18 || ageValue > 60) {
    pushNotification(10, 10, 'Wrong age!',
      'We hire only 18-60 y.o. employees',
      'error');

    return;
  }

  if (!salaryValue.includes('$')) {
    salaryValue = '$' + parseInt(salaryValue).toLocaleString('en-US');
  }

  const tr = `
    <tr>
      <td>${nameValue}</td>
      <td>${positionValue}</td>
      <td>${officeValue}</td>
      <td>${ageValue}</td>
      <td>${salaryValue}</td>
    </tr>
  `;

  tbodyAdd.insertAdjacentHTML('beforeend', tr);

  pushNotification(10, 10, 'Success!',
    'Employee is added to the table!',
    'success');

  const inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    input.value = '';
  });
});

// Editable cells script

const cellsToEdit = document.querySelectorAll('tbody tr td');

cellsToEdit.forEach((cell) => {
  cell.addEventListener('dblclick', e => {
    const prevContent = cell.textContent;
    let cellInput = document.createElement('input');

    cellInput.classList.add('cell-input');

    cell.textContent = '';
    cellInput.value = prevContent;
    cellInput.type = 'text';

    if (e.target.cellIndex === 2) {
      const cellSelect = document.createElement('select');

      cellSelect.dataset.qa = 'office';

      cellSelect.insertAdjacentHTML('afterbegin',
        `<option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>`);

      cellInput = cellSelect;
      cellInput.value = prevContent;
    }

    if (e.target.cellIndex === 3) {
      cellInput.type = 'number';
    }

    cell.insertAdjacentElement('afterbegin', cellInput);

    cellInput.focus();

    cellInput.addEventListener('blur', () => {
      if (e.target.cellIndex === 0) {
        (cellInput.value.length < 4)
          ? cell.textContent = prevContent
          : cell.textContent = cellInput.value;
      }

      if (e.target.cellIndex === 2) {
        cell.textContent = cellInput.value;
      }

      if (e.target.cellIndex === 3) {
        (cellInput.value < 18 || cellInput.value > 60)
          ? cell.textContent = prevContent
          : cell.textContent = cellInput.value;
      }

      cell.textContent = cellInput.value;
    });

    cellInput.addEventListener('keypress', () => {
      if (e.key === 'Enter') {
        cellInput.blur();
      }
    });
  });
});

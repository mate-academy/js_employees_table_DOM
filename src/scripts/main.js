'use strict';

const table = document.querySelector('table');
let titleHeaderText = '';

table.insertAdjacentHTML(
  'afterend',
  `
  <form
    class="new-employee-form"
    novalidate
  >
    <label>
      Name:
      <input
        data-qa="name"
        name="name"
        type="text"
        required
      />
    </label>
    <label>
      Position:
      <input
        data-qa="position"
        name="position"
        type="text"
        required
      />
    </label>
    <label>
      Office:
      <select data-qa="office">
        <option selected>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        data-qa="age"
        name="age"
        type="number"
        required
      />
    </label>
    <label>
      Salary:
      <input
        data-qa="salary"
        name="salary"
        type="number"
        required
      />
    </label>
    <button type="submit">Save to table</button>
  </form>
  `,
);

const form = document.querySelector('.new-employee-form');

table.addEventListener('click', function (e) {
  const headerCell = e.target.closest('thead th');

  if (!headerCell) {
    return;
  }

  if (headerCell.textContent !== titleHeaderText) {
    getSortedTable(headerCell, 'ascDirection');
    titleHeaderText = headerCell.textContent;
  } else {
    getSortedTable(headerCell, 'descDirection');
    titleHeaderText = '';
  }
});

table.addEventListener('click', function (e) {
  const chosenRow = e.target.closest('tbody tr');
  const tbodyRows = [...table.querySelector('tbody').rows];

  if (chosenRow && !chosenRow.classList.contains('active')) {
    tbodyRows.forEach((row) => row.removeAttribute('class'));
    chosenRow.setAttribute('class', 'active');
  }
});

table.addEventListener('dblclick', function (e) {
  const chosenCell = e.target.closest('tbody td');

  if (chosenCell) {
    const editInput = document.createElement('input');
    const cellTextDefault = chosenCell.textContent;

    chosenCell.innerHTML = '';
    editInput.classList.add('cell-input');
    chosenCell.append(editInput);
    editInput.value = cellTextDefault;
    editInput.focus();

    const handleBlur = function () {
      saveChanges(chosenCell, cellTextDefault);
    };

    editInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        editInput.removeEventListener('blur', handleBlur);
        saveChanges(chosenCell, cellTextDefault);
      }
    });

    editInput.addEventListener('blur', handleBlur);
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const newRow = document.createElement('tr');
  const inputName = form.querySelector('input[name="name"]').value.trim();
  const inputAge = form.querySelector('input[name="age"]').value.trim();
  const inputSalary = form.querySelector('input[name="salary"]').value.trim();
  const inputPosition = form
    .querySelector('input[name="position"]')
    .value.trim();

  if (!inputPosition || !inputName || !inputAge || !inputSalary) {
    return pushNotification(
      'All fields must be filled',
      'Please fill in all fields',
      'error',
    );
  }

  if (inputName.length < 4) {
    return pushNotification(
      'The name is to short',
      'The name must contain at least 4 characters',
      'error',
    );
  }

  if (+inputAge < 18 || +inputAge > 90) {
    return pushNotification(
      'Incorrect age entry',
      'The age must be between 18 and 90',
      'error',
    );
  }

  for (const field of form.children) {
    if (field.matches('label')) {
      const normalizedfieldName = field.firstChild.data
        .toLowerCase()
        .replace(/[^a-z]/g, '');
      const fieldValue = field.lastElementChild.value;

      addEmployee(normalizedfieldName, fieldValue, newRow);
    }

    if (field.lastElementChild && field.lastElementChild.matches('input')) {
      field.lastElementChild.value = '';
    }
  }

  return pushNotification(
    'Emploee added successfully',
    'The Emploee has been added to the table.',
    'success',
  );
});

function getSortedTable(pressedButton, direction) {
  const { cellIndex, textContent } = pressedButton;
  const tbodyRows = [...table.querySelector('tbody').rows];

  tbodyRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[cellIndex].textContent;
    const cellB = rowB.cells[cellIndex].textContent;
    const regExp = /[^0-9]/g;

    if (['Name', 'Position', 'Office'].includes(textContent)) {
      return direction === 'ascDirection'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }

    if (['Salary', 'Age'].includes(textContent)) {
      return direction === 'ascDirection'
        ? +cellA.replace(regExp, '') - +cellB.replace(regExp, '')
        : +cellB.replace(regExp, '') - +cellA.replace(regExp, '');
    }
  });

  const tableBody = table.querySelector('tbody');

  tableBody.innerHTML = '';
  tbodyRows.forEach((row) => tableBody.appendChild(row));
}

function saveChanges(cell, textDefault) {
  const input = cell.querySelector('.cell-input');

  if (input) {
    const newText = input.value.trim();

    cell.textContent = newText !== '' ? newText : textDefault;
    input.remove();
  }
}

function addEmployee(inputName, inputValue, row) {
  const tableBody = table.querySelector('tbody');
  const headCells = table.querySelectorAll('thead th');

  for (const headCell of headCells) {
    const normalizedHeadCell = headCell.textContent.toLowerCase();

    if (normalizedHeadCell === inputName) {
      const checkedInputValue =
        inputName === 'salary' ? formatSalary(inputValue) : inputValue;

      row.insertAdjacentHTML('beforeend', `<td>${checkedInputValue}</td>`);
    }
  }

  tableBody.insertAdjacentElement('afterbegin', row);
}

function formatSalary(salary) {
  const sanitizedInput = salary.replace(/\D/g, '');
  const formattedInput = sanitizedInput.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `$${formattedInput}`;
}

function pushNotification(title, description, type) {
  const message = document.createElement('div');

  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');

  message.insertAdjacentHTML(
    'beforeend',
    `
    <h2 class="title" style="font-size: inherit;">${title}</h2>
    <p>${description}</p>
    `,
  );

  document.body.insertAdjacentElement('beforeend', message);

  setTimeout(() => {
    message.remove();
  }, 5000);
}

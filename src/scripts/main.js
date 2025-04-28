'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const isAscending = [false, false, false, false, false];
const body = document.querySelector('body');

body.appendChild(document.createElement('form'));

const form = body.querySelector('form');

form.classList.add('new-employee-form');

form.innerHTML = `<label>Name: <input type="text" name="name" data-qa="name"></label>
<label>Position: <input type="text" name="position" data-qa="position"></label>
<label>Office: <select data-qa="office">
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
</select></label>
<label>Age: <input type="number" name="age" data-qa="age"></label>
<label>Salary: <input type="number" name="salary" data-qa="salary"></label>
<button type="submit">Save to table</button>`;

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.classList.add(type);
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
};

const formButton = form.querySelector('button');

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  const formName = form.querySelector('input[name="name"]').value;
  const position = form.querySelector('input[name="position"]').value;
  const office = form.querySelector('select').value;
  const age = form.querySelector('input[name="age"]').value;
  const salary = form.querySelector('input[name="salary"]').value;

  if (formName.length < 4) {
    pushNotification('Error', 'Please enter full name.', 'error');

    return;
  } else if (position.length === 0) {
    pushNotification('Error', 'Please enter position.', 'error');

    return;
  } else if (age < 18 || age > 90) {
    pushNotification('Error', 'Please enter valid age.', 'error');

    return;
  } else {
    pushNotification('Success', 'Employee added successfully.', 'success');
  }

  const newRow = document.createElement('tr');
  let salaryText = salary.toString();

  for (let i = salaryText.length - 3; i > 0; i -= 3) {
    salaryText = salaryText.slice(0, i) + ',' + salaryText.slice(i);
  }

  newRow.innerHTML = `<td>${formName}</td>
                      <td>${position}</td>
                      <td>${office}</td>
                      <td>${age}</td>
                      <td>$${salaryText}</td>`;

  tableBody.appendChild(newRow);

  form.reset();
});

tableHead.addEventListener('click', (e) => {
  const column = e.target.closest('th');

  if (!column) {
    return;
  }

  const columnIndex = column.cellIndex;

  const rows = tableBody.querySelectorAll('tr');
  let sortedRows;

  if (
    column.textContent === 'Name' ||
    column.textContent === 'Position' ||
    column.textContent === 'Office'
  ) {
    if (isAscending[columnIndex]) {
      for (let i = 0; i < isAscending.length; i++) {
        isAscending[i] = false;
      }

      sortedRows = Array.from(rows).sort((a, b) => {
        const aText = a.cells[columnIndex].textContent;
        const bText = b.cells[columnIndex].textContent;

        return bText.localeCompare(aText);
      });
    } else {
      for (let i = 0; i < isAscending.length; i++) {
        isAscending[i] = false;
      }

      isAscending[columnIndex] = true;

      sortedRows = Array.from(rows).sort((a, b) => {
        const aText = a.cells[columnIndex].textContent;
        const bText = b.cells[columnIndex].textContent;

        return aText.localeCompare(bText);
      });
    }
  } else {
    if (isAscending[columnIndex]) {
      for (let i = 0; i < isAscending.length; i++) {
        isAscending[i] = false;
      }

      sortedRows = Array.from(rows).sort((a, b) => {
        const aNum = Number(
          a.cells[columnIndex].textContent
            .split(',')
            .join('')
            .split('$')
            .join(''),
        );
        const bNum = Number(
          b.cells[columnIndex].textContent
            .split(',')
            .join('')
            .split('$')
            .join(''),
        );

        return bNum - aNum;
      });
    } else {
      for (let i = 0; i < isAscending.length; i++) {
        isAscending[i] = false;
      }

      isAscending[columnIndex] = true;

      sortedRows = Array.from(rows).sort((a, b) => {
        const aNum = Number(
          a.cells[columnIndex].textContent
            .split(',')
            .join('')
            .split('$')
            .join(''),
        );
        const bNum = Number(
          b.cells[columnIndex].textContent
            .split(',')
            .join('')
            .split('$')
            .join(''),
        );

        return aNum - bNum;
      });
    }
  }
  sortedRows.forEach((row) => tableBody.appendChild(row));
});

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');

  if (!selectedRow) {
    return;
  }

  const existingInput = tableBody.querySelector('.active');

  if (existingInput) {
    existingInput.classList.remove('active');
  }

  selectedRow.classList.add('active');
});

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const cellText = cell.textContent;

  const existingInput = tableBody.querySelector('.cell-input');

  if (existingInput) {
    existingInput.focus(); // Focu

    return;
  }

  cell.innerHTML = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  cell.appendChild(input);

  input.focus();

  const whatToInput = (value) => {
    if (input.value.length > 0) {
      cell.innerHTML = input.value;
    } else {
      cell.innerHTML = cellText;
    }
  };

  input.addEventListener('blur', (ev) => {
    whatToInput(input.value);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      whatToInput(input.value);
    }
  });
});

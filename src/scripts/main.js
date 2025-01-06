'use strict';

const form = document.createElement('form');
let tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const collectionOfButton = [...thead.rows[0].cells];

form.className = 'new-employee-form';

// add form
form.insertAdjacentHTML(
  'afterbegin',
  `
  <label>Name: <input  required  name="name" data-qa="name"  type="text"></label>
  <label>Position: <input required name="position" data-qa="position"  type="text"></label>
  <label>Office: <select data-qa="office" required>
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
  </select> </label>
  <label>Age: <input required name="age" data-qa="age"  type="number"></label>
  <label>Salary: <input required name="salary" data-qa="salary"  type="number"></label>
  <button type="submit">Save to table</button>`,
);
document.body.append(form);

// add notification
function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');

  notification.textContent = message;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// sort the table
let isAscending = true;

function sortTableBySalary(isAscending) {
  tbody = document.querySelector('tbody');

  [...tbody.rows]
    .sort((rowA, rowB) => {
      const salaryA = parseInt(
        rowA.lastElementChild.textContent.replace(/[$,]/g, ''),
      );
      const salaryB = parseInt(
        rowB.lastElementChild.textContent.replace(/[$,]/g, ''),
      );

      return isAscending ? salaryA - salaryB : salaryB - salaryA;
    })
    .forEach((row) => tbody.append(row));
}

for (let i = 0; i < collectionOfButton.length; i++) {
  collectionOfButton[i].addEventListener('click', () => {
    sortTableBySalary(isAscending);
    isAscending = !isAscending;
  });
}

// add new line and sort
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const names = form.querySelector('[data-qa="name"]').value.trim();
  const position = form.querySelector('[data-qa="position"]').value.trim();
  const office = form.querySelector('[data-qa="office"]').value;
  const age = parseInt(form.querySelector('[data-qa="age"]').value.trim());
  const salary = parseInt(
    form.querySelector('[data-qa="salary"]').value.trim(),
  );

  if (names.length < 4) {
    showNotification('Ім’я має містити щонайменше 4 літери.', 'error');

    return;
  }

  if (age < 18) {
    showNotification('Вік повинен бути щонайменше 18!', 'error');

    return;
  }

  if (age > 90) {
    showNotification('Вік повинен бути менше 90!', 'error');

    return;
  }

  if (!names || !position || !office || !age || !salary) {
    showNotification();
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
  <td>${names}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>$${salary}</td>
  `;

  tbody.appendChild(newRow);

  showNotification('Нового співробітника додано до таблиці!', 'success');
  sortTableBySalary(isAscending);

  form.reset();
});

// add active class for selected line
tbody.addEventListener('click', (event) => {
  const selectedRow = event.target.closest('tr');

  if (selectedRow) {
    [...tbody.rows].forEach((row) => {
      row.classList.remove('active');
    });

    selectedRow.classList.add('active');
  }
});

// add functional for dblclick
tbody.addEventListener('dblclick', (event) => {
  const cell = event.target.closest('td');

  const initialValue = cell.textContent.trim();

  if (cell) {
    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = '';

    cell.textContent = '';
    cell.append(input);
    input.focus();

    function saveChanges(input, cell, initialValue) {
      const newValue = input.value.trim();

      cell.textContent = newValue || initialValue;
    }

    input.addEventListener('blur', () => {
      saveChanges(input, cell, initialValue);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        saveChanges(input, cell, initialValue);
      }
    });
  }
});

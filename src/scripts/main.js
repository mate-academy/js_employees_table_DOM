'use strict';
// import { pushNotification } from './notification.js';

// Sort table

const sortButtons = document.querySelectorAll('thead tr th');
const tbody = document.querySelector('tbody');
const rows = Array.from(document.querySelectorAll('tbody tr'));

const sortState = new Array(sortButtons.length).fill(false);

sortButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const isDescending = sortState[index];

    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].innerHTML;
      const cellB = rowB.children[index].innerHTML;

      if (
        button.innerHTML === 'Name' ||
        button.innerHTML === 'Position' ||
        button.innerHTML === 'Office'
      ) {
        return isDescending
          ? cellB.localeCompare(cellA)
          : cellA.localeCompare(cellB);
      } else if (button.innerHTML === 'Salary') {
        const salaryA = parseFloat(cellA.replace(/[$,]/g, ''));
        const salaryB = parseFloat(cellB.replace(/[$,]/g, ''));

        return isDescending ? salaryB - salaryA : salaryA - salaryB;
      } else {
        return isDescending
          ? parseFloat(cellB) - parseFloat(cellA)
          : parseFloat(cellA) - parseFloat(cellB);
      }
    });

    tbody.innerHTML = '';
    sortedRows.forEach((row) => tbody.appendChild(row));

    sortState[index] = !sortState[index];
  });
});

// Selected row

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => {
      if (r !== row) {
        r.classList.remove('active');
      }
    });

    row.classList.toggle('active');
  });
});

// notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  document.body.append(notification);

  notification.insertAdjacentHTML(
    'afterbegin',
    `
    <h2 class="title">${title}</h2>
    <p class="description">${description}</p>
    `,
  );

  notification.setAttribute('class', `notification ${type}`);
  notification.setAttribute('data-qa', `notification`);
  notification.style.position = 'absolute';

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 2000);
};

// Add new row
const nameInput = document.querySelector('input[data-qa="name"]');
const positionInput = document.querySelector('input[data-qa="position"]');
const officeSelect = document.querySelector('select[data-qa="office"]');
const ageInput = document.querySelector('input[data-qa="age"]');
const salaryInput = document.querySelector('input[data-qa="salary"]');

const addButton = document.querySelector('form>button');

addButton.addEventListener('click', (e) => {
  e.preventDefault();

  let isValid = true;

  if (nameInput.value.length < 4) {
    pushNotification(
      150,
      10,
      'Error message',
      'Name value is too short',
      'error',
    );
    isValid = false;
  }

  if (+ageInput.value < 18 || +ageInput.value > 90) {
    pushNotification(
      150,
      10,
      'Error message',
      'Age value is not valid',
      'error',
    );
    isValid = false;
  }

  if (positionInput.value.length < 3) {
    pushNotification(
      150,
      10,
      'Error message',
      'Position value is too short',
      'error',
    );
    isValid = false;
  }

  const salaryValue = parseFloat(salaryInput.value);

  if (isNaN(salaryValue) || salaryValue <= 0) {
    pushNotification(
      150,
      10,
      'Error message',
      'Salary must be a valid number greater than 0',
      'error',
    );
    isValid = false;
  }

  // Якщо є помилки, не додаємо новий рядок
  if (!isValid) {
    return;
  }

  // Якщо всі дані валідні, додаємо новий рядок
  const newRow = document.createElement('tr');

  newRow.innerHTML = `<td>${nameInput.value}</td>
                      <td>${positionInput.value}</td>
                      <td>${officeSelect.value}</td>
                      <td>${ageInput.value}</td>
                      <td>$${salaryValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>`;

  tbody.appendChild(newRow);

  pushNotification(
    150,
    10,
    'New employee added',
    'Table is updated',
    'success',
  );

  // Очищення полів після додавання
  nameInput.value = '';
  positionInput.value = '';
  officeSelect.value = '';
  ageInput.value = '';
  salaryInput.value = '';
});

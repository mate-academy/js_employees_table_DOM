'use strict';
// Sort table

const sortButtons = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const sortState = new Array(sortButtons.length).fill(false);

sortButtons.addEventListener('click', (e) => {
  const currentRows = Array.from(document.querySelectorAll('tbody tr'));

  const clickedButton = e.target;
  const index = Array.from(clickedButton.parentNode.children).indexOf(
    clickedButton,
  );

  const isDescending = sortState[index];

  const sortedRows = currentRows.sort((rowA, rowB) => {
    const cellA = rowA.children[index].innerHTML;
    const cellB = rowB.children[index].innerHTML;

    if (
      clickedButton.innerHTML === 'Name' ||
      clickedButton.innerHTML === 'Position' ||
      clickedButton.innerHTML === 'Office'
    ) {
      return isDescending
        ? cellB.localeCompare(cellA)
        : cellA.localeCompare(cellB);
    } else if (clickedButton.innerHTML === 'Salary') {
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

// Select row

tbody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('tr');

  Array.from(tbody.querySelectorAll('tr')).forEach((row) => {
    if (row !== targetRow) {
      row.classList.remove('active');
    }
  });
  targetRow.classList.toggle('active');
});

// Error notification
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
    notification.remove();
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

  if (nameInput.value.trim().length < 4) {
    return pushNotification(
      150,
      10,
      'Error message',
      'Name value is too short',
      'error',
    );
  }

  if (positionInput.value.trim().length === 0) {
    return pushNotification(
      150,
      10,
      'Error message',
      'Position value is too short',
      'error',
    );
  }

  if (+ageInput.value < 18 || +ageInput.value > 90) {
    return pushNotification(
      150,
      10,
      'Error message',
      'Age value is not valid',
      'error',
    );
  }

  const salaryValue = parseFloat(salaryInput.value);

  if (isNaN(salaryValue) || salaryValue <= 0) {
    return pushNotification(
      150,
      10,
      'Error message',
      'Salary must be a valid number greater than 0',
      'error',
    );
  }

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

  nameInput.value = '';
  positionInput.value = '';
  officeSelect.value = '';
  ageInput.value = '';
  salaryInput.value = '';
});

'use strict';

const headers = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');
let rows = tbody.querySelectorAll('tr');

let currentSortedColumn = null;
let isAscending = true;

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (index === currentSortedColumn) {
      isAscending = !isAscending;
    } else {
      isAscending = true;
    }

    currentSortedColumn = index;

    sortTableByHeaders(tbody, index, isAscending);
  });
});

function sortTableByHeaders(tableBody, columnIndex, ascending) {
  const rowsArr = Array.from(rows);

  const isNumberColumn = rowsArr.every(
    (row) =>
      !isNaN(
        parseFloat(
          row.children[columnIndex].textContent.replace(/[$,]/g, '').trim(),
        ),
      ),
  );

  rowsArr.sort((a, b) => {
    let cellA = a.children[columnIndex].textContent.trim();
    let cellB = b.children[columnIndex].textContent.trim();

    if (isNumberColumn) {
      cellA = parseFloat(cellA.replace(/[$,]/g, '')) || 0;
      cellB = parseFloat(cellB.replace(/[$,]/g, '')) || 0;

      return ascending ? cellA - cellB : cellB - cellA;
    }

    return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
  });

  tableBody.innerHTML = '';
  rowsArr.forEach((row) => tableBody.appendChild(row));
}

function activeRowClickHandler() {
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));

      row.classList.add('active');
    });
  });
}

activeRowClickHandler();

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = e.target.name.value;
  const position = e.target.position.value;
  const office = e.target.office.value;
  const age = e.target.age.value;
  const salary = e.target.salary.value;

  if (employeeName.length < 4) {
    showNotification('Помилка!', "Ім'я занадто коротке.", 'error');

    return;
  }

  if (age < 18) {
    showNotification('Помилка!', 'Вам ще не виконалось 18 років.', 'error');

    return;
  } else if (age > 90) {
    showNotification('Помилка!', 'Вік некоректний.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  const newName = document.createElement('td');

  newName.textContent = employeeName;
  newRow.appendChild(newName);

  const newPosition = document.createElement('td');

  newPosition.textContent = position;
  newRow.appendChild(newPosition);

  const newOffice = document.createElement('td');

  newOffice.textContent = office;
  newRow.appendChild(newOffice);

  const newAge = document.createElement('td');

  newAge.textContent = age;
  newRow.appendChild(newAge);

  const newSalary = document.createElement('td');

  newSalary.textContent = '$' + parseFloat(salary).toFixed(2).replace('.', ',');
  newRow.appendChild(newSalary);

  tbody.appendChild(newRow);

  rows = tbody.querySelectorAll('tr');

  if (currentSortedColumn !== null) {
    sortTableByHeaders(tbody, currentSortedColumn, isAscending);
  }

  e.target.reset();

  activeRowClickHandler();

  showNotification('Успіх!', 'Працівник успішно доданий.', 'success');
});

function showNotification(title, message, type) {
  const notificationContainer = document.getElementById('notifications');

  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <span class="title">${title}</span>
    <p>${message}</p>
  `;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

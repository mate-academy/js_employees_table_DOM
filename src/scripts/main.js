'use strict';

const body = document.querySelector('body');

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const th = [...thead.querySelectorAll('th')];

const tbody = table.querySelector('tbody');
const trTbody = [...tbody.querySelectorAll('tr')];

const sortDirections = {};

th.forEach((header, index) => {
  sortDirections[index] = 'asc';

  header.addEventListener('click', () => {
    const currentDirection = sortDirections[index];
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    sortDirections[index] = newDirection;

    const isNumericColumn = ['Age', 'Salary'].includes(header.textContent);

    const sortedRows = trTbody.sort((a, b) => {
      const cellA = a.children[index].textContent.trim();
      const cellB = b.children[index].textContent.trim();

      if (isNumericColumn) {
        const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

        return newDirection === 'asc' ? numA - numB : numB - numA;
      } else {
        return newDirection === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    tbody.innerHTML = '';

    sortedRows.forEach((row) => tbody.appendChild(row));
  });
});

trTbody.forEach((tr) => {
  tr.addEventListener('click', () => {
    if (tr.classList.contains('active')) {
      tr.classList.remove('active');
    } else {
      trTbody.forEach((row) => row.classList.remove('active'));
      tr.classList.add('active');
    }
  });
});

const form = document.querySelector('form[name="employee"]');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (data.get('name').trim().length < 4 && data.get('name').trim() === '') {
    const errorElement = document.createElement('div');

    errorElement.classList.add('notification', 'error');
    errorElement.setAttribute('data-qa', 'notification');
    errorElement.textContent = 'The name must be longer than 4 characters';

    body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 3000);
  } else if (data.get('age') < 18 || data.get('age') > 90) {
    const errorElement = document.createElement('div');

    errorElement.classList.add('notification', 'error');
    errorElement.setAttribute('data-qa', 'notification');
    errorElement.textContent = 'age must be over 18 and under 90';

    body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 3000);
  } else if (data.get('position').trim() === '') {
    const errorElement = document.createElement('div');

    errorElement.classList.add('notification', 'error');
    errorElement.setAttribute('data-qa', 'notification');
    errorElement.textContent = 'fill in the position line';

    body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 3000);
  } else if (
    data.get('name').length >= 4 &&
    data.get('age') >= 18 &&
    data.get('age') <= 90
  ) {
    const successElement = document.createElement('div');

    successElement.classList.add('notification', 'success');
    successElement.setAttribute('data-qa', 'notification');
    successElement.textContent = 'everything is correct';

    body.appendChild(successElement);

    setTimeout(() => {
      successElement.remove();
    }, 3000);

    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    const positionCell = document.createElement('td');
    const officeCell = document.createElement('td');
    const ageCell = document.createElement('td');
    const salaryCell = document.createElement('td');

    nameCell.textContent = data.get('name');
    positionCell.textContent = data.get('position');
    officeCell.textContent = data.get('office');
    ageCell.textContent = data.get('age');
    salaryCell.textContent = `$${parseFloat(data.get('salary')).toLocaleString('en-US')}`;

    newRow.appendChild(nameCell);
    newRow.appendChild(positionCell);
    newRow.appendChild(officeCell);
    newRow.appendChild(ageCell);
    newRow.appendChild(salaryCell);

    tbody.appendChild(newRow);
  }
});

'use strict';

// write code here
// Notifications

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = notification.appendChild(
    document.createElement('h1'),
  );
  const notificationDescription = notification.appendChild(
    document.createElement('p'),
  );

  notificationDescription.textContent = description;
  notificationTitle.textContent = title;

  notification.classList.add(type);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

// Sorting

const sortButtons = document.querySelectorAll('th');
const tableBody = document.querySelector('tbody');
let ascOrder = true;
const rows = Array.from(tableBody.rows);

function sortTable(cellIndex, sortType) {
  rows.sort((rowA, rowB) => {
    let cellA = rowA.cells[cellIndex].textContent.trim();
    let cellB = rowB.cells[cellIndex].textContent.trim();

    if (cellIndex === 3 || cellIndex === 4) {
      cellA = parseFloat(cellA.replace(/[$,]/g, '')) || 0;
      cellB = parseFloat(cellB.replace(/[$,]/g, '')) || 0;

      if (sortType === 'ASC') {
        return cellA - cellB;
      } else {
        return cellB - cellA;
      }
    }

    if (sortType === 'ASC') {
      return cellA.localeCompare(cellB);
    } else {
      return cellB.localeCompare(cellA);
    }
  });
  rows.forEach((row) => tableBody.appendChild(row));
}

sortButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const sortType = ascOrder ? 'ASC' : 'DESC';

    sortTable(button.cellIndex, sortType);
    ascOrder = !ascOrder;
  });
});

// Selection

rows.forEach((row) => {
  row.addEventListener('click', () => {
    row.classList.remove('active');

    row.classList.add('active');
  });
});

// Form

const formEl = document.createElement('form');

document.querySelector('body').appendChild(formEl);
formEl.classList.add('new-employee-form');

formEl.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>
    Office:

    <select data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>

  <button type="submit" id="submit-btn">Save to table</button>
`;

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = false;

  const employeeName = form.querySelector('input[data-qa="name"]').value;
  const position = form.querySelector('input[data-qa="position"]').value;
  const office = form.querySelector('select[data-qa="office"]').value;
  const age = form.querySelector('input[data-qa="age"]').value;
  const salary = form.querySelector('input[data-qa="salary"]').value;

  if (employeeName.length > 4 && age > 18 && age < 90) {
    valid = true;
  }

  if (valid !== true) {
    pushNotification(
      150,
      10,
      'Error!',
      'Something went wrong, please try again later',
      'error',
    );
  } else {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
    `;

    tableBody.appendChild(newRow);
    rows.push(newRow);

    document.querySelectorAll('input').forEach((input) => {
      input.value = '';
    });

    pushNotification(
      10,
      10,
      'Success!',
      'Employee successfully added to the table.',
      'success',
    );
  }
});

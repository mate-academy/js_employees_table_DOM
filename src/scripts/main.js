'use strict';

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let sorted = false;

const sortRows = function(index) {
  const sortedRows = [...tableBody.rows].sort((rowA, rowB) => {
    const cellA = rowA.cells[index].innerText;
    const cellB = rowB.cells[index].innerText;

    if (cellA.includes('$')) {
      const newCellA = cellA.replace(/[^0-9]/g, '');
      const newCellB = cellB.replace(/[^0-9]/g, '');

      if (sorted) {
        return newCellB - newCellA;
      }

      return newCellA - newCellB;
    }

    if (sorted) {
      return cellB > cellA ? 1 : cellB < cellA ? -1 : 0;
    }

    return cellA > cellB ? 1 : cellA < cellB ? -1 : 0;
  });

  tableBody.append(...sortedRows);
};

tableHeader.addEventListener('click', (e) => {
  const index = e.target.cellIndex;

  if (index !== null || index !== undefined) {
    sortRows(index);

    sorted = !sorted;
  }
});

tableBody.addEventListener('click', e => {
  const targetRow = e.target.closest('tr');

  if (targetRow) {
    [...tableBody.rows].forEach(row => row.classList.remove('active'));

    targetRow.classList.add('active');
  }
});

// Form
document.body.insertAdjacentHTML('beforeend', `
  <form
    class="new-employee-form"
    action="/"
    method="post"
  >
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
    </label>

    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>

    <label>
      Office:
      <select
        name="office"
        data-qa="office"
        required
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
      >
    </label>

    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
    </label>

    <button type="submit">
      Save to table
    </button>
  </form>
`);

const pushNotification = (title, description, type, posTop, posRight) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.style.top = `${posTop || 10}px`;
  notification.style.right = `${posRight || 10}px`;

  const notificationText = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  notification.insertAdjacentHTML('afterbegin', notificationText);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const isValid = (key, value) => {
  if (key === 'name' && value.length < 4) {
    pushNotification('Error',
      'Name field must be at least 5 characters long!', 'error');

    return;
  }

  if (key === 'age' && (+value < 18 || +value > 90)) {
    pushNotification('Error', 'Age must be between 18 and 90!', 'error');

    return;
  }

  return true;
};

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const newRow = document.createElement('tr');
  const formData = new FormData(form);

  for (const [key, value] of formData) {
    if (!isValid(key, value)) {
      return;
    }

    if (key === 'salary') {
      newRow.insertAdjacentHTML('beforeend',
        `<td>$${(+value).toLocaleString('en-US')}</td>`);
    } else {
      newRow.insertAdjacentHTML('beforeend', `<td>${value}</td>`);
    };
  }

  pushNotification('Success',
    'Employee has been added successfully!', 'success');
  tableBody.append(newRow);
  form.reset();
});

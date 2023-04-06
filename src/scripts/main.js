'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];

table.querySelectorAll('thead th').forEach((th, index) => {
  th.addEventListener('click', (ev) => {
    sortColumn(index, ev);
  });
});

function normalizeValue(el, index, isNumeric) {
  const value = el.cells[index].textContent.replace(/[$,]/g, '');

  return isNumeric ? +value : value;
}

function sortColumn(index, ev) {
  ev.target.setAttribute('data-direction',
    ev.target.getAttribute('data-direction')
  && ev.target.getAttribute('data-direction') === 'asc' ? 'desc' : 'asc');

  const direction = ev.target.getAttribute('data-direction');

  const isNumeric = !isNaN(normalizeValue(rows[0], index, true));

  rows.sort((a, b) => {
    const aValue = normalizeValue(a, index, isNumeric);
    const bValue = normalizeValue(b, index, isNumeric);

    return isNumeric
      ? (direction === 'asc' ? (aValue - bValue) : (bValue - aValue))
      : (direction === 'asc'
        ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue));
  });

  rows.forEach(row => {
    table.querySelector('tbody').append(row);
  });
}

rows.forEach(row => {
  row.addEventListener('click', () => {
    table.querySelector('.active')
    && table.querySelector('.active').classList.remove('active');
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `
  <label>Name: <input name="name" type="text" required></label>
  <label>Position: 
    <input
      name="position"
      type="text"
      data-qa="name"
      data-qa="position"
      required
    >
  </label>
  <label>Office: 
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>Salary: 
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button>Save to table</button>
`);

table.parentNode.insertBefore(form, table.nextSibling);

form.querySelector('button').addEventListener('click', (ev) => {
  ev.preventDefault();

  document.querySelector('.notification')
    && document.querySelector('.notification').remove();

  const employeeForm = document.querySelector('form.new-employee-form');
  const formData = new FormData(employeeForm);
  const data = Object.fromEntries(formData.entries());

  const showNotification = (type, text) => {
    const notification = document.createElement('div');
    const notificationTitle = document.createElement('h3');

    notification.classList.add('notification', `${type.toLowerCase()}`);
    notification.dataset.qa = 'notification';
    notificationTitle.textContent = type;
    notification.textContent = text;
    notification.prepend(notificationTitle);
    form.parentNode.insertBefore(notification, form.nextSibling);
  };

  if (data.name.length < 4) {
    showNotification('Error', 'Name must be at least 4 letters');

    return;
  }

  if (data.age < 18 || data.age > 90) {
    showNotification('Error', 'Age must be between 18 and 90');

    return;
  }

  const newRow = tbody.insertRow();

  Object.entries(data).forEach(([key, value]) => {
    const cell = newRow.insertCell();

    cell.textContent = key === 'salary'
      ? Number(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      })
      : value;
  });

  employeeForm.reset();
});

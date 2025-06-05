'use strict';

'use strict';

const table = document.querySelector('table');
const titles = [...table.querySelectorAll('th')];
const tbody = document.querySelector('tbody');
let currentSortIndex = null;
let isAsc = true;

titles.forEach((title, index) => {
  title.addEventListener('click', () => {
    sortTable(index);
  });
});

function sortTable(columnIndex) {
  const rows = [...tbody.querySelectorAll('tr')];

  if (currentSortIndex === columnIndex) {
    isAsc = !isAsc;
  } else {
    isAsc = true;
    currentSortIndex = columnIndex;
  }

  const sortedRows = rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();

    if (!isNaN(aText) && !isNaN(bText)) {
      return isAsc ? +aText - +bText : +bText - +aText;
    } else if (aText.includes('$') && bText.includes('$')) {
      return isAsc
        ? parseSalary(aText) - parseSalary(bText)
        : parseSalary(bText) - parseSalary(aText);
    } else {
      return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
    }
  });

  sortedRows.forEach((row) => tbody.appendChild(row));
}

function parseSalary(salary) {
  return +salary.replaceAll(',', '').replaceAll('$', '');
}

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = +form.age.value;
  const salary = +form.salary.value;

  if (formName.length < 4) {
    showNotification('Error', 'Name must be at least 4 characters.', 'error');

    return;
  }

  if (position.length < 2) {
    showNotification(
      'Error',
      'Position must be at least 2 characters.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Error', 'Age must be between 18 and 90.', 'error');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${formName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  document.querySelector('tbody').appendChild(row);
  showNotification('Success', 'Employee added successfully.', 'success');

  form.reset();
});

function showNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  const titleEl = document.createElement('h2');

  titleEl.textContent = title;

  const descEl = document.createElement('p');

  descEl.textContent = description;

  notification.appendChild(titleEl);
  notification.appendChild(descEl);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

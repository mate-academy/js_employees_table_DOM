'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

let sortDirection = true;
let currentColumn = null;

headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    if (currentColumn === index) {
      sortDirection = !sortDirection;
    } else {
      sortDirection = true;
      currentColumn = index;
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let aText = a.children[index].textContent;
      let bText = b.children[index].textContent;

      if (index === 4) {
        aText = Number(aText.replace(/[$,]/g, ''));
        bText = Number(bText.replace(/[$,]/g, ''));
      }

      if (!isNaN(aText)) {
        aText = Number(aText);
      }

      if (!isNaN(bText)) {
        bText = Number(bText);
      }

      if (aText > bText) {
        return sortDirection ? 1 : -1;
      }

      if (aText < bText) {
        return sortDirection ? -1 : 1;
      }

      return 0;
    });
    tbody.append(...rows);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position: <input data-qa="position" name="position" type="text"></label>
  <label>Office:
    <select data-qa="office" name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number"></label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);

function showNotification(message, type) {
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.dataset.qa = 'notification';
  div.textContent = message;
  document.body.append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = Number(form.age.value);
  const salary = Number(form.salary.value);

  if (!userName || !position || !age || !salary) {
    showNotification('All fields are required', 'error');

    return;
  }

  if (userName.length < 4) {
    showNotification('Name too short', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Invalid age', 'error');

    return;
  }

  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${userName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.append(row);

  showNotification('Employee added!', 'success');

  form.reset();
});

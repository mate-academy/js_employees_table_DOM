/* eslint-disable no-shadow */
'use strict';

document.querySelectorAll('thead th').forEach((th, index) => {
  th.addEventListener('click', () => {
    const table = th.closest('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const asc = !th.classList.contains('asc');

    th.classList.toggle('asc', asc);
    th.classList.toggle('desc', !asc);

    rows.sort((a, b) => {
      const aText = a.cells[index].innerText.trim();
      const bText = b.cells[index].innerText.trim();

      return asc
        ? aText.localeCompare(bText, undefined, { numeric: true })
        : bText.localeCompare(aText, undefined, { numeric: true });
    });

    rows.forEach((row) => table.querySelector('tbody').appendChild(row));
  });
});

document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    document
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" min="18" max="90" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
`;
document.body.appendChild(form);

form.addEventListener('submit', (even) => {
  even.preventDefault();

  const name = form.name.value.trim();
  const position = form.name.value.trim();
  const office = form.office.value;
  const age = parseInt(form.age.value, 10);
  const salary = parseFloat(form.salary.value);

  if (name.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  `;
  document.querySelector('tbody').appendChild(newRow);
  showNotification('Employee added successfully!', 'success');
  form.reset();
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<span class="title">${type.toUpperCase()}</span><p>${message}</p>`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

document.querySelectorAll('td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialText = cell.textContent.trim();
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialText;

    input.addEventListener('blur', () => {
      cell.textContent = input.value || initialText;
    });

    input.addEventListener('keydown', (even) => {
      if (even.key === 'Enter') {
        cell.textContent = input.value || initialText;
      }
    });

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
  });
});

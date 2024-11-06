'use strict';

// write code here
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  let sortDirection = true;
  let selectedRow = null;

  // Table sorting
  table.querySelectorAll('th').forEach((header) => {
    header.addEventListener('click', () => {
      const index = Array.from(header.parentNode.children).indexOf(header);
      const rows = Array.from(table.querySelectorAll('tbody tr'));

      rows.sort((a, b) => {
        const cellA = a.children[index].textContent.trim();
        const cellB = b.children[index].textContent.trim();

        return sortDirection
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      });
      sortDirection = !sortDirection;
      rows.forEach((row) => table.querySelector('tbody').appendChild(row));
    });
  });

  // Row selection
  table.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      row.classList.add('active');
      selectedRow = row;
    });
  });

  // Add form
  const formHtml = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name"></label>
      <label>Position: <input name="position" type="text" data-qa="position"></label>
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
      <label>Age: <input name="age" type="number" data-qa="age"></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
      <button type="submit">Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  const form = document.querySelector('.new-employee-form');

  // eslint-disable-next-line no-shadow
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // eslint-disable-next-line no-shadow
    const name = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value.trim(), 10);
    const salary = parseFloat(form.salary.value.trim());

    if (name.length < 4) {
      showNotification('Name must be at least 4 characters long', 'error');

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
      <td>${salary.toFixed(2)}</td>
    `;
    table.querySelector('tbody').appendChild(newRow);
    showNotification('Employee added successfully', 'success');

    newRow.addEventListener('click', () => {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      newRow.classList.add('active');
      selectedRow = newRow;
    });
  });

  function showNotification(message, type) {
    const notification = document.createElement('div');

    notification.className = type;
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.employees-table');
  const headers = table.querySelectorAll('th');
  let sortOrder = {}; // Store sort state per column

  // Sorting table by column
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      const isAscending = !sortOrder[index];

      sortOrder = { [index]: isAscending };

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[index].textContent.trim();
        const cellB = rowB.children[index].textContent.trim();

        return isAscending
          ? cellA.localeCompare(cellB, undefined, { numeric: true })
          : cellB.localeCompare(cellA, undefined, { numeric: true });
      });

      rows.forEach((row) => table.querySelector('tbody').appendChild(row));
    });
  });

  // Row selection
  // eslint-disable-next-line no-shadow
  table.addEventListener('click', (event) => {
    const row = event.target.closest('tr');

    if (row) {
      table.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    }
  });

  // Adding form
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

  // Form validation and adding rows
  // eslint-disable-next-line no-shadow
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // eslint-disable-next-line no-shadow
    const name = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value.trim();
    const age = parseInt(form.age.value, 10);
    const salary = parseInt(form.salary.value, 10);

    if (name.length < 4) {
      alert('Error: Name must be at least 4 characters.');

      return;
    }

    if (age < 18 || age > 90) {
      alert('Error: Age must be between 18 and 90.');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salary}</td>
    `;
    table.querySelector('tbody').appendChild(newRow);
    alert('Success: Employee added!');
    form.reset();
  });
});

'use strict';

const table = document.querySelector('table tbody');
const headers = document.querySelectorAll('th');
const formContainer = document.createElement('div');

formContainer.innerHTML = `
  <form class="new-employee-form">
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  </form>
`;

document.body.prepend(formContainer);

const showNotification = (type, title, description) => {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<h2 class="title">${title}</h2><p>${description}</p>`;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 2000);
};

let currentSort = {
  column: null,
  direction: 'asc',
};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = Array.from(table.rows);
    const newDirection =
      currentSort.column === index && currentSort.direction === 'asc'
        ? 'desc'
        : 'asc';

    currentSort = { column: index, direction: newDirection };

    rows.sort((a, b) => {
      const aText = a.cells[index].innerText;
      const bText = b.cells[index].innerText;

      if (newDirection === 'asc') {
        return aText.localeCompare(bText, undefined, { numeric: true });
      } else {
        return bText.localeCompare(aText, undefined, { numeric: true });
      }
    });

    rows.forEach((row) => table.appendChild(row));
  });
});

table.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  if (target) {
    Array.from(table.rows).forEach((row) => row.classList.remove('active'));
    target.classList.add('active');
  }
});

formContainer
  .querySelector('.new-employee-form')
  .addEventListener('submit', (eventNew) => {
    eventNew.preventDefault(); // Change event to eventNew

    const formData = new FormData(eventNew.target);
    const employeeName = formData.get('name').trim();
    const position = formData.get('position').trim();
    const office = formData.get('office').trim();
    const age = Number(formData.get('age'));
    const salary = Number(formData.get('salary'));

    if (employeeName.length < 4) {
      showNotification(
        'error',
        'Error!',
        'Name must be at least 4 characters long.',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('error', 'Error!', 'Age must be between 18 and 90.');

      return;
    }

    const newRow = table.insertRow();

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString()}</td>
    `;

    showNotification('success', 'Success!', 'New employee added successfully.');
    eventNew.target.reset();
  });

table.addEventListener('dblclick', (e) => {
  const target = e.target.closest('td');

  if (target) {
    const currentText = target.innerText;
    const input = document.createElement('input');

    input.value = currentText;
    target.innerHTML = '';
    target.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      const newValue = input.value.trim() || currentText;

      target.innerText = newValue;
    });

    input.addEventListener('keypress', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        const newValue = input.value.trim() || currentText;

        target.innerText = newValue;
      }
    });
  }
});

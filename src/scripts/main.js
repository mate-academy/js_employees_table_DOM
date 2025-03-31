'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  let sortDirection = 1;
  let currentSortColumn = null;

  table.querySelectorAll('thead th').forEach((th, index) => {
    th.addEventListener('click', () => {
      const rows = Array.from(table.tBodies[0].rows);
      const isSalary = th.textContent === 'Salary';
      const isAge = th.textContent === 'Age';

      if (currentSortColumn === index) {
        sortDirection *= -1;
      } else {
        sortDirection = 1;
        currentSortColumn = index;
      }

      rows.sort((a, b) => {
        let aText = a.cells[index].textContent;
        let bText = b.cells[index].textContent;

        if (isSalary) {
          aText = parseFloat(aText.replace(/[$,]/g, ''));
          bText = parseFloat(bText.replace(/[$,]/g, ''));
        } else if (isAge) {
          aText = parseInt(aText, 10);
          bText = parseInt(bText, 10);
        }

        if (aText > bText) {
          return sortDirection;
        } else if (aText < bText) {
          return -sortDirection;
        } else {
          return 0;
        }
      });

      rows.forEach((row) => {
        table.tBodies[0].appendChild(row);
      });
    });
  });

  table.querySelector('tbody').addEventListener('click', (e) => {
    if (e.target.tagName === 'TD') {
      const row = e.target.parentElement;

      table.querySelectorAll('tbody tr').forEach((tr) => {
        tr.classList.remove('active');
      });
      row.classList.add('active');
    }
  });

  const formContainer = document.createElement('div');

  formContainer.classList.add('new-employee-form');

  formContainer.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" /></label>
    <label>Position: <input name="position" type="text" data-qa="position" /></label>
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
    <label>Age: <input name="age" type="number" data-qa="age" /></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" /></label>
    <button type="button">Save to table</button>
  `;
  document.body.appendChild(formContainer);

  const showNotification = (type, message) => {
    const notif = document.createElement('div');

    notif.className = type;
    notif.dataset.qa = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.remove();
    }, 3000);
  };

  formContainer.querySelector('button').addEventListener('click', () => {
    const nameInput = formContainer
      .querySelector('[data-qa="name"]')
      .value.trim();
    const position = formContainer
      .querySelector('[data-qa="position"]')
      .value.trim();
    const office = formContainer.querySelector('[data-qa="office"]').value;
    const age = parseInt(
      formContainer.querySelector('[data-qa="age"]').value,
      10,
    );
    const salary = parseFloat(
      formContainer.querySelector('[data-qa="salary"]').value,
    );

    if (nameInput.length < 4) {
      showNotification('error', 'Name must be at least 4 characters');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('error', 'Age must be between 18 and 90');

      return;
    }

    if (!position || isNaN(salary)) {
      showNotification('error', 'All fields are required');

      return;
    }

    const row = table.tBodies[0].insertRow();

    [
      nameInput,
      position,
      office,
      age,
      `$${salary.toLocaleString('en-US')}`,
    ].forEach((text) => {
      const cell = row.insertCell();

      cell.textContent = text;
    });

    showNotification('success', 'Employee added successfully');
  });

  table.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (cell.tagName !== 'TD' || cell.querySelector('input')) {
      return;
    }

    const oldValue = cell.textContent;

    cell.textContent = '';

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = oldValue;
    cell.appendChild(input);
    input.focus();

    const save = () => {
      const newValue = input.value.trim();

      cell.textContent = newValue === '' ? oldValue : newValue;
    };

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        save();
      }
    });
  });
});

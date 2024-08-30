'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th');
  const sortDirection = {};

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const currentDirection = sortDirection[index] || 'desc';
      const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

      sortDirection[index] = newDirection;

      sortTableByColumn(table, index, newDirection);
    });
  });

  function sortTableByColumn(_table, columnIndex, direction) {
    const rows = [...tbody.querySelectorAll('tr')];

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].innerText.toLowerCase();
      const cellB = rowB.cells[columnIndex].innerText.toLowerCase();

      let valueA, valueB;

      if (columnIndex === 3) {
        valueA = parseInt(cellA);
        valueB = parseInt(cellB);
      } else if (columnIndex === 4) {
        valueA = parseFloat(cellA.replace('$', ''));
        valueB = parseFloat(cellB.replace('$', ''));
      } else {
        valueA = cellA;
        valueB = cellB;
      }

      if (direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  }

  selectRow(tbody);

  function selectRow(inputTable) {
    inputTable.addEventListener('click', (e) => {
      const selectedRow = e.target.parentElement.sectionRowIndex;

      for (let i = 0; i < tbody.rows.length; i++) {
        tbody.rows[i].removeAttribute('class');
      }
      tbody.rows[selectedRow].setAttribute('class', 'active');
    });
  }

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office: <select name="office" data-qa="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select></label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;
  document.body.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value.trim();
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value);

    if (userName.length < 4) {
      showNotification(
        'Error',
        'Name must be at least 4 characters long',
        'error',
      );

      return;
    }

    if (isNaN(age) || age < 18 || age > 90) {
      showNotification('Error', 'Age must be between 18 and 90', 'error');

      return;
    }

    if (!position || position.length < 3) {
      showNotification('Error', 'Invalid position input!', 'error');

      return;
    }

    const newRow = tbody.insertRow(tbody.rows.length - 1);

    newRow.classList.add('data-row');

    newRow.insertCell().textContent = userName;
    newRow.insertCell().textContent = position;
    newRow.insertCell().textContent = office;
    newRow.insertCell().textContent = age;
    newRow.insertCell().textContent = `$${Number(salary).toLocaleString('en-US')}`;

    showNotification(
      'Success',
      'New employee is successfully added to the table!',
      'success',
    );
    form.reset();
  });

  function showNotification(title, message, type) {
    const notification = document.createElement('div');

    notification.className = type;
    notification.dataset.qa = 'notification';
    notification.innerHTML = `<strong>${title}</strong>: ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    const initialText = cell.textContent;
    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = initialText;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      const newText = input.value.trim() || initialText;

      cell.textContent = newText;
    });

    input.addEventListener('keypress', (symbol) => {
      if (symbol.key === 'Enter') {
        const newText = input.value.trim() || initialText;

        cell.textContent = newText;
      }
    });
  });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || cell.querySelector('input')) {
      return;
    }

    const initialText = cell.textContent;
    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = initialText;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    const saveChanges = () => {
      let newText = input.value.trim();

      if (cell.cellIndex === 4) {
        const parsedValue = parseFloat(newText.replace(/[$,]/g, ''));

        newText = isNaN(parsedValue)
          ? initialText
          : `$${parsedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (newText === '') {
        newText = initialText;
      }

      cell.textContent = newText;
    };

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keypress', (symbol) => {
      if (symbol.key === 'Enter') {
        saveChanges();
      }
    });
  });
});

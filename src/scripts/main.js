'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = document.querySelectorAll('thead th');
  const tbody = document.querySelector('tbody');
  const rows = [...tbody.querySelectorAll('tr')];

  let columnIndex = null;
  let sortDirection = 1;

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      if (columnIndex !== index) {
        columnIndex = index;
        sortDirection = 1;
      } else {
        sortDirection *= -1;
      }

      rows.sort((rowA, rowB) => {
        let cellA = rowA.children[index].textContent.trim();
        let cellB = rowB.children[index].textContent.trim();

        if (index === 3 || index === 4) {
          cellA = parseFloat(cellA.replace(/[^0-9.]/g, ''));
          cellB = parseFloat(cellB.replace(/[^0-9.]/g, ''));

          return (cellA - cellB) * sortDirection;
        }

        return cellA.localeCompare(cellB) * sortDirection;
      });

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  // form
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  // Name
  const labelName = document.createElement('label');

  labelName.textContent = 'Name:';

  const inputName = document.createElement('input');

  inputName.name = 'name';
  inputName.type = 'text';
  inputName.setAttribute('data-qa', 'name');
  inputName.setAttribute('minlength', 4);

  labelName.appendChild(inputName);
  form.appendChild(labelName);

  // Position
  const labelPosition = document.createElement('label');

  labelPosition.textContent = 'Position:';

  const inputPosition = document.createElement('input');

  inputPosition.name = 'position';
  inputPosition.type = 'text';
  inputPosition.setAttribute('data-qa', 'position');

  labelPosition.appendChild(inputPosition);
  form.appendChild(labelPosition);

  // Office
  const labelOffice = document.createElement('label');

  labelOffice.textContent = 'Office:';

  const select = document.createElement('select');

  select.name = 'office';
  select.setAttribute('data-qa', 'office');

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  offices.forEach((office) => {
    const option = document.createElement('option');

    option.textContent = office;

    select.appendChild(option);
  });

  labelOffice.appendChild(select);
  form.appendChild(labelOffice);

  // Age
  const labelAge = document.createElement('label');

  labelAge.textContent = 'Age:';

  const inputAge = document.createElement('input');

  inputAge.name = 'age';
  inputAge.type = 'number';
  inputAge.setAttribute('data-qa', 'age');

  labelAge.appendChild(inputAge);
  form.appendChild(labelAge);

  // Salary
  const labelSalary = document.createElement('label');

  labelSalary.textContent = 'Salary:';

  const inputSalary = document.createElement('input');

  inputSalary.name = 'salary';
  inputSalary.type = 'number';
  inputSalary.setAttribute('data-qa', 'salary');

  labelSalary.appendChild(inputSalary);
  form.appendChild(labelSalary);

  // Button
  const button = document.createElement('button');

  button.textContent = 'Save to table';

  form.appendChild(button);

  table.after(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const n = formData.get('name');

    if (n.length < 4) {
      printNotification(
        'error',
        'ERROR',
        'The name must be no shorter than 4 letters',
      );

      return;
    }

    const position = formData.get('position');

    if (position.length < 4) {
      printNotification(
        'error',
        'ERROR',
        'The position must be no shorter than 4 letters',
      );

      return;
    }

    const office = formData.get('office');
    const age = formData.get('age');

    if (age < 18 || age > 90) {
      printNotification(
        'error',
        'ERROR',
        'Age must be between 18 and 90 years old',
      );

      return;
    }

    const salary = Number(formData.get('salary'));

    if (salary === 0) {
      printNotification('error', 'ERROR', 'Enter salary');

      return;
    }

    const formattedSalary = '$' + salary.toLocaleString('en-US');

    const info = [n, position, office, age, formattedSalary];

    const newRow = document.createElement('tr');

    info.forEach((element) => {
      const newTd = document.createElement('td');

      newTd.textContent = element;

      newRow.appendChild(newTd);
    });

    tbody.appendChild(newRow);

    printNotification('success', 'SUCCESS', 'Employee successfully added');
  });

  let editingCell = null;

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (cell.tagName !== 'TD') {
      return;
    }

    if (editingCell) {
      return;
    }

    const originalText = cell.textContent.trim();

    editingCell = cell;

    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = originalText;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    const finishEditing = () => {
      const newValue = input.value.trim();

      cell.textContent = newValue || originalText;
      editingCell = null;
    };

    input.addEventListener('blur', finishEditing);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        input.blur();
      } else if (ev.key === 'Escape') {
        input.value = originalText;
        input.blur();
      }
    });
  });
});

function printNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);

  notification.innerHTML = `
  <h2 class="title">${title}</h2>
  <p>${description}</p>`;

  document.querySelector('body').appendChild(notification);
  setTimeout(() => (notification.style.display = 'none'), 2000);
}

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tBody = table.querySelector('tbody');
  const rows = [...tBody.querySelectorAll('tr')];

  const sortDirection = {};

  // sorting table in both directions
  headers.forEach((header, columnIndex) => {
    header.addEventListener('click', () => {
      sortDirection[columnIndex] = !sortDirection[columnIndex];

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        const numA = parseFloat(cellA.replace(/[^0-9.]/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.]/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection[columnIndex] ? numA - numB : numB - numA;
        }

        return sortDirection[columnIndex]
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      });

      tBody.append(...rows);
    });
  });

  // row becomes selected by the click
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      document.querySelectorAll('tbody tr.active').forEach((selectedRow) => {
        selectedRow.classList.remove('active');
      });

      row.classList.add('active');
    });
  });

  // add a form.
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const nameInput = document.createElement('input');

  nameInput.name = 'name';
  nameInput.type = 'text';
  nameInput.setAttribute('data-qa', 'name');

  const nameLabel = document.createElement('label');

  nameLabel.textContent = 'Name: ';

  const positionInput = document.createElement('input');

  positionInput.name = 'position';
  positionInput.type = 'text';
  positionInput.setAttribute('data-qa', 'position');

  const positionLabel = document.createElement('label');

  positionLabel.textContent = 'Position: ';

  const ageInput = document.createElement('input');

  ageInput.name = 'age';
  ageInput.type = 'number';
  ageInput.setAttribute('data-qa', 'age');

  const ageLabel = document.createElement('label');

  ageLabel.textContent = 'Age: ';

  const salaryInput = document.createElement('input');

  salaryInput.name = 'salary';
  salaryInput.type = 'number';
  salaryInput.setAttribute('data-qa', 'salary');

  const salaryLabel = document.createElement('label');

  salaryLabel.textContent = 'Salary: ';

  const officeSelect = document.createElement('select');

  officeSelect.name = 'office';
  officeSelect.setAttribute('data-qa', 'office');

  const officeLabel = document.createElement('label');

  officeLabel.textContent = 'Office: ';

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

    option.value = office;
    option.textContent = office;
    officeSelect.appendChild(option);
  });

  nameLabel.appendChild(nameInput);
  positionLabel.appendChild(positionInput);
  ageLabel.appendChild(ageInput);
  salaryLabel.appendChild(salaryInput);
  officeLabel.appendChild(officeSelect);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';

  form.append(
    nameLabel,
    positionLabel,
    ageLabel,
    salaryLabel,
    officeLabel,
    submitButton,
  );

  document.body.appendChild(form);

  // add notification
  function showNotification(title, message, type) {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.dataset.qa = 'notification';

    const h2 = document.createElement('h2');

    h2.textContent = title;
    h2.classList.add('title');

    const messageText = document.createElement('p');

    messageText.textContent = message;

    notification.append(h2, messageText);
    form.parentNode.insertBefore(notification, form);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // adding new employees using form
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const newName = formData.get('name').trim();
    const position = formData.get('position').trim();
    const office = formData.get('office').trim();
    const age = +formData.get('age').trim();
    const salary = +formData.get('salary').trim();

    if (!newName || !position || !office || !age || !salary) {
      showNotification('Error', 'All fields are required', 'error');

      return;
    }

    if (newName.length < 4) {
      showNotification(
        'Error',
        'Name should be at least 4 charachters',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification(
        'Error',
        'Age should be between 18 and 90 years',
        'error',
      );

      return;
    }

    const newRow = document.createElement('tr');

    const nameTd = document.createElement('td');

    nameTd.textContent = newName;

    const positionTd = document.createElement('td');

    positionTd.textContent = position;

    const officeTd = document.createElement('td');

    officeTd.textContent = office;

    const ageTd = document.createElement('td');

    ageTd.textContent = age;

    const salaryTd = document.createElement('td');

    salaryTd.textContent = `$${salary.toLocaleString('en-US')}`;

    newRow.append(nameTd, positionTd, officeTd, ageTd, salaryTd);
    tBody.appendChild(newRow);
    showNotification('Success', 'Employee successfully added', 'success');
    form.reset();
  });

  // Implement editing of table cells by double-clicking on them (optional).
  tBody.addEventListener('dblclick', (e) => {
    const cells = [...tBody.querySelectorAll('td')];
    let editingCell = null;

    cells.forEach((cell) => {
      // checking if other cells are editing
      if (editingCell) {
        return;
      }
      editingCell = cell;

      // save the original cell value
      const originalValue = cell.textContent.trim();

      // clear the cell
      cell.textContent = '';

      // add an input with original cell value
      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = originalValue;
      cell.appendChild('input');
      // focus on input
      input.focus();

      // blur on input
      input.onblur = function () {
        const newValue = input.value.trim();

        cell.textContent = newValue !== '' ? newValue : originalValue;
        editingCell = null;
      };

      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          input.blur();
        }
      });
    });
  });
});

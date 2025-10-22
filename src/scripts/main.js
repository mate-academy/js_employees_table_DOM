'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  // Sort & Active Row
  const sortDirections = {};
  let lastSortedIndex = null;

  table.querySelectorAll('th').forEach((th) => {
    th.addEventListener('click', (e) => {
      const index = e.currentTarget.cellIndex;
      const tbody = table.querySelector('tbody');

      if (!tbody) {
        return;
      }

      const rows = Array.from(tbody.rows);
      let direction;

      if (lastSortedIndex !== index) {
        direction = 'asc';
      } else {
        direction = sortDirections[index] === 'asc' ? 'desc' : 'asc';
      }

      sortDirections[index] = direction;
      lastSortedIndex = index;

      rows.sort((a, b) => {
        const valA = a.cells[index].textContent.trim();
        const valB = b.cells[index].textContent.trim();
        const numA = parseFloat(valA.replace(/[^\d.-]/g, ''));
        const numB = parseFloat(valB.replace(/[^\d.-]/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        return valA.localeCompare(valB, undefined, { sensitivity: 'base' });
      });

      if (direction === 'desc') {
        rows.reverse();
      }
      tbody.append(...rows);
    });
  });

  // active row
  table.addEventListener('click', (e) => {
    const row = e.target.closest('tbody tr');

    if (!row) {
      return;
    }

    table
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });

  // Notification
  function showNotification(type, title, description) {
    document.querySelectorAll('.notification').forEach((n) => n.remove());

    const notif = document.createElement('div');

    notif.classList.add('notification', type);
    notif.setAttribute('data-qa', 'notification');

    notif.innerHTML = `
      <span class="title">${title}</span>
      <p>${description}</p>
    `;
    document.body.append(notif);
    setTimeout(() => notif.remove(), 3000);
  }

  // Form
  function createForm() {
    const body = document.querySelector('body');
    const newForm = document.createElement('form');

    newForm.classList.add('new-employee-form');

    // Name
    const labelName = document.createElement('label');

    labelName.textContent = 'Name: ';

    const inputName = document.createElement('input');

    inputName.type = 'text';
    inputName.name = 'name';
    inputName.required = true;
    inputName.setAttribute('data-qa', 'name');
    labelName.append(inputName);

    // Position
    const labelPosition = document.createElement('label');

    labelPosition.textContent = 'Position: ';

    const inputPosition = document.createElement('input');

    inputPosition.type = 'text';
    inputPosition.name = 'position';
    inputPosition.required = true;
    inputPosition.setAttribute('data-qa', 'position');
    labelPosition.append(inputPosition);

    // Office
    const labelOffice = document.createElement('label');

    labelOffice.textContent = 'Office: ';

    const selectOffice = document.createElement('select');

    selectOffice.name = 'office';
    selectOffice.required = true;
    selectOffice.setAttribute('data-qa', 'office');

    [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ].forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      selectOffice.append(option);
    });
    labelOffice.append(selectOffice);

    // Age
    const labelAge = document.createElement('label');

    labelAge.textContent = 'Age: ';

    const inputAge = document.createElement('input');

    inputAge.type = 'number';
    inputAge.name = 'age';
    inputAge.required = true;
    inputAge.setAttribute('data-qa', 'age');
    labelAge.append(inputAge);

    // Salary
    const labelSalary = document.createElement('label');

    labelSalary.textContent = 'Salary: ';

    const inputSalary = document.createElement('input');

    inputSalary.type = 'number';
    inputSalary.name = 'salary';
    inputSalary.required = true;
    inputSalary.setAttribute('data-qa', 'salary');
    labelSalary.append(inputSalary);

    // Button
    const button = document.createElement('button');

    button.textContent = 'Save to table';
    button.type = 'submit';
    button.setAttribute('data-qa', 'button');

    newForm.append(
      labelName,
      labelPosition,
      labelOffice,
      labelAge,
      labelSalary,
      button,
    );
    body.append(newForm);

    // Submit
    newForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameValue = inputName.value.trim();
      const positionValue = inputPosition.value.trim();
      const officeValue = selectOffice.value;
      const ageRaw = inputAge.value;
      const salaryRaw = inputSalary.value;

      if (
        !nameValue ||
        !positionValue ||
        !officeValue ||
        ageRaw === '' ||
        salaryRaw === ''
      ) {
        showNotification('error', 'Missing Data', 'All fields are required.');

        return;
      }

      // Name validation
      const lettersCount = nameValue.replace(/[^A-Za-z]/g, '').length;

      if (lettersCount < 4) {
        showNotification(
          'error',
          'Invalid Name',
          'Name must contain at least 4 letters.',
        );

        return;
      }

      const positionLetters = positionValue.replace(/[^A-Za-z]/g, '').length;

      if (positionLetters < 4) {
        showNotification(
          'error',
          'Invalid Position',
          'Position must contain at least 4 letters.',
        );

        return;
      }

      const ageValue = Number(ageRaw);
      const salaryValue = Number(salaryRaw);

      // ✅ new: NaN guard
      if (!Number.isFinite(ageValue) || !Number.isFinite(salaryValue)) {
        showNotification(
          'error',
          'Invalid Number',
          'Age and Salary must be valid numbers.',
        );

        return;
      }

      if (ageValue < 18 || ageValue > 90) {
        showNotification(
          'error',
          'Invalid Age',
          'Age must be between 18 and 90.',
        );

        return;
      }

      const tbody = document.querySelector('table tbody');
      const newRow = document.createElement('tr');

      newRow.innerHTML = `
        <td>${nameValue}</td>
        <td>${positionValue}</td>
        <td>${officeValue}</td>
        <td>${ageValue}</td>
        <td>$${salaryValue.toLocaleString('en-US')}</td>
      `;
      tbody.append(newRow);

      if (lastSortedIndex !== null) {
        const direction = sortDirections[lastSortedIndex];
        const rows = Array.from(tbody.rows);

        rows.sort((a, b) => {
          const valA = a.cells[lastSortedIndex].textContent.trim();
          const valB = b.cells[lastSortedIndex].textContent.trim();
          const numA = parseFloat(valA.replace(/[^\d.-]/g, ''));
          const numB = parseFloat(valB.replace(/[^\d.-]/g, ''));

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          return valA.localeCompare(valB, undefined, { sensitivity: 'base' });
        });

        if (direction === 'desc') {
          rows.reverse();
        }
        tbody.append(...rows);
      }

      newForm.reset();

      showNotification(
        'success',
        'Employee Added',
        `${nameValue} was successfully added to the table.`,
      );
    });
  }

  createForm();

  // Inline edit
  table.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    if (cell.querySelector('input')) {
      return;
    }

    const existingInput = table.querySelector('.cell-input');

    if (existingInput) {
      return;
    }

    const oldValue = cell.textContent.trim();
    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');

    input.value =
      cell.cellIndex === 4 ? oldValue.replace(/[^0-9.,-]/g, '') : oldValue;

    cell.textContent = '';
    cell.append(input);
    input.focus();

    function saveValue() {
      const newValue = input.value.trim();

      if (newValue === '') {
        cell.textContent = oldValue;

        return;
      }

      if (cell.cellIndex === 4 && !isNaN(Number(newValue))) {
        const formatted = Number(newValue).toLocaleString('en-US');

        cell.textContent = `$${formatted}`;
      } else {
        cell.textContent = newValue;
      }
    }

    input.addEventListener('blur', saveValue);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveValue();
      }
    });
  });
});

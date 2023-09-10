'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headerCells = document.querySelectorAll('thead th');
  const newEmployeeForm = createNewEmployeeForm();
  const notificationElement = createNotification();
  const employees = [];

  let selectedRow = null;
  let sortDirection = 'asc';

  headerCells.forEach((headerCell, columnIndex) => {
    headerCell.addEventListener('click', () => {
      sortTable(columnIndex);
    });
  });

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (row) {
      selectRow(row);
    }
  });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (cell) {
      editCell(cell);
    }
  });

  document.body.appendChild(newEmployeeForm);
  document.body.appendChild(notificationElement);

  newEmployeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewEmployee(newEmployeeForm, notificationElement, employees);
  });

  function createNewEmployeeForm() {
    const form = document.createElement('form');

    form.classList.add('new-employee-form');

    form.innerHTML = `
      <label>Name: <input
        name="employeeName" type="text" data-qa="name" required></label>
      <label>Position: <input
        name="position" type="text" data-qa="position" required></label>
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
      <label>Age: <input
        name="age" type="number" data-qa="age" required></label>
      <label>Salary: <input
        name="salary" type="number" data-qa="salary" required></label>
      <button type="submit">Save to table</button>
    `;

    return form;
  }

  function createNotification() {
    const notification = document.createElement('div');

    notification.classList.add('notification');
    notification.setAttribute('data-qa', 'notification');
    notification.style.transition = 'opacity 0.5s';

    return notification;
  }

  function sortTable(columnIndex) {
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));
    const sortType = sortDirection === 'asc' ? 'desc' : 'asc';

    rowsArray.sort((rowA, rowB) => {
      const cellA = rowA.children[columnIndex].textContent.trim();
      const cellB = rowB.children[columnIndex].textContent.trim();

      if (columnIndex === 3 || columnIndex === 4) {
        const valueA = parseFloat(cellA.replace(/[$,]/g, ''));
        const valueB = parseFloat(cellB.replace(/[$,]/g, ''));

        return sortType === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return sortType === 'asc' ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    tbody.innerHTML = '';
    rowsArray.forEach((row) => tbody.appendChild(row));
    sortDirection = sortType;
  }

  function selectRow(row) {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }
    row.classList.add('active');
    selectedRow = row;
  }

  function addNewEmployee(form, notification, employes) {
    const formData = new FormData(form);
    const employeeName = formData.get('employeeName');
    const position = formData.get('position');
    const office = formData.get('office');
    const age = formData.get('age');
    const salary = formData.get('salary');

    let error = '';

    if (employeeName.length < 4) {
      error = 'Name should contain more than 4 letters.';
    } else if (position.trim() === '') {
      error = 'Position is required.';
    } else if (age < 18 || age > 90) {
      error = 'Age must be between 18 and 90.';
    } else if (+salary <= 0 || salary.trim() === '') {
      error = 'Salary is required.';
    }

    if (error) {
      displayErrorNotification(notification, error);
      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary}</td>
    `;
    tbody.appendChild(newRow);
    form.reset();
    displaySuccessNotification(notification, 'Employee added successfully!');

    employees.push({
      Name: employeeName,
      Position: position,
      Office: office,
      Age: parseInt(age),
      Salary: parseFloat(salary),
    });

    setTimeout(() => {
      hideNotification(notification);
    }, 2000);

    sortTable(headerCells.findIndex(
      cell => cell.classList.contains('sort-asc')));
  }

  let originalCellValue = '';

  function editCell(cell) {
    const cellValue = cell.textContent;
    const input = document.createElement('input');

    originalCellValue = cellValue;

    input.type = 'text';
    input.value = cellValue;

    input.addEventListener('blur', () => {
      saveCellEdit(input, cell);
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveCellEdit(input, cell);
      }
    });

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
  }

  function saveCellEdit(input, cell) {
    const editedValue = input.value.trim();

    if (editedValue === '') {
      cell.textContent = 'N/A';
    } else if (validateInput(editedValue)) {
      cell.textContent = editedValue;
    } else {
      cell.textContent = originalCellValue;

      displayErrorNotification(
        notificationElement, 'Invalid data! Please check the fields.');
    }
  }

  function validateInput(value) {
    return value.length >= 4;
  }

  function displayErrorNotification(notification, message) {
    notification.classList.remove('success');
    notification.classList.add('error');
    notification.textContent = message;
    notification.style.display = 'block';
  }

  function displaySuccessNotification(notification, message) {
    notification.textContent = message;
    notification.classList.remove('error');
    notification.classList.add('success');
    notification.style.opacity = '1';
    notification.style.display = 'block';
  }

  function hideNotification(notification) {
    notification.style.opacity = '0';

    setTimeout(() => {
      notification.textContent = '';
      removeNotificationIfEmpty(notification);
    }, 500);
  }

  function removeNotificationIfEmpty(notification) {
    if (notification.textContent.trim() === '') {
      notification.style.display = 'none';
    }
  }
  removeNotificationIfEmpty(notificationElement);
});

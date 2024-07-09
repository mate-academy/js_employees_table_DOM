'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const form = document.querySelector('.new-employee-form');
  let isAscending = true;

  const sortTable = (index, asc) => {
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
      const cellA = a.cells[index].innerText;
      const cellB = b.cells[index].innerText;

      if (cellA < cellB) {
        return asc ? -1 : 1;
      }

      if (cellA > cellB) {
        return asc ? 1 : -1;
      }

      return 0;
    });

    tbody.append(...rows);
  };

  table.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => {
      sortTable(index, isAscending);
      isAscending = !isAscending;
    });
  });

  tbody.addEventListener('click', (e) => {
    if (e.target.tagName === 'TD') {
      Array.from(tbody.rows).forEach((row) => row.classList.remove('active'));
      e.target.parentElement.classList.add('active');
    }
  });

  const showNotification = (message, type) => {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  const addEmplo = ({ empName, empPosition, empOffice, empAge, empSalary }) => {
    const newRow = tbody.insertRow();

    [empName, empPosition, empOffice, empAge, empSalary].forEach((text) => {
      const newCell = newRow.insertCell();

      newCell.innerText = text;
    });
  };

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const empName = form.querySelector('[name="name"]').value.trim();
    const empPosition = form.querySelector('[name="position"]').value.trim();
    const empOffice = form.querySelector('[name="office"]').value.trim();
    const empAg = parseInt(form.querySelector('[name="age"]').value.trim(), 10);
    const empSalary = parseInt(
      form.querySelector('[name="salary"]').value.trim(),
      10,
    );

    if (
      !empName ||
      !empPosition ||
      !empOffice ||
      isNaN(empAg) ||
      isNaN(empSalary)
    ) {
      showNotification('All fields are required and must be valid.', 'error');

      return;
    }

    if (empName.length < 4) {
      showNotification('Name must be at least 4 characters long.', 'error');

      return;
    }

    if (empAg < 18 || empAg > 90) {
      showNotification('Age must be between 18 and 90.', 'error');

      return;
    }

    addEmplo({
      empName,
      empPosition,
      empOffice,
      empAg,
      empSalary,
    });
    form.reset();
    showNotification('Employee added successfully.', 'success');
  });
});

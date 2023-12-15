'use strict';

document.addEventListener('DOMContentLoaded', function() {
  function toggleSortDirection(currentSortDirection) {
    return currentSortDirection === 'asc' ? 'desc' : 'asc';
  }

  function handleSortClick(header) {
    const currentSortDirection = header.dataset.sort || 'asc';
    const newSortDirection = toggleSortDirection(currentSortDirection);

    document.querySelectorAll('.sortable').forEach((el) => {
      el.classList.remove('asc', 'desc');
    });

    header.classList.add(newSortDirection);

    header.dataset.sort = newSortDirection;

    const columnIndex = Array.from(header.parentNode.children).indexOf(header);

    const rows = Array.from(document.querySelectorAll('tbody tr'));

    rows.sort((a, b) => {
      const aValue = a.children[columnIndex].textContent.trim();
      const bValue = b.children[columnIndex].textContent.trim();

      if (isNaN(aValue) || isNaN(bValue)) {
        return (
          aValue.localeCompare(bValue) * (newSortDirection === 'asc' ? 1 : -1)
        );
      } else {
        return (
          (parseFloat(aValue) - parseFloat(bValue))
          * (newSortDirection === 'asc' ? 1 : -1)
        );
      }
    });

    document.querySelector('tbody').innerHTML = '';

    rows.forEach((row) => {
      document.querySelector('tbody').appendChild(row);
    });
  }

  function handleRowClick(row) {
    document.querySelectorAll('tbody tr').forEach((el) => {
      el.classList.remove('active');
    });

    row.classList.add('active');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const nameInput = document.querySelector('[data-qa="name"]');
    const ageInput = document.querySelector('[data-qa="age"]');
    const positionInput = document.querySelector('[data-qa="position"]');
    const officeInput = document.querySelector('[data-qa="office"]');
    const salaryInput = document.querySelector('[data-qa="salary"]');
    const notification = document.querySelector('[data-qa="notification"]');

    notification.classList.remove('error', 'success');
    notification.textContent = '';

    if (nameInput.value.length < 4) {
      notification.classList.add('error');
      notification.textContent = 'Name should have at least 4 characters.';

      return;
    }

    const ageValue = parseInt(ageInput.value);

    if (isNaN(ageValue) || ageValue < 18 || ageValue > 90) {
      notification.classList.add('error');
      notification.textContent = 'Age should be between 18 and 90.';

      return;
    }

    const tableBody = document.querySelector('tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${nameInput.value}</td>
      <td>${positionInput.value}</td>
      <td>${officeInput.value}</td>
      <td>${ageInput.value}</td>
      <td>${parseFloat(salaryInput.value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })}</td>
    `;

    tableBody.appendChild(newRow);

    nameInput.value = '';
    ageInput.value = '';
    positionInput.value = '';
    officeInput.value = '';
    salaryInput.value = '';

    notification.classList.add('success');
    notification.textContent = 'Employee added successfully.';
  }

  document.querySelectorAll('.sortable').forEach((header) => {
    header.addEventListener('click', function() {
      handleSortClick(this);
    });
  });

  document.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', function() {
      handleRowClick(this);
    });
  });

  const form = document.querySelector('.new-employee-form');

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

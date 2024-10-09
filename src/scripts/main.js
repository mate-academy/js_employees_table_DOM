'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('th');
  const tbody = document.querySelector('tbody');
  let rows = Array.from(tbody.querySelectorAll('tr'));
  const sortOrder = Array(headers.length).fill(true);

  function updateRows() {
    rows = Array.from(tbody.querySelectorAll('tr'));
  }

  function sortColumn(index) {
    updateRows();

    rows.sort((a, b) => {
      const cellA = a.cells[index].textContent.trim();
      const cellB = b.cells[index].textContent.trim();
      const isCurrency = cellA.includes('$');

      if (isCurrency) {
        const valA = parseFloat(cellA.replace(/[$,]/g, ''));
        const valB = parseFloat(cellB.replace(/[$,]/g, ''));

        return sortOrder[index] ? valA - valB : valB - valA;
      }

      return sortOrder[index]
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
    sortOrder[index] = !sortOrder[index];
  }

  headers.forEach((header, index) => {
    header.addEventListener('click', () => sortColumn(index));
  });

  function toggleActiveRow(row) {
    document
      .querySelectorAll('tr.active')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  }

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (row) {
      toggleActiveRow(row);
    }
  });

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>
      Name: <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position: <input name="position" type="text" data-qa="position" required>
    </label>
    <label>
      Office:
      <select name="office" data-qa="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>
      Age: <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary: <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="button">Save to table</button>
  `;
  document.body.appendChild(form);

  function showNotification(title, message, type) {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');

    notification.innerHTML = `
      <h2 class="title">${title}</h2>
      <p>${message}</p>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function validateForm() {
    const personName = form.elements.name.value.trim();

    if (personName.length < 4 && personName.length > 0) {
      showNotification(
        'Error!',
        'The minimum name length is 4 letters',
        'error',
      );

      return false;
    }

    const age = parseInt(form.elements.age.value, 10);

    if (age < 18 || age > 90) {
      showNotification('Error!', 'You are too young/old for this', 'error');

      return false;
    }

    return Array.from(form.elements).every((input) => {
      if (input.tagName === 'INPUT' || input.tagName === 'SELECT') {
        if (!input.value.trim()) {
          showNotification('Error!', 'Fill in all fields', 'error');

          return false;
        }
      }

      return true;
    });
  }

  function getFormData() {
    return {
      name: form.elements.name.value.trim(),
      position: form.elements.position.value.trim(),
      office: form.elements.office.value.trim(),
      age: parseInt(form.elements.age.value, 10),
      salary: parseFloat(form.elements.salary.value.replace(/[^0-9.]/g, '')),
    };
  }

  form.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newPerson = getFormData();
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${newPerson.name}</td>
      <td>${newPerson.position}</td>
      <td>${newPerson.office}</td>
      <td>${newPerson.age}</td>
      <td>$${newPerson.salary.toLocaleString('en')}</td>
    `;
    tbody.prepend(newRow);
    form.reset();
    showNotification('Success!', '+1 employee', 'success');
  });
});

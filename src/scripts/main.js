'use strict';

/**
 * Основний модуль програми
 */
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th');

  // --- 1. ВИБІР РЯДКА ---
  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    // Видаляємо active у всіх, додаємо поточному
    tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
    row.classList.add('active');
  });

  // --- 2. СОРТУВАННЯ ---
  let sortDirection = 1; // 1 для ASC, -1 для DESC
  let lastIndex = -1;

  headers.forEach((header, index) => {
    header.style.cursor = 'pointer';

    header.addEventListener('click', () => {
      // Якщо натиснули на новий заголовок — завжди ASC
      if (lastIndex !== index) {
        sortDirection = 1;
      } else {
        sortDirection *= -1; // Зміна напрямку
      }
      lastIndex = index;

      const rowsArray = Array.from(tbody.querySelectorAll('tr'));

      rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.children[index].textContent.trim();
        const cellB = rowB.children[index].textContent.trim();

        // Перевірка на числа (для Age та Salary)
        const parsedA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
        const valA = isNaN(parsedA) ? cellA : parsedA;

        const parsedB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));
        const valB = isNaN(parsedB) ? cellB : parsedB;

        if (valA > valB) {
          return sortDirection;
        }

        if (valA < valB) {
          return -sortDirection;
        }

        return 0;
      });

      tbody.append(...rowsArray);
    });
  });

  // Запускаємо створення форми
  createForm(table);
});

function createForm(table) {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>Position: <input name="position" type="text" data-qa="position"></label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <button type="submit">Save to table</button>
  `;

  document.body.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const employeeName = formData.get('name');
    const position = formData.get('position'); // ДОДАЙТЕ ЦЕЙ РЯДОК
    const office = formData.get('office');
    const age = Number(formData.get('age'));
    const salary = formData.get('salary');

    // --- ВАЛІДАЦІЯ ---
    if (!employeeName || !position || !office || !age || !salary) {
      showNotification('All fields are required!', 'error');

      return; // Зупиняємо виконання, щоб рядок не додався
    }

    if (employeeName.length < 4) {
      showNotification('Name must be at least 4 letters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    // Якщо все ок — додаємо в таблицю
    const tbody = table.querySelector('tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${formData.get('position')}</td>
      <td>${formData.get('office')}</td>
      <td>${age}</td>
      <td>$${Number(salary).toLocaleString('en-US')}</td>
    `;
    tbody.appendChild(newRow);
    showNotification('Employee added successfully!', 'success');
    form.reset();
  });
}

function showNotification(msg, type) {
  const oldNote = document.querySelector('[data-qa="notification"]');

  if (oldNote) {
    oldNote.remove();
  }

  const note = document.createElement('div');

  note.className = `notification ${type}`;
  note.setAttribute('data-qa', 'notification');
  note.textContent = msg;
  document.body.prepend(note);

  setTimeout(() => note.remove(), 3000);
}

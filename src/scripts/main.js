'use strict';

// ---------------------------
// 1️⃣ Select elements
// ---------------------------
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');
const container = document.querySelector('.container');
const sortOrder = {};
let lastSortedKey = null;
let editingCell = null;

// ---------------------------
// 2️⃣ Sorting columns
// ---------------------------
headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    const key = th.innerText.toLowerCase();

    // Якщо натискаємо новий стовпець — завжди ASC
    if (lastSortedKey !== key) {
      sortOrder[key] = 'asc';
    } else {
      sortOrder[key] = sortOrder[key] === 'asc' ? 'desc' : 'asc';
    }
    lastSortedKey = key;

    const rowsArray = Array.from(tbody.querySelectorAll('tr'));

    rowsArray.sort((a, b) => {
      let cellA = a.children[index].innerText;
      let cellB = b.children[index].innerText;

      // Для числових колонок (Age=3, Salary=4)
      if (index === 3 || index === 4) {
        cellA = Number(cellA.replace(/[^0-9.-]+/g, ''));
        cellB = Number(cellB.replace(/[^0-9.-]+/g, ''));

        if (sortOrder[key] === 'asc') {
          return cellA - cellB;
        } else {
          return cellB - cellA;
        }
      } else {
        // Для текстових колонок
        return sortOrder[key] === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    tbody.innerHTML = '';
    rowsArray.forEach((row) => tbody.appendChild(row));
  });
});

// ---------------------------
// 3️⃣ Row selection
// ---------------------------
tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }
  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));
  tr.classList.add('active');
});

// ---------------------------
// 4️⃣ Create employee form
// ---------------------------
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" /></label>
  <label>Position: <input name="position" type="text" data-qa="position" /></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="">Select</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" /></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" /></label>
  <button type="submit">Save to table</button>
`;
container.appendChild(form);

// ---------------------------
// 5️⃣ Notifications
// ---------------------------
function showNotification(message, type = 'error') {
  const existing = document.querySelector('.notification');

  if (existing) {
    existing.remove();
  }

  const notif = document.createElement('div');

  notif.className = `notification ${type}`;
  notif.setAttribute('data-qa', 'notification');
  notif.innerHTML = `<span class="title">${message}</span>`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ---------------------------
// 6️⃣ Form submission & validation
// ---------------------------
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const ageVal = form.elements.age.value.trim();
  const salaryVal = form.elements.salary.value.trim();

  if (!employeeName || !position || !office || !ageVal || !salaryVal) {
    return showNotification('All fields are required', 'error');
  }

  if (employeeName.length < 4) {
    return showNotification('Name must be at least 4 letters', 'error');
  }

  const age = Number(ageVal);
  const salary = Number(salaryVal);

  if (!Number.isFinite(age) || age < 18 || age > 90) {
    return showNotification('Age must be between 18 and 90', 'error');
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;
  tbody.appendChild(tr);

  showNotification('Employee added successfully!', 'success');
  form.reset();
});

// ---------------------------
// 7️⃣ Inline cell editing
// ---------------------------
tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || editingCell) {
    return;
  }

  const originalText = td.innerText; // always store original text
  let inputValue = originalText;

  // Only strip non-numeric characters for Age (index 3) and Salary (index 4)
  if (td.cellIndex === 3 || td.cellIndex === 4) {
    inputValue = originalText.replace(/[^0-9.-]+/g, '');
  }

  td.innerHTML = `<input class="cell-input" value="${inputValue}" />`;

  const input = td.querySelector('input');

  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  editingCell = td;

  function save() {
    let value = input.value.trim();

    if (value === '') {
      value = originalText;
    } // restore original if empty

    // Format Salary column
    if (td.cellIndex === 4) {
      const num = Number(value.replace(/[^0-9.-]+/g, ''));

      value = Number.isFinite(num)
        ? `$${num.toLocaleString('en-US')}`
        : originalText;
    }

    td.innerText = value;
    editingCell = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});

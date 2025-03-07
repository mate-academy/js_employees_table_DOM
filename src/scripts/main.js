'use strict';

const headers = Array.from(document.querySelectorAll('thead th'));
const tbody = document.querySelector('tbody');
let currentSortColumn = null; // Поточний стовпець для сортування
let currentSortDirection = 'ASC'; // Поточний напрямок сортування,'ASC'/'DESC'

headers.forEach((header, headerIndex) => {
  header.addEventListener('click', () => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));

    // Якщо натиснуто на новий стовпець, скидаємо напрямок сортування в 'ASC'
    if (currentSortColumn !== headerIndex) {
      currentSortDirection = 'ASC'; // старт з ASC,якщо вибрали новий стовпець
      currentSortColumn = headerIndex; // Запам'ятовуємо новий стовпець
    } else {
      // Якщо клікаємо по тому ж стовпцю, перемикаємо напрямок сортування
      currentSortDirection = currentSortDirection === 'ASC' ? 'DESC' : 'ASC';
    }

    rows.sort((a, b) => {
      const rowA = a.cells[headerIndex].textContent.trim();
      const rowB = b.cells[headerIndex].textContent.trim();

      if (currentSortDirection === 'ASC') {
        return rowA.localeCompare(rowB, undefined, { numeric: true });
      } else {
        return rowB.localeCompare(rowA, undefined, { numeric: true });
      }
    });

    rows.forEach((row) => tbody.append(row));
  });
});

document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    // ?. перевіряє, чи існує елемент.
    // Якщо null → просто пропускає виконання і не ламає код.
    tbody.querySelector('tr.active')?.classList.remove('active');

    row.classList.add('active');
  });
});

const body = document.querySelector('body');
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>
    Name:
    <input type="text" name="name" required data-qa="name">
  </label>
  <label>
    Position:
    <input type="text" name="position" required data-qa="position">
  </label>
  <label>
    Office:
    <select name="office" required data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input name='age' type='number' required  data-qa='age'>
  </label>
  <label>
    Salary:
    <input name='salary' type='number' required  data-qa='salary'>
  </label>
  <button type="submit">Save to table</button>
`;
body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value.trim();
  const age = form.age.value;
  const salary = form.salary.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const row = document.createElement('tr');
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');

  function showNotification(message, type) {
    notification.classList.add(type);
    notification.textContent = message;
    body.append(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  if (!userName || !position || !office || !age || !salary) {
    showNotification('All fields must be filled', 'error');
    return;
  }

  if (userName.length < 4) {
    showNotification('Value shouldnt be less than 4 letters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Value is less than 18 or more than 90', 'error');

    return;
  }


  row.innerHTML =`
    <td>${userName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary}</td>
  `;
  tbody.append(row);

  showNotification('Data successfuly added', 'success');

  form.reset();
});

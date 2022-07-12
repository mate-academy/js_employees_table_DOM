'use strict';

// const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
// const rows = document.querySelectorAll('tr');

// сортування таблиці клацанням по заголовку
thead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const row = tbody.rows;

  const sortedList = [...row].sort((a, b) => {
    const row1 = a.cells[index].innerText.replace(/[$,]/g, '');
    const row2 = b.cells[index].innerText.replace(/[$,]/g, '');

    if (e.target.innerText === 'Name' || e.target.innerText === 'Position'
    || e.target.innerText === 'Office') {
      return row1.localeCompare(row2);
    } else {
      return row1 - row2;
    }
  });

  tbody.append(...sortedList);
});

// Коли користувач клацає рядок, він має стати виділеним.
tbody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const activeRow = document.querySelector('.active');

  if (!activeRow) {
    row.classList.add('active');
  } else {
    activeRow.classList.remove('active');
    row.classList.add('active');
  }
});

// сценарій, щоб додати форму до документа
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
    >
  </label>
  <label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
    >
  </label>
  <label>
    Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input
      name="age"
      type="number"
      data-qa="age"
    >
  </label>
  <label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
    >
  </label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);

// Форма дозволяє користувачам додавати нових співробітників до таблиці.
form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tr = document.createElement('tr');

  const textArray = [
    formData.get('name'),
    formData.get('position'),
    formData.get('office'),
    formData.get('age'),
    formData.get('salary'),
  ];

  for (let i = 0; i < textArray.length; i++) {
    const td = document.createElement('td');

    if (i === textArray.length - 1) {
      const num = parseInt(textArray[i]);

      td.textContent = `$${num.toLocaleString('en-US')}`;
    } else {
      td.textContent = textArray[i];
    }

    tr.append(td);
  }

  tbody.append(tr);

  const input = form.querySelectorAll('input');

  for (let i = 0; i < [...input].length; i++) {
    input[i].value = null;
  }
});

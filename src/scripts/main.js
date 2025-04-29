'use strict';

// sort function
const tHeadTags = document.querySelectorAll('th'); // Вибираємо всі заголовки
const tbody = document.querySelector('tbody'); // Тіло таблиці
const rows = tbody.querySelectorAll('tr'); // Всі рядки

const sortMode = {}; // Об'єкт для відстеження стану сортування

tHeadTags.forEach((tag, thIndex) => {
  // Початковий стан сортування — за зростанням
  sortMode[thIndex] = 'asc';

  tag.addEventListener('click', () => {
    const direction = sortMode[thIndex];

    if (direction === 'asc') {
      sortTable(thIndex, 'asc');
      sortMode[thIndex] = 'desc'; // Змінюємо стан
    } else {
      sortTable(thIndex, 'desc');
      sortMode[thIndex] = 'asc'; // Змінюємо стан
    }
  });
});

function sortTable(indx, mode) {
  const table = document.querySelector('table');
  const content = Array.from(table.rows).slice(1, -1); // Пропускаємо заголовки

  content.sort((a, b) => {
    const cellA = a.cells[indx].innerText.trim();
    const cellB = b.cells[indx].innerText.trim();

    if (mode === 'asc') {
      return cellA > cellB ? 1 : -1;
    } else {
      return cellA < cellB ? 1 : -1;
    }
  });

  // Оновлюємо порядок рядків у таблиці
  content.forEach((row) => table.appendChild(row));
}

// ACTIVE FOR ROWS
Array.from(rows).forEach((element, index) => {
  element.addEventListener('click', () => {
    Array.from(rows).forEach((row) => {
      row.classList.remove('active');
    });
    element.classList.add('active');
  });
});

// CHECK TEXT FROM FORM
const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let isValid = true;
  const errors = [];

  const inputName = form.querySelector('input[data-qa="name"]').value;
  const age = form.querySelector('input[data-qa="age"]').value;
  const position = form.querySelector('input[data-qa="position"]').value;
  const office = form.querySelector('input[data-qa="office"]').value;
  const salary = form.querySelector('input[data-qa="salary"]').value;

  if (inputName.length < 4) {
    isValid = false;
    errors.push('Your name is Invalid!');
  }

  if (age < 18 || age > 90) {
    isValid = false;
    errors.push('Your age is Invalid!');
  }

  if (!isValid) {
    alert(errors.join('\n'));
  } else {
    const newRow = document.createElement('tr');
    const cellName = document.createElement('td');

    cellName.innerHTML = inputName;
    newRow.appendChild(cellName);

    const cellPosition = document.createElement('td');

    cellPosition.innerHTML = position;
    newRow.appendChild(cellPosition);

    const cellOffice = document.createElement('td');

    cellOffice.innerHTML = office;
    newRow.appendChild(cellOffice);

    const cellAge = document.createElement('td');

    cellAge.innerHTML = age;
    newRow.appendChild(cellAge);

    const cellSalary = document.createElement('td');

    cellSalary.innerHTML = salary;
    newRow.appendChild(cellSalary);

    tbody.appendChild(newRow);

    // Переробляємо клітинки після додавання нового рядка
    Array.from(tbody.querySelectorAll('td')).forEach((cell) => {
      cell.addEventListener('dblclick', () => {
        const currentValue = cell.innerText.trim();
        const input = document.createElement('input');

        input.value = currentValue;
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();

        input.addEventListener('keydown', (el) => {
          if (el.key === 'Enter') {
            cell.innerHTML = input.value;
          }
        });

        input.addEventListener('blur', () => {
          cell.innerHTML = input.value;
        });
      });
    });
  }
});

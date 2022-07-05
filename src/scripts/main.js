'use strict';
// отримуємо таблицю

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

headers[0].setAttribute('data-type', 'text');
headers[1].setAttribute('data-type', 'text');
headers[2].setAttribute('data-type', 'text');
headers[3].setAttribute('data-type', 'age');
headers[4].setAttribute('data-type', 'salary');

// створюю пустий масив і обхожу всі заголовки

const directions = Array.from(headers).map(() => '');

const sortColumn = (index) => {
  const type = headers[index].getAttribute('data-type');
  const rows = tbody.querySelectorAll('tr');
  const direction = directions[index] || 'sortUP';
  const multiply = direction === 'sortUp' ? 1 : -1;
  const newRows = Array.from(rows);

  newRows.sort((row1, row2) => {
    const cellA = row1.querySelectorAll('td')[index].textContent;
    const cellB = row2.querySelectorAll('td')[index].textContent;

    const a = transform(type, cellA);
    const b = transform(type, cellB);

    switch (true) {
      case a < b:
        return 1 * multiply;
      case a > b:
        return -1 * multiply;
      case a === b:
        return 0;
    }
  });

  [].forEach.call(rows, (row) => {
    tbody.removeChild(row);
  });

  directions[index] = direction === 'sortUp' ? 'sortDown' : 'sortUp';

  newRows.forEach(newRow => {
    tbody.appendChild(newRow);
  });
};

// функція для конвертування
const transform = (type, content) => {
  switch (type) {
    case 'age':
      return parseFloat(content);
    case 'salary':
      return parseFloat(content.slice(1).replaceAll(',', ''));
    case 'text':
    default:
      return content.replaceAll(' ', '');
  }
};

[].forEach.call(headers, (header, index) => {
  header.addEventListener('click', () => {
    sortColumn(index);
  });
});

/* eslint-disable no-constant-condition */
'use strict';

// write code here
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');
const arr = ['Name', 'Position', 'Age', 'Salary'];

// сортувааня таблиці
document.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'TH') {
    const columnIndex = ev.target.cellIndex;
    const table = ev.target.closest('table');
    const tBody = table.querySelector('tbody');
    const rows = Array.from(tBody.rows);

    rows.sort((a, b) => {
      let cellA = a.cells[columnIndex].textContent.trim();
      let cellB = b.cells[columnIndex].textContent.trim();

      if (columnIndex === 3) {
        cellA = parseFloat(cellA.replace(/[$,]/g, ''));
        cellB = parseFloat(cellB.replace(/[$,]/g, ''));
      }

      if (isNaN(cellA) || isNaN(cellB)) {
        return cellA.localeCompare(cellB);
      } else {
        return Number(cellA) - Number(cellB);
      }
    });

    rows.forEach((row) => tBody.appendChild(row));
  }
});

// рядок статє виділеним
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  document
    .querySelectorAll('tr')
    .forEach((tr) => tr.classList.remove('active'));
  row.classList.add('active');
});

// додавання форми
const form = document.createElement('form');
const label2 = document.createElement('label');
const select = document.createElement('select');

form.classList.add('new-employee-form');
body.appendChild(form);

select.setAttribute('data-qa', 'office');
select.setAttribute('required', true);
label2.textContent = 'Office:';
label2.append(select);

arr.forEach((element) => {
  // eslint-disable-next-line no-console
  const input = document.createElement('input');
  const label = document.createElement('label');

  label.textContent = `${element}:`;
  input.setAttribute('data-qa', element.toLowerCase());
  input.setAttribute('required', true);

  if (input.dataset.qa === 'age' || input.dataset.qa === 'salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  label.append(input);
  form.append(label);
});

form.append(label2);

const labels = form.querySelectorAll('label');
const lastLabel = labels[labels.length - 1];
const secondLabel = labels[1];

form.insertBefore(lastLabel, secondLabel.nextSibling);

const arr2 = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

arr2.forEach((el) => {
  const option = document.createElement('option');

  option.textContent = el;
  option.setAttribute('value', el);

  select.appendChild(option);
});

const button = document.createElement('button');

button.textContent = 'Save to table';

form.appendChild(button);

// повідомлення
const pushNotification = (posTop, posRight, title, description, type) => {
  const element = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  element.classList.add('notification', type);

  element.style.top = `${posTop}px`;
  element.style.right = `${posRight}px`;

  h2.textContent = title;
  h2.classList.add('title');

  p.textContent = description;

  element.appendChild(h2);
  element.appendChild(p);

  body.appendChild(element);

  setTimeout(() => {
    element.style.display = 'none';
  }, 2000);
};

// відправка форми
button.addEventListener('click', (e) => {
  e.preventDefault();

  const name1 = form.querySelector('[data-qa="name"]').value.trim();
  const position1 = form.querySelector('[data-qa="position"]').value.trim();
  const office1 = select.value;
  const age1 = form.querySelector('[data-qa="age"]').value.trim();
  const salary1 = form.querySelector('[data-qa="salary"]').value.trim();

  const newRow = document.createElement('tr');

  if (!name1 || !position1 || !office1 || !age1 || !salary1) {
    pushNotification(
      290,
      10,
      'Title of Warning message',
      'Message example.\n ' + 'Please fill in all fields.',
      'warning',
    );

    return;
  }

  newRow.innerHTML = `
    <td>${name1}</td>
    <td>${position1}</td>
    <td>${office1}</td>
    <td>${age1}</td>
    <td>$${salary1}</td>
  `;

  tbody.appendChild(newRow);

  form.reset();
});

const tfoot = document.querySelector('tfoot tr');

tfoot.style.cursor = 'pointer';

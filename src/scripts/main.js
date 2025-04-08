'use strict';

const th = document.querySelector('thead');
const tbody = document.querySelector('tbody');

th.addEventListener('click', (e) => {
  sortTBody(e.target.cellIndex);
});

function sortTBody(indexCell) {
  tbody.classList.toggle('ASC');

  const sortType = tbody.classList.contains('ASC');
  const tbodyCopyContent = [...tbody.rows];

  tbodyCopyContent.sort((rowA, rowB) => {
    if (indexCell === 4) {
      const cellA = rowA.cells[indexCell].textContent.replace(/[$,]/g, '');
      const cellB = rowB.cells[indexCell].textContent.replace(/[$,]/g, '');

      return sortType ? cellA - cellB : cellB - cellA;
    } else {
      const cellA = rowA.cells[indexCell].textContent.trim();
      const cellB = rowB.cells[indexCell].textContent.trim();

      return sortType ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    }
  });

  tbody.innerHTML = '';
  tbodyCopyContent.forEach((x) => tbody.appendChild(x));
}

tbody.addEventListener('click', (e) => {
  [...tbody.children].forEach((x) => x.classList.remove('active'));

  const tr = e.target.closest('TR');

  tr.classList.add('active');
});

function addForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  ['name', 'position', 'office', 'age', 'salary'].forEach((x) => {
    const label = document.createElement('label');

    label.textContent = x.slice(0, 1).toUpperCase() + x.slice(1) + ':';

    if (x === 'office') {
      const select = document.createElement('select');

      select.name = x;
      select.dataset.qa = x;

      const cities = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];

      cities.forEach((city) => {
        const option = document.createElement('option');

        option.textContent = city;
        option.value = city;
        select.appendChild(option);
      });

      label.append(select);
    } else {
      const input = document.createElement('input');

      input.name = x;
      input.type = 'text';
      input.dataset.qa = x;
      label.append(input);
    }

    form.append(label);
  });

  const btn = document.createElement('button');

  btn.type = 'submit';
  btn.textContent = 'Save to table';
  form.append(btn);

  const body = document.querySelector('body');

  body.append(form);

  addEventListener('submit', (e) => {
    e.preventDefault();
    //   console.dir(form);
  });
}

addForm();

// const form = document.createElement('form');

// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   //   console.dir(form);
// });

'use strict';

const table = document.querySelector('table');

table.addEventListener('click', (e) => {
  if (e.target.closest('thead')) {
    const ind = e.target.cellIndex;
    const rows = [...table.tBodies[0].rows].sort((rowA, rowB) => {
      const a = rowA.cells[ind].textContent;
      const b = rowB.cells[ind].textContent;

      if (typeof a === 'string') {
        if (a.includes('$')) {
          return (
            +a.replace('$', '').replace(',', '') -
            +b.replace('$', '').replace(',', '')
          );
        }

        return a.localeCompare(b);
      }

      return a - b;
    });

    [...e.target.parentElement.children].forEach((item) => {
      if (item !== e.target) {
        delete item.dataset.sorted;
      }
    });

    if (
      e.target.dataset.sorted === undefined ||
      e.target.dataset.sorted === 'desc'
    ) {
      table.tBodies[0].replaceChildren(...rows);
      e.target.dataset.sorted = 'asc';
    } else if (e.target.dataset.sorted === 'asc') {
      table.tBodies[0].replaceChildren(...rows.reverse());
      e.target.dataset.sorted = 'desc';
    }
  }

  if (e.target.closest('tr') && e.target.closest('tBody')) {
    table.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

    e.target.closest('tr').classList.add('active');
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const label1 = document.createElement('label');
const input1 = document.createElement('input');

label1.textContent = 'Name:';

input1.setAttribute('name', 'name');
input1.setAttribute('type', 'text');
input1.setAttribute('required', '');
input1.dataset.qa = 'name';

label1.append(input1);
form.append(label1);

const label2 = document.createElement('label');
const input2 = document.createElement('input');

label2.textContent = 'Position:';

input2.setAttribute('name', 'position');
input2.setAttribute('type', 'text');
input2.setAttribute('required', '');
input2.dataset.qa = 'position';

label2.append(input2);
form.append(label2);

const label3 = document.createElement('label');
const select = document.createElement('select');

const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

select.append(
  ...options.map((value) => {
    const option = new Option(value, value);

    return option;
  }),
);
label3.textContent = 'Office:';

select.setAttribute('name', 'office');
select.setAttribute('required', '');
select.dataset.qa = 'office';
label3.append(select);
form.append(label3);

const label4 = document.createElement('label');
const input4 = document.createElement('input');

label4.textContent = 'Age:';

input4.setAttribute('name', 'age');
input4.setAttribute('type', 'number');
input4.setAttribute('required', '');
input4.dataset.qa = 'age';

label4.append(input4);
form.append(label4);

const label5 = document.createElement('label');
const input5 = document.createElement('input');

label5.textContent = 'Salary';

input5.setAttribute('type', 'number');
input5.setAttribute('name', 'salary');
input5.setAttribute('required', '');
input5.dataset.qa = 'salary';

label5.append(input5);
form.append(label5);

const submit = document.createElement('input');

submit.setAttribute('type', 'submit');
form.append(submit);

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.currentTarget);

  const row = document.createElement('tr');

  row.append(
    ...[...data].map((values) => {
      const td = document.createElement('td');

      if (values[0] === 'salary') {
        td.textContent =
          '$' + values[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        td.textContent = values[1];
      }

      return td;
    }),
  );

  table.tBodies[0].appendChild(row);

  // luke please note in your review all mistakes made in this current code.
  // I'm fully aware that this app is missing alerts.
  // Just note my current mistakes
});

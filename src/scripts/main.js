'use strict';

// Sorting:
const tableHead = document.querySelector('thead');
const allRows = [...document.querySelector('table').rows];

const sortingColumns = (e) => {
  const sortByColumn = e.target.innerText;
  const tableDataToSort = [];

  for (let i = 1; i < allRows.length - 1; i++) {
    const cells = allRows[i].cells;
    const person = {};

    person.Name = cells[0].innerText;
    person.Position = cells[1].innerText;
    person.Office = cells[2].innerText;
    person.Age = cells[3].innerText;
    person.Salary = cells[4].innerText;

    tableDataToSort.push(person);
  }

  if (e.target.dataset.clicked === 'true') {
    if (sortByColumn === 'Salary') {
      tableDataToSort.sort((a, b) => {
        const toNumberA = a.Salary.match(/\d+/g).join('');
        const toNumberB = b.Salary.match(/\d+/g).join('');

        return toNumberB - toNumberA;
      });
    } else {
      tableDataToSort.sort((a, b) =>
        b[sortByColumn].localeCompare(a[sortByColumn]));
    }
    e.target.dataset.clicked = false;
  } else {
    if (sortByColumn === 'Salary') {
      tableDataToSort.sort((a, b) => {
        const toNumberA = a.Salary.match(/\d+/g).join('');
        const toNumberB = b.Salary.match(/\d+/g).join('');

        return toNumberA - toNumberB;
      });
    } else {
      tableDataToSort.sort((a, b) =>
        a[sortByColumn].localeCompare(b[sortByColumn]));
    }
    e.target.dataset.clicked = true;
  }

  for (let i = 1; i < allRows.length - 1; i++) {
    const tableRow = allRows[i];

    tableRow.innerHTML = `
      <td>${tableDataToSort[i - 1].Name}</td>
      <td>${tableDataToSort[i - 1].Position}</td>
      <td>${tableDataToSort[i - 1].Office}</td>
      <td>${tableDataToSort[i - 1].Age}</td>
      <td>${tableDataToSort[i - 1].Salary}</td>
    `;
  }
};

tableHead.addEventListener('click', sortingColumns);

// 2 task

const tableBody = document.querySelector('tbody');

const selectRow = (e) => {
  const activatedRow = allRows.find(el => el.className === 'active');
  const pressedRow = e.target.parentElement;

  if (pressedRow.className) {
    pressedRow.className = '';

    return;
  }

  if (activatedRow) {
    activatedRow.className = '';
  }

  pressedRow.className = 'active';
};

tableBody.addEventListener('click', selectRow);

// 3 - Form
const log = console.log;
const body = document.body;
const form = document.createElement('form');

for (let i = 0; i < 5; i++) {
  const input = document.createElement('input');
  const label = document.createElement('label');

  input.name = allRows[0].cells[i].innerText.toLocaleLowerCase();
  input.dataset.qa = allRows[0].cells[i].innerText.toLocaleLowerCase();
  input.type = 'text';

  label.innerText = allRows[0].cells[i].innerText;
  label.append(input);
  form.append(label);
}

form.className = 'new-employee-form';

body.append(form);

const officeInput = document.querySelector('input[name="office"]');
const officeSelect = document.createElement('select');

const cities = ['Tokyo', 'Singapore', 'London', 'New York',
  'Edinburgh', 'San Francisco'];

for (let i = 0; i < cities.length; i++) {
  const option = document.createElement('option');

  option.text = cities[i];
  officeSelect.appendChild(option);
}

officeSelect.name = allRows[0].cells[2].innerText.toLocaleLowerCase();
officeSelect.dataset.qa = allRows[0].cells[2].innerText.toLocaleLowerCase();

officeInput.replaceWith(officeSelect);

const button = document.createElement('button');

button.innerText = 'Save to table';
form.append(button);

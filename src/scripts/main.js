'use strict';

// write code here
const body = document.querySelector('body');
const theads = [...document.querySelectorAll('thead tr th')];
const tbody = document.querySelector('tbody');
const tbodyChildren = [...document.querySelectorAll('tbody tr')];
const form = document.createElement('form');
const formElements = {
  name: 'Name',
  position: 'Position',
  office: 'Office',
  age: 'Age',
  salary: 'Salary',
};

const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const btn = document.createElement('button');
let cellIndex = null;
let row = null;

theads.forEach((thead, index) => {
  thead.addEventListener('click', (e) => {
    if (cellIndex !== e.target.cellIndex) {
      cellIndex = e.target.cellIndex;

      const sorted = tbodyChildren.sort((a, b) => {
        const valueA = a
          .querySelector(`*:nth-child(${index + 1})`)
          .textContent.split(' ')
          .join('')
          .replaceAll('$', '');
        const valueB = b
          .querySelector(`*:nth-child(${index + 1})`)
          .textContent.split(' ')
          .join('')
          .replaceAll('$', '');

        if (!isNaN(parseFloat(valueA)) && !isNaN(parseFloat(valueB))) {
          return parseFloat(valueA) - parseFloat(valueB);
        }

        return valueA.localeCompare(valueB);
      });

      tbody.innerHTML = '';
      sorted.forEach((el) => tbody.append(el));
    } else {
      const reversedColumn = tbodyChildren.reverse();

      tbody.innerHTML = '';
      reversedColumn.forEach((el) => tbody.append(el));
    }
  });
});

tbody.addEventListener('click', (e) => {
  const currentRow = e.target.parentNode;

  if (row !== currentRow) {
    currentRow.classList.add('active');
    row = currentRow;
  } else {
    currentRow.classList.remove('active');
  }

  tbodyChildren.forEach((el) => {
    if (!el.contains(e.target)) {
      el.classList.remove('active');
    }
  });
});

form.className = 'new-employee-form';
body.append(form);

for (const element in formElements) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');

  label.textContent = `${formElements[element]}:`;
  input.name = element;
  input.setAttribute('data-qa', element);

  if (element === 'office') {
    select.setAttribute('data-qa', element);

    selectOptions.forEach((optionName) => {
      const option = document.createElement('option');

      option.textContent = optionName;
      option.setAttribute('value', optionName.toLowerCase());
      select.append(option);
    });

    label.append(select);
    form.append(label);
  } else if (element === 'age' || element === 'salary') {
    input.type = 'number';

    label.append(input);
    form.append(label);
  } else {
    label.append(input);
    form.append(label);
  }
}

btn.type = 'submit';
btn.textContent = 'Save to table';
form.append(btn);

// const select = document.createElement('select');

// select.name = element;
// select.id = 'select-city';
// label.for = 'select-city';

// for (const city in cities) {
//   const option = document.createElement('option');

//   option.value = city;
//   option.textContent = cities[city];

//   select.append(option);
// }

// label.append(select);

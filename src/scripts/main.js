'use strict';

const headers = [...document.querySelectorAll('th')];
const tbody = document.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];
const rowsArray = tbody.querySelectorAll('tr');
const table = document.querySelector('table');
const form = document.createElement('form');
const button = document.createElement('button');
let index = -1;
let count = 0;
const inputs = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < headers.length; i++) {
  headers[i].addEventListener('click', () => {
    if (index !== i) {
      index = i;
      count = 0;
    }

    count++;

    rows.sort((rowA, rowB) => {
      const rowNumberA = parseFloat(rowA.cells[i].innerHTML.replace('$', ''));
      const rowNumberB = parseFloat(rowB.cells[i].innerHTML.replace('$', ''));

      if (rowNumberA && rowNumberB) {
        if (count % 2 === 0) {
          return rowNumberB - rowNumberA;
        } else {
          return rowNumberA - rowNumberB;
        }
      } else {
        if (count % 2 === 0) {
          return rowB.cells[i].innerHTML.localeCompare(rowA.cells[i].innerHTML);
        } else {
          return rowA.cells[i].innerHTML.localeCompare(rowB.cells[i].innerHTML);
        }
      }
    });

    for (const row of rows) {
      tbody.appendChild(row);
    }
  });
}

for (const row of rowsArray) {
  row.addEventListener('click', () => {
    rowsArray.forEach((r) => {
      r.classList.remove('active');
    });
    row.classList.add('active');
  });
}

form.classList.add('new-employee-form');
table.insertAdjacentElement('afterend', form);

inputs.forEach((inputName) => {
  const input = document.createElement('input');
  const label = document.createElement('label');
  const select = document.createElement('select');

  if (inputName === 'Office') {
    select.dataset.qa = inputName.toLocaleLowerCase();
    select.name = inputName.toLocaleLowerCase();

    selectOptions.forEach((opt, i) => {
      const option = document.createElement('option');

      option.value = i + 1;
      option.textContent = opt;
      select.appendChild(option);
    });
    label.innerHTML = `${inputName}:` + select.outerHTML;
    form.insertAdjacentElement('beforeend', label);
  } else {
    input.name = inputName.toLocaleLowerCase();

    if (inputName === 'Age' || inputName === 'Salary') {
      input.type = 'number';
    } else {
      input.type = 'text';
    }

    input.required = true;
    input.dataset.qa = inputName.toLocaleLowerCase();
    label.innerHTML = `${inputName}:` + input.outerHTML;
    form.insertAdjacentElement('beforeend', label);
  }
});

form.append(button);
button.textContent = 'Save to table';
button.type = 'button';

button.addEventListener('click', () => {
  const inputCollection = document.querySelectorAll('input, select');
  const row = document.createElement('tr');
  const notification = document.createElement('div');
  const title = document.createElement('p');

  notification.appendChild(title);

  notification.dataset.qa = 'notification';

  if (inputCollection[0].value.length < 4) {
    notification.classList.add('notification', 'error');
    title.textContent = 'NAME SHOULD BE LONGER THAN 4 LETTERS';
    tbody.appendChild(notification);

    return;
  }

  if (+inputCollection[3].value < 18 || +inputCollection[3].value > 90) {
    notification.classList.add('notification', 'error');
    title.textContent = 'AGE IS NOT CORRECT';
    tbody.appendChild(notification);

    return;
  }

  if (
    inputCollection[1].value.length === 0 ||
    inputCollection[4].value.length === 0
  ) {
    notification.classList.add('notification', 'error');
    title.textContent = 'INPUTS ARE EMPTY';
    tbody.appendChild(notification);

    return;
  }

  inputCollection.forEach((e) => {
    const td = document.createElement('td');

    if (e.tagName === 'SELECT') {
      td.textContent = e.options[e.selectedIndex].textContent;
    } else if (e.dataset.qa === 'salary') {
      const num = e.value.split('');
      const numNew = [];

      for (let i = num.length - 1; i >= 0; i--) {
        numNew.push(num[i]);

        if ((num.length - i) % 3 === 0 && i !== 0) {
          numNew.push(',');
        }
      }

      td.textContent = '$' + numNew.reverse().join('');
    } else {
      td.textContent = e.value;
    }

    row.appendChild(td);
  });

  notification.classList.add('notification', 'success');
  title.textContent = 'EMPLOYEE ADDED SUCCESSFULLY';
  tbody.appendChild(notification);
  tbody.appendChild(row);
});

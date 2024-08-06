'use strict';

const thead = document.querySelector('thead tr');
const headers = [...thead.querySelectorAll('th')];
const tbody = document.querySelector('tbody');
let rows = [...tbody.rows];
let sort = 'asc';
let sortBy = null;
let rowIndex = 0;

thead.addEventListener('click', (e) => {
  const newSortBy = headers.indexOf(e.target);

  if (newSortBy !== sortBy) {
    sort = 'asc';
    sortBy = newSortBy;
  } else {
    sort = sort === 'asc' ? 'desc' : 'asc';
  }

  const sortedRows = [...rows];

  sortedRows.sort((row1, row2) => {
    const cell1 = row1.cells[sortBy].textContent;
    const cell2 = row2.cells[sortBy].textContent;

    if ([0, 1, 2].includes(newSortBy)) {
      return cell1.localeCompare(cell2) * (sort === 'asc' ? 1 : -1);
    } else {
      return (
        cell1.localeCompare(cell2, undefined, { numeric: true }) *
        (sort === 'asc' ? 1 : -1)
      );
    }
  });
  tbody.innerHTML = '';
  sortedRows.forEach((row) => tbody.appendChild(row));
  rows = sortedRows;
});

rows.forEach((row) => {
  row.addEventListener('click', (e) => {
    const newRowIndex = rows.indexOf(e.currentTarget);

    if (rowIndex === newRowIndex) {
      rows[rowIndex].classList.toggle('active');
    } else {
      rows[rowIndex].classList.remove('active');
      rowIndex = newRowIndex;
      rows[rowIndex].classList.add('active');
    }
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.appendChild(form);

const labelName = document.createElement('label');

labelName.innerHTML = 'Name:';

const inputName = document.createElement('input');

inputName.type = 'text';
inputName.name = 'name';
inputName.setAttribute('data-qa', 'name');
inputName.setAttribute('required', true);
labelName.appendChild(inputName);
form.appendChild(labelName);

const labelPosition = document.createElement('label');

labelPosition.innerHTML = 'Position:';

const inputPosition = document.createElement('input');

inputPosition.type = 'text';
inputPosition.name = 'positin';
inputPosition.setAttribute('data-qa', 'position');
inputPosition.setAttribute('required', true);
labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);

const labelOffice = document.createElement('label');

labelOffice.innerHTML = 'Office:';

const inputOffice = document.createElement('select');

inputOffice.name = 'office';
inputOffice.setAttribute('data-qa', 'office');
inputOffice.setAttribute('required', true);

const list = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < list.length; i++) {
  const option = document.createElement('option');

  option.innerHTML = list[i];
  option.value = list[i];
  inputOffice.appendChild(option);
}

labelOffice.appendChild(inputOffice);
form.appendChild(labelOffice);

const labelAge = document.createElement('label');

labelAge.innerHTML = 'Age:';

const inputAge = document.createElement('input');

inputAge.type = 'number';
inputAge.name = 'age';
inputAge.setAttribute('data-qa', 'age');
inputAge.setAttribute('min', '18');
inputAge.setAttribute('max', '90');
inputAge.setAttribute('required', true);
labelAge.appendChild(inputAge);
form.appendChild(labelAge);

const labelSalary = document.createElement('label');

labelSalary.innerHTML = 'Salary:';

const inputSalary = document.createElement('input');

inputSalary.type = 'number';
inputSalary.name = 'salary';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.setAttribute('min', '0');
inputSalary.setAttribute('required', true);
labelSalary.appendChild(inputSalary);
form.appendChild(labelSalary);

const button = document.createElement('button');

button.innerHTML = 'Save to table';
button.type = 'submit';
form.appendChild(button);

const notification = document.createElement('div');

notification.classList.add('notification');
notification.setAttribute('data-qa', 'notification');
document.body.appendChild(notification);

const getCurrentNotification = (message, type) => {
  notification.innerHTML = `<span class="title">${type.toUpperCase()}</span> ${message}`;
  notification.className = `notification ${type}`;

  setTimeout(() => {
    notification.className = `notification`;
  }, 2000);
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  let validData = true;

  if (inputName.value.length < 4) {
    getCurrentNotification('Name value has less than 4 letters', 'error');
    validData = false;
  }

  if (inputAge.value < 18 || inputAge.value > 90) {
    getCurrentNotification('Age is less than 18 or more than 90', 'error');
    validData = false;
  }

  if (!inputPosition.value || !inputSalary.value) {
    getCurrentNotification('All fields are required.', 'error');
    validData = false;
  }

  if (validData) {
    const tr = document.createElement('tr');

    const correctSalary = `$${parseInt(inputSalary.value).toLocaleString('en-US')}`;

    tr.innerHTML = `<td>${inputName.value}</td><td>${inputPosition.value}</td><td>${inputOffice.value}</td><td>${inputAge.value}</td><td>${correctSalary}</td>`;
    tbody.appendChild(tr);
    getCurrentNotification('Employee added successfully!', 'success');
    form.reset();
  }
});

const td = document.querySelectorAll('tbody td');

td.forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const prevValue = cell.textContent;
    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = prevValue;
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      cell.innerHTML = input.value || prevValue;
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        cell.innerHTML = input.value || prevValue;
      }
    });
  });
});

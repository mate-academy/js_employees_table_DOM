'use strict';

// sorting
const table = document.querySelector('table');
const headers = table.tHead.querySelectorAll('th');
const tableBody = table.querySelector('tbody');

function getSalary(query) {
  return +query.slice(1).replaceAll(',', '');
}

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const headerName = header.innerText;
    const isAsc = header.dataset.order === 'asc';

    const rows = [...tableBody.querySelectorAll('tr')];

    headers.forEach((h) => {
      if (h !== header) {
        h.removeAttribute('data-order');
      }
    });

    rows.sort((a, b) => {
      const cellA = a.cells[index].innerText;
      const cellB = b.cells[index].innerText;

      switch (headerName) {
        case 'Name':
        case 'Position':
        case 'Office':
          return isAsc
            ? cellB.localeCompare(cellA)
            : cellA.localeCompare(cellB);

        case 'Age':
          return isAsc ? +cellB - cellA : +cellA - +cellB;

        case 'Salary':
          return isAsc
            ? getSalary(cellB) - getSalary(cellA)
            : getSalary(cellA) - getSalary(cellB);
      }
    });

    header.dataset.order = isAsc ? 'desc' : 'asc';

    rows.forEach((row) => tableBody.append(row));
  });

  // selecting row
  let activeRow = null;

  tableBody.addEventListener('click', (e) => {
    const clickedRow = e.target.closest('tr');

    if (!clickedRow) {
      return;
    }

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    clickedRow.classList.add('active');
    activeRow = clickedRow;
  });
});

// addingForm
const body = document.querySelector('body');
const form = document.createElement('form');

form.className = 'new-employee-form';
body.append(form);

function changeFirstLetter(string) {
  return string.slice(0, 1).toLowerCase() + string.slice(1);
}

function createInput(inputName) {
  const label = document.createElement('label');

  label.textContent = `${inputName}:`;

  const input = document.createElement('input');

  input.name = changeFirstLetter(inputName);
  input.required = true;
  input.dataset.qa = changeFirstLetter(inputName);

  switch (inputName) {
    case 'Name':
      input.type = 'text';
      input.minLength = 4;
      break;

    case 'Position':
    default:
      break;

    case 'Age':
      input.type = 'number';
      input.min = 18;
      input.max = 90;
      break;

    case 'Salary':
      input.type = 'number';
      input.min = 0;
      break;
  }

  label.append(input);

  return label;
}

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function createSelect(selectName) {
  const label = document.createElement('label');

  label.textContent = `${selectName}:`;

  const select = document.createElement('select');

  select.name = `${changeFirstLetter(selectName)}s`;
  select.required = true;
  select.dataset.qa = changeFirstLetter(selectName);

  offices.forEach((office) => {
    const option = document.createElement('option');

    option.textContent = office;
    option.value = changeFirstLetter(office);
    select.append(option);
  });
  label.append(select);

  return label;
}

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.append(createInput('Name'));
form.append(createInput('Position'));
form.append(createSelect('Office'));
form.append(createInput('Age'));
form.append(createInput('Salary'));
form.append(button);

// adding new row
function formatSalary(numb) {
  const string = numb.toString();
  let result = '';

  if (string.length <= 3) {
    return '$' + string;
  }

  let count = 0;

  for (let i = string.length - 1; i >= 0; i--) {
    count++;

    if (count % 3 === 0 && i !== 0) {
      result = ',' + string[i] + result;
    } else {
      result = string[i] + result;
    }
  }

  return '$' + result;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newRow = document.createElement('tr');

  formData.forEach((value, key) => {
    const cell = document.createElement('td');

    if (key === 'salary') {
      cell.textContent = formatSalary(value);
    } else {
      cell.textContent = value;
    }
    newRow.append(cell);
  });

  table.append(newRow);

  form.reset();

  const successMessage = document.createElement('div');

  successMessage.dataset.qa = 'notification';
  successMessage.className = 'notification success';
  successMessage.textContent = 'Employee added succesfull';

  document.body.appendChild(successMessage);

  setTimeout(() => {
    successMessage.remove();
  }, 500);
});

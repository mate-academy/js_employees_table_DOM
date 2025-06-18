'use strict';

const table = document.querySelector('table');
const headers = Array.from(table.querySelectorAll('thead th'));
const rows = Array.from(table.querySelectorAll('tr')).slice(1, -1);
const sortOrder = {};
let currentSortedColumn = null;

headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    if (currentSortedColumn !== columnIndex) {
      currentSortedColumn = columnIndex;
      sortOrder[columnIndex] = true;
    } else {
      sortOrder[columnIndex] = !sortOrder[columnIndex];
    }

    const sortedRows = [...rows].sort((rowA, rowB) => {
      const cellA = rowA.children[columnIndex].textContent.trim();
      const cellB = rowB.children[columnIndex].textContent.trim();

      const isNumericA = !isNaN(parseFloat(cellA.replace(/[^0-9.-]/g, '')));
      const isNumericB = !isNaN(parseFloat(cellB.replace(/[^0-9.-]/g, '')));

      if (isNumericA && isNumericB) {
        const valueA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
        const valueB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));

        return valueA - valueB;
      }

      return cellA.localeCompare(cellB);
    });

    if (!sortOrder[columnIndex]) {
      sortedRows.reverse();
    }

    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';
    sortedRows.forEach((row) => tbody.appendChild(row));
  });
});

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
table.after(form);

const labelName = document.createElement('label');

labelName.textContent = 'Name:';
form.appendChild(labelName);

const inputName = document.createElement('input');

inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('data-qa', 'name');
labelName.appendChild(inputName);

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position:';
form.appendChild(labelPosition);

const inputPosition = document.createElement('input');

inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('data-qa', 'position');
labelPosition.appendChild(inputPosition);

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office:';
form.appendChild(labelOffice);

const select = document.createElement('select');

select.setAttribute('name', 'office');
select.setAttribute('data-qa', 'office');
labelOffice.appendChild(select);

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((of) => {
  const option = new Option(of, of);

  select.appendChild(option);
});

const labelAge = document.createElement('label');

labelAge.textContent = 'Age:';
form.appendChild(labelAge);

const inputAge = document.createElement('input');

inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('data-qa', 'age');
labelAge.appendChild(inputAge);

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary:';
form.appendChild(labelSalary);

const inputSalary = document.createElement('input');

inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.setAttribute('data-qa', 'salary');
labelSalary.appendChild(inputSalary);

const button = document.createElement('button');

form.appendChild(button);
button.textContent = 'Save to table';
button.setAttribute('type', 'submit');

function showNotification(title, message, type) {
  const div = document.createElement('div');

  div.classList.add('notification', type);
  div.dataset.qa = 'notification';

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = message;
  div.append(h2, p);
  form.before(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const namePerson = inputName.value.trim();
  const position = inputPosition.value.trim();
  const office = select.value.trim();
  const age = +inputAge.value.trim();
  const salary = +inputSalary.value.trim();

  if (!namePerson || !position || !office || !age || !salary) {
    showNotification('Error', 'All fields are required', 'error');

    return;
  }

  if (namePerson.length < 4) {
    showNotification('Error', 'Name must have more than 4 letters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Error', 'Not valid age', 'error');

    return;
  }

  const tableBody = document.querySelector('tbody');
  const newRow = tableBody.insertRow(0);
  const nameCell = newRow.insertCell(0);
  const positionCell = newRow.insertCell(1);
  const officeCell = newRow.insertCell(2);
  const ageCell = newRow.insertCell(3);
  const salaryCell = newRow.insertCell(4);

  nameCell.textContent = namePerson;
  positionCell.textContent = position;
  officeCell.textContent = office;
  ageCell.textContent = age;
  salaryCell.textContent = `$${salary.toLocaleString('en-US')}`;

  showNotification('Success', 'Add a new employee', 'success');

  form.reset();
});

const cells = Array.from(table.querySelectorAll('td'));

cells.forEach((cell) => {
  cell.addEventListener('dblclick', (ev) => {
    const editCell = ev.currentTarget;
    const originText = editCell.textContent;

    if (cell === editCell) {
      const editInput = document.createElement('input');

      editInput.classList.add('cell-input');

      editInput.value = editCell.textContent;
      editCell.textContent = '';

      cell.appendChild(editInput);
      editInput.focus();

      const save = () => {
        const newValue =
          editInput.value.trim() === '' ? originText : editInput.value;

        cell.textContent = newValue;

        editInput.remove();
      };

      editInput.addEventListener('blur', save);

      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          editInput.blur();
        }
      });
    }
  });
});

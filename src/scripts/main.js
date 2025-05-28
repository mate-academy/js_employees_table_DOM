'use strict';

const headers = document.querySelectorAll('table thead th');
const tbody = document.querySelector('table tbody');

const sortDirection = {};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const isCurrencyOrNumber = (text) => /^\$?\d/.test(text);

    sortDirection[index] = !sortDirection[index];

    const sortedRows = rows.sort((a, b) => {
      const aText = a.children[index].textContent.trim();
      const bText = b.children[index].textContent.trim();

      const aVal = isCurrencyOrNumber(aText)
        ? parseFloat(aText.replace(/[$,]/g, ''))
        : aText.toLowerCase();

      const bVal = isCurrencyOrNumber(bText)
        ? parseFloat(bText.replace(/[$,]/g, ''))
        : bText.toLowerCase();

      if (aVal < bVal) {
        return sortDirection[index] ? -1 : 1;
      }

      if (aVal > bVal) {
        return sortDirection[index] ? 1 : -1;
      }

      return 0;
    });

    tbody.innerHTML = '';

    sortedRows.forEach((row) => {
      tbody.appendChild(row);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));

    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

const labelName = document.createElement('label');

labelName.textContent = 'Name: ';

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';

labelName.appendChild(inputName);
form.appendChild(labelName);

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position: ';

const inputPosition = document.createElement('input');

inputPosition.name = 'position';
inputPosition.type = 'text';

labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office: ';

const selectOffice = document.createElement('select');

selectOffice.name = 'office';

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.textContent = office;
  option.setAttribute('value', office.toLowerCase());
  selectOffice.appendChild(option);
});

labelOffice.appendChild(selectOffice);
form.appendChild(labelOffice);

const labelAge = document.createElement('label');

labelAge.textContent = 'Age: ';

const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.type = 'number';

labelAge.appendChild(inputAge);
form.appendChild(labelAge);

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary: ';

const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('min', 0);

labelSalary.appendChild(inputSalary);
form.appendChild(labelSalary);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');
form.appendChild(button);

document.querySelectorAll('input').forEach((input) => {
  const type = input.getAttribute('name');

  input.setAttribute('data-qa', type);
  input.setAttribute('required', 'required');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.querySelector('[name="name"]');
  const positionInput = document.querySelector('[name="position"]');
  const officeInput = document.querySelector('[name="office"]');
  const ageInput = document.querySelector('[name="age"]');
  const salaryInput = document.querySelector('[name="salary"]');

  // eslint-disable-next-line no-shadow
  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeInput.selectedOptions[0].text.trim();
  const age = parseInt(ageInput.value, 10);
  const salary =
    '$' + parseFloat(salaryInput.value).toFixed(2).replace('.', ',');

  if (name.length < 4) {
    showNotification('Error', 'Name must be at least 4 letters long.', 'error');

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    showNotification('Error', 'Age must be between 18 and 90.', 'error');

    return;
  }

  const row = document.createElement('tr');
  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  nameCell.textContent = name;
  positionCell.textContent = position;
  officeCell.textContent = office;
  ageCell.textContent = age;
  salaryCell.textContent = salary;

  row.appendChild(nameCell);
  row.appendChild(positionCell);
  row.appendChild(officeCell);
  row.appendChild(ageCell);
  row.appendChild(salaryCell);

  tbody.appendChild(row);

  showNotification('Success', 'Employee added to the table.', 'success');

  form.reset();
});

function showNotification(title, description, type) {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');

  div.classList.add(type);

  div.style.width = '300px';
  div.style.position = 'absolute';
  div.style.minHeight = '100px';
  div.style.padding = '0 16px';
  div.style.boxSizing = 'border-box';
  div.style.borderRadius = '10px';
  div.style.right = '16%';

  if (div.className === 'success') {
    div.style.background = 'rgba(10, 189, 0, 0.3)';
  } else if (div.className === 'error') {
    div.style.background = 'rgba(253, 0, 0, 0.3)';
  }

  document.body.append(div);

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  h2.style.display = 'block';
  h2.style.fontSize = '20px';
  h2.style.fontWeight = '900';
  div.append(h2);

  const p = document.createElement('p');

  p.textContent = description;
  div.append(p);

  setTimeout(() => {
    div.style.display = 'none';
  }, 3000);
}

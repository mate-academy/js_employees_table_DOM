'use strict';

function removeDollarAndComma(value) {
  let result = '';

  for (let i = 0; i < value.length; i++) {
    if (value[i] !== '$' && value[i] !== ',') {
      result += value[i];
    }
  }

  return result;
}

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');

  div.className = 'notification';
  div.setAttribute('data-qa', 'notification');
  div.classList.add(type);

  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.textContent = title;
  h2.className = 'title';
  p.textContent = description;

  div.append(h2);
  div.append(p);
  document.documentElement.append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};

const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const body = document.querySelector('body');

const table = document.querySelector('table');
const headerCells = table.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');
const bodyRows = [...tbody.rows];

// implementing sorting
headerCells.forEach((header, index) => {
  header.addEventListener('click', () => {
    const order = header.getAttribute('order');

    bodyRows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      let comparison = 0;

      // Check if the column is the salary column
      if (index === 4) {
        const salaryA = parseFloat(removeDollarAndComma(cellA));
        const salaryB = parseFloat(removeDollarAndComma(cellB));

        comparison = salaryA - salaryB;
      } else if (!isNaN(cellA) && !isNaN(cellB)) {
        comparison = cellA - cellB;
      } else {
        comparison = cellA.localeCompare(cellB);
      }

      if (order === 'asc') {
        return -comparison;
      } else {
        return comparison;
      }
    });

    // Toggle the order attribute
    headerCells.forEach((cell) => cell.removeAttribute('order'));
    header.setAttribute('order', order === 'asc' ? 'dsc' : 'asc');

    // Reattach the sorted rows
    bodyRows.forEach((row) => tbody.appendChild(row));
  });
});

// implementing row selecting
bodyRows.forEach((row) => {
  row.addEventListener('click', () => {
    if (row.classList.contains('active')) {
      bodyRows.forEach((item) => {
        item.classList.remove('active');
      });
    } else {
      bodyRows.forEach((item) => {
        item.classList.remove('active');
      });
      row.classList.add('active');
    }
  });
});

// implementing form adding
const form = document.createElement('form');

form.classList.add('new-employee-form');

// Create a label elements
const labelName = document.createElement('label');

labelName.textContent = 'Name: ';

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position: ';

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office: ';

const labelAge = document.createElement('label');

labelAge.textContent = 'Age: ';

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary: ';

// create inputs
const inputName = document.createElement('input');

inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('data-qa', 'name');

const inputPosition = document.createElement('input');

inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('data-qa', 'position');

const select = document.createElement('select');

select.setAttribute('data-qa', 'office');

selectOptions.forEach((optionName) => {
  const option = document.createElement('option');

  option.textContent = optionName;
  option.setAttribute('value', optionName.toLowerCase());
  select.appendChild(option);
});

const inputAge = document.createElement('input');

inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('data-qa', 'age');

const inputSalary = document.createElement('input');

inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.setAttribute('data-qa', 'salary');

// Append the input to the label
labelName.appendChild(inputName);
labelPosition.appendChild(inputPosition);
labelOffice.appendChild(select);
labelAge.appendChild(inputAge);
labelSalary.appendChild(inputSalary);

// create button
const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

// Append the label to the form
form.appendChild(labelName);
form.appendChild(labelPosition);
form.appendChild(labelOffice);
form.appendChild(labelAge);
form.appendChild(labelSalary);
form.appendChild(button);

body.append(form);

// Add submit event listener to the form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (inputName.value.length < 4 || inputPosition.value.length < 4) {
    pushNotification(
      'Oooops',
      'Name is too short. Should have at least 4 characters',
      'error',
    );
  } else if (inputAge.value < 18 || inputAge.value > 80) {
    pushNotification('Oooops', 'Your age is not permitted', 'error');
  } else {
    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');

    nameCell.textContent = inputName.value;

    const positionCell = document.createElement('td');

    positionCell.textContent = inputPosition.value;

    const officeCell = document.createElement('td');

    officeCell.textContent = select.options[select.selectedIndex].text;

    const ageCell = document.createElement('td');

    ageCell.textContent = inputAge.value;

    const salaryCell = document.createElement('td');
    const formattedSalary = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(inputSalary.value);

    salaryCell.textContent = formattedSalary;

    newRow.appendChild(nameCell);
    newRow.appendChild(positionCell);
    newRow.appendChild(officeCell);
    newRow.appendChild(ageCell);
    newRow.appendChild(salaryCell);

    tbody.appendChild(newRow);

    // Clear the form inputs
    inputName.value = '';
    inputPosition.value = '';
    select.selectedIndex = 0;
    inputAge.value = '';
    inputSalary.value = '';

    pushNotification('Bravo!', 'Employee successfully added', 'success');
  }
});

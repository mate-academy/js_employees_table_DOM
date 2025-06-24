'use strict';

const table = document.body.querySelector('table');
const headers = table.querySelectorAll('th');

headers[0].setAttribute('data-qa', 'sort-name');
headers[3].setAttribute('data-qa', 'sort-age');
headers[4].setAttribute('data-qa', 'sort-salary');

const container = document.createElement('div');

container.setAttribute('data-qa', 'notification-container');
document.body.appendChild(container);

function showNotification(type, title, message) {
  const notification = document.createElement('div');

  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');

  const heading = document.createElement('h4');

  heading.textContent = title;

  const description = document.createElement('p');

  description.textContent = message;

  notification.appendChild(heading);
  notification.appendChild(description);

  container.appendChild(notification);

  setTimeout(() => {
    container.removeChild(notification);
  }, 5000);
}

headers.forEach((th) => {
  th.addEventListener('click', (e) => {
    const index = e.target.cellIndex;
    const order = e.target.dataset.order;

    let newOrder;

    if (order === 'asc') {
      newOrder = 'desc';
    } else {
      newOrder = 'asc';
    }

    headers.forEach((header) => {
      header.dataset.order = '';
    });

    e.target.dataset.order = newOrder;

    const tbody = document.body.querySelector('tbody');
    const tr = tbody.querySelectorAll('tr');
    const rowsArray = [...tr];

    rowsArray.sort((a, b) => {
      const cellA = a.cells[index].textContent.trim();
      const cellB = b.cells[index].textContent.trim();

      const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === 'asc' ? numA - numB : numB - numA;
      } else {
        return newOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    tbody.innerHTML = '';
    rowsArray.forEach((row) => tbody.appendChild(row));
  });
});

const rows = table.querySelectorAll('tbody tr');

rows.forEach((row) => {
  row.addEventListener('click', (e) => {
    rows.forEach((r) => r.classList.remove('active'));
    e.currentTarget.classList.add('active');
  });
});

enableCellEditing();

const form = document.createElement('form');
const label = document.createElement('label');
const input = document.createElement('input');

form.classList.add('new-employee-form');

label.appendChild(document.createTextNode('Name: '));

input.name = 'name';
input.type = 'text';
input.setAttribute('data-qa', 'name');
label.appendChild(input);
form.appendChild(label);

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

labelPosition.appendChild(document.createTextNode('Position: '));
inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');
labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);

const labelOffice = document.createElement('label');
const select = document.createElement('select');
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

  option.value = office;
  option.textContent = office;
  select.appendChild(option);
});

labelOffice.appendChild(document.createTextNode('Office: '));
select.name = 'office';
select.setAttribute('data-qa', 'office');
labelOffice.appendChild(select);
form.appendChild(labelOffice);

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

labelAge.appendChild(document.createTextNode('Age: '));
inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');
labelAge.appendChild(inputAge);
form.appendChild(labelAge);

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

labelSalary.appendChild(document.createTextNode('Salary: '));
inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
labelSalary.appendChild(inputSalary);
form.appendChild(labelSalary);

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);

document.body.insertBefore(form, table);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const age = form.elements.age.value.trim();
  const salary = form.elements.salary.value.trim();

  if (!formName || !position || !office || !age || !salary) {
    showNotification('error', 'Error!', 'Please fill in all fields.');

    return;
  }

  if (formName.length < 4) {
    showNotification('error', 'Error!', 'Name must be at least 4 characters.');

    return;
  }

  const ageNumber = Number(age);
  const salaryNumber = Number(salary);

  if (ageNumber < 18 || ageNumber > 90) {
    showNotification('error', 'Error!', 'Age must be between 18 and 90.');

    return;
  }

  const tbody = document.querySelector('tbody');
  const newRow = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.textContent = formName;
  newRow.appendChild(nameCell);

  const positionCell = document.createElement('td');

  positionCell.textContent = position;
  newRow.appendChild(positionCell);

  const officeCell = document.createElement('td');

  officeCell.textContent = office;
  newRow.appendChild(officeCell);

  const ageCell = document.createElement('td');

  ageCell.textContent = ageNumber;
  newRow.appendChild(ageCell);

  const salaryCell = document.createElement('td');

  salaryCell.textContent = '$' + salaryNumber.toLocaleString();
  newRow.appendChild(salaryCell);

  tbody.appendChild(newRow);

  newRow.addEventListener('click', (ev) => {
    const tr = tbody.querySelectorAll('tr');

    tr.forEach((r) => r.classList.remove('active'));
    ev.currentTarget.classList.add('active');
  });

  enableCellEditing();

  showNotification('success', 'Success!', 'Employee added successfully.');

  form.reset();
});

function enableCellEditing() {
  const cells = table.querySelectorAll('tbody td');

  cells.forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      const originalValue = cell.textContent;

      cell.textContent = '';

      const inputCell = document.createElement('input');

      inputCell.classList.add('cell-input');
      inputCell.value = originalValue;

      cell.appendChild(inputCell);
      inputCell.focus();

      function saveValue() {
        const newValue = inputCell.value.trim();

        if (newValue) {
          cell.textContent = newValue;
        } else {
          cell.textContent = originalValue;
        }
      }

      inputCell.addEventListener('blur', saveValue);

      inputCell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveValue();
        }
      });
    });
  });
}

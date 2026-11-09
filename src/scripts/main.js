'use strict';

const headers = document.querySelectorAll('thead th');

let previousIndex = null;
let sortDirection = 'asc';

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (previousIndex === index) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection = 'asc';
    }

    previousIndex = index;

    const rows = Array.from(document.querySelectorAll('tbody tr'));
    const sortedRows = [...rows];

    sortedRows.sort((rowA, rowB) => {
      const aText = rowA.children[index].textContent;
      const bText = rowB.children[index].textContent;

      let comparison;

      if (index === 3 || index === 4) {
        const aNumber = Number(aText.replace('$', '').replace(',', ''));
        const bNumber = Number(bText.replace('$', '').replace(',', ''));

        comparison = aNumber - bNumber;
      } else {
        comparison = aText.localeCompare(bText);
      }

      if (sortDirection === 'asc') {
        return comparison;
      } else {
        return comparison * -1;
      }
    });

    const tbody = document.querySelector('tbody');

    tbody.append(...sortedRows);
  });
});

const tableBody = document.querySelector('tbody');

tableBody.addEventListener('click', (clickEvent) => {
  const tableRow = clickEvent.target.closest('tr');

  if (!tableRow) {
    return;
  }

  tableBody.querySelectorAll('tr').forEach((row) => {
    row.classList.remove('active');
  });

  tableRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.noValidate = true;

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.setAttribute('data-qa', 'name');
nameInput.type = 'text';
nameInput.required = true;

nameLabel.textContent = 'Name: ';
nameLabel.append(nameInput);

form.append(nameLabel);

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.setAttribute('data-qa', 'position');
positionInput.type = 'text';
positionInput.required = true;

positionLabel.textContent = 'Position: ';
positionLabel.append(positionInput);

form.append(positionLabel);

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.setAttribute('data-qa', 'age');
ageInput.type = 'number';
ageInput.required = true;

ageLabel.textContent = 'Age: ';
ageLabel.append(ageInput);

form.append(ageLabel);

const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');
officeSelect.required = true;

officeLabel.textContent = 'Office: ';
officeLabel.append(officeSelect);

form.append(officeLabel);

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.type = 'number';
salaryInput.required = true;

salaryLabel.textContent = 'Salary: ';
salaryLabel.append(salaryInput);

form.append(salaryLabel);

const tokyoOption = document.createElement('option');

tokyoOption.textContent = 'Tokyo';
tokyoOption.value = 'Tokyo';

officeSelect.append(tokyoOption);

const singaporeOption = document.createElement('option');

singaporeOption.textContent = 'Singapore';
singaporeOption.value = 'Singapore';

officeSelect.append(singaporeOption);

const londonOption = document.createElement('option');

londonOption.textContent = 'London';
londonOption.value = 'London';

officeSelect.append(londonOption);

const newYorkOption = document.createElement('option');

newYorkOption.textContent = 'New York';
newYorkOption.value = 'New York';

officeSelect.append(newYorkOption);

const edinburghOption = document.createElement('option');

edinburghOption.textContent = 'Edinburgh';
edinburghOption.value = 'Edinburgh';

officeSelect.append(edinburghOption);

const sanFranciscoOption = document.createElement('option');

sanFranciscoOption.textContent = 'San Francisco';
sanFranciscoOption.value = 'San Francisco';

officeSelect.append(sanFranciscoOption);

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';

form.append(submitButton);

document.body.append(form);

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;

  document.body.append(notification);
}

form.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();

  const formData = new FormData(form);

  const employeeName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');

  if (employeeName.trim().length < 4) {
    showNotification('error', 'Name must be at least 4 characters long.');

    return;
  }

  if (position.trim().length === 0) {
    showNotification('error', 'Position is required.');

    return;
  }

  if (Number(age) < 18 || Number(age) > 90) {
    showNotification('error', 'Age must be between 18 and 90.');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${Number(salary).toLocaleString('en-US')}</td>
  `;

  document.querySelector('tbody').append(newRow);

  showNotification('success', 'New employee added successfully.');

  form.reset();
});

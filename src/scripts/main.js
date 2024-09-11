'use strict';

// write code here

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tableBody = document.querySelector('tbody');
const rows = tableBody.querySelectorAll('tr');

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortColumn(index);
  });
});

const transform = function (index, content) {
  const type = headers[index].textContent.toLowerCase().trim();

  switch (type) {
    case 'salary':
      return +content.replace(/[\D]+/g, '');
    case 'string':
    default:
      return content;
  }
};
const directions = Array.from(headers).map(function (header) {
  return '';
});

const sortColumn = function (index) {
  const newRows = Array.from(rows);
  const direction = directions[index] || 'asc';
  const multiplier = direction === 'asc' ? 1 : -1;

  newRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index].innerHTML;
    const cellB = rowB.querySelectorAll('td')[index].innerHTML;
    const a = transform(index, cellA);
    const b = transform(index, cellB);

    switch (true) {
      case a > b:
        return 1 * multiplier;
      case a < b:
        return -1 * multiplier;
      case a === b:
        return 0;
    }
  });

  directions[index] = direction === 'asc' ? 'desc' : 'asc';

  rows.forEach((row) => {
    tableBody.removeChild(row);
  });

  newRows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
};

tableBody.addEventListener('click', (e) => {
  const aciveRow = e.target.closest('tr');

  if (aciveRow) {
    rows.forEach((row) => {
      row.classList.remove('active');
    });

    aciveRow.classList.add('active');
  }
});

const form = document.createElement('form');
const button = document.createElement('button');
const datatAtribute = ['name', 'position', 'office', 'age', 'salary'];
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function capitalazeFirstLetter(str) {
  if (str.length === '') {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1) + ':';
}

function addInputsField() {
  datatAtribute.forEach((atribute) => {
    const input = document.createElement('input');
    const label = document.createElement('label');
    const select = document.createElement('select');

    switch (atribute) {
      case 'name':
      case 'position':
        input.type = 'text';
        input.name = atribute;
        input.dataset.qa = atribute;

        label.htmlFor = input.id;
        label.textContent = capitalazeFirstLetter(atribute);

        form.appendChild(label);
        label.appendChild(input);
        break;

      case 'office':
        select.name = atribute;
        select.required = true;
        select.dataset.qa = atribute;

        cities.forEach((city) => {
          const option = document.createElement('option');

          option.value = city;
          option.textContent = city;
          select.appendChild(option);
        });

        label.textContent = capitalazeFirstLetter(atribute);
        form.appendChild(label);
        label.appendChild(select);
        break;

      case 'age':
      case 'salary':
        input.type = 'number';
        input.name = atribute;
        input.dataset.qa = atribute;

        label.htmlFor = input.id;
        label.textContent = capitalazeFirstLetter(atribute);

        form.appendChild(label);
        label.appendChild(input);
        break;
    }
  });
}

function showNotification(text, type) {
  const notification = document.createElement('div');
  const notificationMessage = document.createElement('span');

  notification.setAttribute('class', 'notification');
  notification.setAttribute('data-qa', 'notification');
  notificationMessage.setAttribute('class', 'title');
  notificationMessage.textContent = text;

  notification.style.display = 'flex';
  notification.style.justifyContent = 'center';
  notification.style.alignItems = 'center';
  notification.style.textAlign = 'center';

  if (type === 'error') {
    notification.classList.add('error');
  } else {
    notification.classList.add('success');
  }

  notification.append(notificationMessage);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 5000);
}

const handleAddEployee = (action) => {
  action.preventDefault();

  const nameFieldInput = form.querySelector('input[name="name"]');
  const positionFieldInput = form.querySelector('input[name="position"]');
  const officeSelectField = form.querySelector('select[name="office"]');
  const ageFieldInput = form.querySelector('input[name="age"]');
  const salaryFieldInput = form.querySelector('input[name="salary"]');

  const warningMessasge = [];

  if (nameFieldInput.value.trim().length < 4) {
    warningMessasge.push('Name should be at least 4 symbols length.');
  }

  if (typeof nameFieldInput.value === 'number') {
    warningMessasge.push('Name is incorrect must contain alphabets only');
  }

  if (!positionFieldInput.value) {
    warningMessasge.push('Position field should be filled.');
  }

  if (positionFieldInput.value.trim() === '' && positionFieldInput.value) {
    warningMessasge.push('Position field should not contain only spaces.');
  }

  if (+ageFieldInput.value < 18 || +ageFieldInput.value > 90) {
    warningMessasge.push('Age should be between 18 and 90 y.o.');
  }

  if (!salaryFieldInput.value) {
    warningMessasge.push('Salary field should be filled.');
  }

  if (+salaryFieldInput.value < 0) {
    warningMessasge.push('Salary field should be a positive number');
  }

  if (+salaryFieldInput.value === 0) {
    warningMessasge.push('Salary should be bigger then zero');
  }

  if (warningMessasge.length > 0) {
    return showNotification(warningMessasge.join('\n'), 'error');
  }

  const newRow = document.createElement('tr');
  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  nameCell.textContent = nameFieldInput.value;
  positionCell.textContent = positionFieldInput.value;
  officeCell.textContent = officeSelectField.value;
  ageCell.textContent = ageFieldInput.value;
  salaryCell.textContent = `$${(+salaryFieldInput.value).toLocaleString('en-US')}`;

  newRow.append(nameCell, positionCell, officeCell, ageCell, salaryCell);
  tableBody.append(newRow);

  form.reset();

  return showNotification('Employee successfully added.', 'success');
};

addInputsField();
button.type = 'submit';
button.textContent = 'Save to table';
form.classList.add('new-employee-form');
form.appendChild(button);
document.body.appendChild(form);
button.addEventListener('click', handleAddEployee);

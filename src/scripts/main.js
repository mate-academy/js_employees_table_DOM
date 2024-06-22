'use strict';

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const tableHeaders = document.querySelectorAll('thead tr th');
const sortOrders = {};
const tableBody = document.querySelector('tbody');
const tableRows = Array.from(tableBody.querySelectorAll('tr'));

const sortField = (header, sortIndex) => {
  let sortOrder = sortOrders[sortIndex] || 'desc';

  if (header !== sortOrders.lastHeaderClicked) {
    sortOrder = 'asc';
  } else {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  }

  sortOrders[sortIndex] = sortOrder;
  sortOrders.lastHeaderClicked = header;

  header.setAttribute('data-sort', sortOrder);

  const isNumeric = tableRows.every((row) => {
    const cellText = row.children[sortIndex].innerText;

    return (
      !isNaN(parseFloat(cellText.replace(/[^0-9.-]+/g, ''))) &&
      isFinite(parseFloat(cellText.replace(/[^0-9.-]+/g, '')))
    );
  });

  tableRows.sort((a, b) => {
    let cellA = a.children[sortIndex].innerText;
    let cellB = b.children[sortIndex].innerText;

    if (isNumeric) {
      cellA = parseNumber(cellA);
      cellB = parseNumber(cellB);
    } else {
      cellA = cellA.toLowerCase();
      cellB = cellB.toLowerCase();
    }

    switch (sortOrder) {
      case 'asc':
        return isNumeric ? cellA - cellB : cellA.localeCompare(cellB);
      case 'desc':
        return isNumeric ? cellB - cellA : cellB.localeCompare(cellA);
      default:
        return 0;
    }
  });

  tableRows.forEach((row) => tableBody.appendChild(row));
};

const parseNumber = (number) => {
  return parseFloat(number.replace(/[$,]+/g, ''));
};

tableHeaders.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortField(header, index);
  });
});

tableRows.forEach((row) => {
  row.addEventListener('click', () => {
    tableRows.forEach((r) => {
      r.classList.remove('active');
    });

    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const createInput = (type, data, labelText) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.required = true;
  input.type = type;
  input.name = data;
  input.setAttribute('data-qa', data);
  label.textContent = labelText + ': ';

  label.appendChild(input);
  form.appendChild(label);
};

createInput('text', 'name', 'Name');
createInput('text', 'position', 'Position');

const selectElement = document.createElement('select');

selectElement.name = 'office';
selectElement.setAttribute('data-qa', 'office');

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office.toLowerCase();
  option.textContent = office;

  selectElement.appendChild(option);
});

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office: ';
selectLabel.appendChild(selectElement);

form.appendChild(selectLabel);

createInput('number', 'age', 'Age');
createInput('number', 'salary', 'Salary');

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.appendChild(submitButton);
document.querySelector('body').appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.querySelector('input[name="name"]');
  const ageInput = document.querySelector('input[name="age"]');

  const newRow = document.createElement('tr');

  const displayNotification = (text, type) => {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = text;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  if (nameInput.value.length < 4) {
    displayNotification('Name must be at least 4 letters long!', 'error');
  } else if (ageInput.value < 18 || ageInput.value > 90) {
    displayNotification('Your age dont suit our requirements', 'error');
  } else {
    displayNotification('New employee added successfully!', 'success');
  }

  const nameCell = document.createElement('td');

  nameCell.textContent = nameInput.value;
  newRow.appendChild(nameCell);

  const positionInput = document.querySelector('input[name="position"]');
  const positionCell = document.createElement('td');

  positionCell.textContent = positionInput.value;
  newRow.appendChild(positionCell);

  const officeInput = document.querySelector('select[name="office"]');
  const officeCell = document.createElement('td');

  officeCell.textContent = officeInput.value;
  newRow.appendChild(officeCell);

  const ageCell = document.createElement('td');

  ageCell.textContent = ageInput.value;
  newRow.appendChild(ageCell);

  const salaryInput = document.querySelector('input[name="salary"]');
  const salaryCell = document.createElement('td');

  salaryCell.textContent = salaryInput.value;
  newRow.appendChild(salaryCell);

  tableBody.appendChild(newRow);

  form.reset();
});

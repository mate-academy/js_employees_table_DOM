'use strict';

const headers = document.querySelectorAll('thead');
const tableBody = document.querySelector('tbody');

// sorting table by cliced header
let lastClickedHeader = -1;

for (const header of headers) {
  header.addEventListener('click', (e) => {
    const rowsArr = Array.from(tableBody.children);

    if (e.target.cellIndex !== lastClickedHeader) {
      if (rowsArr[0].cells[e.target.cellIndex].textContent[0] === '$') {
        rowsArr.sort((el, el2) =>
          parseFloat(el.cells[e.target.cellIndex]
            .textContent.substring(1).replace(',', '.'),
          )
          - parseFloat(el2.cells[e.target.cellIndex]
            .textContent.substring(1).replace(',', '.'),
          ));
      } else {
        rowsArr.sort((el, el2) => el.cells[e.target.cellIndex].textContent
          .localeCompare(el2.cells[e.target.cellIndex].textContent));
      }
      lastClickedHeader = e.target.cellIndex;
    } else {
      if (rowsArr[0].cells[e.target.cellIndex].textContent[0] === '$') {
        rowsArr.sort((el, el2) =>
          parseFloat(el2.cells[e.target.cellIndex]
            .textContent.substring(1).replace(',', '.'),
          )
          - parseFloat(el.cells[e.target.cellIndex]
            .textContent.substring(1).replace(',', '.'),
          ));
      } else {
        rowsArr.sort((el, el2) => el2.cells[e.target.cellIndex].textContent
          .localeCompare(el.cells[e.target.cellIndex].textContent));
      }
      lastClickedHeader = -1;
    }

    rowsArr.forEach((row) => tableBody.appendChild(row));
  });
}

// adding to selecten rov class active
let prevRow = '';

tableBody.addEventListener('click', (e) => {
  if (prevRow) {
    prevRow.classList.remove('active');
  }

  const row = e.target.closest('tr');

  row.className = 'active';
  prevRow = row;
});

// adding form to page
const form = document.createElement('form');

form.className = 'new-employee-form';

const nameeLabel = document.createElement('label');
const positionLabel = document.createElement('label');
const officeLabel = document.createElement('label');
const ageLabel = document.createElement('label');
const salaryLabel = document.createElement('label');

nameeLabel.textContent = 'Name:';
positionLabel.textContent = 'Position:';
officeLabel.textContent = 'Office:';
ageLabel.textContent = 'Age:';
salaryLabel.textContent = 'Salary:';

const namee = document.createElement('input');
const position = document.createElement('input');
const office = document.createElement('select');
const age = document.createElement('input');
const salary = document.createElement('input');

namee.required = true;
position.required = true;
office.required = true;
age.required = true;
salary.required = true;

age.type = 'number';
salary.type = 'number';

namee.setAttribute('data-qa', 'name');
position.setAttribute('data-qa', 'position');
office.setAttribute('data-qa', 'office');
age.setAttribute('data-qa', 'age');
salary.setAttribute('data-qa', 'salary');

nameeLabel.appendChild(namee);
positionLabel.appendChild(position);
officeLabel.appendChild(office);
ageLabel.appendChild(age);
salaryLabel.appendChild(salary);

const option1 = document.createElement('option');
const option2 = document.createElement('option');
const option3 = document.createElement('option');
const option4 = document.createElement('option');
const option5 = document.createElement('option');
const option6 = document.createElement('option');

option1.value = 'Tokyo';
option1.text = 'Tokyo';
option2.value = 'Singapore';
option2.text = 'Singapore';
option3.value = 'London';
option3.text = 'London';
option4.value = 'New York';
option4.text = 'New York';
option5.value = 'Edinburgh';
option5.text = 'Edinburgh';
option6.value = 'San Francisco';
option6.text = 'San Francisco';

office.appendChild(option1);
office.appendChild(option2);
office.appendChild(option3);
office.appendChild(option4);
office.appendChild(option5);
office.appendChild(option6);

const button = document.createElement('button');

button.textContent = 'Save to table';

form.appendChild(nameeLabel);
form.appendChild(positionLabel);
form.appendChild(officeLabel);
form.appendChild(ageLabel);
form.appendChild(salaryLabel);
form.appendChild(button);

// adding data from form to table and cleaning form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newName = namee.value;
  const newPosition = position.value;
  const newOffice = office.value;
  const newAge = age.value;
  const newSalary = salary.value;

  if (newName.trim().length > 1 && newPosition.trim().length > 1) {
    pushNotification(10, 10, 'Error',
      'Name or Position can not be only spaces', 'error');

    return null;
  } else if (newName.length < 4) {
    pushNotification(10, 10, 'Error',
      'Name can not have less than 4 letters', 'error');

    return null;
  } else if (newAge < 18 || newAge > 90) {
    pushNotification(10, 10, 'Error',
      'Age should be value from range 18 to 90', 'error');

    return null;
  }

  const newRow = tableBody.insertRow();

  const cel0 = newRow.insertCell(0);
  const cel1 = newRow.insertCell(1);
  const cel2 = newRow.insertCell(2);
  const cel3 = newRow.insertCell(3);
  const cel4 = newRow.insertCell(4);

  cel0.textContent = newName;
  cel1.textContent = newPosition;
  cel2.textContent = newOffice;
  cel3.textContent = newAge;
  cel4.textContent = '$' + newSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  pushNotification(10, 10, 'Success',
    'Successfully added new employe to table', 'success');

  form.reset();
});

document.body.appendChild(form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.style.marginRight = posRight + 'px';
  message.style.marginTop = posTop + 'px';

  switch (type) {
    case 'success':
      message.className = 'notification success';
      break;

    case 'error':
      message.className = 'notification error';
      break;

    case 'warning' :
      message.className = 'notification warning';
      break;
  }

  const titleMessage = document.createElement('h2');

  titleMessage.className = 'title';
  titleMessage.innerText = title;

  const descriptionMessage = document.createElement('p');

  descriptionMessage.innerText = description;

  message.appendChild(titleMessage);
  message.appendChild(descriptionMessage);
  message.setAttribute('data-qa', 'notification');
  document.body.appendChild(message);

  setTimeout(() => (message.remove()), 2000);
};

// editing cell of table
let currentlyEditingCell = null;
let originalValue = null;

tableBody.addEventListener('dblclick', function(e) {
  const clickedCell = e.target.closest('td');

  endCellEditing();

  const input = document.createElement('input');

  input.className = 'cell-input';

  originalValue = clickedCell.textContent;

  clickedCell.innerHTML = '';
  clickedCell.appendChild(input);
  input.value = originalValue;

  currentlyEditingCell = clickedCell;

  input.focus();

  input.addEventListener('keydown', function(enter) {
    if (enter.key === 'Enter') {
      saveCellValue(input, clickedCell);
    }
  });

  input.addEventListener('blur', function() {
    saveCellValue(input, clickedCell);
  });
});

function saveCellValue(input, cell) {
  const newValue = input.value.trim();

  if (newValue === '') {
    cell.textContent = originalValue;
  } else {
    cell.textContent = newValue;
  }
  endCellEditing();
}

function endCellEditing() {
  if (currentlyEditingCell) {
    const input = currentlyEditingCell.querySelector('input');

    if (input) {
      input.remove();
    }
    currentlyEditingCell = null;
    originalValue = null;
  }
}

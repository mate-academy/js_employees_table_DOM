'use strict';

// const body = document.querySelector('body');
const tHead = document.querySelector('thead');
const headers = [...tHead.children];
const tBody = document.querySelector('tbody');
const rows = [...tBody.children];

let sortOrder = -1; // 1 for ascending, -1 for descending

function stringToNumber(str) {
  // Replace non-numeric characters (except `.` and `-`) and convert to number
  const numericString = str.replace(/[^0-9.-]+/g, '');
  const numericValue = Number(numericString);

  // Return valid numbers or NaN
  return isNaN(numericValue) ? NaN : numericValue;
}

headers.forEach((header) => {
  header.addEventListener('click', sortHandler);
});

function sortHandler(e) {
  const columnIndex = e.target.cellIndex;

  sortOrder = sortOrder * -1;

  rows
    .sort((a, b) => {
      const cellA = a.children[columnIndex].textContent.trim();
      const cellB = b.children[columnIndex].textContent.trim();
      const textA = cellA.toLowerCase();
      const textB = cellB.toLowerCase();

      if (columnIndex === 3 || columnIndex === 4) {
        return (stringToNumber(cellA) - stringToNumber(cellB)) * sortOrder;
      } else {
        return textA.localeCompare(textB) * sortOrder;
      }
    })
    .forEach((row) => {
      tBody.appendChild(row);
    });
}

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((item) => item.classList.remove('active'));
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');

labelName.textContent = 'Name:';
labelPosition.textContent = 'Position:';
labelOffice.textContent = 'Office:';
labelAge.textContent = 'Age:';
labelSalary.textContent = 'Salary:';

const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');

inputName.setAttribute('type', 'text');
inputPosition.setAttribute('type', 'text');
inputAge.setAttribute('type', 'number');
inputSalary.setAttribute('type', 'number');

inputName.setAttribute('data-qa', 'name');
inputPosition.setAttribute('data-qa', 'position');
inputAge.setAttribute('data-qa', 'age');
inputSalary.setAttribute('data-qa', 'salary');

labelName.appendChild(inputName);
labelPosition.appendChild(inputPosition);
labelAge.appendChild(inputAge);
labelSalary.appendChild(inputSalary);

const arrayInputs = [labelName, labelPosition, labelAge, labelSalary];

arrayInputs.forEach((input) => {
  if (input) {
    input.required = true;
  }
});

const selectOffice = document.createElement('select');

selectOffice.setAttribute('data-qa', 'office');
selectOffice.required = true;

const option1 = document.createElement('option');
const option2 = document.createElement('option');
const option3 = document.createElement('option');
const option4 = document.createElement('option');
const option5 = document.createElement('option');
const option6 = document.createElement('option');

option1.textContent = 'Tokyo';
option2.textContent = 'Singapore';
option3.textContent = 'London';
option4.textContent = 'New York';
option5.textContent = 'Edinburgh';
option6.textContent = 'San Francisco';

selectOffice.appendChild(option1);
selectOffice.appendChild(option2);
selectOffice.appendChild(option3);
selectOffice.appendChild(option4);
selectOffice.appendChild(option5);
selectOffice.appendChild(option6);

labelOffice.appendChild(selectOffice);

const button = document.createElement('button');

button.textContent = 'Save to table';
form.appendChild(labelName);
form.appendChild(labelPosition);
form.appendChild(labelOffice);
form.appendChild(labelAge);
form.appendChild(labelSalary);
form.appendChild(button);

document.body.appendChild(form);

const notification = document.createElement('div');

notification.setAttribute('data-qa', 'notification');
form.appendChild(notification);

const showNotification = (message, type) => {
  notification.textContent = message;
  notification.className = type;
};

button.addEventListener('click', (e) => {
  e.preventDefault(); // Prevents the form from submitting

  const namePerson = inputName.value;
  const position = inputPosition.value;
  const office = selectOffice.value;
  const age = inputAge.value;
  const salary = inputSalary.value;

  if (!namePerson || !position || !office || !age || !salary) {
    showNotification('Please fill all fields', 'error');

    return;
  }

  if (namePerson.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  if (salary <= 0) {
    showNotification('Salary must be a positive number.', 'error');

    return;
  }

  const newEmployee = document.createElement('tr');

  [namePerson, position, office, age, salary].forEach((item) => {
    const cell = document.createElement('td');

    cell.textContent = item;

    newEmployee.appendChild(cell);
  });

  tBody.appendChild(newEmployee);
  showNotification('New employee added successfully!', 'success');
  form.reset();
});

const arrayCell = tBody.querySelectorAll('td');

arrayCell.forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const currentText = cell.textContent;

    cell.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.value = currentText;
    input.classList.add('cell-input');

    cell.appendChild(input);

    input.focus();

    // Event listener for the "Enter" key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const newText = input.value.trim();

        // Remove the input field and set the new text in the table cell
        cell.textContent = newText || currentText;
      }
    });

    input.addEventListener('blur', () => {
      const newText = input.value.trim();

      cell.textContent = newText || currentText;
    });
  });
});

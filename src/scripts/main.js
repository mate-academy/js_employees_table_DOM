'use strict';

const table = document.querySelector('table');
const tableBody = table.tBodies[0];
const rows = [...tableBody.rows];
const tHeadCells = document.querySelectorAll('thead th');

const form = document.createElement('form');
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

form.innerHTML = `
	<label>Name: <input name="name" type="text" minlength="4" required data-qa="name"></label>

	<label>Position: <input name="position" type="text" required data-qa="position"></label>

	<label>
	Office: 
	<select name="office" data-qa="office" required>
		${cities.map((city) => `<option value="${city}">${city}</option>`).join('')}
	</select>
	</label>

	<label>Age: <input name="age" type="number" min="18" max="90" required data-qa="age"></label>

	<label>Salary: <input name="salary" type="number" required data-qa="salary"></label>

	<button type="submit">Save to table</button>`;

form.classList.add('new-employee-form');
form.setAttribute('novalidate', 'novalidate');

const notification = document.createElement('div');

notification.className = 'notification';
notification.setAttribute('data-qa', 'notification');

document.body.append(form);
document.body.append(notification);

const stringToDigit = (string) => {
  return +string.replace(/\D/g, '');
};

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((el) => el.classList.remove('active'));
    row.classList.add('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  let asc = true;
  let prevIndecs;

  tHeadCells.forEach((cell, i) => {
    cell.addEventListener('click', () => {
      if (prevIndecs !== i) {
        asc = true;
      }

      const sortBy = asc ? 1 : -1;

      const sortedRows = rows.sort((a, b) => {
        const contentsA = a.cells[i].textContent;
        const contentsB = b.cells[i].textContent;

        if (i === 4) {
          return (stringToDigit(contentsA) - stringToDigit(contentsB)) * sortBy;
        }

        return contentsA.localeCompare(contentsB) * sortBy;
      });

      prevIndecs = i;
      asc = !asc;

      tableBody.append(...sortedRows);
    });
  });

  form.addEventListener('submit', function (e) {
    if (!this.checkValidity()) {
      e.preventDefault();

      const elements = this.elements;

      if (!elements['name'].validity.valid) {
        elements['name'].setCustomValidity(
          'Text must be less than 4 characters long (you entered 3 characters)',
        );
      }

      if (!elements['position'].validity.valid) {
        elements['position'].setCustomValidity(
          'Text must be less than 4 characters long (you entered 3 characters)',
        );
      }

      if (!elements['age'].validity.valid) {
        elements['age'].setCustomValidity(
          'Text must be less than 4 characters long (you entered 3 characters)',
        );
      }

      if (!elements['salary'].validity.valid) {
        elements['salary'].setCustomValidity(
          'Text must be less than 4 characters long (you entered 3 characters)',
        );
      }

      notification.innerText = elements['name'].validationMessage;
      notification.innerText = elements['position'].validationMessage;
      notification.innerText = elements['age'].validationMessage;
      notification.innerText = elements['salary'].validationMessage;

      //   const invalidFields = [...this.querySelectorAll(':invalid')];

      //   console.log(invalidFields);

      //   invalidFields.forEach((field) => console.log(field.validationMessage, field.name));
    }
  });
});

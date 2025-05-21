/* eslint-disable no-shadow */
'use strict';

/* ------------------ SORTING ------------------ */
const thElements = document.querySelectorAll('th');
let sortColumnIndex = null;
let sortDirection = 'asc';

thElements.forEach((th, index) => {
  th.addEventListener('click', () => {
    sortDirection =
      sortColumnIndex === index
        ? sortDirection === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';
    sortColumnIndex = index;

    const rows = Array.from(document.querySelectorAll('tbody tr'));

    rows.sort((a, b) => {
      const cellA = a.children[sortColumnIndex].textContent.trim();
      const cellB = b.children[sortColumnIndex].textContent.trim();

      const cleanA = cellA.replace(/[^0-9.-]+/g, '');
      const cleanB = cellB.replace(/[^0-9.-]+/g, '');

      const numA = Number(cleanA);
      const numB = Number(cleanB);

      const isNum = (val, raw) => raw !== '' && !isNaN(val);

      if (isNum(numA, cleanA) && isNum(numB, cleanB)) {
        return (numA - numB) * (sortDirection === 'asc' ? 1 : -1);
      }

      return cellA.localeCompare(cellB) * (sortDirection === 'asc' ? 1 : -1);
    });

    const tbody = document.querySelector('tbody');

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  });
});

/* ------------------ ROW HIGHLIGHT ------------------ */
document.querySelector('tbody').addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  document
    .querySelectorAll('tbody tr')
    .forEach((row) => row.classList.remove('active'));
  clickedRow.classList.add('active');
});

/* ------------------ FORM GENERATION ------------------ */
const form = document.createElement('form');

form.classList.add('new-employee-form');

function createLabeledInput(name, type = 'text', labelText) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.type = type;
  input.name = name.toLowerCase();
  input.required = true;
  input.setAttribute('data-qa', name.toLowerCase());

  label.appendChild(input);

  return label;
}

// Append inputs
form.appendChild(createLabeledInput('Name', 'text', 'Name'));
form.appendChild(createLabeledInput('Position', 'text', 'Position'));
form.appendChild(createLabeledInput('Age', 'number', 'Age'));
form.appendChild(createLabeledInput('Salary', 'number', 'Salary'));

// Select dropdown
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', 'office');

[
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
].forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  select.appendChild(option);
});

officeLabel.appendChild(select);
form.appendChild(officeLabel);

// Submit button
const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

// Append form to page
document.body.appendChild(form);

/* ------------------ FORM SUBMIT ------------------ */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const nameForm = formData.get('name')?.trim();
  const positionForm = formData.get('position')?.trim();
  const officeForm = formData.get('office');
  const ageForm = Number(formData.get('age'));
  const salaryForm = Number(formData.get('salary'));

  if (!nameForm || nameForm.length < 4) {
    alert('Name must be at least 4 characters');

    return;
  }

  if (ageForm < 18 || ageForm > 90) {
    alert('Age must be between 18 and 90');

    return;
  }

  const newRow = document.createElement('tr');

  [nameForm, positionForm, officeForm, ageForm, salaryForm].forEach((text) => {
    const td = document.createElement('td');

    td.textContent = text;
    newRow.appendChild(td);
  });

  document.querySelector('tbody').appendChild(newRow);
  alert('Employee successfully added!');
  form.reset();
});

/* ------------------ INLINE EDIT ------------------ */
document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || td.querySelector('input')) {
    return;
  }

  const input = document.createElement('input');

  input.value = td.textContent;
  input.classList.add('cell-input');

  td.textContent = '';
  td.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    td.textContent = input.value || input.defaultValue;
  });
});

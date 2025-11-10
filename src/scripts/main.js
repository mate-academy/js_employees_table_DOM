'use strict';

// Table
const table = document.querySelector('table');
let columnIndex = -1;
let direction = 'asc';

table.addEventListener('click', (e) => {
  const headers = e.target.parentNode.children;
  const headersArray = [...headers];
  const index = headersArray.indexOf(e.target);
  const rows = [...table.querySelectorAll('tbody tr')];

  if (e.target.tagName === 'TH') {
    if (index === columnIndex) {
      direction = direction === 'asc' ? 'desc' : 'asc';
    } else {
      columnIndex = index;
      direction = 'asc';
    }

    const multiplier = direction === 'asc' ? 1 : -1;

    rows.sort((rowA, rowB) => {
      const valueA = rowA.children[index].textContent.trim();
      const valueB = rowB.children[index].textContent.trim();
      let comparisonResult = 0;

      if (index === 3 || index === 4) {
        let numA;
        let numB;

        if (index === 4) {
          numA = parseFloat(valueA.replace(/[$,]/g, '')) || 0;
          numB = parseFloat(valueB.replace(/[$,]/g, '')) || 0;
        } else {
          numA = parseInt(valueA) || 0;
          numB = parseInt(valueB) || 0;
        }

        comparisonResult = numA - numB;
      } else {
        comparisonResult = valueA
          .toLowerCase()
          .localeCompare(valueB.toLowerCase());
      }

      return comparisonResult * multiplier;
    });

    rows.forEach((row) => {
      table.querySelector('tbody').appendChild(row);
    });

    return;
  }

  const clickedRow = e.target.closest('tr');

  if (clickedRow && clickedRow.parentNode.tagName === 'TBODY') {
    if (table.querySelector('.active')) {
      table.querySelector('.active').classList.remove('active');
    }
    clickedRow.classList.add('active');
  }
});

// Form
const form = document.createElement('form');

form.className = 'new-employee-form';
form.setAttribute('novalidate', '');

function createInputField(labelText, nameAttr, type, qaAttr) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = labelText + ': ';
  input.setAttribute('name', nameAttr);
  input.setAttribute('type', type);
  input.setAttribute('data-qa', qaAttr);
  input.required = true;

  label.appendChild(input);

  return label;
}

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function createSelect() {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.textContent = 'Office: ';
  select.setAttribute('name', 'office');
  select.setAttribute('data-qa', 'office');
  select.required = true;

  for (const office of offices) {
    const option = document.createElement('option');

    option.textContent = office;

    select.appendChild(option);
  }

  label.appendChild(select);

  return label;
}

const nameField = createInputField('Name', 'name', 'text', 'name');
const positionField = createInputField(
  'Position',
  'position',
  'text',
  'position',
);
const officeField = createSelect();
const ageField = createInputField('Age', 'age', 'number', 'age');
const salaryField = createInputField('Salary', 'salary', 'number', 'salary');

const saveButton = document.createElement('button');

saveButton.textContent = 'Save to table';
saveButton.type = 'submit';

form.appendChild(nameField);
form.appendChild(positionField);
form.appendChild(officeField);
form.appendChild(ageField);
form.appendChild(salaryField);
form.appendChild(saveButton);

document.body.insertBefore(form, table);

// Submit

function showNotification(title, message, type) {
  const div = document.createElement('div');

  div.className = 'notification';
  div.setAttribute('data-qa', 'notification');
  div.classList.add(type);

  const span = document.createElement('span');

  span.className = 'title';
  span.textContent = title;
  div.appendChild(span);

  const paragraph = document.createElement('p');

  paragraph.textContent = message;
  div.appendChild(paragraph);

  document.body.insertBefore(div, form);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = form.name.value.trim();
  const positionValue = form.position.value.trim();
  const officeValue = form.office.value;
  const ageString = form.age.value.trim();
  const salaryString = form.salary.value.trim();

  if (
    nameValue === '' ||
    positionValue === '' ||
    ageString === '' ||
    salaryString === '' ||
    officeValue === ''
  ) {
    showNotification('Validation Failed', 'All fields are required.', 'error');

    return;
  }

  const ageValue = +ageString;
  const salaryValue = +salaryString;

  if (nameValue.length < 4) {
    showNotification(
      'Validation Failed',
      'Name must be at least 4 characters long.',
      'error',
    );
  } else if (ageValue < 18 || ageValue > 90) {
    showNotification(
      'Validation Failed',
      'Age must be between 18 and 90.',
      'error',
    );
  } else {
    showNotification(
      'Success!',
      'Employee data has been successfully added to the table.',
      'success',
    );

    const salaryFormatted = '$' + salaryValue.toLocaleString('en-US');
    const cellData = [
      nameValue,
      positionValue,
      officeValue,
      ageValue,
      salaryFormatted,
    ];
    const newRow = document.createElement('tr');

    cellData.forEach((data) => {
      const td = document.createElement('td');

      td.textContent = data;
      newRow.appendChild(td);
    });

    table.querySelector('tbody').appendChild(newRow);
    form.reset();
  }
});

// Double-click
let isSaving = false;

const saveChanges = (inputElement, tdElement, initialValue) => {
  if (isSaving) {
    return;
  }

  isSaving = true;

  const newValue = inputElement.value.trim();

  tdElement.textContent = newValue === '' ? initialValue : newValue;

  inputElement.remove();

  isSaving = false;
};

table.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || td.parentNode.parentNode.tagName !== 'TBODY') {
    return;
  }

  const existingInput = table.querySelector('.cell-input');

  if (existingInput) {
    if (existingInput.closest('td') !== td) {
      existingInput.blur();
    } else {
      return;
    }
  }

  const initialValue = td.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialValue;

  td.textContent = '';
  td.appendChild(input);

  input.focus();

  input.addEventListener('blur', () => {
    saveChanges(input, td, initialValue);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      saveChanges(input, td, initialValue);
    }
  });
});

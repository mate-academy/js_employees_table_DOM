'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');
const sortDirection = [];

headers.forEach((header, index) => {
  sortDirection[index] = true;

  header.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent.trim().replace(/[$,]/g, '');

      const cellB = rowB.cells[index].textContent.trim().replace(/[$,]/g, '');

      const numA = parseFloat(cellA);
      const numB = parseFloat(cellB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDirection[index] ? numA - numB : numB - numA;
      } else {
        return sortDirection[index]
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    sortDirection[index] = !sortDirection[index];

    rows.forEach((row) => tbody.appendChild(row));
  });
});

table.addEventListener('click', (e) => {
  Array.from(table.rows).find((element) => {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  });

  const clickedRow = e.target.closest('tr');

  if (clickedRow) {
    clickedRow.classList.add('active');
  }
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function createLabelInput(text, inputName, type = 'text') {
  const label = document.createElement('label');

  label.textContent = text + ': ';

  const input = document.createElement('input');

  input.name = inputName;
  input.type = type;
  input.setAttribute('data-qa', inputName);

  label.appendChild(input);

  return label;
}

const nameInputLabel = createLabelInput('Name', 'name', 'text');
const positionInputLabel = createLabelInput('Position', 'position', 'text');
const ageInputLabel = createLabelInput('Age', 'age', 'number');
const salaryInputLabel = createLabelInput('Salary', 'salary', 'number');

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', 'office');
select.required = true;

offices.forEach((officeName) => {
  const option = document.createElement('option');

  option.value = officeName;
  option.textContent = officeName;
  select.appendChild(option);
});

officeLabel.appendChild(select);

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.appendChild(nameInputLabel);
form.appendChild(positionInputLabel);
form.appendChild(officeLabel);
form.appendChild(ageInputLabel);
form.appendChild(salaryInputLabel);
form.appendChild(submitBtn);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmployee = form.elements['name'].value.trim();

  if (nameEmployee.length < 4) {
    pushNotification(
      'Error',
      'The Name value has fewer than 4 letters',
      'error',
    );

    return;
  }

  const position = form.elements['position'].value.trim();

  if (position === '') {
    pushNotification('Error', 'Position field is required', 'error');

    return;
  }

  const office = form.elements['office'].value;
  const age = Number(form.elements['age'].value);

  if (age < 18 || age > 90) {
    pushNotification(
      'Error',
      'The Age value is less than 18 or more than 90',
      'error',
    );

    return;
  }

  const salary =
    '$' + Number(form.elements['salary'].value).toLocaleString('en-US');

  const tr = document.createElement('tr');

  [nameEmployee, position, office, age, salary].forEach((text) => {
    const td = document.createElement('td');

    td.textContent = text;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);

  form.reset();

  pushNotification(
    'Success',
    'A new employee is successfully added to the table',
    'success',
  );
});

const pushNotification = (title, description, type) => {
  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const elementDiv = document.createElement('div');

  elementDiv.classList.add('notification', type);
  elementDiv.setAttribute('data-qa', 'notification');

  const header = document.createElement('h2');

  header.classList.add('title');
  header.textContent = title;

  const paragraph = document.createElement('p');

  paragraph.textContent = description;

  elementDiv.append(header, paragraph);
  document.body.appendChild(elementDiv);

  setTimeout(() => {
    elementDiv.remove();
  }, 5000);
};

let currentlyEditingInput = null;

table.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (currentlyEditingInput || cell.tagName !== 'TD') {
    return;
  }

  const originalText = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = 'text';
  input.value = originalText;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();
  currentlyEditingInput = input;

  const save = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue !== '' ? newValue : originalText;
    currentlyEditingInput = null;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});

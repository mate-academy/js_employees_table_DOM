'use strict';

const table = document.querySelector('table');
const refs = {
  table,
  tbody: table.querySelector('tbody'),
  thead: table.querySelector('thead'),
  boby: document.body,
};

refs.headers = refs.thead.querySelectorAll('th');

let currentColumn = null;
let sortDirectionASC = true;

refs.headers.forEach((th, colIndex) => {
  th.addEventListener('click', () => {
    if (currentColumn !== colIndex) {
      sortDirectionASC = true;
      currentColumn = colIndex;
    } else {
      sortDirectionASC = !sortDirectionASC;
    }

    const rows = Array.from(refs.tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      const cellA = a.children[colIndex].textContent.trim();
      const cellB = b.children[colIndex].textContent.trim();

      const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));
      const bothNumeric = !isNaN(numA) && !isNaN(numB);

      let result = null;

      if (bothNumeric) {
        result = numA - numB;
      } else {
        result = cellA.localeCompare(cellB);
      }

      return sortDirectionASC ? result : -result;
    });

    rows.forEach((row) => refs.tbody.appendChild(row));
  });
});

refs.tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  refs.tbody
    .querySelectorAll('tr')
    .forEach((tr) => tr.classList.remove('active'));

  row.classList.add('active');
});

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const nameInput = createInput('Name', 'name', 'text');
  const positionInput = createInput('Position', 'position', 'text');
  const ageInput = createInput('Age', 'age', 'number');
  const salaryInput = createInput('Salary', 'salary', 'number');

  const citySelect = createSelect('Office', 'office', [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ]);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';

  form.append(
    nameInput,
    positionInput,
    citySelect,
    ageInput,
    salaryInput,
    submitButton,
  );

  form.addEventListener('submit', handleSubmit);

  return form;
}

function createInput(labelText, fieldName, type) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.name = fieldName;
  input.type = type;
  input.dataset.qa = fieldName;

  label.append(`${labelText}: `, input);

  return label;
}

function createSelect(labelText, fieldName, options) {
  const label = document.createElement('label');
  const select = document.createElement('select');

  select.name = fieldName;
  select.dataset.qa = fieldName;

  options.forEach((text) => {
    const option = document.createElement('option');

    option.value = text;
    option.textContent = text;
    select.append(option);
  });

  label.append(`${labelText}: `, select);

  return label;
}

function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const nameEmploye = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  const salary = Number(formData.get('salary'));

  if (
    !nameEmploye ||
    !position ||
    !office ||
    !formData.get('age') ||
    !formData.get('salary')
  ) {
    showNotification(
      'error',
      'Error',
      'All fields are required to be filled in',
    );

    return;
  }

  if (nameEmploye.length < 4) {
    showNotification(
      'error',
      'Error',
      'Name must be at least 4 characters long',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Error', 'Age must be between 18 and 90');

    return;
  }

  addEmployeeToTable({
    nameEmploye,
    position,
    office,
    age,
    salary,
  });

  showNotification(
    'success',
    'Success',
    'New employee successfully added to the table',
  );

  form.reset();
}

function addEmployeeToTable({ nameEmploye, position, office, age, salary }) {
  const newRow = document.createElement('tr');

  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  [nameEmploye, position, office, age, formattedSalary].forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    newRow.append(td);
  });

  refs.tbody.append(newRow);
}

function showNotification(type, title, description) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.className = `notification ${type}`;

  const titleEl = document.createElement('h2');

  titleEl.className = 'title';
  titleEl.textContent = title;

  const descriptionEl = document.createElement('p');

  descriptionEl.textContent = description;

  notification.append(titleEl, descriptionEl);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function initTableEditing() {
  refs.table.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    if (document.querySelector('.cell-input')) {
      return;
    }

    const initialText = cell.textContent;
    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = initialText;

    cell.textContent = '';
    cell.append(input);
    input.focus();

    function saveChanges() {
      const newValue = input.value.trim();

      cell.textContent = newValue === '' ? initialText : newValue;
    }

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        input.blur();
      }
    });
  });
}

refs.boby.appendChild(createForm());
initTableEditing();

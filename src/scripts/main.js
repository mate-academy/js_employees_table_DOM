'use strict';

// write code here
const headLines = document.querySelectorAll('th');
const tableBody = document.querySelector('tbody');
const rows = Array.from(tableBody.querySelectorAll('tr'));
const table = document.querySelector('table');

const sortOrder = Array(headLines.length).fill(true);

headLines.forEach((headLine, index) => {
  headLine.addEventListener('click', () => {
    const isNumericColumn = index === 3 || index === 4;
    const isSalaryColumn = index === 4;

    const currentOrder = sortOrder[index];

    sortOrder[index] = !currentOrder;

    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      if (isSalaryColumn) {
        const numA = parseInt(cellA.replace(/[$,]/g, ''));
        const numB = parseInt(cellB.replace(/[$,]/g, ''));

        return currentOrder ? numA - numB : numB - numA;
      } else if (isNumericColumn) {
        const numA = parseInt(cellA, 10);
        const numB = parseInt(cellB, 10);

        return currentOrder ? numA - numB : numB - numA;
      } else {
        return currentOrder
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    tableBody.innerHTML = '';
    tableBody.append(...sortedRows);
  });
});

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
table.parentElement.appendChild(form);

const button = document.createElement('button');

button.classList.add('button');
button.textContent = 'Save to table';

function createLabelInput(labelText, element, inputType = 'text', dataQA = '') {
  const label = document.createElement('label');

  label.textContent = labelText;

  let inputElement;

  if (element === 'input') {
    inputElement = document.createElement('input');
    inputElement.type = inputType;
    inputElement.setAttribute('data-qa', dataQA);
    inputElement.required = true;
  } else if (element === 'dropdown') {
    inputElement = document.createElement('select');
    inputElement.name = dataQA;
    inputElement.required = true;
  }

  label.appendChild(inputElement);

  return label;
}

const nameField = createLabelInput('Name: ', 'input', 'text', 'name');
const positionField = createLabelInput(
  'Position: ',
  'input',
  'text',
  'position',
);
const ageField = createLabelInput('Age: ', 'input', 'number', 'age');
const salaryField = createLabelInput('Salary: ', 'input', 'number', 'salary');
const officeField = createLabelInput('Office: ', 'dropdown', '', 'office');

const dropdown = officeField.querySelector('select');

dropdown.name = 'Office';

const offices = [
  { value: 'Tokyo', text: 'Tokyo' },
  { value: 'Singapore', text: 'Singapore' },
  { value: 'London', text: 'London' },
  { value: 'New York', text: 'New York' },
  { value: 'Edinburgh', text: 'Edinburgh' },
  { value: 'San Francisco', text: 'San Francisco' },
];

offices.forEach((office) => {
  const opt = document.createElement('option');

  opt.value = office.value;
  opt.textContent = office.text;
  dropdown.appendChild(opt);
});

form.append(
  nameField,
  positionField,
  officeField,
  ageField,
  salaryField,
  button,
);

const saveButton = document.querySelector('.new-employee-form button');

const pushNotification = (type, title, description) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;

  const notificationTitle = document.createElement('h2');

  notificationTitle.textContent = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

const validatorFormData = (formData) => {
  let isValid = true; // Флаг для отслеживания состояния валидации

  const employeeName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = Number(formData.get('age'));

  // Проверка: длина имени
  if (employeeName && employeeName.length < 4) {
    pushNotification(
      'error',
      'Validation Error',
      'Name must be at least 4 characters long.',
    );
    isValid = false; // Обновляем флаг
  }

  // Проверка: позиция (если позиция пустая)
  if (!position) {
    pushNotification(
      'error',
      'Validation Error',
      'Position field is required.',
    );
    isValid = false;
  }

  // Проверка: офис (если офис не выбран)
  if (!office) {
    pushNotification('error', 'Validation Error', 'Office field is required.');
    isValid = false;
  }

  // Проверка: возраст в пределах 18–90
  if (isNaN(age) || age < 18 || age > 90) {
    pushNotification(
      'error',
      'Validation Error',
      'Age must be between 18 and 90.',
    );
    isValid = false;
  }

  return isValid; // Возвращаем итоговое значение флага
};

const addEmployeeToTable = (formData) => {
  const newRow = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.textContent = formData.get('name');
  newRow.appendChild(nameCell);

  const positionCell = document.createElement('td');

  positionCell.textContent = formData.get('position');
  newRow.appendChild(positionCell);

  const officeCell = document.createElement('td');

  officeCell.textContent = formData.get('office');
  newRow.appendChild(officeCell);

  const ageCell = document.createElement('td');

  ageCell.textContent = formData.get('age');
  newRow.appendChild(ageCell);

  const salaryCell = document.createElement('td');

  salaryCell.textContent = `$${Number(formData.get('salary')).toLocaleString()}`;
  newRow.appendChild(salaryCell);

  tableBody.appendChild(newRow);
};

saveButton.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  if (validatorFormData(formData)) {
    addEmployeeToTable(formData);
    form.reset();

    pushNotification(
      'success',
      'Employee Added',
      'New employee has been successfully added to the table.',
    );
  }
});

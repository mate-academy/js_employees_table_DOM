'use strict';

const body = document.querySelector('body');
const formElement = document.createElement('form');
const tableElement = document.querySelector('table');
const tableHeadElement = tableElement.rows[0];
const tableBodyElement = tableElement.querySelector('tbody');
const button = document.createElement('button');
const inputList = ['name', 'position', 'office', 'age', 'salary'];
const officeList = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

let sorted = false;
let lastClickedElement;
let lastActiveElement;
const NOTIFICATION_DELAY = 2000;
const MIN_AGE = 18;
const MAX_AGE = 90;

const formatValue = (element) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(element);

const toName = (item) => item.slice(0, 1).toUpperCase() + item.slice(1);

const pushNotification = (posTop, posRight, title, description, type) => {
  const blockElement = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  blockElement.classList.add('notification');
  titleElement.classList.add('title');

  blockElement.classList.add(type === 'success' ? 'success' : 'error');
  blockElement.style.top = posTop + 'px';
  blockElement.style.right = posRight + 'px';
  blockElement.setAttribute('data-qa', 'notification');

  titleElement.innerText = title;
  descriptionElement.innerText = description.toString();

  blockElement.appendChild(titleElement);
  blockElement.appendChild(descriptionElement);
  body.appendChild(blockElement);

  window.setTimeout(() => {
    blockElement.style.display = 'none';
  }, NOTIFICATION_DELAY);
};

function sortByASC(firstCell, secondCell) {
  if (firstCell < secondCell) {
    return -1;
  }

  if (firstCell > secondCell) {
    return 1;
  }

  return 0;
}

function sortByDESC(firstCell, secondCell) {
  if (firstCell > secondCell) {
    return -1;
  }

  if (firstCell < secondCell) {
    return 1;
  }

  return 0;
}

inputList.forEach((item) => {
  const labelElement = document.createElement('label');
  const textValue = item.toString();
  let input = document.createElement('input');

  if (textValue === 'office') {
    input = document.createElement('select');

    const placeholder = new Option('Select office...', '', true, true);

    placeholder.disabled = true;
    input.appendChild(placeholder);

    officeList.forEach((listElement) => {
      const newOption = new Option(toName(listElement.toString()), listElement);

      input.appendChild(newOption);
    });
  } else if (textValue === 'age' || textValue === 'salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  input.setAttribute('data-qa', textValue);
  input.setAttribute('name', textValue);

  labelElement.textContent = toName(item) + ':';
  labelElement.append(input);
  formElement.appendChild(labelElement);
});

[...tableHeadElement.cells].forEach((x, index) => {
  x.addEventListener('click', () => {
    if (lastClickedElement === x) {
      sorted = !sorted;
    } else {
      sorted = false;
      lastClickedElement = x;
    }

    const rows = Array.from(tableBodyElement.querySelectorAll('tr'));

    rows.sort((element1, element2) => {
      let firstCell = element1.cells[index].textContent.trim();
      let secondCell = element2.cells[index].textContent.trim();

      firstCell = firstCell.includes('$')
        ? Number(firstCell.replace('$', '').replaceAll(',', ''))
        : firstCell;

      secondCell = secondCell.includes('$')
        ? Number(secondCell.replace('$', '').replaceAll(',', ''))
        : secondCell;

      return sorted
        ? sortByDESC(firstCell, secondCell)
        : sortByASC(firstCell, secondCell);
    });

    tableBodyElement.innerHTML = '';
    rows.forEach((row) => tableBodyElement.appendChild(row));
  });
});

button.type = 'submit';
button.textContent = 'Save to table';
formElement.appendChild(button);
formElement.classList.add('new-employee-form');

tableBodyElement.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (lastActiveElement) {
    lastActiveElement.classList.remove('active');
  }
  row.classList.add('active');
  lastActiveElement = row;
});

tableBodyElement.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const activeInput = tableBodyElement.querySelector('.cell-input');

  if (activeInput) {
    const prevCell = activeInput.parentElement;

    prevCell.textContent =
      activeInput.value === '' ? activeInput.defaultValue : activeInput.value;
  }

  const inputElement = document.createElement('input');
  const initialValue = cell.textContent;

  inputElement.classList.add('cell-input');
  inputElement.value = initialValue;
  inputElement.defaultValue = initialValue;
  cell.textContent = '';
  cell.append(inputElement);
  inputElement.focus();

  const save = () => {
    cell.textContent =
      inputElement.value === '' ? initialValue : inputElement.value;
  };

  inputElement.addEventListener('keydown', (inputEvent) => {
    if (inputEvent.key === 'Enter') {
      save();
    }

    if (inputEvent.key === 'Escape') {
      cell.textContent = initialValue;
    }
  });

  inputElement.addEventListener('blur', save);
});

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formElement);
  const formName = formData.get('name')?.trim();
  const formPosition = formData.get('position')?.trim();
  const formOffice = formData.get('office');
  const formAge = Number(formData.get('age'));
  const salary = formData.get('salary');

  // === Валидация ===
  if (!formName || formName.length < 4) {
    pushNotification(
      10,
      10,
      'Error: Name is too short',
      'Field "Name" must be at least 4 characters long',
      'error',
    );

    return;
  }

  if (!formPosition) {
    pushNotification(
      10,
      10,
      'Error: Position is empty',
      'Field "Position" cannot be empty',
      'error',
    );

    return;
  }

  if (!formOffice) {
    pushNotification(
      10,
      10,
      'Error: Office is required',
      'Please select an office location',
      'error',
    );

    return;
  }

  if (Number.isNaN(formAge) || formAge < MIN_AGE) {
    pushNotification(
      10,
      10,
      'Error: Age is too low',
      `Age must be at least ${MIN_AGE}`,
      'error',
    );

    return;
  }

  if (formAge > MAX_AGE) {
    pushNotification(
      10,
      10,
      'Error: Age is too high',
      `Age must be at most ${MAX_AGE}`,
      'error',
    );

    return;
  }

  if (!salary || isNaN(Number(salary))) {
    pushNotification(
      10,
      10,
      'Error: Invalid Salary',
      'Salary must be a valid number',
      'error',
    );

    return;
  }

  const tableRow = document.createElement('tr');

  inputList.forEach((key) => {
    const tableData = document.createElement('td');

    if (key === 'salary') {
      tableData.textContent = formatValue(formData.get(key));
    } else {
      tableData.textContent = formData.get(key);
    }
    tableRow.appendChild(tableData);
  });

  tableBodyElement.appendChild(tableRow);

  pushNotification(
    10,
    10,
    'Employee added successfully.',
    'All information was correct, data was added to the table.',
    'success',
  );

  formElement.reset();
});

body.appendChild(formElement);

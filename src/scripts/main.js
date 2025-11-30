'use strict';

const tableElEmployees = document.querySelector('table');

const tableThead = tableElEmployees.querySelector('thead');
const tableTbody = tableElEmployees.querySelector('tbody');

const trRow = tableThead.querySelector('tr');
const allColumnsTh = trRow.querySelectorAll('th');

const formEmployees = document.createElement('form');

const btnSaveToTable = document.createElement('button');

btnSaveToTable.textContent = 'Save to table';
btnSaveToTable.type = 'submit';

formEmployees.classList.add('new-employee-form');
tableElEmployees.after(formEmployees);

let lastSortedIndex = -1;
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// таблиця нище
tableThead.addEventListener('click', (e) => {
  const currentElThead = e.target.closest('th');

  if (!currentElThead) {
    return;
  }

  const allRowsTbodyEmployees = tableTbody.querySelectorAll('tr');

  const indexThead = Array.from(allColumnsTh).indexOf(currentElThead);

  const allRowsEmployees = [...allRowsTbodyEmployees];

  if (indexThead !== lastSortedIndex) {
    getSortedColumn(allRowsEmployees, currentElThead, indexThead);
  }

  if (indexThead === lastSortedIndex) {
    allRowsEmployees.reverse();
  }

  lastSortedIndex = indexThead;

  tableTbody.innerHTML = '';

  allRowsEmployees.forEach((row) => {
    tableTbody.append(row);
  });
});

tableTbody.addEventListener('click', (e) => {
  const currentRow = e.target.closest('tr');

  if (!currentRow) {
    return;
  }

  tableTbody.querySelectorAll('tr').forEach((tr) => {
    tr.classList.remove('active');
  });

  currentRow.classList.add('active');
});

function getSortedColumn(allRows, currentThead, indThead) {
  allRows.sort((rowA, rowB) => {
    const a = rowA.children[indThead].textContent.trim();
    const b = rowB.children[indThead].textContent.trim();

    if (currentThead.textContent === 'Age') {
      const numA = Number(a);
      const numB = Number(b);

      return numA - numB;
    }

    if (currentThead.textContent === 'Salary') {
      const numA = Number(a.replace('$', '').replace(',', ''));
      const numB = Number(b.replace('$', '').replace(',', ''));

      return numA - numB;
    }

    return a.localeCompare(b);
  });
}

// форма нище
const labelName = getLabelContext('Name', 'name', 'text');
const inputName = labelName.querySelector('input');

const labelPosition = getLabelContext('Position', 'position', 'text');
const inputPosition = labelPosition.querySelector('input');

const labelOffice = getLabelContext('Office', 'office');
const selectCity = labelOffice.querySelector('select');

const labelAge = getLabelContext('Age', 'age', 'number');
const inputAge = labelAge.querySelector('input');

const labelSalary = getLabelContext('Salary', 'salary', 'number');
const inputSalary = labelSalary.querySelector('input');

formEmployees.append(
  labelName,
  labelPosition,
  labelOffice,
  labelAge,
  labelSalary,
  btnSaveToTable,
);

function getLabelContext(text, valueAttribute, type) {
  const labelEl = document.createElement('label');

  if (text === 'Office') {
    const labelElOffice = getLabelOffice(valueAttribute, cities, labelEl, text);

    return labelElOffice;
  }

  const inputForm = document.createElement('input');

  inputForm.name = valueAttribute;
  inputForm.type = type;
  inputForm.setAttribute('data-qa', valueAttribute);
  labelEl.textContent = `${text}:`;
  labelEl.append(inputForm);

  return labelEl;
}

function getLabelOffice(value, citiesList, labelElement, textLabel) {
  const selectInput = document.createElement('select');

  selectInput.name = value;
  selectInput.setAttribute('data-qa', value);

  citiesList.forEach((city) => {
    const option = document.createElement('option');

    option.textContent = city;
    option.value = city;
    selectInput.append(option);
  });

  labelElement.textContent = `${textLabel}:`;
  labelElement.append(selectInput);

  return labelElement;
}

formEmployees.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputNameValue = inputName.value.trim();
  const inputPositionValue = inputPosition.value.trim();
  const selectCityValue = selectCity.value;
  const inputAgeValue = Number(inputAge.value);
  const inputSalaryValue =
    '$' + Number(inputSalary.value).toLocaleString('en-US');

  if (
    !inputNameValue ||
    !inputPositionValue ||
    !selectCityValue ||
    !inputAge.value.trim() ||
    !inputSalary.value.trim()
  ) {
    showNotifications('Please fill in all fields.', 'error')

    return;
  }

  if (inputNameValue.length < 4) {
    showNotifications('Name must contain at least 4 characters.', 'error');

    return;
  }

  if (inputAgeValue < 18 || inputAgeValue > 90) {
    showNotifications('Age must be between 18 and 90.', 'error');

    return;
  }

  const newTrEmployee = document.createElement('tr');

  newTrEmployee.innerHTML = `
        <td>${inputNameValue}</td>
        <td>${inputPositionValue}</td>
        <td>${selectCityValue}</td>
        <td>${inputAgeValue}</td>
        <td>${inputSalaryValue}</td>
    `;
  tableTbody.append(newTrEmployee);

  showNotifications('Employee successfully added!', 'success');
});

function showNotifications(textNotification, type) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const divNotification = document.createElement('div');

  divNotification.setAttribute('data-qa', 'notification');
  divNotification.classList.add('notification', type);
  divNotification.textContent = textNotification;

  formEmployees.before(divNotification);

  setTimeout(() => divNotification.remove(), 30000);
}

tableTbody.addEventListener('dblclick', (e) => {
  const currentCell = e.target.closest('td');

  if (!currentCell) {
    return;
  }

  const openInput = tableTbody.querySelector('input');

  if (openInput) {
    openInput.blur();

    return;
  }

  const currentValue = currentCell.textContent.trim();

  if (!currentCell.dataset.original) {
    currentCell.dataset.original = currentCell.textContent.trim();
  }

  const originalValue = currentCell.dataset.original;

  currentCell.textContent = '';

  const inputInTd = document.createElement('input');
  inputInTd.classList.add('cell-input');
  inputInTd.value = currentValue;
  currentCell.append(inputInTd);
  inputInTd.focus();

  inputInTd.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'Enter') {
      currentCell.textContent = inputInTd.value.trim() || originalValue;
    }
  });

  inputInTd.addEventListener('blur', () => {
    currentCell.textContent = inputInTd.value.trim() || originalValue;
  });
});

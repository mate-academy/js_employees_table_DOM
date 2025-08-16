'use strict';

// write code here
const ths = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');
let currentSortIndex = null;
let currentSortDirection = 1;
const parseNumber = (str) => {
  const cleaned = str.replace(/[^0-9.-]+/g, '');

  if (cleaned === '') {
    return null;
  }

  const num = Number(cleaned);

  return Number.isNaN(num) ? null : num;
};

ths.forEach((th, index) => {
  th.addEventListener('click', () => {
    const trsArray = Array.from(tbody.querySelectorAll('tr'));

    if (currentSortIndex === index) {
      currentSortDirection *= -1;
    } else {
      currentSortIndex = index;
      currentSortDirection = 1;
    }

    trsArray.sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('td')[index].textContent.trim();
      const cellB = rowB.querySelectorAll('td')[index].textContent.trim();
      const numA = parseNumber(cellA);
      const numB = parseNumber(cellB);

      if (numA !== null && numB !== null) {
        return (numA - numB) * currentSortDirection;
      } else {
        return (
          cellA.localeCompare(cellB, 'en', { sensitivity: 'base' }) *
          currentSortDirection
        );
      }
    });

    tbody.innerHTML = '';
    trsArray.forEach((row) => tbody.appendChild(row));
  });
});

tbody.addEventListener('click', (e) => {
  if (e.target.closest('tr')) {
    tbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));
    e.target.closest('tr').classList.add('active');
  }
});

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

const labelName = document.createElement('label');
const inputName = document.createElement('input');

labelName.textContent = 'Name:';
inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('data-qa', 'name');
labelName.append(inputName);
form.append(labelName);

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

labelPosition.textContent = 'Position:';
inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('data-qa', 'position');
labelPosition.append(inputPosition);
form.append(labelPosition);

const labelOffice = document.createElement('label');
const select = document.createElement('select');
const oTokyo = document.createElement('option');
const oSingapore = document.createElement('option');
const oLondon = document.createElement('option');
const oNewYork = document.createElement('option');
const oEdinburgh = document.createElement('option');
const oSanFrancisco = document.createElement('option');

labelOffice.textContent = 'Office:';
select.setAttribute('name', 'office');
select.setAttribute('data-qa', 'office');
oTokyo.setAttribute('value', 'Tokyo');
oTokyo.textContent = 'Tokyo';
select.append(oTokyo);
oSingapore.setAttribute('value', 'Singapore');
oSingapore.textContent = 'Singapore';
select.append(oSingapore);
oLondon.setAttribute('value', 'London');
oLondon.textContent = 'London';
select.append(oLondon);
oNewYork.setAttribute('value', 'New York');
oNewYork.textContent = 'New York';
select.append(oNewYork);
oEdinburgh.setAttribute('value', 'Edinburgh');
oEdinburgh.textContent = 'Edinburgh';
select.append(oEdinburgh);
oSanFrancisco.setAttribute('value', 'San Francisco');
oSanFrancisco.textContent = 'San Francisco';
select.append(oSanFrancisco);
labelOffice.append(select);
form.append(labelOffice);

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

labelAge.textContent = 'Age:';
inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('data-qa', 'age');
labelAge.append(inputAge);
form.append(labelAge);

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

labelSalary.textContent = 'Salary:';
inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.setAttribute('data-qa', 'salary');
labelSalary.append(inputSalary);
form.append(labelSalary);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';
form.append(button);

document.querySelector('table').insertAdjacentElement('afterend', form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const element = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descriptionEl = document.createElement('p');

  element.setAttribute('data-qa', 'notification');
  element.setAttribute('class', `notification ${type}`);
  titleEl.setAttribute('class', 'title');
  titleEl.textContent = title;
  descriptionEl.textContent = description;
  element.appendChild(titleEl);
  element.appendChild(descriptionEl);
  element.style.position = 'absolute';
  element.style.top = posTop + 'px';
  element.style.right = posRight + 'px';
  document.body.appendChild(element);

  setTimeout(() => {
    element.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const namee = inputName.value.trim();
  const position = inputPosition.value.trim();
  const office = select.value;
  const age = Number(inputAge.value);
  const salaryRaw = Number(inputSalary.value);
  const salaryForTable = `$${salaryRaw.toLocaleString('en-US')}`;

  if (!namee || !position || !office || !age || !salaryRaw) {
    pushNotification(
      10,
      10,
      'Error',
      'Empty fields.\n ' + 'All fields are required.',
      'error',
    );

    return;
  }

  if (namee.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Invalid name.\n ' + 'Name should have more than 4 letters.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      10,
      10,
      'Error',
      'Invalid age.\n ' + 'Age must be between 18 and 90.',
      'error',
    );

    return;
  }

  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tdName.textContent = namee;
  tr.append(tdName);
  tdPosition.textContent = position;
  tr.append(tdPosition);
  tdOffice.textContent = office;
  tr.append(tdOffice);
  tdAge.textContent = age;
  tr.append(tdAge);
  tdSalary.textContent = salaryForTable;
  tr.append(tdSalary);
  tbody.appendChild(tr);

  pushNotification(
    10,
    10,
    'Success',
    'Succesfully add.\n ' + 'New employee was added to table.',
    'success',
  );

  form.reset();
  inputName.focus();
});

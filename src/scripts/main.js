'use strict';

const body = document.querySelector('body');
const table = body.querySelector('table');

const thead = table.querySelector('thead');
const trThead = thead.querySelector('tr');
const thThead = trThead.querySelectorAll('th');

const tbody = table.querySelector('tbody');
const trTbody = tbody.querySelectorAll('tr');

const arrayOfPeople = [];
const people = [];

let isAscending = true;
let activePerson = null;
let clickTimeout = null;

trTbody.forEach((tr) => {
  const tds = tr.querySelectorAll('td');

  tds.forEach((td) => {
    arrayOfPeople.push(td.textContent);
  });
});

for (let i = 0; i < arrayOfPeople.length; i += 5) {
  const person = {
    name: arrayOfPeople[i],
    position: arrayOfPeople[i + 1],
    office: arrayOfPeople[i + 2],
    age: +arrayOfPeople[i + 3],
    salary: parseInt(arrayOfPeople[i + 4].replace(/[$,]/g, '')),
  };

  people.push(person);
}

thThead.forEach((th) => {
  th.addEventListener('click', (e) => {
    const typeOfSort = e.currentTarget.textContent;

    switch (typeOfSort) {
      case 'Name':
        people.sort(
          (a, b) =>
            isAscending
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name),
          // eslint-disable-next-line
        );
        break;

      case 'Position':
        people.sort(
          (a, b) =>
            isAscending
              ? a.position.localeCompare(b.position)
              : b.position.localeCompare(a.position),
          // eslint-disable-next-line
        );
        break;

      case 'Office':
        people.sort(
          (a, b) =>
            isAscending
              ? a.office.localeCompare(b.office)
              : b.office.localeCompare(a.office),
          // eslint-disable-next-line
        );
        break;

      case 'Age':
        people.sort((a, b) => (isAscending ? a.age - b.age : b.age - a.age));
        break;

      case 'Salary':
        people.sort(
          (a, b) => (isAscending ? a.salary - b.salary : b.salary - a.salary),
          // eslint-disable-next-line
        );
        break;

      default:
        break;
    }

    updateTable();
    isAscending = !isAscending;
  });
});

function updateTable() {
  tbody.innerHTML = '';

  people.forEach((person) => {
    const newTr = document.createElement('tr');

    if (person === activePerson) {
      newTr.className = 'active';
    }

    newTr.innerHTML = `
    <td>${person.name}</td>
    <td>${person.position}</td>
    <td>${person.office}</td>
    <td>${person.age}</td>
    <td>$${person.salary.toLocaleString('en-US')}</td>
    `;

    newTr.addEventListener('click', () => {
      clearTimeout(clickTimeout);

      clickTimeout = setTimeout(() => {
        if (activePerson !== person) {
          activePerson = person;
        }

        updateTable();
      }, 200);
    });

    const allTd = newTr.querySelectorAll('td');

    allTd.forEach((td, cellIndex) => {
      td.addEventListener('dblclick', () => {
        clearTimeout(clickTimeout);

        const ctdCopy = td.textContent;

        const input = document.createElement('input');

        input.className = 'cell-input';

        td.textContent = '';

        input.value = ctdCopy;

        input.addEventListener('blur', () => {
          checkCellIndex(person, input.value, td, cellIndex, ctdCopy);
        });

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            checkCellIndex(person, input.value, td, cellIndex, ctdCopy);
          }
        });

        td.appendChild(input);
        input.focus();
      });
    });

    tbody.appendChild(newTr);
  });
}

function checkCellIndex(person, input, td, cellIndex, ctdCopy) {
  const newValue = input.value.trim().length === 0 ? ctdCopy : input.value;

  td.textContent = newValue;

  switch (cellIndex) {
    case 0:
      person.name = newValue;
      break;

    case 1:
      person.position = newValue;
      break;

    case 2:
      person.office = newValue;
      break;

    case 3:
      person.age = +newValue;
      break;

    case 4:
      person.salary = parseInt(newValue.replace(/[$,]/g, ''));
      break;
  }
}

updateTable();

const form = document.createElement('form');

form.className = 'new-employee-form';

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

inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('data-qa', 'name');
inputName.setAttribute('required', '');

inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('data-qa', 'position');
inputPosition.setAttribute('required', '');

inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('data-qa', 'age');
inputAge.setAttribute('required', '');

inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.setAttribute('required', '');

const select = document.createElement('select');

select.setAttribute('name', 'select');
select.setAttribute('data-qa', 'office');
select.setAttribute('required', '');

const optionTokyo = document.createElement('option');
const optionSingapore = document.createElement('option');
const optionLondon = document.createElement('option');
const optionNewYork = document.createElement('option');
const optionEdinburgh = document.createElement('option');
const optionSanFrancisco = document.createElement('option');

optionTokyo.setAttribute('value', 'Tokyo');
optionSingapore.setAttribute('value', 'Singapore');
optionLondon.setAttribute('value', 'London');
optionNewYork.setAttribute('value', 'New York');
optionEdinburgh.setAttribute('value', 'Edinburgh');
optionSanFrancisco.setAttribute('value', 'San Francisco');

optionTokyo.textContent = 'Tokyo';
optionSingapore.textContent = 'Singapore';
optionLondon.textContent = 'London';
optionNewYork.textContent = 'New York';
optionEdinburgh.textContent = 'Edinburgh';
optionSanFrancisco.textContent = 'San Francisco';

const button = document.createElement('button');

button.setAttribute('name', 'button');
button.setAttribute('type', 'submit');

button.textContent = 'Save to table';

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const titleOfMessage = document.createElement('h2');
  const p = document.createElement('p');

  div.className = `notification ${type}`;
  titleOfMessage.classList.add('title');
  div.setAttribute('data-qa', 'notification');

  titleOfMessage.textContent = title;
  p.textContent = description;

  body.appendChild(div);
  div.appendChild(titleOfMessage);
  div.appendChild(p);

  setTimeout(() => {
    div.style.visibility = 'hidden';
  }, 2000);
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  const nameValue = inputName.value.trim();
  const positionValue = inputPosition.value.trim();
  const ageValue = +inputAge.value;

  if (nameValue.length < 4) {
    pushNotification(
      'Name error',
      'Name should be more than 3 letters',
      'error',
    );

    return;
  }

  if (!positionValue) {
    pushNotification(
      'Position error',
      'Possition should contain only letters',
      'error',
    );

    return;
  }

  if (isNaN(ageValue) || ageValue < 18 || ageValue > 90) {
    pushNotification(
      'Age error',
      'Employee age must be between 18 and 90',
      'error',
    );

    return;
  }

  pushNotification(
    'Employee added',
    'Congratulations new employee was added',
    'success',
  );

  const person = {
    name: inputName.value.trim(),
    position: inputPosition.value.trim(),
    office: select.value,
    age: +inputAge.value,
    salary: +inputSalary.value,
  };

  people.push(person);
  updateTable();

  clear();
});

function clear() {
  inputName.value = '';
  inputPosition.value = '';
  select.value = 'Tokyo';
  inputAge.value = '';
  inputSalary.value = '';
}

body.appendChild(form);

form.appendChild(labelName);
form.appendChild(labelPosition);
form.appendChild(labelOffice);
form.appendChild(labelAge);
form.appendChild(labelSalary);
form.appendChild(button);

labelName.appendChild(inputName);
labelPosition.appendChild(inputPosition);
labelOffice.appendChild(select);
labelAge.appendChild(inputAge);
labelSalary.appendChild(inputSalary);

select.appendChild(optionTokyo);
select.appendChild(optionSingapore);
select.appendChild(optionLondon);
select.appendChild(optionNewYork);
select.appendChild(optionEdinburgh);
select.appendChild(optionSanFrancisco);

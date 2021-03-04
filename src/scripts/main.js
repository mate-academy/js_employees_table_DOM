'use strict';

const thead = document.querySelector('tr');
const tBody = document.querySelector('tbody');
let rowsList = [...tBody.children];

const regExpThrowSymbols = /[^\d]/g;

function numbersFilter(value) {
  return Number(value.replace(regExpThrowSymbols, ''));
}

function sortByHeadline(callback, tableRows, columnPosition, fieldName, flag) {
  const sortStrings = (prevPerson, nextPerson) => {
    const prevProperty = prevPerson.children[columnPosition].textContent;
    const nextProperty = nextPerson.children[columnPosition].textContent;

    return flag % 2
      ? prevProperty.localeCompare(nextProperty)
      : nextProperty.localeCompare(prevProperty);
  };

  const sortNumbers = (prevPerson, nextPerson) => {
    const prevProperty = prevPerson.children[columnPosition].textContent;
    const nextProperty = nextPerson.children[columnPosition].textContent;

    if (prevProperty.match(regExpThrowSymbols) !== null) {
      return flag % 2
        ? callback(prevProperty) - callback(nextProperty)
        : callback(nextProperty) - callback(prevProperty);
    }

    return flag % 2
      ? prevProperty - nextProperty
      : nextProperty - prevProperty;
  };

  let sortedColumn = null;

  switch (fieldName) {
    case 'Name':
    case 'Position':
    case 'Office':
      sortedColumn = [...tableRows].sort(sortStrings);
      break;

    case 'Age':
    case 'Salary':
      sortedColumn = [...tableRows].sort(sortNumbers);
      break;

    default: return 0;
  }

  return sortedColumn;
}

let counter = 0;
const events = [];

thead.addEventListener('click', e => {
  const selectedTarget = e.target.textContent;
  const column = e.target.cellIndex;

  counter++;
  events.push(selectedTarget);

  if (counter >= 2) {
    if (events[events.length - 1] !== events[events.length - 2]) {
      counter = 1;
    }
  }

  const sortedColumn = sortByHeadline(
    numbersFilter, rowsList, column, selectedTarget, counter
  );

  tBody.append(...sortedColumn);
});

tBody.addEventListener('click', e => {
  const selectedRow = e.target.closest('tr');

  rowsList.map(row => row.className = '');

  selectedRow.className = 'active';
});

const body = document.querySelector('body');

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>
    Name:
      <input
        name="name"
        type="text"
        data-qa="name" 
      >
    </label>
    <label>
    Position:
      <input
        name="name"
        type="text"
        data-qa="position"
        required
      >
    </label>
    <label>
    Office:
      <select
        data-qa="office" 
      >
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>
    Age:
      <input
        name="name"
        type="number"
        data-qa="age" 
      >
    </label>
    <label>
    Salary:
      <input
        name="name"
        type="number"
        data-qa="salary" 
      >
    </label>
    <button type="button" value="add">Add</button>

  </form>
`);

const form = document.querySelector('form');
const inputs = [...document.querySelectorAll('input')];
const button = document.querySelector('button');

const labels = [...document.querySelectorAll('label')];
const inputsList = labels.map(label => label.firstElementChild);

form.addEventListener('click', e => {
  const closestLabel = e.target.closest('label');

  if (!closestLabel) {
    return false;
  }

  // const formField = closestLabel.firstElementChild;

  // formField.addEventListener('input', e => {
  //   console.log(e.target.value);
  // });
});

button.addEventListener('click', e => {
  const elementDataSets = inputsList;

  const newEmployee = {};

  const employee = elementDataSets.map(elem => {
    const key = elem.dataset.qa;
    const value = elem.value;

    switch (key) {
      case 'name':
        if (value.length < 4) {
          newEmployee[key] = null;
          pushNotification(500, 10, 'Error', 'Name is too short', 'error');
        } else {
          newEmployee[key] = value;
        }

        break;

      case 'age':
        if (+value < 18 || +value > 90) {
          newEmployee[key] = null;
          pushNotification(650, 10, 'Error', 'Invalid Age', 'error');
        } else {
          newEmployee[key] = +value;
        }

        break;

      case 'position':
      case 'office':
      case 'salary':
        if (value === '') {
          newEmployee[key] = null;
        } else {
          newEmployee[key] = value;
        }

        break;
    }

    return employee;
  });

  const isCheckingPassed = Object.values(newEmployee)
    .every(value => value !== null);

  if (isCheckingPassed) {
    pushNotification(
      400,
      10,
      'Great!',
      'employee successfuly added',
      'success'
    );

    const { name, position, office, age, salary } = newEmployee;
    const convertedSalary = +salary;

    tBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${convertedSalary.toLocaleString('en-US')}</td>
    </tr>
    `);

    inputs.map(input => input.value = '');
    rowsList = [...tBody.children];
  }
});

function pushNotification(posTop, posRight, title, decriptionText, type) {
  const notification = document.createElement('div');

  const header = document.createElement('h2');
  const description = document.createElement('p');

  notification.classList.add('notification', `${type}`);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  header.className = 'title';
  header.textContent = title;
  description.innerText = decriptionText;

  notification.append(header);
  notification.append(description);

  body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

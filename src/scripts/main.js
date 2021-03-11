'use strict';

const thead = document.querySelector('tr');
const tBody = document.querySelector('tbody');
let rowsList = tBody.querySelectorAll('tr');

const leaveNumbers = new RegExp(/[^\d]/g);

function numbersFilter(value) {
  return Number(value.replace(leaveNumbers, ''));
}

function sortByColumnName(
  callback, tableRows, columnIndex, fieldName, isReversed
) {
  const sortStrings = (prevPerson, nextPerson) => {
    const prevProperty = prevPerson.children[columnIndex].textContent;
    const nextProperty = nextPerson.children[columnIndex].textContent;

    return isReversed
      ? prevProperty.localeCompare(nextProperty)
      : nextProperty.localeCompare(prevProperty);
  };

  const sortNumbers = (prevPerson, nextPerson) => {
    const prevProperty = prevPerson.children[columnIndex].textContent;
    const nextProperty = nextPerson.children[columnIndex].textContent;

    if (prevProperty.match(leaveNumbers) !== null) {
      return isReversed
        ? callback(prevProperty) - callback(nextProperty)
        : callback(nextProperty) - callback(prevProperty);
    }

    return isReversed
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

    default:
      break;
  }

  return sortedColumn;
}

let previousHeadline;
let flag = true;

thead.addEventListener('click', e => {
  e.preventDefault();

  const currentHeadline = e.target.textContent;

  if (previousHeadline) {
    if (previousHeadline === currentHeadline) {
      flag = !flag;
    } else {
      flag = true;
    }
  }

  previousHeadline = e.target.textContent;

  const columnIndex = e.target.cellIndex;
  const sortedColumn = sortByColumnName(
    numbersFilter, rowsList, columnIndex, previousHeadline, flag
  );

  tBody.append(...sortedColumn);
});

tBody.addEventListener('click', e => {
  const selectedRow = e.target.closest('tr');

  for (const row of rowsList) {
    row.className = '';
  }

  selectedRow.classList.toggle('active');
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
    <button type="button" value="add">Save to table</button>

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
});

button.addEventListener('click', e => {
  const elementDataSets = inputsList;

  const newEmployee = {};

  const employee = elementDataSets.map(elem => {
    const headlineName = elem.dataset.qa;
    const value = elem.value;

    switch (headlineName) {
      case 'name':
      case 'position':
        if (value.length < 4) {
          newEmployee[headlineName] = null;

          pushNotification(
            500, 10, 'Error', `${headlineName} must be longer than 4`, 'error'
          );
        } else {
          newEmployee[headlineName] = value;
        }
        break;

      case 'age':
        if (+value < 18 || +value > 90) {
          newEmployee[headlineName] = null;

          pushNotification(650, 10, 'Error', 'Invalid Age', 'error');
        } else {
          newEmployee[headlineName] = +value;
        }
        break;

      case 'office':
      case 'salary':
        if (value === '') {
          newEmployee[headlineName] = null;
        } else {
          newEmployee[headlineName] = value;
        }

        break;
    }

    return employee;
  });

  const allFieldAreValid = Object.values(newEmployee)
    .every(value => value !== null);

  const isCheckingPassed = allFieldAreValid;

  if (isCheckingPassed) {
    pushNotification(
      400,
      10,
      'Great!',
      'employee successfuly added',
      'success'
    );

    const { position, office, age, salary } = newEmployee;
    const convertedSalary = Number(salary);

    tBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${newEmployee.name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${convertedSalary.toLocaleString('en-US')}</td>
    </tr>
    `);

    for (const input of inputs) {
      input.value = '';
    }

    rowsList = [...tBody.children];
  }
});

function pushNotification(posTop, posRight, title, decriptionText, type) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';

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

'use strict';

const tableHeadElement = document.querySelector('thead');
const headRows = [...tableHeadElement.querySelectorAll('th')];
const tableBody = document.querySelector('tbody');
let activeRow = null;
const NUMBERS = '0123456789';
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const bodyElement = document.querySelector('body');

tableHeadElement.addEventListener('click', (e) => {
  const element = e.target.closest('th');

  if (!element) {
    return;
  }

  if (!element.getAttribute('class')) {
    removeSortOrderClass();
    element.setAttribute('class', 'asc');
    sortRows(getColumnIndex(element));
  } else {
    sortRows(getColumnIndex(element), 'descend');
    removeSortOrderClass();
  }
});

function getColumnIndex(receivedRow) {
  let index;

  headRows.filter((row, i) => {
    if (row.textContent === receivedRow.textContent) {
      index = i;

      return true;
    }
  });

  return index;
}

function sortRows(index, order = 'asc') {
  const tableElements = [...tableBody.children];

  tableElements.sort((value1, value2) => {
    let value1ToCompare = [...value1.querySelectorAll('td')][index].textContent;
    let value2ToCompare = [...value2.querySelectorAll('td')][index].textContent;

    if (index < 3) {
      return order === 'asc'
        ? value1ToCompare.localeCompare(value2ToCompare)
        : value2ToCompare.localeCompare(value1ToCompare);
    }

    if (index === 4) {
      value1ToCompare = value1ToCompare
        .split('')
        .filter((char) => char !== '$' && char !== ',')
        .join('');

      value2ToCompare = value2ToCompare
        .split('')
        .filter((char) => char !== '$' && char !== ',')
        .join('');
    }

    return order === 'asc'
      ? value1ToCompare - value2ToCompare
      : value2ToCompare - value1ToCompare;
  });

  tableBody.append(...tableElements);
}

function removeSortOrderClass() {
  headRows.forEach((element) => {
    if (element.getAttribute('class')) {
      element.removeAttribute('class');
    }
  });
}

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');

  if (!selectedRow) {
    return;
  }

  if (activeRow) {
    activeRow.removeAttribute('class');
    activeRow = null;
  }

  selectedRow.setAttribute('class', 'active');
  activeRow = selectedRow;
});

let newForm = document.createElement('form');

bodyElement.appendChild(newForm);

const formHTMLFillment = `
  <form class="new-employee-form">
    <label for="">
      Name:
      <input
        type="text"
        name="name"
        data-qa="name"
        required
      />
    </label>
    <label for="">
      Position:
      <input
        type="text"
        name="position"
        data-qa="position"
      />
    </label>
    <label for="">
      Office:
      <select
        name="office"
        id="cars"
        data-qa="office"
        required
      >
        <option value="Tokyo" selected>Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option
          value="London"
        >
          London
        </option>
        <option
          value="New York"
        >
          New York
        </option>
        <option
          value="Edinburgh"
        >
          Edinburgh
        </option>
        <option
          value="San Francisco"
        >
          San Francisco
        </option>
      </select>
    </label>
    <label for="">
      Age:
      <input
        type="number"
        name="age"
        data-qa="age"
        required
      />
    </label>
    <label for="">
      Salary:
      <input
        type="number"
        name="salary"
        data-qa="salary"
        required
      />
    </label>
    <button type="submit">Save to table</button>
  </form>
`;

newForm.outerHTML = formHTMLFillment;
newForm = document.querySelector('.new-employee-form');

newForm.addEventListener('input', (e) => {
  const inputElement = e.target.closest('input');

  if (!inputElement) {
    return;
  }

  if (inputElement.name === 'salary' || inputElement.name === 'age') {
    let value = inputElement.value;

    if (!NUMBERS.includes(value[value.length - 1])) {
      value = value.split('');
      value.pop();
      inputElement.value = value.join('');
    }
  }
});

newForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = newForm.querySelector('input[name="name"]').value;
  const positionValue = newForm.querySelector('input[name="position"]').value;
  const officeValue = newForm.querySelector('select[name="office"]').value;
  const ageValue = newForm.querySelector('input[name="age"]').value;
  const salaryValue = newForm.querySelector('input[name="salary"]').value;

  if (!dataInputValidation(nameValue, ageValue, positionValue)) {
    return;
  }

  addNewTableElement(
    nameValue,
    positionValue,
    officeValue,
    ageValue,
    +salaryValue,
  );

  showNotification('success');

  newForm.reset();
});

function dataInputValidation(nameVal, age, position) {
  const countLetters = nameVal
    .toLowerCase()
    .split('')
    .filter((char) => LETTERS.includes(char)).length;

  if (countLetters < 4) {
    showNotification('error', 'name');

    return false;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'age');

    return false;
  }

  if (!position.length) {
    showNotification('error', 'position');

    return false;
  }

  return true;
}

function getDividedSalary(salary) {
  const splitSalary = toString(salary).split('');

  splitSalary.reverse();

  const finalSalary = [];

  splitSalary.forEach((num, index) => {
    finalSalary.push(num);

    if ((index + 1) % 3 === 0) {
      finalSalary.push(',');
    }
  });

  if (finalSalary[finalSalary.length - 1] === ',') {
    finalSalary.pop();
  }

  return finalSalary.reverse().join('');
}

function addNewTableElement(nameVal, position, office, age, salary) {
  const newRowElement = document.createElement('tr');
  const styledSalary = getDividedSalary(salary);

  newRowElement.innerHTML = `
    <td>${nameVal}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${styledSalary}</td>
  `;

  tableBody.appendChild(newRowElement);
}

function showNotification(type, reason = '') {
  const newNotification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  newNotification.setAttribute('class', `notification ${type}`);
  newNotification.setAttribute('data-qa', 'notification');

  if (reason === 'age') {
    notificationTitle.textContent = 'Error! Please enter acceptable age!';

    notificationDescription.textContent =
      'Acceptable age is between 18 and 90 y.o.';
  } else if (reason === 'name') {
    notificationTitle.textContent = 'Error! Invalid name value!';

    notificationDescription.textContent =
      'Please enter a name which contains at least 4 letters!';
  } else if (reason === 'position') {
    notificationTitle.textContent = 'Error! Please enter value!';

    notificationDescription.textContent =
      'Please enter a position with at least 4 letters!';
  } else {
    notificationTitle.textContent = 'Success! New employee was added!';
  }

  newNotification.appendChild(notificationTitle);
  newNotification.appendChild(notificationDescription);

  bodyElement.appendChild(newNotification);

  setTimeout(() => {
    bodyElement.removeChild(newNotification);
  }, 2000);
}

'use strict';

// #region sort

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

// eslint-disable-next-line no-shadow
function clickOnHeaders(event) {
  const currentTh = event.target.closest('th');

  if (!currentTh) {
    return;
  }

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((el, index) => el === arr2[index]);
  }

  if (currentTh.textContent === 'Name') {
    const currentRows = tbody.querySelectorAll('tr');
    const currentRowsCopy = [...currentRows];

    currentRows.forEach((row) => {
      row.remove();
    });

    const sortedByNames = [...currentRowsCopy].sort((row1, row2) => {
      const nameTd1 = row1.firstElementChild;
      const nameTd2 = row2.firstElementChild;

      return nameTd1.textContent.localeCompare(nameTd2.textContent);
    });

    if (arraysAreEqual(sortedByNames, currentRowsCopy)) {
      sortedByNames.reverse();
    }

    sortedByNames.forEach((row) => {
      tbody.append(row);
    });
  }

  if (currentTh.textContent === 'Position') {
    const currentRows = tbody.querySelectorAll('tr');
    const currentRowsCopy = [...currentRows];

    currentRows.forEach((row) => {
      row.remove();
    });

    const sortedByPositions = [...currentRowsCopy].sort((row1, row2) => {
      const positionTd1 = row1.children[1];
      const positionTd2 = row2.children[1];

      return positionTd1.textContent.localeCompare(positionTd2.textContent);
    });

    if (arraysAreEqual(sortedByPositions, currentRowsCopy)) {
      sortedByPositions.reverse();
    }

    sortedByPositions.forEach((row) => {
      tbody.append(row);
    });
  }

  if (currentTh.textContent === 'Office') {
    const currentRows = tbody.querySelectorAll('tr');
    const currentRowsCopy = [...currentRows];

    currentRows.forEach((row) => {
      row.remove();
    });

    const sortedByOffices = [...currentRowsCopy].sort((row1, row2) => {
      const officeTd1 = row1.children[2];
      const officeTd2 = row2.children[2];

      return officeTd1.textContent.localeCompare(officeTd2.textContent);
    });

    if (arraysAreEqual(sortedByOffices, currentRowsCopy)) {
      sortedByOffices.reverse();
    }

    sortedByOffices.forEach((row) => {
      tbody.append(row);
    });
  }

  if (currentTh.textContent === 'Age') {
    const currentRows = tbody.querySelectorAll('tr');
    const currentRowsCopy = [...currentRows];

    currentRows.forEach((row) => {
      row.remove();
    });

    const sortedByAges = [...currentRowsCopy].sort((row1, row2) => {
      const ageTd1 = row1.children[3];
      const ageTd2 = row2.children[3];

      return Number(ageTd2.textContent) - Number(ageTd1.textContent);
    });

    if (arraysAreEqual(sortedByAges, currentRowsCopy)) {
      sortedByAges.reverse();
    }

    sortedByAges.forEach((row) => {
      tbody.append(row);
    });
  }

  function SToNumber(string) {
    const filtredString = string.replace(/\$/g, '').replace(/,/g, '');

    return Number(filtredString);
  }

  if (currentTh.textContent === 'Salary') {
    const currentRows = tbody.querySelectorAll('tr');
    const currentRowsCopy = [...currentRows];

    currentRows.forEach((row) => {
      row.remove();
    });

    const sortedBySalaries = [...currentRowsCopy].sort((row1, row2) => {
      const salary1 = row1.children[4];
      const salary2 = row2.children[4];

      return SToNumber(salary2.textContent) - SToNumber(salary1.textContent);
    });

    if (arraysAreEqual(sortedBySalaries, currentRowsCopy)) {
      sortedBySalaries.reverse();
    }

    sortedBySalaries.forEach((row) => {
      tbody.append(row);
    });
  }
}

thead.addEventListener('click', clickOnHeaders);

// #endregion sort

// #region active-tr

function clickOnTr(event) {
  const currentTr = event.target.closest('tr');

  if (!currentTr) {
    return;
  }

  if (currentTr.classList.contains('active')) {
    currentTr.classList.remove('active');

    return;
  }

  const allRows = document.querySelectorAll('tbody tr');

  allRows.forEach((row) => row.classList.remove('active'));

  currentTr.classList.add('active');
}

tbody.addEventListener('click', clickOnTr);

// #endregion active-tr

// #region add form

const body = document.body;
const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');

body.append(newForm);

newForm.innerHTML = `
    <label>Name: <input required data-qa="name" name="name" type="text"></label><br>
    <label>Position: <input required data-qa="position" name="position" type="text"></label><br>
    <label>Office: <select required name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label><br>
    <label>Age: <input required data-qa="age" name="age" type="number" step="1" min="18" max="90"></label><br>
    <label>Salary: <input required data-qa="salary" name="salary" type="text"></label><br>
    <button type="submit">Save to table</button>
`;

newForm.style.zIndex = '0';
const formButton = newForm.querySelector('button');
const employeeForm = document.querySelector('.new-employee-form');

// eslint-disable-next-line no-shadow
function clickOnButton(event) {
  event.preventDefault();

  const nameInput = employeeForm.querySelector('[data-qa="name"]');
  const positionInput = employeeForm.querySelector('[data-qa="position"]');
  const officeInput = employeeForm.querySelector('[data-qa="office"]');
  const ageInput = employeeForm.querySelector('[data-qa="age"]');
  const salaryInput = employeeForm.querySelector('[data-qa="salary"]');

  function isNameOrPosition(value) {
    const trimValue = value.trim();
    const regex = /^[a-zA-Z\s]+$/;

    return regex.test(trimValue);
  }

  function isValidName(value) {
    if (
      typeof value === 'string' &&
      value.trim().length >= 4 &&
      isNameOrPosition(value)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function isValidPosition(value) {
    if (
      typeof value === 'string' &&
      value.trim().length >= 1 &&
      isNameOrPosition(value)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function isValidAge(value) {
    if (!isNaN(Number(value)) && value >= 18 && value <= 90) {
      return true;
    } else {
      return false;
    }
  }

  function isValidSalary(value) {
    if (!isNaN(Number(value))) {
      return true;
    } else {
      return false;
    }
  }

  function numberToDollar(amount) {
    const thousandString = Number(amount).toLocaleString('en-US');

    const characters = thousandString.split('');

    characters.unshift('$');

    const result = characters.join('');

    return result;
  }

  if (
    isValidName(nameInput.value) &&
    isValidPosition(positionInput.value) &&
    isValidAge(ageInput.value) &&
    isValidSalary(salaryInput.value)
  ) {
    const newTr = document.createElement('tr');

    tbody.append(newTr);

    const nameTd = document.createElement('td');
    const positionTd = document.createElement('td');
    const officeTd = document.createElement('td');
    const ageTd = document.createElement('td');
    const salaryTd = document.createElement('td');

    nameTd.textContent = nameInput.value;
    positionTd.textContent = positionInput.value;
    officeTd.textContent = officeInput.value;
    ageTd.textContent = ageInput.value;
    salaryTd.textContent = numberToDollar(salaryInput.value);

    newTr.append(nameTd);
    newTr.append(positionTd);
    newTr.append(officeTd);
    newTr.append(ageTd);
    newTr.append(salaryTd);

    pushNotification(10, 10, 'success');
  } else {
    pushNotification(10, 10, 'error');
  }
}

formButton.addEventListener('click', clickOnButton);

// #endregion add form

// #region notification

const pushNotification = (posTop, posRight, type) => {
  const newDiv = document.createElement('div');
  const titleElem = document.createElement('h2');
  const descriptionELem = document.createElement('p');
  const style = document.createElement('style');

  style.innerHTML = `
  .notification {
    position: fixed;
    width: 300px;
    min-height: 100px;
    padding: 0 16px;
    box-sizing: border-box;
    z-index: 2;

    border-radius: 10px;
    background: rgba(132, 132, 132, 0.3);

    top: 10px;
    right: 10px;

    .title {
      display: block;
      font-size: 20px;
      font-weight: 900;
    }

    &.success {
      background: rgba(10, 189, 0, 0.5);
    }

    &.error {
      background: rgba(253, 0, 0, 0.5);
    }
  }
  `;

  document.head.appendChild(style);

  newDiv.className = 'notification';
  titleElem.className = 'title';
  descriptionELem.className = 'description';

  descriptionELem.style.whiteSpace = 'pre-wrap';

  document.body.prepend(newDiv);
  newDiv.append(titleElem);
  newDiv.append(descriptionELem);

  if (type === 'success') {
    newDiv.classList.add('success');
    descriptionELem.textContent = 'The employee was successfully added to the table';
    titleElem.textContent = 'Successfully added';
  }

  if (type === 'error') {
    newDiv.classList.add('error');
    descriptionELem.textContent = 'The employee was not added, please check the validity of the data';
    titleElem.textContent = 'Not valid data';
  }

  newDiv.style.top = `${posTop}px`;
  newDiv.style.right = `${posRight}px`;

  setTimeout(() => {
    newDiv.style.display = 'none';
  }, 3000);
};
// #endregion notification

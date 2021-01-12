'use strict';

const mainTable = document.querySelector('table');
const theadClickArea = mainTable.querySelector('thead');
const bodyTable = mainTable.querySelector('tbody');

let selectFlag = false;

//  Create a function for storing state of search button(th),
//  it helps calculate function userSort().
function renewDataFlag() {
  let prevSelect = '';
  let flagState = false;

  return function(currentElem) {
    if (currentElem.innerText === prevSelect) {
      flagState = !flagState;

      return flagState;
    }
    flagState = false;
    prevSelect = currentElem.innerText;

    return flagState;
  };
}

// Making closure for base state of search button(th).
const checkFlag = renewDataFlag();

function userSort() {
  let sortFlag = false;

  theadClickArea.addEventListener('click', (e) => {
    const mainTH = e.target.closest('th');
    const indexCol = mainTH.cellIndex;
    const allRows = [...bodyTable.children];

    if (!mainTH) {
      return;
    }
    sortFlag = checkFlag(mainTH);

    allRows.sort((firstRow, secondRow) => {
      let argFirst = firstRow.cells[indexCol].innerText;
      let argSecond = secondRow.cells[indexCol].innerText;

      if (mainTH.innerText === 'Salary') {
        argFirst = +argFirst.match(/\d/g).join('');
        argSecond = +argSecond.match(/\d/g).join('');

        return sortFlag
          ? argSecond - argFirst
          : argFirst - argSecond;
      } else {
        return sortFlag
          ? argSecond.localeCompare(argFirst)
          : argFirst.localeCompare(argSecond);
      }
    });

    allRows.map(row => bodyTable.append(row));
  });
}

userSort(mainTable);

bodyTable.addEventListener('click', (e) => {
  const item = e.target.closest('tr');

  if (!selectFlag) {
    selectFlag = true;
    item.classList.toggle('active');

    return;
  }

  document.querySelector('.active').classList.remove('active');
  item.classList.toggle('active');
});

bodyTable.addEventListener('dblclick', (e) => {
  const input = document.createElement('input');
  const selectedItem = e.target.closest('td');
  const innerText = selectedItem.innerHTML;

  input.classList.add('cell-input');
  input.setAttribute('size', '1');
  selectedItem.innerHTML = '';
  selectedItem.append(input);

  input.focus();

  const eventKeys = (event1) => {
    if (event1.keyCode === 13) {
      if (input.value) {
        selectedItem.innerHTML = input.value;
      } else {
        selectedItem.innerHTML = innerText;
      }
    }
  };

  const eventBlur = (event2) => {
    event2.stopImmediatePropagation();

    if (input.value) {
      selectedItem.innerHTML = input.value;
    } else {
      selectedItem.innerHTML = innerText;
    }
  };

  input.addEventListener('keypress', eventKeys, true);
  input.addEventListener('blur', eventBlur, false);
});

mainTable.insertAdjacentHTML(
  'afterend',
  `
  <form class="new-employee-form" method="post">
    <label>
      Name: <input data-qa="name" name="name" type="text">
    </label>
    <label>
      Position: <input data-qa="position" name="position" type="text">
    </label>
    <label>
      Office:
      <select data-qa="office" name="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco"></option>
      </select>
    </label>
    <label>
      Age: <input data-qa="age" name="age" type="number">
    </label>
    <label>
      Salary: <input data-qa="salary" name="salary" type="number">
    </label>
    <button name="button" id="submit">Save to table</button>
  </form>
  `
);

const mainForm = document.querySelector('.new-employee-form');
const formElements = mainForm.elements;
const buttonClick = document.getElementById('submit');

function readAndPasteForm(nameF, posF, officeF, ageF, salF) {
  bodyTable.insertAdjacentHTML('beforeend',
    `
    <tr>
      <td>${nameF}</td>
      <td>${posF}</td>
      <td>${officeF}</td>
      <td>${ageF}</td>
      <td>$${salF.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
    </tr>
  `
  );
}

function validationForm() {
  const nameInput = formElements['name'].value;
  const posInput = formElements['position'].value;
  const officeInput = formElements['office'].value;
  const ageInput = formElements['age'].value;
  const salaryInput = formElements['salary'].value;

  if (nameInput.length < 4) {
    return popNotification('Name ERROR',
      'Please, input name more than 4 charachters', 'error');
  }

  if (!posInput) {
    return popNotification('Position ERROR',
      'Enter your position', 'error');
  }

  if (!ageInput || ageInput < 18 || ageInput > 90) {
    return popNotification('Age ERROR',
      'Sorry, but you have a wrong age', 'error');
  }

  if (!salaryInput) {
    return popNotification('Salary ERROR',
      'I`m sure, you have a salary', 'error');
  }

  popNotification('Employer was added',
    'New employer was added to the table', 'success');
  readAndPasteForm(nameInput, posInput, officeInput, ageInput, salaryInput);

  formElements['name'].value = '';
  formElements['position'].value = '';
  formElements['age'].value = '';
  formElements['salary'].value = '';
}

buttonClick.addEventListener('click', (e) => {
  e.preventDefault();
  validationForm();
});

function popNotification(title, description, type) {
  const notice = `
    <div data-qa='notification' class='notification ${type}'>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', notice);

  setTimeout(() => {
    document.querySelector(`.${type}`).remove();
  }, 2000);
}

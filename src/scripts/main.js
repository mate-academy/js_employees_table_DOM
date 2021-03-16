'use strict';

const mainTable = document.querySelector('table');

const tbody = mainTable.querySelector('tbody');

const thElements = [...mainTable.rows[0].cells];

function formatText(tableValue) {
  return tableValue.replace(/[^a-zA-Z0-9_-]/g, '');
}

let clickCounter = 0;

function sortNumber(list, index, click) {
  if (click % 2 === 0) {
    return list.sort(
      (currentElement,
        nextElement
      ) =>
        formatText(nextElement.cells[index].textContent)
        - formatText(currentElement.cells[index].textContent)
    );
  } else {
    return list.sort(
      (currentElement,
        nextElement
      ) =>
        formatText(currentElement.cells[index].textContent)
        - formatText(nextElement.cells[index].textContent)
    );
  }
}

function sortString(list, index, click) {
  if (click % 2 === 0) {
    return list.sort(
      (currentElement,
        nextElement
      ) =>
        nextElement.cells[index].textContent
          .localeCompare(currentElement.cells[index].textContent)
    );
  } else {
    return list.sort(
      (currentElement,
        nextElement
      ) =>
        currentElement.cells[index].textContent
          .localeCompare(nextElement.cells[index].textContent)
    );
  }
}

function sortTableElements(clickEvent) {
  if (clickEvent.target.tagName === 'TH') {
    let sortedList;

    const isColumn = clickEvent.target.tagName === 'TH';

    const rows = [...tbody.rows];

    const cellIndex = thElements.indexOf(clickEvent.target);

    if (!isColumn) {
      return;
    }

    clickCounter++;

    switch (clickEvent.target.textContent) {
      case 'Name' :
      case 'Position' :
      case 'Office':
        sortedList = sortString(rows, cellIndex, clickCounter);
        break;
      case 'Age' :
      case 'Salary':
        sortedList = sortNumber(rows, cellIndex, clickCounter);
        break;
    }

    tbody.append(...sortedList);
  }
}

mainTable.addEventListener('click', sortTableElements);

let selectedElement;

tbody.addEventListener('click', (clickEvent) => {
  if (selectedElement) {
    selectedElement.parentNode.classList.remove('active');
  }

  selectedElement = clickEvent.target;
  selectedElement.parentNode.classList.add('active');
});

document.body.insertAdjacentHTML('beforeend', `
<form class="new-employee-form">
  <label>Name:
    <input
      name="name"
      class = "new-employee-form__input employee-name"
      data-qa="name"
      type="text"
      required
    >
    </label>
  <label>Position:
    <input
      name="position"
      class = "new-employee-form__input employee-position"
      data-qa="position"
      type="text"
    >
  </label>
  <label>Office:
    <select
      name="office"
      data-qa="office"
      required
    >
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input
      name="age"
      class = "new-employee-form__input employee-age"
      data-qa="age"
      type="number"
      required
    >
  </label>
  <label>Salary:
    <input
      name="salary"
      class = "new-employee-form__input employee-salary"
      data-qa="salary"
      type="number"
      required
    >
  </label>
  <button>
    Save to table
  </button>
</form>
`);

const bodyElement = document.querySelector('body');

const saveButton = document.querySelector('button');

const formElement = document.querySelector('.new-employee-form');

const inputName = formElement.querySelector('.employee-name');
const inputPosition = formElement.querySelector('.employee-position');
const inputOffice = formElement.querySelector('select');
const inputAge = formElement.querySelector('.employee-age');
const inputSalary = formElement.querySelector('.employee-salary');

const minNameValue = 4;
const ageMinValue = 18;
const ageMaxValue = 90;

function createNotification(title, description, type) {
  const notificationMessage = `
  <div class = 'notification ${type}' data-qa= 'notification'>
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
  `;

  return notificationMessage;
}

function addUser(firstName, position, office, age, salary) {
  return `
  <tr>
    <td>${firstName.value}</td>
    <td>${position.value}</td>
    <td>${office.value}</td>
    <td>${age.value}</td>
    <td>$${Number(salary.value).toLocaleString('en')}</td>
  </tr>
  `;
}

const notificationShow = (clickEvent) => {
  clickEvent.preventDefault();

  if (inputName.value.length < minNameValue) {
    bodyElement.insertAdjacentHTML(
      'beforeend',
      createNotification(
        'Error Message',
        `Sorr, but your name field has less than ${minNameValue} symbols`,
        'error'
      )
    );
  } else if (+inputAge.value < ageMinValue || +inputAge.value > ageMaxValue) {
    bodyElement.insertAdjacentHTML(
      'beforeend',
      createNotification(
        'Error Message',
        'Not adult age',
        'error'
      )
    );
  } else if (inputPosition.value.length === 0) {
    bodyElement.insertAdjacentHTML(
      'beforeend',
      createNotification(
        'Error Message',
        'Please choose your position',
        'error'
      )
    );
  } else {
    tbody.insertAdjacentHTML(
      'beforeend',
      addUser(inputName, inputPosition, inputOffice, inputAge, inputSalary)
    );

    bodyElement.insertAdjacentHTML(
      'beforeend',
      createNotification(
        'Successfull Message',
        'new user successfully added!',
        'success'
      )
    );

    formElement.querySelectorAll('input').forEach(element => {
      element.value = '';
    });
  }

  setTimeout(() => {
    document.querySelector('.notification').remove();
  }, 5000);
};

saveButton.addEventListener('click', notificationShow);

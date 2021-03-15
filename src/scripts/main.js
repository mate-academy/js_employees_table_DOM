'use strict';

const mainTable = document.querySelector('table');

const tbody = document.querySelector('tbody');
const trElemnets = [...tbody.rows];

const thElements = [...mainTable.rows[0].cells];

function formatText(tableValue) {
  return tableValue.replace(/[^a-zA-Z0-9_-]/g, '');
}

let counter = 0;

function sortTableElments(clickEvent) {
  if (clickEvent.target.tagName === 'TH') {
    const cellIndex = thElements.indexOf(clickEvent.target);

    counter++;

    const sortedByCategory = trElemnets.sort(
      (currentTbodyElement, nextTbodyElement) => {
        const Value = formatText(
          currentTbodyElement.cells[cellIndex].textContent
        );
        const nextValue = formatText(
          nextTbodyElement.cells[cellIndex].textContent
        );

        if (counter % 2 === 0) {
          return isNaN(parseInt(Value))
            ? nextValue.localeCompare(Value)
            : parseInt(nextValue) - parseInt(Value);
        }

        return isNaN(parseInt(Value))
          ? Value.localeCompare(nextValue)
          : parseInt(Value) - parseInt(nextValue);
      }
    );

    tbody.append(...sortedByCategory);
  }
}

mainTable.addEventListener('click', sortTableElments);

let selected;

tbody.addEventListener('click', (clickEvent) => {
  if (selected) {
    selected.parentNode.classList.remove('active');
  }

  selected = clickEvent.target;
  selected.parentNode.classList.add('active');
});

document.body.insertAdjacentHTML('beforeend', `
<form class="new-employee-form">
  <label>Name:
    <input
      name="name"
      data-qa="name"
      type="text"
      required
    >
    </label>
  <label>Position:
    <input
      name="position"
      data-qa="position"
      type="text"
    >
  </label>
  <label>Office:
    <select
      name="position"
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
      data-qa="age"
      type="number"
      required
    >
  </label>
  <label>Salary:
    <input
      name="salary"
      data-qa="salary"
      type="number"
      required
    >
  </label>
  <button type ="submit">
    Save to table
  </button>
</form>
`);

const bodyElement = document.querySelector('body');

const saveButton = document.querySelector('button');

const formElement = document.querySelector('.new-employee-form');

const inputName = formElement.querySelectorAll('input')[0];
const inputPosition = formElement.querySelectorAll('input')[1];
const inputOffice = formElement.querySelector('select');
const inputAge = formElement.querySelectorAll('input')[2];
const inputSalary = formElement.querySelectorAll('input')[3];

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

const notificationShow = (e) => {
  e.preventDefault();

  if (inputName.value.length < 4) {
    bodyElement.insertAdjacentHTML(
      'beforeend',
      createNotification(
        'Error Message',
        'Sorr, but your name field has less than 4 symbols',
        'error'
      )
    );
  } else if (+inputAge.value < 18 || +inputAge.value > 90) {
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

    inputAge.value = '';
    inputName.value = '';
    inputPosition.value = '';
    inputSalary.value = '';
  }

  setTimeout(() => {
    document.querySelector('div').remove();
  }, 5000);
};

saveButton.addEventListener('click', notificationShow);

// tbody.addEventListener('dblclick', (clickEvent) => {
//   const currenValue = clickEvent.target.innerText;

//   clickEvent.target.innerText = '';

//   const inputCell = document.createElement('input');

//   inputCell.classList.add('cell-input');
//   inputCell.value = currenValue;

//   clickEvent.target.append(inputCell);

//   const activeNode = document.querySelector('.cell-input');

//   if (activeNode.value !== clickEvent.target.innerText) {
//     tbody.addEventListener('click', () => {
//       activeNode.parentNode.innerText = activeNode.value;
//       activeNode.remove();
//     });
//   }
// });

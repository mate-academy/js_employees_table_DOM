'use strict';

/* sorting block start */

const table = document.querySelector('table');
let ascending = true;

function dataSort(array, index, direction) {
  if (direction) {
    array.sort((a, b) => {
      const itemA = a.children[index].textContent;
      const itemB = b.children[index].textContent;

      if (itemA.startsWith('$')) {
        return parseFloat(itemA.slice(1)) - parseFloat(itemB.slice(1));
      }

      if (isNaN(itemA)) {
        return itemA.localeCompare(itemB);
      }

      return itemA - itemB;
    }).forEach(item => table.tBodies[0].appendChild(item));
  } else {
    array.sort((a, b) => {
      const itemA = a.children[index].textContent;
      const itemB = b.children[index].textContent;

      if (itemA.startsWith('$')) {
        return parseFloat(itemB.slice(1)) - parseFloat(itemA.slice(1));
      }

      if (isNaN(itemA)) {
        return itemB.localeCompare(itemA);
      }

      return itemB - itemA;
    }).forEach(item => table.tBodies[0].appendChild(item));
  }
}

table.addEventListener('mouseout', e => {
  if (!e.target.matches('th') || e.target.closest('tfoot')) {
    return;
  }

  ascending = true;
});

table.addEventListener('click', e => {
  const index = e.target.cellIndex;
  const rows = [ ...table.tBodies[0].children ];

  if (!e.target.matches('th') || e.target.closest('tfoot')) {
    return;
  }

  dataSort(rows, index, ascending);

  ascending = !ascending;
});

/* sorting block end */

/* row selected block start */

function selectedRowAddClass(e) {
  const targetRow = e.target.closest('tr');

  if (!targetRow.closest('tbody') || !table.contains(targetRow)) {
    return;
  }

  onlyOneRowActive();

  targetRow.classList.add('active');
}

function onlyOneRowActive() {
  const rows = [ ...table.tBodies[0].children ];
  const activeRow = rows.find(row => row.classList.contains('active'));

  if (activeRow) {
    activeRow.classList.remove('active');
  }
}

table.addEventListener('click', selectedRowAddClass);

/* row selected block end */

/* add new employees form block start */

const form = document.createElement('form');
const labels = ['Name', 'Position', 'Age', 'Salary'];

form.className = 'new-employee-form';
document.body.appendChild(form);

form.innerHTML = `
  ${labels.map(label => `
    <label>${label}: 
      <input
        name="${label.toLowerCase()}"
        id="${label.toLowerCase()}"
        data-qa="${label.toLowerCase()}"
        type="${
  label.toLowerCase() === 'age' || label.toLowerCase() === 'salary'
    ? 'number'
    : 'text'
}"
        required
      >
    </label>
  `).join('')}

  <button type="submit" value="Save to table">Save to table</button>
`;

const labelForSelect = document.createElement('label');
const options = [`Tokyo`, `Singapore`, `London`, `New York`,
  `Edinburgh`, `San Francisco`];

labelForSelect.innerHTML = `
  Office:
  <select
    name="office"
    id="office"
    data-qa="office"
  >
    ${options.map(option => `
      <option value="${option.toLowerCase()}">
        ${option}
      </option>
    `)}
  </select>
`;

form.insertBefore(labelForSelect, form.children[2]);

const idSelectors = ['name', 'position', 'office', 'age', 'salary'];
const tBody = document.querySelector('tbody');

function addData(e) {
  e.preventDefault();

  if (!dataValidation()) {
    return;
  };

  const tableRow = tBody.insertRow();

  idSelectors.forEach(id => {
    const cell = document.createElement('td');
    const input = document.getElementById(id);

    switch (id) {
      case 'office':
        cell.textContent = input[input.selectedIndex].text;
        break;

      case 'salary':
        cell.textContent = `$${parseFloat(input.value).toLocaleString('en')}`;
        break;

      default:
        cell.textContent = input.value;
        break;
    }

    tableRow.appendChild(cell);
  });
}

const submitButton = document.querySelector('button');

submitButton.addEventListener('click', addData);

form.addEventListener('submit', e => {
  e.preventDefault();
});

/* add new employees form block end */

/* data validation block start */

const minNameLength = 4;
const minAge = 18;
const maxAge = 90;
const errorNotificationName = {
  title: 'Error has occured',
  description: 'Name must contain at least 4 characters.',
  type: 'error',
};
const errorNotificationBlankField = {
  title: 'Error has occured',
  description: 'All fields are required.',
  type: 'error',
};
const errorNotificationAge = {
  title: 'Error has occured',
  description: 'Age must be between 18 and 90 inclusive.',
  type: 'error',
};
const successNotification = {
  title: 'Success!',
  description: 'A new employee is successfully added.',
  type: 'success',
};

function dataValidation() {
  const hasInvalidFields = !!document.querySelector('form :invalid');

  if (hasInvalidFields) {
    pushNotification(errorNotificationBlankField);

    return false;
  }

  const nameField = document.getElementById('name').value;
  const ageField = document.getElementById('age').value;

  if (nameField.length < minNameLength) {
    pushNotification(errorNotificationName);

    return false;
  }

  if (ageField < minAge || ageField > maxAge) {
    pushNotification(errorNotificationAge);

    return false;
  }

  pushNotification(successNotification);

  return true;
}

const pushNotification = (notification) => {
  const { title, description, type } = notification;
  const messageBlock = document.createElement('div');

  messageBlock.classList.add('notification', type);
  messageBlock.setAttribute('data-qa', 'notification');

  const titleMessage = document.createElement('h2');

  titleMessage.classList.add('title');
  titleMessage.innerText = title;

  const messageText = document.createElement('p');

  messageText.innerText = description;

  messageBlock.append(titleMessage, messageText);
  document.body.lastChild.before(messageBlock);

  setTimeout(() => {
    messageBlock.remove();
  }, 5000);
};

/* data validation block end */

/* edit content block start */

let initialCellValue;
let inputToEdit;

function editTableContent(e) {
  const item = e.target.closest('td');

  if (!e.target.matches('td') || !table.contains(item)) {
    return;
  }

  item.contenteditable = true;

  initialCellValue = item.textContent;

  item.innerHTML = `
    <input
      name="editable-cell"
      type="text"
      class="cell-input"
      value="${initialCellValue}"
    >`;

  inputToEdit = document.querySelector('.cell-input');

  inputToEdit.focus();
  item.focus();
}

function saveEditedInfo(e) {
  const item = e.target.closest('td');
  const regExAgeField = /^(1[89]|[2-8][0-9]|90)$/;
  const regExSalaryField = /^([$])(.*[,])(.*\d)$/gm;
  const regExNameField = /^(.*[a-z ]{4,})$/gmi;

  inputToEdit = document.querySelector('.cell-input');

  if (!isNaN(initialCellValue)
  && !inputToEdit.value.trim().match(regExAgeField)) {
    pushNotification(errorNotificationAge);
    item.textContent = initialCellValue;
    inputToEdit.remove();

    return;
  }

  if (initialCellValue.trim().startsWith('$')
  && !inputToEdit.value.trim().match(regExSalaryField)) {
    item.textContent = initialCellValue;
    inputToEdit.remove();

    return;
  }

  if (item.cellIndex === 0 && !inputToEdit.value.trim().match(regExNameField)) {
    pushNotification(errorNotificationName);
    item.textContent = initialCellValue;
    inputToEdit.remove();

    return;
  }

  if (inputToEdit.value.trim().length === 0) {
    item.textContent = initialCellValue;
    inputToEdit.remove();

    return;
  }

  item.textContent = inputToEdit.value.trim();
  inputToEdit.remove();
}

table.addEventListener('dblclick', editTableContent);
table.addEventListener('focusout', saveEditedInfo);
table.addEventListener('focusout', onlyOneRowActive);

document.body.addEventListener('click', e => {
  if (e.target.matches('body')) {
    onlyOneRowActive();
  }
});

table.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    saveEditedInfo(e);
  }
});

/* edit content block end */

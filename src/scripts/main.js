'use strict';

const theadList = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');

form.classList.add('new-employee-form');

const formField = [
  {
    name: 'name',
    type: 'text',
  },
  {
    name: 'position',
    type: 'text',
  },
  {
    name: 'age',
    type: 'number',
  },
  {
    name: 'salary',
    type: 'number',
  },
];
const selectValues = ['Tokyo', 'Singapore',
  'London', 'New York', 'Edinburgh', 'San Francisco'];

theadList.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const element = e.target.closest('th');
  const tbodyRows = [...tbody.querySelectorAll('tr')];
  const isDesc = !element.hasAttribute('direction')
    || element.getAttribute('direction') === 'DESC';

  element.setAttribute('direction', isDesc ? 'ASC' : 'DESC');

  tbodyRows.sort((a, b) => {
    let aContent = a.cells[index].textContent;
    let bContent = b.cells[index].textContent;

    if (element.getAttribute('direction') === 'DESC') {
      aContent = b.cells[index].textContent;
      bContent = a.cells[index].textContent;
    }

    switch (index) {
      case 0:
      case 1:
        return aContent.localeCompare(bContent);
      case 2:
        return aContent.localeCompare(bContent);
      case 3:
        return aContent - bContent;
      case 4:
        const toNumber = (item) => item.slice(1).split(',').join('');

        return toNumber(aContent) - toNumber(bContent);
      default:
    }
  });
  tbodyRows.forEach(item => tbody.append(item));
});

tbody.addEventListener('click', (e) => {
  const hasActive = tbody.getElementsByClassName('active')[0];
  const selected = e.target.closest('tr');

  if (hasActive) {
    hasActive.classList.remove('active');
  }
  selected.classList.add('active');
});

form.innerHTML = formField.map(field => `
  <label>
    ${field.name[0].toUpperCase() + field.name.slice(1)}:
      <input
        name="${field.name}"
        type="${field.type}"
        data-qa="${field.name}"
      >
  </label>
`).join('');

const minAge = 18;
const maxAge = 90;
const age = form.querySelector('[name="age"]');

age.setAttribute('min', minAge);
age.setAttribute('max', maxAge);

form.children[1].insertAdjacentHTML('afterend', `
  <label>Office:
    <select name="office" data-qa="office" selected>
    <option value="">
      ${selectValues.map(value => `
      <option value="${value}">
        ${value}
      </option>`).join('')}
    </select>
  </label>
`);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.appendChild(submitButton);
document.body.appendChild(form);

const pushNotification = (title, type) => {
  const notification = document.createElement('div');

  notification.classList.add(`notification`, type);
  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('h2');

  notificationTitle.className = 'title';
  notificationTitle.innerText = title;
  notification.appendChild(notificationTitle);
  document.querySelector('body').appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

function validateData() {
  const newEmployee = [...form.querySelectorAll('label')].map(el =>
    el.children[0].value);

  if (newEmployee.some(el => el === '')) {
    pushNotification('Empty fields is not allowed', 'warning');

    return false;
  } else {
    const nameInput = form.querySelector('[name="name"]');
    const ageInput = form.querySelector('[name="age"]');

    if (nameInput.value.length < 4) {
      pushNotification('Name minimum length is 4', 'error');
      nameInput.focus();

      return false;
    } else if (ageInput.value > 90 || ageInput.value < 18) {
      pushNotification('Age should be between 18 and 90', 'error');
      ageInput.focus();

      return false;
    } else {
      pushNotification('New employee is successfully', 'success');

      return true;
    }
  }
}

submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  const checkValidation = validateData();

  if (checkValidation) {
    const newRow = document.createElement('tr');
    const newEmployee = [...form.querySelectorAll('label')].map(el =>
      el.children[0].value);

    newEmployee[4] = '$' + (Math.round(newEmployee[4] * 1000) / 1000)
      .toFixed(3).toString().replace('.', ',');
    newRow.innerHTML = newEmployee.map(el => `<td>${el}</td>`).join('');
    form.reset();
    tbody.append(newRow);
  }
});

const cells = document.querySelectorAll('td');
let activeInput = null;
let previousValue = '';

function saveChanges() {
  const inputValue = activeInput.value;
  const cell = activeInput.parentNode;
  const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);

  switch (cellIndex) {
    case 0:
    case 1:
      if (inputValue.length < 4) {
        pushNotification('Name minimum length is 4', 'error');
        activeInput.focus();
      } else {
        cell.textContent = inputValue;

        return cell.textContent;
      }
      break;

    case 2:
      cell.textContent = inputValue;

      return cell.textContent;

    case 3:
      if (Number(inputValue) > 90 || Number(inputValue) < 18) {
        pushNotification('Age should be between 18 and 90', 'error');
        activeInput.focus();
      } else {
        cell.textContent = inputValue;

        return cell.textContent;
      }
      break;

    case 4:
      if (Number(inputValue) < 0) {
        pushNotification('Number should be positive', 'error');
        activeInput.focus();
      } else {
        cell.textContent = '$' + (Math.round(Number(inputValue) * 1000) / 1000)
          .toFixed(3).toString().replace('.', ',');

        return cell.textContent;
      }
  }

  activeInput = null;
  previousValue = '';
}

cells.forEach((cell) => {
  cell.addEventListener('dblclick', (e) => {
    previousValue = cell.textContent;
    cell.textContent = '';

    const index = e.target.cellIndex;

    if (index === 2) {
      activeInput = document.createElement('select');
      activeInput.classList.add('cell-input');

      selectValues.forEach((value) => {
        const option = document.createElement('option');

        option.value = value;
        option.textContent = value;
        activeInput.appendChild(option);
      });

      activeInput.value = previousValue;
    } else {
      activeInput = document.createElement('input');
      activeInput.classList.add('cell-input');
      activeInput.value = previousValue;
    }

    activeInput.addEventListener('blur', saveChanges);

    activeInput.addEventListener('keypress', (evn) => {
      if (evn.key === 'Enter') {
        saveChanges();
      }
    });

    cell.appendChild(activeInput);
    activeInput.focus();
  });
});

'use strict';

const theadList = document.querySelector('thead');
const tbody = document.querySelector('tbody');

theadList.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const element = e.target.closest('th');
  const tbodyRows = [...tbody.querySelectorAll('tr')];

  if (!element.hasAttribute('direction')
    || element.getAttribute('direction') === 'DESC') {
    element.setAttribute('direction', 'ASC');
  } else {
    element.setAttribute('direction', 'DESC');
  }

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

form.querySelector('[name="age"]').setAttribute('min', 18);
form.querySelector('[name="age"]').setAttribute('max', 90);

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

const submit = document.createElement('button');

submit.type = 'submit';
submit.textContent = 'Save to table';

form.appendChild(submit);
document.body.appendChild(form);

const submitButton = document.querySelector('button');

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

function dataValidation() {
  const newEmployee = [...form.querySelectorAll('label')].map(el =>
    el.children[0].value);

  if (newEmployee.some(el => el === '') === true) {
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

  const checkValidation = dataValidation();

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

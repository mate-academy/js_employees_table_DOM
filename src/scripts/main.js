'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');
let sortedBy = '';
let prevActiveRow = '';

const officesLocation = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

const notificationTypes = {
  success: {
    name: 'success',
    title: 'Success!',
    description: 'User was added!',
  },
  warning: {
    name: 'error',
    title: 'Warning!',
    description: 'Not correct age or name!',
  },
  error: {
    name: 'error',
    title: 'Error!',
    description: 'Please, fill all inputs!',
  },
};

// #sorting rows
headers.forEach((header, index) => {
  const updatedTbody = document.querySelector('tbody');

  header.addEventListener('click', () => {
    const rows = [...updatedTbody.querySelectorAll('tr')];

    if (sortedBy === header.textContent) {
      updatedTbody.innerHTML = '';
      rows.reverse();
      rows.forEach((row) => updatedTbody.appendChild(row));

      return;
    }

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      if (header.textContent === 'Salary') {
        const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

        return numA - numB;
      }

      if (header.textContent === 'Age') {
        return Number(cellA) - Number(cellB);
      }

      return cellA.localeCompare(cellB);
    });

    updatedTbody.innerHTML = '';
    rows.forEach((row) => updatedTbody.appendChild(row));
    sortedBy = header.textContent;
  });
});

// #selecting row
tbody.addEventListener('click', (click) => {
  const clickedRow = click.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  if (prevActiveRow) {
    prevActiveRow.classList.remove('active');
  }

  if (clickedRow === prevActiveRow) {
    prevActiveRow = '';

    return;
  }

  clickedRow.classList.add('active');
  prevActiveRow = clickedRow;
});

// #creating form
function createForm() {
  function createInput(nameIn, typeInput = 'input') {
    function formatLabel(key) {
      return key.charAt(0).toUpperCase() + key.slice(1) + ':';
    }

    function addAttributesForInput(input) {
      input.setAttribute('name', nameIn);
      input.setAttribute('type', 'text');
      input.setAttribute('data-qa', nameIn);
      input.required = true;

      if (nameIn === 'salary' || nameIn === 'age') {
        input.type = 'number';
      }
    }

    const label = document.createElement('label');

    label.textContent = formatLabel(nameIn);

    if (typeInput === 'input') {
      const input = document.createElement('input');

      addAttributesForInput(input);
      label.append(input);
    }

    if (typeInput === 'select') {
      const select = document.createElement('select');

      addAttributesForInput(select);

      officesLocation.forEach((item, index) => {
        const option = document.createElement('option');

        option.setAttribute('value', index);
        option.textContent = item;

        select.append(option);
      });
      label.append(select);
    }

    return label;
  }

  const form = document.createElement('form');

  form.setAttribute('class', 'new-employee-form');

  const nameLabel = createInput('name');
  const positionLabel = createInput('position');
  const ageLabel = createInput('age');
  const salaryLabel = createInput('salary');

  const officeInput = createInput('office', 'select');

  const submitBtn = document.createElement('button');

  submitBtn.setAttribute('class', 'button__submit_form');

  submitBtn.textContent = 'Save to table';

  form.append(
    nameLabel,
    positionLabel,
    officeInput,
    ageLabel,
    salaryLabel,
    submitBtn,
  );

  document.querySelector('body').append(form);
}

function clearAllInputs() {
  const form = document.querySelector('form');
  const allInputs = form.querySelectorAll('input, select');

  allInputs.forEach((input) => {
    if (input.tagName === 'SELECT') {
      input.selectedIndex = 0;
    } else {
      input.value = '';
    }
  });
}

function createUser(user) {
  const newUser = document.createElement('tr');

  for (const userProp in user) {
    const newCell = document.createElement('td');

    if (userProp === 'userSalary') {
      newCell.textContent = `$${Number(user[userProp]).toLocaleString()}`;
    } else {
      newCell.textContent = user[userProp];
    }

    newUser.append(newCell);
  }

  document.querySelector('tbody').append(newUser);
}

function createNotification(type) {
  const notify = document.createElement('div');

  notify.setAttribute('data-qa', 'notification');

  notify.innerHTML = `
    <h2 class="title">${type.title}</h2>
    <p class="text">${type.description}</p>
  `;

  notify.className = `notification ${type.name}`;

  body.append(notify);

  setTimeout(() => {
    notify.remove();
  }, 2000);
}

createForm();

const button = document.querySelector('.button__submit_form');

button.addEventListener('click', (eventBtn) => {
  eventBtn.preventDefault();

  const newUser = {};

  newUser.userName = document.querySelector('[name="name"]').value;
  newUser.userPosition = document.querySelector('[name="position"]').value;

  newUser.userOffice =
    officesLocation[+document.querySelector('[name="office"]').value];
  newUser.userAge = document.querySelector('[name="age"]').value;
  newUser.userSalary = document.querySelector('[name="salary"]').value;

  let fornInputsStatus = notificationTypes.success.name;

  for (const userProp in newUser) {
    if (!newUser[userProp]) {
      fornInputsStatus = notificationTypes.error.name;
      break;
    }
  }

  if (fornInputsStatus === notificationTypes.error.name) {
    createNotification(notificationTypes.error);

    return;
  }

  if (
    newUser.userAge < 18 ||
    newUser.userAge > 90 ||
    newUser.userName.length < 4
  ) {
    fornInputsStatus = notificationTypes.warning.name;
  }

  if (fornInputsStatus === notificationTypes.success.name) {
    clearAllInputs();
    createUser(newUser);
    createNotification(notificationTypes.success);
  } else {
    createNotification(notificationTypes.warning);
  }
});

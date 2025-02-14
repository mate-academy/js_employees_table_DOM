'use strict';

const tbody = document.querySelector('tbody');

// #region sort
const titles = document.querySelector('thead').children[0].children;

for (let i = 0; i < titles.length; i++) {
  titles[i].addEventListener('click', () => {
    const tr = document.querySelectorAll('tr');
    const rows = [];

    tr.forEach((row) => {
      if (row.firstElementChild.tagName === 'TD') {
        rows.push(row);
      }
    });

    for (const title of titles) {
      if (title === titles[i]) {
        continue;
      } else if (title.hasAttribute('wasClicked')) {
        title.removeAttribute('wasClicked');
      }
    }

    if (titles[i].hasAttribute('wasClicked')) {
      rows.sort((person1, person2) => {
        const value1 = person1.children[i].textContent.trim();
        const value2 = person2.children[i].textContent.trim();

        if (isOnlyLetters(value1) && isOnlyLetters(value2)) {
          return value2.localeCompare(value1);
        } else {
          return extractNumber(value2) - extractNumber(value1);
        }
      });
    } else {
      rows.sort((person1, person2) => {
        const value1 = person1.children[i].textContent.trim();
        const value2 = person2.children[i].textContent.trim();

        if (isOnlyLetters(value1) && isOnlyLetters(value2)) {
          return value1.localeCompare(value2);
        } else {
          return extractNumber(value1) - extractNumber(value2);
        }
      });
    }

    tbody.innerHTML = '';

    rows.forEach((row) => {
      tbody.appendChild(row);
    });

    titles[i].toggleAttribute('wasClicked');
  });
}

function isOnlyLetters(str) {
  return /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s]+$/.test(str);
}

function extractNumber(str) {
  const num = parseFloat(str.replace(/[^\d.]/g, ''));

  return isNaN(num) ? 0 : num;
}

// #endregion

// #region active

tbody.addEventListener('click', (ev) => {
  for (const row of tbody.children) {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  }

  ev.target.parentElement.setAttribute('class', 'active');
});

let textCell;

tbody.addEventListener('dblclick', (ev) => {
  const td = document.querySelectorAll('td');

  for (const cell of td) {
    if (cell.firstElementChild) {
      cell.innerHTML = textCell;
    }
  }

  textCell = ev.target.textContent;

  ev.target.innerHTML = `<input class="cell-input" data-initial-value="${ev.target.textContent}" value="${ev.target.textContent}"></input>`;

  ev.target.firstElementChild.addEventListener('blur', (eventBlur) => {
    const newValue = eventBlur.target.value.trim();
    const initialValue = eventBlur.target.dataset.initialValue;

    const finalValue = newValue === '' ? initialValue : newValue;

    eventBlur.target.parentElement.textContent = finalValue;
    eventBlur.target.remove();
  });

  ev.target.firstElementChild.addEventListener('keypress', (eventEnter) => {
    if (eventEnter.key === 'Enter') {
      const newValue = eventEnter.target.value.trim();
      const initialValue = eventEnter.target.dataset.initialValue;

      const finalValue = newValue === '' ? initialValue : newValue;

      eventEnter.target.parentElement.textContent = finalValue;
      eventEnter.target.remove();
    }
  });
});

// #endregion

// #region form
const form = document.createElement('form');
const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');
const saveButton = document.createElement('button');

const labelOffice = document.createElement('label');
const select = document.createElement('select');
const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const option of selectOptions) {
  const newOption = document.createElement('option');

  newOption.textContent = option;
  newOption.setAttribute('value', `${option}`);
  select.append(newOption);
}

form.setAttribute('class', 'new-employee-form');
saveButton.setAttribute('type', 'submit');
select.setAttribute('data-qa', 'office');
select.setAttribute('name', 'office');

labelName.textContent = 'Name:';
labelPosition.textContent = 'Position:';
labelAge.textContent = 'Age:';
labelSalary.textContent = 'Salary:';
labelOffice.textContent = 'Office:';
saveButton.textContent = 'Save to table';

labelOffice.append(select);

form.append(
  labelName,
  labelPosition,
  labelOffice,
  labelAge,
  labelSalary,
  saveButton,
);

for (const label of form.children) {
  if (label.tagName === 'LABEL' && label.children.length === 0) {
    const newInput = document.createElement('input');

    newInput.setAttribute('name', `${onlyLowercaseLetters(label.textContent)}`);
    newInput.setAttribute('required', '');

    if (label.textContent === 'Age:' || label.textContent === 'Salary:') {
      newInput.setAttribute('type', 'number');
    } else {
      newInput.setAttribute('type', 'text');
    }

    newInput.setAttribute(
      'data-qa',
      `${onlyLowercaseLetters(label.textContent)}`,
    );

    label.insertAdjacentElement('beforeend', newInput);
  }
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const formData = new FormData(form);
  const employeeData = {};

  for (const [key, value] of formData.entries()) {
    employeeData[key] = value;
  }

  if (validValues(employeeData)) {
    const newEmployee = document.createElement('tr');
    const notification = document.createElement('div');
    const title = document.createElement('div');

    notification.setAttribute('class', 'notification success');
    notification.setAttribute('data-qa', 'notification');
    notification.style.minHeight = '80px';
    title.setAttribute('class', 'title');
    title.textContent = 'Employee added successfully!';

    notification.append(title);
    document.body.append(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);

    for (const key in employeeData) {
      const newCell = document.createElement('td');

      if (key === 'salary') {
        newCell.textContent = formatCurrency(employeeData[key]);
      } else {
        newCell.textContent = capitalizeWords(employeeData[key]);
      }

      newEmployee.append(newCell);
    }

    tbody.append(newEmployee);
  } else if (!validValues(employeeData)) {
    const notification = document.createElement('div');
    const title = document.createElement('div');

    notification.setAttribute('class', 'notification error');
    notification.setAttribute('data-qa', 'notification');
    notification.style.minHeight = '80px';
    title.setAttribute('class', 'title');
    title.textContent = 'Invalid input: Position must contain only letters.';

    notification.append(title);
    document.body.append(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});

document.body.append(form);

function onlyLowercaseLetters(str) {
  return str.toLowerCase().replace(/[^a-z]/g, '');
}

function formatCurrency(number) {
  return `$${Number(number).toLocaleString('en-US')}`;
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function validValues(employeeData) {
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ]+$/;
  const positionRegex = /^[a-zA-Z\s]+$/;

  if (
    nameRegex.test(employeeData.name) &&
    employeeData.name.length >= 4 &&
    positionRegex.test(employeeData.position) &&
    +employeeData.age >= 18 &&
    +employeeData.age <= 90
  ) {
    return true;
  }

  return false;
}

// #endregion

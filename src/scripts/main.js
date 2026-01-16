'use strict';

const body = document.querySelector('body');

// Build form
const formElements = [
  {
    tag: 'input',
    type: 'text',
    name: 'name',
    label: 'Name:',
  },
  {
    tag: 'input',
    type: 'text',
    name: 'position',
    label: 'Position:',
  },
  {
    tag: 'select',
    name: 'office',
    label: 'Office:',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    tag: 'input',
    name: 'age',
    label: 'Age:',
    type: 'number',
  },
  {
    tag: 'input',
    type: 'number',
    name: 'salary',
    label: 'Salary:',
  },
  {
    tag: 'button',
    type: 'submit',
    text: 'Save to table',
  },
];

const form = document.createElement('form');
const createFormElement = (elementInfo) => {
  if (!elementInfo.tag) {
    return;
  }

  switch (elementInfo.tag) {
    case 'input':
    case 'select':
      if (!elementInfo.name) {
        return;
      }

      const newLabel = document.createElement('label');
      const newField = document.createElement(elementInfo.tag);

      newField.name = elementInfo.name ?? '';
      newField.dataset.qa = elementInfo.name ?? '';
      // newField.required = true;

      if (elementInfo.tag === 'input') {
        newField.type = elementInfo.type ?? 'text';
      } else {
        for (const option of elementInfo.options) {
          const newOption = document.createElement('option');

          newOption.value = option;
          newOption.innerText = option;
          newField.append(newOption);
        }
      }

      newLabel.innerText = elementInfo.label ?? elementInfo.name;
      newLabel.append(newField);

      return newLabel;
    case 'button':
      const newButton = document.createElement('button');

      newButton.type = elementInfo.type ?? 'submit';
      newButton.innerText = elementInfo.text ?? 'Save';

      return newButton;
    default:
  }
};

for (const el of formElements) {
  form.append(createFormElement(el));
}

form.classList.add('new-employee-form');

body.append(form);
// !Build form

// Form event
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const { name: employeeName, position, office, age, salary } = data;
  let isValid = true;

  const hasEmptyField = Object.values(data).some(
    (value) => value.trim() === '',
  );

  if (hasEmptyField) {
    pushNotification(10, 10, 'Warning', 'All fields must be filled', 'error');

    return;
  }

  if (employeeName.length < 4) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'Name length less than 4',
      'error',
    );
    isValid = false;
  }

  if (age < 18) {
    pushNotification(10, 10, 'Validation Error', 'Age less than 18', 'error');
    isValid = false;
  }

  if (age > 90) {
    pushNotification(10, 10, 'Validation Error', 'Age bigger than 90', 'error');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const formatSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary);

  const tr = document.createElement('tr');

  [employeeName, position, office, age, formatSalary].forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    tr.appendChild(td);
  });

  table.querySelector('tbody').appendChild(tr);

  if (sortIndex !== null) {
    sortDirection *= -1;
    table.querySelectorAll('th')[sortIndex].click();
  }

  pushNotification(
    10,
    10,
    'Title of Success message',
    'Success message',
    'success',
  );
});
// !Form event

// NOtifications
// const notificationList = document.createElement('div');

// notificationList.classList.add('notification-list');
// body.append(notificationList);

function pushNotification(posTop, posRight, title, description, type) {
  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  const div = document.createElement('div');

  div.classList.add('notification');
  div.classList.add(type);
  div.dataset.qa = 'notification';

  div.style.top = posTop + 'px';
  div.style.right = posRight + 'px';

  div.prepend(h2);
  div.append(p);

  body.prepend(div);

  setTimeout(() => {
    div.style.display = 'none';
    div.remove();
  }, 2000);
}
// !NOtifications

// Sort table
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const getPrice = (v) => +v.replace(/[^0-9]/g, '');
let sortIndex = null;
let sortDirection = 1;

table.querySelector('thead').addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const index = e.target.cellIndex;
  const rows = [...tbody.rows];

  sortDirection = index === sortIndex ? -sortDirection : 1;

  sortIndex = index;

  if (rows.length === 0) {
    return;
  }

  const firstValue = rows[0].cells[index].innerText;
  const isNumeric =
    !isNaN(firstValue) || rows[0].cells[index].innerText.startsWith('$');

  rows.sort((a, b) => {
    const A = a.cells[index].innerText;
    const B = b.cells[index].innerText;

    if (isNumeric) {
      return (getPrice(A) - getPrice(B)) * sortDirection;
    }

    return A.localeCompare(B) * sortDirection;
  });

  tbody.append(...rows);
});
// !Sort table

tbody.addEventListener('click', (e) => {
  const rows = tbody.querySelectorAll('tr');

  rows.forEach((item) => item.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

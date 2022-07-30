'use strict';

// sort
const header = [...document.querySelector('thead').firstElementChild.children];
const list = document.querySelector('tbody');

let textColumnASC = true;
let ageColumnASC = true;
let salaryColumnASC = true;

document.querySelector('table').addEventListener('click', (e) => {
  const target = e.target.closest('th');

  const targetElementIndex = header.indexOf(target);

  if (!target || targetElementIndex === -1) {
    return;
  }

  const employeeRowElements = [...list.children];

  const getRowValue = row => row.children[targetElementIndex].textContent;
  const getRowMoneyValue = row => getRowValue(row).replace(/[^0-9]/g, '');

  switch (target.textContent) {
    case 'Age':
      if (ageColumnASC) {
        employeeRowElements.sort((row1, row2) =>
          getRowValue(row1) - getRowValue(row2)
        );
        ageColumnASC = false;
      } else {
        employeeRowElements.sort((row1, row2) =>
          getRowValue(row2) - getRowValue(row1)
        );
        ageColumnASC = true;
      }
      break;

    case 'Salary':
      if (salaryColumnASC) {
        employeeRowElements.sort((row1, row2) =>
          getRowMoneyValue(row1) - getRowMoneyValue(row2)
        );
        salaryColumnASC = false;
      } else {
        employeeRowElements.sort((row1, row2) =>
          getRowMoneyValue(row2) - getRowMoneyValue(row1)
        );
        salaryColumnASC = true;
      }
      break;

    case 'Name':
    case 'Position':
    case 'Office':
      if (textColumnASC) {
        employeeRowElements.sort((row1, row2) =>
          getRowValue(row1).localeCompare(getRowValue(row2))
        );
        textColumnASC = false;
      } else {
        employeeRowElements.sort((row1, row2) =>
          getRowValue(row2).localeCompare(getRowValue(row1))
        );
        textColumnASC = true;
      }
      break;
  }

  list.append(...employeeRowElements);
});

// selected row

list.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  if (!target || !list.contains(target)) {
    return;
  }

  [...list.children].forEach(item => item.classList.remove('active'));

  target.classList.add('active');
});

// form

const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

const formFields = [
  `<label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
      required
    >
  </label>`,
  `<label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      required
    >
  </label>`,
  `<label>
    Office:
    <select
      name="office"
      data-qa="office"
      required
    >
      <option value="Tokyo" selected>Tokyo</option>
      <option value="Tokyo">Tokyo</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>`,
  `<label>
    Age:
    <input
      name="age"
      type="number"
      data-qa="age"
      required
    >
  </label>`,
  `<label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      required
    >
  </label>`,
  `<button type="button">
    Save to table
  </button>`,
];

formFields.forEach(field => form.insertAdjacentHTML('beforeend', field));

// add new employees and validation

const pushNotification = (title, description, type) => {
  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');
  message.classList.add('notification', type);
  message.append(h2, p);

  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 6000);
};

form.lastElementChild.addEventListener('click', (e) => {
  if (form.elements.name.value.length < 4) {
    pushNotification('ERROR!',
      '`Name` input has less than 4 letters', 'error');

    return;
  }

  if (form.elements.position.value.length === 0) {
    pushNotification('ERROR!',
      '`Enter position', 'error');

    return;
  }

  if (form.elements.age.value < 18
    || form.elements.age.value > 90) {
    pushNotification('ERROR!',
      '`Age` input is less than 18 or more than 90', 'error');

    return;
  }

  list.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${form.elements.name.value}</td>
      <td>${form.elements.position.value}</td>
      <td>${form.elements.office.value}</td>
      <td>${form.elements.age.value}</td>
      <td>$${(+form.elements.salary.value).toLocaleString()}</td>
    </tr>
  `);

  pushNotification('SUCCESS!',
    'New employee is successfully added to the table', 'success');

  form.reset();
});

// editing of table cells

// coming soon...

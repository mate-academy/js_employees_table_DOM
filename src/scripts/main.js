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

document.body.insertAdjacentHTML('beforeend', `
  <form
    action="#"
    method="get"
    class="new-employee-form"
  >
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>
    <label>Office:
      <select name="office" data-qa="office">
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
        type="number"
        data-qa="age"
        min=0
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        min=0
      >
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

// add new employees and validation

const pushNotification = (title, description, type) => {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
  </div>
  `);

  setTimeout(() => {
    document.body.removeChild(document.querySelector('.notification'));
  }, 5000);
};

function validationForm(key, value) {
  if (!value) {
    pushNotification('ERROR!', 'Empty field value', 'error');

    return false;
  }

  if (key === 'name' && value.length < 4) {
    pushNotification('ERROR!', 'Invalid name value', 'error');

    return false;
  }

  if (key === 'age' && ((+value < 18 || +value > 90) || isNaN(+value))) {
    pushNotification('ERROR!', 'Invalid age value', 'error');

    return false;
  }

  return true;
}

const form = document.body.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const newNode = document.createElement('tr');

  for (const [key, value] of data) {
    if (!validationForm(key, value)) {
      return;
    }

    if (key === 'salary') {
      newNode.insertAdjacentHTML('beforeend', `
        <td>$${(+value).toLocaleString()}</td>
      `);
    } else {
      newNode.insertAdjacentHTML('beforeend', `<td>${value}</td>`);
    }
  }

  list.append(newNode);

  pushNotification('SUCCESS!',
    'New employee is successfully added to the table', 'success');

  form.reset();
});

// editing of table cells

list.addEventListener('dblclick', (e) => {
  const target = e.target.closest('td');
  const parentElement = target.parentElement;
  const input = document.createElement('input');
  const cellIndex = target.cellIndex;

  input.classList.add('cell-input');
  input.type = 'text';
  parentElement.replaceChild(input, target);
  input.focus();
  input.value = target.innerText;

  input.addEventListener('blur', (handler) => {
    const key = header[cellIndex]
      .innerText.toLowerCase();

    if (validationForm(key, input.value)) {
      target.innerText = input.value;
    }

    parentElement.replaceChild(target, input);
    input.remove();
  });

  input.addEventListener('keydown', (handler) => {
    if (handler.type === 'keydown' && handler.code !== 'Enter') {
      return;
    }

    input.blur();
  });
});

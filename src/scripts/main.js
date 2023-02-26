'use strict';

const body = document.querySelector('body');
const tableHeader = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');

const minAge = 18;
const maxAge = 90;
const minLength = 4;

form.className = 'new-employee-form';

form.insertAdjacentHTML('afterbegin',
  `
  <label>Name:
    <input
      name="name"
      type="text"
      data-qa="name"
      required
    >
  </label>
  <label>Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      required
    >
  </label>
  <label>Office:
    <select
      name="office"
      type="text"
      data-qa="office"
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
      type="number"
      data-qa="age"
      required
    >
  </label>
  <label>Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      required
    >
  </label>
  <button type="submit">Save to table</button>
  `
);

body.append(form);

let check = false;

tableHeader.addEventListener('click', e => {
  const target = e.target;

  sortTable(target.cellIndex, target.innerHTML, check === target.cellIndex);

  check = (check === target.cellIndex) ? false : target.cellIndex;
});

function sortTable(colNum, attribute, directSorting) {
  const rowsArray = [...tbody.children];

  let sorter;

  switch (attribute) {
    case 'Position':
    case 'Name':
    case 'Office':
      sorter = function(rowA, rowB) {
        const stringA = rowA.cells[colNum].innerHTML;
        const stringB = rowB.cells[colNum].innerHTML;

        return stringA.localeCompare(stringB);
      };
      break;

    default:
      sorter = function(rowA, rowB) {
        const num1 = toNumber(rowA.cells[colNum].innerHTML);
        const num2 = toNumber(rowB.cells[colNum].innerHTML);

        return num1 - num2;
      };
  }

  rowsArray.sort(sorter);

  if (directSorting) {
    tbody.append(...rowsArray.reverse());
  }

  tbody.append(...rowsArray);
}

const toNumber = function(string) {
  const result = string.includes('$')
    ? string.slice(1).split(',').join('')
    : string;

  return +result;
};

tbody.addEventListener('click', (e) => {
  [...tbody.children].forEach(row => {
    row.classList.remove('active');
  });

  e.target.parentElement.classList.add('active');
});

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

const errorText = (text) => {
  pushNotification(
    'Error!',
    `${text}`,
    'error'
  );
};

const successText = (text) => {
  pushNotification(
    'Success!',
    `${text}`,
    'success'
  );
};

const errorLong = 'It sould be at least 4 letters and must not include numbers';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const validateString = (
    value,
    additionalCondition = value.length < minLength
  ) => {
    const isLetter = ch => ch.toLowerCase() === ch.toUpperCase();

    if (additionalCondition) {
      errorText(errorLong);

      return false;
    }

    for (const ch of value) {
      if (isLetter(ch)) {
        errorText(errorLong);

        return false;
      }
    }

    return true;
  };

  const validName = validateString(form.position.value);
  const validPosition = validateString(form.name.value);

  if (!validName || !validPosition) {
    return;
  }

  if (form.age.value < minAge || form.age.value > maxAge) {
    errorText('Enter valid age');

    return;
  }

  const newRow = document.createElement('tr');
  const salary = (+form.salary.value).toLocaleString('en');
  const formName = form.name.value[0].toUpperCase() + form.name.value.slice(1);
  const formPosition
    = form.position.value[0].toUpperCase() + form.position.value.slice(1);

  newRow.innerHTML = `
    <td>${formName}</td>
    <td>${formPosition}</td>
    <td>${form.office.value}</td>
    <td>${form.age.value}</td>
    <td>$${salary}</td>
  `;

  tbody.append(newRow);
  form.reset();

  successText('The employee has been added to the table!');
});

tbody.addEventListener('dblclick', (e) => {
  const targetCell = e.target.closest('td');
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.style.width = getComputedStyle(e.target).width;
  input.value = targetCell.textContent;

  const value = input.value;

  input.value = '';

  while (targetCell.firstChild) {
    targetCell.removeChild(targetCell.firstChild);
  }

  targetCell.appendChild(input);
  input.focus();

  if (targetCell.cellIndex === 2) {
    targetCell.removeChild(input);

    const select = document.createElement('select');

    select.classList.add('cell-input');

    select.insertAdjacentHTML('afterbegin', `
      <option value="${value}">${value}</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `);

    const options = [...select.children];

    for (let i = 1; i < options.length; i++) {
      if (options[i].value === options[0].value) {
        options[i].dataset.qa = 'forRemove';
      }
    }

    select.removeChild(select.querySelector(`[data-qa="forRemove"]`));
    targetCell.appendChild(select);
    select.focus();

    select.addEventListener('blur', () => {
      targetCell.removeChild(select);

      targetCell.appendChild(document.createTextNode(select.value));
    });
  }

  input.addEventListener('blur', () => {
    targetCell.removeChild(input);

    const blurText = 'You have successfully changed the contents of the cell!';

    if (targetCell.cellIndex === 0 || targetCell.cellIndex === 1) {
      for (const ch of input.value) {
        if (ch.toLowerCase() === ch.toUpperCase() || input.value.length < 4) {
          errorText(errorLong);

          input.value = '';
        } else {
          input.value = input.value[0].toUpperCase() + input.value.slice(1);

          successText(blurText);
        }
      }
    }

    if (targetCell.cellIndex === 0 || targetCell.cellIndex === 1) {
      for (const ch of input.value) {
        if (ch.toLowerCase() === ch.toUpperCase() || input.value.length < 4) {
          errorText(errorLong);

          input.value = '';
        } else {
          input.value = input.value[0].toUpperCase() + input.value.slice(1);

          successText(blurText);
        }
      }
    }

    if (targetCell.cellIndex === 3) {
      input.type = 'number';

      if (input.value < 18 || input.value > 90) {
        errorText('Enter valid age');
        input.value = '';
      } else {
        successText(blurText);
      }
    }

    if (targetCell.cellIndex === 4) {
      if (input.value <= 0 || isNaN(input.value)) {
        errorText('Enter valid salary');

        input.value = '';
      } else {
        input.value = `$${(+input.value).toLocaleString('en')}`;

        successText(blurText);
      }
    }

    if (!input.value) {
      input.value = value;
    }

    targetCell.appendChild(document.createTextNode(input.value));
  });

  input.addEventListener('keyup', (evnt) => {
    if (evnt.key === 'Enter') {
      input.blur();
    }
  });
});

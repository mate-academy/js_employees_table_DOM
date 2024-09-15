'use strict';
addForm();

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const form = document.querySelector('.new-employee-form');
let rows = [...tableBody.children];

let reverseSort = false;
let targetCellType = '';
const minAge = 18;
const maxAge = 90;
const personNameLength = 4;
const errorAgeValue = `age must be more than ${minAge} and less than ${maxAge}`;
const errorTextValue = `The name, position, office must be`
  + ` longer than ${personNameLength} letters`;
let hasOneInptInCell = false;
let notificationTopPosition = 20;

document.body.style = 'align-items: start;';

tableHeader.addEventListener('click', sortTableBody);
document.body.addEventListener('click', addClassToTargetRow);
form.addEventListener('submit', addNewPerson);
tableBody.addEventListener('dblclick', addInput);

function sortTableBody(mouseEvent) {
  rows = [...tableBody.children];

  const targetCell = mouseEvent.target.closest('th').textContent;
  const header = [...document.querySelectorAll('th')];
  const num = header.findIndex(
    item => item.textContent === mouseEvent.target.textContent
  );

  reverseSort = targetCellType === targetCell
    ? !reverseSort
    : false;

  const newTableBody = rows.sort(
    (a, b) => {
      const x = a.children[num].textContent.replaceAll(/\W/g, '');
      const y = b.children[num].textContent.replaceAll(/\W/g, '');

      return isNaN(+x)
        ? reverseSort
          ? y.localeCompare(x)
          : x.localeCompare(y)
        : reverseSort
          ? Number(y) - Number(x)
          : Number(x) - Number(y);
    });

  targetCellType = mouseEvent.target.textContent;

  tableBody.append(...newTableBody);
};

function addClassToTargetRow(mouseEvent) {
  const targetRow = mouseEvent.target.closest('tr');

  if (mouseEvent.target.closest('thead')) {
    return;
  }

  if (!mouseEvent.target.closest('tbody')) {
    for (const row of rows) {
      row.classList.remove('active');
    }

    return;
  }

  for (const row of rows) {
    row.classList.remove('active');
  }

  targetRow.classList.add('active');
};

function addForm() {
  return document.body.insertAdjacentHTML('beforeend', `
    <form class="new-employee-form">
      <label>
        Name:

        <input
          name="name"
          type="text"
          data-qa="name"
          required
        >
      </label>

      <label>
        Position:

        <input
        name="name"
        type="text"
        data-qa="position"
        required
        >
      </label>

      <label>
        Office:

        <select
          name="office"
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

      <label>
        Age:

        <input
          name="age"
          type="number"
          data-qa="age"
          required
        >
      </label>

      <label>
        Salary:

        <input
          name="salary"
          type="number"
          data-qa="salary"
          required
        >
      </label>

      <button>Save to table</button>
    </form>
`);
}

function addNewPerson(formEvent) {
  formEvent.preventDefault();

  const namePerson = document.querySelector("input[data-qa='name']").value;
  const position = document.querySelector("input[data-qa='position']").value;
  const office = document.querySelector("select[data-qa='office']").value;
  const age = +document.querySelector("input[data-qa='age']").value;
  const salary = +document.querySelector("input[data-qa='salary']").value;

  if (namePerson.length < personNameLength) {
    pushNotification(
      errorTextValue,
      'error',
    );

    return;
  }

  if (age < minAge || age > maxAge) {
    pushNotification(
      errorAgeValue,
      'error',
    );

    return;
  }

  if (salary < 0) {
    pushNotification(
      'Salary cannot be less than 0',
      'error',
    );

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${namePerson}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${(salary).toLocaleString('en')}</td>
  </tr>
`);

  form.reset();

  pushNotification(
    'New employee was added to table',
    'success',
  );
};

function pushNotification(text, type) {
  const title = type === 'error'
    ? 'Sorry (-_-)'
    : 'Success (^_^)';

  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add(`${type}`, 'notification');
  h2.textContent = title;
  h2.classList.add(`title`);
  p.textContent = text;

  div.style = `
  top: ${notificationTopPosition}px;
  right: 20px;
  `;

  document.body.append(div);
  div.append(h2);
  h2.append(p);

  const remove = () => div.remove();
  const resetTop = () => {
    notificationTopPosition -= 190;
  };

  notificationTopPosition += 190;

  setTimeout(remove, 3000);
  setTimeout(resetTop, 3000);
}

function addInput(mouseEvent) {
  if (hasOneInptInCell) {
    return;
  }

  hasOneInptInCell = true;

  const targetItem = mouseEvent.target.closest('td');
  const prevText = targetItem.textContent;
  const isSalaryTarget = prevText.includes('$');

  const input = document.createElement('input');

  input.className = 'cell-input';

  input.value = prevText.replaceAll(/\W/g, '');

  input.type = isNaN(+prevText.replaceAll(/\W/g, ''))
    ? 'text'
    : 'number';

  targetItem.textContent = '';

  targetItem.append(input);

  const editValue = (keyboardEvent) => {
    if (keyboardEvent.key === 'Enter') {
      const inputValue = document.querySelector('.cell-input').value;

      let text = `${inputValue}`;

      if (!inputValue || !text) {
        text = prevText;
      }

      if (input.type === 'number') {
        if (+inputValue < 0) {
          pushNotification(
            'Value must be more than 0',
            'error',
          );

          return;
        }

        text = `$${(+inputValue).toLocaleString('en')}`;

        if (!isSalaryTarget) {
          text = `${inputValue}`;

          if (+inputValue < minAge || +inputValue > maxAge) {
            pushNotification(
              errorAgeValue,
              'error',
            );

            return;
          }
        }
      } else {
        if (inputValue.length < personNameLength && inputValue.length !== 0) {
          pushNotification(
            errorTextValue,
            'error',
          );

          return;
        }
      }

      input.remove();
      targetItem.textContent = text;
      hasOneInptInCell = false;

      pushNotification(
        'Employee was changed',
        'success',
      );
    }
  };

  input.addEventListener('keyup', editValue);
};

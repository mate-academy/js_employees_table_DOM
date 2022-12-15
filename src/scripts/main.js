'use strict';

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let reverse = false;
let targetType = '';

let rows = [...tableBody.children];

const sortTableBody = (mouseEvent) => {
  rows = [...tableBody.children];

  const targetCell = mouseEvent.target.closest('th').textContent;
  const header = [...document.querySelectorAll('th')];
  const num = header.findIndex(
    item => item.textContent === mouseEvent.target.textContent
  );

  reverse = targetType === targetCell
    ? !reverse
    : false;

  const newTableBody = rows.sort(
    (a, b) => {
      const x = a.children[num].textContent.replaceAll(/\W/g, '');
      const y = b.children[num].textContent.replaceAll(/\W/g, '');

      return isNaN(+x)
        ? reverse
          ? y.localeCompare(x)
          : x.localeCompare(y)
        : reverse
          ? +y - +x
          : +x - +y;
    });

  targetType = mouseEvent.target.textContent;

  tableBody.append(...newTableBody);
};

const addClassToTargetRow = (mouseEvent) => {
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

tableHeader.addEventListener('click', sortTableBody);
document.body.addEventListener('click', addClassToTargetRow);

document.body.insertAdjacentHTML('beforeend', `
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

document.body.style = 'align-items: start;';

const form = document.querySelector('.new-employee-form');
const personNameLength = 4;
const minAge = 18;
const maxAge = 90;

const addNewPerson = (formEvent) => {
  formEvent.preventDefault();

  const namePerson = document.querySelector("input[data-qa='name']").value;
  const position = document.querySelector("input[data-qa='position']").value;
  const office = document.querySelector("select[data-qa='office']").value;
  const age = +document.querySelector("input[data-qa='age']").value;
  const salary = +document.querySelector("input[data-qa='salary']").value;

  if (namePerson.length < personNameLength) {
    pushNotification(
      'Sorry (-_-)',
      'The name must be longer than 4 letters',
      'error',
    );

    return;
  }

  if (age < minAge || age > maxAge) {
    pushNotification(
      'Sorry (-_-)',
      'age must be more than 18 and less than 90',
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
    'Success (^_^)',
    'New employee was added to table',
    'success',
  );
};

form.addEventListener('submit', addNewPerson);

let topPosition = 20;

function pushNotification(title, text, type) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add(`${type}`, 'notification');
  h2.textContent = title;
  h2.classList.add(`title`);
  p.textContent = text;

  div.style = `
  top: ${topPosition}px;
  right: 20px;
  `;

  document.body.append(div);
  div.append(h2);
  h2.append(p);

  const remove = () => div.remove();
  const resetTop = () => {
    topPosition -= 150;
  };

  topPosition += 150;

  setTimeout(remove, 3000);
  setTimeout(resetTop, 3000);
}

let count = false;

const addInput = (mouseEvent) => {
  if (count) {
    return;
  }

  count = true;

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

      if (input.type === 'number') {
        if (+inputValue < 0) {
          pushNotification(
            'Sorry (-_-)',
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
              'Sorry (-_-)',
              'age must be more than 18 and less than 90',
              'error',
            );

            return;
          }
        }
      }

      if (!text) {
        text = prevText;
      }

      input.remove();
      targetItem.textContent = text;
      count = false;
    }
  };

  input.addEventListener('keyup', editValue);
};

tableBody.addEventListener('dblclick', addInput);

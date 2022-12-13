'use strict';

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const rows = [...tableBody.children];
let reverse = false;
let targetType = '';

const sortTableBody = (mouseEvent) => {
  const targetCell = mouseEvent.target.closest('th').textContent;
  const header = [...document.querySelectorAll('th')];
  const num = header.findIndex(
    item => item.textContent === mouseEvent.target.textContent
  );

  if (targetType === targetCell) {
    reverse = !reverse;
  } else {
    reverse = false;
  }

  const newTableBody = [...rows].sort(
    (a, b) => {
      const x = a.children[num].textContent;
      const y = b.children[num].textContent;

      return isNaN(+x.replaceAll(/\W/g, ''))
        ? reverse
          ? y.localeCompare(x)
          : x.localeCompare(y)
        : reverse
          ? +y.replaceAll(/\W/g, '') - +x.replaceAll(/\W/g, '')
          : +x.replaceAll(/\W/g, '') - +y.replaceAll(/\W/g, '');
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

const addNewPerson = (formEvent) => {
  formEvent.preventDefault();

  const namePerson = document.querySelector("input[data-qa='name']").value;
  const position = document.querySelector("input[data-qa='position']").value;
  const office = document.querySelector("select[data-qa='office']").value;
  const age = +document.querySelector("input[data-qa='age']").value;
  const salary = +document.querySelector("input[data-qa='salary']").value;

  if (namePerson.length < 4) {
    pushNotification(
      'Sorry (-_-)',
      'The name must be longer than 4 letters',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      'Sorry (-_-)',
      'age must be more than 18 and less than 90',
      'error',
    );

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
  <tr>
    <th>${namePerson}</th>
    <th>${position}</th>
    <th>${office}</th>
    <th>${age}</th>
    <th>$${(salary).toLocaleString('en')}</th>
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
  const input = document.createElement('input');

  input.className = 'cell-input';
  targetItem.innerHTML = '';
  input.value = prevText;

  targetItem.append(input);

  const editValue = (keyboardEvent) => {
    if (keyboardEvent.code === 'Enter'
    || keyboardEvent.code === 'NumpadEnter') {
      targetItem.innerHTML = `${input.value}`;

      input.remove();
      count = false;
    }
  };

  input.addEventListener('keyup', editValue);
};

tableBody.addEventListener('dblclick', addInput);

'use strict';

const body = document.querySelector('body');
const table = body.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');
let lastClick;

body.insertAdjacentHTML('beforeend', `
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

function pushNotification(title, description, type) {
  body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
  </div>
  `);

  setTimeout(() => {
    body.removeChild(document.querySelector('.notification'));
  }, 2000);
}

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const dataObj = Object.fromEntries(new FormData(form).entries());

  if (dataObj.name.length < 4) {
    pushNotification('Error',
      'Name is too short',
      'error');

    return;
  };

  if (+dataObj.age < 18 || +dataObj.age > 90) {
    pushNotification('Error',
      'You are too young or too old!!',
      'error');

    return;
  };

  if (isNaN(dataObj.salary)) {
    pushNotification('Error',
      'Invalid salary',
      'error');

    return;
  }

  const newPerson = document.createElement('tr');

  newPerson.innerHTML = `
      <td>
        ${dataObj.name.charAt(0).toUpperCase() + dataObj.name.slice(1)}
      </td>
      <td>
        ${dataObj.position.charAt(0).toUpperCase() + dataObj.position.slice(1)}
      </td>
      <td>
        ${dataObj.office}
      </td>
      <td>
        ${dataObj.age}
      </td>
      <td>
        ${'$' + (+dataObj.salary).toLocaleString('en-US')}
      </td>
    `;

  pushNotification('Success',
    'Employee has been added successfully!', 'success');
  form.reset();
  tBody.append(newPerson);
});

tHead.addEventListener('click', (events) => {
  const check = events.target.cellIndex;
  const sort = [...tBody.children].sort((a, b) => {
    const sortA = a.cells[check].textContent.replace(',', '').replace('$', '');
    const sortB = b.cells[check].textContent.replace(',', '').replace('$', '');

    return isNaN(sortA)
      ? sortA.localeCompare(sortB)
      : sortA - sortB;
  });

  if (lastClick === check) {
    tBody.append(...sort.reverse());
    lastClick = undefined;
  } else {
    tBody.append(...sort);
    lastClick = check;
  }
});

tBody.addEventListener('click', (e) => {
  const clickedRow = e.target.parentNode;

  if (tBody.querySelector('.active')) {
    tBody.querySelector('.active').classList.remove('active');
  }
  clickedRow.classList.add('active');
});

const input = document.createElement('input');
let inputValueBeforeEditing = '';

tBody.addEventListener('dblclick', (e) => {
  inputValueBeforeEditing = e.target.innerText;

  if (document.querySelector('.cell-input') === null) {
    input.setAttribute('value', e.target.innerText);
    input.classList.add('cell-input');
    e.target.replaceWith(input);
  }
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();

    const tableCell = document.createElement('td');

    tableCell.innerHTML = input.value.length === 0
      ? inputValueBeforeEditing
      : input.value;

    e.target.replaceWith(tableCell);
  }
});

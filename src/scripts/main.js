'use strict';

// Implemented event for table sorting;

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const tableHeads = [...document.querySelectorAll('th')];
let sortedASC;

tHead.addEventListener('click', e => {
  const indexOfColumn = tableHeads.indexOf(e.target);
  const tableRows = [...tBody.children];

  tableRows.sort((a, b) =>
    (['Age', 'Salary'].includes(e.target.innerText))

      ? (a.children[indexOfColumn].innerText.replace(/[^+\d]/g, '')
        - b.children[indexOfColumn].innerText.replace(/[^+\d]/g, ''))

      : (a.children[indexOfColumn].innerText
        .localeCompare(b.children[indexOfColumn].innerText))
  );

  if (!sortedASC) {
    sortedASC = !sortedASC;
  } else {
    tableRows.reverse();
    sortedASC = !sortedASC;
  }

  tableRows.forEach(row => tBody.append(row));
});

// Added event for rows selecting;

tBody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

// Added form and notifications to the document;

const body = document.querySelector('body');

body.insertAdjacentHTML('beforeend',
  `
  <form class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>

    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>

    <label>Office:
      <select name="office" type="text" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" type="number" data-qa="age">
    </label>

    <label>Salary:
      <input name="salary" type="number" data-qa="salary">
    </label>

    <button type="submit" value="Submit">Save to table</button>
  </form>
  `);

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());
  const tr = document.createElement('tr');

  if (dataObject.name.length < 4) {
    pushNotification('Wrong Name!',
      'Name length should have more than 4 letters.', 'error');

    return;
  }

  if (dataObject.position.length < 4) {
    pushNotification('Wrong Position!',
      'Position length should have more than 4 letters.', 'error');

    return;
  }

  if (dataObject.age < 18 || dataObject.age > 90) {
    pushNotification('Wrong Age!',
      'Employee should be adult and younger 90.', 'error');

    return;
  }

  for (const key in dataObject) {
    const td = document.createElement('td');

    if (key === 'salary') {
      td.innerText = '$' + parseInt(dataObject[key]).toLocaleString('en-US');
    } else {
      td.innerText = dataObject[key];
    }

    tr.append(td);
  }

  tBody.append(tr);
  pushNotification('Success!', 'New employee added to the table.', 'success');

  [...document.querySelectorAll('input')]
    .forEach(input => (input.value = null));
});

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';
  messageTitle.classList.add('title');

  messageTitle.innerText = title;
  messageDescription.innerText = description;

  message.append(messageTitle, messageDescription);
  document.body.firstElementChild.after(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

// Implemented editing of table cells by double-clicking on it;

tBody.addEventListener('dblclick', e => {
  const text = e.target.innerText;
  let input = document.createElement('input');

  e.target.innerText = null;
  input.className = 'cell-input';
  input.value = text;
  input.type = 'text';

  if (e.target.tagName !== 'TD') {
    return;
  }

  if (e.target.cellIndex >= 3) {
    input.type = 'number';
  }

  if (e.target.cellIndex === 2) {
    const select = document.createElement('select');

    select.dataset.qa = 'office';

    select.insertAdjacentHTML('beforeend', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>`);

    input = select;
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (input.value === '') {
      e.target.innerText = text;
    }

    if (tableHeads[e.target.cellIndex].innerText === 'Name') {
      if (input.value.length < 4) {
        pushNotification('Wrong Name!',
          'Name length should have more than 4 letters.', 'error');
        e.target.innerText = text;

        return;
      }
    }

    if (tableHeads[e.target.cellIndex].innerText === 'Age') {
      if (input.value < 18 || input.value > 90) {
        pushNotification('Wrong Age!',
          'Employee should be adult and younger 90.', 'error');
        e.target.innerText = text;

        return;
      }

      if (!parseInt(input.value)) {
        pushNotification('Not a number!',
          'Employee should be adult and younger 90.', 'error');
        e.target.innerText = text;

        return;
      }
    }

    if (tableHeads[e.target.cellIndex].innerText === 'Salary') {
      if (parseInt(input.value)) {
        e.target.innerText = '$' + parseInt(input.value)
          .toLocaleString('en-US');

        return;
      } else {
        pushNotification('Not a number', 'Please add number', 'error');
        e.target.innerText = text;

        return;
      }
    }

    e.target.innerText = input.value;
    input.remove();
  });

  input.addEventListener('keydown', eventKeyDown => {
    if (eventKeyDown.code === 'Enter') {
      input.blur();
    }
  });
});

'use strict';

// write code here
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
let sorted;
let check;

const isClicked = [];
let count = 0;

thead.addEventListener('click', (event) => {
  check = event.target.cellIndex;

  // make count zero if clicked button is not previous one

  count = check === isClicked[isClicked.length - 1]
    ? count + 1
    : 0;

  isClicked.push(event.target.cellIndex);

  // sort table
  sorted = [...tbody.children].sort((a, b) => {
    const prev = a.cells[check].textContent.replace(/[$,]/g, '');
    const next = b.cells[check].textContent.replace(/[$,]/g, '');

    if (count % 2 === 0) {
      return isNaN(prev)
        ? prev.localeCompare(next)
        : prev - next;
    }

    return isNaN(prev)
      ? next.localeCompare(prev)
      : next - prev;
  });

  tbody.append(...sorted);
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.parentNode;

  if (tbody.querySelector('.active')) {
    tbody.querySelector('.active').classList.remove('active');
  }

  clickedRow.classList.add('active');
});

// making form

const formHtml = document.createElement('form');

formHtml.classList.add('new-employee-form');

formHtml.innerHTML = `
    <label>
      Name: <input name="name" type="text" data-qa="name" required>
    </label>

    <label>
      Position: <input name="position" type="text" data-qa="position" required>
    </label>

      <label>
        Office: 
        <select name="office" data-qa="office" required>
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>

    <label>
      Age: <input name="age" type="number" data-qa="age" required>
    </label>

    <label>
      Salary: <input name="salary" type="text" data-qa="salary" required>
      </label>

    <button name="button" type="submit">Save to Table</button>
    `;

document.body.append(formHtml);

// notification

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');
  message.classList.add('notification');
  message.classList.add(type);

  message.innerHTML = `
  <h2>${title}</h2>
  <p>${description}</p>
  `;

  document.body.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
};

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObj = Object.fromEntries(data.entries());

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
        ${'$' + dataObj.salary.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </td>
    `;

  tbody.append(newPerson);
});

const input = document.createElement('input');
let inputValueBeforeEditing = '';

tbody.addEventListener('dblclick', (e) => {
  inputValueBeforeEditing = e.target.innerText;

  if (document.querySelector('.cell-input') === null) {
    input.setAttribute('value', e.target.innerText);
    input.classList.add('cell-input');
    e.target.replaceWith(input);
    input.focus();
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

input.addEventListener('blur', (e) => {
  const tableCell = document.createElement('td');

  tableCell.innerHTML = input.value.length === 0
    ? inputValueBeforeEditing
    : input.value;

  e.target.replaceWith(tableCell);
});

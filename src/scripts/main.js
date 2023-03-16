'use strict';

const sortBy = document.querySelector('tr');

function toNum(element) {
  return +element.innerText.slice(1).replaceAll(',', '');
}

let isSorted = false;
let previousSort = '';

sortBy.addEventListener('click', el => {
  const columns = el.target.parentNode.children;

  if (previousSort !== el.target.innerText) {
    isSorted = false;
    previousSort = el.target.innerText;
  }

  let sorted;

  for (let i = 0; i < columns.length; i++) {
    if (el.target.parentNode.children[i].innerText === el.target.innerText) {
      const parentEl = document.querySelector('tbody');
      const sortsEl = parentEl.querySelectorAll('tr');

      el.target.parentNode.children[i].innerText === 'Salary'
        ? sorted = [...sortsEl].sort((el1, el2) =>
          toNum(el1.children[i]) - toNum(el2.children[i]))
        : sorted = [...sortsEl].sort((el1, el2) =>
          el1.children[i].innerText.localeCompare(el2.children[i].innerText));

      if (isSorted) {
        isSorted = false;
        parentEl.append(...sorted.reverse());
      } else {
        isSorted = true;
        parentEl.append(...sorted);
      }
    }
  }
});

const tableBody = document.querySelector('tbody');

let previousActive = null;

tableBody.addEventListener('click', el => {
  if (previousActive) {
    previousActive.removeAttribute('class');
  };

  previousActive = el.target.parentNode;
  el.target.parentNode.className = 'active';
});

const body = document.querySelector('body');

body.insertAdjacentHTML(`beforeend`, `
  <form class = 'new-employee-form'>
    <label data-qa="name">
      Name:
      <input name="name" type="text">
    </label>

    <label data-qa="position">
      Position:
      <input name="position" type="text">
    </label>

    <label data-qa="office">
    Office:
    <select>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
    </select>
    </label>

    <label data-qa="age">
      Age:
      <input name="age" type="number">
    </label>

    <label data-qa="salary">
      Salary:
      <input name="salary" type="number">
    </label>

    <button type = 'submit'>
      Save to table
    </button>
  </form>
`);

const submitButton = document.querySelector('button');

const pushNotification = (posTop, posRight, title, description, type) => {
  document.body.insertAdjacentHTML(`beforeend`, `
    <div class = 'notification ${type}' data-qa = 'notification'>
      <h2 class = 'title'>${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const message = document.querySelector(`.${type}`);

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  setTimeout(() => message.remove(), 2000);
};

submitButton.addEventListener('click', el => {
  el.preventDefault();

  const inputs = document.querySelectorAll('input');

  const newTable = document.createElement('tr');

  const inputsValue = [...inputs].find(element => element.value === '');

  for (const input of inputs) {
    if (inputsValue) {
      pushNotification(10, 10, 'Error',
        'All fields must be filled', 'error');

      break;
    } else {
      if (input.name === 'name') {
        if (input.value.length < 4) {
          pushNotification(10, 10, 'Error',
            'The name must contain more than 4 letters', 'error');

          break;
        } else {
          continue;
        }
      } else if (input.name === 'age') {
        if (+input.value < 18 || +input.value > 90) {
          pushNotification(10, 10, 'Error',
            'The age value should be between 18 and 90 years', 'error');

          break;
        } else {
          for (const char of inputs) {
            const newCell = document.createElement('td');

            if (char.name === 'salary') {
              newCell.innerText = '$' + `${char.value}`;
            } else {
              newCell.innerText = char.value;
            }

            newTable.append(newCell);

            tableBody.append(newTable);

            char.value = '';
          }

          pushNotification(10, 10, 'Perfectly',
            'A new employee is successfully added to the table', 'success');
        }
      }
    }
  }

  const office = document.createElement('td');

  office.innerText = document.querySelector('select').value;

  newTable.children[1].after(office);
});

let previousText;
let typeOfInput;
let cellInput;
let changedCell;

const addTextFromInput = () => {
  const value = cellInput.value;

  if (value === '') {
    changedCell.innerText = previousText;

    return;
  }

  if (cellInput.type === 'number') {
    if (value > 90 || value < 18) {
      pushNotification(10, 10, 'Error',
        'The age value should be between 18 and 90 years', 'error');

      return;
    } else {
      if (previousText.slice(0, 1) === '$') {
        changedCell.innerText = '$' + value.localeCompare('en-US');

        return;
      } else {
        changedCell.innerText = value;

        return;
      }
    }
  }

  if (cellInput.type === 'text') {
    changedCell.innerText = `${value.slice(0, 1).toUpperCase()}`
     + `${value.slice(1).toLowerCase()}`;
  }
};

const callback = el => {
  changedCell = el.target;

  tableBody.removeEventListener('dblclick', callback);

  previousText = changedCell.innerText;

  cellInput = document.createElement('input');

  cellInput.classList.add('cell-input');

  if ('1234567890'.includes(changedCell.innerText.slice(1))) {
    typeOfInput = 'number';
  } else {
    typeOfInput = 'text';
  }

  cellInput.type = typeOfInput;

  cellInput.autofocus = true;

  changedCell.innerText = '';

  changedCell.append(cellInput);

  cellInput.addEventListener('blur', () => {
    addTextFromInput();
    tableBody.addEventListener('dblclick', callback);
  });

  cellInput.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
      tableBody.addEventListener('dblclick', callback);
      addTextFromInput();
    }
  });
};

tableBody.addEventListener('dblclick', callback);

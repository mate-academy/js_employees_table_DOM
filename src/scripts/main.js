'use strict';

// notification function
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

// #region sort region

// we calculate with the help of which we will sort
const sortBy = document.querySelector('tr');

// helper function to get number from salary
function toNum(element) {
  return +element.innerText.slice(1).replaceAll(',', '');
}

// helper variable for changed sort from asc to desc or reverse
let isSorted = false;

// helper variable for changed isSorted variable
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

// #endregion

// #region add employee region

const tableBody = document.querySelector('tbody');

// helper variable to check previous active table
let previousActive = null;

tableBody.addEventListener('click', el => {
  if (previousActive) {
    previousActive.removeAttribute('class');
  };

  previousActive = el.target.parentNode;
  el.target.parentNode.className = 'active';
});

const body = document.querySelector('body');

// added a form for add employer
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

submitButton.addEventListener('click', el => {
  el.preventDefault();

  const inputs = document.querySelectorAll('input');

  const newTable = document.createElement('tr');

  // helper variable for check the input value is empty which return boolean
  const inputsValue = [...inputs].find(element => element.value === '');

  for (const input of inputs) {
    if (inputsValue) {
      pushNotification(10, 10, 'Error',
        'All fields must be filled', 'error');

      break;
    }

    if (input.name === 'name') {
      if (input.value.length < 4) {
        pushNotification(10, 10, 'Error',
          'The name must contain more than 4 letters', 'error');

        break;
      }
    } else if (input.name === 'age') {
      if (+input.value < 18 || +input.value > 90) {
        pushNotification(10, 10, 'Error',
          'The age value should be between 18 and 90 years', 'error');

        break;
      }
    } else if (input.name === 'salary') {
      if (+input.value < 0) {
        pushNotification(10, 10, 'Error',
          'Salary cannot be negative', 'error');
        break;
      }

      // loop which add input value to table cell
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

  const office = document.createElement('td');

  office.innerText = document.querySelector('select').value;

  newTable.children[1].after(office);
});

// #endregion

// #region edit data region

// helper variable for save previous data
let previousText;

// helper variable to change input type
let typeOfInput;

// helper variable to work with a input in cell
let cellInput;

// helper variable to change cell which now is open to changed
let changedCell;

// helper function to add to table cell text from input
const addTextFromInput = () => {
  const value = cellInput.value;

  if (value === '') {
    changedCell.innerText = previousText;

    return;
  }

  if (cellInput.type === 'number') {
    if (previousText.slice(0, 1) === '$') {
      if (+value > 0) {
        changedCell.innerText = '$' + (+value).toLocaleString('en-US');

        return;
      }

      pushNotification(10, 10, 'Error',
        'Salary cannot be negative', 'error');

      return;
    }

    if (value > 90 || value < 18) {
      pushNotification(10, 10, 'Error',
        'The age value should be between 18 and 90 years', 'error');

      return;
    }

    changedCell.innerText = value;

    return;
  }

  if (cellInput.type === 'text') {
    changedCell.innerText = `${value.slice(0, 1).toUpperCase()}`
     + `${value.slice(1).toLowerCase()}`;
  }
};

const callback = el => {
  changedCell = el.target;

  // disabled the event until the moment will be added value from input
  tableBody.removeEventListener('dblclick', callback);

  previousText = changedCell.innerText;

  cellInput = document.createElement('input');

  cellInput.focus();

  cellInput.classList.add('cell-input');

  // check is this cell is number type or not
  if ('1234567890'.includes(changedCell.innerText.slice(1, 2))) {
    typeOfInput = 'number';
  } else {
    typeOfInput = 'text';
  }

  cellInput.type = typeOfInput;

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

// #endregion

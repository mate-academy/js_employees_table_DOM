'use strict';

const body = document.querySelector('body');

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');

const message = document.createElement('div');
const header = document.createElement('h2');
const text = document.createElement('p');

let rowsArray = Array.from(tBody.rows);

let sortOrder;
let sortHeader;

table.addEventListener('click', function(ev) {
  const elem = ev.target;

  if (elem.tagName !== 'TH') {
    return;
  }

  if (sortHeader !== elem) {
    sortOrder = 'ASC';
    sortHeader = elem;
  } else {
    sortOrder = 'DESC';
    sortHeader = !sortHeader;
  }

  sortlist(elem.cellIndex, elem.dataset.type, sortOrder);
});

function sortlist(colNum, type, order) {
  let compare;

  if (order === 'ASC') {
    compare = function(rowA, rowB) {
      switch (type) {
        case 'string':
          return rowA.cells[colNum].textContent
            .localeCompare(rowB.cells[colNum].textContent);

        case 'number':
          return rowA.cells[colNum].textContent
          - rowB.cells[colNum].textContent;
        case 'salary':
          return toNumber(rowA.cells[colNum].textContent)
          - toNumber(rowB.cells[colNum].textContent);
      }
    };
  } else {
    compare = function(rowB, rowA) {
      switch (type) {
        case 'string':
          return rowA.cells[colNum].textContent
            .localeCompare(rowB.cells[colNum].textContent);
        case 'number':
          return rowA.cells[colNum].textContent
          - rowB.cells[colNum].textContent;
        case 'salary':
          return toNumber(rowA.cells[colNum].textContent)
          - toNumber(rowB.cells[colNum].textContent);
      }
    };
  }

  rowsArray.sort(compare);
  tBody.append(...rowsArray);
}

function toNumber(string) {
  const str = string.replace(',', '.').slice(1);

  return str;
}

const handleListRows = function(ev) {
  const item = ev.target;

  if (item.tagName !== 'TD') {
    return;
  }
  item.parentElement.classList.toggle('active');
};

const preventSelection = function(ev) {
  ev.preventDefault();
};

table.addEventListener('click', handleListRows);
table.addEventListener('mousedown', preventSelection);

// adding form

body.insertAdjacentHTML('beforeend', `
  <form
    class='new-employee-form'
    method = "GET"
    action="/"
  >
    <label>
      Name:
      <input
        type="text"
        name="name"
        data-qa="name"
        minlength="4"
        required
      />
    </label>
    <label>
      Position:
      <input
        type="text"
        name="position"
        data-qa="position"
        minlength="4"
        required
      />
    </label>
    <label>
      Office:
      <select
        name="office"
        data-qa="office"
        required
      >
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        type="number"
        name="age"
        data-qa="age"
        min="18"
        max="90"
        required
      />
    </label>
    <label>
      Salary:
      <input
        type="number"
        name="salary"
        min="0"
        data-qa="salary"
        required
      />
    </label>

    <button type="submit">Save to lable</button>
      
  </form>
`);

const form = document.querySelector('.new-employee-form');

const button = body.querySelector('button');

const inputName = document.querySelector('[data-qa ="name"]');
const inputPosition = document.querySelector('[data-qa ="position"]');
const inputOffice = document.querySelector('[data-qa ="office"]');
const inputAge = document.querySelector('[data-qa ="age"]');
const inputSalary = document.querySelector('[data-qa ="salary"]');

const onlyWithLabels = [...form].filter(element =>
  element.parentElement.tagName === 'LABEL');

button.onclick = (ev) => {
  const correctInputTextLength = [...onlyWithLabels]
    .filter(elem => elem.type === 'text')
    .every(el => el.value.length > 3);

  const correctInputAgeLength = [...onlyWithLabels]
    .filter(elem => elem.dataset.qa === 'age')
    .every(el => el.value > 17 && el.value < 91);

  const correctInputSalaryLength = [...onlyWithLabels]
    .filter(elem => elem.dataset.qa === 'salary')
    .every(el => el.value > 0);

  const allInputsValid = correctInputTextLength
    && correctInputAgeLength
    && correctInputSalaryLength;

  if (allInputsValid) {
    ev.preventDefault();

    tBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${formatValue(inputName.value)}</td>
        <td>${formatValue(inputPosition.value)}</td>
        <td>${inputOffice.value}</td>
        <td>${inputAge.value}</td>
        <td>${formatToString(inputSalary.value)}</td>
      </tr>
    `);

    rowsArray = Array.from(tBody.rows);
  }

  if (!correctInputTextLength) {
    showNotification(10, 10, 'Attention',
      "'The length must be more than 4 digits'", 'error');
  } else if (!correctInputAgeLength) {
    showNotification(10, 10, 'Attention',
      "'The age must be betwen 18 and 90'", 'error');
  } else if (!correctInputSalaryLength) {
    showNotification(10, 10, 'Attention',
      "'Salary must be passed'", 'error');
  } else {
    showNotification(10, 10, 'Congratulation',
      'New employee is added to the form', 'success');
  }
};

function showNotification(posTop, posRight, title, shownText, type) {
  message.className = 'notification';
  header.className = `title`;
  header.textContent = `${title}`;
  text.textContent = `${shownText}`;
  message.classList.add(`${type}`);
  message.append(header, text);
  document.body.append(message);

  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';

  setTimeout(() => {
    message.remove();
  }, 4000);
}

function formatValue(input) {
  const firstLetter = input.slice(0, 1).toUpperCase();
  let val = '';

  for (let i = 1; i < input.length; i++) {
    if (input[i] === ' ') {
      val += ' ' + input[i + 1].toUpperCase();
      i += 2;
    }

    val += input[i];
  }

  return firstLetter + val;
}

function formatToString(input) {
  switch (input.length) {
    case 3:
      return '$' + '0,' + input;
    case 2:
      return '$' + '0,0' + input;
    case 1:
      return '$' + '0,00' + input;
    default:
      return '$' + input.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// editing of table cells

tBody.addEventListener('dblclick', function(ev) {
  const target = ev.target;

  if (target.tagName !== 'TD') {
    return;
  }

  const prevTargetContent = target.textContent;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = prevTargetContent;
  target.textContent = '';
  target.append(input);
  input.focus();

  input.addEventListener('blur', function() {
    if (input.value.length === 0) {
      input.value = prevTargetContent;

      showNotification(10, 10, 'Attention',
        "The field shouldn't be empty \n *Initial value was restored!",
        'error');
    }
    target.textContent = input.value;
    input.remove();
  });

  input.addEventListener('keypress', function(evt) {
    if (input.value.length === 0) {
      input.value = prevTargetContent;

      showNotification(10, 10, 'Attention',
        "The field shouldn't be empty \n *Initial value was restored!",
        'error');
    }

    if (evt.key === 'Enter') {
      target.textContent = input.value;
      input.remove();
      input.blur();
    }
  });
});

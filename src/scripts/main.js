'use strict';

const body = document.querySelector('body');

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');

const message = document.createElement('div');
const header = document.createElement('h2');
const text = document.createElement('p');

let rowsArray = Array.from(tBody.rows);

let clicksOnTable = 0;

table.addEventListener('click', function(ev) {
  clicksOnTable++;

  const elem = ev.target;

  if (elem.tagName !== 'TH') {
    return;
  }
  sortlist(elem.cellIndex, elem.dataset.type);
});

function sortlist(colNum, type) {
  let compare;

  if (clicksOnTable % 2 !== 0) {
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
    compare = function(rowA, rowB) {
      switch (type) {
        case 'string':
          return rowB.cells[colNum].textContent
            .localeCompare(rowA.cells[colNum].textContent);

        case 'number':
          return rowB.cells[colNum].textContent
          - rowA.cells[colNum].textContent;
        case 'salary':
          return toNumber(rowB.cells[colNum].textContent)
          - toNumber(rowA.cells[colNum].textContent);
      }
    };
  }

  rowsArray.sort(compare);

  function toNumber(string) {
    const str = string.replace(',', '.').slice(1);

    return str;
  }

  tBody.append(...rowsArray);
}

const handleListRows = function(ev) {
  const item = ev.target;

  if (item.tagName !== 'TD') {
    return;
  }
  item.parentNode.classList.toggle('active');
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
    .every(el => el.value.length > 0);

  if (correctInputTextLength
    && correctInputAgeLength
    && correctInputSalaryLength) {
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
    showNotification('Attention',
      "'The length must be more than 4 digits'", 'error');
  } else if (!correctInputAgeLength) {
    showNotification('Attention',
      "'The age must be betwen 18 and 90'", 'error');
  } else if (!correctInputSalaryLength) {
    showNotification('Attention',
      "'Salary must be passed'", 'error');
  } else {
    showNotification('Congratulation',
      'New employee is added to the form', 'success');
  }
};

function showNotification(title, shownText, type) {
  message.className = 'notification';
  header.className = `title`;
  header.textContent = `${title}`;
  text.textContent = `${shownText}`;
  message.classList.add(`${type}`);
  message.append(header, text);
  document.body.append(message);

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
  if (input.length === 3) {
    return '$' + '0,' + input;
  }

  if (input.length === 2) {
    return '$' + '0,0' + input;
  }

  if (input.length === 1) {
    return '$' + '0,00' + input;
  }

  return '$' + input.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

      showNotification('Attention',
        "The field shouldn't be empty \n *Initial value was restored!",
        'error');
    }
    target.textContent = input.value;
    input.remove();
  });

  input.addEventListener('keypress', function(evt) {
    if (input.value.length === 0) {
      input.value = prevTargetContent;

      showNotification('Attention',
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

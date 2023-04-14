'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = [...tbody.rows];
const nameLength = 4;
const minAge = 18;
const maxAge = 90;
const timeoutOfMessage = 1000;
let compare = -1;
let isValidData;
let editingCell;
let isCorrect = true;

body.style.userSelect = 'none';

// sorting of the table

function ascSorting(i, column, dsc) {
  function convertNumber(string) {
    return +string.slice(1).split(',').join('');
  }

  rows.sort((first, second) => {
    const a = first.children[i].innerHTML;
    const b = second.children[i].innerHTML;

    switch (column) {
      case 'Name':
      case 'Position':
      case 'Office':
        return a.localeCompare(b);

      case 'Age':
        return a - b;

      case 'Salary':
        return convertNumber(a) - convertNumber(b);
    }
  });

  if (dsc) {
    rows.reverse();
  }

  tbody.append(...rows);
}

thead.addEventListener('click', e => {
  const th = e.target.closest('th');
  const index = th.cellIndex;

  ascSorting(index, th.innerText, compare === index);

  compare = (compare === index) ? -1 : index;
});

// select row

tbody.addEventListener('click', e => {
  const tr = e.target.closest('tr');

  rows.forEach(row => {
    row.removeAttribute('class');
  });

  tr.classList.add('active');
});

// create form and validate data

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label> Name:
    <input type="text" name = "name" data-qa="name" required>
  </label>
  <label> Position:
    <input type="text" name = "position" data-qa="position">
  </label>
  <label> Office:
    <select name = "office" data-qa="office" required>
      <option value="" selected disabled>Choose office</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label> Age:
    <input type="number" name = "age" data-qa="age" required>
  </label>
  <label> Salary:
    <input type="number" name = "salary" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`;

body.append(form);

function showMessage(posTop, posRight, title, description, type) {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  messageTitle.innerText = title;
  messageDescription.innerText = description;

  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');
  messageTitle.classList.add('title');

  message.append(messageTitle, messageDescription);
  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, timeoutOfMessage);
};

function validateData(data) {
  if (data.get('name').trim().length < nameLength
    || /\d/.test(data.get('name'))) {
    showMessage(
      450, 10,
      'ERROR',
      'Name value has less than 4 letters or numbers!'
    );

    isValidData = false;
  } else if (data.get('age') < minAge
  || data.get('age') > maxAge) {
    showMessage(
      450, 10,
      'ERROR',
      'Age value is less than 18 or more than 90!'
    );

    isValidData = false;
  } else {
    isValidData = true;
  }
};

form.addEventListener('submit', e => {
  const data = new FormData(form);
  const dataSalary = data.get('salary');
  let inputSalary = dataSalary;

  if (dataSalary.length > 3) {
    inputSalary
    = dataSalary.slice(0, -3)
    + ','
    + dataSalary.slice(-3, dataSalary.length);
  }

  const salary = `$${inputSalary}`;

  e.preventDefault();
  validateData(data);

  if (!isValidData) {
    return;
  }

  const newRow = tbody.insertRow();

  newRow.insertCell(0).innerText = data.get('name');
  newRow.insertCell(1).innerText = data.get('position');
  newRow.insertCell(2).innerText = data.get('office');
  newRow.insertCell(3).innerText = data.get('age');
  newRow.insertCell(4).innerText = salary;

  rows.push(newRow);

  form.reset();

  showMessage(
    450, 10,
    'SUCCESS!',
    'New employee is successfully added to the table!');
});

// editing of table cells

function validate(i, cell) {
  switch (i) {
    case 0:
    case 1:
      if (/\d/.test(cell.value)
        || cell.value.trim().length < nameLength) {
        isCorrect = false;

        showMessage(
          450, 10,
          'ERROR',
          'Value has less than 4 letters or include numbers!');
      }

      break;

    case 3:
      if (cell.value < 18
        || cell.value > 90) {
        if (cell.value === '') {
          isCorrect = false;

          return;
        }

        isCorrect = false;

        showMessage(
          450, 10,
          'ERROR',
          'The age must be 18+ and less than 90.');
      }

      break;

    case 4:
      if (+cell.value <= 0) {
        if (cell.value === '') {
          isCorrect = false;

          return;
        }

        isCorrect = false;

        showMessage(
          450, 10,
          'ERROR',
          'Salary must be more than 0!');
      }

      break;
  }
}

function editEnd(td, isFine) {
  if (isFine) {
    switch (td.cellIndex) {
      case 4:
        td.innerHTML = `${(+td.firstChild.value)
          .toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
          .slice(0, -3)}`;

        showMessage(
          450, 10,
          'SUCCESS',
          'Table was successfully changed!');
        break;

      case 0:
      case 1:
      case 3:
        td.innerHTML = td.firstChild.value;

        showMessage(
          450, 10,
          'SUCCESS',
          'Table was successfully changed!');
        break;
    }
  } else {
    if (td.firstChild.value === '') {
      td.innerHTML = editingCell.data;

      return;
    }

    return editStart(td);
  }

  editingCell = null;
};

function changeIsCorrect() {
  isCorrect = true;
}

function editStart(td) {
  editingCell = {
    element: td,
    data: td.innerHTML,
  };

  if (td.cellIndex === 2) {
    const cellOffice = document.createElement('select');

    cellOffice.className = 'cell-input';

    cellOffice.innerHTML = `
      <option value="Choose office" selected disabled>Choose office</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `;

    td.innerHTML = '';
    td.append(cellOffice);
    cellOffice.focus();

    cellOffice.onblur = () => {
      const office = cellOffice.selectedIndex;

      td.innerHTML = cellOffice[office].value;

      if (cellOffice.selectedIndex === 0) {
        td.innerHTML = editingCell.data;
      }

      showMessage(
        450, 10,
        'SUCCESS',
        'Table was successfully changed!');
    };

    cellOffice.onkeydown = (enter) => {
      if (enter.key === 'Enter') {
        cellOffice.onblur();
      }
    };
  } else {
    const cellInput = document.createElement('input');

    cellInput.className = 'cell-input';
    cellInput.innerHTML = td.innerHTML;
    td.innerHTML = '';
    td.append(cellInput);
    cellInput.focus();

    switch (td.cellIndex) {
      case 0:
      case 1:
        cellInput.setAttribute('type', 'text');
        break;

      case 3:
      case 4:
        cellInput.setAttribute('type', 'number');
        break;
    }

    cellInput.onblur = (e) => {
      validate(td.cellIndex, cellInput);
      editEnd(editingCell.element, isCorrect);
      changeIsCorrect();
    };

    cellInput.onkeydown = (enter) => {
      if (enter.key === 'Enter') {
        cellInput.onblur();
      }
    };
  }
};

tbody.addEventListener('dblclick', e => {
  const target = e.target.closest('td');
  const input = document.querySelector('.cell-input');

  if (input) {
    showMessage(
      450, 10,
      'ERROR',
      'You must finished current cell!');

    return editStart(input.parentElement);
  }

  if (!target) {
    return;
  }

  editStart(target);
});

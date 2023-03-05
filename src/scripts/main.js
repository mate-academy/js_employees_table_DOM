'use strict';

const table = document.body.querySelector('table');
const tHeaders = Array.from(document.body.querySelector('thead')
  .rows[0]
  .children
);
const tBody = document.body.querySelector('tbody');
let tBodyRows = Array.from(tBody.children);
let activeRow;
let prevTarget;

tHeaders.forEach((header) => header.addEventListener('click', toSort));

tBodyRows.forEach((row) => {
  row.addEventListener('click', select);
});

const form = document.createElement('form');

form.method = 'GET';
form.action = '/';
form.classList.add('new-employee-form');
table.after(form);

form.insertAdjacentHTML(
  'afterbegin',
  `
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
    <input name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button name="saveToTable" type="submit" value="saveToTable">
    Save to table
  </button>
`
);

const labels = Array.from(form.querySelectorAll('label'));
let bodyTds = Array.from(tBody.querySelectorAll('td'));

form.addEventListener('submit', addRow);

bodyTds.forEach((td) => {
  td.addEventListener('dblclick', editing);
});

function select(e) {
  const target = e.target.closest('tr');

  if (target !== activeRow) {
    target.classList.add('active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }
  }
  activeRow = target;
}

function pushNotification(title, description, type) {
  const element = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  element.className = `notification ${type}`;
  element.dataset.qa = 'notification';
  document.body.append(element);
  element.style.top = 10 + 'px';
  element.style.right = 10 + 'px';

  messageTitle.className = 'title';
  messageTitle.innerText = title;
  element.append(messageTitle);

  messageDescription.innerText = description;
  element.append(messageDescription);

  setTimeout(() => {
    element.hidden = true;
  }, 4000);
};

function toSort(e) {
  const target = e.target;
  const columnNumber = tHeaders.indexOf(target);

  if (prevTarget !== target) {
    target.countClick = 0;
  }

  if (!target.countClick) {
    target.countClick = 1;
  } else {
    target.countClick = 2;
  }

  if (!table.contains(target)) {
    return;
  }

  const sortedList = tBodyRows.sort((a, b) => {
    const dataA = a.children[columnNumber].textContent;
    const dataB = b.children[columnNumber].textContent;

    switch (columnNumber) {
      case 3:
        if (target.countClick === 2) {
          return Number(dataB) - Number(dataA);
        }

        return Number(dataA) - Number(dataB);

      case 4:
        if (target.countClick === 2) {
          return salaryToNumber(dataB) - salaryToNumber(dataA);
        }

        return salaryToNumber(dataA) - salaryToNumber(dataB);

      default:
        if (target.countClick === 2) {
          return dataB.localeCompare(dataA);
        }

        return dataA.localeCompare(dataB);
    }
  });

  if (target.countClick === 2) {
    target.countClick = 0;
  }

  sortedList.forEach((item) => tBody.append(item));

  prevTarget = target;
}

function salaryToNumber(string) {
  const salary = string.slice(1).split(',').join('');

  return Number(salary);
}

function addRow(e) {
  e.preventDefault();

  if (!validation()) {
    return;
  };

  const aditedRow = tBodyRows[tBodyRows.length - 1].cloneNode(true);
  const aditedRowTds = Array.from(aditedRow.children);
  let count = 0;

  tBody.append(aditedRow);

  labels.forEach((label) => {
    const inputValue = label.firstElementChild.value.trim();

    switch (true) {
      case count === 3:
        aditedRowTds[count].textContent = inputValue;
        break;

      case count === 4:
        aditedRowTds[count].textContent = Number(inputValue).toLocaleString(
          'es-US',
          {
            style: 'currency',
            currency: 'USD',
          }
        ).split('.')[0];
        break;

      default:
        const apperCaseValue
          = inputValue.slice(0, 1).toUpperCase() + inputValue.slice(1);

        aditedRowTds[count].textContent = apperCaseValue;
    }

    count++;
  });

  pushNotification(
    'Success',
    'Employee has been added to the table',
    'success'
  );

  tBodyRows = Array.from(tBody.children);
  bodyTds = Array.from(tBody.querySelectorAll('td'));
  aditedRow.addEventListener('click', select);
  aditedRowTds.forEach((td) => td.addEventListener('dblclick', editing));
}

function validation(e) {
  const emplName = form.elements.name.value;
  const position = form.elements.position.value;
  const age = form.elements.age.value;
  const salary = form.elements.salary.value;

  if (emplName.length < 4) {
    pushNotification(
      'Error',
      "Oops, something wasn't right\n " + 'Please enter valid data',
      'error'
    );

    return false;
  }

  if (!isNaN(Number(emplName))) {
    pushNotification(
      'Error',
      "Oops, something wasn't right\n " + 'Please enter valid data',
      'error'
    );

    return false;
  }

  if (position.length < 2) {
    pushNotification(
      'Error',
      "Oops, something wasn't right\n " + 'Please enter valid data',
      'error'
    );

    return false;
  }

  if (!isNaN(Number(position))) {
    pushNotification(
      'Error',
      "Oops, something wasn't right\n " + 'Please enter valid data',
      'error'
    );

    return false;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      'Error',
      "Oops, something wasn't right\n " + 'Please enter the valid data',
      'error'
    );

    return false;
  }

  if (!salary) {
    pushNotification(
      'Error',
      "Oops, something wasn't right\n " + 'Please enter the valid data',
      'error'
    );

    return false;
  }

  return true;
}

function editing(e) {
  const target = e.target;
  const targetValue = target.textContent;

  target.textContent = '';

  const newInput = document.createElement('input');
  let newInputValue;

  if (Number(targetValue) || salaryToNumber(targetValue)) {
    newInput.type = 'number';
  } else {
    newInput.type = 'text';
  }

  newInput.classList.add('cell-input');
  target.append(newInput);
  newInput.focus();

  newInput.addEventListener('keydown', (ev) => {
    if (newInput.type === 'text' && ev.key >= 0 && ev.key <= 9) {
      ev.preventDefault();
    }
  });

  newInput.addEventListener('blur', () => {
    if (newInput.value) {
      switch (true) {
        case !Number(targetValue)
          && newInput.type === 'number':
          newInputValue = Number(newInput.value)
            .toLocaleString('es-US', {
              style: 'currency',
              currency: 'USD',
            })
            .split('.')[0];
          break;

        case newInput.type === 'text':
          newInputValue
            = newInput.value[0].toUpperCase() + newInput.value.slice(1);
          break;

        default:
          newInputValue = newInput.value;
      }
    }

    target.textContent = (newInput.value === '') ? targetValue : newInputValue;

    newInput.remove();
  });

  newInput.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      if (newInput.value) {
        switch (true) {
          case !Number(newInputValue) && salaryToNumber(newInputValue):
            newInputValue = Number(newInput.value)
              .toLocaleString('es-US', {
                style: 'currency',
                currency: 'USD',
              })
              .split('.')[0];
            break;

          case newInput.type === 'text':
            newInputValue
                  = newInput.value[0].toUpperCase() + newInput.value.slice(1);
            break;

          default:
            newInputValue = newInput.value;
        }
      }

      target.textContent = newInput.value === '' ? targetValue : newInputValue;

      newInput.remove();
    };
  });
}

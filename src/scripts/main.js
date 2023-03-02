'use strict';

const theadRef = document.querySelector('thead');
const tbodyRef = document.querySelector('tbody');
const tableHeaders = theadRef.querySelectorAll('th');
const tableRows = [...tbodyRef.querySelectorAll('tr')];

// 1. Implement table sorting by clicking on the
// title (in two directions).
const ascClass = 'asc';

theadRef.addEventListener('click', (e) => {
  const currentRows = [...tbodyRef.querySelectorAll('tr')];
  const headerIndex = e.target.cellIndex;

  e.target.classList.toggle(ascClass);

  const isAsc = e.target.classList.contains(ascClass);

  currentRows.sort((a, b) => {
    const valueType = e.target.textContent;
    const aText = a.cells[headerIndex].textContent;
    const bText = b.cells[headerIndex].textContent;

    switch (valueType) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (isAsc) {
          return aText.localeCompare(bText);
        }

        return bText.localeCompare(aText);

      case 'Age':
        if (isAsc) {
          return aText - bText;
        }

        return bText - aText;

      case 'Salary':
        const normalizeSalary = (item) => item.slice(1).split(',').join('');

        if (isAsc) {
          return normalizeSalary(aText) - normalizeSalary(bText);
        }

        return normalizeSalary(bText) - normalizeSalary(aText);

      default:
    }
  });

  currentRows.forEach(item => tbodyRef.append(item));
});

// 2. When user clicks on a row, it should become selected.

const activeClass = 'active';

tbodyRef.addEventListener('click', (e) => {
  tableRows.forEach(item => item.classList.remove(activeClass));
  e.target.parentElement.classList.add(activeClass);
});

// 3. Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
// 4. Show notification if form data is invalid
// (use notification from the previous tasks).

function standardizeString(str) {
  return str
    .split(' ')
    .map(item => item.trim())
    .filter(item => item)
    .map(item => item.toLowerCase())
    .map(item => item[0].toUpperCase() + item.slice(1) + ' ')
    .join('');
}

const formEl = document.createElement('form');

formEl.classList.add('new-employee-form');

tableHeaders.forEach(item => {
  const labelEl = document.createElement('label');
  const headerTitle = item.textContent;

  labelEl.textContent = item.textContent + ':';

  if (headerTitle !== 'Office') {
    const inputEl = document.createElement('input');

    if (headerTitle === 'Age' || headerTitle === 'Salary') {
      inputEl.type = 'number';
      inputEl.min = 1;
    } else {
      inputEl.type = 'text';
    }

    inputEl.name = headerTitle.toLowerCase();
    inputEl.dataset.qa = headerTitle.toLowerCase();
    inputEl.required = true;

    labelEl.append(inputEl);
  } else {
    const selectEl = document.createElement('select');
    const selectOptions = ['Tokyo', 'Singapore', 'London', 'New York',
      'Edinburgh', 'San Francisco'];

    selectOptions.forEach(city => {
      const optionEl = document.createElement('option');

      optionEl.textContent = city;
      selectEl.append(optionEl);
    });

    selectEl.name = headerTitle.toLowerCase();
    selectEl.dataset.qa = headerTitle.toLowerCase();
    selectEl.required = true;
    labelEl.append(selectEl);
  }

  formEl.append(labelEl);
});

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

formEl.append(submitBtn);
document.body.append(formEl);

formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  if (document.querySelector('.notification')) {
    document.querySelector('.notification').remove();
  }

  const data = new FormData(formEl);
  const dataObj = Object.fromEntries(data.entries());
  const rowEl = document.createElement('tr');

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification');

  notificationTitle.classList.add('title');

  dataObj.salary = '$' + new Intl.NumberFormat('en-US').format(dataObj.salary);

  const addError = (message) => {
    notification.classList.add('error');
    notificationTitle.textContent = 'Error';

    notificationDescription.textContent = message;
  };

  if (dataObj.name.length < 4 || (!isNaN(dataObj.name))) {
    addError('Name must contain '
    + 'at least 4 characters and have no numbers');
  } else if (dataObj.position.length < 4 || (!isNaN(dataObj.position))) {
    addError('Position must contain '
    + 'at least 4 characters and have no numbers');
  } else if (dataObj.age < 18 || dataObj.age > 90) {
    addError('Age must be between 18 and 90');
  } else {
    notification.classList.add('success');
    notificationTitle.textContent = 'Success';

    notificationDescription.textContent = 'Person was added to the list';

    for (const key in dataObj) {
      const cellEl = document.createElement('td');

      if (isNaN(dataObj[key])) {
        dataObj[key] = standardizeString(dataObj[key]);
      }

      cellEl.textContent = dataObj[key];
      rowEl.append(cellEl);
    }
    tbodyRef.append(rowEl);
    e.target.reset();
  }

  notification.append(notificationTitle, notificationDescription);
  document.body.append(notification);
  setTimeout(() => notification.remove(), 3000);
});

// 5. Implement editing of table cells by double-clicking on it.

tbodyRef.addEventListener('dblclick', (e) => {
  const oldText = e.target.textContent;

  e.target.textContent = '';

  const inputEl = document.createElement('input');

  inputEl.classList.add('cell-input');
  e.target.append(inputEl);
  inputEl.focus();

  function validateInput(cell) {
    switch (cell) {
      case 0:
      case 1:
      case 2:
        if (!isNaN(inputEl.value) || inputEl.value.length === 0) {
          e.target.textContent = oldText;
        } else {
          e.target.textContent = standardizeString(inputEl.value);
        }
        break;

      case 3:
        if (isNaN(inputEl.value) || inputEl.value.length === 0) {
          e.target.textContent = oldText;
        } else {
          e.target.textContent = inputEl.value;
        }
        break;

      case 4:
        if (isNaN(inputEl.value) || inputEl.value.length === 0) {
          e.target.textContent = oldText;
        } else {
          e.target.textContent = '$' + new Intl.NumberFormat('en-US')
            .format(inputEl.value);
        }
        break;
      default:
    }
  }

  inputEl.addEventListener('blur', (evnt) => {
    const index = e.target.cellIndex;

    validateInput(index);
  });

  inputEl.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'Enter') {
      const index = e.target.cellIndex;

      validateInput(index);
    }
  });
});

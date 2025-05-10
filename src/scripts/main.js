'use strict';

// filter elements

const table = document.querySelector('table');
const tbody = table.tBodies[0];
const header = table.tHead;
let isASCSorted = true;
const getSalary = (salaryString) => {
  return Number(salaryString
    .slice(1)
    .replace(',', ''));
};

header.addEventListener('click', (e) => {
  const rows = Array.from(table.tBodies[0].rows);
  const columnName = e.target.innerText;
  const index = e.target.cellIndex;

  rows.sort((rowA, rowB) => {
    const cellValueA = isASCSorted
      ? rowA.cells[index].innerText
      : rowB.cells[index].innerText;
    const cellValueB = isASCSorted
      ? rowB.cells[index].innerText
      : rowA.cells[index].innerText;

    if (columnName === 'Salary') {
      return getSalary(cellValueA) - getSalary(cellValueB);
    }

    if (typeof cellValueA === 'string') {
      return cellValueA.localeCompare(cellValueB);
    }

    return cellValueA - cellValueB;
  });

  rows.forEach(row => tbody.append(row));
  isASCSorted = !isASCSorted;
});

// select row on element click

tbody.addEventListener('click', (e) => {
  const row = e.target.parentElement;

  row.classList.add('active');

  row.addEventListener('mouseleave', () => {
    row.classList.remove('active');
  });
});

// form added

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name: <input name="name" type="text" data-qa="name"></label>

    <label>Position: <input name="position" type="text" data-qa="position">
    </label>

    <label>Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>

        <option>Singapore</option>

        <option>London</option>

        <option>New York</option>

        <option>Edinburgh</option>

        <option>San Francisco</option>
      </select>
    </label>

    <label>Age: <input name="age" type="number" data-qa="age"></label>

    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>

    <button>Save to table</button>
  </form>`
);
// notification creation

const createNotification = (type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  const titleMessage = type === 'success'
    ? 'Success!'
    : 'Error occurred!';
  const descriptionMessage = type === 'success'
    ? 'New employee added.'
    : 'Please, enter correct data!';

  notification.innerHTML = `
    <h2 class="title">${titleMessage}</h2>
    <p>${descriptionMessage}</p>`;
  document.body.append(notification);
};

// validation form and new employee adding

const formButton = document.querySelector('button');
const nameInput = document.querySelector('[name = name]');
const positionInput = document.querySelector('[name = position]');
const officeSelect = document.querySelector('[name = office]');
const ageInput = document.querySelector('[name = age]');
const salaryInput = document.querySelector('[name = salary]');
const convertSalary = (salary) => Number(salary)
  .toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  });

const validateForm = () => {
  switch (true) {
    case nameInput.value.length < 4:
    case Number(ageInput.value) < 18:
    case Number(ageInput.value) > 90:
    case salaryInput.value:
    case positionInput.value:
      return false;
    default:
      return true;
  }
};

const addEmployee = () => {
  tbody.insertAdjacentHTML('beforeend', `
  <td>${nameInput.value}</td>

  <td>${positionInput.value}</td>

  <td>${officeSelect.value}</td>

  <td>${Number(ageInput.value)}</td>

  <td>${convertSalary(salaryInput.value)}</td>
`);
  nameInput.value = '';
  positionInput.value = '';
  officeSelect.value = '';
  ageInput.value = '';
  salaryInput.value = '';
};

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  setTimeout(() => {
    document.querySelector('.notification').remove();
  }, 3000);

  if (!validateForm()) {
    createNotification('error');

    return;
  }

  createNotification('success');
  addEmployee();
});

// table-cells editing

tbody.addEventListener('dblclick', (e) => {
  const inputElement = document.createElement('input');
  const index = e.target.cellIndex;
  const offices = Array.from(officeSelect.children).map(option =>
    option.innerHTML);
  const validateNewValue = (value) => {
    switch (true) {
      case !value.length:
      case index === 2 && !offices.includes(value):
      case ((index === 3 || index === 4) && isNaN(+value)) || +value <= 0:
        return e.target.innerHTML;
      case index === 4 && !isNaN(+value):
        return convertSalary(value);
      default:
        return value;
    }
  };
  const addTextHandler = () => {
    const newCell = document.createElement('td');

    newCell.innerHTML = validateNewValue(inputElement.value);
    inputElement.replaceWith(newCell);
  };

  inputElement.classList.add('cell-input');
  inputElement.value = e.target.innerHTML;
  e.target.replaceWith(inputElement);
  inputElement.addEventListener('blur', addTextHandler);
  inputElement.addEventListener('mouseout', addTextHandler);

  inputElement.addEventListener('keypress', (ev) => {
    if (ev.key !== 'Enter') {
      return;
    }
    addTextHandler();
  });
});

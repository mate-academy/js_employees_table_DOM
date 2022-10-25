'use strict';

document.body.style.alignItems = 'flex-start';

const table = document.querySelector('table');
const tHead = table.tHead;
const headings = [...tHead.rows[0].cells];
const tableBody = document.querySelector('tbody');
const workersData = () => [...table.tBodies[0].rows];

const notification = createPush();
const checker = checkClick();

const messages = require('./messages.json');

const [
  pushEmptyFields,
  pushInvalidNameText,
  pushInvalidNameLength,
  pushInvalidPosition,
  pushInvalidAge,
  pushSuccessAdd,
  pushEmptyCell,
  pushCellNotNumber,
  pushCellSaved,
  pushCellNotString,
  pushCellWrongOffice,
] = messages;

workersData().forEach(el => {
  [...el.cells].forEach(cell => {
    cell.style.userSelect = 'none';
  });
});

class Employee {
  constructor(fullName, position, office, age, salary) {
    this.name = fullName;
    this.position = position;
    this.office = office;
    this.age = +age;
    this.salary = this.getSalaryNum(salary);
  }

  getSalaryNum(str) {
    return +str.slice(1).split(',').join('');
  }
}

const employees = () => workersData().map(el => {
  const [
    fullName,
    position,
    office,
    age,
    salary,
  ] = getWorkerInfo([...el.cells]);

  return new Employee(fullName, position, office, age, salary);
});

tHead.addEventListener('click', (clickEvent) => {
  const target = clickEvent.target;
  const condition = target.innerText.toLowerCase();

  headings.forEach(el => {
    if (el === target) {
      el.style.color = '#fff400';
    } else {
      el.style.color = '#fff';
    }
  });

  tableBody.innerHTML = `
  ${sort(employees(), condition, checker(condition)).map(el => `
    <tr>
      <td>${el.name}</td>
      <td>${el.position}</td>
      <td>${el.office}</td>
      <td>${el.age}</td>
      <td>${getSalaryStr(el.salary)}</td>
    </tr>
  `).join('')}
  `;
});

tableBody.addEventListener('click', clickEvent => {
  const target = clickEvent.target;

  workersData().forEach(el => {
    if (el.contains(target)) {
      el.classList.toggle('active');
    } else {
      el.closest('tr').classList.remove('active');
    }
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

const officeCities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const formInputs = [
  ['Name', 'text'],
  ['Position', 'text'],
  ['Age', 'number'],
  ['Salary', 'number'],
];

for (const [input, type] of formInputs) {
  form.append(addInput(input, type));
}

form.querySelector(':nth-child(2)').after((() => {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.innerText = 'Office: ';
  label.append(select);

  select.name = 'office';
  select.dataset.qa = 'office';

  for (const city of officeCities) {
    select.append(new Option(city, city));
  }

  return label;
})());

form.append((() => {
  const button = document.createElement('button');

  button.type = 'submit';
  button.innerText = 'Save to table';

  return button;
})());

form.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();

  const data = [...form.elements].map(el => el.value).slice(0, -1);
  const newRow = document.createElement('tr');

  if (data.some(input => !input)) {
    notification(pushEmptyFields);

    return;
  }

  if (!data[0].match(/^[a-zA-Z ]*$/g)) {
    notification(pushInvalidNameText);

    return;
  }

  if (data[0].length < 4) {
    notification(pushInvalidNameLength);

    return;
  }

  if (!data[1].match(/^[a-zA-Z ]*$/g)) {
    notification(pushInvalidPosition);

    return;
  }

  if (+data[3] < 18 || +data[3] > 90) {
    notification(pushInvalidAge);

    return;
  }

  tableBody.append(newRow);

  data.forEach((input, i) => {
    const cell = document.createElement('td');

    if (i === 4) {
      cell.innerText = getSalaryStr(input);
    } else {
      cell.innerText = input;
    }

    newRow.append(cell);
  });

  notification(pushSuccessAdd);

  form.reset();
});

tableBody.addEventListener('dblclick', clickEvent => {
  const target = clickEvent.target;

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'text';
  input.name = 'cellInput';

  const initialValue = target.innerText;

  target.innerText = '';
  target.append(input);
  input.focus();

  const isAge = target.cellIndex === 3;
  const isSalary = target.cellIndex === 4;
  const isName = target.cellIndex === 0;
  const isOffice = target.cellIndex === 2;
  const isStringField = target.cellIndex === 0
    || target.cellIndex === 1;

  function changeCellContent(pushMessage, value = initialValue) {
    target.innerText = value;
    notification(pushMessage);
    input.remove();
  }

  function saveEditedField() {
    if (!input.value) {
      changeCellContent(pushEmptyCell);

      return;
    }

    if ((isAge || isSalary) && !input.value.match(/[0-9]/)) {
      changeCellContent(pushCellNotNumber);

      return;
    }

    if (isStringField && input.value.match(/[0-9]/)) {
      changeCellContent(pushCellNotString);

      return;
    }

    if (isSalary && input.value.match(/[0-9]/)) {
      changeCellContent(pushCellSaved, getSalaryStr(input.value));

      return;
    }

    if (isName && input.value.length < 4) {
      changeCellContent(pushInvalidNameLength);

      return;
    }

    if (isName && !input.value.match(/^[a-zA-Z ]*$/g)) {
      changeCellContent(pushInvalidNameText);

      return;
    }

    if (isAge && (+input.value < 18 || +input.value > 90)) {
      changeCellContent(pushInvalidAge);

      return;
    }

    if (isOffice && !officeCities.includes(input.value)) {
      changeCellContent(pushCellWrongOffice);

      return;
    }

    changeCellContent(pushCellSaved, input.value);
  }

  input.onblur = () => {
    saveEditedField();
  };

  input.onkeydown = (keyboardEvent) => {
    const isEnter = keyboardEvent.code === 'Enter';

    if (isEnter) {
      saveEditedField();
    }
  };
});

function getWorkerInfo(workerData) {
  return workerData.map(el => el.innerText);
}

function sort(workers, value, orderASC) {
  if (orderASC) {
    return workers.sort(
      ({ [value]: a }, { [value]: b }) => typeof a === 'string'
        ? a.localeCompare(b)
        : a - b
    );
  }

  return workers.sort(
    ({ [value]: a }, { [value]: b }) => typeof a === 'string'
      ? b.localeCompare(a)
      : b - a
  );
}

function checkClick() {
  let action = '';
  let orderASC = false;

  return function(value) {
    if (!action || action === value) {
      orderASC = !orderASC;
      action = value;
    } else {
      action = value;
      orderASC = true;
    }

    return orderASC;
  };
}

function createPush() {
  let counter = 0;

  return function({ title, description, type }) {
    const messageContainer = document.createElement('div');

    messageContainer.className = `notification ${type}`;
    document.body.append(messageContainer);
    messageContainer.dataset.qa = 'notification';

    messageContainer.innerHTML = `
      <h2 class="title">
        ${title}
      </h2>

      <p>
        ${description}
      </p>
    `;

    if ([...document.querySelectorAll('div')].length === 1) {
      counter = 0;
    }

    if (!counter) {
      counter++;
    } else {
      messageContainer.style.top = `
      ${(20 * counter)
        + messageContainer.getBoundingClientRect().height
        * (counter)}px
    `;
      counter++;
    }

    setTimeout(() => messageContainer.remove(), 2000);
  };
}

function getSalaryStr(num) {
  return '$' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function addInput(inputName, inputType) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.innerText = inputName + ': ';
  input.type = inputType;
  input.name = inputName.toLowerCase();
  input.dataset.qa = inputName.toLowerCase();

  label.append(input);

  return label;
}

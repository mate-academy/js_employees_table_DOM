'use strict';

document.body.style.alignItems = 'flex-start';

const table = document.querySelector('table');
const tHead = table.tHead;
const headings = [...tHead.rows[0].cells];
const tableBody = document.querySelector('tbody');
const workersData = () => [...table.tBodies[0].rows];

const notification = createPush();
const checker = checkClick();

const pushEmptyFields = {
  title: 'All fields are required',
  description: 'Please\n '
    + 'fill out all form fields',
  type: 'error',
};

const pushInvalidNameText = {
  title: 'Invalid name',
  description: 'Name must contain\n '
    + 'only English alphabet characters or spaces',
  type: 'error',
};

const pushInvalidNameLength = {
  title: 'Invalid name',
  description: `Name must not be\n `
    + 'shorter than 4 characters',
  type: 'error',
};

const pushInvalidPosition = {
  title: 'Invalid position name',
  description: 'position name must contain\n '
    + 'only English alphabet characters or spaces',
  type: 'error',
};

const pushInvalidAge = {
  title: 'Invalid age',
  description: 'Please\n '
    + 'insert correct age',
  type: 'error',
};

const pushSuccessAdd = {
  title: 'Data added',
  description: 'New employee\n '
    + 'successfully added to the table',
  type: 'success',
};

const pushEmptyCell = {
  title: 'Empty Field',
  description: 'Field is empty!\n '
    + 'Data didn\'t saved',
  type: 'error',
};

const pushCellNotNumber = {
  title: 'Not a number',
  description: 'Please\n '
    + 'insert a number',
  type: 'error',
};

const pushCellSaved = {
  title: 'Data saved',
  description: 'Information\n '
    + 'is refreshed',
  type: 'success',
};

const pushCellNotString = {
  title: 'Invalid data',
  description: 'Data must contain\n '
    + 'only English alphabet characters or spaces',
  type: 'error',
};

const pushCellWrongOffice = {
  title: 'Invalid data',
  description: 'Office in this city\n '
    + 'doesn\'t exist',
  type: 'error',
};

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

form.querySelector(':nth-child(2)').insertAdjacentElement('afterend', (() => {
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
    || target.cellIndex === 1
    || target.cellIndex === 2;

  input.onblur = () => {
    if (!input.value) {
      target.innerText = initialValue;
      notification(pushEmptyCell);
      input.remove();

      return;
    }

    if ((isAge || isSalary) && !input.value.match(/[0-9]/)) {
      target.innerText = initialValue;
      notification(pushCellNotNumber);
      input.remove();

      return;
    }

    if (isStringField && input.value.match(/[0-9]/)) {
      target.innerText = initialValue;
      notification(pushCellNotString);
      input.remove();

      return;
    }

    if (isSalary && input.value.match(/[0-9]/)) {
      target.innerText = getSalaryStr(input.value);
      notification(pushCellSaved);
      input.remove();

      return;
    }

    if (isName && input.value.length < 4) {
      target.innerText = initialValue;
      notification(pushInvalidNameLength);
      input.remove();

      return;
    }

    if (isName && !input.value.match(/^[a-zA-Z ]*$/g)) {
      target.innerText = initialValue;
      notification(pushInvalidNameText);
      input.remove();

      return;
    }

    if (isAge && (+input.value < 18 || +input.value > 90)) {
      target.innerText = initialValue;
      notification(pushInvalidAge);
      input.remove();

      return;
    }

    if (isOffice && !officeCities.includes(input.value)) {
      target.innerText = initialValue;
      notification(pushCellWrongOffice);
      input.remove();

      return;
    }

    target.innerText = input.value;
    notification(pushCellSaved);
    input.remove();
  };

  input.onkeydown = (keyboardEvent) => {
    const isEnter = keyboardEvent.code === 'Enter';

    if (!input.value && isEnter) {
      target.innerText = initialValue;
      notification(pushEmptyCell);
      input.remove();

      return;
    }

    if ((isAge || isSalary) && !input.value.match(/[0-9]/) && isEnter) {
      target.innerText = initialValue;
      notification(pushCellNotNumber);
      input.remove();

      return;
    }

    if (isStringField && input.value.match(/[0-9]/) && isEnter) {
      target.innerText = initialValue;
      notification(pushCellNotString);
      input.remove();

      return;
    }

    if (isSalary && input.value.match(/[0-9]/) && isEnter) {
      target.innerText = getSalaryStr(input.value);
      notification(pushCellSaved);
      input.remove();

      return;
    }

    if (isName && input.value.length < 4 && isEnter) {
      target.innerText = initialValue;
      notification(pushInvalidNameLength);
      input.remove();

      return;
    }

    if (isName && !input.value.match(/^[a-zA-Z ]*$/g) && isEnter) {
      target.innerText = initialValue;
      notification(pushInvalidNameText);
      input.remove();

      return;
    }

    if (isAge && (+input.value < 18 || +input.value > 90) && isEnter) {
      target.innerText = initialValue;
      notification(pushInvalidAge);
      input.remove();

      return;
    }

    if (isOffice && !officeCities.includes(input.value) && isEnter) {
      target.innerText = initialValue;
      notification(pushCellWrongOffice);
      input.remove();

      return;
    }

    if (isEnter) {
      target.innerText = input.value;
      notification(pushCellSaved);
      input.remove();
    }
  };
});

function getWorkerInfo(workerData) {
  return workerData.map(el => el.innerText);
}

function sort(workers, value, count) {
  if (count % 2 !== 0) {
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
  let counter = 0;

  return function(value) {
    if (!action || action === value) {
      counter++;
      action = value;
    } else {
      action = value;
      counter = 1;
    }

    return counter;
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

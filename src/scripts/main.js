'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const header = table.querySelectorAll('thead th');
const countryArray = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];
const positionArray = [
  'Accountant',
  'Data Coordinator',
  'Developer',
  'Financial Controller',
  'Integration Specialist',
  'Javascript Developer',
  'QA Engineer',
  'Marketing Designer',
  'Regional Director',
  'Regional Marketing',
  'Software Engineer',
  'Technical Author',
];

// table sorting by clicking on the title (in two directions)

let mark;

for (let i = 0; i < header.length; i++) {
  let count = 0;

  header[i].addEventListener('click', (index) => {
    const headerArray = Array.from(header);
    const rowArray = Array.from(tableBody.children);
    const headerIndex = headerArray.indexOf(index.target);

    if (mark !== i) {
      count = 0;
    }

    rowArray.sort((a, b) => {
      let tdA = a.children[headerIndex].innerHTML;
      let tdB = b.children[headerIndex].innerHTML;

      if (index.target.innerHTML === 'Salary') {
        tdA = +a.children[headerIndex].innerHTML
          .substring(1).split(',').join('');

        tdB = +b.children[headerIndex].innerHTML
          .substring(1).split(',').join('');
      }

      if (tdA > tdB) {
        return 1;
      } else if (tdA < tdB) {
        return -1;
      } else {
        return 0;
      }
    });

    if (count % 2 === 0) {
      rowArray.forEach(item => tableBody.appendChild(item));
      mark = i;
    } else {
      rowArray.reverse().forEach(item => tableBody.appendChild(item));
    }
    count++;
  });
};

// select a row by user click

tableBody.addEventListener('click', (select) => {
  const selected = select.target.parentElement;
  let markRow = 0;

  for (let i = 0; i <= tableBody.children.length; i++) {
    if (markRow !== i) {
      tableBody.children[markRow].classList.remove('active');
    }

    selected.classList.add('active');
    markRow = i;
  }
});

// Form to add new employees to the spreadsheet.

const formAdd = `
  <form action="/" method="get" class="new-employee-form">
    <label>Name:
      <input
        name="name"
        type="text"
        autocomplete="off"
        data-qa="name"
        required
      >
    </label>

    <label>Position:
      <input 
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>

    <label>
      Office:
      <select
        name="office"
        data-qa="office"
        required
      >
      ${countryArray.map(country =>
    `<option value="${country}">${country}</option>`).join('')}
      </select>
    </label>

    <label>Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
      >
    </label>

    <label>Salary:
      <input
        name="salary"
        type="number"
        min="50000"
        max="500000"
        data-qa="salary"
        required
      >
    </label>

    <button type="submit">Save to table</button>
  </form >
`;

document.body.insertAdjacentHTML('beforeend', formAdd);

// add a new employee to the table with validation

const rectForm
= document.querySelector('.new-employee-form').getBoundingClientRect();
const topPos = rectForm.bottom + 10;
const leftPos = rectForm.left;

const pushNotification = (title, description, type) => {
  const root = document.body;
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  root.append(div);
  div.append(h2);
  div.append(p);
  div.className = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');
  div.style.top = `${topPos}px`;
  div.style.left = `${leftPos}px`;
  h2.className = `title`;
  h2.innerText = `${title}`;
  p.innerText = `${description}`;
  div.style.boxSizing = `content-box`;

  setTimeout(() => {
    div.remove();
  }, 2000);
};

const notificationErrorName = () => {
  return pushNotification('Sorry! Your name is short!',
    'Name must contain at least 4 letters.', 'error');
};

const notificationErrorPosition = () => {
  return pushNotification('Sorry! Position is invalid!',
    'Please specify your position.', 'error');
};

const notificationErrorAge = () => {
  return pushNotification('Sorry! Your age is not appropriate!',
    'You must be over 18 and under 90.', 'error');
};

const notificationErrorSalary = () => {
  return pushNotification('Sorry! Salary is invalid!',
    'The amount cannot be negative.', 'error');
};

const notificationSuccess = () => {
  return pushNotification('Сongratulations!',
    'Your data is saved and added to the table.', 'success');
};

const addForm = document.querySelector('.new-employee-form');
const nameInput = addForm.querySelector('input[name="name"]');
const positionInput = addForm.querySelector('input[name="position"]');
const ageInput = addForm.querySelector('input[name="age"]');

function convertSalary(salary) {
  return `$${new Intl.NumberFormat('ja-JP').format(salary)}`;
};

function convertText(value) {
  return String(value).replace(/(^\w{1})|(\s+\w{1})/g,
    letter => letter.toUpperCase());
}

addForm.addEventListener('submit', (add) => {
  add.preventDefault();

  const data = new FormData(addForm);
  const formData = Object.fromEntries(data.entries());

  const newTr = `
  <tr>
    <td>${convertText(formData.name)}</td>
    <td>${convertText(formData.position)}</td>
    <td>${formData.office}</td>
    <td>${formData.age}</td>
    <td>${convertSalary(formData.salary)}</td>
  </td>
`;

  const nameForm = String(formData.name);

  if (nameForm.length < 4) {
    notificationErrorName();
    nameInput.style.backgroundColor = `rgba(253, 0, 0, 0.3)`;
  } else if (!positionArray.includes(convertText(formData.position))) {
    notificationErrorPosition();
    positionInput.style.backgroundColor = `rgba(253, 0, 0, 0.3)`;
  } else if (ageInput.value < 18 || ageInput.value > 90) {
    notificationErrorAge();
    ageInput.style.backgroundColor = `rgba(253, 0, 0, 0.3)`;
  } else {
    notificationSuccess();

    tableBody.insertAdjacentHTML('beforeend', newTr);
    addForm.reset();
  }
});

addForm.addEventListener('keyup', (e) => {
  e.target.style.backgroundColor = ``;
});

// editing of table cells by double-clicking on it

tableBody.addEventListener('dblclick', (cell) => {
  const editCell = cell.target;
  const input = document.createElement('input');
  const select = document.createElement('select');
  const cellIndex = editCell.cellIndex;

  input.className = `cell-input`;
  input.style.padding = `18px 18px 0`;
  select.style.border = `1px solid #808080`;
  select.style.borderRadius = `4px`;
  select.style.color = `#808080`;
  select.style.marginTop = `14px`;
  select.style.padding = `4px`;
  select.style.outlineColor = `#808080`;

  switch (cellIndex) {
    case 1:
      editCell.replaceWith(select);

      select.innerHTML = `${positionArray.map(position =>
        `<option value="${position}">${position}</option>`).join('')}`;
      break;
    case 2:
      editCell.replaceWith(select);

      select.innerHTML = `${countryArray.map(country =>
        `<option value="${country}">${country}</option>`).join('')}`;
      break;
    case 3:
    case 4:
      editCell.replaceWith(input);
      input.setAttribute('type', 'number');
      break;

    default:
      editCell.replaceWith(input);
      input.setAttribute('type', 'text');
      break;
  }
  input.focus();
  select.focus();

  input.addEventListener('keyup', () => {
    switch (cellIndex) {
      case 0:
        if (input.value.length > 0
          && input.value.length < 4
          && !input.parentElement.querySelector('span')) {
          textHint(input, cellIndex);
        } else if (input.value.length >= 4
          && input.parentElement.querySelector('span')) {
          input.parentElement.querySelector('span').remove();
        }
        break;
      case 3:
        if ((input.value < 18 || input.value > 90)
        && !input.parentElement.querySelector('span')) {
          textHint(input, cellIndex);
        } else if (input.value >= 18
          && input.value <= 90
          && input.parentElement.querySelector('span')) {
          input.parentElement.querySelector('span').remove();
        }
        break;
      case 4:
        if (input.value < 0 && !input.parentElement.querySelector('span')) {
          textHint(input, cellIndex);
        } else if (input.value > 0
          && input.parentElement.querySelector('span')) {
          input.parentElement.querySelector('span').remove();
        }
        break;
    }
  });

  function text() {
    switch (cellIndex) {
      case 0:
        (input.value.length < 4)
          ? notificationErrorName()
          : editCell.innerText = convertText(input.value);
        break;
      case 1:
      case 2:
        editCell.innerText = select.value;
        select.replaceWith(editCell);
        break;
      case 3:
        (input.value < 18 || input.value > 90)
          ? notificationErrorAge()
          : editCell.innerText = input.value;
        break;
      case 4:
        (input.value <= 0)
          ? notificationErrorSalary()
          : editCell.innerText = convertSalary(input.value);
        break;
    }

    if (input.parentElement.querySelector('span')) {
      input.parentElement.querySelector('span').remove();
    }
    input.replaceWith(editCell);
  };

  input.addEventListener('blur', () => {
    text();
  });

  input.addEventListener('keydown', (press) => {
    if (press.key === 'Enter') {
      text();
    }
  });

  select.addEventListener('blur', () => {
    text();
  });

  select.addEventListener('keydown', (press) => {
    if (press.key === 'Enter') {
      text();
    }
  });
});

// some upgrade - add a hint text under input

const textHint = (item, index) => {
  const span = document.createElement('span');

  span.style.display = `block`;
  span.style.textAlign = `center`;
  span.style.color = `#f00`;
  span.style.fontSize = `10px`;

  switch (index) {
    case 0:
      span.innerText = 'Name must contain at least 4 letters.';
      break;
    case 3:
      span.innerText = 'You age must be over 18 and under 90.';
      break;
    case 4:
      span.innerText = 'The amount cannot be negative.';
      break;
  }

  item.after(span);
};

'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let sortTargetInnerText = '';
let sortDirection = 1;

// 1. sorting
thead.addEventListener('click', (eventClick) => {
  const cellIndex = eventClick.target.cellIndex;
  const trArray = [...tbody.children];

  if (sortTargetInnerText !== eventClick.target.innerText) {
    sortDirection = 1;
  };

  eventClick.target.dataset.clicked = eventClick.target.innerText;

  const arraySorted = trArray.sort((a, b) => {
    const first = a.children[cellIndex].innerText.replace(/[$,]/g, '');
    const second = b.children[cellIndex].innerText.replace(/[$,]/g, '');

    if (isNaN(first)) {
      return sortDirection * first.localeCompare(second);
    } else {
      return sortDirection * (second - first);
    };
  });

  if (sortDirection === 1) {
    sortDirection = -1;
  } else {
    sortDirection = 1;
  };

  sortTargetInnerText = eventClick.target.innerText;

  tbody.append(...arraySorted);
});

// 2. selected row
tbody.addEventListener('click', eventClick => {
  const active = tbody.querySelector('.active');

  if (active) {
    active.classList.remove('active');
  };

  eventClick.target.closest('tr').classList.remove('active');
  eventClick.target.closest('tr').classList.add('active');
});

// 3. add a form
const newEmployeeForm = document.createElement('form');

newEmployeeForm.className = 'new-employee-form';

newEmployeeForm.innerHTML = `
  <form class="new-employee-form" action="/" method="post">
    <label>
      Name:
      <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label>
      Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button>Save to table</button>
  </form>
`;

document.body.append(newEmployeeForm);

// 4. add a new employee to the table
const saveButton = document.querySelector('button');

saveButton.addEventListener('click', (eventClick) => {
  eventClick.preventDefault();

  const addNewField = document.querySelectorAll('[data-qa]');
  const newRow = document.createElement('tr');

  if (addNewField[0].value.length < 4) {
    pushNotification(10, 10, 'Error',
      'Name must be at least 4 letters', 'error');

    return;
  };

  if (addNewField[3].value < 18 || addNewField[3].value > 90) {
    pushNotification(10, 10, 'Error',
      'Age can\'t be less than 18 or more than 90', 'error');

    return;
  };

  addNewField.forEach(item => {
    let newTd = item.value;

    if (item.name === 'salary') {
      newTd = '$' + item.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    newRow.insertAdjacentHTML('beforeend', `
    <td>${newTd}</td>
  `);

    if (item.name === 'office') {
      item.value = newEmployeeForm[2].children[0].value;
    } else {
      item.value = '';
    };
  });

  tbody.append(newRow);

  pushNotification(10, 10, 'Congratulations',
    'Employee has been added successfully!', 'success');
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');
  const messageInfo = document.createElement('div');

  messageInfo.style.top = `${posTop}px`;
  messageInfo.style.right = `${posRight}px`;
  messageInfo.className = `notification ${type}`;
  messageInfo.dataset.qa = `notification`;

  messageInfo.insertAdjacentHTML('afterbegin', `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `);

  body.append(messageInfo);

  setTimeout(() => {
    messageInfo.remove();
  }, 2000);
};

// 5. Editing of table cells by double-clicking
tbody.addEventListener('dblclick', (eventClick) => {
  const tdChange = eventClick.target;
  const tdInnerText = tdChange.innerText;
  const cellIndex = eventClick.target.cellIndex;
  const theadInnerText = thead.firstElementChild.children[cellIndex]
    .innerHTML.toLowerCase();

  if (!tdChange.matches('TD')) {
    return;
  };

  const newInput = cellIndex === 2
    ? document.createElement('select')
    : document.createElement('input');

  newInput.className = 'cell-input';

  newInput.name = `${theadInnerText}`;
  newInput.dataset.qa = `${theadInnerText}`;
  newInput.value = eventClick.target.innerText;

  switch (cellIndex) {
    case 0:
    case 1:
      newInput.type = 'text';
      newInput.name = `${theadInnerText}`;
      newInput.dataset.qa = `${theadInnerText}`;
      break;

    case 2:
      newInput.name = `${theadInnerText}`;
      newInput.dataset.qa = `${theadInnerText}`;

      newInput.insertAdjacentHTML('afterbegin', `
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      `);
      break;

    case 3:
      newInput.name = `${theadInnerText}`;
      newInput.dataset.qa = `${theadInnerText}`;
      newInput.type = 'number';
      break;

    case 4:
      newInput.name = `${theadInnerText}`;
      newInput.dataset.qa = `${theadInnerText}`;
      newInput.type = 'number';
      break;
  };
  eventClick.target.innerText = '';
  tdChange.append(newInput);

  newInput.focus();

  newInput.addEventListener('keydown', (eventKey) => {
    if (eventKey.key === 'Enter') {
      newInput.blur();
    };
  });

  newInput.addEventListener('blur', () => {
    switch (true) {
      case newInput.value.length === 0:
        pushNotification(10, 10, 'Error',
          'Name must be at least 4 letters', 'error');
        eventClick.target.innerText = tdInnerText;
        break;

      case cellIndex === 0 && newInput.value.length < 4:
        pushNotification(10, 10, 'Error',
          'Name must be at least 4 letters', 'error');
        eventClick.target.innerText = tdInnerText;
        break;

      case cellIndex === 3 && (newInput.value < 18
        || newInput.value > 90):
        pushNotification(10, 10, 'Error',
          'Age can\'t be less than 18 or more than 90', 'error');
        eventClick.target.innerText = tdInnerText;
        break;

      default:
        eventClick.target.innerText = newInput.value;

        pushNotification(10, 10, 'Congratulations',
          'Employee has been changed successfully!', 'success');
        break;
    }

    newInput.remove();
  });
});

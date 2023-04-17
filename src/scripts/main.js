'use strict';

const table = document.querySelector('table');
const tableBody = table.children[1];
const tableHead = table.children[0];

// sort table function

const sortTable = (sortBy, order) => {
  const index = [...tableHead.firstElementChild.children]
    .findIndex(item => item.textContent === sortBy);
  const rows = [...tableBody.children];

  rows.sort((a, b) => {
    let valueA = a.children[index].textContent;
    let valueB = b.children[index].textContent;

    valueB = !order ? [valueA, valueA = valueB][0] : valueB;

    if (Number(valueA)) {
      return valueA - valueB;
    }

    const isSalary = Number(valueA.slice(1).split(',').join(''));

    if (isSalary) {
      return isSalary - Number(valueB.slice(1).split(',').join(''));
    }

    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
  });

  rows.forEach(item => {
    tableBody.append(item);
  });
};

// sort table by click on header

let onceClicked;
let clickCount = 0;

tableHead.firstElementChild.onclick = (e) => {
  onceClicked === e.target ? clickCount++ : clickCount = 1;

  sortTable(e.target.innerText, clickCount % 2);
  onceClicked = e.target;
};

// selected row class active

tableBody.onclick = (e) => {
  [...tableBody.children].forEach(item => {
    item.classList.remove('active');
  });
  e.target.parentElement.classList.add('active');
};

// new Form

const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');

newEmployeeForm.insertAdjacentHTML('afterbegin', `
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position:
  <input name="position" type="text" data-qa="position" required>
</label>
<label>Office:
  <select name="office" data-qa="office" required>
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
  </select>
</label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary:
    <input name="salary" type="number"  data-qa="salary" required>
</label>
<button type="submit">Save to table</button>
`);
document.body.append(newEmployeeForm);

// validate function

const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;

const validateForm = function(elements) {
  elements.pop();

  const isEmpty = elements.some(item => !item.value.length);

  if (isEmpty) {
    pushNotification('Error', 'All fields are required', 'error');

    return false;
  }

  const isNameValid = elements[0].value.length < MIN_NAME_LENGTH;

  if (isNameValid) {
    pushNotification('Error',
      'Name should have more than 4 letters', 'error');

    return false;
  }

  const isAgeValid = elements[3].value < MIN_AGE || elements[3].value > MAX_AGE;

  if (isAgeValid) {
    pushNotification('Error',
      'Name should have more than 4 letters', 'error');

    return false;
  }

  return true;
};

// add new row

newEmployeeForm.onsubmit = (e) => {
  e.preventDefault();

  if (!validateForm([...newEmployeeForm.elements])) {
    return;
  };

  tableBody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${newEmployeeForm.elements.name.value}</td>
    <td>${newEmployeeForm.elements.position.value}</td>
    <td>${newEmployeeForm.elements.office.value}</td>
    <td>${newEmployeeForm.elements.age.value}</td>
    <td>$${newEmployeeForm.elements.salary.value
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    </td>
  </tr>
  `);
  newEmployeeForm.reset();
  pushNotification('Success', 'New employee is successfully added', 'success');
};

// notification function

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageText = document.createElement('p');

  notification.classList.add('notification', type);
  messageTitle.classList.add('title');
  messageTitle.textContent = title;
  messageText.textContent = description;

  notification.append(messageTitle);
  notification.append(messageText);
  notification.style.top = '10px';
  notification.style.right = '10px';
  notification.dataset.qa = 'notification';

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

// editing table cells

const handleEditInput = function(text) {
  const editInput = document.querySelector('.cell-input');

  editInput.focus();

  const saveChanges = (e) => {
    if (document.activeElement !== editInput || e.keyCode === 13) {
      editInput.parentElement.textContent = editInput.value.trim() || text;
      editInput.remove();
    }
  };

  editInput.addEventListener('keydown', saveChanges);
  editInput.addEventListener('blur', saveChanges);
};

// editing option

tableBody.ondblclick = (e) => {
  const text = e.target.firstChild.textContent;

  e.target.firstChild.remove();

  e.target.insertAdjacentHTML('afterbegin', `
  <input class='cell-input' value='${text}'>
  `);

  handleEditInput(text);
};

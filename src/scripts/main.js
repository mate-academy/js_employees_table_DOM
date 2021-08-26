'use strict';

const elementForm = document.createElement('form');
const elementTable = document.querySelector('table');
const tableBody = elementTable.tBodies[0];
const headCells = [...elementTable.tHead.rows[0].cells];
let messageTextForm = '';
let sortedIsASC = true;
let clickedCellHead = null;
let clickedBodyRow = null;
let isValidForm = true;
let dataForm = {};
const regEx = {
  name: /^[a-zA-Zа-яА-ЯёЁ]+$/,
  position: /^[A-Za-zА-Яа-яЁё.,()-\s]+$/i,
};
const textMessageModal = {
  name: 'Поле Name. Максимально количество слов, '
    + 'должно быть - 15, минимальное - 4, '
    + 'без пробелов. Латиница либо кирилица.',
  position: 'Поле Position. Максимально количество слов, '
    + 'должно быть - 40, минимаоьное количество '
    + 'слов должно быть - 4, '
    + 'разрешены только скобки и тире.',
  success: 'Новый юзер добавлен',
};

elementForm.classList.add('new-employee-form');
elementTable.insertAdjacentElement('afterend', elementForm);

function toFloatNum(string) {
  const result = (string.match(/[\d,]/g) || [])
    .join('')
    .replace(',', '.');

  return +result;
};

function sortCol(indexColumn, arr) {
  arr.sort((a, b) => {
    let A = [...a.cells][indexColumn].textContent;
    let B = [...b.cells][indexColumn].textContent;

    if (headCells[indexColumn].textContent.toLowerCase() === 'salary') {
      A = toFloatNum(A);
      B = toFloatNum(B);
    };

    const modeSort = sortedIsASC
      ? ((A > B) ? 1 : ((A < B) ? -1 : 0))
      : (A > B) ? -1 : ((A < B) ? 1 : 0);

    return modeSort;
  });

  arr.forEach((el) => {
    tableBody.appendChild(el);
  });
};

function createForm() {
  const formHTML = `<label>Name:
    <input
      name = "userName"
      type = "text"
      minlength = "4"
      maxlength = "15"
      data-qa="name"
      required
      >
  </label >
  <label>Position:
    <input
      name="position"
      type="text"
      minlength="4"
      maxlength = "40"
      data-qa="position"
      required
    >
  </label>
    <label>Office:
      <select name="office" required data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
  <label>Age:
      <input
        name="age"
        type="number"
        min="18"
        max="90"
        data-qa="age"
        required
      >
  </label>
      <label>Salary:
        <input
          name="salary"
          type="number"
          min="50"
          max="100000"
          step="0.01"
          data-qa="salary"
          required
        >
  </label>
  <button type="submit" class="btn-saveForm">Save to table</button>`;

  elementForm.insertAdjacentHTML('afterbegin', formHTML);
};

createForm();

function createFormMessage() {
  const messageModal = document.createElement('div');
  const messageHeader = document.createElement('h2');
  const messageText = document.createElement('p');

  elementForm.insertAdjacentElement('afterend', messageModal);
  messageModal.append(messageHeader, messageText);
  messageModal.setAttribute('data-qa', 'notification');
  messageModal.style.visibility = 'hidden';
  messageModal.classList.add('notification');

  return {
    messageModal,
    messageHeader,
    messageText,
  };
};

const messageAPI = createFormMessage();

function addUser(data) {
  const newRow = document.createElement('TR');
  const newRowContext = `<tr>
  <td>${data.name}</td>
  <td>${data.position}</td>
  <td>${data.office}</td>
  <td>${data.age}</td>
  <td>$${data.salary.replace('.', ',')}</td>
</tr>`;

  newRow.innerHTML = newRowContext;

  tableBody.appendChild(newRow);
};

function messageForm() {
  let isTimeOut = null;

  return (isValid, text) => {
    let textHead = '';

    if (!isValid) {
      textHead = 'Error Message';
      messageAPI.messageModal.classList.add('error');
      messageAPI.messageModal.classList.remove('success');
    } else {
      textHead = 'Successes Message';
      messageAPI.messageModal.classList.add('success');
      messageAPI.messageModal.classList.remove('error');
      elementForm.reset();
      addUser(dataForm);
    };

    messageAPI.messageModal.style.visibility = 'visible';
    messageAPI.messageHeader.innerText = textHead;
    messageAPI.messageText.innerText = text;

    if (isTimeOut !== null) {
      clearTimeout(isTimeOut);
    };

    isTimeOut = setTimeout(() => {
      messageAPI.messageModal.style.visibility = 'hidden';
    }, 3000);
  };
};

const validationMessage = messageForm();

function validationInput(value, regexp, element) {
  if (!regexp.test(value.trim())) {
    element.style.borderColor = 'red';
    isValidForm = false;
    messageTextForm = textMessageModal[element.name];

    return;
  };
  element.style.borderColor = null;
};

function editionCell(e) {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const inputCell = e.target.innerText;
  const activeRow = elementTable.tBodies[0].querySelector('.active');
  const arrActiveRow = [...activeRow.cells];
  const indexCell = arrActiveRow.indexOf(e.target);
  const nameCell = headCells[indexCell].innerText.toLowerCase();
  const inputForm = elementForm.querySelector(`[name=${nameCell}]`);
  const editInput = inputForm.cloneNode(true);
  const computedStyle = window.getComputedStyle(e.target, null);
  const widthCell = computedStyle.getPropertyValue('width');
  const heightCell = computedStyle.getPropertyValue('height');

  editInput.classList.add('cell-input');
  editInput.style.width = widthCell;
  editInput.style.height = heightCell;
  editInput.value = inputCell;

  if (nameCell === 'salary') {
    editInput.value = toFloatNum(inputCell);
  };

  e.target.innerHTML = '';
  e.target.appendChild(editInput);
  editInput.focus();

  function editCell(ev) {
    const resultWithComma = (ev.target.value || inputCell).replace('.', ',');

    e.target.innerHTML = resultWithComma;

    if (nameCell === 'salary') {
      e.target.innerHTML = `$${resultWithComma}`;
    }
  };
  editInput.addEventListener('blur', editCell);

  editInput.addEventListener('keydown', function(keyboardEvent) {
    if (keyboardEvent.code === 'Enter') {
      editInput.removeEventListener('blur', editCell);
      editCell(keyboardEvent);
    }
  });
};

tableBody.style.userSelect = 'none';

elementTable.tHead.addEventListener('click', function(e) {
  if (!this.contains(e.target) || e.target.tagName !== 'TH') {
    return;
  };
  sortedIsASC = !sortedIsASC;

  if (clickedCellHead !== e.target) {
    sortedIsASC = true;
  };

  clickedCellHead = e.target;

  const indexHeadCall = headCells.indexOf(e.target);
  const rowsArr = [...elementTable.tBodies[0].rows];

  sortCol(indexHeadCall, rowsArr);
});

tableBody.addEventListener('mousedown', function(e) {
  const tableRow = e.target.closest('tr');

  if (clickedBodyRow !== tableRow && clickedBodyRow !== null) {
    clickedBodyRow.classList.remove('active');
    tableRow.classList.add('active');
  } else {
    tableRow.classList.add('active');
  }

  clickedBodyRow = tableRow;
});

elementForm.addEventListener('submit', function(e) {
  e.preventDefault();
  isValidForm = true;
  messageTextForm = textMessageModal['success'];

  const { userName, position, office, age, salary } = elementForm;

  dataForm = {
    name: userName.value.trim(),
    position: position.value.trim(),
    office: office.value.trim(),
    age: age.value.trim(),
    salary: salary.value.trim(),
  };

  validationInput(dataForm.name, regEx.name, userName);
  validationInput(dataForm.position, regEx.position, position);
  validationMessage(isValidForm, messageTextForm);
});

tableBody.addEventListener('dblclick', editionCell);

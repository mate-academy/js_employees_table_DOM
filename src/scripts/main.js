'use strict';

const tbody = document.querySelector('tbody');
const head = document.querySelectorAll('thead th');

const callState = {
  countName: 0,
  countPosition: 0,
  countAge: 0,
  countOffice: 0,
  countSalary: 0,
};

function toValidNum(param) {
  return param.replace('$', '').replace(/,/g, '');
}

tbody.addEventListener('click', (events) => {
  const targetRow = events.target.closest('tr');

  if (!targetRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((el) => el.classList.remove('active'));
  targetRow.classList.add('active');
});

head.forEach((elements) => {
  elements.onclick = function (events) {
    const target = events.target;

    switch (target.textContent) {
      case 'Name':
        nameSort();
        inerCaseCounter('countName');
        break;

      case 'Position':
        position();
        inerCaseCounter('countPosition');
        break;

      case 'Age':
        age();
        inerCaseCounter('countAge');
        break;

      case 'Office':
        officeSort();
        inerCaseCounter('countOffice');
        break;

      case 'Salary':
        salary();
        inerCaseCounter('countSalary');
        break;
    }
  };
});

function inerCaseCounter(key) {
  callState[key] = callState[key] === 0 ? 1 : 0;
}

function nameSort() {
  const sortElements = Array.from(document.querySelectorAll('tbody tr'));
  const resultSortName = sortElements.sort((rowA, rowB) => {
    const cellA = rowA.cells[0].textContent;
    const cellB = rowB.cells[0].textContent;

    return callState.countName === 0
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  tbody.innerHTML = '';
  resultSortName.forEach((row) => tbody.appendChild(row));
}

function position() {
  const sortElements = Array.from(document.querySelectorAll('tbody tr'));
  const resultSortPosition = sortElements.sort((rowA, rowB) => {
    const cellA = rowA.cells[1].textContent;
    const cellB = rowB.cells[1].textContent;

    return callState.countPosition === 0
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  tbody.innerHTML = '';
  resultSortPosition.forEach((row) => tbody.appendChild(row));
}

function age() {
  const sortElements = Array.from(document.querySelectorAll('tbody tr'));
  const resultSortAge = sortElements.sort((rowA, rowB) => {
    const cellA = rowA.cells[3].textContent;
    const cellB = rowB.cells[3].textContent;

    return callState.countAge === 0 ? cellA - cellB : cellB - cellA;
  });

  tbody.innerHTML = '';
  resultSortAge.forEach((row) => tbody.appendChild(row));
}

function officeSort() {
  const sortElements = Array.from(document.querySelectorAll('tbody tr'));
  const resultSortOffice = sortElements.sort((rowA, rowB) => {
    const cellA = rowA.cells[2].textContent;
    const cellB = rowB.cells[2].textContent;

    return callState.countOffice === 0
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  tbody.innerHTML = '';
  resultSortOffice.forEach((row) => tbody.appendChild(row));
}

function salary() {
  const sortElements = Array.from(document.querySelectorAll('tbody tr'));
  const resultSortSalary = sortElements.sort((rowA, rowB) => {
    const cellA = toValidNum(rowA.cells[4].textContent);
    const cellB = toValidNum(rowB.cells[4].textContent);

    return callState.countSalary === 0 ? cellA - cellB : cellB - cellA;
  });

  tbody.innerHTML = '';
  resultSortSalary.forEach((row) => tbody.appendChild(row));
}

const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

form.innerHTML = `<label>Name: <input data-qa="name" type="text"></label>
<label>Position: <input data-qa="position" type="text"></label>
<label>Office:
  <select>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="NewYork">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="SanFrancisco">San Francisco</option>
  </select>
</label>
<label>Age: <input data-qa="age" type="number"></label>
<label>Salary: <input data-qa="salary" type="number"></label>
<button>Save to table</button>`;

form.addEventListener('submit', saveToTable);

function saveToTable(events) {
  events.preventDefault();

  const nameInput = form.querySelector('input[data-qa="name"]');
  const positionInput = form.querySelector('input[data-qa="position"]');
  const ageInput = form.querySelector('input[data-qa="age"]');
  const salaryInput = form.querySelector('input[data-qa="salary"]');
  const office = form.querySelector('select');
  let isValid = true;

  const resultMessage = document.createElement('div');

  document.body.append(resultMessage);
  resultMessage.setAttribute('data-qa', 'notification');
  resultMessage.classList.add('notification');
  resultMessage.style.cssText = 'transition: 1s';

  setTimeout(() => {
    resultMessage.remove();
  }, 2000);

  if (nameInput.value.length < 4) {
    resultMessage.innerHTML = '<p>Name value has less than 4 letters</p>';
    resultMessage.classList.add('error');
    isValid = false;

    return;
  }

  if (positionInput.value.trim() === '') {
    resultMessage.innerHTML = '<p>Position is required</p>';
    resultMessage.classList.add('error');
    isValid = false;

    return;
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    resultMessage.innerHTML = '<p>Age must be a valid</p>';
    resultMessage.classList.add('error');
    isValid = false;

    return;
  }

  if (salaryInput.value === '') {
    resultMessage.innerHTML = '<p>Add salary</p>';
    resultMessage.classList.add('error');
    isValid = false;

    return;
  }

  function createValidSalary(salaryValue) {
    const value = salaryValue.toString();

    return `$${value.slice(0, value.length - 3)},${value.slice(value.length - 3)}`;
  }

  if (isValid) {
    resultMessage.innerHTML = '<p>Employee successfully added</p>';
    resultMessage.classList.add('success');

    const newParams = document.createElement('tr');

    newParams.innerHTML = `<td>${nameInput.value}</td>
    <td>${positionInput.value}</td>
    <td>${office.value}</td>
    <td>${ageInput.value}</td>
    <td>${createValidSalary(salaryInput.value)}</td>`;

    tbody.appendChild(newParams);
  }
}

function enableCellEdit(cell) {
  const originalValue = cell.textContent;
  const input = document.createElement('input');

  input.type = 'text';
  input.value = originalValue;
  input.classList.add('cell-input');

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  function saveEdit() {
    const newValue = input.value.trim();

    cell.removeChild(input);

    cell.textContent = newValue || originalValue;
  }

  input.addEventListener('blur', saveEdit);

  input.addEventListener('keydown', (events) => {
    if (events.key === 'Enter') {
      saveEdit();
    }
  });
}

tbody.addEventListener('dblclick', (events) => {
  const cell = events.target;

  if (!cell.querySelector('.cell-input')) {
    enableCellEdit(cell);
  }
});

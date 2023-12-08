'use strict';
/* eslint-disable no-shadow */

const HEADERS = {
  name: 'Name',
  position: 'Position',
  office: 'Office',
  age: 'Age',
  salary: 'Salary',
};

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const list = document.querySelector('tbody').children;
const head = document.querySelector('thead').children[0];
const currentSortState = {
  sortedBy: '', order: 1,
};

body.insertAdjacentHTML('beforeend',
  `<form action="post" class="new-employee-form">
  <label>
    Name:
    <input type="text" data-qa="name" name="name" required>
  </label>
  <label>
    Position:
    <input type="text" data-qa="position" name="position" required>
  </label>
  <label for="">Office:
    <select data-qa="office" name="office">
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
    <input type="number" data-qa="age" name="age" required>
  </label>
  <label>
    Salary:
    <input type="number" data-qa="salary" name="salary" required>
  </label>
  <button type="submit">Save to table</button>
</form>
<div class="notification" data-qa="notification" hidden>
  <p class="title"></p>
</div>`,
);

const form = document.querySelector('form');

tbody.addEventListener('click', handleSelectRow);
head.addEventListener('click', handleSortClick);
form.addEventListener('submit', handleSubmit);
tbody.addEventListener('dblclick', handleCellEdit);

function handleSelectRow(e) {
  const currentRow = e.target.parentElement;

  [...list].forEach(row => {
    row.classList = '';
  });
  currentRow.classList.add('active');
}

function handleSortClick(header) {
  const index = [...head.children].indexOf(header.target);

  currentSortState.order = currentSortState.order > 0 ? -1 : 1;

  const order = currentSortState.sortedBy === header.target.innerText
    ? currentSortState.order
    : 1;

  const sortedList = [...list].sort((a, b) => {
    const rowA = a.children[index].innerText;
    const rowB = b.children[index].innerText;

    switch (header.target.innerText) {
      case HEADERS.name:
        currentSortState.sortedBy = HEADERS.name;

        return rowA.localeCompare(rowB) * order;

      case HEADERS.position:
        currentSortState.sortedBy = HEADERS.position;

        return rowA.localeCompare(rowB) * order;

      case HEADERS.office:
        currentSortState.sortedBy = HEADERS.office;

        return rowA.localeCompare(rowB) * order;

      case HEADERS.age:
        currentSortState.sortedBy = HEADERS.age;

        return (+rowA - +rowB) * order;

      case HEADERS.salary:
        currentSortState.sortedBy = HEADERS.salary;

        return (toNum(rowA) - toNum(rowB)) * order;

      default:
        return 0;
    }
  });

  tbody.replaceChildren(...sortedList);
}

function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');

  if (name.length < 4) {
    showNotification('error', 'Name can not be less than 4 characters');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Please enter correct age');

    return;
  }

  tbody.insertAdjacentHTML('beforeend',
    `<tr>
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${parseFloat(salary).toLocaleString('en-US')}</td>
  </tr>`,
  );

  showNotification('success', 'Employee was successfully added');
  form.reset();
}

function handleCellEdit(e) {
  const editedCell = e.target;
  const originalValue = editedCell.innerText;
  const newInput = document.createElement('input');
  const newInputType = Number.isNaN(toNum(editedCell.innerText))
    ? 'text'
    : 'number';

  newInput.classList.add('cell-input');
  newInput.value = originalValue;
  newInput.setAttribute('type', newInputType);

  editedCell.innerText = '';
  editedCell.append(newInput);

  newInput.focus();

  newInput.addEventListener('blur', () => {
    handleEditInput(newInput, editedCell, originalValue);
  });

  newInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleEditInput(newInput, editedCell, originalValue);
    }
  });
}

function handleEditInput(input, editedCell, originalValue) {
  if (originalValue.startsWith('$')) {
    const newSalary = `$${+input.value.toLocaleString('en-US')}`;

    editedCell.innerText = newSalary.length > 2 ? newSalary : originalValue;
  } else {
    editedCell.innerText = input.value.trim() || originalValue;
  }
}

function toNum(str) {
  return +str.slice(1).replaceAll(',', '');
}

function showNotification(type, title) {
  const notification = document.querySelector('.notification');

  notification.classList.add(type);
  notification.children[0].innerText = title;
  notification.hidden = false;

  setTimeout(() => {
    notification.classList.remove(type);
    notification.hidden = true;
  }, 3000);
}

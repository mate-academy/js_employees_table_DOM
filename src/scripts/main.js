'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const body = document.querySelector('body');
let accept = true;
let selected;

thead.addEventListener('click', (e) => {
  const item = e.target.closest('th');

  if (!item) {
    return;
  }

  const cellIndex = item.cellIndex;

  const copyOfData = [...tbody.children];

  copyOfData.sort((a, b) => {
    const cellA = accept
      ? a.cells[cellIndex].innerHTML
      : b.cells[cellIndex].innerHTML;

    const cellB = accept
      ? b.cells[cellIndex].innerHTML
      : a.cells[cellIndex].innerHTML;

    if (cellA.includes('$') || typeof cellA === 'number') {
      return goodNumbers(cellB) - goodNumbers(cellA);
    } else {
      return cellA.localeCompare(cellB);
    }
  });

  tbody.append(...copyOfData);
  accept = !accept;
});

tbody.addEventListener('click', (e) => {
  const item = e.target.closest('tr');

  if (selected) {
    selected.classList.remove('active');
  }

  item.classList.add('active');
  selected = item;
});

body.insertAdjacentHTML('beforeend', `
  <form
    class="new-employee-form"
    method="GET"
    action="/"
  >
    <label>Name:
      <input
        data-qa="name"
        name="name"
        type="text"
      >
    </label>

    <label>Position:
      <input
        data-qa="position"
        name="position"
        type="text"
      >
    </label>

    <label>Office
      <select
        data-qa="office"
        name="office"
        type="text"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input
        data-qa="age"
        name="age"
        type="number"
        min="0"
      >
    </label>

    <label>Salary:
      <input
        data-qa="salary"
        name="salary"
        type="number"
        min="0"
      >
    </label>

    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', submitFormData);

function submitFormData(e) {
  e.preventDefault();

  const data = new FormData(form);
  const employeeName = data.get('name');
  const employeePosition = data.get('position');
  const employeeAge = data.get('age');
  const employeeSalary = data.get('salary');
  const newEmployeeSalary = '$' + String(employeeSalary);

  if (employeeName.length < 4 || employeeName.trim() === '') {
    pushNotification('warning', 'Warning',
      'Warning... The name must have more than 4 characters ');
  } else if (employeePosition.length < 1 || employeePosition.trim() === '') {
    pushNotification('warning', 'Warning',
      'Warning... The position must have more than 1 characters ');
  } else if (employeeAge < 18 || employeeAge > 90) {
    pushNotification('error', 'Error', 'Error... age must be 18+');
  } else {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${employeeName}</td>
        <td>${employeePosition}</td>
        <td>${data.get('office')}</td>
        <td>${employeeAge}</td>
        <td>${newEmployeeSalary}</td>
      </tr>
      `);

    pushNotification('success', 'Success',
      'Success... You have been added to the table');
    form.reset();
  };
}

const pushNotification = (type, title, description) => {
  body.insertAdjacentHTML('beforeend', `
    <div
      class="notification ${type}"
      data-qa="notification"
    >
      <h1 class="title">
        ${title}
      </h1>
      <p>
        ${description}
      </p>
    </div>
  `);

  setTimeout(() => document.querySelector('.notification').remove(), 3000);
};

const isDisabled = true;

tbody.addEventListener('dblclick', (e) => {
  const item = e.target.closest('td');
  const textItem = item.textContent;
  const targetIndex = item.cellIndex;

  if (isDisabled) {
    item.classList.add('.cell-input');
    item.innerHTML = '';
  } else {
    item.classList.remove('.cell-input');
  }

  item.insertAdjacentHTML('afterbegin', `
    <input class="cell-input" type="text">
  `);

  let input = document.querySelector('.cell-input');

  if (targetIndex === 2) {
    const select = document.createElement('select');

    select.insertAdjacentHTML('afterbegin', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `);

    input = select;
  }

  if (targetIndex === 3 || targetIndex === 4) {
    input.type = 'number';
  }

  item.append(input);

  input.focus();

  input.addEventListener('blur', () => {
    if (targetIndex === 3 && input.value < 18) {
      pushNotification('error', 'Error', 'Error... age must be 18+');
      item.textContent = textItem;

      return;
    } else {
      item.textContent = textItem;
    }

    if (targetIndex === 3 && input.value > 90) {
      pushNotification('error', 'Error', 'Error... age must be less than 90');
      item.textContent = textItem;

      return;
    }

    if (targetIndex === 4 && input.value) {
      item.textContent = '$' + String(input.value);

      return;
    }

    item.textContent = input.value || textItem;
    input.remove();
  });

  input.addEventListener('keydown', (el) => {
    if (el.key !== 'Enter') {
      return;
    }

    input.blur();
  });
});

function goodNumbers(numb) {
  return +numb.replace(/\D/g, '');
}

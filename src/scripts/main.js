'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const table = document.querySelector('table');

table.addEventListener('click', e => {
  const item = e.target.closest('th');
  const index = item.cellIndex;
  let sortedArray = [];

  if (item.direction === 'ASC') {
    item.direction = 'DESC';

    sortedArray = [...tbody.rows].sort((a, b) => {
      const aValue = a.cells[index].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[index].innerText.replace(/[$,]/g, '');

      if (isNaN(aValue)) {
        return aValue.localeCompare(bValue);
      } else {
        return aValue - bValue;
      };
    });
  } else {
    item.direction = 'ASC';

    sortedArray = [...tbody.rows].sort((a, b) => {
      const aValue = a.cells[index].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[index].innerText.replace(/[$,]/g, '');

      if (isNaN(aValue)) {
        return bValue.localeCompare(aValue);
      } else {
        return bValue - aValue;
      };
    });
  }

  tbody.append(...sortedArray);
});

tbody.addEventListener('click', e => {
  e.stopPropagation();

  const row = e.target.closest('tr');
  const rowActive = document.querySelector('.active');

  if (!rowActive) {
    row.classList.add('active');
  } else {
    rowActive.classList.remove('active');
    row.classList.add('active');
  }
});

const pushNotification = (title, description, type) => {
  const boxMessage = document.createElement('div');
  const titleMessage = document.createElement('h1');
  const descriptionMessage = document.createElement('p');

  boxMessage.classList = 'notification';
  boxMessage.dataset.qa = 'notification';
  boxMessage.classList.add(type);
  titleMessage.classList = 'title';
  titleMessage.textContent = title;
  descriptionMessage.textContent = description;
  boxMessage.append(titleMessage);
  boxMessage.append(descriptionMessage);

  body.append(boxMessage);

  setTimeout(() => {
    boxMessage.remove();
  }, 2000);
};

body.insertAdjacentHTML('beforeend',
  `<form class="new-employee-form">
      <label>Name:
        <input name="name" type="text" data-qa="name">
      </label>
      <label>Position:
        <input name="position" type="text" data-qa="position">
      </label>
      <label> Office:
        <select name="office" data-qa="office" >
         <option value="Tokyo">Tokyo</option>
         <option value="Singapore">Singapore</option>
         <option value="London">London</option>
         <option value="New York">New York</option>
         <option value="Edinburgh">Edinburgh</option>
         <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age:
        <input name="age" type="number" data-qa="age">
      </label>
      <label>Salary:
        <input name="salary" type="number" data-qa="salary">
      </label>
      <button>Save to table</button>
     </form>`
);

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tr = document.createElement('tr');

  const formDataArray = [
    formData.get('name'),
    formData.get('position'),
    formData.get('office'),
    formData.get('age'),
    formData.get('salary'),
  ];

  if (formData.get('name').length < 4) {
    pushNotification('Wrong!',
      'Name should have at least 4 letters!',
      'error');

    return;
  }

  if (!formData.get('name') || !formData.get('position')
    || !formData.get('age') || !formData.get('salary')) {
    pushNotification('Wrong!',
      'Please, fill in all fields',
      'error');

    return;
  }

  if (formData.get('age') < 18 || formData.get('age') > 90) {
    pushNotification('Wrong!',
      'Age must be between 18 and 90',
      'error');

    return;
  }

  for (let i = 0; i < formDataArray.length; i++) {
    const td = document.createElement('td');

    if (i === formDataArray.length - 1) {
      const num = parseInt(formDataArray[i]);

      td.textContent = `$${num.toLocaleString('en-US')}`;
    } else {
      td.textContent = formDataArray[i];
    }

    tr.append(td);
  }

  tbody.append(tr);

  pushNotification('Done!',
    'New employee added to table', 'success');

  form.reset();
});

function addTableEditing(tableEmployee) {
  tableEmployee.tBodies[0].addEventListener('dblclick', (event) => {
    event.preventDefault();

    if (event.target.tagName !== 'TD') {
      return;
    }

    const modifiedCell = event.target;
    const cellText = modifiedCell.textContent;
    const cellInputWidth = window.getComputedStyle(modifiedCell).width;

    modifiedCell.innerHTML = `
      <input
        name="change"
        class="cell-input"
        value="${cellText}"
      >
    `;

    const cellInput = modifiedCell.querySelector('.cell-input');

    cellInput.style.maxWidth = cellInputWidth;

    cellInput.addEventListener('blur', (e) => {
      modifiedCell.innerHTML = cellInput.value
        ? cellInput.value
        : cellText;
    });

    cellInput.addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') {
        return;
      }

      modifiedCell.innerHTML = cellInput.value
        ? cellInput.value
        : cellText;
    });
  });
}

addTableEditing(table);

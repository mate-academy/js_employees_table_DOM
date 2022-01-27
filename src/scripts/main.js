'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const ascStatus = new Array(tbody.firstElementChild.cells.length).fill(true);

table.addEventListener('click', (e) => {
  const target = e.target;

  if (!table.contains(target) || !target) {
    return;
  }

  if (target.closest('th')) {
    const index = target.cellIndex;
    const rows = tbody.rows;
    let sortedRows;

    if (ascStatus[index]) {
      ascStatus.fill(true);
      ascStatus[index] = false;

      sortedRows = [...rows].sort((row1, row2) => {
        const rowA = row1.cells[index].textContent.replace(/[$,]/g, '');
        const rowB = row2.cells[index].textContent.replace(/[$,]/g, '');

        if (!isNaN(rowA)) {
          return rowA - rowB;
        } else {
          return rowA.localeCompare(rowB);
        }
      });
    } else {
      ascStatus[index] = true;

      sortedRows = [...rows].sort((row1, row2) => {
        const rowA = row1.cells[index].textContent.replace(/[$,]/g, '');
        const rowB = row2.cells[index].textContent.replace(/[$,]/g, '');

        if (!isNaN(rowA)) {
          return rowB - rowA;
        } else {
          return rowB.localeCompare(rowA);
        }
      });
    }

    tbody.append(...sortedRows);
  }

  if (target.closest('td')) {
    const activeRow = table.querySelector('.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }
    target.parentNode.classList.add('active');
  }
});

table.insertAdjacentHTML('afterend', `
<form action="" class="new-employee-form">
  <label>Name:
    <input name="name" type="text" minlength = "4" data-qa="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo" selected>Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" min="18" max="90" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
</form>
`);

const form = document.querySelector('form');
const inputs = form.querySelectorAll('input');
const button = form.querySelector('button');

for (const input of inputs) {
  input.required = true;
}

button.addEventListener('click', (e) => {
  if (form.elements.name.value.length === 0
    || form.elements.position.value.length === 0
    || form.elements.salary.value.length === 0) {
    pushNotification('All fields are required', 'error');
  } else if (form.elements.name.value.length < 4
    || !form.elements.name.validity.valid) {
    form.elements.name.value = '';

    pushNotification('Name should contain at least 4 letters', 'error');
  } else if (!form.elements.age.validity.valid) {
    form.elements.age.value = '';

    pushNotification('Age should be between 18-90 years', 'error');
  } else {
    e.preventDefault();

    pushNotification('The new employee is added!', 'success');

    const newRow = table.rows[1].cloneNode(true);

    [...newRow.cells].forEach((cell, index) => {
      cell.innerHTML = form.elements[index].value;
      cell.classList.add(`${form.elements[index].name}`);

      if (cell.classList.contains('salary')) {
        cell.innerHTML = (+cell.innerHTML).toLocaleString('en-EN', {
          style: 'currency', currency: 'USD',
        }).slice(0, -3);
      }
    });

    tbody.append(newRow);
    form.reset();
  }
});

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;

  if (!target || target.tagName !== 'TD') {
    return;
  }

  const startData = target.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = 'text';
  target.textContent = '';

  target.append(input);
  input.focus();

  input.addEventListener('blur', saveData);
  input.addEventListener('keydown', saveData);

  function saveData(ev) {
    if (ev.keyCode === 13 || ev.type === 'blur') {
      const newData = target.children[0].value;

      if (newData.length === 0) {
        target.innerHTML = startData;
      } else {
        if (target.cellIndex) {
          input.remove();
        }
        target.innerHTML = newData;
      }
    }
  }
});

function pushNotification(text, type) {
  const notification = document.createElement('div');
  const title = document.createElement('h1');
  const message = document.createElement('p');
  const titleText = type[0].toUpperCase() + type.slice(1);

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification`;
  notification.classList.add(type);
  title.className = 'title';
  title.innerHTML = titleText;
  message.innerHTML = text;

  notification.append(title, message);
  form.insertAdjacentElement('afterend', notification);

  setTimeout(() => notification.remove(), 3000);
}

'use strict';

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const notifTitle = document.createElement('h2');

  notifTitle.classList.add('title');

  notifTitle.innerHTML = title;
  notification.appendChild(notifTitle);

  const notifText = document.createElement('p');

  notifText.innerHTML = description;
  notification.appendChild(notifText);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const dashboard = document.querySelector('table');

let editingCell = null;

dashboard.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  // якщо вже редагується якась клітинка — не дозволяємо нову
  if (editingCell) {
    return;
  }

  editingCell = cell;

  const initialValue = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;

  cell.append(input);
  input.focus();
  input.select();

  const saveChanges = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue === '' ? initialValue : newValue;

    editingCell = null;
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

const header = dashboard.tHead;
const titles = header.querySelectorAll('th');

const form = document.createElement('form');

form.className = 'new-employee-form';
form.noValidate = true;

form.innerHTML = `
  <label>Name:<input name="name" type="text" data-qa="name" required></label>
  <label>Position:<input name="position" type="text" data-qa="position" required></label>
  <label>
    Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:<input name="age" type="number" data-qa="age" required></label>
  <label>Salary:<input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
`;

dashboard.after(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameVal = form.name.value.trim();
  const positionVal = form.position.value.trim();
  const officeVal = form.elements.office.value;
  const ageVal = +form.age.value.trim();
  const salaryVal = form.salary.value.trim();

  if (!nameVal || !positionVal || !officeVal || !ageVal || !salaryVal) {
    pushNotification(
      500,
      10,
      'Error',
      'Please fill out all form fields correctly!',
      'error',
    );

    return;
  }

  if (nameVal.length < 4) {
    pushNotification(
      500,
      10,
      'Error',
      'Name must contain at least 4 letters!',
      'error',
    );

    return;
  }

  if (ageVal < 18 || ageVal > 90) {
    pushNotification(
      500,
      10,
      'Error',
      'Age must be between 18 and 90!',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');
  const formattedSalary = (+salaryVal).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${nameVal}</td>
    <td>${positionVal}</td>
    <td>${officeVal}</td>
    <td>${ageVal}</td>
    <td>$${formattedSalary}</td>
  `;

  tBody.append(newRow);

  pushNotification(
    500,
    10,
    'Success',
    'Employee successfully added!',
    'success',
  );

  form.reset();
});

for (const title of titles) {
  title.addEventListener('click', () => {
    for (const otherTitle of titles) {
      if (otherTitle !== title) {
        delete otherTitle.dataset.order;
      }
    }

    const column = title.cellIndex;

    const order = title.dataset.order || 'asc';

    const body = dashboard.tBodies[0];
    const bodyRows = body.querySelectorAll('tr');

    const rowsArray = Array.from(bodyRows);

    rowsArray.sort((a, b) => {
      const aValue = a.cells[column].textContent;
      const bValue = b.cells[column].textContent;
      const isNumberColumn = column === 3 || column === 4;

      let result;

      if (isNumberColumn) {
        const aNum = +aValue.replace(/[^0-9.-]+/g, '');
        const bNum = +bValue.replace(/[^0-9.-]+/g, '');

        result = aNum - bNum;
      } else {
        result = aValue.localeCompare(bValue);
      }

      return order === 'asc' ? result : -result;
    });

    for (const row of rowsArray) {
      body.appendChild(row);
    }

    title.dataset.order = order === 'asc' ? 'desc' : 'asc';
  });
}

const tBody = dashboard.tBodies[0];

tBody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  const activeRow = tBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  tr.classList.add('active');
});

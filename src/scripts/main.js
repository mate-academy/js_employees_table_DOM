'use strict';

const table = document.querySelector('table');
const tHead = table.tHead.rows[0].cells;
const tBody = table.tBodies[0];

const sortParams = {
  sortedCol: null,
  sortedOrder: null,
};

table.tHead.addEventListener('click', (e) => {
  const th = e.target.closest('th');
  const sortedBody = [...tBody.rows];

  if (sortParams.sortedCol === th) {
    tBody.append(...sortedBody.reverse());

    sortParams.sortedOrder = sortParams.sortedOrder === 'ASC' ? 'DESC' : 'ASC';

    return;
  }

  const tr = th.closest('tr');
  const i = [...tr.cells].indexOf(th);

  sortedBody.sort((tr1, tr2) => {
    const tr1Value = tr1.cells[i].innerText;
    const tr2Value = tr2.cells[i].innerText;

    if (isNaN(tr1Value)) {
      if (tr1Value.includes('$')) {
        const firstSalary = +tr1Value.replace(/[^0-9.-]+/g, '');
        const secondSalary = +tr2Value.replace(/[^0-9.-]+/g, '');

        return firstSalary - secondSalary;
      }

      return tr1Value.localeCompare(tr2Value);
    } else {
      return tr1Value - tr2Value;
    }
  });

  tBody.append(...sortedBody);
  sortParams.sortedCol = th;
  sortParams.sortedOrder = 'ASC';
});

let selectedRow = null;

tBody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  if (selectedRow === tr) {
    selectedRow = null;

    return;
  }

  tr.classList.add('active');
  selectedRow = tr;
});

const form = document.createElement('form');

document.body.append(form);
form.className = 'new-employee-form';

const formInputs = ['name', 'position', 'office', 'age', 'salary'];

formInputs.forEach((inputName) => {
  const label = document.createElement('label');

  form.append(label);

  const labelTitle = inputName[0].toUpperCase() + inputName.slice(1);

  if (inputName === 'office') {
    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];
    const selectOptions = options
      .map(
        (city) =>
          `<option value=${city}>
        ${city}
      </option>`,
      )
      .join('');

    label.innerHTML = `${labelTitle}: 
      <select
        name=${inputName}
        data-qa=${inputName}
        value=${options[0]}
        required
      >
        ${selectOptions}
      </select>
    `;

    return;
  }

  const type =
    inputName === 'age' || inputName === 'salary' ? 'number' : 'text';

  label.innerHTML = `${labelTitle}:
    <input
      name=${inputName}
      type=${type}
      data-qa=${inputName}
      required
    />`;
});

const saveButton = document.createElement('button');

saveButton.textContent = 'Save to table';
form.append(saveButton);

saveButton.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = [...new FormData(form).entries()];
  const showNotification = (type, message) => {
    const notification = document.createElement('div');

    notification.classList.add('notification');
    notification.classList.add(type);
    notification.setAttribute('data-qa', 'notification');

    const notificationTitle = document.createElement('h2');

    notificationTitle.className = 'title';
    notificationTitle.textContent = type;

    const notificationText = document.createElement('p');

    notificationText.textContent = message;

    notification.append(notificationTitle);
    notification.append(notificationText);
    document.body.append(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const isValid = formData.every(([inputName, value]) => {
    const inputTitle = inputName[0].toUpperCase() + inputName.slice(1);

    if (!value) {
      showNotification('error', `${inputTitle} field must be filled`);

      return false;
    }

    switch (inputName) {
      case 'name':
        if (value.length < 4) {
          showNotification('error', 'Name field must have at least 4 letters');

          return false;
        }

        break;

      case 'age':
        if (+value < 18) {
          showNotification('error', 'Age must not be less than 18');

          return false;
        } else if (+value > 90) {
          showNotification('error', 'Age must not be more than 90');

          return false;
        }
    }

    return true;
  });

  if (!isValid) {
    return;
  }

  const newRow = document.createElement('tr');

  tBody.append(newRow);

  formData.forEach(([inputName, value]) => {
    const newCell = document.createElement('td');

    newRow.append(newCell);

    let cellValue = value[0].toUpperCase() + value.slice(1);

    if (inputName === 'salary') {
      cellValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(cellValue);
    }

    newCell.textContent = cellValue;
  });

  showNotification('success', 'The new employee is successfully added!');
  form.reset();
});

tBody.addEventListener('dblclick', (e) => {
  const row = e.target.closest('tr');
  const cell = e.target.closest('td');
  const cellIndex = [...row.cells].indexOf(cell);
  const cellName = tHead[cellIndex].textContent.toLowerCase();
  const cellValue = cell.textContent;

  cell.textContent = '';

  const cellForm = document.createElement('form');
  const input = document.createElement('input');

  input.className = 'cell-input';

  if (cellName === 'age' || cellName === 'salary') {
    input.setAttribute('type', 'number');
  }

  cellForm.append(input);
  cell.append(cellForm);

  input.focus();

  const saveChanges = () => {
    if (!input.value) {
      cell.textContent = cellValue;

      return;
    }

    if (cellName === 'salary') {
      cell.textContent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(input.value);

      return;
    }

    cell.textContent = input.value[0].toUpperCase() + input.value.slice(1);
  };

  input.addEventListener('blur', saveChanges);
  cellForm.addEventListener('submit', saveChanges);
});

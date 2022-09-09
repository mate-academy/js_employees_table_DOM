'use strict';
/*  eslint-disable */
const theadRow = document.querySelector('thead tr');
const bodyTable = document.querySelector('tbody');
let toggle = true;

theadRow.addEventListener('click', (e) => {
  const headerIndex = e.target.cellIndex;
  const rows = document
    .querySelectorAll(`tbody tr`);
  let copyRows = [...rows].map(row => {
    return row.cloneNode(true);
  });

  copyRows.sort((a, b) => {
    let value1 = a.querySelector(`td:nth-child(${headerIndex + 1}`).innerText;
    let value2 = b.querySelector(`td:nth-child(${headerIndex + 1}`).innerText;

    if (value1.startsWith('$') || value2.startsWith('$')) {
      value1 = value1.replace(/[^0-9]/g, '');
      value2 = value2.replace(/[^0-9]/g, '');

      return value1 - value2;
    }

    return value1.localeCompare(value2);
  });

  if (!toggle) {
    copyRows = copyRows.reverse();
  }
  toggle = !toggle;

  rows.forEach((elem, i) => {
    elem.innerHTML = copyRows[i].innerHTML;
  });
});

bodyTable.addEventListener('click', (e) => {
  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.toggle('active');
  }

  const row = e.target.closest('tr');

  row.classList.toggle('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="Submit">Save to table</button>
`;
document.body.append(form);

const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('invalid', (e) => {
    e.preventDefault();
    pushNotification('Error',
    'Some inputs are incorrect', 'error');
  });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
  const data = new FormData(form);
  const dataValues = Object.fromEntries(data.entries());

  const nf = new Intl.NumberFormat('en-US');

  dataValues.salary = '$' + nf.format(dataValues.salary);

  if (dataValues.name.length < 4
    || dataValues.position.length < 4
    || dataValues.age < 18
    || dataValues.age > 90) {
    pushNotification('Error',
    'Some inputs are incorrect', 'error');

  return;
}

  pushNotification('Success',
    'Data added to the table', 'success');

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${dataValues.name}</td>
    <td>${dataValues.position}</td>
    <td>${dataValues.office}</td>
    <td>${dataValues.age}</td>
    <td>${dataValues.salary}</td>
  `;
  bodyTable.append(tr);
});

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.dataset.qa = 'notification';

  div.innerHTML = `
    <h2 class='title'>${title}</h2>
    <p>${description}</p>
  `;
  document.body.append(div);

  setTimeout(() => {
    document.body.removeChild(div);
  }, 2000);
};

bodyTable.addEventListener('dblclick', (e) => {
  const item = e.target;
  const cellIndex = item.cellIndex;
  const initValue = item.innerText;
  const input = document.createElement('input');

  input.value = initValue;
  input.classList.add('cell-input');

  input.addEventListener('blur', saveData);
  input.addEventListener('keypress', doKeyPress);

  function doKeyPress(ev) {
    if (ev.key === 'Enter') {
      input.removeEventListener('blur', saveData);
      saveData();
    }
  }

  item.innerHTML = '';
  item.appendChild(input);
  input.focus();

  function saveData() {
    let val = input.value;

    if ((cellIndex === 0 || cellIndex === 1 || cellIndex === 2)
        && val.length < 4) {
      pushNotification('Error',
        'Name length should be more than 4 symbols', 'error');
      item.innerHTML = initValue;

      return;
    }

    if (cellIndex === 3) {
      val = +val;

      if (!Number.isFinite(val) || val < 18 || val > 90) {
        pushNotification('Error',
          'Age should be number and more 18 and less 90', 'error');
        item.innerHTML = initValue;

        return;
      }
    }

    if (cellIndex === 4) {
      val = +val;

      if (!Number.isFinite(val)) {
        pushNotification('Error',
          'Salary should be a number', 'error');
        item.innerHTML = initValue;

        return;
      }

      const nf = new Intl.NumberFormat('en-US');

      val = '$' + nf.format(val);
    }

    if (!input.value.length) {
      item.innerHTML = initValue;

      return;
    };

    pushNotification('Success',
      'Data added to the table', 'success');

    item.innerHTML = val;
  }
});

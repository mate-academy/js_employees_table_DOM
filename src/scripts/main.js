'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');

let isAscending = true;

const sortTable = function(index, type) {
  const compare = function(rowA, rowB) {
    const rowADate = rowA.cells[index].innerHTML;
    const rowBDate = rowB.cells[index].innerHTML;

    switch (type) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (rowADate < rowBDate) {
          return isAscending ? -1 : 1;
        } else if (rowADate > rowBDate) {
          return isAscending ? 1 : -1;
        }

        return 0;
      case 'Age':
        return isAscending ? rowADate - rowBDate : rowBDate - rowADate;
      case 'Salary':
        const dateA = rowADate.replace(/[$,]/g, '');
        const dateB = rowBDate.replace(/[$,]/g, '');

        return isAscending ? dateA - dateB : dateB - dateA;
    }
  };

  const rows = [].slice.call(tbody.rows);

  rows.sort(compare);

  table.removeChild(tbody);

  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }

  table.appendChild(tbody);

  isAscending = !isAscending;
};

let nameCount = 0;
let positionCount = 0;
let officeCount = 0;
let ageCount = 0;
let salaryCount = 0;

table.addEventListener('click', (e) => {
  const el = e.target;

  if (el.nodeName !== 'TH') {
    return;
  }

  const index = el.cellIndex;
  const type = el.innerText;

  sortTable(index, type);

  switch (type) {
    case 'Name':
      nameCount++;
      break;
    case 'Position':
      positionCount++;
      break;
    case 'Office':
      officeCount++;
      break;
    case 'Age':
      ageCount++;
      break;
    case 'Salary':
      salaryCount++;
      break;
  }

  if (nameCount === 2) {
    isAscending = true;
    nameCount = 0;
  }

  if (positionCount === 2) {
    isAscending = true;
    positionCount = 0;
  }

  if (officeCount === 2) {
    isAscending = true;
    officeCount = 0;
  }

  if (ageCount === 2) {
    isAscending = true;
    ageCount = 0;
  }

  if (salaryCount === 2) {
    isAscending = true;
    salaryCount = 0;
  }
});

tbody.addEventListener('click', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const tr = document.querySelectorAll('tr');

  [...tr].map(x => x.classList.remove('active'));

  e.target.parentNode.classList.add('active');
});

table.insertAdjacentHTML('afterend', `
<form class="new-employee-form" action="get">
  <label>Name: 
    <input name="name" type="text" data-qa="name" required>
  </label>
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
  <label>Age: 
    <input name="age" type="number" data-qa="age" min="18" 
    max="90" required>
  </label>
  <label>Salary: 
    <input name="salary" type="number" data-qa="salary" min="1" required>
  </label>
  <button>Save to table</button>
</form>
`);

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
});

const form = document.querySelector('form');

form.addEventListener('submit', function handleSubmit(e) {
  e.preventDefault();
});

const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');
  const notification = document.createElement('div');
  const header = document.createElement('h2');
  const content = document.createElement('p');

  body.append(notification);
  notification.append(header, content);

  header.textContent = title;
  content.textContent = description;

  notification.classList.add('notification', type);
  header.classList.add('title');
  notification.setAttribute('data-qa', 'notification');

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  const newEmp = document.createElement('tr');

  const inputName = document.getElementsByName('name');
  const inputPosition = document.getElementsByName('position');
  const inputAge = document.getElementsByName('age');
  const inputOffice = document.getElementsByName('office');
  const inputSalary = document.getElementsByName('salary');

  let isValid = true;

  if ((inputName[0].value.length
    - (inputName[0].value.split(' ').length - 1)) < 4) {
    isValid = false;

    pushNotification('Error message',
      'Name should be at least 4 characters long.', 'error');
  } else if ((inputPosition[0].value.length
    - (inputPosition[0].value.split(' ').length - 1)) < 4) {
    isValid = false;

    pushNotification('Error message',
      'Position should be at least 4 characters long.', 'error');
  } else if (inputAge[0].value < 18 || inputAge[0].value > 90) {
    isValid = false;

    pushNotification('Error message',
      'Age should be between 18 and 90.', 'error');
  } else if (inputSalary[0].value < 1) {
    isValid = false;

    pushNotification('Error message',
      'Salary should be at least $1.', 'error');
  }

  if (e.target === button && isValid) {
    tbody.append(newEmp);

    newEmp.insertAdjacentHTML('beforeend', `
          <td>${inputName[0].value}</td>
          <td>${inputPosition[0].value}</td>
          <td>${inputOffice[0].value}</td>
          <td>${inputAge[0].value}</td>
          <td>$${Number(inputSalary[0].value).toLocaleString('en-US')}</td>
        `);

    pushNotification('Success message',
      'Employee added successfully!', 'success');
    form.reset();
  }
});

tbody.addEventListener('dblclick', (e) => {
  const item = e.target;
  const targetCell = item.cellIndex;
  const prevValue = item.innerText;
  const normValue = prevValue.replace(/[$,]/g, '');
  const targetInput
    = form.querySelectorAll('[data-qa]')[targetCell].cloneNode(true);

  targetInput.classList.add('cell-input');
  targetInput.value = normValue;
  item.firstChild.replaceWith(targetInput);
  targetInput.focus();

  targetInput.addEventListener('keypress', eventKey => {
    if (eventKey.key === 'Enter') {
      targetInput.blur();
    }
  });

  targetInput.addEventListener('blur', eventBlur => {
    if ((targetInput.name === 'name' || 'position' || 'office')
    && targetInput.value.length >= 4) {
      item.textContent = targetInput.value;

      pushNotification('Success message',
        'Success!', 'success');

      return;
    } else if (targetInput.name === 'age'
    && targetInput.value >= 18
    && targetInput.value <= 90) {
      item.textContent = targetInput.value;

      pushNotification('Success message',
        'Success!', 'success');

      return;
    } else if (targetInput.name === 'salary'
    && targetInput.value >= 1) {
      item.textContent
      = `$${Number(targetInput.value).toLocaleString('en-US')}`;

      pushNotification('Success message',
        'Success!', 'success');

      return;
    }
    item.textContent = prevValue;

    pushNotification('Error message',
      'Input error', 'error');
  });
});

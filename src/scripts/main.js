'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const sortTableASC = function(index, type) {
  const compare = function(rowA, rowB) {
    const rowADate = rowA.cells[index].innerHTML;
    const rowBDate = rowB.cells[index].innerHTML;

    switch (type) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (rowADate < rowBDate) {
          return -1;
        } else if (rowADate > rowBDate) {
          return 1;
        }

        return 0;
      case 'Age':
        return rowADate - rowBDate;
      case 'Salary':
        const dateA = rowADate.split('$').join('').split(',').join('');
        const dateB = rowBDate.split('$').join('').split(',').join('');

        return dateA - dateB;
    }
  };

  const rows = [].slice.call(tbody.rows);

  rows.sort(compare);

  table.removeChild(tbody);

  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }

  table.appendChild(tbody);
};

const sortTableDESC = function(index, type) {
  const compare = function(rowA, rowB) {
    const rowADate = rowA.cells[index].innerHTML;
    const rowBDate = rowB.cells[index].innerHTML;

    switch (type) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (rowADate < rowBDate) {
          return 1;
        } else if (rowADate > rowBDate) {
          return -1;
        }

        return 0;
      case 'Age':
        return rowBDate - rowADate;
      case 'Salary':
        const dateA = rowADate.split('$').join('').split(',').join('');
        const dateB = rowBDate.split('$').join('').split(',').join('');

        return dateB - dateA;
    }
  };

  const rows = [].slice.call(tbody.rows);

  rows.sort(compare);

  table.removeChild(tbody);

  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }

  table.appendChild(tbody);
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

  sortTableASC(index, type);

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
    sortTableDESC(index, type);
    nameCount = 0;
  }

  if (positionCount === 2) {
    sortTableDESC(index, type);
    positionCount = 0;
  }

  if (officeCount === 2) {
    sortTableDESC(index, type);
    officeCount = 0;
  }

  if (ageCount === 2) {
    sortTableDESC(index, type);
    ageCount = 0;
  }

  if (salaryCount === 2) {
    sortTableDESC(index, type);
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
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>Salary: 
    <input name="salary" type="number" data-qa="salary" required>
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

  if (inputName[0].value.length < 4) {
    isValid = false;

    pushNotification('Error message',
      'Name should be at least 4 characters long.', 'error');
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
          <td>$${inputSalary[0].value.slice(0, 3)},
          ${inputSalary[0].value.slice(3)}</td>
        `);

    pushNotification('Success message',
      'Employee added successfully!', 'success');
    form.reset();
  }
});

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;
  const input = document.createElement('input');
  const initialValue = target.textContent;

  input.classList.add('cell-input');
  target.innerText = '';
  target.append(input);
  input.focus();

  function changeCellContent(value = initialValue) {
    target.innerText = value;
    input.remove();
  }

  function saveEditedField() {
    if (!input.value) {
      changeCellContent();

      return;
    }

    changeCellContent(input.value);
  }

  input.onblur = () => {
    saveEditedField();
  };

  input.onkeydown = (keyboardEvent) => {
    const isEnter = keyboardEvent.code === 'Enter';

    if (isEnter) {
      saveEditedField();
    }
  };
});

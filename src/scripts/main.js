'use strict';

// ================= ADDING FORM ON PAGE =================
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

employeeForm.innerHTML = `
<label>Name:
  <input name="name" type="text" data-qa="name">
</label>
<label>Position:
  <input name="position" type="text" data-qa="position">
</label>
<label>Office
  <select name="office" data-qa="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>
  Age: <input name="age" type="number" data-qa="age">
</label>
<label>Salary:
  <input name="salary" type="number" data-qa="salary">
</label>
<button type="submit"> Save to table</button>
`;
document.body.append(employeeForm);

// // ================= SORTING TABLE =======================
const tableBody = document.querySelector('tbody');
const heads = document.querySelectorAll('th');
const arrTable = [];
let sorted;
let sortColumn;

const getRows = () => {
  arrTable.splice(0, arrTable.length);

  [...tableBody.children].forEach(row => {
    arrTable.push({
      name: row.children[0].innerText,
      position: row.children[1].innerText,
      office: row.children[2].innerText,
      age: row.children[3].innerText,
      salary: row.children[4].innerText,
    });
  });
};

const sortTable = (sortedBy, target) => {
  if (target.textContent !== sorted) {
    switch (sortedBy) {
      case 'names':
        arrTable.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'positions':
        arrTable.sort((a, b) => a.position.localeCompare(b.position));
        break;

      case 'offices':
        arrTable.sort((a, b) => a.office.localeCompare(b.office));
        break;

      case 'ages':
        arrTable.sort((a, b) => a.age - b.age);
        break;

      case 'salaries':
        arrTable.sort((a, b) => parseFloat(a.salary.slice(1))
        - parseFloat(b.salary.slice(1)));
        break;
    }
  }

  if (target.textContent === sorted) {
    arrTable.reverse();
  } else {
    sorted = target.textContent;
  }

  [...tableBody.children].forEach((row, index) => {
    row.children[0].innerText = arrTable[index].name;
    row.children[1].innerText = arrTable[index].position;
    row.children[2].innerText = arrTable[index].office;
    row.children[3].innerText = arrTable[index].age;
    row.children[4].innerText = arrTable[index].salary;
  });
};

heads.forEach(item => {
  if (item.closest('thead')) {
    item.addEventListener('click', (e) => {
      switch (e.target.innerText) {
        case 'Name':
          sortColumn = 'names';
          break;

        case 'Position':
          sortColumn = 'positions';
          break;

        case 'Office':
          sortColumn = 'offices';
          break;

        case 'Age':
          sortColumn = 'ages';
          break;

        case 'Salary':
          sortColumn = 'salaries';
          break;
      }
      getRows();
      sortTable(sortColumn, e.target);
    });
  }
});

// ================= ACTIVE ROW =================
tableBody.addEventListener('click', (e) => {
  [...tableBody.children].forEach(row => {
    row.classList.remove('active');
  });
  e.target.parentElement.classList.add('active');
});

// ================= FORM VALIDATION & NOTIFICATION =======================
let isValid = false;

const pushNotification = (title, description, type,
  posTop = 450, posRight = 250) => {
  const body = document.querySelector('body');
  const block = document.createElement('div');
  const header = document.createElement('h2');
  const text = document.createElement('p');

  text.innerText = description;
  header.innerText = title;
  block.classList.add('notification', type);
  block.setAttribute('data-qa', 'notification');
  header.classList.add('title');
  block.append(header, text);
  body.append(block);

  header.style.fontSize = '18px';
  block.style.top = `${posTop}px`;
  block.style.right = `${posRight}px`;

  setTimeout(() => block.remove(), 2000);
};

const focusInvalidField = (field) => {
  employeeForm.children[field].firstElementChild
    .addEventListener('focus', (e) => {
      e.target.style.outlineColor = '#FF0000';
    });
  employeeForm.children[field].focus();
};

const validateForm = (data) => {
  if (data.get('name').length < 4) {
    focusInvalidField(0);

    pushNotification(
      'Name is not correct',
      'Your name need to has less more than 4 letters.',
      'error');

    isValid = false;
  } else if (data.get('position') === '') {
    focusInvalidField(1);

    pushNotification(
      'Position is not correct',
      'Position need to be not empty.',
      'error');

    isValid = false;
  } else if (data.get('age') < 18 || data.get('age') > 90) {
    focusInvalidField(3);

    pushNotification(
      'Age is not correct',
      'Your age need to be more than 17 and less than 91.',
      'error');

    isValid = false;
  } else if (data.get('salary') === '') {
    focusInvalidField(4);

    pushNotification(
      'Salary is not correct',
      'Salary need to be not empty.',
      'error');

    isValid = false;
  } else {
    isValid = true;
  }
};

// ================= SENDING FORM DATA TO TABLE =======================
employeeForm.addEventListener('submit', (e) => {
  const data = new FormData(employeeForm);
  const salaryResult = `$${Number(data.get('salary')).toLocaleString('de-DE')}`;

  e.preventDefault();
  validateForm(data);

  if (!isValid) {
    return;
  }

  const newRow = tableBody.insertRow();

  newRow.insertCell(0).innerText = data.get('name');
  newRow.insertCell(1).innerText = data.get('position');
  newRow.insertCell(2).innerText = data.get('office');
  newRow.insertCell(3).innerText = data.get('age');
  newRow.insertCell(4).innerText = salaryResult.split('.').join(',');

  employeeForm.reset();

  pushNotification(
    'Validation Success',
    'Employee is successfully added',
    'success');
});

// ================= CHANGING FIELD =================
const cells = document.querySelectorAll('td');
const indexCompare = [];
let validCell;

const changeCellOnInput = (e, prev) => {
  let cellWidth = getComputedStyle(e.target).width;

  switch (e.target.cellIndex) {
    case 0:
    case 1:
      e.target.innerHTML
        = `<input type="text" class="cell-input" placeholder="${prev}">`;
      break;

    case 2:
      e.target.innerHTML
      = `
    <select class="cell-input">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
      `;
      document.querySelector('select.cell-input').value = prev;
      break;

    case 3:
    case 4:
      e.target.innerHTML
      = `<input type="number" class="cell-input" placeholder="${prev}">`;
      cellWidth = `${parseFloat(cellWidth) + 30}px`;
      break;
  }

  document.querySelector('.cell-input').style.width = cellWidth;
  e.target.firstElementChild.focus();
};

const editCells = (el, prev) => {
  const newText = el.target.firstElementChild.value;

  if (newText === '' || newText === '0') {
    el.target.innerHTML = prev;
  } else {
    el.target.cellIndex !== 4
      ? el.target.innerHTML = newText
      : el.target.innerHTML = `
        $${Number(newText).toLocaleString('de-DE').split('.').join(',')}
      `;

    if (el.target.cellIndex !== 2) {
      pushNotification(
        'Validation Success',
        'Employee is successfully edited',
        'success');
    }
  }
};

const validateCell = (e) => {
  const input = document.querySelector('.cell-input');
  const getValidCell = () => {
    e.target.firstElementChild.focus();
    e.target.style.border = '2px solid #FF0000';
    validCell = true;
  };

  validCell = false;

  if (!input.value.length) {
    return validCell;
  }

  if (e.target.cellIndex === 0) {
    if (input.value.length < 4) {
      getValidCell();

      return pushNotification(
        'Name is not correct',
        'Your name need to has less more than 4 letters.',
        'error',);
    }
  } else if (e.target.cellIndex === 3) {
    if (input.value < 18 || input.value > 90) {
      getValidCell();

      return pushNotification(
        'Age is not correct',
        'Your age need to be more than 17 and less than 91.',
        'error');
    }
  } else {
    return validCell;
  }
};

const saveChangesToTable = (e, prev) => {
  validateCell(e);

  if (!validCell) {
    e.target.style.border = 'none';
    indexCompare.length = 0;

    return editCells(e, prev);
  }
};

cells.forEach((cell, index) => {
  cell.addEventListener('dblclick', (e) => {
    indexCompare.push(index);

    if (indexCompare[0] !== index) {
      return pushNotification(
        'Unfinished edit',
        'You cannot edit another cell, while this has errors',
        'error',
        580);
    }

    const prevText = e.target.innerText;

    changeCellOnInput(e, prevText);

    const field = e.target.firstElementChild;

    field.addEventListener('blur', () => {
      saveChangesToTable(e, prevText);
    });

    field.addEventListener('keyup', (ev) => {
      if (ev.key === 'Enter') {
        field.blur();
      }
    });
  });
});

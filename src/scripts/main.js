'use strict';

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');
let sortOrder = '';
let sortHeader = null;

table.addEventListener('click', e => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const th = e.target;

  if (sortHeader !== th) {
    sortOrder = 'ASC';
    sortHeader = th;
  } else {
    sortOrder = 'DESC';
    sortHeader = null;
  }

  sortTable(th.cellIndex, th, sortOrder);
});

function sortTable(colNum, target, order) {
  const tbody = table.querySelector('tbody');
  const rowsArray = Array.from(tbody.rows);
  let compare;

  if (order === 'ASC') {
    switch (target.textContent) {
      case 'Name':
      case 'Position':
      case 'Office':
        compare = function(rowA, rowB) {
          return rowA.cells[colNum].innerHTML
            .localeCompare(rowB.cells[colNum].innerHTML);
        };
        break;

      case 'Age':
        compare = function(rowA, rowB) {
          return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
        };
        break;

      case 'Salary':
        compare = function(rowA, rowB) {
          return getSalary(rowA.cells[colNum].innerHTML)
            - getSalary(rowB.cells[colNum].innerHTML);
        };
        break;
    }
  }

  if (order === 'DESC') {
    switch (target.textContent) {
      case 'Name':
      case 'Position':
      case 'Office':
        compare = function(rowA, rowB) {
          return rowB.cells[colNum].innerHTML
            .localeCompare(rowA.cells[colNum].innerHTML);
        };
        break;

      case 'Age':
        compare = function(rowA, rowB) {
          return rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML;
        };
        break;

      case 'Salary':
        compare = function(rowA, rowB) {
          return getSalary(rowB.cells[colNum].innerHTML)
            - getSalary(rowA.cells[colNum].innerHTML);
        };
        break;
    }
  }

  rowsArray.sort(compare);
  tbody.append(...rowsArray);
}

function getSalary(row) {
  return Number(row.slice(1).split(',').join(''));
}

tBody.addEventListener('click', e => {
  const target = e.target.closest('tr');

  if (!target || !tBody.contains(target)) {
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    toggleSelect(target);
  } else {
    singleSelect(target);
  }
});

function toggleSelect(tr) {
  tr.classList.toggle('active');
}

function singleSelect(tr) {
  const selected = tBody.querySelectorAll('.active');

  for (const elem of selected) {
    elem.classList.remove('active');
  }

  tr.classList.add('active');
}

function removeSelect() {
  const selected = tBody.querySelectorAll('.active');

  for (const elem of selected) {
    elem.classList.remove('active');
  }
}

table.insertAdjacentHTML('afterend', `
  <form action="./" class="new-employee-form" name="employee-form">
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
    <button type='submit'>Save to table</button>
  </form>
`);

const form = document.forms['employee-form'];

const lastElem = form.elements[form.elements.length - 1];
const firstElem = form.elements[0];

lastElem.onkeydown = function(e) {
  if (e.key === 'Tab' && !e.shiftKey) {
    firstElem.focus();

    return false;
  }
};

firstElem.onkeydown = function(e) {
  if (e.key === 'Tab' && e.shiftKey) {
    lastElem.focus();

    return false;
  }
};

lastElem.addEventListener('click', e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  if (!formValidation(data)) {
    return;
  }

  saveDataToTable(data);
  removeSelect();
  form.reset();
});

function saveDataToTable(data) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>$${Number(data.salary).toLocaleString('en-US')}</td>
  `;

  tBody.append(tr);
}

function formValidation(data) {
  if (data.name.length < 4) {
    pushNotification(
      'Error',
      'Name must contain more then 3 character',
      'error'
    );

    return false;
  }

  if (data.age < 18 || data.age > 90) {
    pushNotification(
      'Error',
      'Age must be between 18 and 90',
      'error'
    );

    return false;
  }

  if (data.position === '' || data.salary === '') {
    pushNotification(
      'Error',
      'Fill in all fields of the form',
      'error'
    );

    return false;
  }

  pushNotification('Success',
    'New employee successfully added',
    'success'
  );

  return true;
}

function pushNotification(title, description, type) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
  </div>
`);

  setTimeout(() => {
    document.body.querySelector('.notification').remove();
  }, 2000);
};

let editingTd;

tBody.addEventListener('dblclick', e => {
  e.preventDefault();

  if (e.target.tagName !== 'TD') {
    return;
  }

  const td = e.target;
  const index = td.cellIndex;

  makeTdEditable(td, index);
});

function makeTdEditable(td, index) {
  editingTd = {
    elem: td,
    data: td.innerHTML,
  };

  let input;

  switch (index) {
    case 0:
      input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'at least 4 character';
      input.value = td.innerHTML;
      break;

    case 1:
      input = document.createElement('input');
      input.type = 'text';
      input.value = td.innerHTML;
      break;

    case 2:
      input = document.createElement('select');

      input.innerHTML = `
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
      `;
      input.value = td.innerHTML;
      break;

    case 3:
      input = document.createElement('input');
      input.type = 'number';
      // input.placeholder = 'age 18 - 90';
      input.value = td.innerHTML;
      break;

    case 4:
      input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'just a number';
      input.value = Number(td.innerHTML.slice(1).split(',').join(''));
      break;
  }

  input.className = 'cell-input';
  input.style.width = td.clientWidth + 'px';
  td.innerHTML = '';
  td.appendChild(input);
  input.focus();

  input.onkeydown = function(e) {
    if (e.key === 'Enter') {
      this.blur();
    }
  };

  input.onblur = function() {
    finishTdEdit(td, input, index);
  };
}

function finishTdEdit(td, input, index) {
  if (input.value !== '') {
    switch (index) {
      case 0:
        if (input.value.length < 4) {
          td.innerText = editingTd.data;

          pushNotification(
            'Error',
            'Name must contain more then 3 character',
            'error'
          );
          break;
        }

        td.innerText = input.value;
        break;

      case 3:
        if (input.value < 18 || input.value > 90) {
          td.innerText = editingTd.data;

          pushNotification(
            'Error',
            'Age must be between 18 and 90',
            'error'
          );
          break;
        }

        td.innerText = input.value;
        break;

      case 4:
        td.innerText = `$${Number(input.value).toLocaleString('en-US')}`;
        break;

      default:
        td.innerText = input.value;
    }
  } else {
    td.innerText = editingTd.data;
  }
  input.remove();
  editingTd = null;
}

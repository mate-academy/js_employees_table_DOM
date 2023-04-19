'use strict';

const body = document.querySelector('body');
const head = document.querySelector('thead');
const table = document.querySelector('tbody');

let sortDirection = 'asc';

head.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const data = [...table.children];

  data.sort((a, b) => {
    const contentA = a.cells[index].textContent;
    const contentB = b.cells[index].textContent;
    const type = e.target.textContent;

    let compareResult;

    switch (type) {
      case 'Name':
      case 'Position':
      case 'Office':
        compareResult = contentA.localeCompare(contentB);
        break;

      case 'Age':
        compareResult = contentA - contentB;
        break;

      case 'Salary':
        const normalize = (item) => item.slice(1).split(',').join('');

        compareResult = normalize(contentA) - normalize(contentB);
        break;

      default:
        break;
    }

    if (sortDirection === 'desc') {
      compareResult *= -1;
    }

    return compareResult;
  });

  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

  table.append(...data);
});

const rows = document.querySelectorAll('tr');
let selectedRow = null;

rows.forEach((row) => {
  row.addEventListener('click', () => {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }
    row.classList.add('active');
    selectedRow = row;
  });
});

function removeSelect() {
  const selected = table.querySelectorAll('.active');

  for (const elem of selected) {
    elem.classList.remove('active');
  }
}

body.insertAdjacentHTML('beforeend', `
  <form action="./" class="new-employee-form" name="employee-form">
    <label>Name:
      <input name="name" data-qa="name" type="text" required>
    </label>
    <label>Position:
      <input name="position" data-qa="position" type="text" required>
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
      <input name="age" data-qa="age" type="number" required>
    </label>
    <label>Salary:
      <input name="salary" data-qa="salary" type="number" required>
    </label>
    <button type="submit">Save to table</button>
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

  if (!validationsOfInformation(data)) {
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

  table.append(tr);
}

const minAge = 18;
const maxAge = 90;

function validationsOfInformation(data) {
  if (data.name.length < 4) {
    pushNotification(
      'Error',
      'Name must contain more then 3 character',
      'error'
    );

    return false;
  }

  if (data.age < minAge || data.age > maxAge) {
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

table.addEventListener('dblclick', e => {
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
      input.value = td.innerHTML;
      break;

    case 4:
      input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'just a number';
      input.value = +td.innerHTML.slice(1).split(',').join('');
      break;

    default:
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
        if (input.value < minAge || input.value > maxAge) {
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

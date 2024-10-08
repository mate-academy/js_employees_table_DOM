'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tbodyRows = tbody.children;
const employeeForm = createForm();
const theadName = 'Name';
const theadAge = 'Age';
const theadPosition = 'Position';
const theadOffice = 'Office';
const theadSalary = 'Salary';

thead.addEventListener('click', sortTable);
tbody.addEventListener('click', sellectRow);
tbody.addEventListener('dblclick', editCell);
employeeForm.addEventListener('submit', submitForm);

function submitForm(e) {
  e.preventDefault();

  const data = new FormData(employeeForm);

  if (checkFields(data)) {
    return;
  }

  const dataArr = [
    data.get('name'),
    data.get('position'),
    data.get('office'),
    data.get('age'),
    '$' + (+data.get('salary')).toLocaleString(),
  ];

  const tr = document.createElement('tr');

  tbody.append(tr);

  for (let i = 0; i < dataArr.length; i++) {
    tr.innerHTML += `<td>${dataArr[i]}</td>`;
  }

  pushNotification(
    10,
    10,
    'New employee added',
    'The employee successfully added to the table.',
    'success',
  );

  employeeForm.reset();
}

function checkTableValues(value, headValue) {
  switch (headValue) {
    case theadName:
      return !(value.length < 4);
    case theadAge:
      return !isNaN(+value) && !(+value < 18) && !(+value > 90);
    case theadSalary:
      return !isNaN(salaryToNumber(value));
    case theadPosition:
      return !(value.length === 0);
    case theadOffice:
      return true;
  }
}

function checkFields(formData) {
  const cheksArr = [];

  if (formData.get('name').length < 4) {
    pushNotification(
      150,
      10,
      'Wrong name length',
      'The name must contain 4 characters or more.',
      'error',
    );

    cheksArr.push(false);
  }

  if (+formData.get('age') < 18 || +formData.get('age') > 90) {
    pushNotification(
      290,
      10,
      'Wrong age',
      'The age must be between 18 and 90.',
      'error',
    );

    cheksArr.push(false);
  }

  if (!formData.get('position').trim().length) {
    pushNotification(
      430,
      10,
      'Wrong position',
      'Please enter a correct position.',
      'error',
    );

    cheksArr.push(false);
  }

  return cheksArr.includes(false);
}

function editCell(e) {
  const cell = e.target.closest('td');
  const curValue = cell.innerText;
  const theadValue = thead.rows[0].cells[cell.cellIndex].innerText;
  let cellInput;

  if (!cell || e.target.tagName === 'INPUT') {
    return;
  }

  if (cell.cellIndex !== 2) {
    cellInput = document.createElement('input');

    switch (theadValue) {
      case theadName:
      case theadPosition:
        cellInput.setAttribute('type', 'text');
        break;
      case theadSalary:
      case theadAge:
        cellInput.setAttribute('type', 'number');
        break;
    }

    cellInput.setAttribute('type', 'text');
    cellInput.setAttribute('value', curValue);
    cellInput.setAttribute('autofocus', true);
    cellInput.setSelectionRange(cellInput.value.length, cellInput.value.length);
  } else {
    cellInput = document.createElement('select');

    cellInput.innerHTML = `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `;
    cellInput.setAttribute('autofocus', true);

    [...cellInput.children].forEach((element) => {
      if (element.value === curValue) {
        element.setAttribute('selected', true);
      }
    });
  }

  cellInput.classList.add('cell-input');
  cell.innerText = '';
  cell.append(cellInput);
  cellInput.focus();
  cellInput.addEventListener('blur', changeValue);

  window.addEventListener('keypress', (evt) => {
    if (evt.code === 'Enter') {
      cellInput.blur();
    }
  });

  function changeValue(evt) {
    const tdCell = evt.target.parentNode;
    let newValue = cellInput.value;

    if (curValue.includes('$')) {
      newValue = '$' + salaryToNumber(newValue).toLocaleString();
    }

    if (checkTableValues(newValue, theadValue)) {
      tdCell.innerHTML = newValue;
    } else {
      pushNotification(
        10,
        10,
        `Wrong ${theadValue} value`,
        `Please, enter the correct value for the ${theadValue} field.`,
        'error',
      );
      cellInput.value = curValue;
      cellInput.focus();
    }
  }
}

function sellectRow(e) {
  const row = e.target.closest('tr');

  for (let i = 0; i < tbody.rows.length; i++) {
    if (tbody.rows[i].classList.contains('active')) {
      tbody.rows[i].classList.remove('active');
    }
  }

  if (!row) {
    return;
  }

  row.classList.add('active');
}

function sortTable(e) {
  const rowsArr = [...tbodyRows];
  const targetText = e.target.innerText;

  if (
    !Object.keys(e.target.dataset).length ||
    e.target.dataset.sort === 'asc'
  ) {
    rowsArr.sort((a, b) => {
      switch (targetText) {
        case theadName:
          return a.children[0].innerText.localeCompare(b.children[0].innerText);
        case theadPosition:
          return a.children[1].innerText.localeCompare(b.children[1].innerText);
        case theadOffice:
          return a.children[2].innerText.localeCompare(b.children[2].innerText);
        case theadAge:
          return +a.children[3].innerText - +b.children[3].innerText;
        case theadSalary:
          return (
            salaryToNumber(a.children[4].innerText) -
            salaryToNumber(b.children[4].innerText)
          );
      }
    });

    e.target.dataset.sort = 'desc';
  } else {
    rowsArr.sort((a, b) => {
      switch (targetText) {
        case theadName:
          return b.children[0].innerText.localeCompare(a.children[0].innerText);
        case theadPosition:
          return b.children[1].innerText.localeCompare(a.children[1].innerText);
        case theadOffice:
          return b.children[2].innerText.localeCompare(a.children[2].innerText);
        case theadAge:
          return +b.children[3].innerText - +a.children[3].innerText;
        case theadSalary:
          return (
            salaryToNumber(b.children[4].innerText) -
            salaryToNumber(a.children[4].innerText)
          );
      }
    });

    e.target.dataset.sort = 'asc';
  }

  tbody.innerHTML = '';

  rowsArr.forEach((element) => {
    tbody.append(element);
  });
}

function salaryToNumber(str) {
  if (str.includes('$') && str.indexOf('$') === 0) {
    return +str.slice(1).split(',').join('');
  }

  return +str;
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';
  notification.classList.add(type);
  notification.innerHTML = `<h2 class="title">${title}</h2><p>${description}</p>`;
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';
  document.body.append(notification);
  setTimeout(() => (notification.style.display = 'none'), 2000);
};

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/');
  form.setAttribute('novalidate', '');
  form.setAttribute('name', 'New employee');

  form.innerHTML = `
    <label>
      Name:
      <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position">
    </label>
    <label>
      Office:
      <select name="office" id="cities" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit">Save to table</button>
  `;

  document.body.append(form);

  return form;
}

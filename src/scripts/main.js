'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tbodyRows = tbody.children;
const employeeForm = createForm();

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
  const cellInput = document.createElement('input');

  if (!cell || e.target.tagName === 'INPUT') {
    return;
  }

  cellInput.classList.add('cell-input');
  cellInput.setAttribute('type', 'text');
  cellInput.setAttribute('value', curValue);
  cellInput.setAttribute('autofocus', true);
  cellInput.setSelectionRange(cellInput.value.length, cellInput.value.length);
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
    let newValue = cellInput.value;

    if (curValue.includes('$') && !newValue.includes('$')) {
      newValue = '$' + (+newValue).toLocaleString();
    }

    cell.innerHTML = newValue;
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
        case 'Name':
          return a.children[0].innerText.localeCompare(b.children[0].innerText);
        case 'Position':
          return a.children[1].innerText.localeCompare(b.children[1].innerText);
        case 'Office':
          return a.children[2].innerText.localeCompare(b.children[2].innerText);
        case 'Age':
          return +a.children[3].innerText - +b.children[3].innerText;
        case 'Salary':
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
        case 'Name':
          return b.children[0].innerText.localeCompare(a.children[0].innerText);
        case 'Position':
          return b.children[1].innerText.localeCompare(a.children[1].innerText);
        case 'Office':
          return b.children[2].innerText.localeCompare(a.children[2].innerText);
        case 'Age':
          return +b.children[3].innerText - +a.children[3].innerText;
        case 'Salary':
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
  return +str.slice(1).split(',').join('');
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

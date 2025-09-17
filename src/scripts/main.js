'use strict';

const body = document.body;
const table = document.querySelector('table');
const thead = table.tHead;
const tbody = table.tBodies[0];
const direction = [];

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = th.cellIndex;

  // asc sorted list
  function asc() {
    return [...tbody.rows].sort((item1, item2) => {
      const aRaw = normalizeStr(item1.cells[index].innerText);
      const bRaw = normalizeStr(item2.cells[index].innerText);
      const a = parseFloat(aRaw);
      const b = parseFloat(bRaw);
      const aIsNum = !Number.isNaN(a);
      const bIsNum = !Number.isNaN(b);

      if (aIsNum && bIsNum) {
        return a - b;
      } else {
        return item1.cells[index].innerText.localeCompare(
          item2.cells[index].innerText,
        );
      }
    });
  }

  // desc sorted list
  function desc() {
    return [...tbody.rows].sort((item1, item2) => {
      const aRaw = normalizeStr(item1.cells[index].innerText);
      const bRaw = normalizeStr(item2.cells[index].innerText);
      const a = parseFloat(aRaw);
      const b = parseFloat(bRaw);
      const aIsNum = !Number.isNaN(a);
      const bIsNum = !Number.isNaN(b);

      if (aIsNum && bIsNum) {
        return b - a;
      } else {
        return item2.cells[index].innerText.localeCompare(
          item1.cells[index].innerText,
        );
      }
    });
  }

  if (direction.length === 0) {
    tbody.append(...asc());
    direction[0] = index;
    direction[1] = 'asc';
  } else if (direction[0] === index && direction[1] === 'desc') {
    tbody.append(...asc());
    direction[0] = index;
    direction[1] = 'asc';
  } else if (direction[0] === index && direction[1] === 'asc') {
    tbody.append(...desc());
    direction[0] = index;
    direction[1] = 'desc';
  } else {
    tbody.append(...asc());
    direction[0] = index;
    direction[1] = 'asc';
  }
});

function normalizeStr(item) {
  return item.trim().replace(/[^0-9.-]+/g, '');
}

// select row
table.tBodies[0].addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  [...table.tBodies[0].rows].forEach((row) => {
    if (row === tr && !row.classList.contains('active')) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  });
});

// notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.setAttribute('class', 'notification');
  div.classList.add(type);
  div.dataset.qa = 'notification';
  h2.setAttribute('class', 'title');
  h2.textContent = title;
  p.textContent = description;
  div.append(h2);
  div.append(p);
  div.style.position = 'absolute';
  div.style.top = posTop + 'px';
  div.style.right = posRight + 'px';
  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

// FORM
const formHtml = document.createElement('form');
const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');
const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');
const labelSelect = document.createElement('label');
const select = document.createElement('select');
const optionTokyo = document.createElement('option');
const optionSingapore = document.createElement('option');
const optionLondon = document.createElement('option');
const optionNewYork = document.createElement('option');
const optionEdinburgh = document.createElement('option');
const optionSanFrancisco = document.createElement('option');
const button = document.createElement('button');

formHtml.setAttribute('class', 'new-employee-form');
formHtml.setAttribute('id', 'form');
inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('required', '');
inputName.dataset.qa = 'name';
inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('required', '');
inputPosition.dataset.qa = 'position';
inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('required', '');
inputAge.dataset.qa = 'age';
inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.setAttribute('required', '');
inputSalary.dataset.qa = 'salary';
labelName.textContent = 'Name: ';
labelName.append(inputName);
labelPosition.textContent = 'Position: ';
labelPosition.append(inputPosition);
labelAge.textContent = 'Age: ';
labelAge.append(inputAge);
labelSalary.textContent = 'Salary: ';
labelSalary.append(inputSalary);
select.setAttribute('name', 'office');
select.setAttribute('required', '');
select.dataset.qa = 'office';
labelSelect.textContent = 'Office: ';
labelSelect.append(select);
optionTokyo.textContent = 'Tokyo';
optionTokyo.setAttribute('value', 'tokyo');
optionSingapore.textContent = 'Singapore';
optionSingapore.setAttribute('value', 'singapore');
optionLondon.textContent = 'London';
optionLondon.setAttribute('value', 'london');
optionNewYork.textContent = 'New York';
optionNewYork.setAttribute('value', 'new-york');
optionEdinburgh.textContent = 'Edinburgh';
optionEdinburgh.setAttribute('value', 'edinburgh');
optionSanFrancisco.textContent = 'San Francisco';
optionSanFrancisco.setAttribute('value', 'san-francisco');
select.append(optionTokyo);
select.append(optionSingapore);
select.append(optionLondon);
select.append(optionNewYork);
select.append(optionEdinburgh);
select.append(optionSanFrancisco);
button.setAttribute('type', 'submit');
button.textContent = 'Save to table';
formHtml.append(labelName);
formHtml.append(labelPosition);
formHtml.append(labelSelect);
formHtml.append(labelAge);
formHtml.append(labelSalary);
formHtml.append(button);
body.append(formHtml);

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document
    .querySelector('[name="name"]')
    .value.trim()
    .replace(/[^a-zA-Z]/g, '');
  const position = document.querySelector('[name="position"]').value.trim();
  const age = document.querySelector('[name="age"]').value.trim();
  const office = document
    .querySelector('[name="office"]')
    .value.replace(/-/g, ' ')
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase() + word.slice(1)}`)
    .join(' ');
  const salary = document.querySelector('[name="salary"]').value.trim();
  const row = document.createElement('tr');

  if (nameInput.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Name must be longer than 4 characters!!!',
      'error',
    );

    return;
  }

  if (+age < 18 || +age > 90) {
    pushNotification(
      10,
      10,
      'Error',
      'Age must be more than 18 and less than 90!!!',
      'error',
    );

    return;
  }

  if (!position || !office || !salary) {
    pushNotification(
      10,
      10,
      'Error',
      'Please fill out all fields with valid values!!!',
      'error',
    );

    return;
  }

  if (Number.isNaN(+salary) || !Number.isFinite(+salary)) {
    pushNotification(
      10,
      10,
      'Error',
      'Please fill out salary field with valid value!!!',
      'error',
    );

    return;
  }

  const salaryValid = `$${(salary / 1000).toFixed(3).toString().replace('.', ',')}`;

  row.innerHTML = `
  <td>${nameInput}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${salaryValid}</td>
  `;

  pushNotification(10, 10, 'Success', 'New employee added', 'success');

  tbody.append(row);

  form.reset();
});

table.tBodies[0].addEventListener('dblclick', (e) => {
  e.preventDefault();

  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  const inputTd = document.createElement('input');

  inputTd.setAttribute('class', 'cell-input');

  const text = td.textContent;

  if (!table.tBodies[0].querySelector('.cell-input')) {
    inputTd.setAttribute('name', 'cell-input');
    inputTd.value = text;
    td.textContent = '';
    td.append(inputTd);
    inputTd.focus();
  }

  inputTd.addEventListener('blur', () => {
    if (inputTd.value.length > 0) {
      td.textContent = inputTd.value;
    } else {
      td.textContent = text;
    }
  });

  inputTd.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      inputTd.blur();
    }
  });
});

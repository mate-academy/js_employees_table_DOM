'use strict';

const table = document.querySelector('table');
const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

const thHead = tHead.querySelectorAll('th');

const currentSort = {};

thHead.forEach((th) => {
  th.addEventListener('click', (e) => {
    const clickIndex = e.target.cellIndex;
    const trBody = [...tBody.querySelectorAll('tr')];
    const dir = currentSort[clickIndex] === 'ASC' ? 'DESC' : 'ASC';

    currentSort[clickIndex] = dir;

    trBody.sort((a, b) => {
      const elemA = a.children[clickIndex].textContent.trim();
      const elemB = b.children[clickIndex].textContent.trim();

      const formatA = Number(elemA.replaceAll('$', '').replaceAll(',', ''));
      const formatB = Number(elemB.replaceAll('$', '').replaceAll(',', ''));

      if (!isNaN(formatA) && !isNaN(formatB)) {
        return dir === 'ASC' ? formatA - formatB : formatB - formatA;
      }

      return dir === 'ASC'
        ? elemA.localeCompare(elemB)
        : elemB.localeCompare(elemA);
    });

    tBody.innerHTML = '';

    trBody.forEach((row) => {
      tBody.append(row);
    });
  });
});

tBody.addEventListener('click', function (e) {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tBody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

  row.classList.add('active');
});

createForm();
bindCellEditing();

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.append(createLabel('Name', createInput('name')));
  form.append(createLabel('Position', createInput('position')));
  form.append(createLabel('Office', createSelect('office')));
  form.append(createLabel('Age', createInput('age', 'number')));
  form.append(createLabel('Salary', createInput('salary', 'number')));
  form.append(createButton());

  table.insertAdjacentElement('afterend', form);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const empName = this.name.value.trim();
    const position = this.position.value.trim();
    const office = this.office.value.trim();
    const age = Number(this.age.value.trim());
    const salary = Number(this.salary.value.trim());

    if (empName.length < 4) {
      pushNotification('Title of Error message', 'Min name length 4', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification(
        'Title of Error message',
        'Age should be min 18 and max 90',
        'error',
      );

      return;
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${empName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>
    `;

    pushNotification(
      'Title of Success message',
      'Employee added in table',
      'success',
    );

    tBody.append(row);

    this.reset();
  });
}

function createLabel(text, elem) {
  const label = document.createElement('label');

  label.textContent = `${text}: `;
  label.append(elem);

  return label;
}

function createInput(nameInput, typeInput = 'text') {
  const input = document.createElement('input');

  input.type = typeInput;
  input.name = nameInput;
  input.setAttribute('data-qa', nameInput);
  input.required = true;

  return input;
}

function createSelect(nameSelect) {
  const select = document.createElement('select');
  const selectArr = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  select.name = nameSelect;
  select.setAttribute('data-qa', nameSelect);

  selectArr.forEach((elem) => {
    const option = document.createElement('option');

    option.textContent = elem;
    option.value = elem;

    select.append(option);
  });

  return select;
}

function createButton() {
  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to table';

  return button;
}

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');

  div.className = 'notification';
  div.setAttribute('data-qa', 'notification');
  div.classList.add(type);

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.innerText = title;
  div.append(h2);

  const p = document.createElement('p');

  p.innerText = description;
  div.append(p);

  document.body.insertAdjacentElement('afterbegin', div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};

let editingCell = null;

function bindCellEditing() {
  tBody.addEventListener('dblclick', (e) => {
    const td = e.target.closest('td');

    if (!td || editingCell) {
      return;
    }

    const original = td.textContent.trim();
    const input = document.createElement('input');

    input.type = 'text';
    input.value = original;
    input.className = 'cell-input';

    td.textContent = '';
    td.appendChild(input);
    input.focus();
    editingCell = { td, original };

    function commit() {
      const val = input.value.trim() || original;

      td.textContent = val;
      cleanup();
    }

    function cleanup() {
      input.removeEventListener('blur', commit);
      input.removeEventListener('keydown', onKey);
      editingCell = null;
    }

    function onKey(evt) {
      if (evt.key === 'Enter') {
        commit();
      }
    }

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', onKey);
  });
}

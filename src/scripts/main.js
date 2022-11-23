'use strict';

const body = document.body;
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
let direction = true;
let lastIndex;
let innerText;

function convertToNum(str) {
  let res = '';

  for (const char of str) {
    if (char !== ',' && char !== '$') {
      res += char;
    }
  }

  return res;
}

function convertToMoney(str) {
  const money = '$' + Number(str).toLocaleString('en');

  return money;
}

const checkValidation = (e) => {
  if (!e.target.value.length) {
    e.target.value = innerText;
    tableNotification(false);

    return;
  }

  switch (e.target.closest('td').cellIndex) {
    case 0:
    case 1:
      if (e.target.value.length > 4) {
        tableNotification(true);
      } else {
        if (e.target.value.length) {
          tableNotification(false);

          return;
        }
      }
      break;

    case 3:
      if (e.target.value >= 18 && e.target.value < 90) {
        tableNotification(true);
      } else {
        tableNotification(false);

        return;
      }
      break;

    case 4:
      e.target.closest('td').textContent = convertToMoney(e.target.value);
      tableNotification(true);
      break;
  }

  e.target.closest('td').textContent = e.target.value;
  e.target.remove();
};

function tableNotification(info) {
  const push = document.createElement('div');
  const title = document.createElement('h2');
  const p = document.createElement('p');

  push.className = 'notification success';
  title.className = 'title';
  title.innerText = 'Sucess!';
  p.innerText = 'You have changed employer data';
  push.setAttribute('data-qa', 'notification');

  if (!info) {
    push.className = 'notification error';
    title.className = 'title';
    title.innerText = 'Error!';
    p.innerText = 'Please, enter valid data';
  }

  push.append(title, p);
  body.append(push);

  setTimeout(() => {
    push.remove();
  }, 2000);
}

thead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;

  const trs = tbody.querySelectorAll('tr');
  const sorted = [...trs].sort((prev, next) => {
    const a = convertToNum(prev.cells[index].innerText);
    const b = convertToNum(next.cells[index].innerText);

    return isNaN(a)
      ? a.localeCompare(b)
      : a - b;
  });

  if (direction || lastIndex !== index) {
    direction = !direction;
  } else {
    sorted.reverse();
    direction = !direction;
  }

  lastIndex = index;

  tbody.append(...sorted);
});

tbody.addEventListener('click', (e) => {
  const rows = document.querySelectorAll('tr');
  const activeRow = document.querySelector('.active');

  for (const row of rows) {
    row.onclick = function() {
      if (this.children[0].tagName === 'TH') {
        return;
      }

      if (activeRow) {
        activeRow.classList.remove('active');
      }

      if (activeRow !== this) {
        this.classList.add('active');
      }
    };
  }
});

tbody.addEventListener('dblclick', (e) => {
  innerText = e.target.innerText;

  let editor;

  switch (e.target.cellIndex) {
    case 0:
    case 1:
      editor = document.createElement('input');
      editor.type = 'text';
      editor.value = e.target.innerText;
      break;

    case 2:
      editor = document.createElement('select');

      editor.innerHTML = `
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburg</option>
      <option>San Francisco</option>
    `;
      editor.value = e.target.innerText;
      editor.className = 'cell-input';
      break;

    case 3:
      editor = document.createElement('input');
      editor.type = 'number';
      editor.value = e.target.innerText;
      break;
    case 4:

      editor = document.createElement('input');
      editor.value = convertToNum(e.target.innerText);
      editor.type = 'number';
      innerText = convertToNum(e.target.innerText);
      break;
  }

  editor.className = 'cell-input';
  e.target.innerText = '';
  editor.addEventListener('blur', checkValidation);
  e.target.append(editor);
});

tbody.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') {
    return;
  }

  checkValidation(e);
});

function formCreator() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const labelName = document.createElement('label');

  labelName.innerText = 'Name:';

  const nameInput = document.createElement('input');

  nameInput.name = 'name';
  nameInput.type = 'text';
  nameInput.minLength = 4;
  nameInput.setAttribute('required', '');
  nameInput.setAttribute('data-qa', 'name');
  labelName.append(nameInput);

  const labelPosition = document.createElement('label');

  labelPosition.innerText = 'Position:';

  const position = document.createElement('input');

  position.minLength = 4;
  position.name = 'position';
  position.type = 'text';
  position.setAttribute('required', '');
  position.setAttribute('data-qa', 'position');
  labelPosition.append(position);

  const labelOffice = document.createElement('label');

  labelOffice.innerText = 'Office:';

  const office = document.createElement('select');

  office.innerHTML = `
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburg</option>
  <option>San Francisco</option>
  `;
  office.setAttribute('required', '');
  office.setAttribute('data-qa', 'office');
  labelOffice.append(office);

  const labelAge = document.createElement('label');

  labelAge.innerText = 'Age:';

  const age = document.createElement('input');

  age.name = 'age';
  age.type = 'number';
  age.min = 18;
  age.max = 90;
  age.setAttribute('required', '');
  age.setAttribute('data-qa', 'age');
  labelAge.append(age);

  const labelSalary = document.createElement('label');

  labelSalary.innerText = 'Salary:';

  const salary = document.createElement('input');

  salary.name = 'salary';
  salary.type = 'number';
  salary.setAttribute('required', '');
  salary.setAttribute('data-qa', 'salary');
  labelSalary.append(salary);

  const button = document.createElement('button');

  button.type = 'submit';
  button.innerText = 'Save to table';

  button.addEventListener('click', (e) => {
    if (
      nameInput.value.length < 4
          || position.value.length < 4
          || office.value.length < 0
          || age.value < 18
          || age.value > 90
          || salary.value < 0
    ) {
      const push = document.createElement('div');
      const title = document.createElement('h2');
      const p = document.createElement('p');

      push.className = 'notification error';
      title.className = 'title';
      title.innerText = 'Error!';
      p.innerText = 'Please, check information in the form';
      push.setAttribute('data-qa', 'notification');
      push.append(title, p);
      body.append(push);

      setTimeout(() => {
        push.remove();
      }, 2000);
    } else {
      const push = document.createElement('div');
      const title = document.createElement('h2');
      const p = document.createElement('p');

      push.className = 'notification success';
      title.className = 'title';
      title.innerText = 'Sucess!';
      p.innerText = 'New employer is already in the table';
      push.setAttribute('data-qa', 'notification');
      push.append(title, p);
      body.append(push);

      setTimeout(() => {
        push.remove();
      }, 2000);
    }
  });

  function clearInputs() {
    nameInput.value = '';
    position.value = '';
    office.value = '';
    age.value = '';
    salary.value = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const tr = document.createElement('tr');
    const newGuy = `
      <td>${nameInput.value}</td>
      <td>${position.value}</td>
      <td>${office.value}</td>
      <td>${age.value}</td>
      <td>${convertToMoney(salary.value)}</td>
    `;

    tr.innerHTML = newGuy;

    tbody.append(tr);
    clearInputs();
  });

  form.append(
    labelName,
    labelPosition,
    labelOffice,
    labelAge,
    labelSalary, button
  );
  body.append(form);
}

formCreator();

'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');

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

const keyDown = (e) => {
  if (e.key !== 'Enter') {
    return;
  }

  if (e.target.value.length === 0) {
    e.target.closest('td').innerText = innerText;
  }

  if (e.target.tagName === 'INPUT') {
    e.target.closest('td').innerText = e.target.value;
    e.target.remove();
  }
};

const onBlur = (e) => {
  if (e.target.value.length === 0) {
    e.target.closest('td').innerText = innerText;
  }

  if (e.target.tagName === 'INPUT') {
    e.target.closest('td').innerText = e.target.value;
    e.target.remove();
  }
};

let direction = true;
let lastIndex;

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

let selectedRow;

tbody.addEventListener('click', (e) => {
  if (selectedRow === e.target) {
    selectedRow.closest('tr').classList.remove('active');
    selectedRow = null;

    return;
  }

  if (selectedRow) {
    const removeClass = selectedRow.closest('tr');

    removeClass.classList.remove('active');
  }

  selectedRow = e.target;

  e.target.closest('tr').classList.add('active');
});

let innerText;

tbody.addEventListener('dblclick', (e) => {
  innerText = e.target.innerText;

  if (e.target.tagName === 'TD') {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = e.target.innerText;
    input.addEventListener('blur', onBlur);
    e.target.innerText = '';
    e.target.append(input);
  }
});

tbody.addEventListener('keydown', keyDown);

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

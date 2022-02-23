'use strict';

const body = document.querySelector('body');
const head = document.querySelector('thead');
const list = document.querySelector('tbody');
let row = list.querySelectorAll('tr');
let count = 0;
const form = document.createElement('form');

form.classList = 'new-employee-form';
body.append(form);

const arrdata = ['name', 'position', 'age', 'salary'];
const arrtitle = ['Name:', 'Position:', 'Age:', 'Salary:'];

for (let i = 0; i < 4; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = arrtitle[i];
  label.dataset.qa = arrdata[i];
  input.name = arrdata[i];
  input.type = 'text';
  input.required = true;
  label.append(input);
  form.append(label);
}
form.children[2].lastChild.type = 'number';
form.children[3].lastChild.type = 'number';

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

const select = `<select name="selec">
<option value=""></option>
<option value="Tokyo">Tokio</option>
<option value="Singapore" >Singapore</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>
<option value="London">London</option>
</select>`;

form.children[2].insertAdjacentHTML('beforeBegin', '<label></label>');
form.children[2].insertAdjacentHTML('afterBegin', 'Office:');
form.children[2].insertAdjacentHTML('beforeEnd', select);
form.children[2].dataset.qa = 'office';

// eslint-disable-next-line no-shadow
document.querySelector('button').addEventListener('click', (event) => {
  event.preventDefault();

  const nameValue = document.querySelector('[name="name"]').value;
  const oficceValue = document.querySelector('[name="selec"]').value;
  const positionValue = document.querySelector('[name="position"]').value;
  const positionAge = document.querySelector('[name="age"]').value;
  const positionSalary = document.querySelector('[name="salary"]').value;
  const div = document.createElement('div');
  const h1 = document.createElement('h1');
  const p = document.createElement('p');

  if (nameValue.length < 4) {
    div.classList = 'notification error';
    h1.textContent = 'Увага';
    p.textContent = 'Імя трохи закуце';

    div.append(h1);
    div.append(p);
    body.append(div);

    return setTimeout(() => {
      div.remove();
    }, 2000);
  }

  if (positionAge <= 17 || positionAge >= 89) {
    div.classList = 'notification error';
    h1.textContent = 'Увага';
    p.textContent = 'А вік то не той';
    div.append(h1);
    div.append(p);
    body.append(div);

    return setTimeout(() => {
      div.remove();
    }, 2000);
  }

  h1.textContent = 'Все ОК';
  div.append(h1);
  div.classList = ' notification success';
  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);

  list.insertAdjacentHTML('afterbegin', `<tr>
  <td>${nameValue}</td>
  <td>${positionValue}</td>
  <td>${oficceValue}</td>
  <td>${positionAge}</td>
  <td>${'$' + new Intl.NumberFormat('en-US').format(positionSalary)}</td>
  </tr>`);
});

head.addEventListener('click', () => {
  let arr = [];

  const sortrow = document.querySelector('tbody').querySelectorAll('tr');

  count++;

  const colum = event.target.cellIndex;

  if (count % 2 === 1) {
    arr = [...sortrow].sort((a, b) =>

      a.children[colum].textContent.localeCompare(b.children[colum].textContent)
    );
  }

  if (count % 2 === 0) {
    arr = [...sortrow].sort((a, b) =>

      b.children[colum].textContent.localeCompare(a.children[colum].textContent)
    );
  }

  if (event.target.textContent === 'Age' && count % 2 === 1) {
    arr = [...sortrow].sort((a, b) =>

      +a.children[colum].textContent - (+b.children[colum].textContent)

    );
  }

  if (event.target.textContent === 'Age' && count % 2 === 0) {
    arr = [...sortrow].sort((a, b) =>

      +b.children[colum].textContent - (+a.children[colum].textContent)

    );
  }

  if (event.target.textContent === 'Salary' && count % 2 === 1) {
    arr = [...sortrow].sort((a, b) =>

      (+a.children[colum].textContent.slice(1).split(',').join(''))
      - (+b.children[colum].textContent.slice(1).split(',').join(''))
    );
  }

  if (event.target.textContent === 'Salary' && count % 2 === 0) {
    arr = [...sortrow].sort((a, b) =>

      (+b.children[colum].textContent.slice(1).split(',').join(''))
      - (+a.children[colum].textContent.slice(1).split(',').join(''))
    );
  }

  list.append(...arr);
});

// eslint-disable-next-line no-shadow
list.addEventListener('click', (event) => {
  row = document.querySelector('tbody').querySelectorAll('tr');

  for (let i = 0; i < row.length; i++) {
    row[i].classList.remove('active');
  }
  event.target.parentNode.classList = 'active';
});

// eslint-disable-next-line no-shadow
body.addEventListener('click', (event) => {
  row = document.querySelector('tbody').querySelectorAll('tr');

  if (event.target === body) {
    for (let i = 0; i < row.length; i++) {
      row[i].classList.remove('active');
    }
  }
});

// eslint-disable-next-line no-shadow
function addvaluecell(event) {
  const style = getComputedStyle(event.target);
  const td = event.target;
  const input = document.createElement('input');
  const cellindex = event.target.cellIndex;

  input.classList = 'cell-input';
  input.dataset.value = event.target.textContent;
  input.value = '';
  input.style.width = style.width;
  td.textContent = '';
  td.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    func(input, td, cellindex);
  });

  list.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      func(input, td, cellindex);
    }
  });
}
list.addEventListener('dblclick', addvaluecell);

function func(input, td, cellindex) {
  if (input.value.length === 0) {
    td.textContent = input.dataset.value;
  } else {
    td.textContent = input.value;
  }

  if (cellindex === 3 && `${+input.value}` === 'NaN') {
    td.textContent = input.dataset.value;
  }

  if (cellindex === 4 && `${+input.value}` === 'NaN') {
    td.textContent = input.dataset.value;
  } else if (cellindex === 4 && input.value.length === 0) {
    td.textContent = input.dataset.value;
  } else if (cellindex === 4) {
    td.textContent = '$' + new Intl.NumberFormat('en-US').format(input.value);
  }
}

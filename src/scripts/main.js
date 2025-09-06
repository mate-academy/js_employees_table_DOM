'use strict';

const bOdy = document.querySelector('body');
const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const arr = [...tHead.querySelectorAll('th')];
let score = 0;
let lastIndex = -1;

tHead.querySelectorAll('th').forEach((th) => {
  th.addEventListener('click', () => {
    const rows = Array.from(tBody.querySelectorAll('tr'));
    const indexRow = arr.indexOf(th);

    if (lastIndex !== indexRow) {
      score = 0;
      lastIndex = indexRow;
    }

    score++;

    if (th.textContent === 'Salary' || th.textContent === 'Age') {
      rows.sort((rowA, rowB) => {
        const salaryA = parseInt(
          rowA.children[indexRow].textContent.replace(/[^0-9]/g, ''),
        );
        const salaryB = parseInt(
          rowB.children[indexRow].textContent.replace(/[^0-9]/g, ''),
        );

        return score % 2 === 0 ? salaryB - salaryA : salaryA - salaryB;
      });
    } else {
      rows.sort((rowA, rowB) => {
        const sortA = rowA.children[indexRow].textContent.trim();
        const sortB = rowB.children[indexRow].textContent.trim();

        return score % 2 === 0
          ? sortB.localeCompare(sortA)
          : sortA.localeCompare(sortB);
      });
    }
    rows.forEach((row) => tBody.appendChild(row));
  });
});

tBody.querySelectorAll('tr').forEach((row) => {
  row.addEventListener('click', () => {
    Array.from(tBody.querySelectorAll('tr')).forEach((tr) => {
      tr.classList.remove('active');
    });

    row.classList.add('active');
  });
});

tBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const oldText = cell.textContent.trim();
  const inpUt = document.createElement('input');

  inpUt.type = 'text';
  inpUt.value = oldText;
  inpUt.classList.add('cell-input');
  cell.textContent = '';
  cell.appendChild(inpUt);
  inpUt.focus();

  function save() {
    const newText = inpUt.value.trim();

    cell.textContent = newText || oldText;
  }

  inpUt.addEventListener('blur', save);

  inpUt.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});

function addLable(input) {
  const lable = document.createElement('label');
  let text = input.name;

  text = text.charAt(0).toUpperCase() + text.slice(1) + ':';

  lable.textContent = text;
  lable.appendChild(input);

  return lable;
}

const form = document.createElement('form');

form.className = 'new-employee-form';

const inputName = document.createElement('input');

inputName.type = 'text';
inputName.name = 'name';
inputName.setAttribute('data-qa', 'name');

const inputPosition = document.createElement('input');

inputPosition.type = 'text';
inputPosition.name = 'position';
inputPosition.setAttribute('data-qa', 'position');

const inputAge = document.createElement('input');

inputAge.type = 'number';
inputAge.name = 'age';
inputAge.setAttribute('data-qa', 'age');

const inputSalary = document.createElement('input');

inputSalary.type = 'number';
inputSalary.name = 'salary';
inputSalary.setAttribute('data-qa', 'salary');

const inputSelect = document.createElement('select');
const arrSelect = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

inputSelect.name = 'office';
inputSelect.setAttribute('data-qa', 'office');

arrSelect.forEach((textSelet) => {
  const option = document.createElement('option');

  option.textContent = textSelet;
  inputSelect.appendChild(option);
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(addLable(inputName));
form.appendChild(addLable(inputPosition));
form.appendChild(addLable(inputSelect));
form.appendChild(addLable(inputAge));
form.appendChild(addLable(inputSalary));
form.appendChild(button);

bOdy.insertBefore(form, bOdy.lastElementChild);

const inputs = document.querySelectorAll('input');

function showMessage(type) {
  if (type !== 'error' && type !== 'success') {
    return;
  }

  const divMessage = document.createElement('div');

  divMessage.setAttribute('data-qa', 'notification');
  divMessage.className = type;

  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  if (type === 'error') {
    h2.textContent = 'Type';
    p.textContent = 'ERROR';
  } else {
    h2.textContent = 'Type';
    p.textContent = 'SUCCESS';
  }

  divMessage.append(h2, p);
  document.body.appendChild(divMessage);

  setTimeout(() => {
    divMessage.remove();
  }, 2000);
}

button.addEventListener('click', (e) => {
  e.preventDefault();

  const nAme = inputs[0].value.trim();
  const pos = inputs[1].value.trim();
  const aGe = Number(inputs[2].value);
  const salary = Number(inputs[3].value);
  const office = inputSelect.value;

  button.disabled = true;

  const hasEmpty = Array.from(inputs).some((inp) => inp.value.trim() === '');

  if (hasEmpty || aGe < 18 || aGe > 90 || nAme.length < 4) {
    showMessage('error');
  } else {
    showMessage('success');

    const salaryFormatted = `$${salary.toLocaleString('en-US')}`;

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${nAme}</td>
      <td>${pos}</td>
      <td>${office}</td>
      <td>${aGe}</td>
      <td>${salaryFormatted}</td>
    `;

    tBody.appendChild(row);

    form.reset();
  }

  setTimeout(() => {
    button.disabled = false;
  }, 2000);
});

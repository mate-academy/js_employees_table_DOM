'use strict';

// write code here

const body = document.querySelector('body');
const tHead = document.querySelector('thead');
const tH = document.querySelectorAll('thead th');
const table = document.querySelector('tbody');

// ------------sort rows---------------- //

tHead.addEventListener('click', e => {
  const rows = [...document.querySelectorAll('tbody tr')];
  const wasSort = e.target.classList.contains('asc');

  clearActive();

  if (!wasSort) {
    removeAsc();
    e.target.classList.add('asc');
  } else {
    removeAsc();
  }

  const indexH = [...tH].indexOf(e.target);

  rows.sort((a, b) => {
    const nameA = a.children[indexH].textContent;
    const nameB = b.children[indexH].textContent;

    if (wasSort) {
      return toNum(nameB) - toNum(nameA) || nameB.localeCompare(nameA);
    }

    return toNum(nameA) - toNum(nameB) || nameA.localeCompare(nameB);
  });

  table.append(...rows);
});

// ------------active row---------------- //

table.addEventListener('click', e => {
  clearActive();

  e.target.closest('tr').classList.add('active');
});

// ------------form---------------- //
const inputForm = document.createElement('form');
const cities = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'
];

inputForm.classList.add('new-employee-form');

inputForm.innerHTML = `
<label>Name: 
  <input name='name' type='text' data-qa='name'>
</label>
<label>Position: 
  <input name='position' type='text' data-qa='position'>
</label>
<label>Office: 
  <select name='office' data-qa='office'>
    ${cities.map(el => `<option value='${el}'>${el}</option>`).join()}
  </select>
</label>
<label>Age: <input name='age' type='number' data-qa='age'></label>
<label>Salary: 
  <input name='salary' type='number' data-qa='salary'>
</label>
<button type="submit">Save to table</button>
`;

body.append(inputForm);

inputForm.addEventListener('submit', e => {
  e.preventDefault();

  const oldMessage = document.querySelector('div.notification');

  if (oldMessage) {
    oldMessage.remove();
  }

  const formElements = inputForm.elements;
  const formName = formElements.name.value;
  const formPosition = formElements.position.value;
  const formOffice = formElements.office.value;
  const formAge = formElements.age.value;
  const formSalary = formElements.salary.value;
  const message = document.createElement('div');


  message.classList.add('notification');
  message.dataset.qa = 'notification';

  let textM = '';
  let titleM = '';
  let emty = 0;

  [...formElements].forEach(el => {
    if (el.value.trim().length === 0 && el.type !== 'submit') {
      emty++;
    }
  });

  if (emty > 0) {
    textM += '<p>Fields must not be empty</p>';
  }

  if (formName.length < 4) {
    textM += '<p>Name must contain more than 4 letters</p>';
  }

  if (+formAge < 18 || +formAge > 90) {
    textM += '<p>Age cannot be less than 18 or more than 90</p>';
  }

  if (+formSalary <= 0) {
    textM += '<p>Salary cannot be less than 0</p>';
  }

  if (textM.length === 0) {
    titleM += 'Success';
    textM += '<p>Everything is good</p>';
    message.classList.add('success');
    addRow(formName, formPosition, formOffice, formAge, formSalary);
  } else {
    titleM += 'Error';
    message.classList.add('error');
  }

  message.innerHTML = `
  <h2>${titleM}</h2>
  ${textM}`;

  body.append(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
});

// ------------ edit row ---------------- //

table.addEventListener('dblclick', e => {
  const editCell = e.target;
  const text = editCell.textContent;

  if (editCell.tagName !== 'TD') {
    return;
  }

  let inputEl;

  editCell.innerHTML = '';

  if (editCell === editCell.parentElement.children[2]) {
    inputEl = document.createElement('select');
    inputEl.value = text;

    inputEl.innerHTML = `
      ${cities.map(el => `<option value='${el}'>${el}</option>`).join()}`;
  } else {
    inputEl = document.createElement('input');

    inputEl.classList.add('cell-input');
    inputEl.value = text;
    
  }
  editCell.append(inputEl);
  inputEl.focus();

  inputEl.onblur = () => {
    if (inputEl.value.trim() === '') {
      editCell.textContent = text;
    } else {
      switch (editCell) {
        case editCell.parentElement.children[2]:
          if (cities.includes(inputEl.value)) {
            editCell.textContent = inputEl.value;
          } else {
            editCell.textContent = text;
          }
          break;

        case editCell.parentElement.children[3]:
          if (toNum(inputEl.value) >= 18 && toNum(inputEl.value) <= 90) {
            editCell.textContent = toNum(inputEl.value);
          } else {

          }
          break;

        case editCell.parentElement.children[4]:

          if (toNum(inputEl.value)) {
            editCell.textContent = '$' + toNum(inputEl.value)
              .toLocaleString('en-US');
          } else {
            editCell.textContent = text;
          }
          break;

        default:
          editCell.textContent = inputEl.value.trim();
          break;
      }
    }
    inputEl.remove();
  };
});

// ------------functions---------------- //

function toNum(str) {
  return Number(str.replace(/\D/g, ''));
}

function clearActive() {
  document.querySelectorAll('tr').forEach(tr => {
    tr.classList.remove('active');
  });
}

function removeAsc() {
  tH.forEach(th => {
    th.classList.remove('asc');
  });
}

function addRow(nm, pos, off, age, sal) {
  const rowForAdd = document.createElement('tr');

  rowForAdd.innerHTML = `
  <td>${nm}</td>
  <td>${pos}</td>
  <td>${off}</td>
  <td>${age}</td>
  <td>${'$' + Number(sal).toLocaleString('en-US')}</td>
  `;

  table.append(rowForAdd);
  inputForm.reset();
}

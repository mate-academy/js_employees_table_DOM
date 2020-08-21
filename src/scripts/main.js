'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const tHead = table.tHead;
let direction = 'asc';
let indx = 0;

tHead.addEventListener('click', (event) => {
  const item = event.target;
  const employees = [...tbody.children];

  function getSalary(salEmployee) {
    return (+salEmployee.textContent
      .split(',').join('').split('$').join(''));
  }

  switch (item.textContent) {
    case 'Name':
      if (indx === 0 && direction === 'desc') {
        employees.sort((a, b) => {
          return (b.children[0].textContent
            .localeCompare(a.children[0].textContent));
        });
        indx = item.cellIndex;
        direction = 'asc';
      } else {
        employees.sort((a, b) => {
          return (a.children[0].textContent
            .localeCompare(b.children[0].textContent));
        });
        indx = item.cellIndex;
        direction = 'desc';
      }
      break;

    case 'Position':
      if (indx === 1 && direction === 'desc') {
        employees.sort((a, b) => {
          return (b.children[1].textContent
            .localeCompare(a.children[1].textContent));
        });
        indx = item.cellIndex;
        direction = 'asc';
      } else {
        employees.sort((a, b) => {
          return (a.children[1].textContent
            .localeCompare(b.children[1].textContent));
        });
        indx = item.cellIndex;
        direction = 'desc';
      }
      break;

    case 'Office':
      if (indx === 2 && direction === 'desc') {
        employees.sort((a, b) => {
          return (b.children[2].textContent
            .localeCompare(a.children[2].textContent));
        });
        indx = item.cellIndex;
        direction = 'asc';
      } else {
        employees.sort((a, b) => {
          return (a.children[2].textContent
            .localeCompare(b.children[2].textContent));
        });
        indx = item.cellIndex;
        direction = 'desc';
      }
      break;

    case 'Age':
      if (indx === 3 && direction === 'desc') {
        employees.sort((a, b) => {
          return (+b.children[3].textContent - (+a.children[3].textContent));
        });
        indx = item.cellIndex;
        direction = 'asc';
      } else {
        employees.sort((a, b) => {
          return (+a.children[3].textContent - (+b.children[3].textContent));
        });
        indx = item.cellIndex;
        direction = 'desc';
      }
      break;

    case 'Salary':
      if (indx === 4 && direction === 'desc') {
        employees.sort((a, b) => getSalary(b.children[4])
          - getSalary(a.children[4]));
        indx = item.cellIndex;
        direction = 'asc';
      } else {
        employees.sort((a, b) => getSalary(a.children[4])
          - getSalary(b.children[4]));
        indx = item.cellIndex;
        direction = 'desc';
      }
      break;
  }

  tbody.append(...employees);
});

/* Body select=====
============== */
let indxRow = 0;

tbody.addEventListener('click', (event) => {
  const itemBody = event.target;

  const selector = tbody.querySelector('.active');

  if (selector !== null && selector.classList.contains('active')
    && indxRow !== itemBody.parentElement.rowIndex) {
    selector.classList.remove('active');
    itemBody.parentElement.className = 'active';
  }

  if (selector !== null && selector.classList.contains('active')
    && indxRow === itemBody.parentElement.rowIndex) {
    selector.classList.remove('active');
  } else {
    itemBody.parentElement.className = 'active';
    indxRow = itemBody.parentElement.rowIndex;
  }
});

/* Body form=====
============== */
const bodyTag = document.querySelector('body');
const createForm = document.createElement('form');
const arrCity = [
  `Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`,
];

createForm.className = 'new-employee-form';

for (let i = 0; i < tHead.children[0].children.length; i++) {
  const createLabel = document.createElement('label');
  const createInput = document.createElement('input');
  const createSelect = document.createElement('select');

  createLabel.for = tHead.children[0].children[i].textContent;
  createLabel.textContent = `${tHead.children[0].children[i].textContent}:`;

  if (tHead.children[0].children[i].textContent === 'Office') {
    for (let y = 0; y < arrCity.length; y++) {
      const createOption = document.createElement('option');

      createSelect.id = tHead.children[0].children[i].textContent;

      // if (y === 0) {
      //   createOption.value = '';
      //   createOption.textContent = 'Select a city';
      //   createOption.disabled = true;
      //   createOption.selected = true;
      //   createOption.hidden = true;
      //   createSelect.append(createOption);
      //   createForm.append(createSelect);
      //   createOption = document.createElement('option');
      // }
      createOption.value = arrCity[y];
      createOption.textContent = arrCity[y];
      createSelect.append(createOption);
      createLabel.append(createSelect);
      createForm.append(createLabel);
    }
  } else {
    createInput.name = tHead.children[0].children[i].textContent;
    createInput.id = tHead.children[0].children[i].textContent;

    if (tHead.children[0].children[i].textContent === 'Age'
      || tHead.children[0].children[i].textContent === 'Salary') {
      createInput.type = 'number';
    } else {
      createInput.type = 'text';
    }
    // createInput.required = 'required';
    // createInput.placeholder = tHead.children[0].children[i].textContent;
    createLabel.append(createInput);
    createForm.append(createLabel);
  }
}

/* Body form-button=====
============== */
const createFormButton = document.createElement('button');

createFormButton.textContent = 'Save to table';
createForm.append(createFormButton);

bodyTag.append(createForm);

/* Body form - end ================== */

const pushNotification = (top, right, title, description, type) => {
  const createDiv = document.createElement('div');
  const titleH2 = document.createElement('h2');
  const createP = document.createElement('p');

  createDiv.classList.add('notification', `${type}`);

  createDiv.style.cssText = `top: ${top}px; right: ${right}px`;

  titleH2.classList.add('title');
  titleH2.textContent = `${title}`;

  createP.textContent = `${description}`;

  createDiv.append(titleH2, createP);

  document.querySelector('body').append(createDiv);

  setTimeout(() => createDiv.remove(), 4000);
};

/* Add new employee in table */
const form = document.querySelector('form');
let createTr = document.createElement('tr');
let numSalary = 0;

form.addEventListener('submit', (event) => {
  createTr = document.createElement('tr');
  event.preventDefault();

  /*  Throw notification */
  for (let x = 0; x < form.length - 1; x++) {
    if (form[x].name === 'Name' && form[x].value.length < 4) {
      pushNotification(50, 50,
        `${form[x].name}`, `The name must contain more than four characters`,
        'error');

      form[x].focus();

      return;
    }

    if (form[x].name === 'Age') {
      if (form[x].value < 18 || form[x].value > 90) {
        pushNotification(50, 50,
          `${form[x].name}`, `Your age does not fit`,
          'error');

        form[x].focus();

        return;
      }
    }

    if (form[x].value === '') {
      pushNotification(50, 50,
        `${form[x].name}`, `Fill in the blank`,
        'warning');

      form[x].focus();

      return;
    }
  }

  /* Add new employee */
  for (let x = 0; x < form.length - 1; x++) {
    const createTd = document.createElement('td');

    createTd.textContent = form[x].value;
    createTr.append(createTd);

    if (form[x].id === 'Office') {
      continue;
    }

    if (form[x].id === 'Salary') {
      numSalary = form[x].value;

      if (form[x].value.length <= 3) {
        numSalary = form[x].value;
      } else {
        numSalary = numSalary.split('');
        numSalary.splice(-3, 0, ',');
        numSalary = numSalary.join('');
      }
      createTd.textContent = `$${numSalary}`;
    }

    form[x].value = '';
  }
  tbody.append(createTr);
});

/* Editing of table cells */
let editingTd;

tbody.addEventListener('dblclick', (event) => {
  const target = event.target.closest('.edit-cancel,.edit-ok,td');

  if (!table.contains(target)) {
    return;
  }

  if (target.nodeName === 'TD') {
    if (editingTd) {
      return;
    }

    makeTdEditable(target);
  }
});

function makeTdEditable(td) {
  editingTd = {
    elem: td,
    data: td.innerHTML,
  };

  const inputCreateCell = document.createElement('input');

  inputCreateCell.style.width = td.clientWidth + 'px';
  inputCreateCell.style.height = td.clientHeight + 'px';
  inputCreateCell.className = 'cell-input';

  td.innerHTML = '';
  inputCreateCell.value = td.innerHTML;
  td.appendChild(inputCreateCell);
  inputCreateCell.focus();

  inputCreateCell.addEventListener('blur', () => {
    if (inputCreateCell.value === '') {
      td.innerHTML = editingTd.data;
      td.classList.remove('cell-input');
      editingTd = null;

      return;
    }
    td.innerHTML = td.firstChild.value;
    td.classList.remove('cell-input');
    editingTd = null;
  }, true);

  inputCreateCell.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      if (inputCreateCell.value === '') {
        td.innerHTML = editingTd.data;
        td.classList.remove('cell-input');
        editingTd = null;

        return;
      }

      td.innerHTML = td.firstChild.value;
      td.classList.remove('cell-input');
      editingTd = null;
    }
  });
};

'use strict';

const table = document.querySelector('table');
const tbody = table.tBodies[0];
const tHead = table.tHead;
let directionSortTable = 'asc';
let indxCell = 0;

tHead.addEventListener('click', (event) => {
  const item = event.target;
  const employees = [...tbody.children];

  switch (item.textContent) {
    case 'Name':
      if (indxCell === 0 && directionSortTable === 'desc') {
        employees.sort((a, b) => {
          return (b.children[0].textContent
            .localeCompare(a.children[0].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'asc';
      } else {
        employees.sort((a, b) => {
          return (a.children[0].textContent
            .localeCompare(b.children[0].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'desc';
      }
      break;

    case 'Position':
      if (indxCell === 1 && directionSortTable === 'desc') {
        employees.sort((a, b) => {
          return (b.children[1].textContent
            .localeCompare(a.children[1].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'asc';
      } else {
        employees.sort((a, b) => {
          return (a.children[1].textContent
            .localeCompare(b.children[1].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'desc';
      }
      break;

    case 'Office':
      if (indxCell === 2 && directionSortTable === 'desc') {
        employees.sort((a, b) => {
          return (b.children[2].textContent
            .localeCompare(a.children[2].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'asc';
      } else {
        employees.sort((a, b) => {
          return (a.children[2].textContent
            .localeCompare(b.children[2].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'desc';
      }
      break;

    case 'Age':
      if (indxCell === 3 && directionSortTable === 'desc') {
        employees.sort((a, b) => {
          return (+b.children[3].textContent - (+a.children[3].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'asc';
      } else {
        employees.sort((a, b) => {
          return (+a.children[3].textContent - (+b.children[3].textContent));
        });
        indxCell = item.cellIndex;
        directionSortTable = 'desc';
      }
      break;

    case 'Salary':
      if (indxCell === 4 && directionSortTable === 'desc') {
        employees.sort((a, b) => getSalary(b.children[4])
          - getSalary(a.children[4]));
        indxCell = item.cellIndex;
        directionSortTable = 'asc';
      } else {
        employees.sort((a, b) => getSalary(a.children[4])
          - getSalary(b.children[4]));
        indxCell = item.cellIndex;
        directionSortTable = 'desc';
      }
      break;
  }

  tbody.append(...employees);
});

function getSalary(salEmployee) {
  return (+salEmployee.textContent
    .split(',').join('').split('$').join(''));
}

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
createForm.action = 'addEmployee()';

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

createForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (validateForm()) {
    addNewEmployee();
  };
});

/*  Throw notification and validates form */
function validateForm() {
  for (let x = 0; x < createForm.length - 1; x++) {
    if (createForm[x].name === 'Name' && createForm[x].value.length < 4) {
      pushNotification(50, 50,
        `${createForm[x].name}`,
        `The name must contain more than four characters`,
        'error');

      createForm[x].focus();

      return false;
    }

    if (createForm[x].name === 'Age') {
      if (createForm[x].value > 90) {
        pushNotification(50, 50,
          `${createForm[x].name}`,
          `Sorry, you cannot be our employee -
            we are looking for young employees`,
          'error');

        createForm[x].focus();

        return false;
      } else if (createForm[x].value < 18) {
        pushNotification(50, 50,
          `${createForm[x].name}`,
          "Sorry, you can't be our employee - you're too young", 'error');

        createForm[x].focus();

        return false;
      }
    }

    if (createForm[x].value === '') {
      pushNotification(50, 50,
        `${createForm[x].name}`, `Fill in the blank`,
        'warning');

      createForm[x].focus();

      return false;
    }
  }

  return true;
}

/* Add new employee */
function addNewEmployee() {
  const createTr = document.createElement('tr');
  let numSalary = 0;

  for (let x = 0; x < createForm.length - 1; x++) {
    const createTd = document.createElement('td');

    createTd.textContent = createForm[x].value;
    createTr.append(createTd);

    if (createForm[x].id === 'Office') {
      continue;
    }

    if (createForm[x].id === 'Salary') {
      numSalary = createForm[x].value;

      if (createForm[x].value.length <= 3) {
        numSalary = createForm[x].value;
      } else {
        numSalary = numSalary.split('');
        numSalary.reverse();

        for (let i = 0; i <= numSalary.length; i++) {
          if (i % 4 === 0 && i > 0) {
            numSalary.splice(i - 1, 0, ',');
          }
        };
        numSalary.reverse();

        numSalary = numSalary.join('');
      }
      createTd.textContent = `$${numSalary}`;
    }

    createForm[x].value = '';
  }
  tbody.append(createTr);
}

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

  inputCreateCell.className = 'cell-input';
  inputCreateCell.value = td.innerHTML;

  td.innerHTML = '';
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

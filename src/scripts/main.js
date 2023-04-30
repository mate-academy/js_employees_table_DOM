'use strict';

let lastColumn = 10;
let sortingASC = true;
let currentRow = null;
const tbody = document.querySelector('tbody');
let rows = [...tbody.rows];
let body = document.querySelector('body');
let startValue = '';
let sortColumn = '';

/* -----------------sorting table------------------ */
const sortTable = (table, column) => {
  if (lastColumn === column) {
    sortingASC = !sortingASC;
  } else {
    sortingASC = true;
  }
  lastColumn = column;

  table.sort(function(a, b) {
    let aItem = a.children[column].innerHTML;
    let bItem = b.children[column].innerHTML;

    if (sortColumn === 'Salary') {
      aItem = Number(a.children[4].innerHTML.replace(/\D/g, ''));
      bItem = Number(b.children[4].innerHTML.replace(/\D/g, ''));
    }

    if (aItem > bItem) {
      const ret1 = sortingASC ? 1 : -1;

      return ret1;
    }

    if (aItem < bItem) {
      const ret2 = sortingASC ? -1 : 1;

      return ret2;
    }

    return 0;
  });

  return table;
};

/* -----------------click event handler---------------- */
document.addEventListener('click', (e) => {
  hideNotif();

  if (e.target.tagName === 'TD') {
    e.target.parentNode.className = 'active';

    if (currentRow !== null) {
      currentRow.className = '';
    }
    currentRow = e.target.parentNode;
  }

  if (e.target.tagName === 'TH') {
    sortColumn = e.target.innerHTML;

    const parentRow = e.target.parentNode;
    const arr = [...parentRow.children];
    const column = arr.indexOf(e.target);

    rows = [...tbody.rows];

    sortTable(rows, column);
    tbody.append(...rows);
    body = document.querySelector('body');

    // rows = [...tbody.rows];
  }

  if (e.target.tagName === 'BUTTON') {
    e.preventDefault();

    if (inputName.value.length < 4) {
      showNotif('`Name` value must be longer than 4 characters', 'error');
    } else if (inputAge.value < 18) {
      showNotif('`Age` value must be greater than 18', 'error');
    } else if (inputAge.value > 90) {
      showNotif('`Age` value must be less than 90', 'error');
    } else if (inputPos.value.length < 1) {
      showNotif('Position must be set', 'error');
    } else if (inputSalary.value < 10) {
      showNotif('Salary is too low!', 'error');
    } else {
      appendRow();
    }
  }
});

/* -----------------dblclick event handler---------------- */
document.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const parentTd = e.target.parentNode;
    const newInput = document.createElement('input');

    startValue = e.target.innerHTML;
    newInput.value = startValue;
    newInput.className = `cell-input`;
    newInput.style.paddingTop = '18px';
    newInput.style.background = 'white';

    newInput.required = true;
    parentTd.insertBefore(newInput, e.target);
    e.target.remove();

    newInput.onblur = () => {
      const newItem = document.createElement('td');

      newItem.innerHTML
        = (newInput.value.length > 0) ? newInput.value : startValue;
      parentTd.insertBefore(newItem, newInput);
      newInput.remove();
    };
    newInput.focus();
  }
});

/* -----------------to show notification------------------ */
const showNotif = function(text, type) {
  if (type === 'error') {
    divNotif.style.background = '#e25644';
  } else {
    divNotif.style.background = 'green';
  }
  divNotif.innerHTML = text;
  divNotif.hidden = false;
};

/* -----------------to hide notification------------------ */
const hideNotif = () => {
  if (divNotif.hidden === false) {
    divNotif.hidden = true;
  }
};

/* -----------------to append row------------------ */
const appendRow = () => {
  const newRow = document.createElement('tr');
  const newitem1 = document.createElement('td');
  const newitem2 = document.createElement('td');
  const newitem3 = document.createElement('td');
  const newitem4 = document.createElement('td');
  const newitem5 = document.createElement('td');

  newitem1.innerHTML = inputName.value;
  newitem2.innerHTML = inputPos.value;
  newitem3.innerHTML = selectOffice.value;
  newitem4.innerHTML = inputAge.value;

  let stringSalary = inputSalary.value;

  stringSalary = new Intl.NumberFormat('ru', { minimumFractionDigits: 3 })
    .format(Number(stringSalary));
  stringSalary = '$' + stringSalary;
  newitem5.innerHTML = stringSalary;
  newRow.append(newitem1);
  newRow.append(newitem2);
  newRow.append(newitem3);
  newRow.append(newitem4);
  newRow.append(newitem5);

  tbody.append(newRow);

  showNotif('row has been added', 'success');
};

/* -----------------to create New Employee Form------------------ */
const formNewEmployee = document.createElement('form');

formNewEmployee.className = 'new-employee-form';

const labelName = document.createElement('label');

labelName.innerHTML = 'Name: ';

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
inputName.required = true;
labelName.append(inputName);
formNewEmployee.append(labelName);

const labelPos = document.createElement('label');

labelPos.innerHTML = 'Position: ';

const inputPos = document.createElement('input');

inputPos.name = 'position';
inputPos.type = 'text';
inputPos.setAttribute('data-qa', 'position');
inputPos.required = true;
labelPos.append(inputPos);
formNewEmployee.append(labelPos);

const labelAge = document.createElement('label');

labelAge.innerHTML = 'Age: ';

const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'office');
inputAge.required = true;
labelAge.append(inputAge);
formNewEmployee.append(labelAge);

const labelSalary = document.createElement('label');

labelSalary.innerHTML = 'Salary: ';

const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.required = true;
labelSalary.append(inputSalary);
formNewEmployee.append(labelSalary);

const labelOffice = document.createElement('label');

labelOffice.innerHTML = 'Office: ';

const selectOffice = document.createElement('select');

labelOffice.name = 'office';

const option1 = document.createElement('option');

option1.value = 'Tokyo';
option1.innerHTML = 'Tokyo';
selectOffice.append(option1);

const option2 = document.createElement('option');

option2.value = `Singapore`;
option2.innerHTML = `Singapore`;
selectOffice.append(option2);

const option3 = document.createElement('option');

option3.value = `London`;
option3.innerHTML = `London`;
selectOffice.append(option3);

const option4 = document.createElement('option');

option4.value = `New York`;
option4.innerHTML = `New York`;
selectOffice.append(option4);

const option5 = document.createElement('option');

option5.value = `Edinburgh`;
option5.innerHTML = `Edinburgh`;
selectOffice.append(option5);

const option6 = document.createElement('option');

option6.value = `San Francisco`;
option6.innerHTML = `San Francisco`;
selectOffice.append(option6);

labelOffice.append(selectOffice);
formNewEmployee.append(labelOffice);

const buttonSave = document.createElement('button');

buttonSave.innerHTML = 'Save to table';

formNewEmployee.append(buttonSave);

body.append(formNewEmployee);

/* -----------------to create Notification block------------------ */
const divNotif = document.createElement('div');

divNotif.className = 'notification';
divNotif.setAttribute('data-qa', 'notification');
divNotif.classList.add('success');
divNotif.innerHTML = 'Notification';
divNotif.style.background = '#e25644';
divNotif.style.width = '240px';
divNotif.style.color = '#fff';
divNotif.style.fontWeight = '700';
divNotif.style.fontFamily = 'Roboto, sans-serif';
divNotif.style.paddingTop = '10px';
divNotif.hidden = true;
divNotif.style.top = '250px';
divNotif.style.left = '10px';

formNewEmployee.append(divNotif);

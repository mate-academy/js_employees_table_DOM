'use strict';

const table = document.querySelector('table');

const theads = [...table.tHead.rows[0].cells];
const tRows = [...table.tBodies[0].rows];

function setUpSorting() {
  for (const thead of theads) {
    thead.addEventListener('click', sortByColumn);
    thead.setAttribute('asc', true);
  }
}

function sortByColumn(e) {
  const idx = theads.findIndex((elem) => elem === e.currentTarget);

  tRows.sort((a, b) => {
    let first = a.cells[idx].innerText;
    let second = b.cells[idx].innerText;

    if (first.startsWith('$')) {
      first = formatSalary(first);
      second = formatSalary(second);

      if (e.currentTarget.hasAttribute('asc')) {
        return first - second;
      }

      return second - first;
    }

    if (e.currentTarget.hasAttribute('asc')) {
      return first > second ? 1 : -1;
    }

    return first > second ? -1 : 1;
  });

  if (e.currentTarget.hasAttribute('asc')) {
    e.currentTarget.removeAttribute('asc');
  } else {
    e.currentTarget.setAttribute('asc', true);
  }

  for (const tr of tRows) {
    table.tBodies[0].appendChild(tr);
  }
}

function formatSalary(salary) {
  return +salary.slice(1).split(',').join('');
}

function setUpRowSelection() {
  for (const row of tRows) {
    row.addEventListener('click', selectRow);
  }
}

function selectRow(e) {
  for (const row of tRows) {
    row.classList.remove('active');
  }
  e.currentTarget.classList.add('active');
}

function addForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');
  table.insertAdjacentElement('afterend', newForm);

  addLabel(newForm, 'Name: ', 'name', 'text', 'name');
  addLabel(newForm, 'Position: ', 'position', 'text', 'position');

  const posInput = document.querySelector('input[name="position"]')
  posInput.removeAttribute('required');
  // posInput.addEventListener('keypress', (e) => {
  //   console.log('qerwfdsvewrfrv');
  // });

  addSelect(newForm);

  addLabel(newForm, 'Age: ', 'age', 'number', 'age');
  addLabel(newForm, 'Salary: ', 'salary', 'number', 'salary');

  addButton(newForm);
  newForm.addEventListener('submit', addRowFromBtn);
}

function addLabel(elem, textCont, inputName, inputType, dataQa) {
  const tempLabel = document.createElement('label');

  tempLabel.textContent = textCont;

  const tempInput = document.createElement('input');

  tempInput.setAttribute('name', inputName);
  tempInput.setAttribute('type', inputType);
  tempInput.setAttribute('data-qa', dataQa);
  tempInput.setAttribute('required', '');

  tempLabel.appendChild(tempInput);

  elem.appendChild(tempLabel);
}

function addSelect(elem) {
  const tempLabel = document.createElement('label');

  tempLabel.textContent = 'Office: ';

  const tempSelect = document.createElement('select');

  tempSelect.setAttribute('name', 'office');
  tempSelect.setAttribute('data-qa', 'office');
  tempSelect.setAttribute('required', '');

  const newOffices = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ];

  for (const office of newOffices) {
    const tempOpt = document.createElement('option');

    tempOpt.textContent = office;
    tempOpt.setAttribute('value', office);
    tempSelect.appendChild(tempOpt);
  }

  tempLabel.appendChild(tempSelect);
  elem.appendChild(tempLabel);
}

function addButton(elem) {
  const newBtn = document.createElement('button');

  newBtn.setAttribute('type', 'submit');

  newBtn.textContent = 'Save to table';

  elem.appendChild(newBtn);
}

function addRowFromBtn(e) {
  const newTr = document.createElement('tr');

  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const validate = validateData(formData.entries());

  showNotif(validate);

  for (const pair of formData.entries()) {
    const newTd = document.createElement('td');

    let value = pair[1];
    const key = pair[0];

    if (key === 'age') {
      value = +value;
    }

    if (key === 'salary') {
      value = `$${Intl.NumberFormat('en-US').format(value)}`;
    }

    newTd.textContent = value;
    newTr.appendChild(newTd);
  }

  if (validate) {
    document.querySelector('tbody').appendChild(newTr);
  }

  e.currentTarget.reset();
}

function validateData(dataObj) {
  for (const pair of dataObj) {
    const key = pair[0];
    const value = pair[1];

    if (key === 'name' & value.length < 4) {
      return false;
    }

    if (key === 'age' & (+value < 18 || +value > 90)) {
      return false;
    }

    if (key === 'position' & value.length === 0) {
      return false;
    }
  }

  return true;
}

function showNotif(flag) {
  const notif = document.createElement('div');
  notif.classList.add('notification');
  const resultClass = flag ? 'success' : 'error';
  notif.classList.add(resultClass);
  notif.setAttribute('data-qa', 'notification');
  notif.textContent = 'notif';

  document.querySelector('body').appendChild(notif);
}

setUpSorting();
setUpRowSelection();
addForm();

'use strict';

const table = document.querySelector('table');

const tbody = document.querySelector('tbody');
const list = tbody.children;

const strFormat = function(a, cellIndex) {
  return a.querySelectorAll('td')[cellIndex]
    .textContent.split('$').join('').split(',').join('');
};

table.addEventListener('click', (e) => {
  const tableItem = e.target.closest('th');
  const cellIndex = tableItem.cellIndex;

  const sortList = function(items) {
    return [...items].sort((a, b) => {
      const textA = strFormat(a, cellIndex);
      const textB = strFormat(b, cellIndex);

      if (isNaN(textA) && isNaN(textB)) {
        return textA > textB ? 1 : -1;
      } else {
        return (textA - textB);
      }
    });
  };

  document.querySelector('tbody').append(...sortList(list, cellIndex));
});

table.addEventListener('dblclick', (e) => {
  const tableItem = e.target.closest('th');
  const cellIndex = tableItem.cellIndex;

  const sortList = function(items) {
    return [...items].sort((a, b) => {
      const textA = strFormat(a, cellIndex);
      const textB = strFormat(b, cellIndex);

      if (isNaN(textA) && isNaN(textB)) {
        return textB > textA ? 1 : -1;
      } else {
        return (textB - textA);
      }
    });
  };

  document.querySelector('tbody').append(...sortList(list, cellIndex));
});

let selectedTr;

table.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  function selected() {
    if (selectedTr) {
      selectedTr.classList.remove('active');
    }
    selectedTr = tr;
    selectedTr.classList.add('active');
  }

  if (!tr) {
    return;
  }

  if (!table.contains(tr)) {
    return;
  }

  selected(tr);
});

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');
document.body.appendChild(form);

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('pattern', '[a-zA-Z]+');
nameLabel.append(nameInput);
form.appendChild(nameLabel);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';

const positionInput = document.createElement('input');

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('pattern', '[a-zA-Z]+');
positionLabel.append(positionInput);
form.appendChild(positionLabel);

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office:';

const select = document.createElement('select');

select.setAttribute('data-qa', 'office');
select.setAttribute('required', '');
selectLabel.append(select);
form.appendChild(selectLabel);

const offices = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];

const selectForm = function() {
  for (const town of offices) {
    const option = document.createElement('option');

    option.setAttribute('value', town);

    const t = document.createTextNode(town);

    option.appendChild(t);
    select.appendChild(option);
  }
};

selectForm();

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';

const ageInput = document.createElement('input');

ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageLabel.append(ageInput);
form.appendChild(ageLabel);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary:';

const salaryInput = document.createElement('input');

salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryLabel.append(salaryInput);
form.appendChild(salaryLabel);

const button = document.createElement('button');

button.textContent = 'Save to table';
form.appendChild(button);

const arr = document.getElementsByTagName('input');

[...arr].map(el => el.setAttribute('required', ''));

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('class', `notification ${type}`);
  notification.setAttribute('data-qa', 'notification');

  notification.insertAdjacentHTML('afterBegin',
    `<h2 class = 'title'>${title}</h2><p>${description}</p>`);

  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

function validateForm(nameN, ageN) {
  if (nameN.length < 4) {
    pushNotification('Error', 'Name length must be more than 4 letters.',
      'error');
  } else if (ageN < 18 || ageN > 90) {
    pushNotification('Error', 'Age must be over 18 but under 90.',
      'error');
  } else {
    pushNotification('Success', 'The form is filled out correctly.',
      'success');

    return true;
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameV = document.getElementsByTagName('input')[0].value;
  const positionV = document.getElementsByTagName('input')[1].value;
  const ageV = document.getElementsByTagName('input')[2].value;
  const salaryV = '$' + document.getElementsByTagName('input')[3].value;

  const selectElem = document.querySelector('select');
  const i = selectElem.selectedIndex;
  const officeV = selectElem.options[i].text;
  const newEmp = [nameV, positionV, officeV, ageV, salaryV];

  if (validateForm(nameV, ageV) === true) {
    const addForm = function() {
      const tr = document.createElement('tr');

      for (const elem of newEmp) {
        const td = document.createElement('td');

        td.textContent = elem;
        tr.append(td);
      }
      tbody.append(tr);
    };

    addForm();

    pushNotification('Success', 'The form is filled out correctly.<br>'
      + 'The new employee is added to the table.', 'success');

    form.reset();
  }
});

let item = null;

table.addEventListener('dblclick',
  function() {
    event.preventDefault();

    const cell = event.target.closest('td');

    editStart(cell);
  });

function editStart(cell) {
  const innitText = cell.textContent;

  if (cell.cellIndex === 2) {
    item = document.createElement('select');

    item.innerHTML = `<option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>`;
  } else if (cell.cellIndex === 0 || cell.cellIndex === 1) {
    item = document.createElement('input');
    item.setAttribute('type', 'text');
    item.setAttribute('pattern', '[a-zA-Z]+');
  } else if (cell.cellIndex === 3 || cell.cellIndex === 4) {
    item = document.createElement('input');
    item.setAttribute('type', 'number');
  }

  item.className = 'cell-input';

  item.onkeydown = function() {
    if (event.key === 'Enter') {
      this.blur();
    }
  };

  item.onblur = function() {
    editEnd(cell, item.value || innitText);
  };

  cell.replaceWith(item);
  item.focus();
}

function editEnd(cell, value) {
  cell.innerHTML = value;
  item.replaceWith(cell);
}

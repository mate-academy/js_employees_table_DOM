'use strict';

const table = document.querySelector('table');

const tbody = document.querySelector('tbody');
const list = tbody.children;

const strFormat = function(a, cellIndex) {
  return a.querySelectorAll('td')[cellIndex]
    .textContent.split('$').join('').split(',').join('');
};

let i;

const sortList = function(items, sortType) {
  return [...items].sort((a, b) => {
    const textA = strFormat(a, i);
    const textB = strFormat(b, i);

    if (sortType === 'asc') {
      if (isNaN(textA) && isNaN(textB)) {
        return textA > textB ? 1 : -1;
      } else {
        return (textA - textB);
      }
    }

    if (sortType === 'desc') {
      if (isNaN(textA) && isNaN(textB)) {
        return textB > textA ? 1 : -1;
      } else {
        return (textB - textA);
      }
    }
  });
};

let sortOfType = 'asc';

table.addEventListener('click', (e) => {
  const tableItem = e.target.closest('th');
  const cellIndex = tableItem.cellIndex;

  i = cellIndex;

  if (sortOfType === 'desc') {
    document.querySelector('tbody').append(...sortList(list, 'asc', cellIndex));
    sortOfType = 'asc';
  } else {
    document.querySelector('tbody').append(...sortList(list,
      'desc', cellIndex));
    sortOfType = 'desc';
  }
});

function numberWithComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

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

function createLabeledInput(labelText, inputType, dataQaValue) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.setAttribute('type', inputType);
  input.setAttribute('data-qa', dataQaValue);
  input.setAttribute('pattern', '[a-zA-Z]+');

  label.append(input);

  return label;
}

const nameLabeledInput = createLabeledInput('Name:', 'text', 'name');

form.appendChild(nameLabeledInput);

const positionLabeledInput = createLabeledInput('Position:',
  'text', 'position');

form.appendChild(positionLabeledInput);

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

function salaryCheck(value) {
  if (salaryInput.value < 0) {
    pushNotification('Error', 'Salary must be over 0.',
      'error');
  } else {
    return true;
  }
}

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
    return true;
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = document.getElementsByTagName('input')[0].value;
  const positionV = document.getElementsByTagName('input')[1].value;
  const ageV = document.getElementsByTagName('input')[2].value;
  const salaryV = '$' + document.getElementsByTagName('input')[3].value;

  const selectElem = document.querySelector('select');
  const officeV = selectElem.options[i].text;
  const newEmp = [nameValue, positionV, officeV, ageV, salaryV];

  if (validateForm(nameValue, ageV) === true
    && salaryCheck(salaryInput.value) === true) {
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

table.addEventListener('dblclick',
  function() {
    event.preventDefault();

    const cell = event.target;

    if (!cell || !table.contains(cell)) {
      return;
    }

    const cellItems = table.querySelectorAll('td');
    const index = Array.from(cellItems).findIndex(n => n === cell) % 5;
    const tempValue = cell.innerText;
    let item;

    switch (index) {
      case 2:
        item = document.createElement('select');

        item.innerHTML = `<option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>`;
        break;

      case 0:
      case 1:
        item = document.createElement('input');
        item.setAttribute('type', 'text');
        break;

      case 3:
      case 4:
        item = document.createElement('input');
        item.setAttribute('type', 'number');
        break;
    }

    cell.innerText = '';
    cell.append(item);
    item.focus();

    item.onblur = () => {
      itemValidation(index);
    };

    item.addEventListener('keydown', (evt) => {
      if (evt.code !== 'Enter') {
        return;
      }

      itemValidation(index);
    });

    const itemValidation = (k) => {
      if (!item.value) {
        cell.innerText = tempValue;
      }

      switch (k) {
        case 0:
          if (item.value.trim().length < 4) {
            cell.innerText = tempValue;

            pushNotification('Error',
              'Name length must be more than 4 letters.',
              'error');
            break;
          }
          cell.innerText = item.value;
          break;
        case 1:
          if (item.value.trim().length < 1) {
            cell.innerText = tempValue;

            pushNotification('Error', `Position: cannot be empty`,
              'error');
            break;
          }
          cell.innerText = item.value;
          break;
        case 3:
          if (item.value < 18 || item.value > 90) {
            cell.innerText = tempValue;

            pushNotification('Error', 'Age must be over 18 but under 90.',
              'error');
            break;
          }
          cell.innerText = item.value;
          break;
        case 4:
          if (item.value < 0 || item.value.trim().length < 1) {
            cell.innerText = tempValue;

            pushNotification('Error', 'Salary must be over 0.',
              'error');
            break;
          }
          cell.innerText = `$${numberWithComma(item.value)}`;
          break;
        default:
          cell.innerText = item.value;
      }
      item.remove();
    };
  });

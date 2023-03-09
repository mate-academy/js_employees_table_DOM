'use strict';

// write code here

const tbody = document.querySelectorAll('tbody');

const people = tbody[0].children;

const thead = document.querySelector('thead');

const columns = thead.children[0];

const headers = [...columns.children];

const counter = {};

headers.map(element => (counter[element.innerText] = false));

const bd = document.querySelector('body');

// FORM

const form = document.createElement('form');

form.className = 'new-employee-form';

function createInputForm(inputForm, inputName, type) {
  const lbl = document.createElement('label');

  lbl.innerText = inputName + ':';

  const input = document.createElement('input');

  input.type = type;
  input.dataset.qa = inputName.toLowerCase();
  input.id = inputName.toLowerCase();
  input.setAttribute('required', '');

  lbl.appendChild(input);
  inputForm.appendChild(lbl);
}

function createSelectOption(selectForm, selectName) {
  const option = document.createElement('option');

  if (selectName.length === 1) {
    option.setAttribute('selected', true);
  }

  option.innerText = selectName;
  option.value = selectName.toLowerCase();
  selectForm.appendChild(option);
}

createInputForm(form, 'Name', 'text');
createInputForm(form, 'Position', 'text');

const select = document.createElement('select');

createSelectOption(select, ' ');
createSelectOption(select, 'Tokyo');
createSelectOption(select, 'Singapur');
createSelectOption(select, 'London');
createSelectOption(select, 'New York');
createSelectOption(select, 'Edinburgh');
createSelectOption(select, 'San Francisco');

const label = document.createElement('label');

label.innerText = 'Office:';
label.appendChild(select);
form.appendChild(label);

createInputForm(form, 'Age', 'number');
createInputForm(form, 'Salary', 'text');

const button = document.createElement('button');

button.innerText = 'Save';
form.appendChild(button);

bd.appendChild(form);

const pushNotification = (posTop, posRight, title, description, type) => {
  // write code here

  const body = document.querySelector('body');

  const notifification = document.createElement('div');
  const h2 = document.createElement('h2');

  notifification.append(h2);
  h2.textContent = title;
  h2.className = 'title';

  const p = document.createElement('p');

  p.textContent = description;
  notifification.append(p);
  notifification.style.top = posTop + 'px';
  notifification.style.right = posRight + 'px';
  notifification.dataset.qa = 'notification';

  notifification.className = `notification + ${type}`;

  body.append(notifification);

  setTimeout(() => notifification.remove(), 2000);
};

function checkPerson(valueLength, age) {
  if (valueLength >= 4) {
    if (age > 18 && age < 90) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

button.addEventListener('click', (inputEvent) => {
  inputEvent.preventDefault();

  const salary = document.querySelector('[data-qa="salary"]');
  const inputName = document.querySelector('[data-qa="name"]');
  const age = document.querySelector('[data-qa="age"]');
  const position = document.querySelector('[data-qa="position"]');
  const selectValue = document.querySelector('select');

  const salaryFinalString = '$' + salary.value.slice(0, -3) + ','
  + salary.value.slice(-3);

  if (checkPerson(inputName.value.length, +age.value)) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');

    tdName.innerText = inputName.value;
    tr.appendChild(tdName);

    const tdPosition = document.createElement('td');

    tdPosition.innerText = position.value;
    tr.appendChild(tdPosition);

    const tdOffice = document.createElement('td');

    tdOffice.innerText = selectValue.options[selectValue.selectedIndex].value;
    tr.appendChild(tdOffice);

    const tdAge = document.createElement('td');

    tdAge.innerText = age.value;
    tr.appendChild(tdAge);

    const tdSalary = document.createElement('td');

    tdSalary.innerText = salaryFinalString;
    tr.appendChild(tdSalary);
    tbody[0].appendChild(tr);

    pushNotification(30, 20, 'Title of Success message',
      'Message example.\n '
  + 'Notification should contain title and description.', 'success');
  } else {
    pushNotification(30, 20, 'Title of Error message',
      'Message example.\n '
  + 'Notification should contain title and description.', 'error');
  }
});

// SELECT SECTION

bd.addEventListener('click', () => {
  const activeElement = document.querySelector('.active');

  if (activeElement) {
    activeElement.classList.remove('active');
  }
});

tbody[0].addEventListener('click', (selectEvent) => {
  selectEvent.stopPropagation();

  const activeElement = document.querySelector('.active');

  if (activeElement) {
    activeElement.classList.remove('active');
  }
  selectEvent.target.parentNode.className = 'active';
});

// END SELECT SECTION

// INPUT SECTION

tbody[0].addEventListener('dblclick', (inputFieldEvent) => {
  let oldData = '';
  let data;

  const input = document.createElement('input');

  const target = window.getComputedStyle(inputFieldEvent.target);

  const inputWidth = (+target.width.slice(0, -2)).toFixed(1) + 'px';

  input.className = 'cell-input';
  input.type = 'text';
  input.placeholder = 'INPUT';
  input.style.width = inputWidth;
  oldData = inputFieldEvent.target.innerText;
  inputFieldEvent.target.innerText = '';
  inputFieldEvent.target.appendChild(input);

  input.focus();

  function inputHandler() {
    inputFieldEvent.target.firstChild.remove();

    data = input.value;

    if (!data.length) {
      inputFieldEvent.target.innerText = oldData;
    } else {
      inputFieldEvent.target.innerText = data;
    }
  }

  input.addEventListener('blur', inputHandler);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      inputHandler();
    }
  });
});

// END INPUT SECTION

// SORT SECTION

columns.addEventListener('click', () => {
  if (counter[event.target.innerText]) {
    sortDesc(headers.indexOf(event.target), event.target.innerText);
  } else {
    sortColumn(headers.indexOf(event.target), event.target.innerText);
  }
});

function getClearData(data, index) {
  let clearData;

  switch (index) {
    case 0:
    case 1:
    case 2:
      clearData = data.toLowerCase();
      break;

    case 3:
      clearData = +data;
      break;

    case 4:
      clearData = +data.slice(1).replace(',', '');
      break;
  }

  return clearData;
}

function getComparison(x, y) {
  let comparisonResult;

  if (typeof x === 'string') {
    comparisonResult = x.localeCompare(y);
  } else {
    comparisonResult = x > y ? 1 : 0;
  }

  return comparisonResult;
}

function sortColumn(index, sortEvent) {
  counter[sortEvent] = true;

  let switching = true;

  let shouldSwitch;

  let x, y, i;

  while (switching) {
    switching = false;

    for (i = 0; i < (people.length - 1); i++) {
      shouldSwitch = false;
      x = getClearData(people[i].children[index].innerText, index);
      y = getClearData(people[i + 1].children[index].innerText, index);

      if (getComparison(x, y) === 1) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      people[i].parentNode.insertBefore(people[i + 1], people[i]);
      switching = true;
    }
  }
}

function sortDesc(index, sortDescEvent) {
  counter[sortDescEvent] = false;

  let switching = true;

  let shouldSwitch;

  let x, y, i;

  while (switching) {
    switching = false;

    for (i = 0; i < (people.length - 1); i++) {
      shouldSwitch = false;
      x = getClearData(people[i].children[index].innerText, index);
      y = getClearData(people[i + 1].children[index].innerText, index);

      if (getComparison(x, y) < 1 && x !== y) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      people[i].parentNode.insertBefore(people[i + 1], people[i]);
      switching = true;
    }
  }
}

// END SORT SECTION

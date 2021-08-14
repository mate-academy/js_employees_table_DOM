'use strict';

// table sorting

const selectorTop = document.querySelector('tr');
const tBody = document.querySelector('tbody');
let arrToSort = [...document.querySelectorAll('tr')];

arrToSort = arrToSort.slice(1, -1);

const parseSalary = (string) => {
  return parseFloat(string.substring(1).replace(',', ''));
};

for (let i = 0; i < selectorTop.childElementCount; i++) {
  selectorTop.children[i].isClicked = false;

  const sortfunction = (targetelement, order) => {
    arrToSort.sort((a, b) => {
      const firstEl = a.children[i].innerHTML;
      const secondEl = b.children[i].innerHTML;
      let compareResult = firstEl.localeCompare(secondEl);

      if (targetelement.children[i].textContent === 'Salary') {
        compareResult = parseSalary(firstEl) - parseSalary(secondEl);
      };

      return order === 'des' ? 0 - compareResult : compareResult;
    });

    tBody.append(...arrToSort);
  };

  selectorTop.children[i].addEventListener('click', (e) => {
    selectorTop.children[i].isClicked = !selectorTop.children[i].isClicked;

    selectorTop.children[i].isClicked === true
      ? sortfunction(selectorTop, 'asc')
      : sortfunction(selectorTop, 'des');
  });
}

// adding elements by hand into the table

const allCells = tBody.querySelectorAll('tr');

allCells.forEach(cell => {
  cell.addEventListener('click', (e) => {
    allCells.forEach(activeCell => {
      activeCell.classList.remove('active');
    });
    e.target.closest('tr').classList.add('active');

    if (e.target.closest('tr').classList.contains('active') === true) {
      e.target.contentEditable = true;
    };
  });
});

// form

const form = document.createElement('form');

form.classList.add('new-employee-form');

// select location

const locationSelect = document.createElement('select');
const locationLabel = document.createElement('label');

locationLabel.setAttribute('for', 'location');
locationLabel.innerText = 'Office';

locationSelect.setAttribute('name', 'office');
locationSelect.setAttribute('id', 'office');
locationSelect.setAttribute('data-qa', 'office');

const locationArr = [`Tokyo`, `Singapore`, `London`,
  `New York`, `Edinburgh`, `San Francisco`];

locationArr.map(place => {
  const newOption = document.createElement('option');

  newOption.innerText = `${place}`;
  locationSelect.append(newOption);
});

locationLabel.append(locationSelect);

// 4 inputs

const dataQAArr = ['name', 'position', 'age', 'salary'];

for (let i = 0; i <= 3; i++) {
  const newLabel = document.createElement('label');
  const newInput = document.createElement('input');

  newLabel.innerText = `${dataQAArr[i][0].toUpperCase()
    + dataQAArr[i].slice(1)}`;
  newInput.setAttribute('data-qa', dataQAArr[i]);
  newInput.setAttribute('name', dataQAArr[i]);
  newInput.setAttribute('type', 'text');
  newInput.setAttribute('required', 'true');
  newLabel.append(newInput);
  form.append(newLabel);
};

const nameInput = form.querySelector('[name="name"]');
const age = form.querySelector('[name="age"]');
const salary = form.querySelector('[name="salary"]');

age.setAttribute('type', 'number');
salary.setAttribute('type', 'number');
nameInput.minLength = 4;
age.max = 90;

// button

const formButton = document.createElement('button');

formButton.innerText = 'Save to table';

// append elements

form.insertBefore(locationLabel, form.children[2]);
form.append(formButton);

document.body.append(form);

// notifications

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const notifTitle = document.createElement('h2');
  const notifDescrb = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.style.width = '320px';
  notification.style.height = 'min-content';
  notification.style.right = `${posRight}px`;
  notification.style.top = `${posTop}px`;
  notification.style.padding = '10px';

  notifTitle.className = 'title';
  notifTitle.textContent = `${title}`;
  notifDescrb.textContent = `${description}`;

  document.body.append(notification);
  notification.append(notifTitle);
  notification.append(notifDescrb);

  setTimeout(function() {
    notification.setAttribute('hidden', 'hidden');
  },
  2000);
};

// add employer

const addEmployee = () => {
  const oldSalary = form.salary.value;
  const newEmplSalary = `$${new Intl.NumberFormat('en-EN').format(oldSalary)}`;
  const newEmplArray = [form.name.value, form.position.value,
    form.office.value, form.age.value, newEmplSalary];

  const numOfCols = document.querySelector('tr').childElementCount;
  const newRow = document.createElement('tr');

  for (let i = 0; i < numOfCols; i++) {
    const newCell = document.createElement('td');

    newCell.contentEditable = true;
    newCell.innerText = newEmplArray[i];
    newRow.append(newCell);
  };

  document.querySelector('tbody').prepend(newRow);
  arrToSort = [...document.querySelector('tbody').querySelectorAll('tr')];

  pushNotification(10, 10, 'Success!',
    'Operation is successful \n '
    + 'An employee has been added to the table.', 'success');
};

// event listening

function formCheck() {
  const checkName = form.name.value.length >= 4;
  const checkPosition = form.position.value.length > 0;
  const checkAge = form.age.value >= 18 && form.age.value <= 90;
  const checkSalary = form.salary.value > 0;

  return checkName && checkPosition && checkAge && checkSalary;
};

function resetFormValues() {
  document.querySelectorAll('form')[0].reset();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (formCheck() === true) {
    addEmployee();
    resetFormValues();
  }
});

formButton.addEventListener('click', (e) => {
  if (formCheck() !== true) {
    pushNotification(10, 10, 'Error!',
      'An error has occured \n'
      + 'Please enter valid data.', 'error');
  }
});

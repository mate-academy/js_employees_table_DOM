'use strict';

const tbody = document.querySelector('tbody');
const sortButton = document.querySelectorAll('th');
const data = [];
const thead = document.querySelector('thead');
let selectedCell;
let oldValue;
let newValue = '';
const newInput = document.createElement('input');

function addEventTocell() {
  const table = document.querySelector('tbody');

  for (let i = 0; i < table.querySelectorAll('td').length; i++) {
    table.querySelectorAll('td')[i].addEventListener('click', changeValue);
  }
}

function removeEventTocell() {
  const table = document.querySelector('tbody');

  for (let i = 0; i < table.querySelectorAll('td').length; i++) {
    table.querySelectorAll('td')[i].removeEventListener('click', changeValue);
  }
}

addEventTocell();

for (let i = 0; i < thead.children[0].children.length; i++) {
  thead.children[0].children[i].setAttribute('status', 'true');
}

for (let j = 0; j < sortButton.length; j++) {
  sortButton[j].addEventListener('click', createHTML);
}

for (let i = 0; i < tbody.rows.length; i++) {
  data.push({
    isActive: false,
    name: tbody.rows[i].cells[0].innerHTML,
    position: tbody.rows[i].cells[1].innerHTML,
    office: tbody.rows[i].cells[2].innerHTML,
    age: tbody.rows[i].cells[3].innerHTML,
    money: +tbody.rows[i].cells[4].innerHTML.replace(/\D/g, ''),
  });

  addActionRows();
}

function addActionRows() {
  const table = document.querySelector('tbody');

  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].addEventListener('click', setActivRow);
  }
}

function setActivRow(e) {
  const table = document.querySelector('tbody');
  const rows = [...table.rows];

  for (let i = 0; i < table.rows.length; i++) {
    if (e.currentTarget !== table.rows[i]) {
      table.rows[i].classList.remove('active');
      data[i].isActive = false;
    }
  }

  if (!data[rows.indexOf(e.currentTarget)].isActive) {
    e.currentTarget.classList.add('active');
    data[rows.indexOf(e.currentTarget)].isActive = true;
  } else {
    e.currentTarget.classList.remove('active');
    data[rows.indexOf(e.currentTarget)].isActive = false;
  }
}

function checkActivLink() {
  const table = document.querySelector('tbody');

  for (let i = 0; i < table.rows.length; i++) {
    if (data[i].isActive === true) {
      table.rows[i].classList.add('active');
    }
  }
}

function createHTML(e) {
  const element = e.currentTarget || thead.querySelectorAll('th')[0];

  tbody.innerHTML = '';

  data.map((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.position}</td>
      <td>${item.office}</td>
      <td>${item.age}</td>
      <td class="money">$${item.money.toLocaleString('en')}</td>
    `;
    tbody.append(row);
  });
  addEventTocell();
  filterData(element.innerHTML, element.getAttribute('status'), element);
}

function filterData(filterName, state, element) {
  if (filterName === 'Name') {
    if (state === 'true') {
      data.sort((a, b) => a.name > b.name ? 1 : -1);
      element.setAttribute('status', 'false');
    } else {
      data.sort((a, b) => a.name < b.name ? 1 : -1);
      element.setAttribute('status', 'true');
    }
  }

  if (filterName === 'Position') {
    if (state === 'true') {
      data.sort((a, b) => a.position > b.position ? 1 : -1);
      element.setAttribute('status', 'false');
    } else {
      data.sort((a, b) => a.position < b.position ? 1 : -1);
      element.setAttribute('status', 'true');
    }
  }

  if (filterName === 'Office') {
    if (state === 'true') {
      data.sort((a, b) => a.office > b.office ? 1 : -1);
      element.setAttribute('status', 'false');
    } else {
      data.sort((a, b) => a.office < b.office ? 1 : -1);
      element.setAttribute('status', 'true');
    }
  }

  if (filterName === 'Age') {
    if (state === 'true') {
      data.sort((a, b) => a.age > b.age ? 1 : -1);
      element.setAttribute('status', 'false');
    } else {
      data.sort((a, b) => a.age < b.age ? 1 : -1);
      element.setAttribute('status', 'true');
    }
  }

  if (filterName === 'Salary') {
    if (state === 'true') {
      data.sort((a, b) => a.money > b.money ? 1 : -1);
      element.setAttribute('status', 'false');
    } else {
      data.sort((a, b) => a.money < b.money ? 1 : -1);
      element.setAttribute('status', 'true');
    }
  }

  setTimeout(() => {
    checkActivLink();
    addActionRows();
  },);
}

document.body.insertAdjacentHTML('beforeend', `
  <div class='notification error error-all'
  data-qa="notification">
  <h1 class='title'>All fields are required</h1>
  </div>

  <div class='notification error invalid-name'
  data-qa="notification">
  <h1 class='title'>Invalid name</h1>
  </div>

  <div class='notification error short-name'
  data-qa="notification">
  <h1 class='title'>Name must be more than 3 characters</h1>
  </div>

  <div class='notification error long-name'
  data-qa="notification">
  <h1 class='title'>Name must be less than 90 characters</h1>
  </div>

  <div class='notification error position'
  data-qa="notification">
  <h1 class='title'>Specify position</h1>
  </div>

  <div class='notification error invalid-age'
  data-qa="notification">
  <h1 class='title'>Invalid age</h1>
  </div>

  <div class='notification error yong-age'
  data-qa="notification">
  <h1 class='title'>You are too young</h1>
  </div>

  <div class='notification error salary'
  data-qa="notification">
  <h1 class='title'>Invalid salary</h1>
  </div>

  <div class='notification success'
  data-qa="notification">
  <h1 class='title'>Person was succeffully added</h1>
  </div>
`);

const notification = document.querySelectorAll('.notification');
const shortName = document.querySelector('.short-name');
const invalidtName = document.querySelector('.invalid-name');
const longName = document.querySelector('.long-name');
const position = document.querySelector('.position');
const invalidAge = document.querySelector('.invalid-age');
const youngAge = document.querySelector('.yong-age');
const salary = document.querySelector('.salary');
const success = document.querySelector('.success');

for (const mess of notification) {
  mess.style.display = 'none';
}

document.body.insertAdjacentHTML('beforeend', `
  <form class = "new-employee-form">
  <label>Name:
  <input required name="name" type="text" data-qa="name">
  </label>
  <label>Position:
  <input required name="position" type="text" data-qa="position" >
  </label>
  <label>Office:
  <select required name="office" data-qa="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
  </label>
  <label>Age:
  <input required name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
  <input required name="salary" type="number" data-qa="salary">
  </label>
  <button type = "button">Save to table</button>
  </form>
`);

const saveBtn = document.querySelector('button');
const form = document.querySelector('form');

saveBtn.addEventListener('click', formValidation);

function formValidation(e) {
  const userForm = form.elements;

  if (
    userForm['name'].value.length === 0
      && userForm['position'].value.length === 0
      && userForm['age'].value.length === 0
      && userForm['salary'].value.length === 0
  ) {
    errorAll();
  } else {
    errorName(e, userForm);
  }
}

function errorAll() {
  notification[0].style.display = 'block';

  setTimeout(() => {
    notification[0].style.display = 'none';
  }, 2000);
}

function errorName(e, userForm) {
  if (userForm['name'].value.length === 0) {
    invalidtName.style.display = 'block';

    setTimeout(() => {
      invalidtName.style.display = 'none';
    }, 2000);
  }

  if (userForm['name'].value.length < 4) {
    shortName.style.display = 'block';

    setTimeout(() => {
      shortName.style.display = 'none';
    }, 2000);
  }

  if (userForm['name'].value.length > 90) {
    longName.style.display = 'block';

    setTimeout(() => {
      longName.style.display = 'none';
    }, 2000);
  }

  if (userForm['name'].value.length !== 0
    && userForm['name'].value.length >= 4
    && userForm['name'].value.length < 90
  ) {
    errorPosition(e, userForm);
  }
}

function errorPosition(e, userForm) {
  if (userForm['position'].value.length === 0) {
    position.style.display = 'block';

    setTimeout(() => {
      position.style.display = 'none';
    }, 2000);
  } else {
    errorAge(e, userForm);
  }
}

function errorAge(e, userForm) {
  if (userForm['age'].value === '') {
    invalidAge.style.display = 'block';

    setTimeout(() => {
      invalidAge.style.display = 'none';
    }, 2000);
  } else {
    if (userForm['age'].value < 18) {
      youngAge.style.display = 'block';

      setTimeout(() => {
        youngAge.style.display = 'none';
      }, 2000);
    } else {
      errorSalary(e, userForm);
    }
  }
}

function errorSalary(e, userForm) {
  if (userForm['salary'].value.length === 0) {
    salary.style.display = 'block';

    setTimeout(() => {
      salary.style.display = 'none';
    }, 2000);
  } else {
    succeffully(e, userForm);
  }
}

function succeffully(e, userForm) {
  success.style.display = 'block';

  setTimeout(() => {
    success.style.display = 'none';
  }, 2000);

  addPerson(e, userForm);
}

function addPerson(e, userForm) {
  data.push({
    isActive: false,
    name: userForm['name'].value,
    position: userForm['position'].value,
    office: userForm['office'].value,
    age: userForm['age'].value,
    money: +userForm['salary'].value.replace(/\D/g, ''),
  });

  setTimeout(() => {
    addEventTocell();
  }, 500);

  createHTML(e);
}

function changeValue(e) {
  removeEventTocell();

  const indexOf = e.currentTarget.innerHTML.indexOf('$');

  oldValue = indexOf === 0
    ? +e.currentTarget.innerHTML.replace(/\D/g, '').toLocaleString('en')
    : e.currentTarget.innerHTML;

  newValue = indexOf === 0
    ? +e.currentTarget.innerHTML.replace(/\D/g, '').toLocaleString('en')
    : e.currentTarget.innerHTML;
  selectedCell = e.currentTarget;

  newInput.addEventListener('keyup', () => {
    writeNewValue(indexOf);
  });

  e.currentTarget.innerHTML = '';
  newInput.value = oldValue;
  selectedCell.append(newInput);
  newInput.focus();

  newInput.addEventListener('blur', () => {
    addNewValue(indexOf);
  });
}

function addNewValue(indexOf) {
  setTimeout(() => {
    if (newValue === '' || newValue === 0) {
      selectedCell.innerHTML
      = indexOf === 0 ? `$${oldValue.toLocaleString('en')}` : oldValue;
    } else {
      setTimeout(() => {
        selectedCell.innerHTML
        = indexOf === 0 ? `$${newValue.toLocaleString('en')}` : newValue;
        newInput.remove();
      }, 10);
    }
  },);

  for (let i = 0; i < tbody.querySelectorAll('td').length; i++) {
    tbody.querySelectorAll('td')[i].addEventListener('click', changeValue);
  }
}

function writeNewValue(indexOf) {
  if (event.code === 'Enter') {
    addNewValue(indexOf);
  }

  newValue = indexOf === 0
    ? +newInput.value.replace(/\D/g, '') : newInput.value;
}

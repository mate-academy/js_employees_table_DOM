'use strict';

// write code here

//  SORTING

const tableName = document.getElementsByTagName('thead')[0]
  .children[0].children[0];
let nameBool = true;

const tablePosition = document.getElementsByTagName('thead')[0]
  .children[0].children[1];
let positionBool = true;

const tableOffice = document.getElementsByTagName('thead')[0]
  .children[0].children[2];
let officeBool = true;

const tableAge = document.getElementsByTagName('thead')[0]
  .children[0].children[3];
let ageBool = true;

const tableSalary = document.getElementsByTagName('thead')[0]
  .children[0].children[4];
let salaryBool = true;

tableName.addEventListener('click', () => {
  sortByAplabet('name', nameBool);
  nameBool = !nameBool;
});

tablePosition.addEventListener('click', () => {
  sortByAplabet('position', positionBool);
  positionBool = !positionBool;
});

tableOffice.addEventListener('click', () => {
  sortByAplabet('office', officeBool);
  officeBool = !officeBool;
});

tableAge.addEventListener('click', () => {
  sortByNum('age', ageBool);
  ageBool = !ageBool;
});

tableSalary.addEventListener('click', () => {
  sortByNum('salary', salaryBool);
  salaryBool = !salaryBool;
});

function sortByNum(arg, bool) {
  const trs1 = document.getElementsByTagName('tbody')[0]
    .children;
  const tbody = document.getElementsByTagName('tbody')[0];

  const trs = [...trs1].filter(el => el.parentElement === tbody);

  const people = [];

  for (let i = 0; i < trs.length; i++) {
    const obj = {};

    obj.name = trs[i].children[0].textContent;
    obj.position = trs[i].children[1].textContent;
    obj.office = trs[i].children[2].textContent;
    obj.age = trs[i].children[3].textContent;

    obj.salary = +trs[i].children[4].textContent
      .replaceAll(',', '').replace('$', '');

    people.push(obj);
  }

  let sorted = [];

  if (bool) {
    sorted = people.sort((a, b) => parseInt(a[arg])
    - parseInt(b[arg]));
  } else {
    sorted = people.sort((a, b) => parseInt(b[arg])
    - parseInt(a[arg]));
  }

  for (let i = 0; i < trs.length; i++) {
    trs[i].remove();
  }

  for (let i = 0; i < sorted.length; i++) {
    tbody.insertAdjacentHTML(`beforeend`, `
    <tr>
        <td>${sorted[i].name}</td>
        <td>${sorted[i].position}</td>
        <td>${sorted[i].office}</td>
        <td>${sorted[i].age}</td>
        <td>${sorted[i].salary.toLocaleString('en-US')}</td>
      </tr>
  `);
  }
}

function sortByAplabet(arg, bool) {
  const trs1 = document.getElementsByTagName('tbody')[0]
    .children;
  const tbody = document.getElementsByTagName('tbody')[0];

  const trs = [...trs1].filter(el => el.parentElement === tbody);

  const people = [];

  for (let i = 0; i < trs.length; i++) {
    const obj = {};

    obj.name = trs[i].children[0].textContent;
    obj.position = trs[i].children[1].textContent;
    obj.office = trs[i].children[2].textContent;
    obj.age = trs[i].children[3].textContent;
    obj.salary = trs[i].children[4].textContent;

    people.push(obj);
  }

  let sorted = [];

  if (bool) {
    sorted = people
      .sort((a, b) => a[arg].localeCompare(b[arg]));
  } else {
    sorted = people
      .sort((a, b) => b[arg].localeCompare(a[arg]));
  }

  for (let i = 0; i < trs.length; i++) {
    trs[i].remove();
  }

  for (let i = 0; i < sorted.length; i++) {
    tbody.insertAdjacentHTML(`beforeend`, `
    <tr>
        <td>${sorted[i].name}</td>
        <td>${sorted[i].position}</td>
        <td>${sorted[i].office}</td>
        <td>${sorted[i].age}</td>
        <td>${sorted[i].salary}</td>
      </tr>
  `);
  }
}

//  SELECTING ROW

const rows = document.getElementsByTagName('tbody')[0].children;

for (let i = 0; i < rows.length; i++) {
  rows[i].addEventListener('click', () => {
    const newRows = document.getElementsByTagName('tbody')[0].children;

    for (let j = 0; j < rows.length; j++) {
      if (newRows[j].classList.contains('active')) {
        newRows[j].classList.remove('active');
        newRows[i].classList.add('active');
      } else {
        newRows[i].classList.add('active');
      }
    }
  });
}

//  VALIDATING

const formHtml = `
<form class="new-employee-form">
  <label>Name: 
    <input name="name" type="text" data-qa="name" required>
  </label>

  <label>Position: 
    <input name="position" type="text" data-qa="position" required>
  </label>

  <label>Office:
    <select name="office" type="text" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label>Age: 
    <input name="age" type="number" data-qa="age" required>
  </label>

  <label>Salary: 
    <input name="salary" type="number" data-qa="salary" required>
  </label>

  <button type="submit" class="button">Save to table</button>
</form>
`;

document.getElementsByTagName('body')[0]
  .insertAdjacentHTML('beforeend', formHtml);

document.querySelector('.button').addEventListener('click', (e) => {
  e.preventDefault();
  validate();
});

function validate() {
  const form = document.querySelector('.new-employee-form');
  const table = document.getElementsByTagName('tbody')[0];
  let correct = true;

  if (form.children[0].children[0].value.length < 4) {
    pushNotification(0, 0, 'Invalid Name',
      'Must be at least 4 letters', 'error');
    correct = false;
  }

  if (form.children[3].children[0].value < 18
      || form.children[3].children[0].value > 90) {
    pushNotification(0, 310, 'Invalid Age',
      'Must be between 18 and 90', 'error');
    correct = false;
  }

  for (let i = 0; i < form.children.length - 1; i++) {
    if (!form.children[i].children[0].validity.valid) {
      pushNotification(0, 620, 'Invalid Data',
        'Some invalid data ', 'error');
      correct = false;
      break;
    }
  }

  if (correct) {
    pushNotification(0, 0, 'Krasvchik',
      'Successfully added', 'success');

    table.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${form.children[0].children[0].value}</td>
        <td>${form.children[1].children[0].value}</td>
        <td>${form.children[2].children[0].value}</td>
        <td>${form.children[3].children[0].value}</td>
        <td>$${parseInt(form.children[4].children[0].value)
    .toLocaleString('en-US')}</td>
      </tr>
  `);

    [...document.getElementsByTagName('label')]
      .map(function(el) {
        el.children[0].value = '';
      });
  }
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.getElementsByTagName('body')[0];

  body.insertAdjacentHTML('afterbegin', `
  <div class="notification
    ${type}" style='top: ${posTop}px; right: ${posRight}px'
    data-qa="notification"
  >
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  </div>
  `);

  setTimeout(function() {
    body.removeChild(document.querySelector('.notification'));
  }, 2000);
};

//  EDITING

const tds = document.getElementsByTagName('td');

for (let i = 0; i < tds.length; i++) {
  tds[i].addEventListener('dblclick', () => {
    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.setAttribute('value', tds[i].textContent);

    tds[i].parentElement.replaceChild(input, tds[i]);

    input.addEventListener('blur', () => {
      const td = document.createElement('td');

      if (input.value === '') {
        td.textContent = tds[i].textContent;
      } else {
        td.textContent = input.value;
      }

      tds[i].parentElement.replaceChild(td, input);
    });
  });
}

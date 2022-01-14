'use strict';

const table = document.querySelector('table');
const tBodyChild = document.querySelector('tBody').children;
const tBody = document.querySelector('tBody');
const data = [];

function dataDelete(form) {
  form.children[0].children[0].value = '';
  form.children[1].children[0].value = '';

  form.children[2].children[0].value
    = form.children[2].children[0].children[0].value;
  form.children[3].children[0].value = '';
  form.children[4].children[0].value = '';
}

function refreshTable() {
  tBody.innerHTML = '';

  for (const i in data) {
    tBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${data[i].name}</td>
        <td>${data[i].position}</td>
        <td>${data[i].office}</td>
        <td>${data[i].age}</td>
        <td>$${data[i].salary.toLocaleString('en-EN')}</td>
      </tr>
    `);
  }
}

for (const man of tBodyChild) {
  data.push({
    name: man.children[0].textContent,
    position: man.children[1].textContent,
    office: man.children[2].textContent,
    age: +man.children[3].textContent,
    salary: +man.children[4].textContent.match(/[0-9]/g).join(''),
  });
}

let sortBy = '';
let classActive = '';

table.addEventListener('click', e => {
  const item = e.target.closest('th');
  const sort = e.target.textContent.toLowerCase();

  if (!item) {
    return;
  }

  switch (e.target.textContent) {
    case 'Name':
    case 'Position':
    case 'Office':

      if (sortBy !== e.target.textContent) {
        data.sort((a, b) => a[sort].localeCompare(b[sort]));
        sortBy = e.target.textContent;
      } else {
        data.sort((a, b) => b[sort].localeCompare(a[sort]));
        sortBy = '';
      }
      break;

    case 'Age':
      if (sortBy !== e.target.textContent) {
        data.sort((a, b) => a.age - b.age);
        sortBy = e.target.textContent;
      } else {
        data.sort((a, b) => b.age - a.age);
        sortBy = '';
      }
      break;

    case 'Salary':
      if (sortBy !== e.target.textContent) {
        data.sort((a, b) => a.salary - b.salary);
        sortBy = e.target.textContent;
      } else {
        data.sort((a, b) => b.salary - a.salary);
        sortBy = '';
      }
      break;
  }

  refreshTable();
});

tBody.addEventListener('click', (e) => {
  const item = e.target.closest('tr');

  if (!classActive) {
    classActive = item;
    item.classList.add('active');
  } else {
    classActive.classList.remove('active');
    item.classList.add('active');
    classActive = item;
  }
});

table.insertAdjacentHTML('afterend', `
<form action="#" method="post" class="new-employee-form">
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="Position" type="text"
    data-qa="position" required></label>
  <label>Office:
    <select name="select" data-qa="office" required>
      <option>Tokio</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age" type="number" min="0" data-qa="age" required>
  </label>
  <label>Salary:
    <input name="salary" type="number"
      step="100" min="0" data-qa="salary" required>
  </label>

  <button type="button" class="add-persone-btn">Save to table</button>
</form>
`);

const addPersoneBtn = document.querySelector('.add-persone-btn');

addPersoneBtn.addEventListener('click', (e) => {
  const form = e.target.closest('form');

  const nameValue = form.children[0].children[0].value;
  const positionValue = form.children[1].children[0].value;
  const officeValue = form.children[2].children[0].value;
  const ageValue = form.children[3].children[0].value;
  const salaryValue = +form.children[4].children[0].value;

  if (nameValue.length < 4) {
    pushNotification('Name');

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    pushNotification('Age');

    return;
  }

  if (!positionValue) {
    pushNotification('Position');

    return;
  }

  if (!salaryValue) {
    pushNotification('Salary');

    return;
  }

  data.push({
    name: nameValue,
    position: positionValue,
    office: officeValue,
    age: ageValue,
    salary: salaryValue,
  });

  refreshTable();
  dataDelete(form);
  pushNotification();
});

function pushNotification(text) {
  const error = `
  <div class="notification error"
  <h2 class="title">${text} not correct!</h2>
  <p>please write correct data</p>
  </div>
  `;

  const success = `
  <div class="notification uccess"
    style="top :10px; right: 10px;">
    <h2 class="title">Data correct!</h2>
    <p>Person was add!</p>
  </div>
  `;

  if (text) {
    document.body.insertAdjacentHTML('afterbegin', error);
  } else {
    document.body.insertAdjacentHTML('afterbegin', success);
  }

  setTimeout(() => {
    document.querySelector('.notification').remove();
  }, 3000);
};

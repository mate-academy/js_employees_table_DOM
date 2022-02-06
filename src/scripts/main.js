'use strict';

const tbody = document.querySelector('tbody');
const head = document.querySelector('thead');
const headRows = head.querySelectorAll('th');
const rows = tbody.querySelectorAll('tr');
let sort = true;

const notification = document.createElement('div');

notification.className = 'notification';
notification['data-qa'] = 'notification';

notification.innerHTML = `
  <h3 class="title"></h3>
  <p></p>
`;

const title = notification.querySelector('.title');
const notText = notification.querySelector('p');

notification.hidden = true;

document.body.append(notification);

const form = document.createElement('form');
const formBtn = document.createElement('button');

formBtn.innerText = `Save to table`;

headRows.forEach(el => {
  const label = document.createElement('label');
  const text = el.textContent.toLowerCase();

  label.htmlFor = text;

  label.innerHTML = `
  ${el.textContent}:
    <input
      name="${text}"
      id="${text}"
      data-qa="${text}"
   ></input>
  `;

  switch (el.textContent) {
    case 'Name':
      label.firstElementChild.setAttribute('minlength', 4);
      break;

    case 'Age':
      label.firstElementChild.type = 'number';
      label.firstElementChild.min = '0';
      break;

    case 'Salary':
      label.firstElementChild.type = 'number';
      label.firstElementChild.min = '0';
      break;

    case 'Office':
      label.innerHTML = `
        ${el.textContent}:
        <select
        name="${text}"
        id="${text}"
        data-qa="${text}"
        size="1"
       ></select>
      `;
      break;
  }

  form.append(label);
});

const select = form.querySelector('select');
const indexOfCell = [...headRows].find(el =>
  el.textContent === 'Office').cellIndex;
const cityList = [];

rows.forEach(el => cityList.push(el.children[indexOfCell].textContent));

const uniqueCity = new Set(cityList);

uniqueCity.forEach(el => {
  const option = document.createElement('option');

  option.value = el;
  option.textContent = el;

  select.append(option);
});

form.classList.add('new-employee-form');
form.append(formBtn);

document.body.lastElementChild.before(form);

formBtn.addEventListener('click', ev => {
  ev.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());

  const { name: employeeName, age, salary } = dataObject;

  const newRow = document.createElement('tr');

  Object.entries(dataObject).forEach(el => {
    const td = document.createElement('td');

    td.textContent = el[1];

    switch ('salary') {
      case el[0]:
        td.textContent = '$' + (+el[1]).toLocaleString('en');
    }

    newRow.append(td);
  });

  switch (true) {
    case (!employeeName || !age || !salary):
      notification.classList.add('warning');
      title.textContent = 'WARNING';
      notText.textContent = 'Invalid data type!';
      notification.hidden = false;
      break;
    case employeeName.length < 4:
      notification.classList.add('error');
      title.textContent = 'ERROR';
      notText.textContent = 'Name must be at least 4 characters long!';
      notification.hidden = false;
      break;
    case age > 90 || age < 18:
      notification.classList.add('error');
      title.textContent = 'ERROR';
      notText.textContent = 'Age should be between 18 and 90!';
      notification.hidden = false;
      break;
    case (true):
      notification.classList.add('success');
      title.textContent = 'SUCCESS';
      notText.textContent = 'The employee is added to the list';
      notification.hidden = false;

      tbody.append(newRow);
      break;
  }

  setTimeout(() => {
    notification.className = 'notification';
    notification.hidden = true;
  }, 2000);
});

head.addEventListener('click', ev => {
  const ceil = ev.target.closest('th');
  const rowList = tbody.querySelectorAll('tr');
  const index = ceil.cellIndex;

  const sorted = [...rowList].sort((a, b) => {
    const elementA = a.children[index].textContent.replace(/\$|,/g, '');
    const elementB = b.children[index].textContent.replace(/\$|,/g, '');

    if (isNaN(elementA - elementB)) {
      if (sort) {
        return elementA.localeCompare(elementB);
      } else {
        return elementB.localeCompare(elementA);
      }
    } else {
      if (sort) {
        return elementA - elementB;
      } else {
        return elementB - elementA;
      }
    }
  });

  sort = !sort;
  tbody.append(...sorted);
});

tbody.addEventListener('click', ev => {
  const row = ev.target.closest('tr');

  const rowWithClass = [...rows].find(el => el.matches('.active'));

  if (rowWithClass) {
    rowWithClass.classList.remove('active');
  }

  row.classList.add('active');
});

tbody.addEventListener('dblclick', ev => {
  const item = ev.target.closest('td');
  const cellText = item.textContent;

  item.innerHTML = `
  <input
    class="cell-input"
    value="${cellText}"
   ></input>
  `;

  function changingFunction() {
    if (item.firstElementChild.value) {
      item.innerHTML = `<td>${item.firstElementChild.value}</td>`;
    } else {
      item.innerHTML = `<td>${cellText}</td>`;
    }
  }

  item.children[0].addEventListener('blur', key => {
    changingFunction();
  });

  item.children[0].addEventListener('keydown', key => {
    if (key.code === 'Enter') {
      changingFunction();
    }
  });
});

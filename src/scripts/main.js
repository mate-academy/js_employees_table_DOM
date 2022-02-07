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
      label.firstElementChild.pattern = '[0-9]+';
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

const timeOut = () => {
  return setTimeout(() => {
    notification.className = 'notification';
    notification.hidden = true;
  }, 2000);
};

function message(mess, tit) {
  notification.classList.add(tit);
  title.textContent = tit.toUpperCase();
  notText.textContent = mess;
  notification.hidden = false;

  return notification;
}

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
      message('Invalid data type!', 'warning');
      break;
    case employeeName.length < 4:
      message('Name must be at least 4 characters long!', 'error');
      break;
    case age > 90 || age < 18:
      message('Age should be between 18 and 90!', 'error');
      break;
    case (true):
      message('The employee is added to the list!', 'success');

      tbody.append(newRow);

      for (const child of form.children) {
        if (child.firstElementChild
            && child.firstElementChild.name !== 'office') {
          child.firstElementChild.value = '';
        }
      }
      break;
  }

  timeOut();
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
  const clone = select.cloneNode(true);
  const cellText = item.textContent;
  const input = document.createElement('input');
  const group = headRows[item.cellIndex].textContent;

  const textLength = [...clone.children].reduce((acc, el) => {
    return acc + el.textContent.length;
  }, 0);

  if (!item.textContent || textLength === item.textContent.length) {
    return;
  }

  const style = getComputedStyle(item);
  const width = style.width;

  input.style.maxWidth = width;
  input.classList.add('cell-input');
  input.value = cellText;
  clone.classList.add('cell-input');

  item.textContent = '';
  item.append(input);

  if (group === 'Office') {
    item.innerHTML = '';
    item.append(clone);
    item.firstElementChild.removeAttribute('id');
    item.firstElementChild.value = cellText;
  }

  if (group === 'Age' || group === 'Salary') {
    item.firstElementChild.pattern = '[0-9]+';
  }

  if (group === 'Salary') {
    item.firstElementChild.value = cellText.replace(/\$|,/g, '');
  }

  const child = item.firstElementChild;

  child.focus();

  function changing(key) {
    const newTextContent = child.value;

    if (key.type === 'blur' || key.code === 'Enter') {
      item.innerHTML = '';
      item.textContent = cellText;

      if (!newTextContent) {
        message('The field must not be empty!', 'error');
        timeOut();
      }

      if (group === 'Name') {
        if (child.value.length < 4) {
          message('Name must be at least 4 characters long!', 'error');
          timeOut();
        } else {
          item.textContent = newTextContent;
        }
      }

      if (group === 'Position' || group === 'Office') {
        item.textContent = newTextContent;
      }

      if (group === 'Age') {
        if (!child.validity.valid) {
          message('The field must be numeric!', 'error');
          timeOut();
        }

        if (child.value < 18 || child.value > 90) {
          message('Age should be between 18 and 90!', 'error');
          timeOut();
        } else {
          item.textContent = newTextContent;
        }
      }

      if (group === 'Salary') {
        if (!child.validity.valid) {
          message('The field must be numeric!', 'error');
          timeOut();
        } else {
          item.textContent = '$'
          + (+newTextContent).toLocaleString('en');
        }
      }
    }
  }

  child.addEventListener('blur', changing);
  child.addEventListener('keydown', changing);
});

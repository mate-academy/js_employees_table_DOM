'use strict';

// write code here
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const allData = thead.querySelectorAll('th');
const head = document.querySelector('head');
const table = document.querySelector('table');
const countries = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

allData.forEach((item) => {
  item.dataset.qa = item.innerText;
});

const control = {};

thead.addEventListener('click', (elem) => {
  const index = [...elem.target.parentElement.children].indexOf(elem.target);

  control[index] = !control[index];

  let form = [];

  if (index <= 2) {
    form = [...tbody.children].sort((a, b) => {
      const aSort = control[index]
        ? a.children[index].innerText
        : b.children[index].innerText;
      const bSort = control[index]
        ? b.children[index].innerText
        : a.children[index].innerText;

      return aSort.localeCompare(bSort);
    });
  } else {
    form = [...tbody.children].sort((a, b) => {
      const aStatus = control[index] ? a : b;
      const bStatus = control[index] ? b : a;
      let aSort = index === 3 ? Number(aStatus.children[index].innerText) : 0;
      let bSort = index === 3 ? Number(bStatus.children[index].innerText) : 0;

      if (index === 4) {
        aSort = Number(
          [...aStatus.children[index].innerText]
            .filter((item) => item !== '$' && item !== ',')
            .join('')
        );

        bSort = Number(
          [...bStatus.children[index].innerText]
            .filter((item) => item !== '$' && item !== ',')
            .join('')
        );
      }

      return aSort - bSort;
    });
  }

  const mappedForm = form.map((item) => item.innerHTML);

  for (let i = 0; i < mappedForm.length; i++) {
    const res = mappedForm[i];

    tbody.children[i].innerHTML = res;
  }
}); // сортировка

document.body.addEventListener('click', (elem) => {
  const tr = tbody.querySelectorAll('tr');
  const focusItem = elem.target.parentElement;

  tr.forEach((item) => {
    if (focusItem !== item || focusItem === thead) {
      item.classList.remove('active');
    }
  });

  if (focusItem === thead.firstElementChild) {

  } else if (focusItem.parentElement === tbody) {
    focusItem.classList.add('active');
  }
}); // выделение

function createWindow() {
  const form = document.createElement('form');
  const button = document.createElement('button');

  button.innerText = 'Save to table';
  button.getAttribute('type');
  button.type = 'submit';
  form.style.position = 'absolute';
  form.style.left = `${innerWidth / 2 + thead.clientWidth / 2}px`;
  form.style.top = `${table.offsetTop}px`;
  form.classList.add('new-employee-form');
  form.getAttribute('action');
  form.getAttribute('metod');
  form.action = '/';
  form.method = 'GET';

  allData.forEach((item) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.innerText = item.dataset.qa;
    input.name = item.dataset.qa;
    input.classList = 'inputPlace';

    if (item.dataset.qa === 'Office') {
      input.placeholder = 'Select office';

      const datalist = document.createElement('datalist');

      label.for = item.dataset.qa;

      datalist.id = item.dataset.qa;

      countries.forEach((country) => {
        const option = document.createElement('option');

        option.value = country;
        option.textContent = country;
        datalist.append(option);
        form.append(datalist);
      });

      input.getAttribute('list');
      input.setAttribute('list', item.dataset.qa);
    }

    label.append(input);
    form.append(label);
  });
  document.body.append(form);
  form.append(button);

  window.addEventListener('resize', (e) => {
    form.style.left = `${innerWidth / 2 + thead.clientWidth / 2}px`;
  });
}; // создание окна формы

function createButton() {
  const button = document.createElement('button');
  const distanceToThead = thead.getBoundingClientRect();

  button.classList = 'createWindow';
  button.innerHTML = '<h3>Create new user</h3>';

  button.style.cssText = `
  position: fixed;
  left: ${innerWidth / 2 + table.clientWidth / 2}px;
  top: ${distanceToThead.top - window.pageYOffset}px;
  padding-bottom: 5px;
  margin-left: 25px;
  height: ${allData[0].clientHeight}px;
  background: #e25644;
  color: white;
  border: none;
  border-radius: 8px;
    `;

  window.addEventListener('resize', (e) => {
    button.style.left = `${innerWidth / 2 + table.clientWidth / 2}px`;
  });
  document.body.append(button);

  head.insertAdjacentHTML('beforeend', `
  <style>
  .createWindow:hover h3 {
      color: yellow;
    }
    </style>
  `); // поведение кнопки при прохождении мышки
} // создание кнопки для открытия окна формы и её поведения
createButton();

const buttonCreate = document.querySelector('button');

function checkInnerText(item, index) {
  const numbers = parseInt(item, 10);

  if (index <= 2 && isNaN(numbers)) {
    const statusItem = index === 0 ? item.length >= 4 : item.length > 0;

    if (index === 2) {
      return countries.includes(item);
    }

    return statusItem;
  } else if (index > 2 && typeof numbers === 'number') {
    const statusItem
      = index === 3 ? numbers >= 18 && numbers <= 90 : item.length > 0;

    return statusItem;
  } else {
    return false;
  }
} // проверка текста для заполнения

buttonCreate.addEventListener('click', (even) => {
  even.target.parentElement.hidden = true;
  createWindow();

  const form = document.querySelector('form');

  form.addEventListener('submit', (elem) => {
    elem.preventDefault();

    const data = new FormData(form);
    const result = Object.fromEntries(data.entries());
    const outerForm = document.createElement('tr');

    for (const item in result) {
      const index = Object.keys(result).findIndex((el) => el === item);

      if (data.get(item) && checkInnerText(data.get(item), index)) {
        const itemElement = document.createElement('td');

        if (index === 4) {
          const filterData = data.get(item).split('');
          const confirmed = filterData.reduce((prev, x, ind, mass) => {
            const prevResult = ind === 3 && mass.length > ind
              ? (prev + ',' + x)
              : (prev + x);

            return prevResult;
          });

          itemElement.innerText = `$${confirmed}`;
        } else {
          itemElement.innerText = data.get(item);
        }
        outerForm.append(itemElement);
      } else if (!checkInnerText(data.get(item), index)) {
        let message = '';

        if (index < 2) {
          message = `Wrong text in ${item}. 
          You must use more then 4 letter. Dont use numbers.`;
        } else if (index === 2) {
          message = `You dont select option in ${item}.`;
        } else if (index === 3) {
          message = `Wrong data in ${item}.
          Age must be more then 18. Dont use text.`;
        } else if (index === 4) {
          message = `Wrong data in ${item}. Use only numbers.`;
        }
        pushNotification('Warning', message, 'warning');

        return;
      } else {
        const message = `You do somthing wrong. Try reload page`;

        pushNotification('Error', message, 'error');

        return;
      }
    }
    tbody.append(outerForm);
    pushNotification('Success', 'Added to form', 'success');
    form.remove();
    even.target.parentElement.hidden = false;
  });
});// вызов уведомлений и передача данных в таблицу

const colectNotifications = document.createElement('div');

colectNotifications.classList = 'colectNotifications';
colectNotifications.score = 0;
colectNotifications.style.zIndex = 1;

document.body.append(colectNotifications);

const clear = () => {
  colectNotifications.score = 0;

  colectNotifications
    .querySelectorAll('div')
    .forEach((el) => {
      el.remove();
    });
}; // очистка ошибок

const pushNotification = (
  title,
  description,
  type
) => {
  function message() {
    const core = document.createElement('div');

    if (colectNotifications.score * 200 >= innerHeight) {
      colectNotifications.score = 0;
      clear();
    } else {
      core.style.top = `${colectNotifications.score * 150}px`;
    }
    core.className = `notification ${type}`;
    core.dataset.qa = 'notification';

    core.innerHTML = `
    <h2 class='title'>${title}</h2>
    <p>${description}</p>
    `;

    colectNotifications.score += 1;
    colectNotifications.append(core);
    setTimeout(clear, 3000);
  }

  message();
};// создание окон уведомлений

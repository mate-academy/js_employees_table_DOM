'use strict';

const body = document.querySelector('body');
// const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tr = tbody.getElementsByTagName('tr');
const th = Array.from(document.getElementsByTagName(`th`));
let indexSort;

// add form

const form = document.createElement('form');
const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
form.classList.add('new-employee-form');
body.append(form);

form.insertAdjacentHTML(
  'beforeend',
  '<label>Name: <input data-qa="name" name="name" type="text"></label>',
);

form.insertAdjacentHTML(
  'beforeend',
  `<label>
  Position:
  <input data-qa="position" name="position" type="text">
</label>`,
);

form.insertAdjacentHTML(
  'beforeend',
  `<label>
  Office:
  <select data-qa="office" name="office" type="text"></select>
  </label>`,
);

form.insertAdjacentHTML(
  'beforeend',
  '<label>Age: <input data-qa="age" name="age" type="number"></label>',
);

form.insertAdjacentHTML(
  'beforeend',
  '<label>Salary: <input data-qa="salary" name="salary" type="number"></label>',
);

const locations = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

locations.forEach((locat) => {
  const option = document.createElement('option');

  option.setAttribute('locat', locat);
  option.textContent = locat;
  document.querySelector('select').append(option);
});

form.append(button);

//  checked data
button.addEventListener('click', (e) => {
  e.preventDefault();

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('span');

  notification.classList.add('notification');
  notificationTitle.classList.add('span');
  notification.setAttribute('data-qa', 'notification');
  notification.appendChild(notificationTitle);

  const addWorker = [
    `${form.name.value}`,
    `${form.position.value}`,
    `${form.office.value}`,
    `${form.age.value}`,
    `${form.salary.value}`,
  ];

  if (addWorker[0].length < 4 || addWorker[3] < 18 || addWorker[3] > 90) {
    notificationTitle.textContent = 'error data';
    notification.classList.add('error');
  } else {
    notificationTitle.textContent = 'success!';
    notification.classList.add('success');

    const newRow = tbody.insertRow();

    addWorker.forEach((item, index) => {
      const cell = newRow.insertCell();

      cell.textContent = item;

      if (index === 4) {
        cell.textContent = `$${Number(item).toLocaleString('en-US')}`;
      }
    });
  }
  form.insertAdjacentElement('beforebegin', notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
    form.reset();
  }, 2000);
});

// selected row

tbody.addEventListener('click', (e) => {
  Array.from(tr).map((item) => item.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

// table sorting
thead.addEventListener('click', function (e) {
  e.preventDefault();
  indexSort = th.indexOf(e.target);

  // ?

  const firstCellColumn =
    Array.from(tr)[0].childNodes[2 * indexSort + 1].textContent;
  const lastCellColumn =
    Array.from(tr)[Array.from(tr).length - 1].childNodes[2 * indexSort + 1]
      .textContent;

  const sort = Array.from(tr).sort((a, b) => {
    let aSort;
    let bSort;

    if (indexSort === 4) {
      aSort = parseFloat(
        a.children[indexSort].textContent.replace(/[^0-9]/, ''),
      );

      bSort = parseFloat(
        b.children[indexSort].textContent.replace(/[^0-9]/, ''),
      );

      return firstCellColumn < lastCellColumn ? aSort - bSort : bSort - aSort;
    } else {
      aSort = a.children[indexSort].textContent;
      bSort = b.children[indexSort].textContent;

      return firstCellColumn > lastCellColumn
        ? aSort.localeCompare(bSort)
        : bSort.localeCompare(aSort);
    }
  });

  tbody.append(...sort);
});

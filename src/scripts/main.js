'use strict';

const table = document.querySelector('table');

// ------- sorting ----------------

const thead = table.querySelector('thead');

thead.addEventListener('click', sortTable);

let previousClickedElement;

function sortTable(e) {
  const clickedElement = e.target;

  if (previousClickedElement === e.target) {
    table.setAttribute('sortDirection', 'DESC');
  }

  if (previousClickedElement !== e.target) {
    table.removeAttribute('sortDirection');
  }

  previousClickedElement = e.target;

  const clickedElementRow = [...clickedElement.parentElement.children];

  const indexOfSortedColumn = clickedElementRow.findIndex(
    (item) => item.textContent === clickedElement.textContent);

  const tbodyCurrent = table.querySelector('tbody');

  const rows = [...tbodyCurrent.querySelectorAll('tr')];

  rows.sort((a, b) => {
    let firsElem = a.children[indexOfSortedColumn].textContent;
    let secondElem = b.children[indexOfSortedColumn].textContent;

    if (firsElem[0] === '$') {
      firsElem = +firsElem.replace('$', '').replace(',', '.');
      secondElem = +secondElem.replace('$', '').replace(',', '.');
    }

    if (isFinite(firsElem)) {
      if (table.hasAttribute('sortDirection')) {
        return +firsElem < +secondElem ? 1 : -1;
      }

      return +firsElem > +secondElem ? 1 : -1;
    }

    if (table.hasAttribute('sortDirection')) {
      return +firsElem < +secondElem ? 1 : -1;
    }

    return firsElem > secondElem ? 1 : -1;
  });

  const tbodySorted = document.createElement('tbody');

  for (const elem of rows) {
    tbodySorted.append(elem);
  }

  tbodyCurrent.remove();

  thead.after(tbodySorted);
}

// ------- row selection ----------------

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    return;
  }

  const activeClass = table.querySelector('.active');

  if (activeClass !== null) {
    activeClass.classList.remove('active');
  }

  e.target.parentElement.classList.add('active');
});

// ------- add form ----------------

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin',
  `<label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position"
    type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" type="text" data-qa="office">
      <option value='Tokyo'>Tokyo</option>
      <option value='Singapore'>Singapore</option>
      <option value='London'>London</option>
      <option value='New York'>New York</option>
      <option value='Edinburgh'>Edinburgh</option>
      <option value='San Francisco'>San Francisco</option>
    </select>
   </label>
  <label>Age: <input name="age" type="text" data-qa="age"></label>
  <label>Salary: <input name="salary" type="text" data-qa="salary"></label>
  <button type="submit">Save to table</button>`
);

document.body.append(form);

// ------- form actions and notifications----------------

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (document.querySelector('.notification')) {
    document.querySelector('.notification').remove();
  }

  const data = new FormData(form);

  const formData = Object.fromEntries(data.entries());

  const notification = {
    errors: [],
    typeOfNotification: 'success',
    title: 'Success!',
  };

  const notificationBlock = document.createElement('div');

  notificationBlock.setAttribute('data-qa', 'notification');

  formValidate(formData, notification);

  if (notification.errors.length > 0) {
    for (const error of notification.errors) {
      const p = document.createElement('p');

      p.insertAdjacentHTML('beforeend',
        `${error}`);

      notificationBlock.append(p);
    }
  }

  notificationBlock.classList.add(
    'notification',
    notification.typeOfNotification
  );

  notificationBlock.insertAdjacentHTML('afterbegin',
    `<h2 class="title">${notification.title}</h2>`
  );

  document.body.append(notificationBlock);

  if (notification.errors.length === 0) {
    const newRow = document.createElement('tr');

    let salary = +(formData.salary.replace(',', '.'));

    salary = '$' + salary.toFixed(3).replace('.', ',');

    newRow.insertAdjacentHTML('afterbegin', `
      <td>${formData.name}</td>
      <td>${formData.position}</td>
      <td>${formData.office}</td>
      <td>${formData.age}</td>
      <td>${salary}</td>
    `);

    const tbodyForAddNewRow = table.querySelector('tbody');

    tbodyForAddNewRow.append(newRow);
  }
});

// ------- form validation ----------------

function formValidate(formData, notification) {
  notification.errors.length = 0;
  notification.typeOfNotification = 'success';
  notification.title = 'Success!';

  if (formData.name.length === 0
    || formData.position.length === 0
    || formData.age.length === 0
    || formData.salary.length === 0) {
    notification.errors.push(
      `All fields are required!</br>
       Please fill out the form completely.`
    );

    notification.typeOfNotification = 'warning';
    notification.title = 'Warning!';

    return;
  }

  if (formData.name.length < 4) {
    notification.errors.push(
      `The name must contain more than 4 letters!</br>
      You entered <strong>${formData.name.length}</strong>.`
    );
  }

  if (formData.age < 18 || formData.age > 90) {
    notification.errors.push(
      `Age must be between 18 and 90!</br>
      You entered <strong>${formData.age}</strong>.`
    );
  }

  if (notification.errors.length > 0) {
    notification.typeOfNotification = 'error';
    notification.title = 'Error!';
  }
}

// ------- table editing ----------------

table.addEventListener('dblclick', (e) => {
  const cell = e.target;

  const cellTag = cell.parentElement.parentElement.tagName;

  if (cellTag === 'THEAD' || cellTag === 'TFOOT') {
    return;
  }

  const innerText = cell.firstChild;

  let newText = '';

  innerText.remove();

  const input = document.createElement('input');

  input.classList.add('cell-input');

  input.addEventListener('input', (ev) => {
    newText = ev.target.value;
  });

  input.onmouseout = () => {
    if (newText.length === 0) {
      newText = innerText;
    }

    cell.append(newText);
    input.remove();
  };

  input.addEventListener('keydown', (even) => {
    if (even.code === 'Enter') {
      if (newText.length === 0) {
        newText = innerText;
      }

      cell.append(newText);
      input.remove();
    }
  });

  cell.append(input);
});

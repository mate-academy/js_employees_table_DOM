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

// ------- create notifications----------------

function createNotification() {
  if (document.querySelector('.notification')) {
    document.querySelector('.notification').remove();
  }

  const notification = {
    errors: [],
    typeOfNotification: 'success',
    title: 'Success!',
    notificationBlock: document.createElement('div'),
  };

  notification.notificationBlock.classList.add(
    'notification',
  );

  notification.notificationBlock.setAttribute('data-qa', 'notification');

  document.body.append(notification.notificationBlock);

  return notification;
}

// ------- data validation ----------------

function dataValidation(data, notification) {
  for (const field in data) {
    if (field === 'name') {
      if (data[field].length < 4) {
        notification.errors.push(
          `The name must contain more than 4 letters!</br>
          You entered <strong>${data[field].length}</strong>.`
        );
      }

      if (/[0-9]/.test(data[field])) {
        notification.errors.push(
          `Name can't contain numbers!</br>
          You entered <strong>${data[field]}</strong>.`
        );
      }
    }

    if (field === 'position') {
      if (/[0-9]/.test(data[field])) {
        notification.errors.push(
          `Name can't contain numbers!</br>
          You entered <strong>${data[field]}</strong>.`
        );
      }
    }

    if (field === 'age') {
      if (data[field] < 18 || data[field] > 90) {
        notification.errors.push(
          `Age must be between 18 and 90!</br>
          You entered <strong>${data[field]}</strong>.`
        );
      }

      if (!+data[field]) {
        notification.errors.push(
          `Age must be a number!</br>
          You entered <strong>${data[field]}</strong>.`
        );
      }
    }

    if (field === 'salary') {
      data[field] = data[field].replace(',', '.');

      if (data[field][0] === '$') {
        data[field] = +data[field].slice(1);
      }

      if (!+data[field]) {
        notification.errors.push(
          `Salary must be a number!</br>
          You entered <strong>${data[field]}</strong>.`
        );
      }

      data[field] = '$' + (+data[field]).toFixed(3).replace('.', ',');
    }
  }
}

// ------- form validation ----------------

function formValidate(formData, notification) {
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

  dataValidation(formData, notification);

  if (notification.errors.length > 0) {
    notification.typeOfNotification = 'error';
    notification.title = 'Error!';
  }
}

// ------- form actions ----------------

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const formData = Object.fromEntries(data.entries());

  const notification = createNotification();
  const notificationBlock = notification.notificationBlock;

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
    notification.typeOfNotification
  );

  notificationBlock.insertAdjacentHTML('afterbegin',
    `<h2 class="title">${notification.title}</h2>`
  );

  if (notification.errors.length === 0) {
    const newRow = document.createElement('tr');

    newRow.insertAdjacentHTML('afterbegin', `
      <td>${formData.name}</td>
      <td>${formData.position}</td>
      <td>${formData.office}</td>
      <td>${formData.age}</td>
      <td>${formData.salary}</td>
    `);

    const tbodyForAddNewRow = table.querySelector('tbody');

    tbodyForAddNewRow.append(newRow);
  }
});

// ------- editing the table ----------------

function cellEdit(enteredValue, innerText, fieldIndex) {
  if (enteredValue.length === 0) {
    return innerText;
  }

  if (enteredValue.trim().length === 0) {
    /* eslint-disable-next-line */
    const notification = createNotification();

    notification.notificationBlock.classList.add('error');

    notification.notificationBlock.insertAdjacentHTML('beforeend',
      `<h2 class="title">Error!</h2>
     Cell can't be empty.
    `);

    return innerText;
  }

  const fieldContent = {};

  switch (fieldIndex) {
    case 0 :
      fieldContent.name = enteredValue;
      break;

    case 1 :
      fieldContent.position = enteredValue;
      break;

    case 3 :
      fieldContent.age = enteredValue;
      break;

    case 4 :
      fieldContent.salary = enteredValue;
  }

  const notification = createNotification();

  dataValidation(fieldContent, notification);

  if (notification.errors.length > 0) {
    notification.typeOfNotification = 'error';
    notification.title = 'Error!';

    const p = document.createElement('p');

    p.insertAdjacentHTML('beforeend',
      `${notification.errors[0]}`);

    notification.notificationBlock.append(p);

    notification.notificationBlock.classList.add(
      notification.typeOfNotification
    );

    notification.notificationBlock.insertAdjacentHTML('afterbegin',
      `<h2 class="title">${notification.title}</h2>`
    );

    return innerText;
  }

  document.querySelector('.notification').remove();

  return Object.values(fieldContent);
}

table.addEventListener('click', (e) => {
  const select = table.querySelector('[name="office"]');

  if (select && e.target !== select) {
    select.parentElement.textContent = select.value;
    select.remove();
  }
});

table.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (table.querySelector('[name="office"]')) {
    return;
  }

  const cellText = cell.textContent;

  const cellTag = cell.parentElement.parentElement.tagName;

  if (cellTag === 'THEAD' || cellTag === 'TFOOT') {
    return;
  }

  const fieldIndex = [...cell.parentElement.querySelectorAll('td')]
    .findIndex(i => i === cell);

  const innerText = cell.firstChild;

  innerText.remove();

  let newText = '';

  if (fieldIndex === 2) {
    cell.innerText = '';

    cell.insertAdjacentHTML('beforeend', `
    <select name="office" type="text"
    style="box-sizing: border-box; border: none; border-radius: 4px;
    color: #808080; padding: 0; background: none;
    font-family: sans-serif; font-size: 16px; outline: none;">
          <option value='${cellText}'>${cellText}</option>
          <option value='Tokyo'>Tokyo</option>
          <option value='Singapore'>Singapore</option>
          <option value='London'>London</option>
          <option value='New York'>New York</option>
          <option value='Edinburgh'>Edinburgh</option>
          <option value='San Francisco'>San Francisco</option>
    </select>
  `);

    const officeSelect = document.querySelector('[name="office"]');

    officeSelect.onblur = () => {
      newText = officeSelect.value;

      cell.textContent = newText;
      officeSelect.remove();
    };

    officeSelect.addEventListener('keydown', (even) => {
      if (even.code === 'Enter') {
        officeSelect.blur();
      }
    });
  } else {
    const input = document.createElement('input');

    input.value = cellText;
    input.classList.add('cell-input');

    cell.append(input);
    input.focus();

    input.oninput = () => {
      newText = input.value;
    };

    input.onblur = () => {
      const resultedText = cellEdit(newText, cellText, fieldIndex);

      setTimeout(() => {
        if (document.querySelector('.notification')) {
          document.querySelector('.notification').remove();
        }
      }, 3000);

      cell.append(resultedText);

      input.remove();
    };

    input.addEventListener('keydown', (even) => {
      if (even.code === 'Enter') {
        input.blur();
      }
    });
  }
});

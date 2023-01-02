'use strict';

let initialData;
let officeData;
let entredChars;
let timerNotification;

const windowNotification = document.createElement('div');

const titleHead = document.getElementsByTagName('thead')[0];
const titleFoot = document.getElementsByTagName('tfoot')[0];
const bodyTable = document.getElementsByTagName('tbody')[0];

const body = document.getElementsByTagName('body')[0];

wrapTextToSpan(titleHead, 'th');
wrapTextToSpan(titleFoot, 'th');

const spanElements = document.getElementsByTagName('span');

for (const span of spanElements) {
  span.dataset.reverse = 'ASC';
}

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" method="get" action ="#">
    <label>
      Name:
        <input name="name" type="text"  data-qa="name" required >
    </label>
    <label>
      Position:
        <input name="position" type="text"  data-qa="position" required>
    </label>
    <label>
      Office:
        <select name="office" type="select" data-qa="office" >
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
    </label>
    <label>
      Age:
        <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary:
        <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit">
      Save to table
    </button>
`);

document.addEventListener('submit', inputForm);
document.addEventListener('click', sortHandler);
document.addEventListener('click', selectionRow);
bodyTable.addEventListener('dblclick', editTable);
bodyTable.addEventListener('dblclick', editColOffice);

function inputForm(e) {
  windowNotification.innerHTML = '';
  windowNotification.remove();

  e.preventDefault();

  const form = document.getElementsByTagName('form')[0];

  const data = new FormData(form);
  const note = Object.fromEntries(data.entries());

  let index = 0;
  const notification = [];

  for (const item in note) {
    notification.push(errorMessage(note[item], index));
    index++;
  }

  if (notification.filter((item) => !!item).length) {
    notificationWindow(notification, 'error', windowNotification);

    return;
  }

  const rows = bodyTable.getElementsByTagName('tr');

  for (const row of rows) {
    if (row.firstElementChild.textContent === note.name) {
      notificationWindow(
        ['This name = "' + note.name + '", alredy exist'],
        'warning',
        windowNotification);

      return;
    }
  }

  bodyTable.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${note.name}</td>
      <td>${note.position}</td>
      <td>${note.office}</td>
      <td>${+note.age}</td>
      <td>$${(+note.salary).toFixed(3).replace('.', ',')}</td>
    </tr>
  `);

  windowNotification.className = 'notification success';

  notificationWindow(['correct'], 'success', windowNotification);

  form.reset();
}

function editColOffice(e) {
  const selectElement = bodyTable.querySelector('select');

  if (selectElement) {
    selectElement.closest('td').textContent = officeData;
    selectElement.remove();
  }

  if (e.target.matches('td:nth-child(3)')) {
    officeData = e.target.textContent;
    officeChange(e.target);
  }
}

function editTable(e) {
  if (!e.target.matches('td') || e.target.matches('td:nth-child(3)')) {
    return;
  }

  windowNotification.innerHTML = '';
  windowNotification.remove();

  const textAreas = document.getElementsByTagName('textarea');

  // if the 'textarea' field already exists

  if (textAreas.length) {
    const editCell = textAreas[0].closest('td');
    const parrent = editCell.closest('tr');
    const notification = [];

    const indexColumn = [...parrent.children].indexOf(editCell);

    notification.push(errorMessage(entredChars, indexColumn));

    if (entredChars === '') { // when you didn't enter anything
      textAreas[0].remove();
      editCell.textContent = initialData;

      return;
    }

    if (notification.filter((item) => !!item).length) { // input Error
      notificationWindow(notification, 'error', windowNotification);
      textAreas[0].remove();
      editCell.textContent = initialData;

      return;
    }

    const rows = bodyTable.getElementsByTagName('tr');
    const dataRepeat = [...rows].some((item) =>
      item.firstElementChild.textContent === entredChars);

    if (!indexColumn && dataRepeat) { // name already exists
      notificationWindow(['This name = "' + entredChars + '", alredy exist'],
        'warning', windowNotification);
      textAreas[0].remove();
      editCell.textContent = initialData;

      return;
    }
    // OK. save the entered data
    notificationWindow(['correct'], 'success', windowNotification);
    textAreas[0].remove();

    indexColumn === 4
      ? editCell.textContent = `$${(+entredChars).toFixed(3).replace('.', ',')}`
      : editCell.textContent = entredChars;

    return;
  }

  initialData = e.target.textContent;

  e.target.textContent = '';

  const textarea = document.createElement('textarea');

  textarea.style.resize = 'none';
  textarea.style.lineHeight = getComputedStyle(e.target).fontSize;
  textarea.style.height = textarea.style.lineHeight;
  textarea.style.width = getComputedStyle(e.target).width;
  textarea.className = 'cell-input';

  textarea.addEventListener('keyup', (eventKey) => {
    if (eventKey.key === 'Enter') {
      if (eventKey.target.scrollTop > 0) {
        eventKey.target.style.height = eventKey.target.scrollHeight + 'px';
      }
      entredChars = textarea.value.replace('\n', '').trim(' ');
      editTable(e);
    }
  });

  e.target.append(textarea);
  textarea.focus();
}

function notificationWindow(array, typeMessage, windowMessage) {
  windowMessage.remove();
  clearTimeout(timerNotification);
  windowMessage.className = '';

  windowMessage.style.top = windowMessage.getBoundingClientRect().top
    + window.pageYOffset + 'px';
  windowMessage.classList.add('notification');
  windowMessage.classList.add(typeMessage);
  windowMessage.dataset.qa = 'notification';

  windowMessage.insertAdjacentHTML('beforeend', `
    <div class="title" style="margin-bottom: 10px;">
     ${typeMessage[0].toUpperCase() + typeMessage.slice(1)} Notification
      <button
        class="close"
        type="button"
        style="
          border-radius: 50%;
          float: right;
          margin-top: 5px;
          cursor: pointer;
      ">
        x
      </button>
    </div>
    ${array.map(text => `
      <div style="margin-bottom: 10px; font-style: italic">${text}</div>
    `).join('')}`
  );

  document.body.append(windowMessage);

  document.addEventListener('click', (e) => {
    if (!e.target.matches('.close')) {
      return;
    }
    windowMessage.remove();
    clearTimeout(timerNotification);
  });

  timerNotification = setTimeout(() => {
    windowMessage.remove();
  }, 8000);

  return windowMessage;
}

function selectionRow(e) {
  const row = e.target.parentElement;

  if (row.parentElement === bodyTable) {
    const rows = bodyTable.getElementsByTagName('tr');

    [...rows].forEach((item) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });

    row.classList.add('active');
  }
}

function sortHandler(e) {
  let sort = [];

  if (e.target.tagName === 'SPAN') {
    const flagReverse = e.target.dataset.reverse;

    switch (e.target.innerText) {
      case 'Name':
        sort = sortTable([...bodyTable.rows], 0, flagReverse);
        break;
      case 'Position':
        sort = sortTable([...bodyTable.rows], 1, flagReverse);
        break;
      case 'Office':
        sort = sortTable([...bodyTable.rows], 2, flagReverse);
        break;
      case 'Age':
        sort = sortTable([...bodyTable.rows], 3, flagReverse);
        break;
      case 'Salary':
        sort = sortTable([...bodyTable.rows], 4, flagReverse);
        break;
    }
    bodyTable.append(...sort);

    e.target.dataset.reverse === 'ASC'
      ? e.target.dataset.reverse = 'DESC'
      : e.target.dataset.reverse = 'ASC';
  }
}

function wrapTextToSpan(inBlock, nameTag) {
  [...inBlock.getElementsByTagName(nameTag)].forEach((item) => {
    const elementSpan = document.createElement('span');

    elementSpan.innerText = item.innerText;
    item.innerText = '';
    item.append(elementSpan);
  });
}

function sortTable(arrayRows, column, direction) {
  let reverse = 0;

  direction === 'DESC'
    ? reverse = 1
    : reverse = 0;

  switch (column) {
    case 0:
    case 1:
    case 2:
      return arrayRows.sort((a, b) => {
        let A = a.cells[column].textContent;
        let B = b.cells[column].textContent;

        if (reverse === 1) {
          const temp = B;

          B = A;
          A = temp;
        }

        return (A < B) ? -1 : (A > B) ? 1 : 0;
      });
    case 3:
      return arrayRows.sort((a, b) => {
        const A = +a.cells[column].textContent;
        const B = +b.cells[column].textContent;

        return reverse ? B - A : A - B;
      });
    case 4:
      return arrayRows.sort((a, b) => {
        const A = +a.children[column].textContent.slice(1).replace(',', '.');
        const B = +b.children[column].textContent.slice(1).replace(',', '.');

        return reverse ? B - A : A - B;
      });
  }
}

function officeChange(element) {
  element.textContent = '';

  element.insertAdjacentHTML('beforeend', `
        <select name="office" type="select" data-qa="office" >
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      `);

  element.addEventListener('change', () => {
    const text = element.firstElementChild.value;

    element.firstElementChild.remove();
    element.textContent = text;
  });
}

function errorMessage(data, indexColumn) {
  const regExp = /[^a-zA-Z ]/g;
  let notification;

  switch (indexColumn) {
    case 0:
      data.search(regExp) !== -1
        ? notification = 'Name must contain only letters and spaces'
        : data.length < 4
          ? notification = 'Name length must be greater than 4 characters'
          : notification = '';
      break;
    case 1:
      data.search(regExp) !== -1
        ? notification = 'Position must contain only letters and spaces'
        : notification = '';
      break;
    case 2:
      notification = '';
      break;
    case 3:
      (!+data
        ? notification = 'The age field must contain only numbers'
        : (data < 18 || data > 90)
          ? notification = `Age must be at least 18 years old
           and not more than 90 years old`
          : notification = ''
      );
      break;
    case 4:
      !+data
        ? notification = 'The salary field must contain only numbers'
        : notification = '';
      break;
  }

  return notification;
}

'use strict';

sortTable();
addSelectToTbodyRows();
addForm();
handleSubmit();

function addForm() {
  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  document.querySelector('body')
    .insertAdjacentHTML('beforeend', `
    <form class="new-employee-form" onsubmit="return false;">
        <label>Name: <input data-qa="name" name="name" type="text"></label>
        <label>Position:
          <input data-qa="position" name="position" type="text">
        </label>
        <label>Office:
          <select data-qa="office" name="office">
              ${offices.map(office => `<option>${office}</option>`)}
          </select>
        </label>
        <label>Age: <input data-qa="age" name="age" type="number"></label>
        <label>Salary:
            <input data-qa="salary" name="salary" type="number">
        </label>

        <button type="submit">Save to table</button>
    </form>
  `);
}

function handleSubmit() {
  document.querySelector('form')
    .addEventListener('submit', () => {
      const filledForm = document.forms[0];

      const nameValue = filledForm.name.value;
      const positionValue = filledForm.position.value;
      const officeValue = filledForm.office.value;
      const ageValue = +filledForm.age.value;
      const salaryValue = +filledForm.salary.value;

      if (validateFields(nameValue, positionValue, officeValue, ageValue)) {
        const trElement = document.createElement('tr');

        trElement.innerHTML = `
          <td>${nameValue}</td>
          <td>${positionValue}</td>
          <td>${officeValue}</td>
          <td>${ageValue}</td>
          <td>$${salaryValue.toLocaleString('en-US')}</td>
        `;

        for (const child of filledForm.children) {
          const input = child.querySelector('input');

          if (input !== null) {
            input.value = null;
          }
        }

        document.querySelector('tbody').appendChild(trElement);

        pushNotification(10, 10, 'Success!',
          'Your data added to table!', 'success');
      }
    });
}

function validateFields(nameValue, positionValue, officeValue, ageValue) {
  if (!(validateRequired(nameValue)
    && validateRequired(positionValue)
    && validateRequired(officeValue))) {
    pushNotification(10, 10, 'Error',
      'All fields are requaired!', 'error');

    return false;
  }

  if (nameValue.length < 4) {
    pushNotification(10, 10, 'Error',
      'Name length need be more then 4 symbols!', 'error');

    return false;
  }

  if (ageValue < 18 || ageValue > 60) {
    pushNotification(10, 10, 'Error',
      'Age need be more then 18 and less then 60!', 'error');

    return false;
  }

  return true;
}

function validateRequired(value) {
  return value !== null
    && value !== undefined
    && value !== '';
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  document.body.append(notification);
  notification.append(notificationTitle);
  notification.append(notificationDescription);

  notificationTitle.textContent = title;
  notificationTitle.classList.add('title');

  notificationDescription.textContent = description;
  notification.classList.add('notification', type);

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 1999);
}

function addSelectToTbodyRows() {
  const tbody = document.querySelector('tbody');

  tbody.addEventListener('click', evt => {
    for (const child of tbody.children) {
      child.classList.remove('active');
    }

    evt.target.parentNode.classList.add('active');
  });
}

function sortTable() {
  const theadRows = document.querySelector('thead tr');
  const tbodyElement = document.querySelector('tbody');

  let columnNumber;
  let isAscSorting = true;

  theadRows.addEventListener('click', e => {
    const trElements = [];

    for (let i = 0; i < theadRows.children.length; i++) {
      if (theadRows.children.item(i) === e.target) {
        if (columnNumber !== i) {
          isAscSorting = true;
        }

        columnNumber = i;
      }
    }

    for (const trChild of tbodyElement.children) {
      trElements.push(trChild);
    }

    trElements.sort((a, b) => {
      let aData = a.children[columnNumber].textContent;
      let bData = b.children[columnNumber].textContent;

      if (columnNumber === 4) {
        aData = aData.replace(/[$-,]/g, '');
        bData = bData.replace(/[$-,]/g, '');

        return aData - bData;
      }

      return aData.localeCompare(bData);
    });

    for (const child of trElements) {
      tbodyElement.removeChild(child);
    }

    if (!isAscSorting) {
      trElements.reverse();
    }

    for (const row of trElements) {
      tbodyElement.appendChild(row);
    }

    isAscSorting = !isAscSorting;
  });
}

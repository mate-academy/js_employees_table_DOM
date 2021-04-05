'use strict';

sortTable();
addSelectToTbodyRows();
addForm();
addDataFromFormToTable();

function addForm() {
  const body = document.querySelector('body');
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.setAttribute('action', '/');

  form.innerHTML = `
  <label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position:
    <input data-qa="position" name="position" type="text">
  </label>
  <label>Office:
    <select data-qa="office" name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number"></label>

  <button type="submit">Save to table</button>
  `;

  body.appendChild(form);
}

function addDataFromFormToTable() {
  const button = document.querySelector('form button');

  button.addEventListener('click', ev => {
    ev.preventDefault();

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
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  document.body.append(notification);
  notification.append(h2);
  notification.append(p);

  h2.textContent = title;
  h2.classList.add('title');

  p.textContent = description;

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

  let isAscSorting = true;

  theadRows.addEventListener('click', e => {
    const trElements = [];
    let columnNumber;

    for (let i = 0; i < theadRows.children.length; i++) {
      if (theadRows.children.item(i) === e.target) {
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

        return isAscSorting
          ? aData - bData
          : bData - aData;
      }

      return isAscSorting
        ? aData.localeCompare(bData)
        : bData.localeCompare(aData);
    });

    isAscSorting = !isAscSorting;

    for (const child of trElements) {
      tbodyElement.removeChild(child);
    }

    for (const trElement of trElements) {
      tbodyElement.appendChild(trElement);
    }
  });
}

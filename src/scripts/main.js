'use strict';

// write code here
const NOTIFICATIONS = {
  shortName: {
    title: 'Warning!',
    description: 'Name value has less than 4 letters',
    type: 'warning',
  },
  shortPosition: {
    title: 'Warning!',
    description: 'Name value has less than 4 letters',
    type: 'warning',
  },
  noOfficeSelected: {
    title: 'Warning!',
    description: 'Name value has less than 4 letters',
    type: 'warning',
  },
  lowAge: {
    title: 'Warning!',
    description: `Age can't be less then 18`,
    type: 'warning',
  },
  tooOld: {
    title: 'Warning!',
    description: `Age can't be greater then 90`,
    type: 'warning',
  },
  wrongSalary: {
    title: 'Error!',
    description: 'Incorrect salary value',
    type: 'error',
  },
  success: {
    title: 'Successfully added',
    description: 'New employee successfully added to the table',
    type: 'success',
  },
};

const CITIES = {
  tokyo: 'Tokyo',
  singapore: 'Singapore',
  london: 'London',
  newyork: 'New York',
  edinburgh: 'Edinburgh',
  sanfrancisco: 'San Francisco',
};

const body = document.querySelector('body');
const table = document.querySelector('table');
const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
let tr = [...tBody.querySelectorAll('tr')];
const form = document.createElement('form');
const button = document.createElement('button');

createForm();
tableSort();
RowSelecting();
addEmployeeAppending();
addTableEditing();

function createForm() {
  form.classList.add('new-employee-form');
  form.action = '/';
  form.method = 'GET';

  let selectCity = '';

  for (const city in CITIES) {
    selectCity += `
      <option value="${CITIES[city]}">${CITIES[city]}</option>
    `;
  }

  form.insertAdjacentHTML('afterbegin', `
    <label>Name:
      <input
        name="name"
        type="text"
      >
    </label>
    <label>Position:
      <input
        name="position"
        type="text"
      >
    </label>
    <label>Office:
      <select
        name="office"
      >
        ${selectCity}
      </select>
    </label>
    <label>Age:
      <input
        name="age"
        type="number"
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
      >
    </label>
  `);

  button.innerText = 'Save to table';
  button.type = 'submit';
  form.append(button);

  for (const el of form) {
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
      el.dataset.qa = el.name;
      el.required = true;
    }
  }

  body.append(form);
}

function tableSort() {
  let asc = false;

  tHead.addEventListener('click', headClickHandler);

  function headClickHandler(e) {
    const th = e.target.closest('th');

    if (!th || !tHead.contains(th)) {
      return;
    }

    asc = !asc;

    const indexCell = e.target.cellIndex;

    sortedList(indexCell);
  }

  function sortedList(indexCell) {
    const sorted = tr.sort((a, b) => {
      const sortA = a.cells[indexCell].innerText.replace(/\$|,/g, '');
      const sortB = b.cells[indexCell].innerText.replace(/\$|,/g, '');

      if (asc) {
        if (isNaN(sortA)) {
          return sortA.localeCompare(sortB);
        } else {
          return sortA - sortB;
        }
      } else {
        if (isNaN(sortB)) {
          return sortB.localeCompare(sortA);
        } else {
          return sortB - sortA;
        }
      }
    });

    tBody.append(...sorted);
  }
}

function RowSelecting() {
  tBody.addEventListener('click', selectRow);

  function selectRow(e) {
    [...tBody.rows].map(el => el.classList.remove('active'));
    e.target.parentNode.classList.add('active');
  }
}

function addEmployeeAppending() {
  function pushNotification(title, description, type) {
    const notificationBlock = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const notifications = document.querySelectorAll('.notification');

    if (notifications.length > 0) {
      notifications[0].remove();
    }

    notificationBlock.classList.add('notification', type);
    h2.classList.add('title');
    h2.innerText = title;
    p.innerText = description;
    notificationBlock.append(h2, p);
    body.append(notificationBlock);

    setTimeout(() => notificationBlock.remove(), 3000);
  }

  function validateForm() {
    switch (true) {
      case (form.name.value.length < 3):
        pushNotification(
          NOTIFICATIONS.shortName.title,
          NOTIFICATIONS.shortName.description,
          NOTIFICATIONS.shortName.type
        );

        return false;
      case (form.position.value.length < 4 || !isNaN(+form.position.value)):
        pushNotification(
          NOTIFICATIONS.shortPosition.title,
          NOTIFICATIONS.shortPosition.description,
          NOTIFICATIONS.shortPosition.type
        );

        return false;
      case (!form.office.value):
        pushNotification(
          NOTIFICATIONS.noOfficeSelected.title,
          NOTIFICATIONS.noOfficeSelected.description,
          NOTIFICATIONS.noOfficeSelected.type
        );

        return false;
      case (form.age.value < 18):
        pushNotification(
          NOTIFICATIONS.lowAge.title,
          NOTIFICATIONS.lowAge.description,
          NOTIFICATIONS.lowAge.type
        );

        return false;
      case (form.age.value > 90):
        pushNotification(
          NOTIFICATIONS.tooOld.title,
          NOTIFICATIONS.tooOld.description,
          NOTIFICATIONS.tooOld.type
        );

        return false;
      case (+form.salary.value === 0):
        pushNotification(
          NOTIFICATIONS.wrongSalary.title,
          NOTIFICATIONS.wrongSalary.description,
          NOTIFICATIONS.wrongSalary.type
        );

        return false;
      default:
        pushNotification(
          NOTIFICATIONS.success.title,
          NOTIFICATIONS.success.description,
          NOTIFICATIONS.success.type
        );

        return true;
    }
  }

  function addNewEmployee() {
    const employee = document.createElement('tr');

    employee.insertAdjacentHTML('afterbegin', `
    <td>${form.name.value}</td>
    <td>${form.position.value}</td>
    <td>${form.office.value}</td>
    <td>${form.age.value}</td>
    <td>$${(+form.salary.value).toLocaleString('en-US')}</td>
  `);
    tBody.append(employee);
    tr = [...tBody.querySelectorAll('tr')];
  }

  function submitForm(e) {
    e.preventDefault();

    const newForm = e.target;

    if (!validateForm(newForm)) {
      return;
    }

    addNewEmployee(newForm);
    newForm.reset();
  }
  form.addEventListener('submit', submitForm);
}

function addTableEditing() {
  function saveValue(td, input, defaultValue, headName) {
    switch (true) {
      case !input.value:
      case defaultValue.length === 2 && isNaN(+input.value):
      case defaultValue.length === 2
        && (+input.value < 18 || +input.value > 90):
      case isNaN(+defaultValue.replace(/(^\$)|,/g, ''))
      && input.value.length < 4:
      case !isNaN(+defaultValue.replace(/(^\$)|,/g, ''))
      && isNaN(+input.value.replace(/(^\$)|,/g, '')):
      case isNaN(+defaultValue.replace(/(^\$)|,/g, ''))
      && !isNaN(+input.value.replace(/(^\$)|,/g, '')):
        td.textContent = defaultValue;
        break;
      case (headName === 'Salary'):
        td.textContent = input.value.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        break;

      default:
        td.textContent = input.value;
    }
  }

  function handleCellEditing(e) {
    const td = e.target;
    const defaultValue = td.textContent;
    const headName = table.rows[0].cells[td.cellIndex].textContent;

    let oldData;
    let input;

    if (headName === 'Office') {
      input = document.createElement('select');

      oldData = td.innerHTML;
      td.innerHTML = '';

      input.insertAdjacentHTML('afterbegin', `
      <select data-qa="office" name="office">
        <option value = "Tokyo">Tokyo</option>
        <option value = "Singapore">Singapore</option>
        <option value = "London">London</option>
        <option value = "New York">New York</option>
        <option value = "Edinburgh">Edinburgh</option>
        <option value = "San Francisco">San Francisco</option>
      </select>
    `);
      input.style.width = window.getComputedStyle(e.target).width;
      input.classList.add('cell-input');
      input.value = oldData;
      td.append(input);
      input.focus();
    } else {
      input = document.createElement('input');

      input.style.width = window.getComputedStyle(e.target).width;
      oldData = td.innerHTML;
      input.classList.add('cell-input');
      td.innerHTML = '';
      input.value = oldData;
      td.append(input);
      input.focus();
    }

    input.addEventListener('blur', () =>
      saveValue(td, input, defaultValue, headName));

    input.addEventListener('keydown', (ev) => {
      if (ev.code === 'Enter') {
        saveValue(td, input, defaultValue, headName);
      }
    });
  }
  tBody.addEventListener('dblclick', handleCellEditing);
}

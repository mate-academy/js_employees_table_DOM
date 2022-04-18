'use strict';

// Create new form
document.body.insertAdjacentHTML('beforeend',
  `
    <form class ="new-employee-form">
      <label>Name:
        <input
          name="name"
          type="text"
          data-qa="name"
          required
        >
      </label>
      <label>Position:
        <input
          name="position"
          type="text"
          data-qa="position"
          required
          >
      </label>
      <label>Office:
        <select name="office" data-qa="office" required>
          <option value = "Tokyo">Tokyo</option>
          <option value = "Singapore">Singapore</option>
          <option value = "London">London</option>
          <option value = "New York">New York</option>
          <option value = "Edinburgh">Edinburgh</option>
          <option value = "San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age:
        <input
          name="age"
          type="number"
          data-qa="age"
          required
         >
      </label>
      <label>Salary:
        <input
          name="salary"
          type="number"
          data-qa="salary"
          required
         >
      </label>
      <button type="submit">Save to table</button>
    </form>
  `
);

// Find elements
const body = document.querySelector('tbody');
const form = document.querySelector('form');

// Functions
const getNum = (str, isSalary) =>
  isSalary ? Number(str.slice(1).split(',').join('')) : Number(str);

function sortTable(e) {
  const rows = [...body.querySelectorAll('tr')];
  const th = e.target;

  if (th.nodeName !== 'TH') {
    return;
  }

  const i = th.cellIndex;
  const headerName = th.textContent;
  let sortedRows;

  if (!th.classList.contains('sorted')) {
    if (['Name', 'Position', 'Office'].includes(headerName)) {
      sortedRows = rows.sort((a, b) => {
        const elementA = a.cells[i].textContent;
        const elementB = b.cells[i].textContent;

        return elementA.localeCompare(elementB);
      });
    }

    if (['Age', 'Salary'].includes(headerName)) {
      const isSalary = headerName === 'Salary';

      sortedRows = rows.sort(
        (a, b) => {
          const elementA = getNum(a.cells[i].textContent, isSalary);
          const elementB = getNum(b.cells[i].textContent, isSalary);

          return elementA - elementB;
        });
    }
  } else {
    if (['Name', 'Position', 'Office'].includes(headerName)) {
      sortedRows = rows.sort((a, b) => {
        const elementA = a.cells[i].textContent;
        const elementB = b.cells[i].textContent;

        return elementB.localeCompare(elementA);
      });
    }

    if (['Age', 'Salary'].includes(headerName)) {
      const isSalary = headerName === 'Salary';

      sortedRows = rows.sort(
        (a, b) => {
          const elementA = getNum(a.cells[i].textContent, isSalary);
          const elementB = getNum(b.cells[i].textContent, isSalary);

          return elementB - elementA;
        });
    }
  }

  th.classList.toggle('sorted');

  body.append(...sortedRows);
}

const selectRow = e => {
  const rows = [...body.querySelectorAll('tr')];
  const row = e.target.closest('tr');
  const rowSelectedIndex = rows.findIndex(
    r => r.classList.contains('active'));

  const newSelectedRow = rows.findIndex(r => r === row);

  if (!row) {
    return;
  }

  if (rowSelectedIndex >= 0 && rowSelectedIndex !== newSelectedRow) {
    rows[rowSelectedIndex].classList = [];
  }

  row.classList.toggle('active');
};

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.classList = `notification ${type}`;
  notification.dataset.qa = 'notification';
  notification.style.top = '15px';
  notification.style.right = '15px';
  notification.style.zIndex = 1;

  notification.innerHTML = `
    <h2 class="title">
    ${title}
    </h2>
    <p>
    ${description}
    </p>
  `;

  body.append(notification);

  setTimeout(() => notification.remove(), 200000);
};

const submitForm = e => {
  e.preventDefault();

  const formData = new FormData(form);
  const newRow = document.createElement('tr');

  const dataObj = Object.fromEntries(formData.entries());
  const dataArr = Object.values(dataObj);

  if (dataObj.name.length < 4) {
    return pushNotification(
      'Invalid Name',
      'Name can`t be less than 4 letters',
      'error'
    );
  }

  if (+dataObj.age < 18 || +dataObj.age > 90) {
    return pushNotification(
      'Invalid Age',
      'You can`t add employee to table if\n'
      + 'he is younger than 18 or older than 90',
      'error'
    );
  }

  for (let i = 0; i < dataArr.length; i++) {
    const td = document.createElement('td');

    if (!isNaN(dataArr[i])) {
      td.textContent = i === 3
        ? dataArr[i]
        : `$${Number(dataArr[i]).toLocaleString('en-US')}`;
    } else {
      td.textContent = dataArr[i];
    }

    newRow.append(td);
  }

  body.append(newRow);
  form.reset();

  pushNotification(
    'Success',
    'You have successfully added new employee',
    'success'
  );
};

const changeCellHandler = (newInput, td, prevText) => {
  if (!newInput.value) {
    newInput.remove();
    td.textContent = prevText;
  }

  const index = td.cellIndex;

  switch (index) {
    case 0:
      if (newInput.value.length < 4) {
        td.textContent = prevText;
        newInput.remove();

        return pushNotification(
          'Invalid Name',
          'Name can`t be less than 4 letters',
          'error'
        );
      } else {
        td.textContent = newInput.value;
        newInput.remove();

        return pushNotification(
          'Success',
          'You have successfully changed employee`s name',
          'success'
        );
      }

    case 3:
      if (+newInput.value < 18 || +newInput.value > 90) {
        td.textContent = prevText;
        newInput.remove();

        return pushNotification(
          'Invalid Age',
          'You can`t add employee to table if\n'
          + 'he is younger than 18 or older than 90',
          'error'
        );
      } else {
        td.textContent = newInput.value;
        newInput.remove();

        return pushNotification(
          'Success',
          'You have successfully changed employee`s age',
          'success'
        );
      }

    case 4:
      const include$ = newInput.value.split('').includes('$');
      const num = include$
        ? newInput.value.slice(1).split(',').join('')
        : newInput.value;

      if (isNaN(num)) {
        td.textContent = prevText;
        newInput.remove();

        return pushNotification(
          'Invalid Salary',
          'You should add only integers',
          'error'
        );
      } else {
        td.textContent = `$${
          parseInt(num).toLocaleString('en-US')}`;
        newInput.remove();

        return pushNotification(
          'Success',
          'You have successfully changed employee`s salary',
          'success'
        );
      }

    default:
      if (!newInput.value) {
        td.textContent = prevText;
      } else {
        td.textContent = newInput.value;
        newInput.remove();

        return pushNotification(
          'Success',
          'You have successfully changed this field',
          'success'
        );
      }
  }
};

// Events
document.addEventListener('click', sortTable);

body.addEventListener('click', selectRow);

body.addEventListener('dblclick', e => {
  const td = e.target.closest('td');
  const prevText = td.textContent;

  if (!td) {
    return;
  }

  const newInput = document.createElement('input');

  newInput.classList = 'cell-input';
  newInput.name = 'text';
  newInput.type = 'text';
  newInput.value = prevText;
  td.textContent = null;

  td.append(newInput);
  newInput.focus();

  newInput.addEventListener('blur',
    () => changeCellHandler(newInput, td, prevText));

  newInput.addEventListener('keydown', action => {
    if (action.code !== 'Enter') {
      return;
    }

    changeCellHandler(newInput, td, prevText);
  });
});

form.addEventListener('submit', submitForm);

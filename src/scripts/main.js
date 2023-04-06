'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const tableRows = tableBody.rows;
let toggle = true;
let special;

function getSalaryValue(str) {
  return +str.replace(/[,$]/g, '');
};

tableHead.addEventListener('click', e => {
  const index = e.target.cellIndex;

  const sortedTable = [...tableRows].sort((a, b) => {
    const cellA = a.cells[index].innerHTML;
    const cellB = b.cells[index].innerHTML;

    if (cellA.includes('$')) {
      return (getSalaryValue(cellA) - getSalaryValue(cellB));
    }

    return cellA.localeCompare(cellB);
  });

  if (!toggle) {
    sortedTable.reverse();
  }

  toggle = !toggle;

  tableBody.append(...sortedTable);
});

tableBody.addEventListener('click', e => {
  if (special) {
    special.classList.remove('active');
  }

  special = e.target.parentElement;
  e.target.parentElement.classList.add('active');
});

document.body.insertAdjacentHTML('beforeend', `
  <form
    action="/"
    method="get"
    class="new-employee-form"
  >
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        minlength="4"
        required
      >
    </label>
    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>
    <label for="office">
      Office:
      <select
        id="office"
        data-qa="office"
        required
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
        min="18"
        max="90"
      >
    </label>
    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
    </label>
    <button type="submit"> Save to table </button>
  </form>
`);

const form = document.forms[0];
const officeList = form.querySelector('[data-qa="office"]');

function createRow() {
  const nameCell = form.name.value;
  const positionCell = form.position.value;
  const officeCell = officeList.value;
  const ageCell = form.age.value;
  const salary = parseFloat(form.salary.value);
  const salaryCell = salary.toLocaleString('en-US');

  tableBody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${nameCell}</td>
    <td>${positionCell}</td>
    <td>${officeCell}</td>
    <td>${ageCell}</td>
    <td>$${salaryCell}</td>
  </tr>
  `);
};

function showNotification(type, title, text) {
  form.insertAdjacentHTML('afterend', `
    <div class="notification" data-qa="notification">
      <h1 class="title">${title.toUpperCase()}</h1>
      <p>${text}</p>
    </div>
  `);

  const notification = document.querySelector('.notification');

  notification.classList.add(type);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.name.addEventListener('change', e => {
  if (!form.name.validity.valid || !form.name.value.trim()) {
    showNotification(
      'error',
      'Incorrect name',
      'Name length should be at least 4 letters'
    );
  }
});

form.age.addEventListener('change', e => {
  if (!form.age.validity.valid) {
    showNotification(
      'error',
      'Enter a correct age',
      'Your age must be from 18 to 90 years'
    );
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (form.name.value.trim()) {
    createRow();

    showNotification(
      'success',
      'Successful!',
      'New employee is successfully added to the table'
    );
  }

  e.target.reset();
});

const minNameLength = 4;
const minAgeLength = 18;
const maxAgeLegth = 90;

const validScheme = {
  name: item => item.length > minNameLength,
  age: item => item > minAgeLength || item < maxAgeLegth,
  salary: item => `$${item}`,
};

tableBody.addEventListener('dblclick', e => {
  const item = e.target;
  const itemIndex = item.cellIndex;
  const itemText = item.innerText;
  const itemTextNormalize = itemText.replace(/[,$]/g, '');
  const itemInput
    = form.querySelectorAll('[data-qa]')[itemIndex].cloneNode(true);

  itemInput.classList.add('cell-input');
  itemInput.value = itemTextNormalize;
  item.firstChild.replaceWith(itemInput);
  itemInput.focus();

  itemInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      itemInput.blur();
    }
  });

  itemInput.addEventListener('blur', () => {
    if (
      validScheme.name(itemInput.value)
      || validScheme.age(itemInput.value)
      || validScheme.salary(itemInput.value)
      || !itemInput.value.trim()
    ) {
      item.removeChild(itemInput);

      if (itemInput.value.toLowerCase() === itemInput.value.toUpperCase()
      && itemInput.value.length > 2) {
        const num = +itemInput.value;

        item.textContent = `$${num.toLocaleString('en-US')}`;
      } else {
        item.textContent = itemInput.value;
      }

      return;
    }

    item.removeChild(itemInput);
    item.textContent = itemText;
  });
});

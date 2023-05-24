'use strict';

const tableEl = document.querySelector('table');
const tHead = tableEl.querySelector('thead');

// Sort table by order
tHead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return false;
  }

  const order = setOrder(e.target);

  sortTable(e.target, tableEl, order);
});

// Set active row by click
tableEl.tBodies[0].addEventListener('click', (e) => {
  if (e.target.parentElement.tagName !== 'TR') {
    return false;
  }

  setActiveRow(tableEl, e);
});

// Editing cells
tableEl.tBodies[0].addEventListener('dblclick', (e) => {
  if (e.target.tagName !== 'TD') {
    return false;
  }

  editableCell(e.target);
});

function sortTable(element, table, order) {
  // Get index of sorting column
  const index = [...element.parentElement.children].indexOf(element);

  const rows = [...table.querySelectorAll('tbody > tr')];

  rows.sort((a, b) => {
    // If sorting values are numbers
    if (getNumber(a.children[index].innerText)) {
      return order === 'ASC'
        ? getNumber(a.children[index].innerText)
          - getNumber(b.children[index].innerText)
        : getNumber(b.children[index].innerText)
          - getNumber(a.children[index].innerText);
    }

    // If sorting values are strings
    if (a.children[index].innerText < b.children[index].innerText) {
      return order === 'ASC' ? -1 : 1;
    }

    if (a.children[index].innerText > b.children[index].innerText) {
      return order === 'ASC' ? 1 : -1;
    }

    return 0;
  });

  table.querySelector('tbody').append(...rows);
}

// Parse number from string
function getNumber(string) {
  return parseInt(string.replace(/\D/g, ''));
}

// Set sorting order flag
function setOrder(element) {
  if (!element.dataset.order) {
    element.dataset.order = 'ASC';
  } else {
    element.dataset.order === 'ASC'
      ? element.dataset.order = 'DESC'
      : element.dataset.order = 'ASC';
  }

  return element.dataset.order;
}

// Setting active row in table by click
function setActiveRow(table, clickEvent) {
  const rows = [...table.querySelectorAll('tbody > tr')];
  const activeRow = rows.find((row) => row.classList.contains('active'));

  if (!activeRow) {
    clickEvent.target.parentElement.classList.add('active');
  } else {
    activeRow.classList.remove('active');
    clickEvent.target.parentElement.classList.add('active');
  }
}

function addForm() {
  document.body.insertAdjacentHTML('beforeend', `
    <form class="new-employee-form">
      <label>Name: <input
                      name="name"
                      data-qa="name"
                      type="text"
                      required
                    >
      </label>
      <label>Position: <input
                          name="position"
                          data-qa="position"
                          type="text"
                          required
                        >
      </label>
      <label>Office: <select name="office" data-qa="office" required>
                      <option value="Tokyo">Tokyo</option>
                      <option value="London">Singapore</option>
                      <option value="New York">New York</option>
                      <option value="Edinburgh">Edinburgh</option>
                      <option value="San Francisco">San Francisco</option>
                    </select>
      </label>
      <label>Age: <input
                    name="age"
                    data-qa="age"
                    type="number"
                    required
                  >
      </label>
      <label>Salary: <input
                        name="salary"
                        data-qa="salary"
                        type="number"
                        required
                      >
      </label>
      <button
        id="submit-btn"
        type = "submit"
      >
        Save to table
      </button>
    </form>
  `);
}

addForm();

const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit-btn');

submitBtn.addEventListener('click', (e) => {
  addRow(form, tableEl, e);
});

function formatNumber(number) {
  let formattedNumber = Number(number).toLocaleString('en-US');

  formattedNumber = '$' + formattedNumber;

  return formattedNumber;
}

function addRow(formElement, tableElement, submitEvent) {
  const data = Object.fromEntries(new FormData(formElement).entries());

  if (!validateForm(data)) {
    pushNotification(500, 10, 'Error!',
      'Something went wrong\n '
      + 'Check the form!', 'error');

    submitEvent.preventDefault();

    return false;
  };

  tableElement.tBodies[0].insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.office}</td>
      <td>${data.age}</td>
      <td>${formatNumber(data.salary)}</td>
    </tr>
  `);
  submitEvent.preventDefault();
  form.reset();

  pushNotification(500, 10, 'Success!',
    'Good!\n '
    + 'Employee has been added!', 'success');
}

function validateForm(formData) {
  if (formData.name.length < 4) {
    return false;
  }

  if (!formData.position) {
    return false;
  }

  if (+formData.age < 18 || +formData.age > 90) {
    return false;
  }

  return true;
}

function pushNotification(posTop, posRight, title, description, type = '') {
  const notificationEl = document.createElement('div');

  notificationEl.className = `notification ${type}`;
  notificationEl.dataset.qa = 'notification';
  notificationEl.style.top = `${posTop}px`;
  notificationEl.style.right = `${posRight}px`;

  notificationEl.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notificationEl);

  setTimeout(() => notificationEl.remove(), 2000);
};

function editableCell(cellElement) {
  let text = cellElement.textContent.trim();

  let isAmount = false;

  if (text[0] === '$') {
    isAmount = true;
    text = parseInt(text.replace(/\D/g, ''));
  }

  cellElement.textContent = null;

  cellElement.insertAdjacentHTML('beforeend', `
    <input class = "cell-input" value = "${text}">
    </input>
  `);

  const input = document.querySelector('.cell-input');

  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  input.addEventListener('blur', () => {
    if (!input.value) {
      input.value = text;
    }

    setCellValue(input, isAmount);
  });

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      if (!input.value) {
        input.value = text;
      }

      setCellValue(input, isAmount);
    }
  });

  function setCellValue(inputElement, isAmountValue = false) {
    inputElement.parentElement.innerHTML = isAmount
      ? `$${Number(input.value.trim()).toLocaleString('en-US')}`
      : input.value.trim();
  }
}

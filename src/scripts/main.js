'use strict';

// write code here

const table = document.querySelector('table');
const headers = table.querySelector('thead');
const tbody = table.querySelector('tbody');
let isSorted = true;
let preventActive;
let lastSortedId;

document.addEventListener('DOMContentLoaded', () => {
  headers.addEventListener('click', (e) => {
    if (!table || !headers || !tbody) {
      return;
    }

    const col = e.target.closest('th');

    if (!col) {
      return;
    }

    const rows = [...tbody.rows];

    const id = col.cellIndex;

    if (lastSortedId !== id) {
      isSorted = true;
    }

    const sortedRows = rows.sort((a, b) => {
      const astr = a.cells[id].textContent.replace(/[^\d.-]/g, '');
      const bstr = b.cells[id].textContent.replace(/[^\d.-]/g, '');

      if (astr.length > 0 && bstr.length > 0) {
        if (isSorted) {
          return +astr - +bstr;
        }

        return +bstr - +astr;
      }

      if (astr.length === 0 || bstr.length === 0) {
        if (isSorted) {
          return a.cells[id].textContent.localeCompare(b.cells[id].textContent);
        }

        return b.cells[id].textContent.localeCompare(a.cells[id].textContent);
      }
    });

    isSorted = !isSorted;
    lastSortedId = id;

    tbody.append(...sortedRows);
  });

  tbody.addEventListener('click', (e) => {
    if (!table || !headers || !tbody) {
      return;
    }

    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    if (preventActive) {
      preventActive.classList.remove('active');
    }

    preventActive = row;

    row.classList.add('active');
  });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    if (document.querySelector('.cell-input')) {
      return;
    }

    const input = document.createElement('input');

    input.classList.add('cell-input');

    const initValue = cell.textContent;

    input.value = initValue;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    function changeText(even) {
      if (even.target.value.length > 0) {
        cell.textContent = even.target.value;
      }

      if (even.target.value.length === 0) {
        cell.textContent = initValue;
      }
    }

    input.addEventListener('blur', changeText);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        changeText(ev);
      }
    });
  });

  // #region form
  const form = document.createElement('form');
  const formSelect = document.createElement('select');

  form.noValidate = true;

  formSelect.dataset.qa = 'office';

  const options = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ];

  options.forEach((opt) => {
    const option = document.createElement('option');

    option.textContent = opt;

    formSelect.appendChild(option);
  });

  const inputs = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      qa: 'name',
    },
    {
      label: 'Position',
      name: 'position',
      type: 'text',
      qa: 'position',
    },
    {
      label: 'Age',
      name: 'age',
      type: 'number',
      qa: 'age',
    },
    {
      label: 'Salary',
      name: 'salary',
      type: 'number',
      qa: 'salary',
    },
  ];

  inputs.forEach(({ label: text, name: inputName, type, qa }) => {
    const label = document.createElement('label');

    label.textContent = text + ': ';

    const input = document.createElement('input');

    input.name = inputName;
    input.type = type;
    input.dataset.qa = qa;
    input.required = true;

    label.appendChild(input);
    form.appendChild(label);
  });

  const button = document.createElement('button');

  button.type = 'submit';

  button.textContent = `Save to table`;

  form.classList.add('new-employee-form');
  form.appendChild(formSelect);
  form.appendChild(button);

  document.body.appendChild(form);

  // Сповіщення

  function showNotification({ type, title, text }) {
    const oldNotification = document.querySelector('[data-qa="notification"]');

    if (oldNotification) {
      oldNotification.remove();
    }

    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.dataset.qa = 'notification';

    const heading = document.createElement('h2');

    heading.textContent = title;

    const paragraph = document.createElement('p');

    paragraph.textContent = text;

    notification.append(heading, paragraph);

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Валідація і відправка
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputName = form.querySelector("[name='name']");
    const inputPosition = form.querySelector("[name='position']");
    const select = form.querySelector('select');
    const inputAge = form.querySelector("[name='age']");
    const inputSalary = form.querySelector("[name='salary']");

    if (!inputPosition.value.trim()) {
      showNotification({
        type: 'error',
        title: 'Error',
        text: 'Position is required',
      });

      return;
    }

    if (inputSalary.value === '' || isNaN(Number(inputSalary.value))) {
      showNotification({
        type: 'error',
        title: 'Salary',
        text: 'Enter Salary',
      });

      return;
    }

    if (!select.value) {
      showNotification({
        type: 'error',
        title: 'Office',
        text: 'Please select an office',
      });

      return;
    }

    if (inputName.value.length < 4) {
      showNotification({
        type: 'error',
        title: 'Invalid name',
        text: 'Name must contain at least 4 characters',
      });

      return;
    }

    if (
      isNaN(Number(inputSalary.value.trim())) ||
      inputAge.value < 18 ||
      inputAge.value > 90
    ) {
      showNotification({
        type: 'error',
        title: 'Invalid age',
        text: 'Age must be between 18 and 90',
      });

      return;
    }

    const salaryF = '$' + Number(inputSalary.value).toLocaleString('en-US');

    const inputsValue = [
      inputName.value,
      inputPosition.value,
      select.value,
      inputAge.value,
      salaryF,
    ];

    const newRow = tbody.insertRow();

    for (let i = 0; i < tbody.rows[0].cells.length; i++) {
      const newCell = newRow.insertCell();

      newCell.textContent = inputsValue[i];
    }

    showNotification({
      type: 'success',
      title: 'Success',
      text: 'Employee successfully added',
    });

    form.reset();
  });

  // #endregion
});

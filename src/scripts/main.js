'use strict';

const table = document.querySelector('table');
let sortType = 'ASC';
let lastSortedTitle = null;
let editingCell = null;

document.querySelector('thead').addEventListener('click', (e) => {
  const headerTitles = [...table.tHead.rows[0].cells];
  const clickedTitle = headerTitles.find((el) => el === e.target);

  if (!clickedTitle) {
    return;
  }

  const index = headerTitles.indexOf(clickedTitle);
  const tbody = table.querySelector('tbody');
  const rows = [...tbody.rows];

  if (lastSortedTitle === index) {
    sortType = sortType === 'ASC' ? 'DESC' : 'ASC';
  } else {
    sortType = 'ASC';
    lastSortedTitle = index;
  }

  rows.sort((a, b) => {
    const cellA = a.cells[index].textContent.trim();
    const cellB = b.cells[index].textContent.trim();

    if (/\$/.test(cellA)) {
      const numA = parseFloat(cellA.replace(/[^\d.-]/g, ''));
      const numB = parseFloat(cellB.replace(/[^\d.-]/g, ''));

      return sortType === 'ASC' ? numA - numB : numB - numA;
    }

    return sortType === 'ASC'
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
});

document.querySelector('tbody').addEventListener('click', (e) => {
  [...table.querySelector('tbody').rows].forEach((row) => {
    if (row.contains(e.target)) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  });
});

(function addedEmployeeForm() {
  const form = document.createElement('form');
  const selectValues = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.classList.add('new-employee-form');

  const dataParam = [...table.tHead.rows[0].cells].map((el) => {
    return el.textContent.toLowerCase();
  });

  dataParam.forEach((el) => addNeededInput(el));

  const submitButton = document.createElement('button');

  submitButton.textContent = 'Save to table';
  submitButton.type = 'submit';
  form.appendChild(submitButton);

  document.body.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newEmployeeData = {};
    const formData = new FormData(form);

    formData.forEach((value, key) => {
      if (key === 'salary') {
        newEmployeeData[key] = `$${parseFloat(value).toLocaleString('en-US')}`;
      } else {
        newEmployeeData[key] = value;
      }
    });

    const message = validateEmployeeData();

    notification(message);

    if (message) {
      return;
    }

    const newRow = table.querySelector('tbody').insertRow();

    dataParam.forEach((param) => {
      const newCell = newRow.insertCell();

      newCell.textContent = newEmployeeData[param];
    });

    form.reset();

    function validateEmployeeData() {
      if (newEmployeeData.name.length < 4) {
        return 'Name value has less than 4 letters';
      }

      if (newEmployeeData.age < 18 || newEmployeeData.age > 90) {
        return 'Age value is less than 18 or more than 90';
      }

      return null;
    }
  });

  function addNeededInput(el) {
    let input;
    const label = document.createElement('label');

    label.textContent = `${el.charAt(0).toUpperCase() + el.slice(1)}: `;

    if (el === 'office') {
      input = document.createElement('select');

      selectValues.forEach((valueOfSelect) => {
        const option = document.createElement('option');

        option.value = valueOfSelect;
        option.textContent = valueOfSelect;
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');

      if (el === 'age' || el === 'salary') {
        input.type = 'number';
      } else {
        input.type = 'text';
      }
    }

    input.setAttribute('data-qa', el);
    input.name = el;
    input.required = true;

    label.appendChild(input);
    form.appendChild(label);
  }

  function notification(message) {
    const existingNotice = document.querySelector('.notification');

    if (existingNotice) {
      existingNotice.remove();
    }

    const notice = document.createElement('div');
    const title = document.createElement('h2');

    notice.classList.add('notification');
    notice.setAttribute('data-qa', 'notification');

    if (!message) {
      notice.classList.add('success');
      notice.textContent = 'A new employee is successfully added to the table';
      title.textContent = 'Success';
    } else {
      notice.classList.add('error');
      notice.textContent = message;
      title.textContent = 'Error';
    }
    notice.prepend(title);
    document.body.appendChild(notice);

    setTimeout(() => {
      notice.remove();
    }, 5000);
  }
})();

document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const targetCell = e.target;

  if (targetCell.tagName !== 'TD') {
    return;
  }

  if (editingCell && editingCell !== targetCell) {
    saveChanges(editingCell);
  }

  editingCell = targetCell;

  const initialValue = targetCell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;

  targetCell.textContent = '';
  targetCell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    saveChanges(targetCell);
  });

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      saveChanges(targetCell);
    }
  });

  function saveChanges(cell) {
    const newValue = cell.querySelector('input').value.trim();

    if (newValue === '') {
      cell.textContent = initialValue;
    } else {
      if (/\$/.test(initialValue)) {
        cell.textContent = `$${parseFloat(newValue).toLocaleString('en-US')}`;
      } else {
        cell.textContent = newValue;
      }
    }

    editingCell = null;
  }
});

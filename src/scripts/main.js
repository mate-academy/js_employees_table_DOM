'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const header = document.querySelector('thead');
let rows = [...tbody.querySelectorAll('tr')];
const theads = [...header.querySelectorAll('th')];

header.addEventListener('click', (e) => {
  const target = e.target.closest('th');
  const index = e.target.cellIndex;

  const sorting = function() {
    rows.sort((a, b) => {
      const aContent = a.cells[index].innerText;
      const bContent = b.cells[index].innerText;

      switch (index) {
        case 0:
        case 1:
        case 2:
          return aContent.localeCompare(bContent);

        case 3:
          return aContent - bContent;

        case 4:
          const toNum = item =>
            item.slice(1).split(',').join('');

          return toNum(aContent) - toNum(bContent);

        default:
      }
    });
  };

  if (!target.classList.contains('asc-sorted')) {
    target.classList.add('asc-sorted');

    theads.forEach(item => {
      if (item !== target) {
        item.classList.remove('asc-sorted');
      }
    });

    sorting();
  } else {
    rows.reverse();
    target.classList.remove('asc-sorted');
  }

  rows.forEach(item => {
    tbody.append(item);
  });
});

tbody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  for (const row of rows) {
    if (row !== target) {
      row.classList.remove('active');
    }
  }
  target.classList.toggle('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
table.after(form);

const categories = [...header.querySelectorAll('th')];

for (const category of categories) {
  const label = document.createElement('label');

  label.innerText = category.innerText + ':';
  form.append(label);
}

const labels = [...document.querySelectorAll('label')];

const locations = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

for (const label of labels) {
  const labelType = label.innerText.slice(0, -1).toLowerCase();

  if (labelType !== 'office') {
    const input = document.createElement('input');

    input.name = labelType;
    input.dataset.qa = labelType;
    input.required = true;
    label.append(input);

    switch (labelType) {
      case 'name':
      case 'position':
        input.type = 'text';
        break;

      case 'age':
      case 'salary':
        input.type = 'number';
        break;
    }
  } else {
    const select = document.createElement('select');

    locations.forEach(city => {
      const option = document.createElement('option');

      option.value = city;
      option.text = city;
      select.append(option);
    });

    select.name = labelType;
    select.dataset.qa = labelType;
    select.required = true;
    label.append(select);
  }
};

const button = document.createElement('button');

button.type = 'submit';
button.innerText = 'Save to table';
form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');

  const minNameLength = 4;
  const minAge = 18;
  const maxAge = 90;

  if (newName.length < minNameLength) {
    showNotification('warning', 'Name can not be less than 4 characters');

    return;
  };

  if (age < minAge || age > maxAge) {
    showNotification('error', 'Please enter correct age');

    return;
  };

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${newName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${parseFloat(salary).toLocaleString('en-US')}</td>
    </tr>
  `);

  rows = [...tbody.querySelectorAll('tr')];
  showNotification('success', 'New employee is added successfully');
  form.reset();
});

function showNotification(type, title) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('p');

  notificationTitle.className = 'title';
  notificationTitle.innerText = title;
  notification.append(notificationTitle);

  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

tbody.addEventListener('dblclick', (e) => {
  const changedCell = e.target.closest('td');
  const cellInput = document.createElement('input');

  cellInput.type = 'text';

  cellInput.classList.add('cell-input');

  const initialValue = changedCell.innerText;

  cellInput.value = initialValue;
  changedCell.innerText = '';
  changedCell.append(cellInput);
  cellInput.focus();

  function isEmpty() {
    if (cellInput.value === null || cellInput.value.trim().length === 0) {
      return true;
    }
  };

  function handleInput() {
    if (isEmpty()) {
      cellInput.value = initialValue;

      return;
    }
    changedCell.innerText = cellInput.value;
  };

  cellInput.onblur = function() {
    handleInput();
  };

  changedCell.addEventListener('keyup', (ev) => {
    if (ev.key === 'Enter' || ev.keyCode === 13) {
      handleInput();
    }
  });
});

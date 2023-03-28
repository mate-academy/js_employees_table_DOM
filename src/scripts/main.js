'use strict';

const body = document.querySelector('body');
const sortBy = document.querySelector('tr');
const tBody = document.querySelector('tbody');
const rows = tBody.querySelectorAll('tr');

body.insertAdjacentHTML('beforeend', `
<form class="new-employee-form">
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position:
  <input name="position" type="text" data-qa="position" required>
</label>
<label>Office:
  <select name="office" data-qa="office" required>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York/option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select></label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary:
<input name="salary" type="number" data-qa="salary" required>
</label>
<button type="submit">Save to table</button>
</form>
`);

const pushNotification = (title, description, type) => {
  body.insertAdjacentHTML('beforeend', `
<div class="notification ${type}" data-qa="notification">
<h2 class="title">
  ${title}
</h2>

<p>
  ${description}
</p>
</div>
`);

  const notif = document.querySelectorAll('.notification');

  setTimeout(() => {
    notif.forEach(message => message.remove());
  }, 3000);
};

const form = document.querySelector('form');
const button = form.querySelector('button');
const inputName = form.querySelector('input[data-qa="name"]');
const inputAge = form.querySelector('input[data-qa="age"]');
const inputPosition = form.querySelector('input[data-qa="position"]');
const inputSalary = form.querySelector('input[data-qa="salary"]');
const inputOffice = form.querySelector('select[data-qa="office"]');

form.addEventListener('submit', (e) => {
  e.preventDefault(); e.target.reset();
});

button.addEventListener('click', e => {
  if (inputName.value.length < 4
    || inputAge.value < 18
    || inputAge.value > 90) {
    pushNotification('Title of Error message',
      'Message example.\n '
      + 'Notification should contain title and description.', 'error');
  } else {
    pushNotification('Title of Success message',
      'Message example.\n '
      + 'Notification should contain title and description.', 'success');

    tBody.insertAdjacentHTML('beforeend', `
    <tr>
    <td>${inputName.value}</td>
    <td>${inputPosition.value}</td>
    <td>${inputOffice.value}</td>
    <td>${inputAge.value}</td>
    <td>$${inputSalary.value.slice(0, -3)},${inputSalary.value.slice(-3)}</td>
  </tr>
    `);
  }
});

function toNum(element) {
  return +element.innerText.slice(1).replaceAll(',', '');
}

function toNumAge(element) {
  return +element.innerText;
}

sortBy.addEventListener('click', e => {
  const columns = e.target.parentNode.children;

  [...columns].forEach((column, i) => {
    if (e.target.parentNode.children[i].innerText === e.target.innerText) {
      const parents = document.querySelector('tbody');
      const sort = parents.querySelectorAll('tr');
      let sorted;

      switch (e.target.parentNode.children[i].innerText) {
        case 'Salary':
          sort[0] === [...sort].sort((a, b) =>
            toNum(a.children[i]) - toNum(b.children[i]))[0]
            ? sorted = [...sort].sort((a, b) =>
              toNum(a.children[i]) - toNum(b.children[i])).reverse()
            : sorted = [...sort].sort((a, b) =>
              toNum(a.children[i]) - toNum(b.children[i]));
          break;

        case 'Age':
          sort[0] === [...sort].sort((a, b) =>
            toNumAge(a.children[i]) - toNumAge(b.children[i]))[0]
            ? sorted = [...sort].sort((a, b) =>
              toNumAge(a.children[i]) - toNumAge(b.children[i])).reverse()
            : sorted = [...sort].sort((a, b) =>
              toNumAge(a.children[i]) - toNumAge(b.children[i]));

          break;

        default:
          sort[0] === [...sort].sort((a, b) =>
            a.children[i].innerText.localeCompare(b.children[i].innerText))[0]
            ? sorted = [...sort].sort((a, b) =>
              a.children[i].innerText.localeCompare(b.children[i].innerText)
            ).reverse()
            : sorted = [...sort].sort((a, b) =>
              a.children[i].innerText.localeCompare(b.children[i].innerText));
      }

      parents.append(...sorted);
    }
  });
});

rows.forEach(row => {
  addEventListener('click', e => {
    row.classList.remove('active');

    if (e.target.parentNode.innerText === row.innerText) {
      row.classList.add('active');
    }
  });
});

let isEditing = false;
let cell;
let previousTextContent = '';
const input = document.createElement('input');

tBody.addEventListener('dblclick', (e) => {
  if (!isEditing && e.target.tagName === 'TD') {
    isEditing = true;
    cell = e.target;
    previousTextContent = cell.textContent;
    input.classList = 'cell-input';
    input.value = previousTextContent;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
  }
});

tBody.addEventListener('keydown', (e) => {
  if (e.code !== 'Enter' || !isEditing) {
    return;
  }

  setEditedCellValue();
});

input.addEventListener('blur', (e) => {
  setEditedCellValue();
});

function setEditedCellValue() {
  if (isEditing) {
    const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
    const inputValue = input.value.trim();

    switch (true) {
      case inputValue && cellIndex === 4:
        cell.textContent
          = inputValue.slice(0, 1) === '$'
            ? `$${parseInt(
              inputValue.split(',').join('').slice(1)
            ).toLocaleString('en-US')}`
            : `$${parseInt(inputValue.split(',').join('')
            ).toLocaleString('en-US')}`;
        break;
      case inputValue && cellIndex !== 4:
        cell.textContent = inputValue;
        break;
      case !inputValue:
        cell.textContent = previousTextContent;
    }

    isEditing = false;
  }
}

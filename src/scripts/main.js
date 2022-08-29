'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const arr = Array.from(tableBody.rows);
let isAsc = true;
let target;

// Active row
table.addEventListener('click', e => {
  const tr = e.target.closest('TR');
  const currentActive = table.querySelector('tr.active');

  if (currentActive) {
    currentActive.classList.toggle('active');
  }

  tr.classList.toggle('active');
});

// Sort table
table.addEventListener('click', e => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  if (target !== e.target) {
    target = e.target;
    isAsc = true;
  }

  if (isAsc) {
    sortASC(e.target.cellIndex);
    isAsc = false;
  } else {
    sortDESC(e.target.cellIndex);
    isAsc = true;
  }
});

function formatSalary(item) {
  return +item.slice(1).split(',').join('');
};

function sortASC(index) {
  if (typeof arr[0].cells[index].textContent === 'number') {
    arr.sort((a, b) => a.cells[index].textContent - b.cells[index].textContent);
  }

  if (typeof arr[0].cells[index].textContent === 'string') {
    arr.sort((a, b) => {
      return a.cells[index].textContent
        .localeCompare(b.cells[index].textContent);
    });
  }

  if (arr[0].cells[index].textContent.includes('$')) {
    arr.sort((a, b) => {
      return formatSalary(a.cells[index].textContent)
        - formatSalary(b.cells[index].textContent);
    });
  }

  tableBody.append(...arr);
}

function sortDESC(index) {
  if (typeof arr[0].cells[index].textContent === 'number') {
    arr.sort((a, b) => b.cells[index].textContent - a.cells[index].textContent);
  }

  if (typeof arr[0].cells[index].textContent === 'string') {
    arr.sort((a, b) => {
      return b.cells[index].textContent
        .localeCompare(a.cells[index].textContent);
    });
  }

  if (arr[0].cells[index].textContent.includes('$')) {
    arr.sort((a, b) => {
      return formatSalary(b.cells[index].textContent)
        - formatSalary(a.cells[index].textContent);
    });
  }

  tableBody.append(...arr);
}

const form = document.createElement('form');

form.className = 'new-employee-form';
table.after(form);

const input = document.createElement('input');
let previousText;

form.insertAdjacentHTML('beforeend', `
  <label>
    Name:
    <input
      name="name"
      type="text"
      required
      data-qa="name"
    >
  </label>

  <label>
    Position:
    <input
      name="position"
      type="text"
      required
      data-qa="position"
    >
  </label>

  <label>
    Office:
    <select name="office" required data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input
      name="age"
      type="number"
      required
      data-qa="age"
    >
  </label>

  <label>
    Salary:
    <input
      name="salary"
      type="number"
      required
      data-qa="salary"
    >
  </label>

  <button type="submit">
    Save to table
  </button>
`);

// Form check
form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const tr = document.createElement('tr');
  const formatter = new Intl.NumberFormat('en-US');
  const salary = `$${formatter.format(data.get('salary'))}`;

  tr.innerHTML = `
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${data.get('age')}</td>
    <td>${salary}</td>
  `;

  for (const letter of data.get('name')) {
    if ('0123456789'.includes(letter)) {
      pushNotification(150, 10, 'Error', 'Your data is incorrect', 'error');

      return;
    }
  }

  for (const letter of data.get('position')) {
    if ('0123456789'.includes(letter)) {
      pushNotification(150, 10, 'Error', 'Your data is incorrect', 'error');

      return;
    }
  }

  if (data.get('name').length < 4
    || data.get('age') < 18
    || data.get('age') > 90) {
    pushNotification(150, 10, 'Error', 'Your data is incorrect', 'error');

    return;
  }

  tableBody.append(tr);
  arr.push(tr);

  pushNotification(150, 10, 'Success',
    'Your data added to the table.', 'success');
});

// Notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const paragraph = document.createElement('p');

  message.className = `notification ${type}`;
  message.style.boxSizing = 'content-box';
  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';
  document.body.append(message);

  messageTitle.className = 'title';
  messageTitle.textContent = title;
  message.append(messageTitle);

  paragraph.className = 'description';
  paragraph.textContent = description;
  message.append(paragraph);

  setTimeout(() => message.remove(), 2000);
};

// Change text in cell
tableBody.addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  previousText = e.target.textContent;

  input.className = 'cell-input';

  e.target.textContent = '';
  e.target.append(input);

  input.focus();
});

input.addEventListener('keypress', e => {
  if (e.code !== 'Enter') {
    return;
  }

  changeText(e.target);
});

input.addEventListener('blur', e => {
  changeText(e.target);
});

function changeText(targ) {
  const td = targ.closest('TD');
  let newText = input.value;

  if (td.cellIndex === 0 || td.cellIndex === 1 || td.cellIndex === 2) {
    for (const letter of input.value) {
      if ('0123456789'.includes(letter)) {
        newText = previousText;
        pushNotification(150, 150, 'Error', 'Your data is incorrect', 'error');
      }
    }
  }

  if (td.cellIndex === 0) {
    if (input.value.length < 4) {
      newText = previousText;
      pushNotification(150, 150, 'Error', 'Your data is incorrect', 'error');
    }
  }

  if (td.cellIndex === 3) {
    if (!+input.value || input.value < 18 || input.value > 90) {
      newText = previousText;
      pushNotification(150, 150, 'Error', 'Your data is incorrect', 'error');
    }
  }

  if (td.cellIndex === 4) {
    if (!+input.value) {
      newText = previousText;
      pushNotification(150, 150, 'Error', 'Your data is incorrect', 'error');
    } else {
      const formatter = new Intl.NumberFormat('en-US');
      const salary = `$${formatter.format(input.value)}`;

      newText = salary;
    }
  }

  if (input.value.length === 0) {
    td.textContent = previousText;
  } else {
    td.textContent = newText;
  }

  input.value = '';
}

'use strict';

function parseSalary(sum) {
  return +sum.slice(1).split(',').join('');
}

function formatToSalary(num) {
  return `$${num.toLocaleString('en-US')}`;
}

function pushNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

const table = document.querySelector('table');
const body = document.querySelector('tbody');

let activeHeaderIndex = null;
let selectedRow = null;

// Sorting by clicking on title
table.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const rows = [...document.querySelectorAll('tbody>tr')];
  const index = e.target.cellIndex;

  if (activeHeaderIndex !== index) {
    activeHeaderIndex = index;

    rows.sort((a, b) => {
      const aText = a.children[index].textContent;
      const bText = b.children[index].textContent;

      if (index === 4) {
        return parseSalary(aText) - parseSalary(bText);
      }

      return aText.localeCompare(bText);
    });
  } else {
    activeHeaderIndex = null;

    rows.sort((a, b) => {
      const aText = a.children[index].textContent;
      const bText = b.children[index].textContent;

      if (index === 4) {
        return parseSalary(bText) - parseSalary(aText);
      }

      return bText.localeCompare(aText);
    });
  }

  body.append(...rows);
});

// Clicked row becomes selected
body.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  if (!target || selectedRow === target) {
    return;
  }

  if (selectedRow !== target) {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }
    selectedRow = target;
    target.classList.add('active');
  }
});

// Adding form to the document
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>
    Position: <input name="position" type="text" data-qa="position" required>
  </label>
  <label>Office: 
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: 
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);

form.addEventListener('click', (e) => {
  if (e.target.type !== 'submit') {
    return;
  }

  const newRow = document.createElement('tr');

  const inputValues = [...form.querySelectorAll('[data-qa]')]
    .map((el, i, arr) => {
      if (i === arr.length - 1) {
        return (el.value.length) ? formatToSalary(+el.value) : '';
      }

      return el.value;
    });

  if (inputValues.every(el => el.length)) {
    e.preventDefault();

    if (inputValues[0].length < 4) {
      pushNotification('ERROR', 'Too short name', 'error');

      return;
    }

    if (+inputValues[3] < 18 || +inputValues[3] > 90) {
      pushNotification('ERROR', 'Invalid age', 'error');

      return;
    }

    for (let i = 0; i < inputValues.length; i++) {
      newRow.insertAdjacentHTML('beforeend', `
        <td>${inputValues[i]}</td>
      `);
    }

    body.append(newRow);
    pushNotification('SUCCESS', 'New employee added', 'success');
  }
});

// Implement editing of table
body.addEventListener('dblclick', (e) => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const cell = e.target;

  cell.innerHTML = `
    <input type="text" value="${cell.textContent}" class="cell-input">
  `;

  const input = cell.querySelector('input');
  input.focus();

  input.addEventListener('blur', () => {
    input.remove();
    cell.textContent = input.value;
  });

  input.addEventListener('keydown', (el) => {
    if (el.key === 'Enter') {
      input.remove();
      cell.textContent = input.value;
    }
  });
});

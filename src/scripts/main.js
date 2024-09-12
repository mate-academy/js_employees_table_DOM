'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const tbodyarr = [...tbody.querySelectorAll('tr')];
let sortTable;
const nodeListthead = thead.querySelectorAll('th');

for (const item of nodeListthead) {
  item.setAttribute('data-order', 'click1');
}

thead.addEventListener('click', (e) => {
  if (e.target.dataset.order === 'click2') {
    switch (e.target.textContent) {
      case 'Name':
        sortTable = tbodyarr.sort((a, b) =>
          (b.children[0].textContent.localeCompare(a.children[0].textContent)));
        break;
      case 'Position':
        sortTable = tbodyarr.sort((a, b) =>
          (b.children[1].textContent.localeCompare(a.children[1].textContent)));
        break;
      case 'Office':
        sortTable = tbodyarr.sort((a, b) =>
          (b.children[2].textContent.localeCompare(a.children[2].textContent)));
        break;
      case 'Age':
        sortTable = tbodyarr.sort((a, b) =>
          (+b.children[3].textContent - +a.children[3].textContent));
        break;
      case 'Salary':
        sortTable = tbodyarr.sort((a, b) =>
          (+b.children[4].textContent.slice(1).split(',').join('')
            - +a.children[4].textContent.slice(1).split(',').join('')));
        break;
    }

    sortTable.forEach(el => tbody.append(el));
    e.target.dataset.order = 'click1';

    return;
  }

  if (e.target.dataset.order === 'click1') {
    e.target.dataset.order = 'click2';

    switch (e.target.textContent) {
      case 'Name':
        sortTable = tbodyarr.sort((a, b) =>
          (a.children[0].textContent.localeCompare(b.children[0].textContent)));
        break;
      case 'Position':
        sortTable = tbodyarr.sort((a, b) =>
          (a.children[1].textContent.localeCompare(b.children[1].textContent)));
        break;
      case 'Office':
        sortTable = tbodyarr.sort((a, b) =>
          (a.children[2].textContent.localeCompare(b.children[2].textContent)));
        break;
      case 'Age':
        sortTable = tbodyarr.sort((a, b) =>
          (+a.children[3].textContent - +b.children[3].textContent));
        break;
      case 'Salary':
        sortTable = tbodyarr.sort((a, b) =>
          (+a.children[4].textContent.slice(1).split(',').join('')
          - +b.children[4].textContent.slice(1).split(',').join('')));
        break;
    }

    sortTable.forEach(el => tbody.append(el));
  }
});

tbody.addEventListener('click', (e) => {
  for (const item of tbody.children) {
    item.classList.remove('active');
  }
  e.target.parentElement.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin',
  `<label>Name:
    <input name="name" type="text" data-qa="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option></option>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name="age" id = "age" type="number" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" >
  </label>
  <button>Save to table</button>`
);
document.querySelector('body').append(form);

document.querySelector('button').addEventListener('click', (e) => {
  e.preventDefault();

  const nameValue = document.querySelector('[name="name"]').value;
  const positionValue = document.querySelector('[name="position"]').value;
  const officeValue = document.querySelector('[name="office"]').value;
  const ageValue = document.querySelector('[name="age"]').value;
  const salaryValue = '$' + (+document.querySelector('[name="salary"]').value)
    .toLocaleString('en-US');

  if (nameValue.length <= 3) {
    pushNotification(450, 10, 'Error',
      'Name has less than 4 letters', 'error');

    return;
  }

  if (positionValue.length <= 0) {
    pushNotification(450, 10, 'Error',
      'Position has less than 0 letters', 'error');

    return;
  }

  if (officeValue.length === 0) {
    pushNotification(450, 10, 'Error',
      'Select office', 'error');

    return;
  }

  if (+ageValue < 18 || +ageValue > 90) {
    pushNotification(450, 10, 'Error',
      'Age is less than 18 or more than 90', 'error');

    return;
  }

  if (+salaryValue <= 0) {
    pushNotification(450, 10, 'Error',
      'Salary value has less than 0', 'error');

    return;
  }

  pushNotification(10, 10, 'Success',
    'Add value', 'success');

  tbody.insertAdjacentHTML('afterbegin', `<tr>
    <td>${nameValue}</td>
    <td>${positionValue}</td>
    <td>${officeValue}</td>
    <td>${ageValue}</td>
    <td>${salaryValue}</td>
  </tr>`);
});

document.querySelector('button').addEventListener('click', (e) => {
  document.querySelector('[name="name"]').value = '';
  document.querySelector('[name="position"]').value = '';
  document.querySelector('[name="office"]').value = '';
  document.querySelector('[name="age"]').value = '';
  document.querySelector('[name="salary"]').value = '';
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.className = 'title';
  h2.textContent = title;
  p.textContent = description;
  div.className = 'notification';
  div.classList.add(`${type}`);
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;
  div.append(h2);
  div.append(p);
  body.append(div);
  setTimeout(() => div.remove(), '2000');
};

tbody.addEventListener('dblclick', (e) => {
  const input = document.createElement('input');
  const td = e.target;
  const cellIndex = td.cellIndex;

  input.style.width = getComputedStyle(td).width;
  input.classList.add('cell-input');

  const content = e.target.textContent;

  e.target.textContent = '';

  if (cellIndex > 2) {
    input.setAttribute('type', 'number');
  }
  e.target.append(input);

  input.focus();

  input.addEventListener('blur', () => {
    const valueInput = input.value;

    if (valueInput.length > 3 && td.cellIndex <= 2) {
      td.textContent = valueInput;
    } else if (cellIndex === 3 && +valueInput > 17 && +valueInput < 91) {
      td.textContent = valueInput;
    } else if (cellIndex === 4 && +valueInput > 0) {
      td.textContent = '$' + (+valueInput).toLocaleString('en-US');
    } else {
      td.textContent = content;
    }

    input.remove();
  });

  tbody.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      const valueInput = input.value;

      if (valueInput.length > 3 && td.cellIndex <= 2) {
        td.textContent = valueInput;
      } else if (cellIndex === 3 && +valueInput > 17 && +valueInput < 91) {
        td.textContent = valueInput;
      } else if (cellIndex === 4 && +valueInput > 0) {
        td.textContent = '$' + (+valueInput).toLocaleString('en-US');
      } else {
        td.textContent = content;
      }
    }
  });
});

'use strict';

const body = document.querySelector('body');
const table = body.querySelector('table');
const tableBody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');
const rows = tableBody.querySelectorAll('tr');
const form = document.createElement('form');
const options = `<label for="office">Office:
<select id="office" required>
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
</select>
</label>`;
let sortCol;
let sortAsc = false;

[].forEach.call(headers, (header, index) => {
  header.addEventListener('click', () => {
    sortColumn(index, false);
  });
});

[].forEach.call(rows, (item) => {
  item.addEventListener('click', (e) => {
    const curr = e.target.closest('tr');

    rows.forEach(row => {
      row === curr ? row.className = 'active' : row.className = '';
    });
  });
});

function convertToNumber(str) {
  return +str.slice(1).split(',').join('');
};

function convertToString(numb) {
  const date = numb.toLocaleString('en-US');
  const str = String(date);
  const string = '$';

  return [...string].concat(str).join('');
};

const sortColumn = (index) => {
  const thisSort = index;

  if (sortCol === thisSort) {
    sortAsc = !sortAsc;
  }

  sortCol = thisSort;

  const newRows = Array.from(tableBody.rows);

  newRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index].innerText;
    const cellB = rowB.querySelectorAll('td')[index].innerText;

    if (Number.isNaN(+cellA)) {
      if (cellA[0] === '$') {
        return sortAsc
          ? convertToNumber(cellA) - convertToNumber(cellB)
          : convertToNumber(cellB) - convertToNumber(cellA);
      }

      return sortAsc
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }

    return sortAsc
      ? cellA - cellB
      : cellB - cellA;
  });

  newRows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
};

form.classList.add('new-employee-form');

form.innerHTML = `
  <form name="myForm">
  <label for="names">Name:
    <input name="name" type="text" id="names" data-qa="Name" required>
  </label>
  <label for="pos">Position:
     <input name="position" type="text" id="pos" data-qa="Position" required>
   </label>
    <label for="office">Office:
      <select id="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
  <label for="age">Age:
    <input name="age" type="number" min="0" id="age" data-qa="Age" required>
  </label>
  <label for="salary">Salary:
     <input 
      name="salary" 
      type="number" 
      id="salary" 
      data-qa="Salary" 
      min="0"
      required>
   </label>

  <button class="submit" name="submit">Save to table</button>
  </form>
`;
body.append(form);

const button = document.querySelector('.submit');

button.addEventListener('click', (events) => {
  events.preventDefault();

  const input = document.querySelectorAll('input');
  const newRow = document.createElement('tr');
  const names = document.getElementById('names').value;
  const salary = document.getElementById('salary').value;
  const age = document.getElementById('age').value;
  const office = document.getElementById('office').value;
  const pos = document.getElementById('pos').value;

  if (names.length < 4) {
    pushNotification('Error', 'Name Min. length is 4 letters', 'error');

    return;
  };

  if (pos.length <= 1) {
    pushNotification('Error', 'Position shouldn`t empty', 'error');

    return;
  };

  if (age < 18 || age > 90) {
    pushNotification('Error', 'Age should be from 18 to 90', 'error');

    return;
  }

  if (salary === '') {
    pushNotification('Error', 'Salary shouldn`t empty', 'error');

    return;
  };

  newRow.innerHTML = `
  <tr>
    <td>${names}</td>
    <td>${pos}</td>
    <td>${office}</td>
    <td>${String(age)}</td>
    <td>${convertToString(+salary)}</td>
  </tr>
  `;
  tableBody.append(newRow);

  pushNotification('Success', 'New employee was added', 'success');

  input.forEach(field => {
    field.value = '';
  });

  sortColumn();
});

const pushNotification = (title, description, type) => {
  const element = document.createElement('div');
  const elTitle = document.createElement('h2');
  const elPar = document.createElement('p');

  element.classList.add(type, 'notification');
  element.dataset.qa = 'notification';

  elTitle.classList.add('title');
  elTitle.innerHTML = title;

  elPar.innerHTML = description;

  element.append(elTitle, elPar);

  document.body.append(element);

  setTimeout(() => {
    element.remove();
  }, 3000);
};

table.addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  };

  if (table.querySelectorAll('.cell-input').length >= 1) {
    return;
  }

  const cellText = e.target.textContent;
  const newInput = e.target.cellIndex === 2
    ? document.createElement('select')
    : document.createElement('input');

  if (newInput.tagName === 'SELECT') {
    newInput.insertAdjacentHTML('afterbegin', options);
  };

  newInput.value = cellText;
  newInput.classList.add('cell-input');

  e.target.firstChild.replaceWith(newInput);

  const checker = function() {
    const notification = document.body.querySelector('.notification');

    if (document.body.contains(notification)) {
      notification.remove();
    };

    if (e.target.cellIndex === 0 || e.target.cellIndex === 1) {
      if (newInput.value.length < 4) {
        newInput.replaceWith(cellText);

        pushNotification('Error', 'Min. length is 4 letters', 'error');
      };

      if (newInput.value && !isNaN(newInput.value)) {
        newInput.replaceWith(cellText);

        pushNotification('Error', 'Mustn`t be a number', 'error');
      };
    };

    if (e.target.cellIndex === 3) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(cellText);

        pushNotification('Erorr', 'Please, enter the number', 'error');
      };

      if (newInput.value < 18 || newInput.value > 90) {
        newInput.replaceWith(cellText);

        pushNotification('Erorr', 'Age only from 18 to 90', 'error');
      }
    };

    if (e.target.cellIndex === 4) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(cellText);

        pushNotification('Erorr', 'Only numbers please', 'error');
      }

      newInput.replaceWith(`$${(+newInput.value).toLocaleString('en-US')}`);
    };

    newInput.replaceWith(newInput.value);
  };

  newInput.addEventListener('blur', () => {
    checker();
  });

  newInput.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      checker();
    }
  });
});

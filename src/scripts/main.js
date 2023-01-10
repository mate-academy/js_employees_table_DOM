'use strict';

const body = document.querySelector('body');
const table = body.querySelector('table');
const tableBody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');
const rows = tableBody.querySelectorAll('tr');
const form = document.createElement('form');
let sortCol;
let sortAsc = false;

[].forEach.call(headers, (header, index) => {
  header.addEventListener('click', (events) => {
    sortColumn(index, false);

    // const curr = rows;

    // rows.forEach(item => {
    //   if (item === curr) {
    //     item.className = 'active';
    //   } else {
    //     item.className = '';
    //   }
    // });
  });
});

[].forEach.call(rows, (item) => {
  item.addEventListener('click', (e) => {
    const curr = e.target.closest('tr');

    rows.forEach(row => {
      if (row === curr) {
        row.className = 'active';
      } else {
        row.className = '';
      }
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
  const thisSort = index.target;

  if (sortCol === thisSort) {
    sortAsc = !sortAsc;
  }

  sortCol = thisSort;

  const newRows = Array.from(rows);

  newRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index].innerHTML;
    const cellB = rowB.querySelectorAll('td')[index].innerHTML;

    if (Number.isNaN(+cellA)) {
      if (cellA[0] === '$') {
        return sortAsc
          ? convertToNumber(cellA) - convertToNumber(cellB)
          : convertToNumber(cellB) - convertToNumber(cellA);
      }

      return sortAsc
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    } else {
      return sortAsc
        ? cellA - cellB
        : cellB - cellA;
    }
  });

  [].forEach.call(rows, (row) => {
    tableBody.removeChild(row);
  });

  newRows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
};

form.classList.add('new-employee-form');

form.innerHTML = `
  <form name="myForm">
  <label for="names">Name:
    <input name="name" type="text" id="names" data-qa="name" required>
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
    <input name="age" type="number" id="age" data-qa="age" required>
  </label>
  <label for="salary">Salary:
     <input name="salary" type="number" id="salary" data-qa="salary" required>
   </label>

  <button class="submit" name="submit">Save to table</button>
  </form>
`;
body.append(form);

const button = document.querySelector('.submit');
const errorDiv = document.createElement('div');
const successDiv = document.createElement('div');

successDiv.innerHTML = `
<h2 class='title'>Success</h2>
<p>Data added in the Table</p>
`;

errorDiv.innerHTML = `
  <h2 class='title'>Error</h2>
  <p>add Information</p>
`;

successDiv.classList.add('notification', 'success');
successDiv.setAttribute('data-qa', 'notification');
errorDiv.classList.add('notification', 'error');
errorDiv.setAttribute('data-qa', 'notification');
body.append(successDiv);
body.append(errorDiv);

errorDiv.style.display = 'none';
successDiv.style.display = 'none';

function validateForm() {
  const newRow = document.createElement('tr');
  const names = document.getElementById('names').value;
  const salary = document.getElementById('salary').value;
  const age = document.getElementById('age').value;
  const office = document.getElementById('office').value;
  const pos = document.getElementById('pos').value;

  newRow.innerHTML = `
  <tr>
    <td>${document.getElementById('names').value}</td>
    <td>${document.getElementById('pos').value}</td>
    <td>${document.getElementById('office').value}</td>
    <td>${String(document.getElementById('age').value)}</td>
    <td>${convertToString(document.getElementById('salary').value)}</td>
  </tr>
  `;

  if (names.length < 4 || age < 18 || age > 90) {
    errorDiv.style.display = 'block';

    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 1500);

    return false;
  } else
  if (salary === '' || office === '' || pos === '') {
    errorDiv.style.display = 'block';

    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 1500);

    return false;
  } else {
    successDiv.style.display = 'block';

    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 1500);

    tableBody.append(newRow);
  };
}

button.addEventListener('click', (events) => {
  events.preventDefault();
  validateForm();
});

const td = table.querySelectorAll('td');

[...td].map(item => {
  item.addEventListener('dblclick', () => {
    const input = document.createElement('input');
    const valueItem = item;

    input.classList.add('cell-input');
    input.value = valueItem.innerText;
    input.value = '';
    valueItem.innerText = '';
    valueItem.append(input);
    input.focus();

    input.addEventListener('blur', () => {
      valueItem.innerText = input.value;
    });

    input.addEventListener('keydown', (eventKey) => {
      if (eventKey.key === 'Enter') {
        valueItem.innerText = input.value;
      }
    });
  });
});

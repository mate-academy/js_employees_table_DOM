'use strict';

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');
const theaders = document.querySelector('tr');

function convertSalaryToNumber(salary) {
  return parseInt(salary.substring(1).split(',').join(''));
}

// Help me to get these two sorting functions to work bcs I tried and I failed :(

function ascSortDirection(arr, indexHeader, columnName) {
  if (columnName === 'Salary') {
    arr.sort((x, y) => convertSalaryToNumber(x.children[indexHeader].innerText
      - convertSalaryToNumber(y.children[indexHeader].innerText)));
  } else if (columnName === 'Age') {
    arr.sort((x, y) =>
      parseInt(x.children[indexHeader].innerText)
      - parseInt(y.children[indexHeader].innerText));
  } else {
    arr.sort((x, y) =>
      x.children[indexHeader].innerText
        .localeCompare(y.children[indexHeader].innerText));
  }
}

function descSortDirection(arr, indexHeader, columnName) {
  if (columnName === 'Salary') {
    arr.sort((x, y) => convertSalaryToNumber(y.children[indexHeader].innerText
      - convertSalaryToNumber(x.children[indexHeader].innerText)));
  } else if (columnName === 'Age') {
    arr.sort((x, y) =>
      parseInt(y.children[indexHeader].innerText)
      - parseInt(x.children[indexHeader].innerText));
  } else {
    arr.sort((x, y) =>
      y.children[indexHeader].innerText
        .localeCompare(x.children[indexHeader].innerText));
  }
}

theaders.addEventListener('click', (e) => {
  const tRows = tBody.querySelectorAll('tr');
  const rowsArr = [...tRows];

  const header = [...theaders.children].indexOf(e.target);

  if (!e.target.dataset.sort) {
    e.target.dataset.sort = 'asc';
  } else if (e.target.dataset.sort === 'asc') {
    e.target.dataset.sort = 'desc';
  } else if (e.target.dataset.sort === 'desc') {
    e.target.dataset.sort = 'asc';
  }

  let rows;

  if (e.target.dataset.sort === 'asc') {
    switch (e.target.innerText) {
      case 'Salary':
        rows = rowsArr.sort((x, y) =>
          convertSalaryToNumber(x.children[header].innerText)
          - convertSalaryToNumber(y.children[header].innerText));
        break;
      case 'Age':
        rows = rowsArr.sort((x, y) =>
          parseInt(x.children[header].innerText)
          - parseInt(y.children[header].innerText));
        break;
      default:
        rows = rowsArr.sort((x, y) =>
          x.children[header].innerText
            .localeCompare(y.children[header].innerText));
    }
  } else {
    switch (e.target.innerText) {
      case 'Salary':
        rows = rowsArr.sort((x, y) =>
          convertSalaryToNumber(y.children[header].innerText)
          - convertSalaryToNumber(x.children[header].innerText));
        break;
      case 'Age':
        rows = rowsArr.sort((x, y) =>
          parseInt(y.children[header].innerText)
          - parseInt(x.children[header].innerText));
        break;
      default:
        rows = rowsArr.sort((x, y) =>
          y.children[header].innerText
            .localeCompare(x.children[header].innerText));
    }
  }

  table.appendChild(tBody);

  rows.forEach(element => {
    tBody.appendChild(element);
  });
});

tBody.addEventListener('click', (e) => {
  const tRows = tBody.querySelectorAll('tr');

  for (const row of tRows) {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  }

  e.target.parentElement.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('beforeend', `
  <label>Name: 
    <input name="name"
           type="text"
           data-qa="name"
           class="name"
           required
    >
  </label>
  <label>Position:
    <input name="position"
           type="text"
           data-qa="position"
           class="position"
           required
    >
  </label>
  <label>Office:
    <select name="office"
            data-qa="office"
            class="office"
            required
    >
      <option value="tokyo">Tokyo</option>
      <option value="singapore">Singapore</option>
      <option value="london">London</option>
      <option value="new-york">New York</option>
      <option value="edinburh">Edinburgh</option>
      <option value="san-francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age"
           type="number"
           data-qa="age"
           class="age"
           required
    >
  </label>
  <label>Salary:
    <input name="salary"
           type="number"
           data-qa="salary"
           class="salary"
           required
    >
  </label>
  <button class="button" type="submit">Save to table</button>
`);

document.body.appendChild(form);

function convertNumberToSalary(salary) {
  return (salary.length > 5) ? '$' + salary.match(/^\d{3}|\d{3}|\d+/g)
    : '$' + salary.match(/^\d{2}|\d{3}|\d+/g);
}

function convertString(inputString) {
  let result = '';

  if (inputString.indexOf('-') > -1) {
    const arrString = inputString.split('-');

    for (const word of arrString) {
      result += word.charAt(0).toUpperCase()
      + word.slice(1) + ' ';
    }

    return result;
  }

  return inputString.charAt(0).toUpperCase()
    + inputString.slice(1);
};

const inputName = document.querySelector('.name');
const inputPosition = document.querySelector('.position');
const inputAge = document.querySelector('.age');
const inputSalary = document.querySelector('.salary');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const desc = document.createElement('p');

  if (data.get('name').length < 4) {
    notification.classList.add('error');
    h2.textContent = 'Error';
    desc.textContent = 'Name should have more characters (sorry asians)';
  } else if (data.get('age') < 18 || data.get('age') > 90) {
    notification.classList.add('error');
    h2.textContent = 'Error';
    desc.textContent = 'Age doesn`t meet required range 18-90';
  } else if (data.get('salary')[0] == 0) {
    notification.classList.add('error');
    h2.textContent = 'Error';

    desc.textContent = 'Unappropriate salary input value.\n '
      + 'Salary can`t begins with 0';
  } else {
    notification.classList.add('success');
    h2.textContent = 'Success';
    desc.textContent = 'The person has been added successfully';

    tBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>
        ${data.get('name')}
      </td>
      <td>
        ${data.get('position')}
      </td>
      <td>
        ${convertString(data.get('office'))}
      </td>
      <td>
        ${data.get('age')}
      </td>
      <td>
        ${convertNumberToSalary(data.get('salary'))}
      </td>
    </tr>
  `);

    inputName.value = '';
    inputPosition.value = '';
    inputAge.value = '';
    inputSalary.value = '';
  }

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';
  h2.setAttribute('title', 'title');
  notification.append(h2);
  notification.append(desc);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
});

tBody.addEventListener('dblclick', (e) => {
  const td = e.target;
  const initialValue = td.innerText;

  if (td.cellIndex === 2) {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    input.style.width = window.getComputedStyle(td).width;

    td.textContent = '';
    td.append(input);

    input.addEventListener('blur', () => {
      editTableCell(td, input, initialValue);
      input.remove();
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.code === 'Enter') {
        editTableCell(td, input, initialValue);
        input.remove();
      }
    });
  };
});

function editTableCell(cell, input, cellValue) {
  if (!input.value) {
    cell.textContent = cellValue;

    return;
  }

  cell.textContent = input.value;
};

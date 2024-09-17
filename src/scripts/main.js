'use strict';

const tableBody = document.querySelector('tbody');
const tableHead = document.querySelector('thead');

document.body.insertAdjacentHTML('beforeend', `
  <form
    action="#"
    method="get"
    class="new-employee-form"
  >
    <label>
      Name:
      <input name = "name" type = "text" data-qa = "name"></input>
    </label>

    <label>
      Position:
      <input
        name = "position"
        type = "text"
        data-qa = "position"
      ></input>
    </label>

    <label>
      Office:
      <select name = "office" data-qa = "office">
        <option value = "Tokyo">Tokyo</option>
        <option value = "Singapore">Singapore</option>
        <option value = "London">London</option>
        <option value = "New York">New York</option>
        <option value = "Edinburgh">Edinburgh</option>
        <option value = "San Francisco">San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input
        name = "age"
        type = "number"
        data-qa = "age"
        min = "0"
      ></input>
    </label>

    <label>
      Salary:
        <input
        name = "salary"
        type = "number"
        data-qa = "salary"
        min = "0"
      ></input>
    </label>

    <button type = "submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const newRow = document.createElement('tr');

  for (const [key, value] of data) {
    if (!value) {
      pushNotification('An error occured', 'Please fill all inputs', 'error');

      return;
    }

    if (key === 'name' && value.length < 4) {
      pushNotification('An error occured', 'Invalid name value', 'error');

      return;
    }

    if (key === 'position' && value.length < 4) {
      pushNotification('An error occured', 'Invalid position value', 'error');

      return;
    }

    if (key === 'age' && (Number(value) < 18 || Number(value) > 90)) {
      pushNotification('An error occured', 'Invalid age value', 'error');

      return;
    }

    const cell = document.createElement('td');

    if (key === 'salary') {
      cell.textContent = `$${Intl.NumberFormat('en-US').format(Number(value))}`;
    } else {
      cell.textContent = value;
    }

    newRow.append(cell);
  }

  tableBody.append(newRow);
  form.reset();
  pushNotification('You do it!', 'Your data wad added to table', 'success');
});

tableBody.addEventListener('dblclick', (e) => {
  const target = e.target;
  const initialValue = target.textContent;

  const cellInput = document.createElement('input');

  cellInput.className = 'cell-input';
  cellInput.name = 'cell';
  cellInput.type = 'text';

  target.textContent = '';
  target.append(cellInput);
  cellInput.focus();

  cellInput.addEventListener('keydown', (handler) => {
    const targetIndex = target.cellIndex;
    const inputValue = cellInput.value;

    if (handler.code === 'Enter') {
      if (!inputValue) {
        cellInput.remove();
        target.textContent = initialValue;

        return;
      }

      if (
        (targetIndex === 0 && inputValue.length < 4)
        || (targetIndex === 3
          && (inputValue < 18 || inputValue > 90))
        || (targetIndex === 4 && inputValue < 0)
      ) {
        pushNotification('Error occured', 'You enter invalid data', 'error');

        return;
      }

      cellInput.remove();

      pushNotification('Success',
        'Value in the table was changed', 'success');

      if (target.cellIndex === 4) {
        target.textContent
        = `$${Intl.NumberFormat('en-US').format(Number(cellInput.value))}`;
      } else {
        target.textContent = cellInput.value;
      }
    }
  });

  cellInput.addEventListener('blur', () => {
    const targetIndex = target.cellIndex;
    const inputValue = cellInput.value;

    if (!inputValue) {
      cellInput.remove();
      target.textContent = initialValue;

      return;
    }

    if (
      (targetIndex === 0 && inputValue.length < 4)
      || (targetIndex === 3
        && (inputValue < 18 || inputValue > 90))
      || (targetIndex === 4 && inputValue < 0)
    ) {
      pushNotification('Error occured', 'You enter invalid data', 'error');

      return;
    }

    cellInput.remove();

    pushNotification('Success',
      'Value in the table was changed', 'success');

    if (target.cellIndex === 4) {
      target.textContent
      = `$${Intl.NumberFormat('en-US').format(Number(cellInput.value))}`;
    } else {
      target.textContent = cellInput.value;
    }
  });
});

tableHead.addEventListener('click', (e) => {
  const target = e.target;

  const rowsInBody = [...tableBody.children];
  const cellsInHead = tableHead.children[0].children;

  const index = [...document.querySelectorAll('th')]
    .findIndex(item => item === target);

  switch (index) {
    case 3:
      if (!target.classList.contains('sorted')) {
        rowsInBody.sort((a, b) => {
          return Number(a.children[index].textContent)
            - Number(b.children[index].textContent);
        });

        target.classList.add('sorted');
      } else {
        rowsInBody.sort((a, b) => {
          return Number(b.children[index].textContent)
            - Number(a.children[index].textContent);
        });

        target.classList.remove('sorted');
      }
      break;

    case 4:
      if (!target.classList.contains('sorted')) {
        rowsInBody.sort((a, b) => {
          return transformToNumber(a.children[index].textContent)
            - transformToNumber(b.children[index].textContent);
        });

        target.classList.add('sorted');
      } else {
        rowsInBody.sort((a, b) => {
          return transformToNumber(b.children[index].textContent)
            - transformToNumber(a.children[index].textContent);
        });

        target.classList.remove('sorted');
      }
      break;

    default:
      if (!target.classList.contains('sorted')) {
        rowsInBody.sort((a, b) => {
          return a.children[index].textContent
            .localeCompare(b.children[index].textContent);
        });

        target.classList.add('sorted');
      } else {
        rowsInBody.sort((a, b) => {
          return b.children[index].textContent
            .localeCompare(a.children[index].textContent);
        });

        target.classList.remove('sorted');
      }
      break;
  }

  rowsInBody.forEach(row => {
    tableBody.append(row);
  });

  [...cellsInHead].forEach(cell => {
    if (cell !== target) {
      cell.classList.remove('sorted');
    }
  });
});

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target.parentElement;
  const rowsInBody = [...tableBody.children];

  selectedRow.classList.toggle('active', !rowsInBody.some(row => {
    return row.classList.contains('active');
  }));
});

function transformToNumber(salary) {
  return Number(salary.replace('$', '').split(',').join(''));
}

function pushNotification(title, description, type) {
  const message = document.createElement('div');

  document.body.append(message);

  message.setAttribute('class', `notification ${type}`);
  message.setAttribute('data-qa', 'notification');

  message.insertAdjacentHTML('afterbegin', `
    <h2 class = "title">${title}</h2>
    <p>${description}</p>
  `);

  setTimeout(() => message.remove(), 2000);
}

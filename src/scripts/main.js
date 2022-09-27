'use strict';

const bodyOfTable = document.querySelector('tbody');

const headOfTable = document.querySelector('tHead > tr');

const headCells = headOfTable.children;

const body = document.body;

[...headCells].forEach(element => (element.dataset.countOfClick = 0));

headOfTable.addEventListener('click', () => {
  const tableRows = [...bodyOfTable.rows];

  const index = event.target.cellIndex;

  const headCell = headCells[index];

  headCell.dataset.countOfClick++;

  const clicks = headCell.dataset.countOfClick;

  conversion(index, tableRows, clicks);

  bodyOfTable.append(...tableRows);

  function conversion(cellIndex, array, numberOfClicks) {
    [...headCells].forEach(element => {
      if (event.target !== element) {
        element.dataset.countOfClick = 0;
      }
    });

    switch (cellIndex) {
      case 0:
      case 1:
      case 2:

        array.sort((a, b) => {
          const first = a.children[cellIndex];
          const second = b.children[cellIndex];

          if (numberOfClicks % 2 !== 0) {
            return first.innerText.localeCompare(second.innerText);
          } else {
            return second.innerText.localeCompare(first.innerText);
          }
        });

        break;

      case 3:
      case 4:
        array.sort((a, b) => {
          let first = a.children[cellIndex].innerText;
          let second = b.children[cellIndex].innerText;

          if (cellIndex === 4) {
            first
            = +(a.children[cellIndex].innerText.slice(1).replace(/,/g, ''));

            second
            = +(b.children[cellIndex].innerText.slice(1).replace(/,/g, ''));
          }

          if (numberOfClicks % 2 !== 0) {
            return first - second;
          } else {
            return second - first;
          }
        });
    }

    return array;
  }
});

bodyOfTable.addEventListener('click', () => {
  [...bodyOfTable.rows].forEach(element => element.classList.remove('active'));
  event.target.parentElement.classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form
    method="post"
    class="new-employee-form"
  >
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        >
      </input>
    </label>

    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        
      >
      </input>
    </label>

    <label>
      Office:
      <select
        name="office"
        data-qa="office"
        
      >
        <option value="Tokyo">Tokyo</option>

        <option value="Singapore">Singapore</option>

        <option value="London">London</option>

        <option value="New York">New York</option>

        <option value="Edinburgh">Edinburgh</option>
        
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
      >
      </input>
    </label>

    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      >
      </input>
    </label>

    <button
      type="submit"
    >
      Save to table
    </button>
  </form>
`);

function callNotification(title, type, text) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';

  notification.classList.add('notification', type);

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    ${text}
  `;

  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

const form = document.querySelector('form');

form.addEventListener('submit', () => {
  event.preventDefault();

  const data = new FormData(form);

  const formValues = Object.fromEntries(data.entries());

  const money = +(formValues.salary);

  const newRow = `
    <tr>
      <td>
        ${formValues.name}
      </td>

      <td>
        ${formValues.position}
      </td>

      <td>
        ${formValues.office}
      </td>

      <td>
        ${formValues.age}
      </td>

      <td>
        $${money.toLocaleString('en-US')}
      </td>
    </tr>
  `;

  if (formValues.name.length < 4
    || isNaN(formValues.name) === false
    || formValues.age < 18
    || formValues.age > 90
    || formValues.position.length === 0
    || isNaN(formValues.position) === false
    || formValues.salary === 0
  ) {
    callNotification('Error', 'error', `
      <p>You need to fill all fields</p>
      <p>Length of name must be not less than 4 letters</p>
      <p>You don't need to use numbers in Name and Position fields</p>
      <p>Age must be not less than 18 and not more than 90 years old</p>
    `);
  } else {
    callNotification('Success', 'success', `
      <p>Information added to the table</p>
    `);

    bodyOfTable.insertAdjacentHTML('beforeend', newRow);
  }
});

bodyOfTable.addEventListener('dblclick', () => {
  const cellInitialValue = event.target.innerHTML;
  const row = event.target.parentElement;
  const position = event.target.cellIndex;
  const currentCell = row.children[position];

  if (position === 2) {
    event.target.innerHTML = `
      <select
        name="office"
        data-qa="office"
        class="cell-input"
      >
        <option value="Tokyo">Tokyo</option>

        <option value="Singapore">Singapore</option>

        <option value="London">London</option>

        <option value="New York">New York</option>

        <option value="Edinburgh">Edinburgh</option>
        
        <option value="San Francisco">San Francisco</option>
      </select>
    `;
  } else {
    event.target.innerHTML = `
    <input class="cell-input"></input>
  `;
  }

  const input = document.getElementsByClassName('cell-input')[0];

  if (position === 3) {
    input.type = 'number';
    input.min = '18';
    input.max = '99';
  }

  if (position === 4) {
    input.type = 'number';
  }

  input.focus();

  const success = `<p>Information has added to the cell</p>`;

  input.addEventListener('blur', () => {
    const value = input.value;

    if (position === 0 || position === 1) {
      if (isNaN(value) === true && value.length >= 4) {
        currentCell.innerHTML = value;

        callNotification('Success', 'success', success);
      } else {
        currentCell.innerHTML = cellInitialValue;

        callNotification('Error', 'error', `
          <p>Length of name must be not less than 4</p>
          <p>You don't need to use numbers in this field</p>
        `);
      }
    }

    if (position === 2) {
      callNotification('Success', 'success', success);

      currentCell.innerHTML = value;
    }

    if (position === 3) {
      if (value >= 18
        && value <= 99
        && isNaN(value) === false) {
        callNotification('Success', 'success', success);

        currentCell.innerHTML = value;
      } else {
        currentCell.innerHTML = cellInitialValue;

        callNotification('Error', 'error', `
          <p>Age must be not less than 18 and not more than 90 years old</p>
          <p>You don't need to use letters in this field</p>
        `);
      }
    }

    if (position === 4) {
      if (isNaN(value) === false && value.length !== 0) {
        callNotification('Success', 'success', success);

        currentCell.innerHTML
        = `$${(+value).toLocaleString('en-US')}`;
      } else {
        currentCell.innerHTML = cellInitialValue;

        callNotification('Error', 'error', `
          <p>You don't need to use letters in this field</p>
        `);
      }
    }
  });

  input.addEventListener('keypress', () => {
    const value = input.value;

    if (event.key === 'Enter') {
      if (position === 0 || position === 1) {
        if (isNaN(value) === true && value.length >= 4) {
          currentCell.innerHTML = value;

          callNotification('Success', 'success', success);
        } else {
          currentCell.innerHTML = cellInitialValue;

          callNotification('Error', 'error', `
            <p>Length of name must be not less than 4</p>
            <p>You don't need to use numbers in this field</p>
          `);
        }
      }

      if (position === 2) {
        callNotification('Success', 'success', success);

        currentCell.innerHTML = value;
      }

      if (position === 3) {
        if (value >= 18
          && value <= 99
          && isNaN(value) === false) {
          callNotification('Success', 'success', success);

          currentCell.innerHTML = value;
        } else {
          currentCell.innerHTML = cellInitialValue;

          callNotification('Error', 'error', `
            <p>Age must be not less than 18 and not more than 90 years old</p>
            <p>You don't need to use letters in this field</p>
          `);
        }
      }

      if (position === 4) {
        if (isNaN(value) === false && value.length !== 0) {
          callNotification('Success', 'success', success);

          currentCell.innerHTML
          = `$${(+value).toLocaleString('en-US')}`;
        } else {
          currentCell.innerHTML = cellInitialValue;

          callNotification('Error', 'error', `
            <p>You don't need to use letters in this field</p>
          `);
        }
      }
    }
  });
});

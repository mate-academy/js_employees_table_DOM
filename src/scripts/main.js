'use strict';

const employeeTable = document.querySelector('table');

sortingTable(employeeTable);
selectedRows(employeeTable);
editingTable(employeeTable);
createForm();

const errorArray = [
  {
    title: 'ERROR',
    description: 'Age must be from 18 to 90',
    type: 'error',
  },
  {
    title: 'WARNING',
    description: 'Please input only whole numbers',
    type: 'warning',
  },
  {
    title: 'SUCCESS',
    description: 'All changes have been made',
    type: 'success',
  },
  {
    title: 'WARNING',
    description: 'Input value must not be empty',
    type: 'warning',
  },
  {
    title: 'ERROR',
    description: 'Input value must contain only letters or '
      + 'only one space between words.',
    type: 'error',
  },
  {
    title: 'WARNING',
    description: 'Input value must be more then 4 symbols',
    type: 'warning',
  },
];

function sortingTable(table) {
  const head = table.querySelector('thead');

  head.querySelectorAll('th').forEach((item) => {
    const spanElem = document.createElement('span');

    spanElem.style.fontSize = '12px';
    item.append(spanElem);
  });

  const arrCompare = [1, 1, 1, 1, 1];

  head.addEventListener('click', (eventFunc) => {
    const cellNumber = eventFunc.target.cellIndex;
    const asc = ' \u25BC';
    const desc = ' \u25B2';
    const convert = (stringNumber) => {
      return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
    };
    const compareVariables = (aa, bb) => {
      let a = aa.children[cellNumber].textContent.toUpperCase();
      let b = bb.children[cellNumber].textContent.toUpperCase();

      if (convert(a) > 0) {
        a = (convert(a));
        b = (convert(b));
      }

      return a < b ? arrCompare[cellNumber] : arrCompare[cellNumber] * (-1);
    };

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    for (let i = 0; i < arrCompare.length; i++) {
      arrCompare[i] = cellNumber === i ? arrCompare[i] * (-1) : 1;
    }

    head.querySelectorAll('span')[cellNumber]
      .textContent = arrCompare[cellNumber] === 1 ? asc : desc;

    document.querySelector('tbody')
      .append(...[...document.querySelector('tbody').children].sort((a, b) =>
        compareVariables(a, b)));
  });
}

function selectedRows(table) {
  const rows = table.querySelector('tbody');

  rows.addEventListener('click', (eventFunc) => {
    for (const i of rows.children) {
      i.removeAttribute('class');
    }
    eventFunc.target.parentElement.classList.add('active');
  });
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
  <label>Name:<input type="text" name="name" data-qa="name"></label>
  <label>Position:<input type="text" name="position" data-qa="position"></label>
  <label>Office:
     <select name="office" data-qa="office">
        <option value="Tokyo">choose an office</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
     </select>
  </label>
  <label>Age:<input type="number" name="age" data-qa="age">
  </label>
  <label>Salary:<input type="number" name="salary" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
  `;
  document.body.insertBefore(form, document.body[1]);
}

function editingTable(table) {
  table.querySelector('tbody').addEventListener('dblclick', (eventFunc) => {
    const memoryText = eventFunc.target.textContent;
    const numberColumn = eventFunc.target.cellIndex;

    if (numberColumn === 0 || numberColumn === 1 || numberColumn === 3) {
      eventFunc.target.textContent = '';

      const inputButton = document.createElement('input');

      inputButton.className = 'cell-input';
      inputButton.value = memoryText;
      eventFunc.target.append(inputButton);
      inputButton.style.color = 'black';
      inputButton.style.fontWeight = 'bold';
      inputButton.focus();

      inputButton.addEventListener('blur', () => {
        eventFunc.target.textContent = inputButton.value;

        if (tableErrorHandler(numberColumn, inputButton.value) === 0) {
          eventFunc.target.textContent = memoryText;
        }
        eventFunc.target.removeAttribute('input');
      });

      inputButton.addEventListener('keypress', (eventEnter) => {
        if (eventEnter.key === 'Enter') {
          eventFunc.target.textContent = inputButton.value;

          if (tableErrorHandler(numberColumn, inputButton.value) === 0) {
            eventFunc.target.textContent = memoryText;
          }
          eventFunc.target.removeAttribute('input');
        }

        if (eventEnter.key === 'Escape') {
          eventFunc.target.textContent = memoryText;
          eventFunc.target.removeAttribute('input');
        }
      });
    }

    if (numberColumn === 2) {
      eventFunc.target.textContent = '';

      const inputButton = document.createElement('label');

      inputButton.innerHTML = `
      <select class="cell-input" style="color: black; font-weight: bold">
            <option value="Default">choose an office</option>
            <option value="Tokyo">Tokyo</option>
            <option value="Singapore">Singapore</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="San Francisco">San Francisco</option>
      </select>`;

      eventFunc.target.append(inputButton);
      inputButton.focus();

      inputButton.querySelector('select')
        .addEventListener('change', (eventSection) => {
          const selectedText = eventSection.target.value;

          eventSection.target.parentElement.remove();
          eventFunc.target.textContent = selectedText;
          tableErrorHandler(numberColumn);
        });

      inputButton.querySelector('select')
        .addEventListener('blur', (eventSection) => {
          eventSection.target.parentElement.remove();
          eventFunc.target.textContent = memoryText;
        });

      inputButton.querySelector('select')
        .addEventListener('keypress', (eventKey) => {
          if (eventKey.key === 'Escape') {
            eventKey.target.parentElement.remove();
            eventFunc.target.textContent = memoryText;
          }
        });
    }
  });
}

function notification(message) {
  const element = document.createElement('div');

  element.classList.add('notification', message.type);

  element.innerHTML
    = `<h2 class="title">${message.title}</h2><p>${message.description}</p>`;
  document.querySelector('body').append(element);

  setTimeout(function() {
    document.body.children[3].remove();
  }, 3000);
}

function tableErrorHandler(columnNumber, value) {
  if (value === '') {
    notification(errorArray[3]);

    return 0;
  }

  if (columnNumber === 3) {
    if (value > 90 || value < 18) {
      notification(errorArray[0]);

      return 0;
    }
  }

  if (columnNumber === 3) {
    if (!value.match(/^\d*\d*$/)) {
      notification(errorArray[1]);

      return 0;
    }
  }

  if (columnNumber === 0) {
    const words = value.split(' ');

    for (const i of words) {
      if (!i.match(/^[A-Za-z]+$/)) {
        notification(errorArray[4]);

        return 0;
      }
    }
  }

  if (columnNumber === 0) {
    if (value.length < 4) {
      notification(errorArray[5]);

      return 0;
    }
  }

  notification(errorArray[2]);

  return 1;
}

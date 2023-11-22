'use strict';

const tableBody = document.querySelector('tbody');
const tableHeaders = document.querySelectorAll('thead th');
const tableRows = tableBody.rows;

// sort table

let descOrder = false;
let sortCol;

tableHeaders.forEach(header => header.addEventListener('click', e => {
  const index = [...tableHeaders].indexOf(e.target);

  const sortedTable = [...tableRows].sort((a, b) => {
    const aContent = a.children[index].innerHTML;
    const bContent = b.children[index].innerHTML;

    if (descOrder && sortCol === e.target) {
      if (aContent[0] === '$' || !isNaN(aContent)) {
        return Number(bContent.replace(/\D/g, ''))
          - Number(aContent.replace(/\D/g, ''));
      };

      return bContent.localeCompare(aContent);
    };

    if (aContent[0] === '$' || !isNaN(aContent)) {
      return Number(aContent.replace(/\D/g, ''))
        - Number(bContent.replace(/\D/g, ''));
    };

    return aContent.localeCompare(bContent);
  });

  tableBody.append(...sortedTable);
  descOrder = !descOrder;
  sortCol = e.target;
}));

// select row

let selectedRow;

tableBody.addEventListener('click', (e) => {
  const currentRow = e.target.closest('tr');

  if (selectedRow && selectedRow !== currentRow) {
    selectedRow.classList.remove('active');
  }

  if (currentRow) {
    currentRow.classList.add('active');
    selectedRow = currentRow;
  }
});

// add form

const form = document.createElement('form');

form.noValidate = true;
form.classList.add('new-employee-form');

for (const header of tableHeaders) {
  const label = document.createElement('label');

  label.textContent = header.textContent + ': ';

  if (header.textContent !== 'Office') {
    const input = document.createElement('input');

    input.dataset.qa = input.name = header.textContent.toLowerCase();
    input.setAttribute('required', '');

    switch (header.textContent) {
      case 'Age':
        input.type = 'number';
        input.min = 18;
        input.max = 90;
        break;
      case 'Salary':
        input.type = 'number';
        break;
      default:
        input.type = 'text';
        break;
    }
    label.append(input);
  } else {
    const offices = [...tableRows]
      .map(row => row.cells[2].innerText)
      .filter((item, index, array) => array.indexOf(item) === index)
      .sort();

    const select = document.createElement('select');

    select.dataset.qa = select.name = header.textContent.toLowerCase();

    select.setAttribute('required', '');

    const optionDefault = document.createElement('option');

    optionDefault.innerText = 'Choose your office';
    optionDefault.setAttribute('disabled', '');
    optionDefault.setAttribute('selected', '');
    optionDefault.value = '';
    select.append(optionDefault);

    for (const office of offices) {
      const option = document.createElement('option');

      option.value = option.innerText = office;
      select.append(option);
    }

    label.append(select);
  }

  form.append(label);
}

const saveButton = document.createElement('button');

saveButton.innerText = 'Save to table';
form.append(saveButton);
document.body.append(form);

// submit form

form.addEventListener('submit', e => {
  e.preventDefault();

  const fields = [...e.target.elements];

  if (fields.some(field => field.validity.valueMissing)) {
    pushNotification(
      'error',
      'All fields must be filled',
      'error',
    );
  } else if (fields[0].value.length < 4) {
    pushNotification(
      'error',
      'Name must be at least 4 characters long.',
      'error',
    );
  } else if (fields[3].validity.rangeUnderflow
      || fields[3].validity.rangeOverflow) {
    pushNotification(
      'error',
      'Age must be between 18 and 90.',
      'error',
    );
  } else {
    const data = new FormData(form);
    const newRow = tableBody.insertRow(0);

    for (const entry of data.entries()) {
      const newCell = newRow.insertCell();

      if (entry[0] === 'salary') {
        newCell.innerText = `$${Number(entry[1]).toLocaleString('en-US')}`;
        continue;
      }
      newCell.innerText = entry[1];
    };

    pushNotification(
      'success',
      'User added to table',
      'success',
    );
  }
});

// pushNotification function

const pushNotification = (title, description, type) => {
  const body = document.body;

  body.insertAdjacentHTML('beforeend', `
    <div class="${type} notification" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const message = document.querySelector(`.${type}`);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

// cell edit

const tableCells = tableBody.querySelectorAll('td');

tableCells.forEach(cell => {
  let currentValue;

  cell.addEventListener('dblclick', e => {
    const target = e.target;

    currentValue = target.innerText;

    e.target.innerText = '';

    const cellInput = document.createElement('input');

    cellInput.classList.add('cell-input');
    cellInput.value = currentValue;

    if (target === target.parentElement.children[3]) {
      cellInput.setAttribute('type', 'number');
    };

    if (target === target.parentElement.children[4]) {
      cellInput.setAttribute('type', 'number');
      cellInput.value = Number(currentValue.replace(/\D/g, ''));
    };

    e.target.append(cellInput);

    cellInput.focus();

    const handleCellInput = () => {
      if (cellInput.value.trim() === '') {
        target.innerText = currentValue;
      } else {
        target.innerText = cellInput.value;
      }

      if (target === target.parentElement.children[4]) {
        target.innerText = `$${Number(cellInput.value)
          .toLocaleString('en-US')}`;
      }
    };

    cellInput.addEventListener('blur', () => {
      handleCellInput();
    });

    cellInput.addEventListener('keypress', f => {
      if (f.key === 'Enter') {
        handleCellInput();
      }
    });
  });
});

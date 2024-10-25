'use strict';

const headers = document.querySelectorAll('th');
const tBody = document.querySelector('tBody');
const rows = document.querySelectorAll('tBody tr');
let lastClickedIndex = null;
let activeRow = null;
const array = [...rows];
const copyArray = [...array];
const form = document.createElement('form');
const saveToTable = document.createElement('button');
const minAge = 18;
const maxAge = 90;
const timeout = 2000;

form.classList.add('new-employee-form');

const formFields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Position', name: 'position', type: 'text' },
  {
    label: 'Office',
    name: 'office',
    type: 'select',
    options: [
      'Edinburgh',
      'London',
      'New York',
      'San Francisco',
      'Singapore',
      'Tokyo',
    ],
  },

  {
    label: 'Age',
    name: 'age',
    type: 'number',
    min: 1,
  },

  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    min: 0,
  },
];

formFields.forEach((field) => {
  const fieldLabel = document.createElement('label');

  fieldLabel.textContent = `${field.label}: `;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((optionValue) => {
      const option = document.createElement('option');

      option.value = optionValue;
      option.textContent = optionValue;

      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');

    if (field.min !== undefined) {
      input.setAttribute('min', field.min);
    }
  }

  input.setAttribute('name', field.name);
  input.setAttribute('type', field.type);
  input.setAttribute('data-qa', field.name);

  fieldLabel.appendChild(input);

  form.appendChild(fieldLabel);
});

saveToTable.textContent = 'Save to table';

form.appendChild(saveToTable);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = Array.from(e.target.elements).reduce((data, element) => {
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
      data[element.name] = isNaN(element.value)
        ? element.value
        : parseInt(element.value);
    }

    return data;
  }, {});

  if (!validateForm(formData)) {
    return;
  }

  pushNotification('success', 'Form submitted successfully');

  addRowToTable(formData);
});

headers.forEach((header) => {
  header.addEventListener('click', function (element) {
    const index = element.target.cellIndex;

    if (element.target.tagName !== 'TH') {
      return;
    }
    sortBy(copyArray, index);
  });
});

function sortBy(arrayOf, index) {
  if (lastClickedIndex !== index) {
    let compare;

    switch (index) {
      case 3:
        compare = function (rowA, rowB) {
          return rowA.cells[index].innerHTML - rowB.cells[index].innerHTML;
        };
        break;

      case 4:
        compare = function (rowA, rowB) {
          return (
            Number(
              rowA.cells[index].innerHTML.replace(',', '').replace('$', ''),
            ) -
            Number(
              rowB.cells[index].innerHTML.replace(',', '').replace('$', ''),
            )
          );
        };
        break;

      default:
        compare = function (rowA, rowB) {
          return rowA.cells[index].innerHTML > rowB.cells[index].innerHTML
            ? 1
            : -1;
        };
    }
    arrayOf.sort(compare);

    /*    arrayOf.sort((td1, td2) => {
      if (index === 0 || index === 1 || index === 2) {
        return td1.children[index].innerHTML.localeCompare(
          td2.children[index].innerHTML,
        );
      } else {
        return (
          Number(
            td1.children[index].innerHTML.replace(',', '').replace('$', ''),
          ) -
          Number(
            td2.children[index].innerHTML.replace(',', '').replace('$', ''),
          )
        );
      }
    }); */
    lastClickedIndex = index;
  } else {
    arrayOf.reverse();
  }

  arrayOf.forEach((tr) => {
    tBody.appendChild(tr);
  });
}

tBody.addEventListener('click', (e) => {
  const focusedRow = e.target.closest('TR');

  if (!focusedRow || activeRow === focusedRow) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  activeRow = focusedRow;
  activeRow.classList.add('active');
});

function pushNotification(type, message) {
  const notificationBlock = document.createElement('div');
  const title = document.createElement('h1');
  const phrase = document.createElement('p');

  notificationBlock.setAttribute('data-qa', 'notification');
  notificationBlock.className = `notification ${type}`;
  title.textContent = type[0].toUpperCase() + type.slice(1);
  phrase.textContent = message[0].toUpperCase() + message.slice(1);

  notificationBlock.appendChild(title);
  notificationBlock.appendChild(phrase);
  document.body.appendChild(notificationBlock);

  setTimeout(() => {
    notificationBlock.style.visibility = 'hidden';
  }, timeout);
}

function validateForm(formData) {
  if (
    !formData.name ||
    !formData.position ||
    !formData.age ||
    !formData.salary
  ) {
    pushNotification('error', 'Each field must be filled in');

    return false;
  }

  if (formData.name.length < 4) {
    pushNotification('error', 'Name must be no shorter than 4');

    return false;
  }

  if (formData.age < minAge || formData.age > maxAge) {
    pushNotification('error', `Age must be between ${minAge} and ${maxAge}`);

    return false;
  }

  return true;
}

function addRowToTable(data) {
  const newRow = document.createElement('tr');

  Object.entries(data).forEach(([key, value]) => {
    const newCell = document.createElement('td');

    newCell.textContent =
      key === 'salary' ? `$${value.toLocaleString()}` : value;

    newRow.appendChild(newCell);
  });

  tBody.appendChild(newRow);
}

tBody.addEventListener('dblclick', (e) => {
  const clickedCell = e.target.closest('td');
  const originalValue = clickedCell.textContent;
  const cellInput = document.createElement('input');

  cellInput.classList.add('cell-input');
  clickedCell.textContent = '';
  cellInput.value = originalValue;
  clickedCell.appendChild(cellInput);
  cellInput.focus();

  cellInput.addEventListener('blur', (inputEvent) => {
    clickedCell.textContent = cellInput.value;
  });

  cellInput.addEventListener('keypress', (inputEvent) => {
    if (inputEvent.key === 'Enter') {
      cellInput.blur();
    }
  });
});

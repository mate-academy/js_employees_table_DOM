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

const names = array.map((el) => el.children[0].innerHTML);
/* const positions = array.map((el) => el.children[1].innerHTML); */

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

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.className = type;

  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add('notification', type);
  h2.classList.add('title');

  h2.textContent = title;
  p.textContent = description;

  div.append(h2, p);
  document.body.append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};

formFields.forEach((field) => {
  const fieldLabel = document.createElement('label');

  fieldLabel.innerHTML = `${field.label}: `;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((value) => {
      const option = document.createElement('option');

      option.value = value;
      option.textContent = value;

      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');

    input.setAttribute('min', field.min);
  }

  input.setAttribute('name', field.name);
  input.setAttribute('type', field.type);
  input.setAttribute('data-qa', field.name);

  fieldLabel.appendChild(input);

  form.appendChild(fieldLabel);
});

saveToTable.innerHTML = 'Save to table';

form.appendChild(saveToTable);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = [...e.target.elements].reduce((data, element) => {
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
      data[element.name] = isNaN(element.value)
        ? element.value
        : parseFloat(element.value);
    }

    return data;
  }, {});

  if (validateForm(formData) === false) {
    return;
  }

  pushNotification('Success!', 'Form submitted successfully', 'success');
  names.push(formData.name);
  addRow(formData);
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

function validateForm(formData) {
  if (
    !formData.name ||
    !formData.position ||
    !formData.age ||
    !formData.salary
  ) {
    pushNotification('Warning!', 'Each field must be filled in!', 'error');

    return false;
  }

  if (typeof formData.name !== 'string') {
    pushNotification('Warning!', 'Name should be a string!', 'warning');

    return false;
  }

  if (typeof formData.position !== 'string') {
    pushNotification('Warning!', 'Position should be a string!', 'warning');

    return false;
  }

  if (names.includes(formData.name)) {
    pushNotification('Warning!', 'This name already exist!', 'warning');

    return false;
  }

  if (formData.name.length < 4) {
    pushNotification('Error!', 'Name must not to be shorter than 4!', 'error');

    return false;
  }

  if (formData.age < minAge || formData.age > maxAge) {
    pushNotification(
      'Error!',
      `Age have to be between ${minAge} and ${maxAge}!`,
      'error',
    );

    return false;
  }

  if (formData.position.length < 5) {
    pushNotification(
      'Warning!',
      'Position field have to have more then 5 characters!',
      'error',
    );

    return false;
  }

  return true;
}

function addRow(data) {
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
  const dblclickedCell = e.target.closest('td');
  const lastValue = dblclickedCell.textContent;

  dblclickedCell.textContent = '';

  const cellInput = document.createElement('input');

  cellInput.classList.add('cell-input');
  dblclickedCell.appendChild(cellInput);
  cellInput.focus();

  cellInput.addEventListener('blur', (ee) => {
    dblclickedCell.textContent = lastValue;
  });

  cellInput.addEventListener('keypress', (inputEvent) => {
    if (inputEvent.key === 'Enter') {
      /* dblclickedCell.textContent = ''; */
      dblclickedCell.textContent = cellInput.textContent;
      dblclickedCell.appendChild(cellInput);
      cellInput.blur();
    }
  });
});

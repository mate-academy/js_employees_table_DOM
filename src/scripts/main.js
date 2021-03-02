'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const button = document.createElement('button');

button.innerText = 'Save to table';
button.type = 'button';

const form = document.createElement('form');

form.classList.add('new-employee-form');

body.append(form);

const titelsForLabels = thead.innerText.trim().split(/\s+/);
const cities = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

(function() {
  titelsForLabels.forEach(title => {
    const label = document.createElement('label');

    label.innerText = title + ':';

    const value = ['Age', 'Salary'].includes(title)
      ? 'number'
      : 'text';

    if (title === 'Office') {
      const select = document.createElement('select');

      select.name = title.toLowerCase();
      select.setAttribute('data-qa', title.toLowerCase());

      cities.forEach(citie => {
        const option = document.createElement('option');

        option.innerText = citie;
        select.append(option);
        label.append(select);
      });

      form.append(label);

      return;
    };

    const input = document.createElement('input');

    input.name = title.toLowerCase();
    input.setAttribute('type', value);
    input.setAttribute('data-qa', title.toLowerCase());

    label.append(input);
    form.append(label);
    form.append(button);
  });
})();

let currentCell;

thead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const cellName = e.target.innerText;
  let A, B;

  [...tbody.children].sort((a, b) => {
    if (['Age', 'Salary'].includes(cellName)) {
      [A, B] = cellName === 'Age'
        ? [
          +a.cells[index].innerText,
          +b.cells[index].innerText,
        ]
        : [
          parseFloat(a.cells[index].innerText.slice(1)),
          parseFloat(b.cells[index].innerText.slice(1)),
        ];

      return currentCell === cellName
        ? B - A
        : A - B;
    };
    A = a.cells[index].innerText;
    B = b.cells[index].innerText;

    return currentCell === cellName
      ? B.localeCompare(A)
      : A.localeCompare(B);
  }).forEach(element => {
    tbody.append(element);
  });

  currentCell = currentCell === cellName
    ? undefined
    : cellName;
});

let prevRow;

tbody.addEventListener('click', (ev) => {
  if (prevRow) {
    tbody.children[prevRow - 1].classList.remove('active');
  };
  prevRow = ev.target.parentNode.rowIndex;
  ev.target.parentNode.classList.add('active');
});

button.addEventListener('click', () => {
  const inputName = form.elements.name.value;
  const inputAge = +form.elements.age.value;

  const [isValid, message] = validator(inputName, inputAge);

  if (!isValid) {
    showMessage('ERROR', message, 'error');

    return;
  }

  showMessage('SUCCESS', message, 'success');

  const inputFields = [...form.elements].filter(inputField => {
    return inputField.name;
  });

  const newRow = addNewEmployee(inputFields);

  tbody.append(newRow);
});

tbody.addEventListener('dblclick', (e) => {
  const choseCell = e.target;
  const cellText = choseCell.innerText;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = cellText;

  choseCell.innerText = '';
  choseCell.append(input);

  input.focus();

  input.addEventListener('keydown', (btn) => {
    if (btn.code === 'Enter') {
      choseCell.innerText = input.value || cellText;
    }
  });

  input.addEventListener('blur', () => {
    choseCell.innerText = input.value || cellText;
  });
});

function validator(nameField, ageField) {
  const [minAge, maxAge] = [18, 90];
  const isValidAge = (ageField >= 18 && ageField <= 90);
  const isValidName = (nameField.length >= 4);
  let message;

  if (isValidName && isValidAge) {
    message = 'Employee is successfully added to the table';

    return [true, message];
  }

  message = !isValidName
    ? 'The name must contain no less than 4 letters'
    : `The age must be more than ${minAge} and less than ${maxAge} year`;

  return [false, message];
}

function addNewEmployee(fields) {
  const newTableRow = document.createElement('tr');

  fields.forEach(field => {
    const newTableData = document.createElement('td');

    newTableData.innerText = field.name === 'salary'
      ? '$' + new Intl.NumberFormat('en-US').format(field.value)
      : field.value;

    field.value = '';
    newTableRow.appendChild(newTableData);
  });

  return newTableRow;
};

function showMessage(title, description, type) {
  const massageContainer = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  massageContainer.setAttribute('data-qa', 'notification');
  massageContainer.classList.add('notification', type);

  h2.classList.add('title');
  h2.innerText = title;
  p.innerText = description;

  massageContainer.append(h2, p);
  body.append(massageContainer);

  setTimeout(() => {
    body.removeChild(massageContainer);
  }, 4000);
};

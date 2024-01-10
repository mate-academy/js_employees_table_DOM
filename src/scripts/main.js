/* eslint-disable no-shadow */
/* eslint-disable padding-line-between-statements */
'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const mainRow = table.rows[0];

const sortOrder = Array(mainRow.cells.length).fill(0);

function compareValues(a, b, columnIndex) {
  let aNum, bNum;

  if (columnIndex === 3 || columnIndex === 4) {
    aNum = parseFloat(a.replace('$', '').replace(/,/g, ''));
    bNum = parseFloat(b.replace('$', '').replace(/,/g, ''));
  } else {
    aNum = isNaN(a) ? a : parseFloat(a);
    bNum = isNaN(b) ? b : parseFloat(b);
  }

  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  } else {
    return a.localeCompare(b);
  }
}

mainRow.addEventListener('click', (e) => {
  const clickedCell = e.target.closest('th');

  if (clickedCell) {
    const columnIndex = clickedCell.cellIndex;

    sortOrder[columnIndex] = (sortOrder[columnIndex] + 1) % 3;

    const currentRows = table.tBodies[0].rows;
    const newDataRows = Array.from(currentRows).slice(0);

    newDataRows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim();
      const bValue = b.cells[columnIndex].textContent.trim();

      const orderMultiplier = (sortOrder[columnIndex] === 1) ? 1 : -1;

      return orderMultiplier * compareValues(aValue, bValue, columnIndex);
    });

    table.tBodies[0].innerHTML = '';
    newDataRows.forEach((row) => table.tBodies[0].appendChild(row));
  }
});

for (let i = 0; i < table.rows.length; i++) {
  table.rows[i].addEventListener('click', () => {
    table.rows[i].classList.toggle('active');

    for (let j = 0; j < table.rows.length; j++) {
      if (j !== i) {
        table.rows[j].classList.remove('active');
      }
    }
  });
}

const form = document.createElement('form');
form.classList.add('new-employee-form');

function createLabel(name, type, text) {
  const label = document.createElement('label');
  label.textContent = text;

  const input = document.createElement('input');
  input.name = name;
  input.required = true;
  input.type = type;
  input.setAttribute('data-qa', name);

  label.appendChild(input);
  return label;
}

function createSelect(name, text, optionTexts) {
  const labelOffice = document.createElement('label');
  labelOffice.textContent = text;

  const selectOffice = document.createElement('select');
  selectOffice.name = name;
  selectOffice.required = true;
  selectOffice.setAttribute('data-qa', 'office');

  for (const optionText of optionTexts) {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    selectOffice.appendChild(option);
  }

  labelOffice.appendChild(selectOffice);
  return labelOffice;
}

const inputName = createLabel('name', 'text', 'Name: ');
const inputPosition = createLabel('position', 'text', 'Position: ');
const selectOffice = createSelect(
  'office',
  'Office: ',
  ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'],
);
const inputAge = createLabel('age', 'number', 'Age: ');
const inputSalary = createLabel('salary', 'number', 'Salary: ');

const button = document.createElement('button');
button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(inputName);
form.appendChild(inputPosition);
form.appendChild(selectOffice);
form.appendChild(inputAge);
form.appendChild(inputSalary);
form.appendChild(button);

body.appendChild(form);

function createSalary(str) {
  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(str);

  return formattedSalary;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (form.elements.name.value.length < 4) {
    pushNotification(10, 10,
      'Title of Error message', 'Name must have more than 4 letters',
      'error',
    );
    return;
  }

  if (form.elements.age.value < 18) {
    pushNotification(10, 10,
      'Error', 'Your age must be higher than 18',
      'error',
    );
    return;
  } else if (form.elements.age.value > 90) {
    pushNotification(10, 10,
      'Error', 'Your age must be less than 90',
      'error',
    );
    return;
  }

  const newEmployee = {
    name: form.elements.name.value,
    position: form.elements.position.value,
    office: form.elements.office.value,
    age: parseInt(form.elements.age.value),
    salary: createSalary(form.elements.salary.value),
  };

  const newRow = document.createElement('tr');

  for (const key in newEmployee) {
    const cell = document.createElement('td');
    cell.textContent = newEmployee[key];
    newRow.appendChild(cell);
  }

  table.tBodies[0].appendChild(newRow);

  pushNotification(10, 10,
    'Success', 'New employee has been successfuly added',
    'success',
  );
  form.reset();
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  notification.className = `notification + ${type}`;

  notification.setAttribute('data-qa', 'notification');

  const nTitle = document.createElement('h2');
  nTitle.className = 'title';
  nTitle.textContent = title;

  const nDescription = document.createElement('p');
  const descriptionLines = description.split('\n');

  descriptionLines.forEach(line => {
    nDescription.appendChild(document.createTextNode(line));
    nDescription.appendChild(document.createElement('br'));
  });

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.append(nTitle);
  notification.append(nDescription);
  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};

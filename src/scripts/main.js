'use strict';

// write code here
const headers = document.querySelectorAll('thead > tr > th');
const table = document.querySelector('table');
const tbody = document.querySelector('table > tbody');

const headersList = [];

// cycle to go through headers
for (const header of headers) {
  const span = document.createElement('span');

  span.textContent = header.textContent.trim();
  header.textContent = '';
  header.prepend(span);

  headersList.push(header);

  header.clicked = false;

  header.addEventListener('click', () => {
    const index = [...headers].indexOf(header);

    if (headersList.includes(header)) {
      if (header.clicked === false) {
        sortColumn(index, 'asc');
      } else {
        sortColumn(index, 'desc');
      }
    }
    header.clicked = !header.clicked;
  });
}

const rows = Array.from(table.rows).slice(1);

// function for sorting column
function sortColumn(colIndex, direction) {
  let switching = true;

  // const table = document.querySelector('table');
  while (switching) {
    switching = false;

    for (let i = 0; i < rows.length - 1; i++) {
      let shouldSwitch = false;
      const x = rows[i].getElementsByTagName('td')[colIndex];
      const y = rows[i + 1].getElementsByTagName('td')[colIndex];

      if (!x || !y) {
        continue;
      }

      const textX = x.textContent.trim();
      const textY = y.textContent.trim();

      const isCurrencyX = textX.includes('$') || textX.includes(',');
      const isCurrencyY = textY.includes('$') || textY.includes(',');

      if (isCurrencyX && isCurrencyY) {
        const numX = parseFloat(textX.replace(/[$,]/g, ''));
        const numY = parseFloat(textY.replace(/[$,]/g, ''));

        if (direction === 'asc') {
          if (numX > numY) {
            shouldSwitch = true;
          }
        } else if (direction === 'desc') {
          if (numX < numY) {
            shouldSwitch = true;
          }
        }
      } else {
        if (direction === 'asc') {
          if (textX.toLowerCase() > textY.toLowerCase()) {
            shouldSwitch = true;
          }
        } else if (direction === 'desc') {
          if (textX.toLowerCase() < textY.toLowerCase()) {
            shouldSwitch = true;
          }
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}

// selecting particular row
// const rows = Array.from(table.rows).slice(1);

for (const row of rows) {
  row.addEventListener('click', () => {
    for (const el of rows) {
      el.style.backgroundColor = '';

      for (const cell of el.children) {
        cell.style.color = '';
      }
    }

    row.style.backgroundColor = '#127bab';

    for (const child of row.children) {
      child.style.color = 'white';
    }
  });
}

const body = document.querySelector('body');
const form = document.createElement('form');
const button = document.createElement('button');

form.className = 'new-employee-form';

const selectionList = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < 5; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.required = true;

  switch (i) {
    case 0:
      label.textContent = 'Name: ';
      input.name = 'name';
      input.setAttribute('data-qa', 'name');
      input.type = 'text';
      label.appendChild(input);
      break;
    case 1:
      label.textContent = 'Position: ';
      input.name = 'position';
      input.setAttribute('data-qa', 'position');
      input.type = 'text';
      label.appendChild(input);
      break;
    case 2:
      label.textContent = 'Office: ';

      const select = document.createElement('select');

      for (const city of selectionList) {
        const option = document.createElement('option');

        option.textContent = city;
        select.appendChild(option);
      }
      select.setAttribute('data-qa', 'office');
      select.name = 'office';
      label.appendChild(select);
      break;
    case 3:
      label.textContent = 'Age: ';
      input.name = 'age';
      input.setAttribute('data-qa', 'age');
      input.type = 'number';
      label.appendChild(input);
      break;
    case 4:
      label.textContent = 'Salary: ';
      input.name = 'salary';
      input.setAttribute('data-qa', 'salary');
      input.type = 'number';
      label.appendChild(input);
      break;
  }

  form.appendChild(label);
}

button.textContent = 'Save to table';
button.type = 'submit';
form.appendChild(button);

body.appendChild(form);

form.addEventListener('submit', (eve) => {
  eve.preventDefault();

  const newRow = document.createElement('tr');

  const nameInput = form.querySelector('[name="name"]').value;
  const Name = nameInput.trim();
  const position = form.querySelector('[name="position"]').value;
  const office = form.querySelector('[name="office"]').value;
  const age = form.querySelector('[name="age"]').value;
  const salary = form.querySelector('[name="salary"]').value;

  const formattedSalary = parseInt(salary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const existingError = document.querySelector('.errorMessage');

  if (existingError) {
    existingError.remove();
  }

  if (Name.length < 4 || parseInt(age, 10) < 18 || parseInt(age, 10) > 90) {
    createNotification('', 'red');

    return;
  }

  for (const value of [Name, position, office, age, formattedSalary]) {
    const td = document.createElement('td');

    td.textContent = value;
    newRow.appendChild(td);
  }

  form.reset();

  tbody.appendChild(newRow);

  if (tbody.appendChild(newRow)) {
    createNotification('Great! You successfuly added a new employee!', 'green');
  }
});

function createNotification(message, bgColor) {
  const notification = document.createElement('div');

  notification.className = 'errorMessage';

  Object.assign(notification.style, {
    backgroundColor: bgColor,
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    alignSelf: 'flex-start',
    marginLeft: '12px',
    textAlign: 'center',
    padding: '10px',
  });

  const title = document.createElement('h2');

  if (bgColor === 'red') {
    const nameInput = form.querySelector('[name="name"]').value;
    const Name = nameInput.trim();
    const age = form.querySelector('[name="age"]').value;

    if (Name.length < 4) {
      title.textContent = 'Name must be longer than 4 letters!';
    } else if (parseInt(age, 10) < 18 || parseInt(age, 10) > 90) {
      title.textContent = 'Age must be between 18 and 90!';
    }
  } else {
    title.textContent = message;
  }

  title.style.color = '#fff';

  notification.appendChild(title);
  body.appendChild(notification);
}

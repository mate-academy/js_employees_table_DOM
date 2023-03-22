'use strict';

const thead = document.querySelector('thead');
const headers = thead.querySelectorAll('th');
const tbody = document.querySelector('tbody');

// Table sorting by clicking on the title (in two directions)

thead.addEventListener('click', function(e) {
  const targetIndex = e.target.cellIndex;
  const sort = [...tbody.rows].sort((a, b) => {
    let cellA = a.cells[targetIndex].textContent;
    let cellB = b.cells[targetIndex].textContent;

    if (cellA[0] === '$' || cellB[0] === '$') {
      cellA = +cellA.slice(1).split(',').join('');
      cellB = +cellB.slice(1).split(',').join('');

      return cellA - cellB;
    }

    if (isFinite(cellA) || isFinite(cellB)) {
      return cellA - cellB;
    }

    return cellA.localeCompare(cellB);
  });

  if (e.target.classList.contains('asc')) {
    e.target.classList.remove('asc');
    tbody.append(...sort.reverse());
  } else {
    e.target.classList.add('asc');
    tbody.append(...sort);
  }
});

// When clicks on a row, it becomes selected

tbody.addEventListener('click', function(e) {
  const row = e.target.closest('tr');

  if (e.ctrlKey || e.metaKey) {
    toggleSelect(row);

    return;
  }

  singleSelect(row);
});

function toggleSelect(tr) {
  tr.classList.toggle('active');
}

function singleSelect(tr) {
  const selected = document.querySelectorAll('.active');

  for (const elem of selected) {
    elem.classList.remove('active');
  }
  tr.classList.add('active');
}

// Added a form to the document
// Form allows users to add new employees to the spreadsheet

const form = document.createElement('form');

form.classList.add('new-employee-form');

headers.forEach(head => {
  const label = document.createElement('label');

  label.textContent = head.textContent;

  if (head.textContent === 'Office') {
    const select = document.createElement('select');
    const options = [`Tokyo`, `Singapore`,
      `London`, `New York`, `Edinburgh`, `San Francisco`];

    options.forEach(option => {
      const city = document.createElement('option');

      city.textContent = option;
      select.append(city);
    });

    select.name = head.textContent.toLowerCase();
    select.dataset.qa = head.textContent.toLowerCase();

    label.append(select);
  } else {
    const input = document.createElement('input');

    if (head.textContent === 'Age' || head.textContent === 'Salary') {
      input.type = 'number';
    }

    if (head.textContent === 'Salary') {
      input.step = 1000;
    }

    input.name = head.textContent.toLowerCase();
    input.dataset.qa = head.textContent.toLowerCase();

    label.append(input);
  }

  form.append(label);
});

const submit = document.createElement('button');

submit.textContent = `Save to table`;

form.append(submit);

document.body.append(form);

// Validation of data in form

submit.addEventListener('click', function(e) {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());
  let withoutMistakes = true;

  const validations = {
    name: {
      isValid: dataObject.name.length >= 4,
      message: 'Name could not be less than 4 letters',
    },
    age: {
      isValid: dataObject.age >= 18 && dataObject.age <= 90,
      message: 'Age must be between 18 to 90',
    },
    position: {
      isValid: dataObject.position && dataObject.position.length >= 2,
      message: 'Enter valid position',
    },
    salary: {
      isValid: !isNaN(dataObject.salary) && dataObject.salary > 0,
      message: 'Enter valid salary',
    },
  };

  Object.keys(validations).forEach(key => {
    const validation = validations[key];

    if (!validation.isValid) {
      pushNotification('error', 'Error', validation.message);
      withoutMistakes = false;
    }
  });

  const newRow = document.createElement('tr');

  dataObject.salary = '$' + Number(dataObject.salary).toLocaleString('en-US');

  Object.values(dataObject).forEach(value => {
    const cell = document.createElement('td');

    cell.textContent = value;

    newRow.append(cell);
  });

  if (withoutMistakes) {
    tbody.append(newRow);

    form.querySelectorAll('input').forEach(field => {
      field.value = '';
    });
  }
});

// Editing of table by double click
tbody.addEventListener('dblclick', (e) => {
  const prevText = e.target.textContent;
  const index = e.target.cellIndex;

  e.target.textContent = '';

  let input = document.createElement('input');

  input.classList.add('cell-input');

  if (index === 2) {
    const select = document.createElement('select');
    const options = [`Tokyo`, `Singapore`,
      `London`, `New York`, `Edinburgh`, `San Francisco`];

    options.forEach(option => {
      const city = document.createElement('option');

      city.textContent = option;
      city.value = option;
      select.append(city);
    });

    input = select;
  }

  if (index === 3) {
    input.type = 'number';
  }

  if (index === 4) {
    input.type = 'number';
    input.step = 1000;
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (index) {
      case 0:
        if (input.value.length < 4) {
          pushNotification('error', 'Error',
            'Name should have more than 4 letters');
          e.target.textContent = prevText;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 1:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          pushNotification('error', 'Error', 'Enter valid position');
          e.target.textContent = prevText;
        }
        break;

      case 2:
        (input.value)
          ? e.target.textContent = input.value
          : e.target.textContent = prevText;
        break;

      case 3:
        if (input.value < 18) {
          pushNotification('error', 'Error', 'Age must be more than 18');
          e.target.textContent = prevText;
        } else if (input.value > 90) {
          pushNotification('error', 'Error', 'Age must be less than 90');
          e.target.textContent = prevText;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 4:
        if (input.value) {
          e.target.textContent = '$'
          + Number(input.value).toLocaleString('en-US');
        } else {
          pushNotification('error', 'Error', 'Enter valid salary');
          e.target.textContent = prevText;
        }
        break;

      default:
        pushNotification('error', 'Error', 'Unexpected error...');
    }

    input.remove();
  });

  input.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

// Notification

function pushNotification(type, title, description) {
  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  message.append(h2, p);

  message.classList.add('notification', type);

  message.dataset.qa = 'notification';

  h2.innerText = title;
  h2.classList.add('title');
  p.innerText = description;

  document.body.append(message);

  setTimeout(function() {
    message.remove();
  }, 2000);
}

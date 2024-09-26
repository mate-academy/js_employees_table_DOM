'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const heads = thead.querySelectorAll('th');

// click on a row
tbody.addEventListener('click', (e) => {
  [...tbody.rows].forEach(row => {
    row.classList.remove('active');
  });

  e.target.parentElement.classList.add('active');
});

// sort the table

heads.forEach(h => {
  h.addEventListener('click', (e) => {
    heads.forEach(head => {
      if (head.classList.contains('asc') && head !== e.target) {
        head.classList.remove('asc');
      }
    });

    e.target.classList.toggle('asc');

    const index = e.target.cellIndex;

    const sorted = [...tbody.rows].sort((prev, curr) => {
      let prevContent = prev.cells[index].innerHTML;
      let currContent = curr.cells[index].innerHTML;

      if (index === 4) {
        prevContent = Number(prevContent.slice(1).replace(',', ''));
        currContent = Number(currContent.slice(1).replace(',', ''));

        if (e.target.classList.contains('asc')) {
          return prevContent - currContent;
        } else {
          return currContent - prevContent;
        }
      }

      if (index === 3) {
        if (e.target.classList.contains('asc')) {
          return prevContent - currContent;
        } else {
          return currContent - prevContent;
        }
      }

      if (e.target.classList.contains('asc')) {
        return prevContent.localeCompare(currContent);
      } else {
        return currContent.localeCompare(prevContent);
      }
    });

    tbody.innerHTML = '';

    sorted.forEach(row => {
      tbody.append(row);
    });
  });
});

// add form

const form = document.createElement('form');

form.classList.add('new-employee-form');

heads.forEach(head => {
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

document.body.append(form);

// submit button

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());

  if (dataObject.name.length < 4) {
    pushNotification('error', 'Error',
      'Name should contain more than 4 letters');
  } else if (Number(dataObject.age) < 18) {
    pushNotification('error', 'Error', 'Age must be more than 18');
  } else if (Number(dataObject.age) > 90) {
    pushNotification('error', 'Error', 'Age must be less than 90');
  } else if (!dataObject.position || !dataObject.salary) {
    pushNotification('error', 'Error', 'All fields are required');
  } else {
    pushNotification('success', 'Success', 'New employee was added');

    const newRow = document.createElement('tr');

    dataObject.salary = '$' + Number(dataObject.salary).toLocaleString('en-US');

    Object.values(dataObject).forEach(value => {
      const newCell = document.createElement('td');

      newCell.textContent = value;
      newRow.append(newCell);
    });

    tbody.append(newRow);

    form.querySelectorAll('input').forEach(field => {
      field.value = '';
    });
  }
});

// editing on double click

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

          return;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 1:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          pushNotification('error', 'Error', 'Enter data, please');
          e.target.textContent = prevText;

          return;
        }
        break;

      case 2:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          e.target.textContent = prevText;
        }
        break;

      case 3:
        if (input.value < 18) {
          pushNotification('error', 'Error', 'Age must be more than 18');
          e.target.textContent = prevText;

          return;
        } else if (input.value > 90) {
          pushNotification('error', 'Error', 'Age must be less than 90');
          e.target.textContent = prevText;

          return;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 4:
        if (input.value) {
          e.target.textContent = '$'
          + Number(input.value).toLocaleString('en-US');
        } else {
          pushNotification('error', 'Error', 'Enter data, please');
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

// notification function
function pushNotification(type, title, description) {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="notification ${type}" data-qa="notification">
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  </div>
  `);

  setTimeout(() => document.querySelector('.notification').remove(), 3000);
}

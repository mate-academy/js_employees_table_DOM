'use strict';

// const body = document.querySelector('body');
const table = document.querySelector('table');
const sortQuery = document.querySelectorAll('th');
const sortValue = document.querySelector('tbody');
const rows = [...sortValue.children];
const cells = document.querySelectorAll('td');

let sortOrder = -1; // 1 for ascending, -1 for descending

sortQuery.forEach((item) => {
  item.addEventListener('click', sortHandler);
});

rows.forEach((row) => {
  row.addEventListener('click', (e) => {
    rows.forEach((r) => {
      r.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
  });
});

function sortHandler(e) {
  const idx = e.target.cellIndex;

  sortOrder = sortOrder * -1; // Toggle sort order

  rows
    .sort((a, b) => {
      if (idx === 4) {
        return (
          (convertToNumber(a.children[idx].textContent) -
            convertToNumber(b.children[idx].textContent)) *
          sortOrder
        );
      }

      return (
        a.children[idx].textContent.localeCompare(b.children[idx].textContent) *
        sortOrder
      );
    })
    .forEach((item) => {
      sortValue.appendChild(item);
    });
}

function convertToNumber(str) {
  const clearStr = str.replaceAll(',', '').slice(1);

  return Number(clearStr);
}

// Add new employee form
const form = document.createElement('form');

form.classList.add('new-employee-form');

const formFields = [
  {
    type: 'text',
    name: 'name',
    placeholder: 'Name:',
    dataQa: 'name',
  },
  {
    type: 'text',
    name: 'position',
    placeholder: 'Position: ',
    dataQa: 'position',
  },
  {
    type: 'number',
    name: 'age',
    placeholder: 'Age:',
    dataQa: 'age',
  },
  {
    type: 'number',
    name: 'salary',
    placeholder: 'Salary:',
    dataQa: 'salary',
  },
];

formFields.forEach((field) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = field.placeholder;
  input.classList.add('cell-input');
  input.setAttribute('type', field.type);
  input.setAttribute('name', field.name);
  input.setAttribute('data-qa', field.dataQa);
  input.setAttribute('required', true);
  label.appendChild(input);
  form.appendChild(label);
});

const select = document.createElement('select');
const label1 = document.createElement('label');

label1.textContent = 'Office:';
select.classList.add('cell-input');
select.setAttribute('name', 'office');
select.setAttribute('data-qa', 'office');
select.setAttribute('required', true);

const offices = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.textContent = office;
  option.classList.add('cell-input');
  select.appendChild(option);
});

label1.appendChild(select);

form.insertBefore(label1, form.children[2]);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';
form.appendChild(button);

table.after(form);

form.addEventListener('submit', formHandler);

// Add new employee form

function formHandler(e) {
  e.preventDefault();

  const data = {};

  Array.from(e.target.elements).forEach((el) => {
    if (el.name) {
      data[el.name] = el.value;
    }
  });

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(data.salary);

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
  <td>${data.name}</td>
  <td>${data.position}</td>
  <td>${data.office}</td>
  <td>${data.age}</td>
  <td>${formattedSalary}</td>
`;

  if (validation(data)) {
    sortValue.appendChild(newRow);
    form.reset();
  }
}

// validation
function validation({ name: elName, position, age, salary, office }) {
  let result = false;
  const notification = document.createElement('div');
  const notTitle = document.createElement('h3');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');
  notTitle.classList.add('title');
  notification.style.display = 'block';

  if (elName.length < 4) {
    notification.classList.add('error');
    notTitle.textContent = 'Length of name should be more than 3 characters';
  } else if (age < 18 || age > 90) {
    notification.classList.add('error');
    notTitle.textContent = 'Age should be between 18 and 90';
  } else if (position.length < 4) {
    notification.classList.add('warning');

    notTitle.textContent =
      'Length of position should be more than 3 characters';
  } else {
    notification.classList.add('success');
    notTitle.textContent = 'Success';
    result = true;
  }

  notification.append(notTitle);

  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.replaceWith(notification);
  } else {
    document.body.appendChild(notification);
  }

  // const notificationEl = document.querySelector('.notification');

  // if (notificationEl) {
  //   notificationEl.replaceWith(notification);
  // } else {
  //   form.after(notification);
  // }

  setTimeout(() => document.querySelector('.notification').remove(), 5000);

  return result;
}

// EXTRA TASK

cells.forEach((cell) => {
  cell.addEventListener('dblclick', (e) => {
    const originalText = e.target.textContent;
    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = originalText;
    e.target.textContent = '';
    e.target.appendChild(input);

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        e.target.textContent = originalText;
      } else {
        e.target.textContent = input.value;
      }
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        input.blur();
      }
    });

    input.focus();
  });
});

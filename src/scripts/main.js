'use strict';

const headerRows = document.querySelector('tr').children;
const headerRowsDesc = [...headerRows];
const employees = document.querySelector('tbody').querySelectorAll('tr');
const employeesArr = [];
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');
let count = 0;

employees.forEach((el) => {
  const employeeName = el.children[0];
  const employeePosition = el.children[1];
  const employeeOffice = el.children[2];
  const employeeAge = el.children[3];
  const employeeSalary = el.children[4];

  employeesArr.push({
    employeeName,
    employeePosition,
    employeeOffice,
    employeeAge,
    employeeSalary,
  });
});

headerRowsDesc.forEach((title) => {
  let compare = null;

  title.addEventListener('click', () => {
    switch (title.textContent) {
      case 'Name':
        compare = function (a, b) {
          return a.employeeName.textContent
            .toLowerCase()
            .localeCompare(b.employeeName.textContent.toLowerCase());
        };

        break;

      case 'Position':
        compare = function (a, b) {
          return a.employeePosition.textContent
            .toLowerCase()
            .localeCompare(b.employeePosition.textContent.toLowerCase());
        };

        break;

      case 'Office':
        compare = function (a, b) {
          return a.employeeOffice.textContent
            .toLowerCase()
            .localeCompare(b.employeeOffice.textContent.toLowerCase());
        };

        break;

      case 'Age':
        compare = function (a, b) {
          return (
            Number(a.employeeAge.textContent) -
            Number(b.employeeAge.textContent)
          );
        };

        break;

      case 'Salary':
        compare = function (a, b) {
          return validaemployeeDescing(a) - validaemployeeDescing(b);
        };

        break;

      default:
        break;
    }
    count++;

    if (count > 1) {
      const originalCompare = compare;

      compare = function (a, b) {
        return -originalCompare(a, b);
      };

      count = 0;
    }

    employeesArr.sort(compare);
    tbody.innerHTML = '';

    employeesArr.forEach((arrEl) => {
      const tr = document.createElement('tr');

      for (const key in arrEl) {
        const td = document.createElement('td');

        td.textContent = arrEl[key].textContent;
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });
  });
});

function validaemployeeDescing(item) {
  return Number(item.employeeSalary.textContent.replace(/[$,]/g, ''));
}

// event delegation on tbody
tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');
  // we are looking for row the way we find event's targets

  if (!clickedRow) {
    return;
  }

  // deleting active class from all rows
  tbody.querySelectorAll('tr').forEach((element) => {
    element.classList.remove('active');
  });

  clickedRow.classList.add('active');
});
// script for employee formular

const submitBtn = document.createElement('button');
const form = document.createElement('form');
const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    tag: 'input',
  },
  {
    name: 'position',
    label: 'Position',
    type: 'text',
    tag: 'input',
  },
  {
    name: 'office',
    label: 'Office',
    tag: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'Tokyo',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    tag: 'input',
  },
  {
    name: 'salary',
    label: 'Salary',
    type: 'number',
    tag: 'input',
  },
];

form.classList.add('new-employee-form');

for (const field of fields) {
  const label = document.createElement('label');
  let input = null;

  label.textContent = field.label + ':';

  if (field.tag !== 'select') {
    input = document.createElement('input');
    input.type = field.type;
  }

  if (field.tag === 'select') {
    input = document.createElement('select');

    for (const optionValue of field.options) {
      const option = document.createElement('option');

      option.value = optionValue;
      option.textContent = optionValue;
      input.appendChild(option);
    }
  }

  input.name = field.name;
  input.setAttribute('data-qa', field.name);
  input.required = true;

  label.appendChild(input);
  form.appendChild(label);
}

submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  // taking all inputs in an array of objects with key, value
  const employee = document.createElement('tr');
  // creating row for the new employee

  for (const [key, value] of formData.entries()) {
    const td = document.createElement('td');

    switch (key) {
      case 'name':
        if (value.length < 4) {
          pushNotification(
            'Invalid name!',
            'Name should have at least 4 letters',
            'error',
          );

          return;
        }
        break;

      case 'age':
        if (/[^0-9]/.test(value)) {
          pushNotification(
            'Invalid age!',
            'Age should constains only numbers',
            'error',
          );

          return;
        }

        if (Number(value) < 18 || Number(value) > 90) {
          pushNotification(
            'Invalid age!',
            'Age should be from 18 to 90',
            'error',
          );

          return;
        }
        break;
    }

    if (key === 'salary') {
      // we need to validate string for salary row
      const number = Number(value);

      td.textContent = `$${number.toLocaleString('en-US')}`;
      // we use en-US to divide number with commas
    } else {
      td.textContent = value;
    }

    employee.appendChild(td);
  }
  tbody.appendChild(employee);

  pushNotification(
    'Complete!',
    'Adding new employee was successful',
    'success',
  );
});

body.appendChild(form);

function pushNotification(titleValue, descriptionValue, type) {
  const block = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('p');
  const notiffCount = body.querySelectorAll('.notification').length;
  const posRight = 10;
  let posTop = 10;
  const blocks = body.querySelectorAll('.notification');
  const lastBlock = blocks[blocks.length - 1];

  description.textContent = descriptionValue;
  block.classList.add('notification');

  switch (type) {
    case 'warning':
      block.classList.add('warning');
      break;

    case 'success':
      block.classList.add('success');
      break;

    case 'error':
      block.classList.add('error');
      break;
  }

  if (notiffCount === 0) {
    posTop = 10;
  }

  if (lastBlock) {
    const stylepreviousBlock = getComputedStyle(lastBlock);

    switch (stylepreviousBlock.top) {
      case '10px':
        posTop = 140;
        break;

      case '140px':
        posTop = 270;
        break;

      default:
        break;
    }
  }

  block.style.top = `${posTop}px`;
  block.style.right = `${posRight}px`;
  title.textContent = titleValue;
  description.textContent = descriptionValue;
  block.setAttribute('data-qa', 'notification');

  block.appendChild(title);
  block.appendChild(description);

  body.appendChild(block);

  setTimeout(() => {
    block.remove();
  }, 2000);
}

'use strict';

const headerRows = document.querySelector('tr').children;
const headerRowsDesc = [...headerRows];
const employees = document.querySelector('tbody').querySelectorAll('tr');
const employeesArr = [];
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

employees.forEach((el) => {
  const employeeName = el.children[0].textContent;
  const employeePosition = el.children[1].textContent;
  const employeeOffice = el.children[2].textContent;
  const employeeAge = el.children[3].textContent;
  const employeeSalary = el.children[4].textContent;

  employeesArr.push({
    employeeName,
    employeePosition,
    employeeOffice,
    employeeAge,
    employeeSalary,
  });
});
// #region sort

headerRowsDesc.forEach((title) => {
  title.setAttribute('direction', 'asc');
});

headerRowsDesc.forEach((title) => {
  let compare = null;

  title.addEventListener('click', () => {
    switch (title.textContent) {
      case 'Name':
        compare = function (a, b) {
          return a.employeeName
            .toLowerCase()
            .localeCompare(b.employeeName.toLowerCase());
        };

        break;

      case 'Position':
        compare = function (a, b) {
          return a.employeePosition
            .toLowerCase()
            .localeCompare(b.employeePosition.toLowerCase());
        };

        break;

      case 'Office':
        compare = function (a, b) {
          return a.employeeOffice
            .toLowerCase()
            .localeCompare(b.employeeOffice.toLowerCase());
        };

        break;

      case 'Age':
        compare = function (a, b) {
          return Number(a.employeeAge) - Number(b.employeeAge);
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

    let checkDirection = 0;
    // this checker checks if we had an click on this title already
    // we need because when we see 'desc' we change our  compare function
    // and change our direction attr, but then we continue our logic
    // where we are changing direction again, so as soon as I cannot use
    // 'continue' or 'break' statements I decided to use this checker

    // firsly we check if attr 'direction' is set to desc
    //  (already has been clicked)
    // if yes we changed the compare function
    if (title.getAttribute('direction') === 'desc') {
      checkDirection = 1;

      const originalCompare = compare;

      compare = function (a, b) {
        return -originalCompare(a, b);
      };
      title.setAttribute('direction', 'asc');
      employeesArr.sort(compare);
      renderEmployees(employeesArr, tbody);
    }
    // we sort arr and add the new sorted list to the table
    // with renderEmployees func

    if (!checkDirection) {
      employeesArr.sort(compare);
      renderEmployees(employeesArr, tbody);
      title.setAttribute('direction', 'desc');
    }
  });
});

function validaemployeeDescing(item) {
  return Number(item.employeeSalary.replace(/[$,]/g, ''));
}

// #endregion

// #region delegation on tbody, 'clicked row'
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
// #endregion

// #region script for employee formular

const submitBtn = document.createElement('button');
const form = document.createElement('form');
const fields = [
  {
    name: 'employeeName',
    label: 'Name',
    type: 'text',
    tag: 'input',
  },
  {
    name: 'employeePosition',
    label: 'Position',
    type: 'text',
    tag: 'input',
  },
  {
    name: 'employeeOffice',
    label: 'Office',
    tag: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    name: 'employeeAge',
    label: 'Age',
    type: 'number',
    tag: 'input',
  },
  {
    name: 'employeeSalary',
    label: 'Salary',
    type: 'number',
    tag: 'input',
  },
];

form.classList.add('new-employee-form');

// off validate and let button send form
form.setAttribute('novalidate', 'true');

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
  const employee = {};
  // creating row for the new employee

  for (const [key, value] of formData.entries()) {
    switch (key) {
      case 'employeePosition':
        if (value.trim() === '' || /[0-9]/.test(value)) {
          pushNotification(
            'Invalid position!',
            'Position should not be empty or contain numbers',
            'error',
          );

          return;
        }
        break;

      case 'employeeName':
        if (value.length < 4) {
          pushNotification(
            'Invalid name!',
            'Name should have at least 4 letters',
            'error',
          );

          return;
        }
        break;

      case 'employeeAge':
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

    if (key === 'employeeSalary') {
      // we need to validate string for salary row
      const number = Number(value);

      employee[key] = `$${number.toLocaleString('en-US')}`;

      // we use en-US to separate number with commas
    } else {
      employee[key] = value;
    }
  }

  employeesArr.push(employee);

  renderEmployees(employeesArr, tbody);

  pushNotification(
    'Complete!',
    'Adding new employee was successful',
    'success',
  );
});

body.appendChild(form);

function renderEmployees(arrEmp, bodyToInsert) {
  bodyToInsert.innerHTML = '';

  for (const employee of arrEmp) {
    const row = document.createElement('tr');

    for (const key of Object.keys(employee)) {
      const td = document.createElement('td');

      td.textContent = employee[key];
      row.appendChild(td);
    }
    bodyToInsert.appendChild(row);
  }
}

// #endregion

// #region notifications

const container = document.createElement('div');

container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.position = 'absolute';
container.style.gap = '10px';
container.style.top = '10px';
container.style.right = '10px';
container.style.width = '300px';
body.appendChild(container);

function pushNotification(titleValue, descriptionValue, type) {
  const block = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('p');

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
    default:
      break;
  }

  title.textContent = titleValue;
  description.textContent = descriptionValue;
  block.setAttribute('data-qa', 'notification');
  block.style.position = 'relative';
  block.appendChild(title);
  block.appendChild(description);
  container.appendChild(block);

  setTimeout(() => {
    block.remove();
  }, 2000);
}
// #endregion

// employeesArr.forEach((el) => console.log(el)
// )

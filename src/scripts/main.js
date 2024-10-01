'use strict';

const headerTitle = document.querySelectorAll('th');
const sortedRows = document.querySelectorAll('tbody tr');
const sortedRowsToArr = Array.from(sortedRows);
const docBody = document.querySelector('body');
const tBody = document.querySelector('tbody');

let lastSortedColumnIndex = null;
let isAsc = true;

const inputsConfig = [
  {
    label: 'Name: ',
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    label: 'Position: ',
    name: 'position',
    type: 'text',
    required: true,
  },
  {
    label: 'Office: ',
    name: 'office',
    type: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New-York',
      'Edinburg',
      'San Francisco',
    ],
    required: true,
  },
  {
    label: 'Age: ',
    name: 'age',
    type: 'number',
    required: true,
  },
  {
    label: 'Salary: ',
    name: 'salary',
    type: 'number',
    required: true,
  },
];

function createForm(inputsConfigs) {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  inputsConfig.forEach((config) => {
    const formGroup = document.createElement('div');

    formGroup.style.display = 'flex';
    formGroup.style.alignItems = 'center';
    formGroup.style.marginBottom = '10px';

    const label = document.createElement('label');

    label.textContent = config.label;
    label.setAttribute('for', config.name);

    label.style.marginRight = '10px';
    label.style.width = '100px';

    let input;

    if (config.type === 'select') {
      input = document.createElement('select');

      config.options.forEach((optionValue) => {
        const option = document.createElement('option');

        option.value = optionValue;
        option.textContent = optionValue;
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.type = config.type;
    }

    input.name = config.name;
    input.id = config.name;
    input.dataset.qa = config.name;

    if (config.required) {
      input.required = true;
    }

    input.style.flex = '1';

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  form.appendChild(button);

  return { form, formButton: button };
}

const { form, formButton } = createForm(inputsConfig);

docBody.appendChild(form);

sortedRowsToArr.forEach((row) => {
  row.addEventListener('click', () => {
    sortedRowsToArr.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

headerTitle.forEach((head) => {
  head.addEventListener('click', (e) => {
    const indexRow = e.target.cellIndex;

    if (lastSortedColumnIndex === indexRow) {
      isAsc = !isAsc;
    } else {
      isAsc = true;
    }

    lastSortedColumnIndex = indexRow;

    sortedSort(sortedRowsToArr, indexRow);
  });
});

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    pushNotification(
      500,
      10,
      'Form Error',
      'Please fill out all required fields.',
      'error',
    );

    return;
  }

  const employeeName = form.querySelector('[name="name"]').value;
  const position = form.querySelector('[name="position"]').value;
  const office = form.querySelector('[name="office"]').value;
  const age = form.querySelector('[name="age"]').value;
  const salaryValue = parseFloat(form.querySelector('[name="salary"]').value);
  const salary = salaryValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  if (employeeName.length < 4) {
    pushNotification(
      500,
      10,
      'Wrong name',
      'Name must be longer than 3 symbols',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      500,
      10,
      'Wrong age',
      'Age must be more than 18 and less than 90',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tdName.textContent = employeeName;
  tdPosition.textContent = position;
  tdOffice.textContent = office;
  tdAge.textContent = age;
  tdSalary.textContent = salary;

  newRow.appendChild(tdName);
  newRow.appendChild(tdPosition);
  newRow.appendChild(tdOffice);
  newRow.appendChild(tdAge);
  newRow.appendChild(tdSalary);
  tBody.appendChild(newRow);

  sortedRowsToArr.push(newRow);

  pushNotification(500, 10, 'Great!', 'Employee add to the table', 'success');

  form.reset();
});

function sortedSort(titles, indexRow) {
  titles.sort((a, b) => {
    const cellTextA = a.querySelectorAll('td')[indexRow].textContent;
    const cellTextB = b.querySelectorAll('td')[indexRow].textContent;

    if (indexRow === 0 || indexRow === 1 || indexRow === 2) {
      if (isAsc) {
        return cellTextA.localeCompare(cellTextB);
      } else {
        return cellTextB.localeCompare(cellTextA);
      }
    }

    if (indexRow === 3 || indexRow === 4) {
      const numA = parseFloat(cellTextA.replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(cellTextB.replace(/[^0-9.-]+/g, ''));

      if (isAsc) {
        return numA - numB;
      } else {
        return numB - numA;
      }
    }
  });

  const bodyT = document.querySelector('tbody');

  bodyT.innerHTML = '';

  titles.forEach((row) => {
    bodyT.appendChild(row);
  });
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const element = document.createElement('div');

  element.style.top = posTop + 'px';
  element.style.right = posRight + 'px';

  element.classList.add('notification', type);
  element.setAttribute('data-qa', 'notification');

  const message = document.createElement('h2');

  message.classList.add('title');

  message.textContent = title;

  const text = document.createElement('p');

  text.textContent = description;

  element.appendChild(message);
  element.appendChild(text);
  docBody.appendChild(element);

  setTimeout(() => {
    element.style.display = 'none';
  }, 2000);
};

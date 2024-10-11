'use strict';

const DESC = 'desc';
const ASC = 'asc';
const HEADERS = ['name', 'position', 'office', 'age', 'salary'];
const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const itemCollection = document.querySelectorAll('tbody tr');
const tableHeader = document.querySelector('thead tr');
const tableBody = document.querySelector('tbody');

const items = [...itemCollection].map((item) => {
  const collection = item.querySelectorAll('td');

  return HEADERS.reduce(
    (prev, current, index) => ({
      ...prev,
      [current]: collection[index].innerText,
    }),
    {},
  );
});

function rebuildList(data) {
  tableBody.innerHTML = '';

  for (const item of data) {
    const row = document.createElement('tr');

    for (const key in item) {
      const rowData = document.createElement('td');

      rowData.innerText = item[key];
      row.appendChild(rowData);
    }

    tableBody.appendChild(row);
  }
}

tableHeader.addEventListener('click', (e) => {
  const title = e.target.closest('th');

  if (!title) {
    return;
  }

  const targetValue = title.innerText.toLowerCase();

  if (!title.hasAttribute('data-order') || title.dataset.order === DESC) {
    title.setAttribute('data-order', ASC);
  } else {
    title.setAttribute('data-order', DESC);
  }

  items.sort((a, b) => {
    const order = title.dataset.order;

    if (targetValue === 'salary') {
      const aSalary = a[targetValue].slice(1).split(',').join('');
      const bSalary = b[targetValue].slice(1).split(',').join('');

      return order === ASC ? aSalary - bSalary : bSalary - aSalary;
    }

    if (targetValue === 'age') {
      return order === ASC
        ? a[targetValue] - b[targetValue]
        : b[targetValue] - a[targetValue];
    }

    return order === ASC
      ? a[targetValue].localeCompare(b[targetValue])
      : b[targetValue].localeCompare(a[targetValue]);
  });

  rebuildList(items);
});

tableBody.addEventListener('click', (e) => {
  const activeRow = e.target.closest('tr');

  if (!activeRow) {
    return;
  }

  itemCollection.forEach((item) => {
    item.classList.remove('active');
  });

  activeRow.classList.add('active');
});

function addForm() {
  const body = document.body;
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  for (const title of HEADERS) {
    const label = document.createElement('label');

    label.innerText = `${title[0].toUpperCase() + title.slice(1)}:`;

    if (title === 'office') {
      const selectBox = document.createElement('select');

      selectBox.name = title;
      selectBox.setAttribute('data-qa', title);
      selectBox.required = true;

      OFFICES.forEach((office) => {
        const option = document.createElement('option');

        option.value = office;
        option.innerText = office;
        selectBox.appendChild(option);
      });

      label.appendChild(selectBox);
      form.appendChild(label);
      continue;
    }

    const input = document.createElement('input');

    input.name = title;
    input.required = true;

    if (title === 'age' || title === 'salary') {
      input.type = 'number';
      input.min = 0;
    } else {
      input.type = 'text';
    }

    label.appendChild(input);
    form.appendChild(label);
  }

  const button = document.createElement('button');

  button.type = 'submit';
  button.innerText = 'Save to table';

  form.appendChild(button);
  body.appendChild(form);
}

addForm();

const pushNotification = (title, description, type) => {
  const table = document.querySelector('table');

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;
  table.insertAdjacentElement('afterend', notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

if (document.querySelector('.new-employee-form')) {
  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    let isValid = true;
    const newName = data.get('name');
    const age = data.get('age');
    const salary = parseInt(data.get('salary')).toLocaleString('en-US');

    if (newName.length < 4) {
      isValid = false;
      pushNotification('Oops!', 'Value has less than 4 letters', 'error');
    }

    if (+age <= 18 || +age > 90) {
      isValid = false;

      pushNotification(
        'Oops!',
        'Value is less than 18 or more than 90',
        'error',
      );
    }

    if (isValid) {
      const newEmployee = {
        name: newName,
        position: data.get('position'),
        office: data.get('office'),
        age,
        salary: '$' + salary,
      };

      items.push(newEmployee);
      rebuildList(items);

      pushNotification(
        'Success!',
        'New employee has added to list.',
        'success',
      );
    }
  });
}

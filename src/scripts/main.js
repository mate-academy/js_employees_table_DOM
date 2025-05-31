'use strict';

const tbody = document.querySelector('tbody');
const tbodyArr = Array.from(tbody.rows);
const table = document.querySelector('table');
// масив заголовків
const thead = Array.from(document.querySelectorAll('thead th'));

function convertString(str) {
  return parseFloat(str.replace(/[$,]/g, ''));
}

function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => {
      if (word === word.toUpperCase()) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function formatSalary(number) {
  const numeric = Number(number);

  if (isNaN(numeric)) {
    return '$0';
  }

  return `$${numeric.toLocaleString('en-US')}`;
}

function getEmployees() {
  const emplObjects = tbodyArr.map((row) => {
    const cells = row.cells;

    return {
      name: cells[0].innerText,
      position: cells[1].innerText,
      office: cells[2].innerText,
      age: cells[3].innerText,
      salary: cells[4].innerText,
    };
  });

  return emplObjects;
}

function orderTable(array) {
  tbody.innerHTML = '';

  array.forEach((employee) => {
    tbody.insertAdjacentHTML(
      'beforeend',
      `<tr>
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.office}</td>
        <td>${employee.age}</td>
        <td>${employee.salary}</td>
      </tr>`,
    );
  });
}

// обʼєкт, що зберігає всі функції сортування відповідно до ключа
const sortFunctions = {
  Name: (a, b) => a.name.localeCompare(b.name),
  Position: (a, b) => a.position.localeCompare(b.position),
  Office: (a, b) => a.office.localeCompare(b.office),
  Age: (a, b) => a.age - b.age,
  Salary: (a, b) => convertString(a.salary) - convertString(b.salary),
};

// обʼєкт, який зберігає кожен ключ при кліку і присвоює йому стан
// (який змінюється при повторному кліку)
const sortDirections = {};

thead.forEach((th) => {
  th.addEventListener('click', (e) => {
    const key = e.target.innerText.trim();

    const sortFn = sortFunctions[key];

    if (!sortFn) {
      return;
    }

    const employees = getEmployees();

    // визначаємо напрямок сортування
    sortDirections[key] = sortDirections[key] === 'asc' ? 'desc' : 'asc';

    const direction = sortDirections[key];

    const sortedEmp = employees.sort((a, b) => {
      const result = sortFn(a, b);

      return direction === 'asc' ? result : -result;
    });

    orderTable(sortedEmp);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
table.insertAdjacentElement('afterend', form);

const formObject = {
  Name: {
    name: 'name',
    type: 'text',
    required: '',
    'data-qa': 'name',
    minlength: '4',
  },
  Position: {
    name: 'position',
    type: 'text',
    required: '',
    'data-qa': 'position',
    minlength: '2',
  },
  Office: {
    name: 'office',
    type: 'select',
    required: '',
    'data-qa': 'office',
    option: {
      Tokyo: 'Tokyo',
      Singapore: 'Singapore',
      London: 'London',
      'New York': 'New York',
      Edinburgh: 'Edinburgh',
      'San Francisco': 'San Francisco',
    },
  },
  Age: {
    name: 'age',
    type: 'number',
    required: '',
    'data-qa': 'age',
  },
  Salary: {
    name: 'salary',
    type: 'number',
    required: '',
    'data-qa': 'salary',
  },
};

function createFormContent(object, formElement) {
  for (const key in object) {
    const label = document.createElement('label');

    label.innerText = key;

    if (object[key].type === 'select') {
      const select = document.createElement('select');

      select.setAttribute('name', object[key].name);
      select.setAttribute('data-qa', object[key]['data-qa']);
      select.setAttribute('required', '');

      formElement.append(label);
      label.append(select);

      for (const elem in object[key].option) {
        const option = document.createElement('option');

        option.innerText = object[key].option[elem];
        option.setAttribute('value', elem);

        select.append(option);
      }
    } else {
      const input = document.createElement('input');

      input.setAttribute('name', object[key].name);
      input.setAttribute('type', object[key].type);
      input.setAttribute('data-qa', object[key]['data-qa']);
      input.setAttribute('required', '');

      formElement.append(label);
      label.append(input);
    }
  }
}

createFormContent(formObject, form);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault(); // щоб не перезавантажувалась сторінка

  const formData = new FormData(form);

  const tr = document.createElement('tr');

  for (const [key, value] of formData) {
    const td = document.createElement('td');

    if (key === 'salary') {
      td.textContent = formatSalary(value);
    } else {
      td.textContent = capitalizeWords(value);
    }

    tr.appendChild(td);
  }

  const nameInForm = String(formData.get('name')).trim();
  const positionInForm = String(formData.get('position')).trim();
  const latinRegex = /^[A-Za-z\s]+$/;

  if (!latinRegex.test(nameInForm) || !latinRegex.test(positionInForm)) {
    pushNotification(
      100,
      10,
      'Error',
      'Please, use only Latin letters.',
      'error',
    );

    return;
  }

  if (nameInForm.length < 4) {
    pushNotification(
      100,
      10,
      'Error',
      `Please lengthen your name to 4 characters or more (you are currently using ${nameInForm.length} character(s)).`,
      'error',
    );

    return;
  }

  const age = Number(formData.get('age'));

  if (isNaN(age) || age < 18 || age > 90) {
    pushNotification(
      100,
      10,
      'Error',
      'Age must be between 18 and 90',
      'error',
    );

    return;
  }

  tbody.appendChild(tr);

  pushNotification(
    100,
    10,
    'Success',
    `Great! The information has been added to the table.`,
    'success',
  );

  form.reset();
});

const positionInput = form.elements['position'];

positionInput.addEventListener('invalid', (e) => {
  e.preventDefault();

  pushNotification(130, 10, 'Error', 'Please, enter your position.', 'error');
});

function pushNotification(posTop, posRight, title, description, type) {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');

  if (['success', 'error'].includes(type)) {
    message.className = `notification ${type}`;
  } else {
    message.className = 'notification';
  }

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  const messageTitle = document.createElement('h2');

  messageTitle.className = 'title';
  messageTitle.innerHTML = title;
  message.appendChild(messageTitle);

  const messageDescription = document.createElement('p');

  messageDescription.innerHTML = description;
  message.appendChild(messageDescription);

  document.body.append(message);

  setTimeout(() => (message.style.display = 'none'), 2000);
}

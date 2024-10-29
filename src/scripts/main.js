'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');

form.classList.add('new-employee-form');

const formFields = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const fragment = document.createDocumentFragment();

tbody.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    e.target.parentElement.classList.toggle('active');
  }
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const cell = e.target;
    const originalText = cell.textContent;
    const input = document.createElement('input');

    input.type = 'text';
    input.value = originalText;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        cell.textContent = input.value || originalText;
      }
    });

    input.addEventListener('blur', function () {
      cell.textContent = input.value || originalText;
    });
  }
});

formFields.forEach((field) => {
  const normalizeName = field.toLocaleLowerCase();
  const label = document.createElement('label');

  label.textContent = field + ': ';

  if (field === 'Office') {
    const select = document.createElement('select');

    select.setAttribute('name', `${normalizeName}`);

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.textContent = office;
      select.append(option);
    });

    select.setAttribute('data-qa', `${normalizeName}`);
    select.setAttribute('required', true);
    label.append(select);
    fragment.append(label);
  } else {
    const input = document.createElement('input');

    input.setAttribute('data-qa', `${normalizeName}`);
    input.setAttribute('name', `${normalizeName}`);
    input.setAttribute('required', true);

    if (field === 'Age' || field === 'Salary') {
      input.setAttribute('type', 'number');
    } else {
      input.setAttribute('type', 'text');
    }

    if (field === 'Age') {
      input.setAttribute('min', 18);
      input.setAttribute('max', 90);
    }

    label.append(input);
    fragment.append(label);
  }
});

const button = document.createElement('button');

button.textContent = 'Save to table';

fragment.append(button);
form.append(fragment);
document.body.firstElementChild.after(form);

const formBtn = form.querySelector('button');

function addSeparator(num) {
  return num.toLocaleString('en-US');
}

function CustomNotification(title, description, type) {
  this.title = title;
  this.description = description;
  this.type = type;
}

const pushNotification = ({ title, description, type }) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', `${type}`);
  notification.style.top = 15 + 'px';
  notification.style.right = 15 + 'px';

  const fragmentNot = document.createDocumentFragment();
  const titleNot = document.createElement('h2');

  titleNot.classList.add('title');
  titleNot.textContent = title;

  const descriptionNot = document.createElement('p');

  descriptionNot.textContent = description;

  fragmentNot.append(titleNot);
  fragmentNot.append(descriptionNot);
  notification.append(fragmentNot);

  document.body.append(notification);

  setTimeout(() => {
    notification.hidden = true;
  }, 2000);
};

formBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const formValues = {
    employeeName: form.elements.name.value,
    position: form.elements.position.value,
    office: form.elements.office.value,
    age: form.elements.age.value,
    salary: form.elements.salary.value.trim(),
  };

  const formSalaryValue =
    !formValues.salary || isNaN(formValues.salary)
      ? ''
      : '$' + addSeparator(+formValues.salary);

  const fields = validateFormFields(formValues);

  pushNotification(fields[0]);

  if (fields[0].type === 'success') {
    const row = addRow([
      formValues.employeeName,
      formValues.position,
      formValues.office,
      formValues.age,
      formSalaryValue,
    ]);

    tbody.append(row);
  }

  form.reset();
});

function validateFormFields({ employeeName, position, office, age, salary }) {
  const notifications = [];

  if (employeeName.length < 4) {
    notifications.push(
      new CustomNotification(
        'Error',
        'Name must be at least 4 characters long',
        'error',
      ),
    );
  }

  if (!position.trim()) {
    notifications.push(
      new CustomNotification('Error', 'Position cannot be empty', 'error'),
    );
  }

  if (!office.trim() || !offices.includes(office)) {
    notifications.push(
      new CustomNotification(
        'Error',
        'Office cannot be empty, and should contain one of the defined options',
        'error',
      ),
    );
  }

  if (age < 18 || age > 90) {
    notifications.push(
      new CustomNotification('Error', 'Age must be between 18 and 90', 'error'),
    );
  }

  if (salary <= 0 || isNaN(salary)) {
    notifications.push(
      new CustomNotification(
        'Error',
        'The value of salary must be a number greater than 0',
        'error',
      ),
    );
  }

  if (notifications.length === 0) {
    notifications.push(
      new CustomNotification('Success', 'Data successfully added', 'success'),
    );
  }

  return notifications;
}

function addRow(fields) {
  const row = document.createElement('tr');

  fields.forEach((field) => {
    const td = document.createElement('td');

    td.textContent = field;
    row.append(td);
  });

  return row;
}

const headers = document.querySelectorAll('thead th');

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const index = header.cellIndex;
    const currentSort = header.dataset.sort;
    const newSortOrder =
      !currentSort || currentSort === 'DESC' ? 'ASC' : 'DESC';

    headers.forEach((h) => delete h.dataset.sort);
    header.dataset.sort = newSortOrder;

    let rows = [...table.querySelectorAll('tr:has(td)')];

    rows = sortedRows(rows, header.textContent, index, newSortOrder);

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.append(row));
  });
});

function sortedRows(arr, val, i, order) {
  switch (val) {
    case 'Age':
      return arr.sort((a, b) => {
        const first = +a.cells[i].textContent;
        const second = +b.cells[i].textContent;

        return order === 'DESC' ? second - first : first - second;
      });

    case 'Salary':
      return arr.sort((a, b) => {
        const rowA = parseFloat(a.cells[i].textContent.trim().slice(1));
        const rowB = parseFloat(b.cells[i].textContent.trim().slice(1));

        return order === 'DESC' ? rowB - rowA : rowA - rowB;
      });

    default:
      return arr.sort((a, b) => {
        const rowA = a.cells[i].textContent.trim();
        const rowB = b.cells[i].textContent.trim();

        return order === 'DESC'
          ? rowB.localeCompare(rowA)
          : rowA.localeCompare(rowB);
      });
  }
}

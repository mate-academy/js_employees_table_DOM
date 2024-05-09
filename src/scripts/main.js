/* eslint-disable no-shadow */
'use strict';

const head = document.querySelector('thead');
const body = document.querySelector('tbody');
let sortOrder = 'ASC';
let sortColumnIndex = -1;
const inputs = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
let isEnterPressed = false;

// #region validation
const validateName = (name) => {
  if (name.length < 4) {
    pushNotification(
      'Name Error',
      'Name value has less than 4 letters',
      'error',
    );

    return true;
  }

  return false;
};

const validateSalary = (salary) => {
  if (isNaN(salary)) {
    pushNotification('Salary Error', 'Salary must be a number', 'error');

    return true;
  }

  return false;
};

const validateAge = (age) => {
  if (isNaN(age)) {
    pushNotification('Age Error', 'Age must be a number', 'error');

    return true;
  }

  if (+age < 18 || +age > 90) {
    pushNotification(
      'Age Error',
      'Age value is less than 18 or more than 90',
      'error',
    );

    return true;
  }

  return false;
};

const validateRequired = (value) => {
  if (value.length === 0) {
    pushNotification('Error', 'All fields are required', 'error');

    return true;
  }

  return false;
};

const validation = (values) => {
  let hasError = false;

  for (const fieldsValue of values) {
    const { key, value } = fieldsValue;

    hasError = validateRequired(value) ? true : hasError;

    if (key === 'name') {
      hasError = validateName(value) ? true : hasError;
    }

    if (key === 'age') {
      hasError = validateAge(value) ? true : hasError;
    }
  }

  return hasError;
};
// #endregion

head.addEventListener('click', (e) => {
  const rows = [...document.querySelectorAll('tbody tr')];
  const index = [...e.target.parentNode.children].indexOf(e.target);

  if (sortColumnIndex === index && sortOrder === 'ASC') {
    sortOrder = 'DESC';
  } else {
    sortColumnIndex = index;
    sortOrder = 'ASC';
  }

  rows.sort((row1, row2) => {
    const columns1 = [...row1.querySelectorAll('td')];
    const columns2 = [...row2.querySelectorAll('td')];
    const cell1 = columns1[index].textContent;
    const cell2 = columns2[index].textContent;

    if (index <= 2) {
      return sortOrder === 'ASC'
        ? cell1.localeCompare(cell2)
        : cell2.localeCompare(cell1);
    } else {
      const first = +cell1.replace(/[$,]/g, '');
      const second = +cell2.replace(/[$,]/g, '');

      return sortOrder === 'ASC' ? first - second : second - first;
    }
  });

  body.innerHTML = '';

  rows.forEach((row) => {
    body.appendChild(row);
  });
});

// #region change
const changeValue = (oldData) => {
  const input = document.querySelector('.cell-input');
  const cell = input.closest('td');
  const index = [...cell.parentNode.children].indexOf(cell);
  let hasError = false;

  switch (index) {
    case 0:
      hasError = validateName(input.value) ? true : hasError;
      break;
    case 3:
      hasError = validateAge(input.value) ? true : hasError;
      break;
    case 4:
      hasError = validateSalary(input.value) ? true : hasError;
      break;
  }

  if (index !== 4) {
    cell.textContent = input.value === '' || hasError ? oldData : input.value;
  } else {
    cell.textContent =
      input.value === '' || hasError
        ? oldData
        : '$' + input.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  input.remove();
};

const onEnter = (e, oldData) => {
  if (e.keyCode === 13) {
    isEnterPressed = true;
    changeValue(oldData);
  }
};

const checkOtherSelect = () => {
  const otherSelect = body.querySelector('select');

  if (otherSelect) {
    otherSelect.closest('td').textContent = otherSelect.value;
    otherSelect.remove();
  }
};
// #endregion

body.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');
  const oldData = cell.textContent;
  const index = [...cell.parentNode.children].indexOf(cell);

  checkOtherSelect();

  cell.textContent = '';

  if (index !== 2) {
    const input = document.createElement('input');

    input.value = index === 4 ? oldData.replace(/[$,]/g, '') : oldData;
    input.classList.add('cell-input');
    input.focus();

    input.onblur = () => {
      if (!isEnterPressed) {
        changeValue(oldData);
      }
      isEnterPressed = false;
    };

    input.addEventListener('keydown', (event) => {
      onEnter(event, oldData);
    });

    cell.appendChild(input);

    input.focus();
  } else {
    const select = document.querySelector('select').cloneNode(true);

    select.classList.add('cell-input');
    select.value = oldData;

    cell.appendChild(select);

    select.addEventListener('change', (event) => {
      cell.textContent = event.target.value;

      select.remove();
    });

    setTimeout(() => {
      select.focus();
    }, 10);
  }
});

body.addEventListener('click', (e) => {
  const allRows = [...body.querySelectorAll('tr')];

  allRows.forEach((row) => {
    row.classList.remove('active');
  });

  e.target.closest('tr').classList.add('active');
});

// #region notification
const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.position = 'relative';
  messageTitle.classList.add('title');
  messageTitle.textContent = title;
  messageDescription.textContent = description;

  notification.appendChild(messageTitle);
  notification.appendChild(messageDescription);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 2000);
};
// #endregion

const formSubmit = (e) => {
  e.preventDefault();

  let hasError = false;

  const formData = new FormData(e.target.closest('form'));

  const fields = ['name', 'position', 'office', 'age', 'salary'];

  const fieldValues = fields.map((field) => {
    let value = formData.get(field);

    if (field === 'salary') {
      value = '$' + value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return {
      key: field,
      value,
    };
  });

  hasError = validation(fieldValues);

  if (!hasError) {
    const row = document.createElement('tr');

    fieldValues.forEach((value) => {
      const col = document.createElement('td');

      col.textContent = value.value;
      row.appendChild(col);
    });

    body.appendChild(row);

    pushNotification(
      'Add new employee',
      'New employee was added to table',
      'success',
    );
  }
};

const createForm = () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  inputs.forEach((eachInput) => {
    const label = document.createElement('label');
    let input = document.createElement('select');

    if (eachInput !== 'Office') {
      input = document.createElement('input');

      switch (eachInput) {
        case 'Age':
        case 'Salary':
          input.type = 'number';
          break;
        default:
          input.type = 'text';
      }
    }

    label.textContent = `${eachInput}: `;
    input.name = eachInput.toLowerCase();
    input.dataset.qa = eachInput.toLowerCase();

    label.appendChild(input);
    form.appendChild(label);
  });

  const office = form.querySelector('select');

  offices.forEach((eachOffice) => {
    const option = document.createElement('option');

    option.textContent = eachOffice;
    option.value = eachOffice;
    office.appendChild(option);
  });

  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to table';
  form.appendChild(button);
  form.addEventListener('submit', formSubmit);

  return form;
};

document.body.appendChild(createForm());

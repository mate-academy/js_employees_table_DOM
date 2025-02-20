'use strict';

const head = document.querySelectorAll('thead th');
const body = document.querySelectorAll('tbody tr');

// #region Sorting table

function sortTabletASC(i) {
  const tbody = document.querySelector('tbody');
  const sortBody = [...document.querySelectorAll('tbody tr')];

  if (isNaN(sortBody[i].children.textContent)) {
    sortBody.sort((a, b) => {
      const textA = a.children[i].textContent.replace(/[^a-zA-Z]/g, '');
      const textB = b.children[i].textContent.replace(/[^a-zA-Z]/g, '');

      return textA.localeCompare(textB);
    });
  }

  sortBody.sort(
    (a, b) =>
      a.children[i].textContent.replace(/[^0-9.]/g, '') -
      b.children[i].textContent.replace(/[^0-9.]/g, ''),
  );

  sortBody.forEach((el) => tbody.append(el));
}

function sortTabletFooterDESC(i) {
  const tbody = document.querySelector('tbody');
  const sortBody = [...document.querySelectorAll('tbody tr')];

  if (isNaN(sortBody[i].children.textContent)) {
    sortBody.sort((a, b) => {
      const textA = a.children[i].textContent.replace(/[^a-zA-Z]/g, '');
      const textB = b.children[i].textContent.replace(/[^a-zA-Z]/g, '');

      return textB.localeCompare(textA);
    });
  }

  sortBody.sort(
    (a, b) =>
      b.children[i].textContent.replace(/[^0-9.]/g, '') -
      a.children[i].textContent.replace(/[^0-9.]/g, ''),
  );

  sortBody.forEach((el) => tbody.append(el));
}

head.forEach((el, index) => {
  el.addEventListener('click', () => {
    if (!el.classList.length) {
      el.classList.add('ASC');
      sortTabletASC(index);

      return;
    }

    if (el.classList.contains('ASC')) {
      el.classList.remove('ASC');
      el.classList.add('DESC');
      sortTabletFooterDESC(index);

      return;
    }

    if (el.classList.contains('DESC')) {
      el.classList.remove('DESC');
      el.classList.add('ASC');
      sortTabletASC(index);
    }
  });
});
// #endregion

// #region Selection

body.forEach((el) => {
  el.addEventListener('click', () => {
    document
      .querySelectorAll('tr')
      .forEach((r) => r.classList.remove('active'));
    el.classList.add('active');
  });
});

// #endregion

// #region Create New Employee table

const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');
document.querySelector('body').append(newEmployeeForm);

function createEmployeeForm(srt, type) {
  const label = document.createElement('label');

  label.textContent = `${srt}:`;

  const input = document.createElement('input');

  input.type = type;
  input.setAttribute('data-qa', srt.toLowerCase());
  input.required = true;
  label.append(input);
  newEmployeeForm.append(label);
}

createEmployeeForm('Name', 'text');
createEmployeeForm('Position', 'text');

// #region Create Select and Button

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office:';

const select = document.createElement('select');
const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

select.setAttribute('data-qa', 'office');
select.required = true;

options.forEach((opt) => {
  const option = document.createElement('option');

  option.textContent = opt;
  select.append(option);
});
selectLabel.append(select);
newEmployeeForm.append(selectLabel);

// #endregion

createEmployeeForm('Age', 'number');
createEmployeeForm('Salary', 'number');

const button = document.createElement('button');

button.textContent = 'Save to table';
newEmployeeForm.append(button);

// #endregion

// #region Add New
function addSection(value) {
  const section = document.createElement('td');

  if (!isNaN(value)) {
    section.textContent = value.toLocaleString('en-US');
  } else {
    section.textContent = value;
  }

  return section;
}

function addNewEmployee(employeeName, position, office, age, salary) {
  const newRow = document.createElement('tr');

  newRow.append(addSection(employeeName));
  newRow.append(addSection(position));
  newRow.append(addSection(office));
  newRow.append(addSection(age));
  newRow.append(addSection(Number(salary)));

  document.querySelector('tbody').append(newRow);
  newRow.lastElementChild.textContent = `$${newRow.lastElementChild.textContent} `;
}

button.addEventListener('click', (e) => {
  e.preventDefault();

  const form = document.querySelector('.new-employee-form');
  const employeeName = form.querySelector('[data-qa="name"]').value;
  const position = form.querySelector('[data-qa="position"]').value;
  const office = form.querySelector('[data-qa="office"]').value;
  const age = form.querySelector('[data-qa="age"]').value;
  const salary = form.querySelector('[data-qa="salary"]').value;

  if (employeeName.length < 4) {
    pushNotification(
      10,
      10,
      'Invalid employee name',
      'Employee name must be more than 4 letters',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      10,
      10,
      'Invalid employee age',
      'Employee cant be younger that 18 and older than 90',
      'error',
    );

    return;
  }

  if (position.length === 0 || salary.length === 0) {
    pushNotification(
      10,
      10,
      'Error',
      'Please fill all necesary fields',
      'error',
    );
  }
  addNewEmployee(employeeName, position, office, age, salary);

  form.reset();
});

// #endregion

const pushNotification = (posBottom, posRight, title, description, type) => {
  const mainbody = document.querySelector('body');

  const notificationContainer = document.createElement('div');
  const notificationBody = document.createElement('div');

  notificationContainer.style.position = 'fixed';
  notificationContainer.style.bottom = posBottom + 'px';
  notificationContainer.style.right = posRight + 'px';
  notificationBody.type = type;
  notificationBody.style.height = '130' + 'px';
  notificationBody.style.borderRadius = '10px';

  switch (notificationBody.type) {
    case 'success':
      notificationBody.style.backgroundColor = '#c0ddb6';
      break;
    case 'error':
      notificationBody.style.backgroundColor = '#ecb5b1';
      break;
    case 'warning':
      notificationBody.style.backgroundColor = '#f1e5bf';
      break;
  }

  const notificationTitle = document.createElement('div');

  notificationTitle.textContent = title;
  notificationTitle.style.fontWeight = 'bold';
  notificationTitle.style.padding = '15px 15px';

  const notificationDescription = document.createElement('div');

  notificationDescription.textContent = description;
  notificationDescription.style.padding = '15px 15px';

  notificationContainer.append(notificationBody);

  notificationBody.append(notificationTitle);
  notificationBody.append(notificationDescription);
  mainbody.append(notificationContainer);

  setTimeout(() => {
    notificationContainer.remove();
  }, 2000);
};

// pushNotification(
//   10,
//   10,
//   'Title of Success message',
//   'Message example.' + 'Notification should contain title and description.',
//   'success',
// );

// pushNotification(
//   150,
//   10,
//   'Title of Error message',
//   'Message example.' + 'Notification should contain title and description.',
//   'error',
// );

// pushNotification(
//   290,
//   10,
//   'Title of Warning message',
//   'Message example.' + 'Notification should contain title and description.',
//   'warning',
// );

'use strict';

// write code here
const table = document.querySelector('table');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let rows = [...tableBody.rows];
const orders = ['default', 'default', 'default', 'default', 'default'];

function toNumbers(string) {
  return +string.replace(/[$,]/g, '');
}

function toSalary(string) {
  const split = string.split('');
  let salary = '$';

  for (let i = 0; i < split.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      salary += ',';
    }
    salary += split[i];
  }

  return salary;
}

function sortBy(filter, index) {
  switch (filter) {
    case 'Name':
    case 'Position':
    case 'Office':
      orders[index] !== 'asc'
        ? rows.sort(
          (a, b) => b.children[index].innerHTML
            .localeCompare(a.children[index].innerHTML)
        )
        : rows.sort(
          (a, b) => a.children[index].innerHTML
            .localeCompare(b.children[index].innerHTML)
        );
      break;
    case 'Age':
    case 'Salary':
      orders[index] !== 'asc'
        ? rows.sort(
          (a, b) => toNumbers(b.children[index].innerHTML)
            - toNumbers(a.children[index].innerHTML)
        )
        : rows.sort(
          (a, b) => toNumbers(a.children[index].innerHTML)
            - toNumbers(b.children[index].innerHTML)
        );
      break;
  }
}

tableHead.addEventListener('click', e => {
  rows = [...tableBody.rows];

  const thIndex = e.target.cellIndex;

  if (e.target.tagName !== 'TH') {
    return;
  }

  orders[thIndex] !== 'asc'
    ? orders[thIndex] = 'asc'
    : orders[thIndex] = 'dsc';

  for (const index in orders) {
    if (+index !== thIndex) {
      orders[index] = 'default';
    }
  }

  sortBy(e.target.innerHTML, e.target.cellIndex);

  rows.forEach(row => {
    tableBody.append(row);
  });
});

document.addEventListener('click', e => {
  const tr = e.target.parentNode;
  const isActive = tableBody.querySelector('.active');

  if (e.target.tagName !== 'TD') {
    if (isActive) {
      isActive.classList.remove('active');
    }

    return;
  }

  if (isActive) {
    isActive.classList.remove('active');
  }

  tr.classList.add('active');
});

const createForm = () => {
  const newForm = document.createElement('form');
  const newButton = document.createElement('button');
  const naming = [
    'Name: ', 'Position: ', 'Office: ', 'Age: ', 'Salary: ',
  ];
  const offices = [
    `Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`,
  ];

  for (let i = 0; i <= 4; i++) {
    const type = i <= 2 ? 'name' : 'number';
    const fieldName = naming[i].replace(': ', '').toLowerCase();
    const label = document.createElement('label');

    if (i === 2) {
      const select = document.createElement('select');

      offices.forEach(office => {
        const option = document.createElement('option');

        option.setAttribute('value', office);
        option.innerHTML = office;
        select.append(option);
      });

      select.setAttribute('name', fieldName);
      select.required = true;
      label.innerHTML = naming[i];

      label.append(select);
    } else {
      const input = document.createElement('input');

      if (fieldName === 'name') {
        input.setAttribute('minlength', '4');
        input.setAttribute('onkeydown', 'return /[a-z ]/i.test(event.key)');
      };

      if (fieldName === 'age') {
        input.setAttribute('min', '18');
        input.setAttribute('max', '90');
      };

      if (fieldName === 'salary') {
        input.setAttribute('min', '0');
      }

      label.innerHTML = naming[i];
      input.setAttribute('name', fieldName);
      input.required = true;
      input.setAttribute('type', type);
      input.setAttribute('data-qa', fieldName);

      label.append(input);
    }
    newForm.append(label);
  }

  newButton.setAttribute('type', 'submit');
  newButton.innerHTML = 'Save to table';
  newForm.append(newButton);
  newForm.setAttribute('onsubmit', 'return false');
  newForm.classList.add('new-employee-form');
  table.after(newForm);
};

createForm();

function addEmploye() {
  const tr = document.createElement('tr');
  const naming = [...arguments];

  naming.forEach(field => {
    const td = document.createElement('td');

    td.innerHTML = field;
    tr.append(td);
  });

  tableBody.append(tr);
}

function addNotification(isAdded) {
  const divNotification = document.createElement('div');
  const h2Notification = document.createElement('h2');
  const pNotification = document.createElement('p');

  divNotification.classList.add('notification');
  h2Notification.classList.add('notification', 'title');

  if (isAdded) {
    h2Notification.innerHTML = 'Success!';
    pNotification.innerHTML = 'Employee added';
    divNotification.classList.add('success');
  } else if (!isAdded) {
    h2Notification.innerHTML = 'Warning!';
    pNotification.innerHTML = 'Someting wrong, check tooltips';
    divNotification.classList.add('warning');
  } else {
    h2Notification.innerHTML = 'Error';
    pNotification.innerHTML = 'There was an error';
    divNotification.classList.add('error');
  }
  divNotification.setAttribute('data-qa', 'notification');
  divNotification.append(h2Notification);
  divNotification.append(pNotification);
  table.after(divNotification);

  setTimeout(() => {
    divNotification.remove();
  }, 2000);
}

const button = document.querySelector('button');
const form = document.querySelector('form');

button.addEventListener('click', e => {
  const inputName = form.querySelector('[name="name"]');
  const inputPosition = form.querySelector('[name="position"]');
  const inputOffice = form.querySelector('[name="office"]');
  const inputAge = form.querySelector('[name="age"]');
  const inputSalary = form.querySelector('[name="salary"]');

  if (
    inputName.value
    && inputPosition.value
    && inputAge.value
    && inputSalary.value
    && inputName.validity.valid
    && inputAge.validity.valid
    && inputSalary.validity.valid
  ) {
    const salary = toSalary(inputSalary.value);

    addEmploye(
      inputName.value,
      inputPosition.value,
      inputOffice.value,
      inputAge.value,
      salary,
    );

    inputName.value = '';
    inputPosition.value = '';
    inputOffice.value = 'Tokyo';
    inputAge.value = '';
    inputSalary.value = '';

    return addNotification(true);
  }

  return addNotification(false);
});

document.addEventListener('dblclick', eMain => {
  const input = document.createElement('input');
  const text = eMain.target.innerHTML;

  if (eMain.target.tagName === 'TD') {
    input.value = eMain.target.innerHTML;
    eMain.target.innerHTML = '';

    eMain.target.append(input);
    input.focus();
  }

  input.addEventListener('blur', () => {
    input.remove();
    eMain.target.innerHTML = input.value ? input.value : text;
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      input.remove();
      eMain.target.innerHTML = input.value ? input.value : text;
    }
  });
});

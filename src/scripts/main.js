'use strict';

// write code here
const table = document.querySelector('table');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let rows = [...tableBody.rows];
const orders = ['default', 'default', 'default', 'default', 'default'];
let errorMessage = '';
let isValid = true;

function toNumbers(string) {
  return +string.replace(/[$,]/g, '');
}

function toSalary(string) {
  const split = string.split('');
  const salary = [];
  let x = 0;

  for (let i = split.length - 1; i >= 0; i--) {
    if (x % 3 === 0 && x !== 0) {
      salary.push(',');
    }
    salary.push(split[i]);
    x++;
  }

  return `$${salary.reverse().join('')}`;
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
      label.innerHTML = naming[i];

      label.append(select);
    } else {
      const input = document.createElement('input');

      label.innerHTML = naming[i];
      input.setAttribute('name', fieldName);
      input.setAttribute('type', type);
      input.setAttribute('data-qa', fieldName);

      label.append(input);
    }
    newForm.append(label);
  }

  newButton.innerHTML = 'Save to table';
  newForm.append(newButton);
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

function typeOfNotification(div, h2, paragraph, notificationStatus, message) {
  h2.innerHTML = notificationStatus;
  paragraph.innerHTML = message;
  div.classList.add(notificationStatus.toLowerCase());
}

function addNotification(nStatus, message) {
  const divNotification = document.createElement('div');
  const h2Notification = document.createElement('h2');
  const pNotification = document.createElement('p');

  divNotification.classList.add('notification');
  h2Notification.classList.add('notification.title');

  typeOfNotification(
    divNotification,
    h2Notification,
    pNotification,
    nStatus,
    message,
  );

  divNotification.setAttribute('data-qa', 'notification');
  divNotification.append(h2Notification);
  divNotification.append(pNotification);
  form.after(divNotification);

  setTimeout(() => {
    divNotification.remove();
  }, 2000);
}

const form = document.querySelector('form');
const inputName = form.querySelector('[name="name"]');
const inputPosition = form.querySelector('[name="position"]');
const inputOffice = form.querySelector('[name="office"]');
const inputAge = form.querySelector('[name="age"]');
const inputSalary = form.querySelector('[name="salary"]');

function checkIfValid(formName, formPosition, formAge, formSalary) {
  errorMessage = 'something wrong';
  isValid = true;

  if (
    !formName
      .split('')
      .every(a => a.toLowerCase() !== a.toUpperCase() || a === ' ')
  ) {
    errorMessage = 'Only alphabetic characters allowed';
    isValid = false;

    return errorMessage;
  };

  if (formName.trim().length < 4) {
    errorMessage = 'Name minimum length 4';
    isValid = false;

    return errorMessage;
  };

  if (formPosition.trim().length === 0) {
    errorMessage = 'Position can\'t be empty';
    isValid = false;

    return errorMessage;
  };

  if (formAge < 18 || formAge > 90) {
    errorMessage = 'Age can\'t be more than 90 or less than 18';
    isValid = false;

    return errorMessage;
  };

  if (formSalary < 0 || !formSalary) {
    errorMessage = 'Salary can\'t be empty or negative';
    isValid = false;

    return errorMessage;
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();

  checkIfValid(
    inputName.value,
    inputPosition.value,
    inputAge.value,
    inputSalary.value,
  );

  try {
    const salary = toSalary(inputSalary.value);
    const employeeName = inputName.value;

    if (isValid) {
      addEmploye(
        inputName.value.trim(),
        inputPosition.value.trim(),
        inputOffice.value,
        inputAge.value,
        salary,
      );

      inputName.value = '';
      inputPosition.value = '';
      inputOffice.value = 'Tokyo';
      inputAge.value = '';
      inputSalary.value = '';

      return addNotification('Success', `${employeeName} added`);
    }
  } catch (err) {
    return addNotification('Error', err.message);
  }

  return addNotification('Warning', errorMessage);
});

tableBody.addEventListener('dblclick', eMain => {
  if (eMain.target.tagName === 'TD') {
    const inputs = form.querySelectorAll('label');
    const inputsArr = [...inputs];
    const input = inputsArr[eMain.target.cellIndex].lastChild.cloneNode(true);
    const backupValue = eMain.target.innerHTML;

    input.value = eMain.target.innerHTML;
    eMain.target.innerHTML = '';

    eMain.target.append(input);
    input.focus();

    const removeAndUpdate = () => {
      switch (input.name) {
        case 'name':
          if (
            !input.value
              .split('')
              .every(a => a.toLowerCase() !== a.toUpperCase()
                || a === ' ')
                || input.value.trim().length < 4
          ) {
            eMain.target.innerHTML = backupValue;
            addNotification('Warning', 'Name length > 4 and only letters');

            return;
          };
          break;

        case 'age':
          if (input.value < 18 || input.value > 90) {
            eMain.target.innerHTML = backupValue;
            addNotification('Warning', 'Age can\'t be < 18 and > 90');

            return;
          };
          break;

        case 'salary':
          if (input.value <= 0) {
            eMain.target.innerHTML = backupValue;
            addNotification('Warning', 'Salary can\'t be negative');

            return;
          } else {
            eMain.target.innerHTML = input.value.trim()
              ? toSalary(input.value)
              : backupValue;

            return;
          };
      }

      input.remove();
      eMain.target.innerHTML = input.value.trim() ? input.value : backupValue;
    };

    input.addEventListener('blur', removeAndUpdate);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        input.removeEventListener('blur', removeAndUpdate);
        removeAndUpdate();
      }
    });
  }
});

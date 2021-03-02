'use strict';

// ####################### One that Sorts #################################
const heading = document.querySelector('table thead tr');
const tableBody = document.querySelector('table tbody');

const sortFunction = (toBeSorted, columnIndex) => {
  const sorted = [...toBeSorted];
  const content = sorted[0].children[columnIndex].textContent;

  content.replace(/\D/g, '');

  if (content === '') {
    sorted.sort((one, two) => {
      const first = one.children[columnIndex].textContent;
      const second = two.children[columnIndex].textContent;

      if (first > second) {
        return 1;
      };

      if (first < second) {
        return -1;
      };

      return 0;
    });
  }

  if (!isNaN(content)) {
    sorted.sort((one, two) => {
      const first = one.children[columnIndex].textContent.replace(/\D/g, '');
      const second = two.children[columnIndex].textContent.replace(/\D/g, '');

      return first - second;
    });
  };

  let sortedAscending = true;

  sorted.forEach((row, rowIndex) => {
    if (row.children[columnIndex].textContent
      !== [...toBeSorted][rowIndex].children[columnIndex].textContent) {
      sortedAscending = false;
    }
  });

  if (sortedAscending) {
    sorted.reverse();
  }

  tableBody.append(...sorted);
};

heading.addEventListener('click', (e) => {
  const columnIndex = [...heading.children].indexOf(e.target);

  sortFunction(tableBody.children, columnIndex);
});

// ####################### One that Activates #################################

const activateRow = () => {
  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  event.target.closest('tr').classList.add('active');
};

tableBody.addEventListener('click', activateRow);

// ########################## One that Adds ####################################

const data = [...heading.children];
const form = document.createElement('FORM');
const offices = ['Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburg',
  'San Francisco',
];

form.classList.add('new-employee-form');

data.forEach((dataPiece) => {
  let inputField;
  const inputLabel = document.createElement('LABEL');

  inputLabel.textContent = dataPiece.textContent + ':';

  if (dataPiece.textContent !== 'Office') {
    inputField = document.createElement('INPUT');
    inputField.type = 'text';
  }

  if (dataPiece.textContent === 'Office') {
    inputField = document.createElement('SELECT');

    offices.forEach(office => {
      const option = document.createElement('OPTION');

      option.textContent = office;
      option.value = office;
      inputField.appendChild(option);
    });
  }

  inputField.setAttribute('data-qa', dataPiece.textContent.toLowerCase());
  inputField.name = dataPiece.textContent.toLowerCase();

  inputLabel.append(inputField);
  form.append(inputLabel);
});

[...form.children].forEach(label => {
  if (label.lastChild.name === 'age'
  || label.lastChild.name === 'salary') {
    label.lastChild.type = 'number';
  }
});

const button = document.createElement('BUTTON');

button.textContent = 'Save to table';
button.type = 'submit';
button.id = 'addNewbie';
form.appendChild(button);

document.body.appendChild(form);

const submitButton = document.querySelector('#addNewbie');

const getInfo = () => {
  event.preventDefault();

  const inputData = [...form.querySelectorAll('LABEL')];
  const newbie = {};

  inputData.forEach(item => {
    if (item.lastChild.name === 'salary') {
      newbie[`${item.lastChild.name}`] = '$'
      + (+item.lastChild.value).toLocaleString('en-US');
    } else {
      newbie[`${item.lastChild.name}`] = item.lastChild.value;
    }
  });

  addEntry(newbie);
};

const addEntry = (employee) => {
  switch (true) {
    case (employee.name === ''
      || employee.age === ''
      || employee.position === ''
      || employee.salary.replace(/\D/g, '') === '') : {
      pushNotification(
        'Warning',
        `Something is missing!<br>Please fill all the fields.`,
        'error'
      );
      break;
    }

    case (isNaN(Number(employee.age))
      || isNaN(Number(employee.salary.replace(/\D/g, '')))
      || !isNaN(Number(employee.name))
      || !isNaN(Number(employee.position))) : {
      pushNotification(
        'Warning',
        `Please check the correctness of the data.`,
        'error'
      );
      break;
    }

    case (employee.name.length < 4) : {
      pushNotification(
        'Error',
        'New employee name is too short!',
        'error'
      );
      break;
    }

    case (employee.age < 18 || employee.age > 90) : {
      pushNotification(
        'Error',
        'Such a strange age...',
        'error'
      );
      break;
    }

    default : {
      const newRow = document.createElement('TR');

      data.forEach(dataPiece => {
        const cell = document.createElement('TD');

        cell.textContent = employee[`${dataPiece.textContent.toLowerCase()}`];
        newRow.appendChild(cell);
      });

      tableBody.appendChild(newRow);
      form.reset();

      pushNotification(
        'Success!',
        'New employee is succesfully added!',
        'success'
      );
    }
  }
};

submitButton.addEventListener('click', getInfo);

// ####################### One that Notifies #################################

const pushNotification = (title, description, type) => {
  const notification = document.createElement('DIV');

  notification.innerHTML = `
    <h2 class = 'title'>${title}</h2>
    <p>${description}</p>
  `;
  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 5000);
};

// ####################### One that Edits #################################

const editCell = () => {
  const inputField = document.createElement('INPUT');
  const initialValue = event.target.textContent;

  event.target.textContent = '';
  inputField.value = initialValue;
  inputField.type = 'text';
  inputField.classList.add('cell-input');
  inputField.style.width = window.getComputedStyle(event.target).width;
  event.target.appendChild(inputField);
  inputField.focus();

  const leaveCell = (e) => {
    if (e.type === 'focusout' || e.key === 'Enter') {
      inputField.removeEventListener('focusout', leaveCell);

      if (inputField.value === '') {
        inputField.value = initialValue;
      }
      e.target.insertAdjacentText('beforebegin', inputField.value);
      e.target.remove();
    }
  };

  inputField.addEventListener('focusout', leaveCell);
  inputField.addEventListener('keyup', leaveCell);
};

tableBody.addEventListener('dblclick', editCell);

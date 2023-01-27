'use strict';

const employeesBody = document.querySelector('tbody');
const titleSort = document.querySelector('thead');
const sumString = string => +string.slice(1).split(',').join('');
let sortedCell;

// Sort event
titleSort.addEventListener('click', (e) => {
  const sortRow = e.target.cellIndex;

  if (sortRow !== sortedCell) {
    e.target.setAttribute('sorted', '');
  }
  sortedCell = sortRow;

  const sortList = [...employeesBody.children].sort((a, b) => {
    let cellA = a.children[sortRow].textContent;
    let cellB = b.children[sortRow].textContent;

    if (e.target.getAttribute('sorted') === 'ASC') {
      cellA = b.children[sortRow].textContent;
      cellB = a.children[sortRow].textContent;
    }

    if (cellA[0] === '$') {
      return sumString(cellA) - sumString(cellB);
    }

    return cellA.localeCompare(cellB);
  });

  document.querySelector('tbody').append(...sortList);

  if (e.target.getAttribute('sorted') === 'ASC') {
    e.target.setAttribute('sorted', 'DECS');

    return;
  }

  e.target.setAttribute('sorted', 'ASC');
});

// Select event
document.addEventListener('click', (e) => {
  if (!e.target.matches('TD')) {
    return;
  }

  if (document.querySelector('.active')) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.parentElement.classList.add('active');
});

// Create form
const newForm = document.createElement('form');
const selectCity = document.createElement('select');
const newButton = document.createElement('button');

selectCity.innerHTML = `
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
`;
newButton.textContent = 'Save to table';
newButton.id = 'addEmployees';
newForm.id = 'addForm';

newForm.className = 'new-employee-form';
document.body.children[0].after(newForm);

for (let i = 1; i <= 5; i++) {
  const newLabel = document.createElement('label');
  const newInput = document.createElement('input');

  switch (i) {
    case 1:
      newLabel.textContent = 'Name:';
      newLabel.append(newInput);
      newInput.setAttribute('name', 'name');
      newInput.setAttribute('type', 'text');
      newInput.setAttribute('data-qa', 'name');
      newInput.setAttribute('id', 'inputName');
      newInput.setAttribute('required', '');
      break;

    case 2:
      newLabel.append(newInput);
      newLabel.textContent = 'Position:';
      newLabel.append(newInput);
      newInput.setAttribute('name', 'position');
      newInput.setAttribute('type', 'text');
      newInput.setAttribute('data-qa', 'position');
      newInput.setAttribute('id', 'inputPosition');
      newInput.setAttribute('required', '');
      break;

    case 3:
      newLabel.textContent = 'Office:';
      newLabel.append(selectCity);
      selectCity.setAttribute('name', 'office');
      selectCity.setAttribute('type', 'text');
      selectCity.setAttribute('list', 'cityList');
      selectCity.setAttribute('data-qa', 'office');
      selectCity.setAttribute('id', 'inputOffice');
      selectCity.setAttribute('required', '');
      break;

    case 4:
      newLabel.textContent = 'Age:';
      newLabel.append(newInput);
      newInput.setAttribute('name', 'age');
      newInput.setAttribute('type', 'number');
      newInput.setAttribute('data-qa', 'age');
      newInput.setAttribute('id', 'inputAge');
      newInput.setAttribute('min', '18');
      newInput.setAttribute('max', '90');
      newInput.setAttribute('required', '');
      break;

    case 5:
      newLabel.textContent = 'Salary:';
      newLabel.append(newInput);
      newInput.setAttribute('name', 'salsary');
      newInput.setAttribute('type', 'number');
      newInput.setAttribute('data-qa', 'salary');
      newInput.setAttribute('id', 'inputSalary');
      newInput.setAttribute('required', '');
  }
  newForm.append(newLabel);
}
newForm.append(newButton);

// Event submit form
const form = document.querySelector('#addForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmployee = document.querySelector('#inputName').value;
  const position = document.querySelector('#inputPosition').value;
  const office = document.querySelector('#inputOffice').value;
  const age = document.querySelector('#inputAge').value;
  const salary = document.querySelector('#inputSalary').value;
  const newEmployee = document.createElement('tr');

  if (!validation(nameEmployee, 0)) {
    return;
  };

  if (!validation(age, 3)) {
    return;
  };

  newEmployee.innerHTML = `
    <td>${nameEmployee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${Number(salary).toLocaleString('en-US')}</td>
  `;

  employeesBody.append(newEmployee);

  pushNotification(10, 10, 'Success!!!',
    `${nameEmployee} has been added to the list.\n `
    + 'Keep it up.', 'success');

  form.reset();
});

// Editing of table cells by double-clicking
const newCell = document.createElement('input');
const oldInfo = document.createElement('td');

newCell.classList.add('cell-input');

// Event for double-click
employeesBody.addEventListener('dblclick', (e) => {
  newCell.value = e.target.textContent;
  oldInfo.textContent = e.target.textContent;
  e.target.replaceChildren(newCell);
  newCell.focus();
});

// Event for key Enter
employeesBody.addEventListener('keyup', (e) => {
  if (e.code === 'Enter') {
    save(e);
  }
});

// Event for save and data validation
const save = (e) => {
  if (validation(newCell.value, e.target.parentElement.cellIndex)) {
    if (e.target.parentElement.cellIndex === 4) {
      if (newCell.value[0] !== '$') {
        newCell.parentElement.textContent
        = `$${Number(newCell.value).toLocaleString('en-US')}`;

        return;
      }

      newCell.parentElement.textContent
        = `$${Number(sumString(newCell.value)).toLocaleString('en-US')}`;

      return;
    }
    newCell.parentElement.textContent = newCell.value;

    return;
  }

  newCell.parentElement.textContent = oldInfo.textContent;
};

newCell.addEventListener('blur', (save));

// Validation function
const validation = (info, index) => {
  if (index === 0 || index === 1 || index === 2) {
    if (info.length < 4) {
      pushNotification(150, 10, `${titleSort.children[0]
        .children[index].textContent} is to short!`,
      `You enter ${info.length} characters.\n `
      + 'Please enter more than 4 characters.', 'error');

      return false;
    }
  }

  if (index === 3) {
    if (!isFinite(info)) {
      pushNotification(290, 10, 'Age is not correct!',
        `You enter not a number\n `
        + 'Please enter corect number more 18 and less than 90.', 'error');

      return false;
    }

    if (info < 18 || info > 90) {
      pushNotification(290, 10, 'Age is not correct!',
        `You enter ${info} years.\n `
        + 'Please enter more 18 and less than 90.', 'error');

      return false;
    }
  }

  if (index === 4) {
    if (info[0] === '$') {
      if (!isFinite(sumString(info))) {
        pushNotification(290, 10, 'Salary is not correct!',
          `You enter not a number\n `
          + 'Please enter corect number', 'error');

        return false;
      }

      return true;
    }

    if (!isFinite(+info.split(',').join(''))) {
      pushNotification(290, 10, 'Salary is not correct!',
        `You enter not a number\n `
        + 'Please enter corect number', 'error');

      return false;
    }
  }

  return true;
};

// Notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const box = document.createElement('div');
  const heading = document.createElement('h2');
  const paragraph = document.createElement('p');

  heading.textContent = title;
  heading.className = 'title';
  paragraph.textContent = description;
  box.classList.add('notification', type);
  box.setAttribute('data-qa', 'notification');

  document.body.append(box);
  box.append(heading);
  box.append(paragraph);

  box.style.top = `${posTop}px`;
  box.style.right = `${posRight}px`;

  setTimeout(() => box.remove(), 5000);
};

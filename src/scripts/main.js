'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tableBody = table.querySelector('tbody');
const body = document.querySelector('body');

tableBody.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach((row) => row.classList.remove('active'));

    const isClickedRow = e.target.parentElement;
    isClickedRow.classList.add('active');
  }
});

//#region notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  const notTitle = document.createElement('h2');

  notTitle.className = 'title';
  notTitle.textContent = title;

  const notContent = document.createElement('p');

  notContent.textContent = description;

  notification.appendChild(notTitle);
  notification.appendChild(notContent);

  notification.classList.add(type);

  document.body.appendChild(notification);

  setTimeout(
    () => ((notification.style.display = 'none'), notification.remove()),
    2000,
  );
};

//#endregion

//#region form

const employeeForm = document.createElement('form');
employeeForm.className = 'new-employee-form';

const selectOption = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const labelName = ['Name:', 'Position:', 'Office:', 'Age:', 'Salary:'];
const inputName = ['name', 'position', 'office', 'age', 'salary'];

labelName.forEach((lName, index) => {
  const label = document.createElement('label');
  label.innerText = lName;

  if (lName === 'Office:') {
    const select = document.createElement('select');

    selectOption.forEach((i) => {
      const option = document.createElement('option');
      option.innerHTML = i;
      select.setAttribute('data-qa', 'office');

      select.appendChild(option);
    });

    label.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.setAttribute('name', inputName[index]);
    input.setAttribute('type', 'text');

    if (inputName[index] === 'name') {
      input.setAttribute('minlength', '4');
    }

    if (inputName[index] === 'age' || inputName[index] === 'salary') {
      input.setAttribute('type', 'number');
    }

    if (inputName[index] === 'age') {
      input.setAttribute('min', '18');
      input.setAttribute('max', '90');
    }

    input.setAttribute('data-qa', inputName[index]);

    label.appendChild(input);
  }

  employeeForm.appendChild(label);
});

const button = document.createElement('button');
button.textContent = 'Save to table';
employeeForm.appendChild(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const name = document.querySelector('input[data-qa="name"]').value;
  const position = document.querySelector('input[data-qa="position"]').value;
  const office = document.querySelector('select[data-qa="office"]').value;
  const age = parseInt(document.querySelector('input[data-qa="age"]').value);
  const salary = document.querySelector('input[data-qa="salary"]').value;

  if (!name || !position || !office || !age || !salary) {
    pushNotification(150, 10, 'Error', 'Please fill in all fields!', 'error');
    return;
  }

  if (name.trim().length < 4) {
    pushNotification(150, 10, 'Error', 'Please fill walid name', 'error');
    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      150,
      10,
      'Error',
      'Please enter a valid age (18-90)',
      'error',
    );
    return;
  }

  const formattedSalary = '$' + parseInt(salary).toLocaleString('en-US');
  const table = document.querySelector('table tbody');
  const newRow = table.insertRow();

  newRow.insertCell(0).innerHTML = name;
  newRow.insertCell(1).innerHTML = position;
  newRow.insertCell(2).innerHTML = office;
  newRow.insertCell(3).innerHTML = age;
  newRow.insertCell(4).innerHTML = formattedSalary;

  pushNotification(10, 10, 'Success', 'Employee added to table!', 'success');
  employeeForm.reset();
});

body.appendChild(employeeForm);

//#endregion

//#region sortedForm

const directions = Array.from(headers).map(() => {
  return '';
});

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortColumn(index);
  });
});

const sortColumn = (index) => {
  const direction = directions[index] || 'asc';
  const multiplier = direction === 'asc' ? 1 : -1;
  const rows = Array.from(tableBody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index].innerHTML;
    const cellB = rowB.querySelectorAll('td')[index].innerHTML;

    const numA = parseFloat(cellA.replace(/\D/g, ''));
    const numB = parseFloat(cellB.replace(/\D/g, ''));

    if (!isNaN(numA) && !isNaN(numB)) {
      return (numA - numB) * multiplier;
    } else {
      return cellA.localeCompare(cellB) * multiplier;
    }
  });

  rows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
  directions[index] = direction === 'asc' ? 'desc' : 'asc';
};

//#endregion

//#region changeCellContent

const tbodyCell = table.querySelector('tbody').querySelectorAll('td');

const arrTbodyCell = Array.from(tbodyCell);

arrTbodyCell.forEach((td) => {
  td.addEventListener('dblclick', (e) => {
    const oldValue = e.target.textContent.trim();
    const input = document.createElement('input');
    input.className = 'cell-input';
    input.setAttribute('type', 'text');
    input.value = oldValue;

    e.target.innerHTML = '';
    e.target.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      const newValue = input.value.trim();

      if (newValue === '') {
        td.textContent = oldValue;
      } else {
        td.textContent = newValue;
      }
      input.remove(); 
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (input.value.trim() === '') {
          e.target.textContent = oldValue;
        } else {
          e.target.textContent = input.value;
        }
        input.remove();
      }
    });
  });
});

//#endregion

'use strict';

function getCellColumnHeader(cell) {
  let counter = 0;
  let currentCell = cell;

  do {
    counter++;
    currentCell = currentCell.previousElementSibling;
  } while (currentCell);

  return headers[counter - 1].innerText.toLowerCase();
}

function getPersonByRow(row) {
  let counter = 0;
  let currentRow = row;

  do {
    counter++;
    currentRow = currentRow.previousElementSibling;
  } while (currentRow);

  return people[counter - 1];
}

function salaryToText(salary) {
  return (
    '$' +
    salary
      .toString()
      .split('')
      .reduce(
        (text, char, index) =>
          text +
          char +
          ((salary.toString().length - index - 1) % 3 === 0 ? ',' : ''),
        '',
      )
      .slice(0, -1)
  );
}

function salaryToNumber(salary) {
  return parseInt(salary.replaceAll(',', '').slice(1));
}

function isInputEmpty(text) {
  return text.length <= 0;
}

function isNameValid(employeeName) {
  return employeeName.length >= 4;
}

function isTooYoung(age) {
  return age < 18;
}

function isTooOld(age) {
  return age > 90;
}

function isSalaryValid(salary) {
  return salary >= 0;
}

function areInputsValid(employeeName, position, office, age, salary) {
  for (const arg of arguments) {
    if (isInputEmpty(arg.value)) {
      appendNotification(
        document.body,
        'Error',
        'All fields are required!',
        'error',
      );

      return false;
    }
  }

  if (!isNameValid(employeeName.value)) {
    appendNotification(document.body, 'Error', 'Name is too short!', 'error');

    return false;
  }

  if (isTooYoung(age.value)) {
    appendNotification(
      document.body,
      'Error',
      'Employee is too young!',
      'error',
    );

    return false;
  }

  if (isTooOld(age.value)) {
    appendNotification(document.body, 'Error', 'Employee is too old!', 'error');

    return false;
  }

  if (!isSalaryValid(salary.value)) {
    appendNotification(
      document.body,
      'Error',
      'Salary should be higher or equal to 0!',
      'error',
    );

    return false;
  }

  return true;
}

function refreshTable() {
  const tBody = document.querySelector('tbody');
  const newTBody = document.createElement('tbody');

  for (const person of people) {
    const row = document.createElement('tr');
    const cells = Array.from({ length: 5 }, () => document.createElement('td'));

    const { name: personName, position, office, age, salary, active } = person;

    cells[0].textContent = personName;
    cells[1].textContent = position;
    cells[2].textContent = office;
    cells[3].textContent = age;
    cells[4].textContent = salaryToText(salary);

    cells.forEach((cell) => {
      cell.addEventListener('dblclick', editCell);
      row.append(cell);
    });

    if (active) {
      row.classList.add('active');
    }

    row.addEventListener('click', selectRow);
    newTBody.append(row);
  }

  tBody.replaceWith(newTBody);
}

function getComparator(targetHeaderText) {
  switch (targetHeaderText) {
    case 'Name':
      return (firstPerson, secondPerson) => {
        if (firstPerson.name > secondPerson.name) {
          return 1;
        }

        if (firstPerson.name < secondPerson.name) {
          return -1;
        }

        return 0;
      };

    case 'Position':
      return (firstPerson, secondPerson) => {
        if (firstPerson.position > secondPerson.position) {
          return 1;
        }

        if (firstPerson.position < secondPerson.position) {
          return -1;
        }

        return 0;
      };

    case 'Office':
      return (firstPerson, secondPerson) => {
        if (firstPerson.office > secondPerson.office) {
          return 1;
        }

        if (firstPerson.office < secondPerson.office) {
          return -1;
        }

        return 0;
      };

    case 'Age':
      return (firstPerson, secondPerson) => firstPerson.age - secondPerson.age;

    case 'Salary':
      return (firstPerson, secondPerson) =>
        firstPerson.salary - secondPerson.salary;
  }
}

function sortTable() {
  const targetHeaderText = this.innerText;

  if (targetHeaderText === sortedColumnHeaderText) {
    people.reverse();
  } else {
    sortedColumnHeaderText = targetHeaderText;
    people.sort(getComparator(targetHeaderText));
  }

  refreshTable();
}

function deactivateAllRows() {
  document.querySelectorAll('tbody tr').forEach((row) => {
    row.classList.remove('active');
  });

  people.forEach((person) => {
    person.active = false;
  });
}

function selectRow() {
  deactivateAllRows();

  this.classList.add('active');

  const rowsAfterActivation = document.querySelectorAll('tbody tr');

  for (let i = 0; i < rowsAfterActivation.length; i++) {
    if (rowsAfterActivation[i].matches('.active')) {
      people[i].active = true;
    }
  }
}

function saveCell(e) {
  if (
    inputEventHandlerFinished &&
    (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter'))
  ) {
    const header = getCellColumnHeader(this.parentElement);
    let isInputValid = true;

    inputEventHandlerFinished = false;

    if (!isInputEmpty(this.value)) {
      switch (header) {
        case 'name':
          if (!isNameValid(this.value)) {
            isInputValid = false;
          }
          break;

        case 'age':
          if (isTooYoung(this.value) || isTooOld(this.value)) {
            isInputValid = false;
          }
          break;

        case 'salary':
          if (!isSalaryValid(this.value)) {
            isInputValid = false;
          }
      }
    } else {
      isInputValid = false;
    }

    if (isInputValid) {
      getPersonByRow(this.parentElement.parentElement)[header] = this.value;
      sortedColumnHeaderText = '';
    }

    refreshTable();
    this.remove();
    inputEventHandlerFinished = true;
  }
}

function editCell() {
  if (
    this.firstChild.nodeType === 3 &&
    !document.querySelector('td > input, td > select')
  ) {
    switch (getCellColumnHeader(this)) {
      case 'name':
      case 'position':
        appendCellInput(this, 'text', this.innerText);
        break;
      case 'office':
        appendCellSelect(this, this.innerText);
        break;
      case 'age':
        appendCellInput(this, 'number', this.innerText);
        break;
      case 'salary':
        appendCellInput(this, 'number', salaryToNumber(this.innerText));
    }
    this.firstChild.remove();
  }
}

function addPerson(e) {
  const [employeeName, position, age, salary] =
    document.querySelectorAll('label > input');
  const office = document.querySelector('select');

  e.preventDefault();

  if (areInputsValid(employeeName, position, office, age, salary)) {
    people.push({
      name: employeeName.value,
      position: position.value,
      office: office.value,
      age: age.value,
      salary: salary.value,
      active: false,
    });

    refreshTable();
    sortedColumnHeaderText = '';

    appendNotification(
      document.body,
      'Success',
      'New person has been added!',
      'success',
    );
  }
}

function appendNotification(destination, title, description, type) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.className = 'notification ' + type;
  notification.dataset.qa = 'notification';
  notificationTitle.className = 'title';
  notificationTitle.textContent = title;
  notificationDescription.textContent = description;

  notification.append(notificationTitle);
  notification.append(notificationDescription);
  destination.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 1999);
}

function appendOffices(destination) {
  for (const office of offices) {
    const option = document.createElement('option');

    option.innerText = office;
    option.value = office;

    destination.append(option);
  }
}

function appendCellInput(destination, type, value) {
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = type;
  input.value = value;

  input.addEventListener('blur', saveCell);
  input.addEventListener('keydown', saveCell);

  destination.append(input);
}

function appendCellSelect(destination, selected) {
  const select = document.createElement('select');

  select.className = 'cell-input';
  appendOffices(select);
  select.selectedIndex = offices.indexOf(selected);

  select.addEventListener('blur', saveCell);
  select.addEventListener('keydown', saveCell);

  destination.append(select);
}

function appendInput(destination, labelText, type, inputName) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.innerText = labelText;
  input.type = type;
  input.name = inputName;
  input.dataset.qa = inputName;
  input.required = true;

  label.append(input);
  destination.append(label);
}

function appendSelect(destination, labelText, selectName) {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.innerText = labelText;
  select.name = selectName;
  select.dataset.qa = selectName;
  select.required = true;
  appendOffices(select);

  label.append(select);
  destination.append(label);
}

function appendButton(destination, buttonText, type) {
  const button = document.createElement('button');

  button.innerText = buttonText;
  button.type = type;

  button.addEventListener('click', addPerson);

  destination.append(button);
}

function appendForm(destination) {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  appendInput(form, 'Name:', 'text', 'name');
  appendInput(form, 'Position:', 'text', 'position');

  appendSelect(form, 'Office:', 'office');

  appendInput(form, 'Age:', 'number', 'age');
  appendInput(form, 'Salary:', 'number', 'salary');
  appendButton(form, 'Save to table', 'submit');

  destination.append(form);
}

const rows = document.querySelectorAll('tbody tr');
const people = [];
const headers = document.querySelectorAll('thead th');
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
let sortedColumnHeaderText = '';
let inputEventHandlerFinished = true;

rows.forEach((row) => {
  const [employeeName, position, office, age, salary] = row.children;

  people.push({
    name: employeeName.innerText,
    position: position.innerText,
    office: office.innerText,
    age: parseInt(age.innerText),
    salary: salaryToNumber(salary.innerText),
    active: false,
  });

  for (const cell of row.children) {
    cell.addEventListener('dblclick', editCell);
  }

  row.addEventListener('click', selectRow);
});

headers.forEach((header) => {
  header.addEventListener('click', sortTable);
});

appendForm(document.body);

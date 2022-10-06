'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const people = table.querySelector('tbody').querySelectorAll('tr');
const peopleStorage = [...people].map(person =>
  new Person(
    person.children[0].innerText,
    person.children[1].innerText,
    person.children[2].innerText,
    person.children[3].innerText,
    person.children[4].innerText
  ));

function Person(firstName, position, office, age, salary) {
  this.name = firstName;
  this.position = position;
  this.office = office;
  this.age = age;
  this.salary = salary;
}

function transformToNumber(string) {
  return Number(string.split('').filter(el => !isNaN(el)).join(''));
}

function updateInfo() {
  tableBody.innerHTML = '';

  for (const person of peopleStorage) {
    const insertPerson = document.createElement('tr');

    insertPerson.innerHTML = `
            <td>${person.name}</td>
            <td>${person.position}</td>
            <td>${person.office}</td>
            <td>${person.age}</td>
            <td>${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(transformToNumber(person.salary))}</td>
        `;

    tableBody.append(insertPerson);
  }
}

function sortFunction(first, second, order) {
  let a;
  let b;

  if (order === 'ASC') {
    a = first;
    b = second;
  }

  if (order === 'DESC') {
    a = second;
    b = first;
  }

  if (a.includes('$')) {
    a = +a.split('').filter(el => !isNaN(el)).join('');
    b = +b.split('').filter(el => !isNaN(el)).join('');
  }

  if (!Number(a)) {
    return a.localeCompare(b);
  }

  return +a - +b;
}

table.addEventListener('click', () => {
  if (event.target.closest('tbody')) {
    return;
  }

  const sortCriteria = event.target.innerText.toLowerCase();
  const sortOrder = event.target.dataset.sorted;

  if (sortOrder === undefined || sortOrder === 'DESC') {
    event.target.dataset.sorted = 'ASC';

    peopleStorage.sort((a, b) =>
      sortFunction(a[sortCriteria], b[sortCriteria], 'ASC'));
    updateInfo();

    return;
  }

  if (sortOrder === 'ASC') {
    event.target.dataset.sorted = 'DESC';

    peopleStorage.sort((a, b) =>
      sortFunction(a[sortCriteria], b[sortCriteria], 'DESC'));
    updateInfo();
  }
});

tableBody.addEventListener('click', () => {
  const activeRow = tableBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  event.target.closest('tr').classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
    <label>
      Name: 
      <input 
        name="name" 
        type="text" 
        data-qa="name" 
        required
      >
    </label>

    <label>
      Position: 
      <input 
        name="position" 
        type="text" 
        data-qa="position" 
        required
      >
    </label>

    <label>
      Office: 
      <select name="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>
      Age: 
      <input 
        name="age" 
        type="number" 
        data-qa="age" 
        required
      >
    </label>

    <label>
      Salary: 
      <input 
        name="salary" 
        type="number" 
        data-qa="salary" 
        required
      >
    </label>

    <button type="submit">Save to table</button>
`;

function showNotification(titleText, descriptionText, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(type);

  const title = document.createElement('h1');

  title.classList.add('title');
  title.innerText = titleText;
  notification.append(title);

  const description = document.createElement('p');

  description.innerText = descriptionText;
  notification.append(description);

  document.querySelector('body').append(notification);

  setTimeout(() => notification.remove(), 3000);
}

document.querySelector('body').append(form);

const submitButton = document.querySelector('button');

submitButton.addEventListener('click', () => {
  const nameValue = form.querySelector('[name = "name"]').value;
  const positionValue = form.querySelector('[name = "position"]').value;
  const officeValue = form.querySelector('[name = "office"]').value;
  const ageValue = form.querySelector('[name = "age"]').value;
  const salaryValue = form.querySelector('[name = "salary"]').value;

  if (
    nameValue !== ''
        && positionValue !== ''
        && officeValue !== ''
        && ageValue !== ''
        && salaryValue !== ''
  ) {
    event.preventDefault();

    if (nameValue.length < 4) {
      showNotification(
        'Error!',
        'Name must be at least 4 characters long!',
        'error'
      );

      return;
    }

    if (ageValue < 18) {
      showNotification('Error!', 'Age should be least 18!', 'error');

      return;
    }

    if (ageValue > 90) {
      showNotification('Error!', 'Age should be less than 90!', 'error');

      return;
    }

    const person = new Person(
      nameValue,
      positionValue,
      officeValue,
      ageValue,
      salaryValue
    );

    peopleStorage.push(person);

    updateInfo();

    form.querySelector('[name = "name"]').value = '';
    form.querySelector('[name = "position"]').value = '';
    form.querySelector('[name = "office"]').value = '';
    form.querySelector('[name = "age"]').value = '';
    form.querySelector('[name = "salary"]').value = '';

    showNotification('Succes!', 'New employee successfuly added!', 'success');

    return;
  }

  if (
    nameValue !== ''
        || positionValue !== ''
        || officeValue !== ''
        || ageValue !== ''
        || salaryValue !== ''
  ) {
    showNotification('Warning!', 'Some of fields are not filled!', 'warning');
  }
});

tableBody.addEventListener('dblclick', () => {
  const selectedPersonName = event.target.closest('tr').children[0].innerText;
  const selectedPerson
    = peopleStorage.find(person => person.name === selectedPersonName);
  const cellToEdit = event.target;
  let propertyToEdit;

  cellToEdit.startValue = cellToEdit.innerText;

  for (const property in selectedPerson) {
    if (selectedPerson[property] === cellToEdit.innerText) {
      propertyToEdit = property;
    }
  }

  const input = document.createElement('input');
  const cellText = cellToEdit.innerText

  input.classList.add('cell-input');
  input.placeholder = cellText;

  if (transformToNumber(cellText) !== 0) {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  cellToEdit.innerText = '';
  cellToEdit.append(input);
  input.focus();

  input.onblur = () => {
    if (!input.value) {
      selectedPerson[propertyToEdit] = input.placeholder;
    } else {
      selectedPerson[propertyToEdit] = input.value;
    }

    updateInfo();
    input.remove();
  };

  input.onkeydown = () => {
    if (event.key !== 'Enter') {
      return;
    }

    input.blur();
  };
});
'use strict';

// New Employee Section

// Create a form
const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

// Create input fields and labels
const nameInput = document.createElement('input');
const nameLabel = document.createElement('label');
const positionInput = document.createElement('input');
const positionLabel = document.createElement('label');
const officeSelect = document.createElement('select');
const selectLabel = document.createElement('label');
const ageInput = document.createElement('input');
const ageLabel = document.createElement('label');
const salaryInput = document.createElement('input');
const salaryLabel = document.createElement('label');
const button = document.createElement('button');

const tableHeaders = [nameInput, positionInput, ageInput, salaryInput];

const cities
= [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

// Add attributes to all inputs
for (const header of tableHeaders) {
  header.name = 'name';
  header.type = 'text';
}

ageInput.type = 'number';
salaryInput.type = 'number';
button.type = 'submit';

// Create a collection of options with properties for the select tag
for (let i = 0; i < cities.length; i++) {
  const option = document.createElement('option');

  option.value = cities[i];
  option.text = cities[i];
  officeSelect.add(option, officeSelect[i]);
}

// Set data attributes
nameInput.setAttribute('data-qa', 'name');
positionInput.setAttribute('data-qa', 'position');
officeSelect.setAttribute('data-qa', 'office');
ageInput.setAttribute('data-qa', 'age');
salaryInput.setAttribute('data-qa', 'salary');

// Text values for labels
const textName = 'Name: ';
const textPosition = 'Position: ';
const textOffice = 'Office: ';
const textAge = 'Age: ';
const textSalary = 'Salary: ';
const buttonText = 'Save to table';

// Add some text value to a label
nameLabel.textContent = textName;
positionLabel.textContent = textPosition;
selectLabel.textContent = textOffice;
ageLabel.textContent = textAge;
salaryLabel.textContent = textSalary;
button.textContent = buttonText;

// Add inputs to the coresponding labels
nameLabel.append(nameInput);
positionLabel.append(positionInput);
selectLabel.append(officeSelect);
ageLabel.append(ageInput);
salaryLabel.append(salaryInput);

// Appention of the labels to the form
form.append(nameLabel);
form.append(positionLabel);
form.append(selectLabel);
form.append(ageLabel);
form.append(salaryLabel);
form.append(button);

// Add a New Employee to the table
const buttonSave = document.querySelector('button');
const tBody = document.querySelector('tbody');

buttonSave.addEventListener('click', function addNewEmployee(action) {
  action.preventDefault();

  const target = action.target.closest('button');

  // Create new employee from the Form inputs
  class NewEmployee {
    constructor(fullName, position, office, age, salary) {
      this.fullName = fullName;
      this.position = position;
      this.office = office;
      this.age = age;
      this.salary = '$' + salary;
    }
  };

  const body = document.querySelector('body');
  const notification = document.createElement('div');

  body.append(notification);

  // Validation check of data and show Notifications

  // Mistake! Does not add a new person. User gets a Notification.
  if ((nameInput.value.length <= 4)
      || ((ageInput.value > 90 && ageInput.value < 18)
        || ageInput.value === undefined)
      || (salaryInput.value < 1 || salaryInput.value === undefined)
      || (positionInput.value.length < 1
        || positionInput.value === undefined)) {
    // Notification Classes
    notification.classList.add('notification');
    notification.classList.add('warning');
    notification.classList.toggle('error');

    notification.setAttribute('data-qa', 'notification');

    const h2 = document.createElement('h2');

    h2.className = 'title';
    h2.textContent = 'Wrong Input, Try Again!';

    notification.prepend(h2);

    const paragraph = document.createElement('p');

    paragraph.textContent = `Name must be at least 4 letters long!\n
    Age must be At least 18y.o. and Maximum 90y.o.!\n
    Do Not Leave Empty Fields!`;
    notification.append(paragraph);

    notification.style.position = 'absolute';
    notification.style.top = 60 + '%';
    notification.style.right = 0 + 'px';

    setTimeout(() =>
      notification.remove(), 7000);
  } else {
    // Successful operation, validation is passed. User gets a Notification.
    if (target.tagName === 'BUTTON'
    && (nameInput.value.length > 4)
      && (ageInput.value < 90 && ageInput.value > 18)
      && salaryInput.value > 0
      && positionInput.value.length > 1) {
      notification.classList.add('notification');
      notification.classList.add('warning');
      notification.classList.toggle('success');

      notification.setAttribute('data-qa', 'notification');

      const h2 = document.createElement('h2');

      h2.textContent = 'Very Good! Success!';

      notification.prepend(h2);

      const paragraph = document.createElement('p');

      paragraph.textContent = `Congratulations!!! You have a new employee!\n
        You'll have to increase your staff budget`;
      notification.append(paragraph);

      notification.style.position = 'absolute';
      notification.style.top = 0 + '%';
      notification.style.right = 0 + 'px';

      setTimeout(() =>
        notification.remove(), 7000);

      const employee = new NewEmployee(nameInput.value, positionInput.value,
        officeSelect.value, ageInput.value, salaryInput.value);

      const arr = Object.values(employee);
      const tr = document.createElement('tr');

      tr.setAttribute('tabindex', 0);

      // Each Form Input is passed on the corresponding table cell
      for (let i = 0; i < tBody.rows[0].children.length; i++) {
        const td = document.createElement('td');

        td.append(arr[i]);
        tr.append(td);
      }

      tBody.append(tr);
    }

    nameInput.value = '';
    positionInput.value = '';
    ageInput.value = '';
    salaryInput.value = '';
  }
});

// Make all tBody rows focusable, by adding tabindex="0"
for (const row of [...tBody.rows]) {
  row.setAttribute('tabindex', 0);
}

// Highlight a tBody row
tBody.addEventListener('focusin', function highlight(action) {
  const row = action.target.closest('tr');

  row.classList.add('active');
});

// Remove highlight of a tBody row
tBody.addEventListener('focusout', function removeHighlight(action) {
  const row = action.target.closest('tr');

  row.classList.remove('active');
});

const theadRow = document.querySelector('thead tr');

// Sort the Table
let clickedTitle = '';

theadRow.addEventListener('click', function sortTable(action) {
  const cell = action.target.closest('th');
  const index = [...theadRow.children]
    .findIndex(el => el.textContent === cell.textContent);
  const sorted = [...tBody.rows];

  switch (cell.textContent) {
    case 'Name':
    case 'Position':
    case 'Office':
      sorted.sort((a, b) => {
        return clickedTitle === cell.textContent
          ? b.children[index]
            .textContent
            .localeCompare(a.children[index].textContent)
          : a.children[index]
            .textContent
            .localeCompare(b.children[index].textContent);
      });

      clickedTitle = cell.textContent;
      break;

    case 'Age':
      sorted.sort((a, b) => {
        const ageA = a.innerText.split('\t')[3].trim();
        const ageB = b.innerText.split('\t')[3].trim();

        if (clickedTitle === cell.textContent) {
          return ageB - ageA;
        } else {
          return ageA - ageB;
        }
      });

      clickedTitle = cell.textContent;
      break;

    case 'Salary':
      sorted.sort((a, b) => {
        const salaryA = a.innerText.split('\t')[4];
        const salaryB = b.innerText.split('\t')[4];

        const one = salaryA.slice(1).split(',').join('');
        const two = salaryB.slice(1).split(',').join('');

        if (clickedTitle === cell.textContent) {
          return two - one;
        } else {
          return one - two;
        }
      });

      clickedTitle = cell.textContent;
      break;
  }

  tBody.append(...sorted);
});

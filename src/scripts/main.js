'use strict';

// write code here

const body = document.querySelector('body');
const theadTh = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');
const tbodyTr = tbody.querySelectorAll('tr');
let countForSort = 0;
let prevElementForSort;

const form = document.createElement('form');

form.classList.add('new-employee-form');

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

const officeSelect = document.createElement('select');
const officeLabel = document.createElement('label');
const officeOption1 = document.createElement('option');
const officeOption2 = document.createElement('option');
const officeOption3 = document.createElement('option');
const officeOption4 = document.createElement('option');
const officeOption5 = document.createElement('option');
const officeOption6 = document.createElement('option');

officeSelect.appendChild(officeOption1);
officeSelect.appendChild(officeOption2);
officeSelect.appendChild(officeOption3);
officeSelect.appendChild(officeOption4);
officeSelect.appendChild(officeOption5);
officeSelect.appendChild(officeOption6);

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

const formButton = document.createElement('button');

nameInput.setAttribute('name', 'name');
nameInput.setAttribute('type', 'text');
nameInput.setAttribute('id', 'name-input');
nameInput.setAttribute('data-qa', 'name');
nameInput.required = true;
nameLabel.textContent = 'Name:';

positionInput.setAttribute('name', 'position');
positionInput.setAttribute('type', 'text');
positionInput.setAttribute('id', 'position-input');
positionInput.setAttribute('data-qa', 'position');
positionLabel.textContent = 'Position:';

officeSelect.setAttribute('name', 'office');
officeSelect.setAttribute('id', 'office-select');
officeSelect.setAttribute('data-qa', 'office');
officeSelect.required = true;
officeLabel.textContent = 'Office:';

officeOption1.setAttribute('value', 'Tokyo');
officeOption2.setAttribute('value', 'Singapore');
officeOption3.setAttribute('value', 'London');
officeOption4.setAttribute('value', 'New York');
officeOption5.setAttribute('value', 'Edinburgh');
officeOption6.setAttribute('value', 'San Francisco');

officeOption1.textContent = 'Tokyo';
officeOption2.textContent = 'Singapore';
officeOption3.textContent = 'London';
officeOption4.textContent = 'New York';
officeOption5.textContent = 'Edinburgh';
officeOption6.textContent = 'San Francisco';

ageInput.setAttribute('name', 'age');
ageInput.setAttribute('type', 'number');
ageInput.setAttribute('id', 'age-input');
ageInput.setAttribute('data-qa', 'age');
ageInput.required = true;
ageLabel.textContent = 'Age:';

salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('id', 'salary-input');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = true;
salaryLabel.textContent = 'Salary:';

formButton.textContent = 'Save to table';

nameLabel.appendChild(nameInput);
positionLabel.appendChild(positionInput);
officeLabel.appendChild(officeSelect);
ageLabel.appendChild(ageInput);
salaryLabel.appendChild(salaryInput);

form.appendChild(nameLabel);
form.appendChild(positionLabel);
form.appendChild(officeLabel);
form.appendChild(ageLabel);
form.appendChild(salaryLabel);
form.appendChild(formButton);

body.appendChild(form);

theadTh.forEach((th, index) => {
  th.addEventListener('click', (e) => {
    const rows = [...tbody.querySelectorAll('tr')];

    if (prevElementForSort === undefined) {
      prevElementForSort = e.target.textContent;
    }

    if (prevElementForSort !== e.target.textContent) {
      prevElementForSort = e.target.textContent;
      countForSort = 0;
    }

    if (countForSort > 1) {
      countForSort = 0;
    }

    countForSort++;

    rows.sort((r1, r2) => {
      const v1 = r1.children[index].textContent.trim();
      const v2 = r2.children[index].textContent.trim();

      if (countForSort === 1) {
        if (v1[0] === '$') {
          const replacedV1 = v1.replace(/[$, ]/g, '').trim();
          const replacedV2 = v2.replace(/[$, ]/g, '').trim();

          return +replacedV1 - +replacedV2;
        } else if (!isNaN(+v1)) {
          return +v1 - +v2;
        } else {
          return v1.localeCompare(v2);
        }
      } else {
        if (v1[0] === '$') {
          const replacedV1 = v1.replace(/[$, ]/g, '').trim();
          const replacedV2 = v2.replace(/[$, ]/g, '').trim();

          return +replacedV2 - +replacedV1;
        } else if (!isNaN(+v1)) {
          return +v2 - +v1;
        } else {
          return v2.localeCompare(v1);
        }
      }
    });

    tbody.append(...rows);
  });
});

tbodyTr.forEach((td) => {
  td.addEventListener('click', (e) => {
    tbodyTr.forEach((tr) => {
      if (tr.classList.contains('active')) {
        tr.classList.remove('active');
      }
    });

    e.target.parentElement.classList.add('active');
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const personeName = document.getElementById('name-input').value;
  const position = document.getElementById('position-input').value;
  const office = document.getElementById('office-select').value;
  const age = +document.getElementById('age-input').value;
  const salary = +document.getElementById('salary-input').value;

  let check = true;

  if (personeName.length < 4) {
    pushNotification(
      'Name error',
      'Name length should be longer than 3 elements',
      'error',
    );
    check = false;
  }

  if (position.length < 4) {
    pushNotification(
      'Position error',
      'Position field should be longer than 3 elements',
      'error',
    );
    check = false;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      'Age error',
      'Age can not be less than 18 and more than 90',
      'error',
    );
    check = false;
  }

  if (check) {
    const convertedSalary = '$' + salary.toLocaleString('en-US');

    const newRow = tbody.insertRow();

    const nameCell = newRow.insertCell(0);
    const positionCell = newRow.insertCell(1);
    const officeCell = newRow.insertCell(2);
    const ageCell = newRow.insertCell(3);
    const salaryCell = newRow.insertCell(4);

    nameCell.innerHTML = personeName;
    positionCell.innerHTML = position;
    officeCell.innerHTML = office;
    ageCell.innerHTML = age;
    salaryCell.innerHTML = convertedSalary;

    pushNotification(
      'Success',
      'Data has been succefull uploaded to table',
      'success',
    );

    form.reset();
  }
});

const pushNotification = (title, description, type) => {
  // write code here
  const divBlock = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');
  const bodyBlock = document.querySelector('body');

  divBlock.classList.add('notification');
  divBlock.classList.add(`${type}`);
  divBlock.setAttribute('data-qa', 'notification');

  messageTitle.textContent = title;
  messageTitle.classList.add('title');

  messageDescription.textContent = description;

  divBlock.appendChild(messageTitle);
  divBlock.appendChild(messageDescription);

  bodyBlock.appendChild(divBlock);

  setTimeout(() => {
    divBlock.style.display = 'none';
  }, 5000);
};

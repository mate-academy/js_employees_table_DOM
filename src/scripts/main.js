'use strict';

function sortRowsByNumber(childSelector) {
  let result = [];
  const childNomer = childSelector + 1;
  const tableRows = document.querySelectorAll('tbody tr');

  if (childSelector === 0 || childSelector === 1 || childSelector === 2) {
    result = [...tableRows].sort((a, b) => {
      const lettersA = a.querySelector(
        `td:nth-child(${childNomer})`,
      ).textContent;
      const lettersB = b.querySelector(
        `td:nth-child(${childNomer})`,
      ).textContent;

      if (tableRows[0].classList.contains('sorted')) {
        return lettersA.localeCompare(lettersB);
      } else {
        return lettersB.localeCompare(lettersA);
      }
    });
  } else {
    result = [...tableRows].sort((a, b) => {
      const salaryA = +a
        .querySelector(`td:nth-child(${childNomer})`)
        .textContent.replace(/,/g, '')
        .replace(/\$/, '');
      const salaryB = +b
        .querySelector(`td:nth-child(${childNomer})`)
        .textContent.replace(/,/g, '')
        .replace(/\$/, '');

      if (tableRows[0].classList.contains('sorted')) {
        return salaryB - salaryA;
      } else {
        return salaryA - salaryB;
      }
    });
  }

  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';

  result.forEach((row) => {
    tbody.appendChild(row);
    row.classList.toggle('sorted');
  });
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add(type);

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');
  notificationTitle.textContent = title;

  const notificationMessage = document.createElement('p');

  notificationMessage.textContent = description;

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.setAttribute('data-qa', 'notification');

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationMessage);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const filter = document.querySelectorAll('thead tr th');
const tableBody = document.querySelector('tbody');

for (let i = 0; i < filter.length; i++) {
  filter[i].addEventListener('click', () => sortRowsByNumber(i));
}

tableBody.addEventListener('click', (e) => {
  const active = e.target.closest('tr');

  document
    .querySelectorAll('tbody tr')
    .forEach((x) => x.classList.remove('active'));
  active.classList.add('active');
});

const form = document.createElement('form');

const namelabel = document.createElement('label');

namelabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.type = 'text';
nameInput.setAttribute('data-qa', 'name');
nameInput.required = 'true';

const position = document.createElement('label');

position.textContent = 'position: ';

const positionInput = document.createElement('input');

position.type = 'text';
positionInput.setAttribute('data-qa', 'position');
positionInput.required = 'true';

const office = document.createElement('label');

office.textContent = 'office: ';

const officeInput = document.createElement('select');

officeInput.setAttribute('data-qa', 'office');
officeInput.required = 'true';

const optionTokyo = document.createElement('option');

optionTokyo.value = 'Tokyo';
optionTokyo.textContent = 'Tokyo';
officeInput.appendChild(optionTokyo);

const optionSingapore = document.createElement('option');

optionSingapore.value = 'Singapore';
optionSingapore.textContent = 'Singapore';
officeInput.appendChild(optionSingapore);

const optionLondon = document.createElement('option');

optionLondon.value = 'London';
optionLondon.textContent = 'London';
officeInput.appendChild(optionLondon);

const optionNewYork = document.createElement('option');

optionNewYork.value = 'New York';
optionNewYork.textContent = 'New York';
officeInput.appendChild(optionNewYork);

const optionEdinburgh = document.createElement('option');

optionEdinburgh.value = 'Edinburgh';
optionEdinburgh.textContent = 'Edinburgh';
officeInput.appendChild(optionEdinburgh);

const optionSanFrancisco = document.createElement('option');

optionSanFrancisco.value = 'San Francisco';
optionSanFrancisco.textContent = 'San Francisco';
officeInput.appendChild(optionSanFrancisco);

const age = document.createElement('label');

age.textContent = 'age: ';

const ageInput = document.createElement('input');

ageInput.type = 'text';
ageInput.setAttribute('data-qa', 'age');
ageInput.required = 'true';

const salary = document.createElement('label');

salary.textContent = 'salary: ';

const salaryInput = document.createElement('input');

salaryInput.type = 'text';
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = 'true';

form.classList.add('new-employee-form');

document.body.appendChild(form);

form.appendChild(namelabel);
namelabel.appendChild(nameInput);

form.appendChild(position);
position.appendChild(positionInput);

form.appendChild(office);
office.appendChild(officeInput);

form.appendChild(age);
age.appendChild(ageInput);

form.appendChild(salary);
salary.appendChild(salaryInput);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
form.appendChild(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const tbody = document.querySelector('tbody');

  const newRow = document.createElement('tr');

  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');

  if (nameInput.value.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Error\n ' + 'name can`t be less than 4 characters',
      'error',
    );

    return;
  }
  newName.textContent = nameInput.value;
  newPosition.textContent = positionInput.value;
  newOffice.textContent = officeInput.value;

  if (!isNaN(+ageInput.value) && +ageInput.value > 18 && +ageInput.value < 90) {
    newAge.textContent = ageInput.value;
  } else {
    pushNotification(
      10,
      10,
      'Error',
      'Error\n ' + 'age must be number and more than 18 and less than 90',
      'error',
    );

    return;
  }

  if (!isNaN(+salaryInput.value)) {
    newSalary.textContent = `$${Number(salaryInput.value).toLocaleString('en-US')}`;
  } else {
    pushNotification(
      10,
      10,
      'Error',
      'Error\n ' + 'salary must be number',
      'error',
    );

    return;
  }

  newRow.appendChild(newName);
  newRow.appendChild(newPosition);
  newRow.appendChild(newOffice);
  newRow.appendChild(newAge);
  newRow.appendChild(newSalary);

  tbody.appendChild(newRow);

  pushNotification(10, 10, 'Success', 'employee has been added', 'success');
});

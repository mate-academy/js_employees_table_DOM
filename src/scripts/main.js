'use strict';

const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

let eventNameClick = 0;
let eventPositionClick = 0;
let eventOfficeClick = 0;
let eventAgeClick = 0;
let eventSalaryClick = 0;

const sortByName = () => {
  eventNameClick++;

  const employersList = tbody.querySelectorAll('tr');

  const sortedByASC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const name1 = emloyer1.children[0].textContent;
    const name2 = emloyer2.children[0].textContent;

    return name1.localeCompare(name2);
  });

  const sortedByDESC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const name1 = emloyer1.children[0].textContent;
    const name2 = emloyer2.children[0].textContent;

    return name2.localeCompare(name1);
  });

  tbody.innerHTML = '';

  if (eventNameClick % 2 === 0) {
    for (const newPerson of sortedByDESC) {
      tbody.append(newPerson);
    }
  } else {
    for (const newPerson of sortedByASC) {
      tbody.append(newPerson);
    }
  }
};

const sortByPosition = () => {
  const employersList = tbody.querySelectorAll('tr');

  eventPositionClick++;

  const sortedByASC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const position1 = emloyer1.children[1].textContent;
    const position2 = emloyer2.children[1].textContent;

    return position1.localeCompare(position2);
  });

  const sortedByDESC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const position1 = emloyer1.children[1].textContent;
    const position2 = emloyer2.children[1].textContent;

    return position2.localeCompare(position1);
  });

  tbody.innerHTML = '';

  if (eventPositionClick % 2 === 0) {
    for (const newPerson of sortedByDESC) {
      tbody.append(newPerson);
    }
  } else {
    for (const newPerson of sortedByASC) {
      tbody.append(newPerson);
    }
  }
};

const sortByOffice = () => {
  const employersList = tbody.querySelectorAll('tr');

  eventOfficeClick++;

  const sortedByASC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const office1 = emloyer1.children[2].textContent;
    const office2 = emloyer2.children[2].textContent;

    return office1.localeCompare(office2);
  });

  const sortedByDESC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const office1 = emloyer1.children[2].textContent;
    const office2 = emloyer2.children[2].textContent;

    return office2.localeCompare(office1);
  });

  tbody.innerHTML = '';

  if (eventOfficeClick % 2 === 0) {
    for (const newPerson of sortedByDESC) {
      tbody.append(newPerson);
    }
  } else {
    for (const newPerson of sortedByASC) {
      tbody.append(newPerson);
    }
  }
};

const sortByAge = () => {
  const employersList = tbody.querySelectorAll('tr');

  eventAgeClick++;

  const sortedByASC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const age1 = emloyer1.children[3].textContent;
    const age2 = emloyer2.children[3].textContent;

    return age1 - age2;
  });

  const sortedByDESC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const age1 = emloyer1.children[3].textContent;
    const age2 = emloyer2.children[3].textContent;

    return age2 - age1;
  });

  tbody.innerHTML = '';

  if (eventAgeClick % 2 === 0) {
    for (const newPerson of sortedByDESC) {
      tbody.append(newPerson);
    }
  } else {
    for (const newPerson of sortedByASC) {
      tbody.append(newPerson);
    }
  }
};

const sortBySalary = () => {
  const employersList = tbody.querySelectorAll('tr');

  eventSalaryClick++;

  const sortedByASC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const salary1 = emloyer1.children[4].textContent
      .replace('$', '')
      .replace(/,/g, '');
    const salary2 = emloyer2.children[4].textContent
      .replace('$', '')
      .replace(/,/g, '');

    return Number(salary1) - Number(salary2);
  });

  const sortedByDESC = Array.from(employersList).sort((emloyer1, emloyer2) => {
    const salary1 = emloyer1.children[4].textContent
      .replace('$', '')
      .replace(/,/g, '');
    const salary2 = emloyer2.children[4].textContent
      .replace('$', '')
      .replace(/,/g, '');

    return Number(salary2) - Number(salary1);
  });

  if (eventSalaryClick % 2 === 0) {
    for (const newPerson of sortedByDESC) {
      tbody.append(newPerson);
    }
  } else {
    for (const newPerson of sortedByASC) {
      tbody.append(newPerson);
    }
  }
};

const activePerson = (person) => {
  const employers = tbody.querySelectorAll('tr');
  const isActive = Array.from(employers).find((employer) => {
    return employer.classList.contains('active');
  });

  if (isActive) {
  } else {
    person.classList.add('active');
  }
};

const form = document.createElement('form');

form.classList.add('new-employee-form');

const nameLable = document.createElement('label');
const positionLable = document.createElement('label');
const officeLable = document.createElement('label');
const ageLable = document.createElement('label');
const salaryLable = document.createElement('label');

const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const officeInput = document.createElement('select');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');

const optionTokyo = document.createElement('option');

optionTokyo.textContent = 'Tokyo';
optionTokyo.value = 'Tokyo';

const optionSingapore = document.createElement('option');

optionSingapore.textContent = 'Singapore';
optionSingapore.value = 'Singapore';

const optionLondon = document.createElement('option');

optionLondon.textContent = 'London';
optionLondon.value = 'London';

const optionNewYork = document.createElement('option');

optionNewYork.textContent = 'New York';
optionNewYork.value = 'New York';

const optionEdinburgh = document.createElement('option');

optionEdinburgh.textContent = 'Edinburgh';
optionEdinburgh.value = 'Edinburgh';

const optionSanFrancisco = document.createElement('option');

optionSanFrancisco.textContent = 'San Francisco';
optionSanFrancisco.value = 'San Francisco';

officeInput.append(
  optionTokyo,
  optionSingapore,
  optionLondon,
  optionNewYork,
  optionEdinburgh,
  optionSanFrancisco,
);

const formButton = document.createElement('button');

formButton.textContent = 'Save to table';
formButton.type = 'submit';

nameInput.setAttribute('name', 'name');
positionInput.setAttribute('name', 'position');
officeInput.setAttribute('name', 'office');
officeInput.setAttribute('data-qa', 'office');
officeInput.required = true;
ageInput.setAttribute('name', 'age');
salaryInput.setAttribute('name', 'salary');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.required = true;

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.required = true;

officeInput.setAttribute('data-qa', 'office');
officeInput.required = true;

ageInput.setAttribute('type', 'text');
ageInput.setAttribute('data-qa', 'age');
ageInput.required = true;

salaryInput.setAttribute('type', 'text');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = true;

nameLable.textContent = 'Name:  ';
positionLable.textContent = 'Position:  ';
officeLable.textContent = 'Office:  ';
ageLable.textContent = 'Age:  ';
salaryLable.textContent = 'Salary:  ';

nameLable.append(nameInput);
positionLable.append(positionInput);
officeLable.append(officeInput);
ageLable.append(ageInput);
salaryLable.append(salaryInput);

form.append(
  nameLable,
  positionLable,
  officeLable,
  ageLable,
  salaryLable,
  formButton,
);

body.append(form);

const notification = document.createElement('div');

notification.className = 'notification';
notification.style.display = 'none';

const notificationTitle = document.createElement('span');

notificationTitle.className = 'title';
notification.append(notificationTitle);

body.append(notification);

function showNotification(type = '', message = '') {
  notification.className = 'notification';

  if (type) {
    notification.classList.add(type);
  }
  notification.style.display = 'block';

  if (type === 'success') {
    notificationTitle.textContent = 'Успіх!';
    notification.appendChild(notificationTitle);
    notification.append(' Працівника успішно додано!');
  } else if (type === 'error') {
    notificationTitle.textContent = 'Помилка!';
    notification.appendChild(notificationTitle);
    notification.append(' Щось пішло не так.');
  } else {
    notificationTitle.textContent = '';
    notification.textContent = message || '';
  }

  setTimeout(() => {
    notification.style.display = 'none';
    notification.className = 'notification';
    notification.textContent = '';
    notification.appendChild(notificationTitle);
  }, 2000);
}

const addEmployer = () => {
  const newEmployer = document.createElement('tr');
  const employerName = document.createElement('td');

  employerName.textContent = nameInput.value;

  const employerPosition = document.createElement('td');

  employerPosition.textContent = positionInput.value;

  const employerOffice = document.createElement('td');

  employerOffice.textContent = officeInput.value;

  const employerAge = document.createElement('td');

  employerAge.textContent = ageInput.value;

  const employerSalary = document.createElement('td');
  const salary = Number(salaryInput.value).toLocaleString('en-US');

  employerSalary.textContent = '$' + salary;

  newEmployer.append(
    employerName,
    employerPosition,
    employerOffice,
    employerAge,
    employerSalary,
  );
  tbody.append(newEmployer);
};

document.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (e.target.textContent === 'Name') {
    sortByName();
  } else if (e.target.textContent === 'Position') {
    sortByPosition();
  } else if (e.target.textContent === 'Office') {
    sortByOffice();
  } else if (e.target.textContent === 'Age') {
    sortByAge();
  } else if (e.target.textContent === 'Salary') {
    sortBySalary();
  } else if (tr && tr.parentElement === tbody) {
    activePerson(tr);
  } else if (e.target.tagName === 'BUTTON') {
    e.preventDefault();

    if (
      nameInput.value.length < 4 ||
      Number(ageInput.value) < 18 ||
      Number(ageInput.value) > 90
    ) {
      showNotification('error');
    } else {
      addEmployer();
      showNotification('success');
    }
  }
});

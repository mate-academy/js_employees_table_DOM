'use strict';

const head = document.querySelectorAll('thead th');
const body = document.querySelector('tbody');

let p = 1;
let lastClicked = -1;

for (let i = 0; i < head.length; i++) {
  head[i].addEventListener('click', () => {
    const list = body.querySelectorAll('tr');
    const listArray = Array.from(list);


    if (lastClicked !== i) {
      p = 1;
      lastClicked = i;
    }


    if (p === 1) {
      listArray.sort((el1, el2) => {
        const el1t = el1.children[i].textContent;
        const el2t = el2.children[i].textContent;

        if (i <= 2) {
          if (el1t > el2t) return 1;
          if (el1t < el2t) return -1;
          return 0;
        }

        if (i === 3) {
          if (Number(el1t) > Number(el2t)) return 1;
          if (Number(el1t) < Number(el2t)) return -1;
          return 0;
        }

        if (i === 4) {
          if (salary(el1t) > salary(el2t)) return 1;
          if (salary(el1t) < salary(el2t)) return -1;
          return 0;
        }
      });
      p = 2;
    } else if (p === 2) {
      listArray.sort((el1, el2) => {
        const text1 = el1.children[i].textContent;
        const text2 = el2.children[i].textContent;

        if (i <= 2) {
          if (text1 < text2) return 1;
          if (text1 > text2) return -1;
          return 0;
        }

        if (i === 3) {
          if (Number(text1) < Number(text2)) return 1;
          if (Number(text1) > Number(text2)) return -1;
          return 0;
        }

        if (i === 4) {
          if (salary(text1) < salary(text2)) return 1;
          if (salary(text1) > salary(text2)) return -1;
          return 0;
        }
      });
      p = 1;
    }

    body.append(...listArray);
  });
}

function salary(text) {
  const cleanText = text.slice(1).split(',').join('');
  return Number(cleanText);
}

body.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');
  if (!clickedRow) return;

  const currentActive = body.querySelector('.active');
  if (currentActive) {
    currentActive.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const form = document.createElement('form');
form.classList.add('new-employee-form');

const namee = document.createElement('input');
namee.type = 'text';
namee.name = 'name';
namee.setAttribute('data-qa', 'name');
const nameL = document.createElement('label');
nameL.textContent = 'Name:';
nameL.append(namee);
form.append(nameL);

const position = document.createElement('input');
position.type = 'text';
position.name = 'position';
position.setAttribute('data-qa', 'position');
const positionL = document.createElement('label');
positionL.textContent = 'Position:';
positionL.append(position);
form.append(positionL);

const officeSelect = document.createElement('select');
officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');

const cities = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

for (let i = 0; i < cities.length; i++) {
  const option = document.createElement('option');
  option.value = cities[i];
  option.textContent = cities[i];
  officeSelect.append(option);
}

const officeLabel = document.createElement('label');
officeLabel.textContent = 'Office: ';
officeLabel.append(officeSelect);
form.append(officeLabel);

const ageInput = document.createElement('input');
ageInput.type = 'number';
ageInput.name = 'age';
ageInput.setAttribute('data-qa', 'age');

const ageLabel = document.createElement('label');
ageLabel.textContent = 'Age: ';
ageLabel.append(ageInput);
form.append(ageLabel);

const salaryInput = document.createElement('input');
salaryInput.type = 'number';
salaryInput.name = 'salary';
salaryInput.setAttribute('data-qa', 'salary');

const salaryLabel = document.createElement('label');
salaryLabel.textContent = 'Salary: ';
salaryLabel.append(salaryInput);
form.append(salaryLabel);

const button = document.createElement('button');
button.type = 'submit';
button.textContent = 'Save to table';
form.append(button);

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = namee.value;
  const positionValue = position.value;
  const officeValue = officeSelect.value;
  const ageValue = ageInput.value;
  const salaryValue = salaryInput.value;

  if (nameValue === '' || positionValue === ''|| ageValue === '' || salaryValue === '') {
    showNotification('Input the data correct', true);
    return;
  }

  if (nameValue.length < 4) {
    showNotification('Name is too short', true);
    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    showNotification('Age must be between 18 and 90', true);
    return;
  }

  const addList = document.createElement('tr');
  const tabelname = document.createElement('td');
  tabelname.textContent = nameValue;
  addList.append(tabelname);

  const tabelPosition = document.createElement('td');
  tabelPosition.textContent = positionValue;
  addList.append(tabelPosition);

  const tabelOffice = document.createElement('td');
  tabelOffice.textContent = officeValue;
  addList.append(tabelOffice);

  const tabelAge = document.createElement('td');
  tabelAge.textContent = Number(ageValue);
  addList.append(tabelAge);

  const tabelSalary = document.createElement('td');
  tabelSalary.textContent = toSalary(salaryValue);
  addList.append(tabelSalary);

  body.append(addList);
  showNotification('success', false);
});

function showNotification(message, isError) {
  const oldNotification = document.querySelector('[data-qa="notification"]');
  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');
  notification.setAttribute('data-qa', 'notification');

  if (isError) {
    notification.classList.add('error');
  } else {
    notification.classList.add('success');
  }

  notification.textContent = message;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function toSalary(number){
  const num = Number(number);

  return '$' + num.toLocaleString('en-US');
}



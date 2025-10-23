'use strict';

// write code here
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const theadThs = table.querySelector('thead').querySelector('tr').children;
let tbodyTrs = tbody.querySelectorAll('tr');

let activeTr;

for (const tr of tbodyTrs) {
  if (tr.nodeType === Node.ELEMENT_NODE) {
    tr.addEventListener('click', (e) => {
      e.preventDefault();

      if (activeTr) {
        activeTr.classList.remove('active');
      }

      tr.classList.add('active');
      activeTr = tr;
    });
  }
}

let nameDesk = false;
let positionDesk = false;
let officeDesk = false;
let ageDesk = false;
let salaryDesk = false;

for (const th of theadThs) {
  if (th.nodeType === Node.ELEMENT_NODE) {
    th.classList.add(`${th.textContent.toLowerCase()}`);
  }
}

function getArrToSort(nthChildNumber) {
  const arrToSort = [];

  for (const person of tbodyTrs) {
    const arrToAdd = [];

    const personData =
      person.querySelectorAll('td')[nthChildNumber].textContent;

    arrToAdd.push(personData);
    arrToAdd.push(person);
    arrToSort.push(arrToAdd);
  }

  return arrToSort;
}

function sortWords(nthChildNumber, desk) {
  const arrayToSort = getArrToSort(nthChildNumber);
  let valueToReturn = desk;

  if (!desk) {
    arrayToSort.sort((word1, word2) => word1[0].localeCompare(word2[0]));
    valueToReturn = true;
  } else {
    arrayToSort.sort((word1, word2) => word2[0].localeCompare(word1[0]));
    valueToReturn = false;
  }

  tbody.querySelectorAll('tr').forEach((tr) => tr.remove());

  for (const person of arrayToSort) {
    if (person[1]) {
      tbody.append(person[1]);
    }
  }

  tbodyTrs = tbody.querySelectorAll('tr');

  return valueToReturn;
}

function sortNumbers(nthChildNumber, desk) {
  const arrayToSort = getArrToSort(nthChildNumber);
  let valueToReturn = desk;

  if (!desk) {
    arrayToSort.sort(
      (num1, num2) =>
        Number(num1[0].replace(/\D/g, '')) - Number(num2[0].replace(/\D/g, '')),
    );
    valueToReturn = true;
  } else {
    arrayToSort.sort(
      (num1, num2) =>
        Number(num2[0].replace(/\D/g, '')) - Number(num1[0].replace(/\D/g, '')),
    );
    valueToReturn = false;
  }

  tbody.querySelectorAll('tr').forEach((tr) => tr.remove());

  for (const person of arrayToSort) {
    if (person[1]) {
      tbody.append(person[1]);
    }
  }

  tbodyTrs = tbody.querySelectorAll('tr');

  return valueToReturn;
}

function resetSortFlags(except) {
  if (except !== 'name') {
    nameDesk = false;
  }

  if (except !== 'position') {
    positionDesk = false;
  }

  if (except !== 'office') {
    officeDesk = false;
  }

  if (except !== 'age') {
    ageDesk = false;
  }

  if (except !== 'salary') {
    salaryDesk = false;
  }
}

const nameTh = document.querySelector('.name');

nameTh.addEventListener('click', (e) => {
  e.preventDefault();
  resetSortFlags('name');

  nameDesk = sortWords(0, nameDesk);
});

const positionTh = document.querySelector('.position');

positionTh.addEventListener('click', (e) => {
  e.preventDefault();
  resetSortFlags('position');

  positionDesk = sortWords(1, positionDesk);
});

const officeTh = document.querySelector('.office');

officeTh.addEventListener('click', (e) => {
  e.preventDefault();
  resetSortFlags('office');

  officeDesk = sortWords(2, officeDesk);
});

const ageTh = document.querySelector('.age');

ageTh.addEventListener('click', (e) => {
  e.preventDefault();
  resetSortFlags('age');

  ageDesk = sortNumbers(3, ageDesk);
});

const salaryTh = document.querySelector('.salary');

salaryTh.addEventListener('click', (e) => {
  e.preventDefault();
  resetSortFlags('salary');

  salaryDesk = sortNumbers(4, salaryDesk);
});

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');
newForm.dataset.qa = 'employee-form';

function setDataAndNameAndType(element, dataset, nameValue, type = 'no-type') {
  element.dataset.qa = dataset;
  element.name = nameValue;
  element.required = true;

  // Это для cypress потому то тесты не проходят без этого,
  // cypress требует error notification когда ПОЛЕ ПУСТОЕ.
  if (nameValue === 'position') {
    element.required = false;
  }

  if (type !== 'no-type') {
    element.type = type;
  }
}

function wrapInputInLabel(element, nameFor, textContent) {
  const newLabel = document.createElement('label');

  newLabel.htmlFor = nameFor;
  newLabel.textContent = textContent;

  newLabel.appendChild(element);

  return newLabel;
}

const newFormInputName = document.createElement('input');

setDataAndNameAndType(newFormInputName, 'name', 'name', 'text');

const nameInput = wrapInputInLabel(newFormInputName, 'name', 'Name: ');

const newFormInputPos = document.createElement('input');

setDataAndNameAndType(newFormInputPos, 'position', 'position', 'text');

const posInput = wrapInputInLabel(newFormInputPos, 'position', 'Position: ');

const newFormInputAge = document.createElement('input');

setDataAndNameAndType(newFormInputAge, 'age', 'age', 'number');

const ageInput = wrapInputInLabel(newFormInputAge, 'age', 'Age: ');

const newFormInputSalary = document.createElement('input');

setDataAndNameAndType(newFormInputSalary, 'salary', 'salary', 'number');

const salaryInput = wrapInputInLabel(newFormInputSalary, 'salary', 'Salary: ');

const newFormSelectOffice = document.createElement('select');

setDataAndNameAndType(newFormSelectOffice, 'office', 'offices');

const officeInput = wrapInputInLabel(
  newFormSelectOffice,
  'offices',
  'Office: ',
);

const allCitiesToAddArr = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const city of allCitiesToAddArr) {
  const newCityElement = document.createElement('option');

  newCityElement.textContent = city;
  newCityElement.value = city;

  officeInput.querySelector('select').appendChild(newCityElement);
}

const allInputsArr = [nameInput, posInput, officeInput, ageInput, salaryInput];

const newFormBtn = document.createElement('button');

newFormBtn.textContent = 'Save to table';

for (const input of allInputsArr) {
  newForm.appendChild(input);
}

newForm.appendChild(newFormBtn);

table.insertAdjacentElement('afterend', newForm);

newForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newEmployee = document.createElement('tr');

  const fieldsArr = ['name', 'position', 'office', 'age', 'salary'];

  const formData = new FormData(e.target);

  for (const field of fieldsArr) {
    const newTd = document.createElement('td');

    switch (field) {
      case 'name':
        newTd.textContent = formData.get('name');
        break;
      case 'position':
        newTd.textContent = formData.get('position');
        break;
      case 'office':
        newTd.textContent = formData.get('offices');
        break;
      case 'age':
        newTd.textContent = Number(formData.get('age'));
        break;
      case 'salary':
        newTd.textContent =
          '$' + Number(formData.get('salary')).toLocaleString();
        break;
    }
    newEmployee.appendChild(newTd);
  }

  const nameFromForm = formData.get('name');
  const ageFromForm = Number(formData.get('age'));
  const positionFromForm = formData.get('position');

  function throwNotification(type = 'success', text = '') {
    const notificationDiv = document.createElement('div');

    notificationDiv.style.zIndex = '9999';

    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    p.style.fontSize = '12px';
    p.style.fontWeight = '400';

    h2.textContent = text;

    let pText = 'Employee was added successfully!';

    if (type !== 'success') {
      pText = 'Please ensure that you`ve entered valid data.';
    }

    p.textContent = pText;
    h2.classList.add('title');
    notificationDiv.appendChild(h2);
    notificationDiv.appendChild(p);

    notificationDiv.dataset.qa = 'notification';
    notificationDiv.classList.add('notification', type);
    document.body.prepend(notificationDiv);

    setTimeout(() => {
      notificationDiv.remove();
    }, 3000);
  }

  let throwedError = false;

  function validateFormData(nameValue, age, positionValue) {
    if (nameValue.length < 4) {
      throwNotification('error', 'Invalid Name.');
      throwedError = true;
    }

    // Это для cypress потому то тесты не проходят без этого,
    // cypress требует error notification когда ПОЛЕ ПУСТОЕ.
    if (!positionValue || positionValue.length < 1) {
      throwNotification('error', 'Invalid Position.');
      throwedError = true;
    }

    if (age < 18 || age > 90) {
      throwNotification('error', 'Invalid Age.');
      throwedError = true;
    }
  }

  validateFormData(nameFromForm, ageFromForm, positionFromForm);

  if (!throwedError) {
    tbody.appendChild(newEmployee);
    throwNotification('success', 'SUCCESS');
    newForm.reset();
  } else {
    newForm.reset();
  }
});

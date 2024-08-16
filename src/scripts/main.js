'use strict';

// write code here
const body = document.querySelector('body');
const theads = [...document.querySelectorAll('thead tr th')];
const tbody = document.querySelector('tbody');

let cellIndex = null;
let row = null;

theads.forEach((thead, index) => {
  thead.addEventListener('click', (e) => {
    const tbodyChildren = [...document.querySelectorAll('tbody tr')];

    if (cellIndex !== e.target.cellIndex) {
      cellIndex = e.target.cellIndex;

      const sorted = tbodyChildren.sort((a, b) => {
        const valueA = a
          .querySelector(`*:nth-child(${index + 1})`)
          .textContent.split(' ')
          .join('')
          .replaceAll('$', '');
        const valueB = b
          .querySelector(`*:nth-child(${index + 1})`)
          .textContent.split(' ')
          .join('')
          .replaceAll('$', '');

        if (!isNaN(parseFloat(valueA)) && !isNaN(parseFloat(valueB))) {
          return parseFloat(valueA) - parseFloat(valueB);
        }

        return valueA.localeCompare(valueB);
      });

      tbody.innerHTML = '';
      sorted.forEach((el) => tbody.append(el));
    } else {
      const reversedColumn = tbodyChildren.reverse();

      tbody.innerHTML = '';
      reversedColumn.forEach((el) => tbody.append(el));
    }
  });
});

tbody.addEventListener('click', (e) => {
  const tbodyChildren = [...document.querySelectorAll('tbody tr')];
  const currentRow = e.target.parentNode;

  if (row !== currentRow) {
    currentRow.classList.add('active');
    row = currentRow;
  } else {
    currentRow.classList.remove('active');
  }

  tbodyChildren.forEach((el) => {
    if (!el.contains(e.target)) {
      el.classList.remove('active');
    }
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';

body.append(form);

const formElements = {
  name: 'Name',
  position: 'Position',
  office: 'Office',
  age: 'Age',
  salary: 'Salary',
};

const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const element in formElements) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');

  label.textContent = `${formElements[element]}:`;
  input.name = element;
  select.name = element;
  input.setAttribute('data-qa', element);

  if (element === 'office') {
    select.setAttribute('data-qa', element);

    selectOptions.forEach((optionName) => {
      const option = document.createElement('option');

      option.textContent = optionName;
      option.setAttribute('value', optionName.toLowerCase());
      select.append(option);
    });

    label.append(select);
    form.append(label);
  } else if (element === 'age' || element === 'salary') {
    input.type = 'number';

    label.append(input);
    form.append(label);
  } else {
    label.append(input);
    form.append(label);
  }
}

const btn = document.createElement('button');

btn.type = 'submit';
btn.textContent = 'Save to table';

form.append(btn);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTr = document.createElement('tr');
  const formData = new FormData(form);
  const inputsValues = {};
  let isValid = true;

  inputsValues.name = formData.get('name');
  inputsValues.position = formData.get('position');
  inputsValues.office = formData.get('office');
  inputsValues.age = formData.get('age');
  inputsValues.salary = formData.get('salary');

  if (
    !inputsValues.position ||
    !inputsValues.office ||
    !inputsValues.salary ||
    isNaN(parseFloat(inputsValues.salary)) ||
    parseFloat(inputsValues.salary) <= 0
  ) {
    isValid = false;

    pushNotification(
      10,
      10,
      'Error',
      'Please make sure all fields are filled out',
      'error',
    );
  }

  if (inputsValues.name.length < 4) {
    isValid = false;

    pushNotification(
      150,
      10,
      'Error',
      'Please enter minimum 4 letters to "Name:"',
      'error',
    );
  }

  if (inputsValues.age < 18 || inputsValues.age > 90) {
    isValid = false;

    pushNotification(
      290,
      10,
      'Error',
      'Please enter minimum 4 letters to "Name:"',
      'error',
    );
  }

  if (isValid) {
    for (const input in inputsValues) {
      const newTd = document.createElement('td');

      if (input === 'salary') {
        newTd.textContent = inputsValues[input].toNumber.toLocaleString(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
          },
        );
      }

      newTd.textContent =
        inputsValues[input].slice(0, 1) + inputsValues[input].slice(1);
      newTr.append(newTd);
    }

    tbody.append(newTr);

    pushNotification(
      10,
      10,
      'Success',
      'Your data have been successfully attached',
      'success',
    );
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.className = 'notification ' + type;
  notification.setAttribute('data-qa', 'notification');

  notificationTitle.classList.add('title');
  notificationDescription.classList.add('description');

  notificationTitle.textContent = title;
  notificationDescription.textContent = description;

  notification.style.position = 'absolute';
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';
  notification.style.zIndex = 99;

  notification.append(notificationTitle);
  notification.append(notificationDescription);
  body.append(notification);

  setTimeout(() => {
    body.remove(notification);
  }, 2000);
};

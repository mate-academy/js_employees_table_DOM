'use strict';

//  Сортування

const titles = [...document.querySelectorAll('table > thead > tr > th')];
const tbody = document.querySelector('tbody');

let currentIndex = -1;
let ascending = true;

titles.forEach((title, index) => {
  title.addEventListener('click', () => {
    if (currentIndex !== index) {
      currentIndex = index;
      ascending = true;
    } else {
      ascending = !ascending;
    }

    const rows = [...tbody.rows];

    rows.sort((a, b) => {
      const stringA = a.cells[index].textContent;
      const stringB = b.cells[index].textContent;
      const numberA = Number(stringA.replace('$', '').replaceAll(',', ''));
      const numberB = Number(stringB.replace('$', '').replaceAll(',', ''));

      //  Перевірки на пусті рядки
      // if (!stringA && !stringB) {
      //   return 0;
      // }

      // if (!stringA) {
      //   return 1;
      // }

      // if (!stringB) {
      //   return -1;
      // }

      if (Number.isFinite(numberA) && Number.isFinite(numberB)) {
        return ascending ? numberA - numberB : numberB - numberA;
      } else {
        return ascending
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      }
    });

    tbody.append(...rows);
  });
});

// Виділення користувача

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  //  Знову перевірка на пустий рядок
  if (!row || !tbody.contains(row)) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => {
    r.classList.remove('active');
  });

  row.classList.add('active');
});

// Створення форми

const form = document.createElement('form');

form.classList.add('new-employee-form');

const formName = document.createElement('input');
const formPosition = document.createElement('input');
const formAge = document.createElement('input');
const formSalary = document.createElement('input');
const formOffice = document.createElement('select');
const formButton = document.createElement('button');

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');
const labelOffice = document.createElement('label');

labelName.append('Name:', formName);
labelPosition.append('Position:', formPosition);
labelAge.append('Age:', formAge);
labelSalary.append('salary:', formSalary);
labelOffice.append('Office:', formOffice);

formName.dataset.qa = 'name';
formPosition.dataset.qa = 'position';
formAge.dataset.qa = 'age';
formSalary.dataset.qa = 'salary';
formOffice.dataset.qa = 'office';

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const office of offices) {
  const option = document.createElement('option');

  option.textContent = office;
  option.value = office;

  formOffice.append(option);
}

formButton.textContent = 'Save to table';
formAge.type = 'number';
formSalary.type = 'number';
formButton.type = 'submit';

formName.required = true;
// formPosition.required = true;
formAge.required = true;
formSalary.required = true;
formOffice.required = true;

form.append(
  labelName,
  labelPosition,
  labelOffice,
  labelAge,
  labelSalary,
  formButton,
);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (formName.value.length < 4) {
    pushNotification(
      50,
      10,
      'Error name',
      'Too short name, please type correct name!',
      'error',
    );
  } else if (Number(formAge.value) < 18 || Number(formAge.value) > 90) {
    pushNotification(
      50,
      10,
      'Error age',
      'Too low/high age, please type correct age!',
      'error',
    );
  } else if (formPosition.value.trim() === '') {
    pushNotification(
      50,
      10,
      'Error position',
      'Don`t have position, please type correct position!',
      'error',
    );
  } else {
    const salary = `$${Number(formSalary.value).toLocaleString('en-US')}`;
    const newPerson = document.createElement('tr');
    const values = [
      formName.value,
      formPosition.value,
      formOffice.value,
      formAge.value,
      salary,
    ];

    for (const value of values) {
      const td = document.createElement('td');

      td.textContent = value;
      newPerson.append(td);
    }

    tbody.append(newPerson);

    pushNotification(
      50,
      10,
      'Success',
      'Employee has been added to the table!',
      'success',
    );

    form.reset();
  }
});

document.body.append(form);

// Створення повідомлень

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';
  titleMessage.classList.add('title');

  titleMessage.textContent = title;
  descriptionMessage.textContent = description;

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  message.append(titleMessage, descriptionMessage);
  document.body.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
};

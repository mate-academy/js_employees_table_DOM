'use strict';

const headers = [...document.querySelectorAll('th')];
let clickCounterName = 0;
let clickCounterPosition = 0;
let clickCounterOffice = 0;
let clickCounterAge = 0;
let clickCounterSalary = 0;

headers.forEach((columnName) => {
  columnName.addEventListener('click', (e) => {
    if (columnName.textContent === 'Name') {
      clickCounterName++;

      const names = [...document.querySelectorAll('tr')]
        .map((row) => {
          return { name: row.children[0].textContent, element: row };
        })
        .filter((obj) => obj.name !== 'Name');

      if (clickCounterName === 1) {
        names.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (clickCounterName === 2) {
        names.sort((b, a) => a.name.localeCompare(b.name));
        setTimeout((a) => (clickCounterName = 0), 2000);
      }

      const body = document.querySelector('tbody');

      body.innerHTML = '';

      names.forEach((namee) => {
        body.appendChild(namee.element);
      });
    }

    if (columnName.textContent === 'Position') {
      clickCounterPosition++;

      const positions = [...document.querySelectorAll('tr')]
        .map((row) => {
          return { position: row.children[1].textContent, element: row };
        })
        .filter((obj) => obj.position !== 'Position');

      if (clickCounterPosition === 1) {
        positions.sort((a, b) => a.position.localeCompare(b.position));
      }

      if (clickCounterPosition === 2) {
        positions.sort((b, a) => a.position.localeCompare(b.position));
        setTimeout((a) => (clickCounterPosition = 0), 2000);
      }

      const body = document.querySelector('tbody');

      body.innerHTML = '';

      positions.forEach((position) => {
        body.appendChild(position.element);
      });
    }

    if (columnName.textContent === 'Office') {
      clickCounterOffice++;

      const offices = [...document.querySelectorAll('tr')]
        .map((row) => {
          return { office: row.children[2].textContent, element: row };
        })
        .filter((obj) => obj.office !== 'Office');

      if (clickCounterOffice === 1) {
        offices.sort((a, b) => a.office.localeCompare(b.office));
      }

      if (clickCounterOffice === 2) {
        offices.sort((b, a) => a.office.localeCompare(b.office));
        setTimeout((a) => (clickCounterOffice = 0), 2000);
      }

      const body = document.querySelector('tbody');

      body.innerHTML = '';

      offices.forEach((office) => {
        body.appendChild(office.element);
      });
    }

    if (columnName.textContent === 'Age') {
      clickCounterAge++;

      const ages = [...document.querySelectorAll('tr')]
        .map((row) => {
          return { age: row.children[3].textContent, element: row };
        })
        .filter((obj) => obj.age !== 'Age');

      if (clickCounterAge === 1) {
        ages.sort((a, b) => a.age - b.age);
      }

      if (clickCounterAge === 2) {
        ages.sort((b, a) => a.age - b.age);
        setTimeout((a) => (clickCounterAge = 0), 2000);
      }

      const body = document.querySelector('tbody');

      body.innerHTML = '';

      ages.forEach((age) => {
        body.appendChild(age.element);
      });
    }

    if (columnName.textContent === 'Salary') {
      clickCounterSalary++;

      const salarys = [...document.querySelectorAll('tr')]
        .map((row) => {
          return { salary: row.children[4].textContent, element: row };
        })
        .filter((obj) => obj.salary !== 'Salary');

      if (clickCounterSalary === 1) {
        salarys.sort(
          (a, b) =>
            Number(a.salary.slice(1).split(',').join('')) -
            Number(b.salary.slice(1).split(',').join('')),
        );
      }

      if (clickCounterSalary === 2) {
        salarys.sort(
          (b, a) =>
            Number(a.salary.slice(1).split(',').join('')) -
            Number(b.salary.slice(1).split(',').join('')),
        );

        setTimeout((a) => (clickCounterSalary = 0), 2000);
      }

      const body = document.querySelector('tbody');

      body.innerHTML = '';

      salarys.forEach((salary) => {
        body.appendChild(salary.element);
      });
    }
  });
});

const rowsForActive = [...document.querySelectorAll('tr')]
  .map((row) => {
    return { name: row.children[0].textContent, element: row };
  })
  .filter((obj) => obj.name !== 'Name');

rowsForActive.forEach((row) => {
  row.element.addEventListener('click', (e) => {
    rowsForActive.forEach((r) => {
      r.element.classList.remove('active');
    });
    row.element.classList.add('active');
  });
});

const form = document.createElement('form');

document.body.appendChild(form);
form.classList.add('new-employee-form');

const nameForForm = document.createElement('input');

nameForForm.setAttribute('type', 'text');
nameForForm.setAttribute('name', 'name');
nameForForm.setAttribute('required', '');
nameForForm.dataset.qa = 'name';

const ageForForm = document.createElement('input');

ageForForm.setAttribute('type', 'number');
ageForForm.setAttribute('name', 'age');
ageForForm.setAttribute('required', '');
ageForForm.dataset.qa = 'age';

const officeForForm = document.createElement('select');

officeForForm.dataset.qa = 'office';

const tokyo = document.createElement('option');
const singapore = document.createElement('option');
const london = document.createElement('option');
const newYork = document.createElement('option');
const edinburgh = document.createElement('option');
const sanFrancisco = document.createElement('option');

tokyo.textContent = 'Tokyo';
singapore.textContent = 'Singapore';
london.textContent = 'London';
newYork.textContent = 'New York';
edinburgh.textContent = 'Edinburgh';
sanFrancisco.textContent = 'San Francisco';

officeForForm.appendChild(tokyo);
officeForForm.appendChild(singapore);
officeForForm.appendChild(london);
officeForForm.appendChild(newYork);
officeForForm.appendChild(edinburgh);
officeForForm.appendChild(sanFrancisco);

const positionForForm = document.createElement('input');

positionForForm.setAttribute('type', 'text');
positionForForm.setAttribute('name', 'position');
positionForForm.setAttribute('required', '');
positionForForm.dataset.qa = 'position';

const salaryForForm = document.createElement('input');

salaryForForm.dataset.qa = 'salary';
salaryForForm.setAttribute('type', 'number');
salaryForForm.setAttribute('name', 'salary');
salaryForForm.setAttribute('required', '');

const submit = document.createElement('button');

submit.setAttribute('type', 'submit');
submit.textContent = 'Save to table';

const label1 = document.createElement('label');

label1.textContent = 'Name: ';
label1.appendChild(nameForForm);

const label2 = document.createElement('label');

label2.textContent = 'Position: ';
label2.appendChild(positionForForm);

const label3 = document.createElement('label');

label3.textContent = 'Age: ';
label3.appendChild(ageForForm);

const label4 = document.createElement('label');

label4.textContent = 'Salary ';
label4.appendChild(salaryForForm);

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office: ';
labelOffice.appendChild(officeForForm);

form.appendChild(label1);
form.appendChild(label2);
form.appendChild(labelOffice);
form.appendChild(label3);
form.appendChild(label4);
form.appendChild(submit);

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  document.body.appendChild(notification);
  notification.classList.add('notification');
  notification.dataset.qa = 'notification';

  const h2 = document.createElement('h2');

  h2.textContent = title;
  notification.appendChild(h2);

  const about = document.createElement('p');

  about.textContent = description;
  notification.appendChild(about);

  if (type === 'warning') {
    notification.classList.add('warning');
  }

  if (type === 'error') {
    notification.classList.add('error');
  }

  if (type === 'success') {
    notification.classList.add('success');
  }

  notification.style.position = 'absolute';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  setTimeout(() => {
    notification.remove();
  }, 5000);
};

submit.addEventListener('click', (e) => {
  e.preventDefault();

  const row = document.querySelector('tr').cloneNode(true);
  const userName = nameForForm.value;

  const userPosition = positionForForm.value;
  const userOffice = officeForForm.value;
  const userAge = ageForForm.value;
  const salaryInput = salaryForForm.value.toString();
  const sal = salaryInput.split('').reverse();
  const formattedZarplatnya = [];

  for (let i = sal.length - 1; i >= 0; i--) {
    if (i % 3 === 2 && i !== sal.length - 1) {
      formattedZarplatnya.push(',');
    }
    formattedZarplatnya.push(sal[i]);
  }

  const userSalary = `$${formattedZarplatnya.join('')}`;

  if (!userAge || !userName || !userPosition || !userSalary) {
    pushNotification(
      450,
      200,
      'Увага',
      'Заповніть всі поля!.\n ' + 'Нам потрібні всі вказані дані.',
      'error',
    );

    return;
  }

  if (userName.length < 4) {
    pushNotification(
      450,
      200,
      'Увага',
      "Невірно введене ім'я користувача.\n " +
        'Довжина імені повинна бути як мінімум 4 символи.',
      'error',
    );

    return;
  }

  if (userAge < 18 || userAge > 90) {
    pushNotification(
      450,
      200,
      'Увага',
      'Невалідна вікова категорія.\n ' +
        'Наші працівники можуть бути віком від 18 до 90 включно.',
      'error',
    );
  } else {
    row.children[0].textContent = userName;
    row.children[1].textContent = userPosition;
    row.children[2].textContent = userOffice;
    row.children[3].textContent = userAge;
    row.children[4].textContent = userSalary;
    document.querySelector('tbody').appendChild(row);

    pushNotification(
      450,
      200,
      'Вітаємо',
      'Нового працівника успішно додано в базу даних.\n ' +
        'Рекомендуємо переглянути оновлену таблицю.',
      'success',
    );
  }
});

const ceils = [...document.querySelectorAll('td')];

ceils.forEach((ceil) => {
  ceil.addEventListener('dblclick', (e) => {
    const isActive = document.querySelector('.cell-input');

    if (isActive) {
      return;
    }

    const newInput = document.createElement('input');

    newInput.type = 'text';
    newInput.value = ceil.textContent;
    newInput.classList.add('cell-input');
    ceil.textContent = '';
    ceil.appendChild(newInput);
    newInput.focus();

    newInput.addEventListener('blur', (ev) => {
      saveChanges(ceil, newInput);
    });

    newInput.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        saveChanges(ceil, newInput);
      }
    });

    function saveChanges(cell, input) {
      const newValue = input.value;

      cell.textContent = newValue;
      input.remove();
    }
  });
});

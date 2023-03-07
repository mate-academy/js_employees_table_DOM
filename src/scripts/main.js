'use strict';

const tBody = document.querySelector('tbody');
const arraySpecialists = [...tBody.children];
const totalTh = document.querySelectorAll('th');
const elementsTotal = [...totalTh].slice(0, 5);
let count = 1;

for (let i = 0; i < elementsTotal.length; i++) {
  elementsTotal[i].id = [i];
}

const sortTable = (e) => {
  arraySpecialists.sort((a, b) => {
    const itemA = a.cells[e.target.id].innerText;
    const itemB = b.cells[e.target.id].innerText;

    if (count % 2 !== 0) {
      switch (e.target.innerText) {
        case 'Name':
        case 'Position':
        case 'Office':
          return itemA.localeCompare(itemB);
        case 'Age':
          return itemA - itemB;
        case 'Salary':
          return parseInt(itemA.slice(1))
          - parseInt(itemB.slice(1));
      }
    } else {
      switch (e.target.innerText) {
        case 'Name':
        case 'Position':
        case 'Office':
          return itemB.localeCompare(itemA);
        case 'Age':
          return itemB - itemA;
        case 'Salary':
          return parseInt(itemB.slice(1))
          - parseInt(itemA.slice(1));
      }
    }
  });
  count++;

  return tBody.append(...arraySpecialists);
};

for (const element of elementsTotal) {
  element.addEventListener('click', sortTable);
}

for (let i = 0; i < arraySpecialists.length; i++) {
  arraySpecialists[i].addEventListener('click', (e) => {
    const childHaveActive = arraySpecialists.find(child =>
      child.classList.contains('active') === true
    );

    if (childHaveActive) {
      childHaveActive.classList.remove('active');
    }

    arraySpecialists[i].classList.add('active');
  });
};

document.body.insertAdjacentHTML('beforeend', `
  <form action="/" method="get" class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        minlength="4"
        required
      >
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label for="office">
      Office:
      <select id="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input name="age" type="number" data-qa="age" required min="18" max="90">
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit"> Save to table </button>
  </form>
`);

const form = document.forms[0];
const select = form.querySelector('[data-qa="office"]');

const createRow = (...arr) => {
  const nameField = form.name.value;
  const positionField = form.position.value;
  const officeField = select.value;
  const ageField = form.age.value;
  const salaryField = parseFloat(form.salary.value);
  const formatSalaryField = salaryField.toLocaleString('en-US');

  tBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${nameField}</td>
      <td>${positionField}</td>
      <td>${officeField}</td>
      <td>${ageField}</td>
      <td>$${formatSalaryField}</td>
    </tr>
  `);
};

function showNotification(type, title, text) {
  form.insertAdjacentHTML('afterend', `
    <div class="notification" data-qa="notification">
      <h1 class="title">${title.toUpperCase()}</h1>
      <p>${text}</p>
    </div>
  `);

  const notification = document.querySelector('.notification');

  notification.classList.add(type);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

form.name.addEventListener('change', e => {
  if (!form.name.validity.valid) {
    showNotification(
      'error', 'Incorrect name', 'Name length should be at least 4 letters'
    );
  }
});

form.age.addEventListener('change', e => {
  if (!form.age.validity.valid) {
    showNotification(
      'error', 'Enter a correct age', 'Your age must be from 18 to 90 years'
    );
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  createRow();

  showNotification(
    'success', 'Good!!!', 'New employee is successfully added to the table'
  );
  e.target.reset();
});

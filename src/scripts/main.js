'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const thead = table.querySelector('thead');
let lastTarget = null;
let currentFilter = null;
let lastActiveTr = null;

thead.rows[0].addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  if (e.target === lastTarget) {
    currentFilter = currentFilter === 'ASC' ? 'DESC' : 'ASC';
  } else {
    currentFilter = 'ASC';
  }

  const index = e.target.cellIndex;

  [...tbody.rows]
    .sort((a, b) => {
      const StringA = a.cells[index].textContent;
      const StringB = b.cells[index].textContent;
      const NumA = Number(StringA.replace(/[$,]/g, ''));
      const NumB = Number(StringB.replace(/[$,]/g, ''));

      if (Number.isNaN(NumA) && Number.isNaN(NumB)) {
        return StringA.localeCompare(StringB);
      }

      return NumA - NumB;
    })
    .forEach((element) => {
      if (currentFilter === 'ASC') {
        tbody.append(element);
      } else {
        tbody.prepend(element);
      }
    });

  lastTarget = e.target;
});

tbody.addEventListener('click', (e) => {
  const currentTr = e.target.closest('tr');

  if (currentTr !== null) {
    if (lastActiveTr !== null) {
      lastActiveTr.classList.remove('active');
    }

    currentTr.classList.add('active');

    lastActiveTr = currentTr;
  }
});

document.body.insertAdjacentHTML(
  'beforeend',
  `
  <form class="new-employee-form" novalidate>
    <label>Name: <input required data-qa="name" name="name" type="text"></label>
    <label>Position: <input required data-qa="position" name="position" type="text"></label>
    <label>Office:
      <select data-qa="office" name="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input required data-qa="age" name="age" type="number"></label>
    <label>Salary: <input required data-qa="salary" name="salary" type="number"></label>
    <button class = "button" type="submit">Save to table</button>
  </form>
  `,
);

const form = document.querySelector('form');

const pushNotification = (posTop, posRight, title, description, type) => {
  // write code here
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const pElement = document.createElement('p');

  titleElement.textContent = title;
  pElement.textContent = description;
  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  titleElement.classList.add('title');
  document.body.append(notification);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.append(titleElement);
  notification.append(pElement);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

const pushElement = (formData) => {
  const newTr = document.createElement('tr');

  formData.forEach((value, key) => {
    const newTd = document.createElement('td');

    newTd.textContent = value.trim();

    if (key === 'salary') {
      newTd.textContent = '$' + Number(value).toLocaleString('en-US');
    }

    newTr.append(newTd);
  });

  tbody.append(newTr);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const { name: naming, age, position } = Object.fromEntries(formData);

  if (naming.trim().length < 4) {
    pushNotification(
      10,
      10,
      'Invalid name',
      'Name must have at least 4 letters',
      'error',
    );
  } else if (Number(age) < 18 || Number(age) > 90) {
    pushNotification(
      10,
      10,
      'Invalid age',
      'Age must be from 18 to 90',
      'error',
    );
  } else if (position.trim().length === 0) {
    pushNotification(
      10,
      10,
      'Invalid position',
      'Position must be declared',
      'error',
    );
  } else {
    pushElement(formData);

    pushNotification(10, 10, 'Success', 'Valid data', 'success');
  }
});

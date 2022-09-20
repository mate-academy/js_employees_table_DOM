'use strict';

const form = document.createElement('form');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

form.className = 'new-employee-form';

form.insertAdjacentHTML('afterbegin',
  `
  <label >
    Name:
    <input name = "name"
    data-qa="name"
    type="text">
  </label>
  <label>
    Position:
    <input name="position"
    data-qa="position"
    type="text">
  </label>
  <label>
    Office:
    <select name="office" data-qa="office">
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
    <input name="age"
    data-qa="age"
    type="number">
  </label>
  <label>
    Salary:
    <input name="salary"
     data-qa="salary"
      type="number">
  </label>
  <button id="button"
  type="submit">
    Save to table
  </button>
  `
);

document.body.append(form);

form.addEventListener('submit', (events) => {
  events.preventDefault();

  if (form.name.value <= 3 || form.position.value <= 1) {
    pushNotification(
      'Invalid value',
      `Please enter from 4 letters`,
      'Error'
    );

    return;
  }

  if (form.age.value < 18 || form.age.value > 90) {
    pushNotification(
      'Invalid age',
      'from 18 to 90 years old',
      'Error'
    );

    return;
  }

  if (+form.salary.value <= 0) {
    pushNotification(
      'Invalid salary',
      'Please enter a value greater than 0',
      'Error'
    );

    return;
  }

  const newForm = document.createElement('tr');

  newForm.innerHTML = `
    <td>${form.name.value}</td>
    <td>${form.position.value}</td>
    <td>${form.office.value}</td>
    <td>${form.age.value}</td>
    <td>$${(+form.salary.value).toLocaleString('en-US')}</td>
  `;

  tbody.append(newForm);
  form.reset();

  pushNotification(
    'Good job!!!',
    `Your data has been saved`,
    'Success'
  );
});

const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;
  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

let check;
let sort;

thead.addEventListener('click', (events) => {
  if (check === events.target.cellIndex) {
    return tbody.append(...sort.reverse());
  }
  check = events.target.cellIndex;

  sort = [...tbody.children].sort((a, b) => {
    const sortA = a.cells[check].textContent.replace(/[$,]/g, '');
    const sortB = b.cells[check].textContent.replace(/[$,]/g, '');

    return isNaN(sortA)
      ? sortA.localeCompare(sortB)
      : sortA - sortB;
  });

  tbody.append(...sort);
});

tbody.addEventListener('click', events => {
  events.stopPropagation();

  const row = events.target.closest('tr');
  const activeRow = document.querySelector('.active');

  if (!activeRow) {
    row.classList.add('active');
  } else {
    activeRow.classList.remove('active');
    row.classList.add('active');
  }
});

tbody.addEventListener('dblclick', (events) => {
  events.target.innerHTML = `
   <input type="text"
   value="${events.target.textContent = ''}" class="cell-input">
  `;

  const clickCounter = events.target.querySelector('input');

  clickCounter.focus();

  clickCounter.addEventListener('blur', () => {
    events.target.textContent = clickCounter.value;
  });

  clickCounter.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      events.target.textContent = clickCounter.value;
    }
  });
});

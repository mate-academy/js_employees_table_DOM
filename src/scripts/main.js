'use strict';

const body = document.querySelector('body');

const pushNotification = (posTop, posRight, title, description, type) => {
  const element = document.createElement('div');

  setTimeout(() => {
    element.remove();
  }, 2000);

  element.setAttribute('data-qa', 'notification');

  element.style.top = `${posTop}px`;
  element.style.right = `${posRight}px`;

  element.className = `notification ${type}`;

  element.insertAdjacentHTML('beforeend', `
      <h2 class="title">${title}</h2>
      <p>
        ${description}
      </p>
    `);

  body.append(element);
};

const head = document.querySelector('thead');
const headRow = head.querySelector('tr');
const tableBody = document.querySelector('tbody');
const bodyRows = tableBody.querySelectorAll('tr');

tableBody.addEventListener('click', (e) => {
  const el = e.target.parentNode;

  const currBodyRows = tableBody.querySelectorAll('tr');

  [...currBodyRows].forEach(row => {
    if (row === el && !row.classList.contains('active')) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  });
});

function resetButtons(e) {
  [...headRow.children].map(button => {
    if (button !== e.target) {
      button.setAttribute('data-dir', 'asc');
    } else {
      if (button.getAttribute('data-dir') === 'desc') {
        button.setAttribute('data-dir', 'asc');
      } else {
        button.setAttribute('data-dir', 'desc');
      }
    }
  });
}

window.addEventListener('load', (e) => {
  [...headRow.children].map(button => button.setAttribute('data-dir', 'asc'));
});

headRow.addEventListener('click', sort);

function sort(e) {
  const order = e.target.getAttribute('data-dir');
  const indexSortField = [...headRow.children].indexOf(e.target);

  switch (order) {
    case 'desc':
      descF(e, indexSortField);
      break;
    case 'asc':
      ascF(e, indexSortField);
      break;
  }

  resetButtons(e);
}

function descF(e, i) {
  switch (e.target.textContent) {
    case 'Name':
    case 'Position':
    case 'Office':
      const newBodyRows1 = [...bodyRows].sort((a, b) => (
        b.cells[i].textContent.localeCompare(a.cells[i].textContent)
      ));

      bodyRows.forEach(node => node.parentNode.removeChild(node));
      newBodyRows1.forEach(node => tableBody.appendChild(node));

      break;

    case 'Age':
    case 'Salary':
      const newBodyRows4 = [...bodyRows].sort((a, b) => {
        const aSalaryStr = a.cells[i].textContent.replace(/[^\d]/g, '');
        const aSalaryValue = parseInt(aSalaryStr, 10);
        const bSalaryStr = b.cells[i].textContent.replace(/[^\d]/g, '');
        const bSalaryValue = parseInt(bSalaryStr, 10);

        return bSalaryValue - aSalaryValue;
      });

      bodyRows.forEach(node => node.parentNode.removeChild(node));
      newBodyRows4.forEach(node => tableBody.appendChild(node));

      break;
  }
};

function ascF(e, i) {
  switch (e.target.textContent) {
    case 'Name':
    case 'Position':
    case 'Office':
      const newBodyRows1 = [...bodyRows].sort((a, b) => (
        a.cells[i].textContent.localeCompare(b.cells[i].textContent)
      ));

      bodyRows.forEach(node => node.parentNode.removeChild(node));
      newBodyRows1.forEach(node => tableBody.appendChild(node));

      break;

    case 'Age':
    case 'Salary':
      const newBodyRows4 = [...bodyRows].sort((a, b) => {
        const aSalaryStr = a.cells[i].textContent.replace(/[^\d]/g, '');
        const aSalaryValue = parseInt(aSalaryStr, 10);
        const bSalaryStr = b.cells[i].textContent.replace(/[^\d]/g, '');
        const bSalaryValue = parseInt(bSalaryStr, 10);

        return aSalaryValue - bSalaryValue;
      });

      bodyRows.forEach(node => node.parentNode.removeChild(node));
      newBodyRows4.forEach(node => tableBody.appendChild(node));

      break;
  }
};

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" method="POST">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
    </label>

    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>

    <label>
      Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        min="0"
        required
      >
    </label>

    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        min="0"
        required
      >
    </label>

    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const newEmployee = Object.fromEntries(data.entries());

  newEmployee.salary = `$${
    (newEmployee.salary / 1000).toFixed(3).toString().replace('.', ',')
  }`;

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${newEmployee.name}</td>
    <td>${newEmployee.position}</td>
    <td>${newEmployee.office}</td>
    <td>${newEmployee.age}</td>
    <td>${newEmployee.salary}</td>
  `;

  if (newEmployee.name.length < 4
    && (+(newEmployee.age) < 18 || +(newEmployee.age) > 90)) {
    pushNotification(
      10, 10, 'Error', 'Field "Name" should has at leact 5 char', 'error',
    );

    pushNotification(
      150, 10, 'Error',
      'Field "Age" should be more than 4 and less than 90', 'error',
    );

    return;
  }

  if (+(newEmployee.age) < 18 || +(newEmployee.age) > 90) {
    pushNotification(
      10, 10, 'Error',
      'Field "Age" should be more than 4 and less than 90', 'error',
    );

    return;
  }

  if (newEmployee.name.length < 4) {
    pushNotification(
      10, 10, 'Error', 'Field "Name" should has at leact 5 char', 'error',
    );

    return;
  }

  pushNotification(10, 10,
    'Success', 'New employee successfylly added', 'success',
  );

  tableBody.append(newRow);

  form.reset();
});

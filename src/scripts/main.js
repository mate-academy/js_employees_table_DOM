'use strict';

const head = document.querySelector('thead');
const body = document.querySelector('tbody');
const form = document.createElement('form');
const div = document.createElement('div');
let secondClick;

const employeess = [...body.rows];

head.addEventListener('click', (event) => {
  const target = event.target;

  switch (target.textContent) {
    case 'Name':
      if (secondClick !== target.textContent) {
        secondClick = target.textContent;

        employeess.sort((a, b) => {
          return (a.children[0].textContent
            .localeCompare(b.children[0].textContent));
        });
      } else {
        employeess.reverse();
      }
      break;
    case 'Position':
      if (secondClick !== target.textContent) {
        secondClick = target.textContent;

        employeess.sort((a, b) => {
          return (a.children[1].textContent
            .localeCompare(b.children[1].textContent));
        });
      } else {
        employeess.reverse();
      }
      break;
    case 'Office':
      if (secondClick !== target.textContent) {
        secondClick = target.textContent;

        employeess.sort((a, b) => {
          return (a.children[2].textContent
            .localeCompare(b.children[2].textContent));
        });
      } else {
        employeess.reverse();
      }
      break;

    case 'Age':
      if (secondClick !== target.textContent) {
        secondClick = target.textContent;

        employeess.sort((a, b) => {
          return (a.children[3].textContent
            .localeCompare(b.children[3].textContent));
        });
      } else {
        employeess.reverse();
      }
      break;

    case 'Salary':
      if (secondClick !== target.textContent) {
        secondClick = target.textContent;

        employeess.sort((a, b) => {
          return Number(a.children[4].textContent.replace(/[$,]/g, ''))
            - Number(b.children[4].textContent.replace(/[$,]/g, ''));
        });
      } else {
        employeess.reverse();
      }
  }
  body.parentElement.append(...employeess);
});

body.addEventListener('mousedown', (event) => {
  const target = event.target;
  const children = [...body.rows];

  children.map(child => child.classList.remove('active'));

  target.parentElement.classList.add('active');
});

function createForm() {
  document.body.append(form);
  form.classList.add('new-employee-form');

  form.insertAdjacentHTML(`afterbegin`,
    `<label>Name: <input name="name" type="text" required></label>
    <label>Position: <input name="position" type="text" required></label>
    <label>Office:
      <select name="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" required></label>
    <label>Salary: <input name="salary" type="number" required></label>
    <button type="submit">Save to table</button>`);
}
createForm();

function createNotification(title, description, type, color) {
  div.style.cssText = (`top: 470px; right: 270px`);
  div.style.backgroundColor = color;
  div.classList = `notification ${type}`;
  div.innerHTML = `<h2>${title}</h2>` + `<p>${description}</p>`;
  body.append(div);
  setTimeout(() => div.remove(), 3000);
}

function addNewEmployee() {
  const employee = document.createElement('tr');
  // eslint-disable-next-line no-undef
  const data = new FormData(form);
  const { name, position, office, age, salary } = Object.fromEntries(data);

  employee.insertAdjacentHTML('afterbegin', `
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${(+salary)}</td>
  `);
  body.append(employee);
}

function notification() {
  // eslint-disable-next-line no-undef
  const data = new FormData(form);

  const { name, age } = Object.fromEntries(data);

  switch (true) {
    case (name.length < 4):
      createNotification('Error!'
        , `Name must be more than 4 characters`, 'error', 'red');

      return false;
    case (age < 18):
      createNotification('Error!'
        , `Age can't be less then 18`, 'error', 'red');

      return false;
    case (age > 90):
      createNotification('Error!'
        , `Age can't be greater then 90`, 'error', 'red');

      return false;
    default:
      createNotification('Congratulations!'
        , 'We now have a new employee', 'success', 'green');

      return true;
  };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const target = event.target;

  if (!notification(target)) {
    return;
  }

  addNewEmployee(target);
  target.reset();
});

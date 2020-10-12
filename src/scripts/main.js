'use strict';

const head = document.querySelector('thead');
const body = document.querySelector('tbody');
const form = document.createElement('form');
const div = document.createElement('div');
let secondClick;

const employeess = [...body.rows];

head.addEventListener('click', (event) => {
  const target = event.target;
  const columnIndex = event.target.cellIndex;

  function sortBySalary() {
    employeess.sort((a, b) => {
      return Number(a.children[4].textContent.replace(/[$,]/g, ''))
        - Number(b.children[4].textContent.replace(/[$,]/g, ''));
    });
  }

  switch (true) {
    case columnIndex < 4:
      if (secondClick !== target.textContent) {
        secondClick = target.textContent;

        employeess.sort((a, b) => {
          return a.cells[columnIndex].innerText
            .localeCompare(b.cells[columnIndex].innerText);
        });
      } else {
        employeess.reverse();
      }
      break;

    case columnIndex === 4:
      if (secondClick !== target.textContent) {
        secondClick = target.textContent;

        sortBySalary();
      } else {
        employeess.reverse();
      }
  }
  body.append(...employeess);
});

body.addEventListener('click', (event) => {
  const target = event.target;
  const children = [...body.rows];

  children.map(child => child.classList.remove('active'));

  target.parentElement.classList.add('active');
});

form.classList.add('new-employee-form');

const citys = ['Tokyo', 'Singapore', 'London', 'New York',
  'Edinburgh', 'San Francisco'];

form.insertAdjacentHTML(`afterbegin`,
  `<label>Name: <input name="name" type="text" required></label>
  <label>Position: <input name="position" type="text" required></label>
  <label>Office:
    <select name="office">
      ${citys.map((city) => `<option>${city}</option>`)}
    </select>
  </label>
  <label>Age: <input name="age" type="number" required></label>
  <label>Salary: <input name="salary" type="number" required></label>
  <button type="submit" onsubmit="return validate()">Save to table</button>`);

document.body.append(form);

function createNotification(title, description, type, color) {
  div.style.backgroundColor = color;
  div.classList = `notification ${type}`;
  div.innerHTML = `<h2>${title}</h2>` + `<p>${description}</p>`;
  body.append(div);
  setTimeout(() => div.remove(), 3000);
}

function addNewEmployee() {
  const employee = document.createElement('tr');

  const name = form.name.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = form.age.value;
  const salary = form.salary.value;

  employee.insertAdjacentHTML('afterbegin', `
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${(+salary).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
  `);

  employeess.push(employee);
  body.append(employee);
}

function isValid() {
  const name = form.name.value;
  const age = form.age.value;

  switch (true) {
    case (name.length < 4):
      createNotification('Error!'
        , `Name must be more than 4 characters`
        , 'error'
        , 'red');

      return false;
    case (age < 18):
      createNotification('Error!'
        , `Age can't be less then 18`
        , 'error'
        , 'red');

      return false;
    case (age > 90):
      createNotification('Error!'
        , `Age can't be greater then 90`
        , 'error'
        , 'red');

      return false;
    default:
      createNotification('Congratulations!'
        , 'We now have a new employee'
        , 'success'
        , 'green');

      return true;
  };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const target = event.target;

  if (!isValid()) {
    return;
  }

  addNewEmployee();
  target.reset();
});

body.addEventListener('dblclick', (event) => {
  const target = event.target;
  const clone = target.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = target.textContent;
  input.type = 'text';
  input.style.width = window.getComputedStyle(target).width;
  target.innerHTML = '';

  target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (input.value.length < 1) {
      target.textContent = clone;
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && input.value.length >= 1) {
      target.textContent = input.value;
    } else if (e.code === 'Enter' && input.value.length < 1) {
      target.textContent = clone;
    }
  });
});

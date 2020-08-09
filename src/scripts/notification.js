'use strict';

const body = document.querySelector('body');
const div = document.createElement('div');

const error = {
  name: 'The name must be at least 4 characters long!!!',
  position: 'Please enter your position!!!',
  age: 'Age must be less than 18 or bigger than 90!!!',
  salary: 'Salary must be a number!!!',
};

const position = (event) => {
  const target = event.target;

  if (target.value === '') {
    notificationWarning(error.position, 'Position', 'warning');
  }
};

const name = (event) => {
  const target = event.target;

  if ((target.value === '') || (target.value.length <= 4)) {
    notificationWarning(error.name, 'Name', 'warning');
  }
};

const age = (event) => {
  const target = event.target;

  if ((parseFloat(target.value) < 18) || (parseFloat(target.value) > 90)
    || (target.value === '')) {
    notificationWarning(error.age, 'Age', 'warning');
  }
};

const salary = (event) => {
  const target = event.target;

  if (isNaN(parseFloat(target.value)) || target.value === '') {
    notificationWarning(error.salary, 'Salary', 'warning');
  }
};

function notificationWarning(message, title, type) {
  div.className = 'notification';
  div.classList.add(type);

  div.innerHTML = `<h2 class = 'title'> ${title} </h2>
      <p> ${message} </p>
    `;
  body.append(div);

  setTimeout(() => div.remove(), 3000);
}

module.exports = {
  name,
  position,
  age,
  salary,
  notificationWarning,
};

'use strict';

const validValues = require('./notification');

function createElement(container) {
  const div = document.createElement('div');

  container.classList.add('new-employee-form');

  container.insertAdjacentHTML('afterbegin',
    `
    <label>Name: <input name="name" type="text"></label>
    <label>Position: <input name="position" type="text"></label>
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
    <label>Age: <input name="age" type="number" min="18" max="90"></label>
    <label>Salary: <input name="salary" type="number"></label>
    <button type="button">Save to table</button>
  `);

  [...container].map((element) =>
    element.addEventListener('blur',
      (event) => validValues.checkValidInfo(event, div, container.parentNode)));

  return container;
}

module.exports = createElement;

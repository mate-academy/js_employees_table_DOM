'use strict';

function createForm(conteiner, formElement) {
  conteiner.classList.add('new-employee-form');

  conteiner.insertAdjacentHTML('afterbegin',
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
}

module.exports = createForm;

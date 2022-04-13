'use strict';

function createNewEmployeeForm() {
  document.body.insertAdjacentHTML('beforeend', `
    <form class="new-employee-form">
      <label>
        Name: <input name="name" type="text" required>
      </label>

      <label>
        Position: <input name="position" type="text" required>
      </label>

      <label>
        Office:
        <select name="office" required>
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>

      <label>
        Age: <input name="age" type="number" required>
      </label>

      <label>
        Salary: <input name="salary" type="number" required>
      </label>

      <button type="submit">Add to table</button>
    </form>
  `);

  const form = document.body.lastElementChild;
  const elements = [...form.elements].slice(0, -1);

  elements.forEach(el => {
    el.dataset.qa = el.name;
  });

  return form;
}

module.exports = createNewEmployeeForm;

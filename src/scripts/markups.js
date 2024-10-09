'use strict';

export const formMarkup = `<form class="new-employee-form" id="employeeForm">
        <label>Name:
            <input name="name" type="text" data-qa="name" required>
        </label>
        <label>Position:
            <input name="position" type="text" data-qa="position">
        </label>
        <label>Office:
            <select name="office" data-qa="office" required>
                <option value="Tokyo">Tokyo</option>
                <option value="Singapore">Singapore</option>
                <option value="London">London</option>
                <option value="New York">New York</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="San Francisco">San Francisco</option>
            </select>
        </label>
        <label>Age:
            <input name="age" type="number" data-qa="age" required>
        </label>
        <label>Salary:
            <input name="salary" type="number" data-qa="salary" required>
        </label>
        <button type="submit">Save to table</button>
    </form>`;

export const selectMarkup = `<label>
            <select class='cell-input'>
                <option value="Tokyo">Tokyo</option>
                <option value="Singapore">Singapore</option>
                <option value="London">London</option>
                <option value="New York">New York</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="San Francisco">San Francisco</option>
            </select>
          </label>`;

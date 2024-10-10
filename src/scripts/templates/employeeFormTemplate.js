const template = `
      <label for="name">
        Name:
        <input
          data-qa="name"
          type="text"
          name="name"
          id="name"
          required
          minlength="4"
        />
      </label>

      <label for="position">
        Position:
        <input
          data-qa="position"
          type="text"
          name="position"
          id="position"
          required
        />
      </label>

      <label for="office">
        Office:
        <select name="office">
          <option
            value="Tokyo"
            selected
          >
            Tokyo
          </option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>

      <label for="age">
        Age:
        <input
          data-qa="age"
          type="number"
          name="age"
          id="age"
          required
          minlength="18"
          maxlength="90"
        />
      </label>

      <label for="position">
        Salary:
        <input
          data-qa="salary"
          type="number"
          name="position"
          id="Salary"
          required
        />
      </label>

      <button type="submit">Save to table</button>`;

export default template;

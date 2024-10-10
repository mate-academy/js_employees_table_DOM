const template = `
      <label for="name">
        Name:
        <input
          data-qa="name"
          type="text"
          name="name"
          id="name"
        />
      </label>

      <label for="position">
        Position:
        <input
          data-qa="position"
          type="text"
          name="position"
          id="position"
        />
      </label>

      <label for="office">
        Office:
        <select name="office" data-qa="office">
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
        />
      </label>

      <label for="salary">
        Salary:
        <input
          data-qa="salary"
          type="number"
          name="salary"
          id="salary"
        />
      </label>

      <button type="submit">Save to table</button>`;

export default template;

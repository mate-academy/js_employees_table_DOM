const template = (employee) => `
        <tr>
          <td>${employee.name}</td>
          <td>${employee.position}</td>
          <td>${employee.office}</td>
          <td>${employee.age}</td>
          <td>${employee.salary}</td>
        </tr>`;

export default template;

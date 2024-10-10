const enumEmployee = {
  0: 'name',
  1: 'position',
  2: 'office',
  3: 'age',
  4: 'salary',
};

class EmployeeView {
  tbody = document.querySelector('tbody');
  employees = [];

  constructor() {
    this.employees = this.getEmployeesData();
  }

  createTemplate(employees) {
    return employees
      .map(
        (employee) => `
        <tr>
          <td>${employee.name}</td>
          <td>${employee.position}</td>
          <td>${employee.office}</td>
          <td>${employee.age}</td>
          <td>${employee.salary}</td>
        </tr>`,
      )
      .join('');
  }

  getEmployeesData() {
    const employees = [];

    for (const row of this.tbody.rows) {
      const employee = Array.from(row.cells).reduce((acc, next, i) => {
        acc[enumEmployee[i]] = next.textContent;

        return acc;
      }, {});

      employees.push(employee);
    }

    return employees;
  }

  drawEmployeeView = (employees) => {
    this.tbody.innerHTML = this.createTemplate(employees);
  };
}

const employeeView = new EmployeeView();

export default employeeView;

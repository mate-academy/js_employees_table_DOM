import employeesTableTemplate from './templates/employeesTableTemplate';
import employeeForm from './employeeForm';

const enumEmployeeType = {
  0: 'name',
  1: 'position',
  2: 'office',
  3: 'age',
  4: 'salary',
};

class EmployeeView {
  root = document.querySelector('body');
  tbody = document.querySelector('tbody');
  rows = document.querySelectorAll('tbody tr');
  activeRow = null;

  employees = [];

  constructor() {
    this.employees = this.getEmployeesData();
    this.addRowListeners();

    this.root.append(employeeForm.createForm());
  }

  createTemplate(employees) {
    return employees
      .map((employee) => employeesTableTemplate(employee))
      .join('');
  }

  getEmployeesData() {
    const employees = [];

    for (const row of this.tbody.rows) {
      const employee = Array.from(row.cells).reduce((acc, next, i) => {
        acc[enumEmployeeType[i]] = next.textContent;

        return acc;
      }, {});

      employees.push(employee);
    }

    return employees;
  }

  drawEmployeeView = (employees) => {
    this.tbody.innerHTML = this.createTemplate(employees);
  };

  addRowListeners() {
    this.rows.forEach((row) => {
      row.addEventListener('click', () => {
        this.changeActiveRow(row);
      });
    });
  }

  changeActiveRow(row) {
    if (this.activeRow && this.activeRow !== row) {
      this.activeRow.classList.remove('active');
    }

    this.activeRow = row;
    this.activeRow.classList.add('active');
  }
}

export default EmployeeView;

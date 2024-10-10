import employeesTableTemplate from './templates/employeesTableTemplate';
import employeeForm from './employeeForm';
import { ROOT, TBODY } from './constants/DomElements';

const enumEmployeeType = {
  0: 'name',
  1: 'position',
  2: 'office',
  3: 'age',
  4: 'salary',
};

class EmployeeView {
  activeRow = null;

  employees = [];

  constructor() {
    this.employees = this.getEmployeesData();
    this.addRowListeners();

    ROOT.append(employeeForm.createForm());
  }

  createTemplate(employees) {
    return employees
      .map((employee) => employeesTableTemplate(employee))
      .join('');
  }

  getEmployeesData() {
    const employees = [];

    for (const row of TBODY.rows) {
      const employee = Array.from(row.cells).reduce((acc, next, i) => {
        acc[enumEmployeeType[i]] = next.textContent;

        return acc;
      }, {});

      employees.push(employee);
    }

    return employees;
  }

  drawEmployeeView = (employees) => {
    TBODY.innerHTML = this.createTemplate(employees);
  };

  addRowListeners() {
    TBODY.addEventListener('click', (e) => {
      const row = e.target.closest('tr');

      if (row) {
        this.changeActiveRow(row);
      }
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

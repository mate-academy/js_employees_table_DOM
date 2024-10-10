import { TBODY } from './constants/DomElements';
import notification from './notification';
import employeeFormTemplate from './templates/employeeFormTemplate';
import employeesTableTemplate from './templates/employeesTableTemplate';
import { numberToSalary } from './utils/formatSalary';

class EmployeeForm {
  state = {
    name: null,
    position: null,
    office: null,
    age: null,
    salary: null,
  };

  createForm() {
    const form = document.createElement('form');

    form.classList.add('new-employee-form');

    form.innerHTML = employeeFormTemplate;

    form.addEventListener('submit', this.handleSubmit);
    form.addEventListener('change', this.handleChange);

    return form;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const template = employeesTableTemplate(this.state);

    TBODY.innerHTML += template;

    notification('success', `The ${this.state.name} was added`);

    this.reset();
    e.target.reset();
  };

  isValid() {
    const { age, position, office, salary } = this.state;

    if (!this.state.name || !position || !age || !office || !salary) {
      notification('error', `All the fields are required`);

      return false;
    }

    if (this.state.name.length < 4) {
      notification('error', `Minimum name length is 4 `);

      return false;
    }

    if (!isNaN(this.state.name) || !isNaN(position)) {
      notification('error', `Name and position must be string`);

      return false;
    }

    if (age < 18 || age > 90) {
      notification('error', `Age must be greater than 18 and less than 90`);

      return false;
    }

    return true;
  }

  handleChange = (e) => {
    if (e.target.name === 'salary') {
      this.state[e.target.name] = numberToSalary(e.target.value);
    } else {
      this.state[e.target.name] = e.target.value;
    }
  };

  reset() {
    this.state = {
      name: null,
      position: null,
      office: null,
      age: null,
      salary: null,
    };
  }
}

const employeeForm = new EmployeeForm();

export default employeeForm;

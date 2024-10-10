import employeeFormTemplate from './templates/employeeFormTemplate';

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

  handleSubmit = () => {};
  handleChange = (e) => {
    // console.log(e.target.name);
  };
}

const employeeForm = new EmployeeForm();

export default employeeForm;

import { pushNotification } from './notifications';
import { fullPeopleData } from './sortTable';

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');

const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');
const officeSelect = document.createElement('select');
const submitButton = document.createElement('button');

const salaryFormat = new Intl.NumberFormat('en-US');

const OFFICES_ARRAY = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const office of OFFICES_ARRAY) {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;

  officeSelect.append(option);
}

export function createNewForm() {
  submitButton.type = 'button';
  submitButton.textContent = 'Save to table';
  submitButton.addEventListener('click', submitClickHandler);

  officeSelect.value = OFFICES_ARRAY[0];
  officeSelect.dataset.qa = 'office';

  nameInput.name = 'name';
  nameInput.type = 'text';
  nameInput.dataset.qa = 'name';

  positionInput.name = 'position';
  positionInput.type = 'text';
  positionInput.dataset.qa = 'position';

  ageInput.name = 'age';
  ageInput.type = 'text';
  ageInput.dataset.qa = 'age';

  salaryInput.name = 'salary';
  salaryInput.type = 'text';
  salaryInput.dataset.qa = 'salary';

  const nameLabel = document.createElement('label');
  const positionLabel = document.createElement('label');
  const ageLabel = document.createElement('label');
  const salaryLabel = document.createElement('label');
  const officeLabel = document.createElement('label');

  nameLabel.textContent = 'Name: ';
  positionLabel.textContent = 'Position: ';
  ageLabel.textContent = 'Age: ';
  salaryLabel.textContent = 'Salary: ';
  officeLabel.textContent = 'Office: ';

  newForm.appendChild(nameLabel);
  newForm.appendChild(positionLabel);
  newForm.appendChild(officeLabel);
  newForm.appendChild(ageLabel);
  newForm.appendChild(salaryLabel);
  newForm.appendChild(submitButton);

  nameLabel.appendChild(nameInput);
  positionLabel.appendChild(positionInput);
  ageLabel.appendChild(ageInput);
  salaryLabel.appendChild(salaryInput);
  officeLabel.appendChild(officeSelect);

  document.body.append(newForm);
}

const validateNewEmployee = () => {
  const employeeName = nameInput.value;
  const age = ageInput.value;
  const position = positionInput.value;
  const salary = salaryInput.value;
  const office = officeSelect.value;

  if (
    employeeName.length < 4 ||
    Number.isNaN(+age) ||
    !Number.isInteger(+age) ||
    position.trim().length < 1 ||
    +age < 18 ||
    +age > 90 ||
    Number.isNaN(+salary)
  ) {
    pushNotification(
      450,
      10,
      'Error while adding employee to the table',
      'Please check all entered data!',
      'error',
    );

    return null;
  }

  const newEmployee = {
    name: employeeName,
    position,
    office,
    age,
    salary,
  };

  fullPeopleData.push({
    ...newEmployee,
    salary: `$${salaryFormat.format(salary)}`,
  });

  nameInput.value = '';
  ageInput.value = '';
  positionInput.value = '';
  officeSelect.value = OFFICES_ARRAY[0];
  salaryInput.value = '';

  pushNotification(
    450,
    10,
    'Successfully Added!',
    'New Employee was just added to the Table',
    'success',
  );

  return newEmployee;
};

const submitClickHandler = () => {
  const newEmployee = validateNewEmployee();

  if (newEmployee) {
    const tableBody = document.querySelector('tbody');
    const newRow = tableBody.insertRow();

    for (const data in newEmployee) {
      const newCell = newRow.insertCell();

      if (data === 'salary') {
        newCell.textContent = `$${salaryFormat.format(Number(newEmployee[data]))}`;
      } else {
        newCell.textContent = newEmployee[data];
      }
    }
  }
};

const submitClickHandler = (e) => {};

export function createNewForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  const nameInput = document.createElement('input');
  const positionInput = document.createElement('input');
  const ageInput = document.createElement('input');
  const salaryInput = document.createElement('input');
  const officeSelect = document.createElement('select');
  const submitButton = document.createElement('button');

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

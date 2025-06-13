import { handleFormSubmission } from './handleFormSubmission';
import cities from '../data/cities.json';

const createLabeledField = (labelText, elementTag, dataQa, type = '') => {
  const label = document.createElement('label');

  label.innerText = `${labelText}:`;

  const element = document.createElement(elementTag);

  element.required = true;
  element.setAttribute('data-qa', dataQa);
  element.setAttribute('name', dataQa);

  if (type) {
    element.type = type;
  }

  label.append(element);

  return label;
};

export const renderForm = () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const nameField = createLabeledField('Name', 'input', 'name');
  const positionField = createLabeledField('Position', 'input', 'position');
  const officeSelect = document.createElement('select');

  officeSelect.setAttribute('data-qa', 'office');
  officeSelect.setAttribute('name', 'office');

  cities.forEach((citie) => {
    const option = new Option(citie, citie);

    officeSelect.add(option);
  });

  const officeField = document.createElement('label');

  officeField.innerText = 'Office:';
  officeField.append(officeSelect);

  const ageField = createLabeledField('Age', 'input', 'age', 'number');
  const salaryField = createLabeledField('Salary', 'input', 'salary', 'number');
  const saveButton = document.createElement('button');

  saveButton.innerText = 'Save to table';

  form.append(
    nameField,
    positionField,
    officeField,
    ageField,
    salaryField,
    saveButton,
  );

  document.body.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmission();
  });
};

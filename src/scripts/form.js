'use strict';

const form = document.createElement('form');

form.classList = 'new-employee-form';
form.setAttribute('method', 'POST');
form.setAttribute('id', 'form');
form.setAttribute('action', '');

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');
const nameText = document.createTextNode('Name:');
const addButton = document.createElement('button');

const selectLabel = document.createElement('label');
const selectOffice = document.createElement('select');
const selectText = document.createTextNode('Office:');

const optionTok = document.createElement('option');
const optionSing = document.createElement('option');
const optionLon = document.createElement('option');
const optionNew = document.createElement('option');
const optionEdin = document.createElement('option');
const optionSan = document.createElement('option');

optionTok.setAttribute('value', 'Tokyo');
optionTok.textContent = 'Tokyo';
optionSing.setAttribute('value', 'Singapore');
optionSing.textContent = 'Singapore';
optionLon.setAttribute('value', 'London');
optionLon.textContent = 'London';
optionNew.setAttribute('value', 'New York');
optionNew.textContent = 'New York';
optionEdin.setAttribute('value', 'Edinbourgh');
optionEdin.textContent = 'Edinbourgh';
optionSan.setAttribute('value', 'San Francisco');
optionSan.textContent = 'San Francisco';

selectOffice.append(optionTok, optionSing,
  optionLon, optionNew, optionEdin, optionSan);
selectLabel.append(selectText, selectOffice);

selectOffice.setAttribute('data-qa', 'office');
selectOffice.setAttribute('calss', 'required');

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');
const positionText = document.createTextNode('Position:');

nameInput.setAttribute('name', 'name');
nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('placeholder', 'Name');

nameInput.classList.add('req');
nameInput.classList.add('numberless');

positionInput.setAttribute('name', 'position');
positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('placeholder', 'Position');

positionInput.classList.add('numberless');

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');
const ageText = document.createTextNode('Age');

ageInput.setAttribute('name', 'age');
ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('placeholder', 'Age');
ageInput.setAttribute('min', 18);
ageInput.setAttribute('max', 90);

ageInput.classList.add('req');

ageLabel.append(ageText, ageInput);
ageInput.style.cssText = 'appearance: textfield';

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');
const salaryText = document.createTextNode('Salary:');

salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('placeholder', 'Salary');

salaryInput.style.cssText = 'appearance: textfield';

salaryLabel.append(salaryText, salaryInput);

addButton.setAttribute('type', 'submit');
addButton.textContent = 'Add to the table';

nameLabel.append(nameText);
nameLabel.append(nameInput);
positionLabel.append(positionText);
positionLabel.append(positionInput);

document.body.append(form);

form.append(
  nameLabel,
  positionLabel,
  selectLabel,
  ageLabel,
  salaryLabel,
  addButton
);

// отримуємо дані з форми

document.addEventListener('DOMContentLoaded', () => {
  const formData = document.getElementById('form');
  const tbody = document.querySelector('tbody');
  const inputs = document.querySelectorAll('input');

  inputs.forEach(input => input.setAttribute('required', true));

  const reg = /[0-9]/g;

  for (const input of inputs) {
    if (input.classList.contains('numberless')) {
      input.oninput = () => {
        input.value = input.value.replace(reg, '');
      };
    }
  }

  const getValue = (e) => {
    e.preventDefault();

    const nameof = formData.querySelector('[data-qa="name"]');
    const position = formData.querySelector('[data-qa="position"]');
    const office = formData.querySelector('[data-qa="office"]');
    const age = formData.querySelector('[data-qa="age"]');
    const salary = formData.querySelector('[data-qa="salary"]');

    const values = {
      name: nameof.value,
      position: position.value,
      office: office.value,
      age: age.value,
      salary: salary.value,
    };

    if (nameof.value.length < 4) {
      return erro();
    } else {
      const tr = document.createElement('tr');

      tr.innerHTML = `<td>${values.name}</td>
      <td>${values.position}</td>
      <td>${values.office}</td>
      <td>${values.age}</td>
      <td>$${new Intl.NumberFormat('en-En').format(values.salary)}</td>
      `;

      tbody.append(tr);
      formData.reset();

      return sucsess();
    }
  };

  formData.addEventListener('submit', getValue);
});

const erro = () => {
  const error = document.createElement('div');
  const title = document.createElement('h2');

  title.textContent = 'Error';

  const description = document.createElement('p');

  description.textContent = 'Name should not be less than 4 sumbols';

  error.append(title, description);

  error.classList.add('notification');
  error.classList.add('error');

  error.style.top = 150 + 'px';
  error.style.right = 10 + 'px';

  document.body.appendChild(error);

  setTimeout(() => {
    document.body.removeChild(error);
  }, 2000);
};

const sucsess = () => {
  const success = document.createElement('div');
  const title = document.createElement('h2');

  title.textContent = 'Success';

  const description = document.createElement('p');

  description.textContent = 'New user sucsessfuly added';

  success.append(title, description);

  success.classList.add('notification');
  success.classList.add('success');

  document.body.appendChild(success);

  setTimeout(() => {
    document.body.removeChild(success);
  }, 2000);
};

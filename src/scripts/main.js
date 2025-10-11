'use strict';

// #region table //

const toNumberIfPossible = (value) => {
  if (typeof value !== 'string' || !value) {
    return value;
  }

  const cleanedValue = value.replace(/[$,\s]/g, '');
  const number = Number(cleanedValue);

  return isNaN(number) ? value : number;
};

const tlo = document.querySelectorAll('thead th');
const list = [...tlo];
let ascending = true;
let lastSortedIndex = -1;

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (eve) => {
  const row = eve.target.closest('tr');

  if (row && row.parentElement === tbody) {
    tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  }
});

list.forEach((column) => {
  column.addEventListener('click', () => {
    const index = list.indexOf(column);

    if (index !== lastSortedIndex) {
      ascending = true;
    }

    const dataList = [...document.querySelectorAll('tbody tr')];

    dataList.sort((a, b) => {
      const valA = toNumberIfPossible(
        a.querySelectorAll('td')[index].textContent,
      );
      const valB = toNumberIfPossible(
        b.querySelectorAll('td')[index].textContent,
      );

      const result =
        typeof valA === 'number' && typeof valB === 'number'
          ? valA - valB
          : String(valA).localeCompare(String(valB));

      return ascending ? result : -result;
    });
    tbody.innerHTML = '';
    dataList.forEach((row) => tbody.appendChild(row));
    ascending = !ascending;
    lastSortedIndex = index;
  });
});

// #endregion //

// #region form //

const body = document.querySelector('body');

const newForm = document.createElement('form');

newForm.className = 'new-employee-form';

body.append(newForm);

const newName = document.createElement('input'); // name

newName.type = 'text';
newName.name = 'name';
newName.id = 'namer';
newName.setAttribute('data-qa', 'name');
newName.setAttribute('required', 'true');

const nameLabel = document.createElement('label'); // label

nameLabel.textContent = 'Name:';
nameLabel.htmlFor = 'namer';
nameLabel.append(newName);
newForm.append(nameLabel);

const newPosition = document.createElement('input'); // Position

newPosition.type = 'text';
newPosition.name = 'position';
newPosition.id = 'positioner';
newPosition.setAttribute('data-qa', 'position');
newPosition.setAttribute('required', 'true');

const positionLabel = document.createElement('label'); // label

positionLabel.textContent = 'Position:';
positionLabel.htmlFor = 'positioner';
positionLabel.append(newPosition);
newForm.append(positionLabel);

// #region office select //

const newOffice = document.createElement('select');

newOffice.name = 'office';
newOffice.id = 'officer';
newOffice.setAttribute('data-qa', 'office');
newOffice.setAttribute('required', 'true');

const optionTokyo = document.createElement('option');

optionTokyo.value = 'Tokyo';
optionTokyo.textContent = 'Tokyo';

const optionSingapore = document.createElement('option');

optionSingapore.value = 'Singapore';
optionSingapore.textContent = 'Singapore';

const optionLondon = document.createElement('option');

optionLondon.value = 'London';
optionLondon.textContent = 'London';

const optionNewYork = document.createElement('option');

optionNewYork.value = 'New York';
optionNewYork.textContent = 'New York';

const optionEdinburgh = document.createElement('option');

optionEdinburgh.value = 'Edinburgh';
optionEdinburgh.textContent = 'Edinburgh';

const optionSanFrancisco = document.createElement('option');

optionSanFrancisco.value = 'San Francisco';
optionSanFrancisco.textContent = 'San Francisco';

newOffice.append(
  optionTokyo,
  optionSingapore,
  optionLondon,
  optionNewYork,
  optionEdinburgh,
  optionSanFrancisco,
);

const officeLabel = document.createElement('label'); // label

officeLabel.textContent = 'Office:';
officeLabel.htmlFor = 'officer';
officeLabel.append(newOffice);
newForm.append(officeLabel);
// #endregion //

const newAge = document.createElement('input'); // Age

newAge.type = 'number';
newAge.name = 'age';
newAge.id = 'ager';
newAge.setAttribute('data-qa', 'age');
newAge.setAttribute('required', 'true');

const ageLabel = document.createElement('label'); // label

ageLabel.textContent = 'Age:';
ageLabel.htmlFor = 'ager';
ageLabel.append(newAge);
newForm.append(ageLabel);

const newSalary = document.createElement('input'); // Salary

newSalary.type = 'number';
newSalary.name = 'salary';
newSalary.id = 'salaryer';
newSalary.setAttribute('data-qa', 'salary');
newSalary.setAttribute('required', 'true');

const salaryLabel = document.createElement('label'); // label

salaryLabel.textContent = 'Salary:';
salaryLabel.htmlFor = 'salaryer';
salaryLabel.append(newSalary);
newForm.append(salaryLabel);

const formButton = document.createElement('button'); // Button

formButton.type = 'submit';
formButton.name = 'button';
formButton.textContent = 'Save to table';

newForm.append(formButton);

// #endregion //

// #region submit //

const addNewRowToTable = (employeeData) => {
  const newMens = document.createElement('tr');

  Object.values(employeeData).forEach((pep) => {
    const newTd = document.createElement('td');

    newTd.textContent = pep;
    newMens.append(newTd);
  });
  tbody.append(newMens);
};

const notification = document.createElement('div');

// notification.classList('error');
notification.setAttribute('data-qa', 'notification');
notification.style.display = 'none';
newForm.before(notification);

const showNotification = (message, type = 'error') => {
  notification.textContent = message;
  notification.classList.remove('error', 'success');
  notification.classList.add(type);
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
    notification.classList.remove('error', 'success');
  }, 4000);
};

const hideNotification = () => {
  notification.style.display = 'none';
};

newForm.addEventListener('submit', (events) => {
  events.preventDefault();

  hideNotification();

  const nameValue = newName.value.trim();
  const positionValue = newPosition.value.trim();
  const ageValue = newAge.value.trim();
  const salaryValue = newSalary.value.trim();

  if (
    !nameValue ||
    !positionValue ||
    !ageValue ||
    !salaryValue ||
    !newOffice.value
  ) {
    showNotification('Помилка: Усі поля мають бути заповнені.');

    return;
  }

  if (nameValue.length < 4) {
    showNotification("Помилка: Ім'я має містити щонайменше 4 символи.");

    return;
  }

  const ager = Number(ageValue);

  if (isNaN(ager) || ager < 18 || ager > 90) {
    showNotification('Помилка: Вік має бути числом від 18 до 90.');

    return;
  }

  const rawSalary = salaryValue.replace(/[$,\s]/g, '');
  const salaryNumber = Number(rawSalary);

  if (isNaN(salaryNumber) || salaryNumber <= 0) {
    showNotification('Помилка: Зарплата має бути додатним числом.');

    return;
  }

  const formattedSalary = salaryNumber.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const employeeData = {
    name: nameValue,
    position: positionValue,
    office: newOffice.value,
    age: ager,
    salary: formattedSalary,
  };

  addNewRowToTable(employeeData);

  showNotification('Employee added', 'success');

  newForm.reset();
});
// #endregion //

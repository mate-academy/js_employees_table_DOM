'use strict';

const table = document.querySelector('table');
const th = table.querySelectorAll('th');
const tBody = table.querySelector('tbody');
const sortDirections = new Array(th.length).fill(true);

// Сортування

th.forEach((header, index) => {
  header.addEventListener('click', function () {
    const rows = [...tBody.rows];
    const sortedRows = rows.sort((a, b) => {
      const aText = a.cells[index].textContent.trim();
      const bText = b.cells[index].textContent.trim();

      if (aText.includes('$')) {
        const aValue = parseFloat(aText.replace(/[$,]/g, ''));
        const bValue = parseFloat(bText.replace(/[$,]/g, ''));

        return sortDirections[index] ? aValue - bValue : bValue - aValue;
      } else {
        return sortDirections[index]
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      }
    });

    tBody.append(...sortedRows);
    sortDirections[index] = !sortDirections[index];
  });
});

// Виділення рядків

table.addEventListener('click', function (e) {
  const row = e.target.closest('tbody > tr');

  if (row) {
    const allRows = table.querySelectorAll('tr');

    allRows.forEach((item) => (item.className = ''));
    row.classList.add('active');
  }
});

// Створення форми

const newForm = document.createElement('form');

newForm.className = 'new-employee-form';

newForm.insertAdjacentHTML('beforeend', '<button>Save to table</button>');

newForm.insertAdjacentHTML(
  'afterbegin',
  `<label>Salary: <input name="salary" type="number" data-qa="salary" required></label>`,
);

newForm.insertAdjacentHTML(
  'afterbegin',
  `<label>Age: <input name="age" type="number" data-qa="age" required></label>`,
);

newForm.insertAdjacentHTML(
  'afterbegin',
  `<label>Office: <select name="office" type="text" data-qa="office" required>
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
  </select></label>`,
);

newForm.insertAdjacentHTML(
  'afterbegin',
  `<label>Position: <input name="position" type="text" data-qa="position" required></label>`,
);

newForm.insertAdjacentHTML(
  'afterbegin',
  `<label>Name: <input name="name" type="text" data-qa="name" required></label>`,
);

document.body.append(newForm);

// Валідація даних форми

const validateForm = () => {
  let isValid = true;

  form.querySelectorAll('input').forEach((input) => {
    const personName = form.name.value.trim();

    if (personName.length < 4) {
      pushNotification('Error!', 'The min name length is 4 letters.', 'error');
      isValid = false;

      return;
    }

    const age = parseInt(form.elements.age.value, 10);

    if (age < 18 || age > 90) {
      pushNotification('Error!', 'Employee aged from 18 to 90 years.', 'error');
      isValid = false;

      return;
    }

    if (input.value.trim().length === 0) {
      pushNotification('Error!', 'The field cannot be empty.', 'error');
      isValid = false;
    }
  });

  return isValid;
};

// Робота з формою

const form = document.forms[0];
const button = form.querySelector('button');

const nameIn = form.elements.name;
const positionIn = form.elements.position;
const officeIn = form.elements.office;
const ageIn = form.elements.age;
const salaryIn = form.elements.salary;

button.addEventListener('click', function (e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  // Створення об'єкту з данними з полів форми

  const newPerson = {
    name: nameIn.value.trim(),
    position: positionIn.value.trim(),
    office: officeIn ? officeIn.value.trim() : '',
    age: parseInt(ageIn.value, 10),
    salary: parseFloat(salaryIn.value.replace(/[^0-9.]/g, '')),
  };

  form.reset();

  const newRow = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tBody.prepend(newRow);

  tdName.textContent = newPerson.name;
  newRow.append(tdName);

  tdPosition.textContent = newPerson.position;
  newRow.append(tdPosition);

  tdOffice.textContent = newPerson.office;
  newRow.append(tdOffice);

  tdAge.textContent = newPerson.age;
  newRow.append(tdAge);

  tdSalary.textContent = `$${newPerson.salary.toLocaleString('en')}`;
  newRow.append(tdSalary);

  pushNotification('Success!', 'A new mate is now in our team!', 'success');
});

// Створення сповіщення

const pushNotification = (title, description, type) => {
  const newDiv = document.createElement('div');

  newDiv.className = `notification ${type}`;
  newDiv.setAttribute('data-qa', 'notification');

  const newH = document.createElement('h2');

  newH.className = 'title';
  newH.textContent = title;
  newDiv.appendChild(newH);

  const newP = document.createElement('p');

  newP.textContent = description;
  newDiv.appendChild(newP);
  document.body.appendChild(newDiv);

  setTimeout(() => {
    newDiv.style.visibility = 'hidden';
  }, 2000);
};

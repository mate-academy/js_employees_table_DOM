'use strict';

// ==========  GLOBAL VARIABLES  ==========

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const form = document.createElement('form');
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

let currentKey = '';

// ==========  ADD FORM TO THE PAGE  ==========

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>
    Name:
    <input
      name='name'
      type='text'
      data-qa='name'
    />
  </label>
  <label>
    Position:
    <input
      name='position'
      type='text'
      data-qa='position'
    />
  </label>
  <label>
    Office:
    <select
      name='office'
      data-qa='office'
    >
    ${offices.map(office => {
    const value = office.split(' ').join('-');

    return `<option value=${value}>${office}</option>`;
  })}
    </select>
  </label>
  <label>
    Age:
    <input
      name='age'
      type='number'
      data-qa='age'
    />
  </label>
  <label>
    Salary:
    <input
      name='salary'
      type='number'
      data-qa='salary'
    />
  </label>
  <button>Save to table</button>
`;

table.insertAdjacentElement('afterend', form);

// ==========  GLOBAL FUNCTIONS  ==========

const isInvalidAge = age => age < 18 || age > 90;
const isInvalidName = employeeName => employeeName.length < 4;
const isInvalidSalary = salary => salary <= 0 || salary >= 1000000;

const convertSalaryToNumber = salary =>
  Number(salary.textContent.replace('$', '').replace(',', ''));

const showNotification = (param, isValid = false) => {
  const type = isValid ? 'Success' : 'Error';
  const deleteNotification = notice => notice.remove();

  const getDescription = elem => {
    switch (elem) {
      case 'name':
        return `The <strong>${elem}</strong> is not correct.
          Should be more than 4 letters`;

      case 'position':
        return `The <strong>${elem}</strong> is required`;

      case 'age':
        return `The <strong>${elem}</strong> of employee should be from to 90`;

      case 'salary':
        return `The <strong>${elem}</strong> should be not more 1,000,000`;

      case 'office':
        return `The <strong>${elem}</strong> should be from list of theoffices`;

      default:
        return `Employee <strong>${elem.name}</strong> was added to table`;
    }
  };

  const notification = document.createElement('div');

  notification.className = `notification ${type.toLowerCase()}`;
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
      <h2 class='title'>${type}</h2>
      <p>${getDescription(param)}</p>
  `;

  document.body.append(notification);

  setTimeout(() => deleteNotification(notification), 2000);
};

const convertSalaryToThousand = numb => `$${numb.toLocaleString('en-US')}`;

// ==========  EDIT CELL  ==========

document.addEventListener('dblclick', e => {
  const elem = e.target.closest('td');

  if (!elem) {
    return;
  }

  const isAge = +elem.textContent ? true : null;
  const isSalary = elem.textContent.includes('$');
  const isOffice = offices.includes(elem.textContent);

  const currentValue = elem.textContent;
  const isActive = document.querySelector('.cell-input');

  if (isActive) {
    isActive.remove();
  }

  const input = document.createElement('input');

  if (isAge || isSalary) {
    input.type = 'number';
  }

  input.className = 'cell-input';
  elem.textContent = '';
  elem.append(input);
  input.focus();

  // ==========  SET UP VALUE TO THE CELL  ==========

  const handleCell = value => {
    elem.textContent = value;
    input.remove();
  };

  const setUpValue = () => {
    switch (true) {
      case !input.value:
        handleCell(currentValue);

        break;

      case isSalary:
        const isInvalidSalaryValue = isInvalidSalary(Number(input.value));

        if (isInvalidSalaryValue) {
          handleCell(currentValue);
          showNotification('salary');

          return;
        };

        const convertedSalary = convertSalaryToThousand(+input.value);

        handleCell(convertedSalary);

        break;

      case isAge:
        const value = Number(input.value);
        const isInvalid = isInvalidAge(value);

        if (isInvalid) {
          handleCell(currentValue);
          showNotification('age');

          return;
        }

        handleCell(value);

        break;

      case isOffice:
        const isValidValue = offices.includes(input.value);

        if (isValidValue) {
          handleCell(input.value);

          return;
        }

        handleCell(currentValue);
        showNotification('office');

        break;

      default:
        handleCell(input.value);
    }
  };

  input.addEventListener('keydown', ev =>
    ev.key === 'Enter' ? setUpValue() : false
  );

  input.addEventListener('blur', setUpValue);
});

// ==========  SORT, SELECT, ADD EMPLOYEE  ==========

document.addEventListener('click', e => {
  const heading = e.target.closest('thead th');
  const td = e.target.closest('tbody td');
  const button = e.target.closest('form button');

  if (!heading && !td && !button) {
    return;
  }

  const element = e.target;

  const employees = [...document.querySelectorAll('tbody tr')].map(person => {
    const [personName, position, office, age, salary] = [...person.children];

    return {
      name: personName.textContent,
      position: position.textContent,
      office: office.textContent,
      age: Number(age.textContent),
      salary: convertSalaryToNumber(salary),
    };
  });

  // ==========  SELECT ROW  ==========

  const selectRow = el => {
    const tr = el.parentElement;
    const isActive = [...tr.parentElement.children].find(elem =>
      elem.classList.contains('active')
    );

    if (isActive) {
      isActive.classList.remove('active');
    }

    tr.classList.add('active');
  };

  // ==========  SORT EMPOYEES  ==========

  const sortEmployees = (arrayOfEmployees, elem) => {
    const key = elem.textContent.toLowerCase();
    const isCountable = key === 'age' || key === 'salary';

    arrayOfEmployees.sort((a, b) => {
      if (isCountable) {
        if (currentKey !== key) {
          return a[key] - b[key];
        }

        return b[key] - a[key];
      }

      if (currentKey !== key) {
        return a[key].localeCompare(b[key]);
      }

      return b[key].localeCompare(a[key]);
    });

    currentKey = currentKey !== key ? (currentKey = key) : (currentKey = '');

    [...tbody.children].forEach(el => el.remove());

    renderEmployees(arrayOfEmployees);
  };

  // ==========  ADD EMPOYEE TO TABLE  ==========

  const addToTable = () => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const employeeData = {
      ...data,
      office: data.office.split('-').join(' '),
      age: Number(data.age),
      salary: Number(data.salary),
    };

    const { name: employeeName, position, age, salary } = employeeData;

    let isValid = false;

    // ==========  RESET FORM  ==========

    const resetForm = () =>
      form.querySelectorAll('input').forEach(input => {
        input.value = '';
      });

    // ==========  VALIDATE FIELDS  ==========

    switch (true) {
      case isInvalidName(employeeName):
        showNotification('name', isValid);
        break;

      case !position:
        showNotification('position', isValid);
        break;

      case isInvalidAge(age):
        showNotification('age', isValid);
        break;

      case isInvalidSalary(salary):
        showNotification('salary', isValid);
        break;

      default:
        employees.push(employeeData);
        isValid = true;
        showNotification(employeeData, isValid);
        renderEmployee(employeeData);
        resetForm();
    }
  };

  // ==========  RENDER EMPLOYEE  ==========

  const renderEmployee = employee => {
    const tr = document.createElement('tr');

    Object.keys(employee).forEach(el => {
      const newTd = document.createElement('td');

      if (el === 'salary') {
        employee[el] = convertSalaryToThousand(employee[el]);
      }

      newTd.textContent = employee[el];
      tr.append(newTd);
    });

    tbody.append(tr);
  };

  // ==========  RENDER EMPLOYEES  ==========

  const renderEmployees = arrayOfEmployees =>
    arrayOfEmployees.map(employee => renderEmployee(employee));

  // ==========  CHECK TYPE ACTION  ==========

  switch (element) {
    case td:
      selectRow(element);
      break;

    case heading:
      sortEmployees(employees, heading);

      break;

    case button:
      addToTable();
  }
});

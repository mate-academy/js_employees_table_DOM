'use strict';

const form = document.createElement('form');
const table = document.querySelector('table');

let currentKey = '';

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
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
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

document.addEventListener('dblclick', e => {
  const elem = e.target.closest('td');

  if (!elem) {
    return;
  };

  const currentValue = elem.textContent;
  const isActive = document.querySelector('.cell-input');

  if (isActive) {
    isActive.remove();
  }

  const input = document.createElement('input');

  input.className = 'cell-input';
  elem.textContent = '';
  elem.append(input);
  input.focus();

  const setUpValue = () => {
    if (!input.value) {
      input.remove();
      elem.textContent = currentValue;

      return;
    }

    elem.textContent = input.value;
    input.remove();
  };

  input.addEventListener('blur', setUpValue);

  input.addEventListener('keydown',
    ev => ev.key === 'Enter' ? setUpValue() : false);
});

document.addEventListener('click', e => {
  const heading = e.target.closest('thead th');
  const td = e.target.closest('tbody td');
  const button = e.target.closest('form button');
  const tbody = document.querySelector('tbody');

  if (!heading && !td && !button) {
    return;
  }

  const element = e.target;

  const employees = [...document.querySelectorAll('tbody tr')]
    .map(person => {
      const [personName, position, office, age, salary] = [...person.children];

      return {
        name: personName.textContent,
        position: position.textContent,
        office: office.textContent,
        age: Number(age.textContent),
        salary: Number(salary.textContent.replace('$', '').replace(',', '')),
      };
    });

  const selectRow = el => {
    const tr = el.parentElement;
    const isActive = [...tr.parentElement.children]
      .find(elem =>
        elem.classList.contains('active')
      );

    if (isActive) {
      isActive.classList.remove('active');
    }

    tr.classList.add('active');
  };

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

    [...tbody.children].forEach((el) => el.remove());

    renderEmployees(arrayOfEmployees);
  };

  const showNotification = (param, isValid) => {
    const type = isValid ? 'Success' : 'Error';
    const deleteNotification = notice => notice.remove();

    const getDescription = elem => {
      switch (elem) {
        case 'name':
          return `The ${elem} is not correct. Should be more than 4 letters`;

        case 'position':
          return `The ${elem} is required`;

        case 'age':
          return `The ${elem} of employee should be from to 60`;

        case 'salary':
          return `The ${elem} should be more 0`;

        default:
          return `Employee ${elem.name} was added to table`;
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

  const saveToTable = () => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const employeeData = {
      ...data,
      age: Number(data.age),
      salary: Number(data.salary),
    };

    const { name: employeeName, position, age, salary } = employeeData;

    let isValid = false;

    switch (true) {
      case employeeName.length < 4:
        showNotification('name', isValid);
        break;

      case !position:
        showNotification('position', isValid);
        break;

      case age < 18 || age > 60:
        showNotification('age', isValid);
        break;

      case salary <= 0:
        showNotification('salary', isValid);
        break;

      default:
        employees.push(employeeData);
        isValid = true;
        showNotification(employeeData, isValid);
        renderEmployee(employeeData);
    }
  };

  const renderEmployee = employee => {
    const tr = document.createElement('tr');

    Object.keys(employee).forEach(el => {
      const newTd = document.createElement('td');

      if (el === 'salary') {
        employee[el] = `$${employee[el].toLocaleString('en-US')}`;
      }

      newTd.textContent = employee[el];
      tr.append(newTd);
    });

    tbody.append(tr);
  };

  const renderEmployees = arrayOfEmployees =>
    arrayOfEmployees.map(employee => renderEmployee(employee));

  switch (element) {
    case td:
      selectRow(element);
      break;

    case heading:
      sortEmployees(employees, heading);

      break;

    case button:
      saveToTable();
  }
});

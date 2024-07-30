'use strict';

// write code here

const body = document.querySelector('body');
const table = document.querySelector('table');
const tableHead = table.querySelector('thead');

const tableContent = table.querySelector('tbody');
const tableList = [...table.querySelectorAll('tbody tr')];

const SORT_ORDERS = {
  asc: 'asc',
  desc: 'desc',
};

const SORT_TYPES = {
  name: 'name',
  position: 'position',
  office: 'office',
  age: 'age',
  salary: 'salary',
};

const ATTRIBUTES = Object.keys(SORT_TYPES);
const SELECT_VALUES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

let sortColumnName = '';
let currentSortOrder = SORT_ORDERS.asc;
let activeTarget;

const stringToDigit = (str) => {
  return +str.replaceAll(',', '').slice(1);
};

const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

const NotificationMessage = (type) => {
  const notification = document.createElement('div');
  const title = document.createElement('h1');
  const desc = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  notification.classList.add(type);

  title.textContent = `${capitalize(type)} message`;
  desc.textContent = `${type === 'success' ? 'Employee added to table' : 'Something went wrong'}`;

  notification.append(title, desc);

  return notification;
};

const errorMessage = NotificationMessage('error');

errorMessage.style.display = 'none';

const successMessage = NotificationMessage('success');

successMessage.style.display = 'none';

const getEmployers = (employerList) => {
  const result = employerList.map((employer) => {
    const [
      employeeName,
      employeePosition,
      employeeOffice,
      employeeAge,
      employeeSalary,
    ] = employer.children;

    return {
      name: employeeName.textContent,
      position: employeePosition.textContent,
      office: employeeOffice.textContent,
      age: +employeeAge.textContent,
      salary: stringToDigit(employeeSalary.textContent),
    };
  });

  return result;
};

const getSortedList = (type, list, sortOrder = SORT_ORDERS.asc) => {
  const direction = sortOrder === SORT_ORDERS.asc ? 1 : -1;

  switch (type) {
    case SORT_TYPES.name:
    case SORT_TYPES.position:
    case SORT_TYPES.office:
      return list.sort((a, b) => a[type].localeCompare(b[type]) * direction);
    case SORT_TYPES.age:
    case SORT_TYPES.salary:
      return list.sort((a, b) => (a[type] - b[type]) * direction);
  }
};

const TableItem = (text) => {
  const td = document.createElement('td');

  td.textContent = text;

  return td;
};

const sortList = (type, sortOrder) => {
  const list = getEmployers(tableList);
  const sortedList = getSortedList(type.toLowerCase(), list, sortOrder);

  tableContent.innerHTML = '';

  for (const employer of sortedList) {
    const tr = document.createElement('tr');

    tr.append(
      TableItem(employer.name),
      TableItem(employer.position),
      TableItem(employer.office),
      TableItem(employer.age),
      TableItem(`$${employer.salary.toLocaleString()}`),
    );

    tableContent.append(tr);
  }
};

const FormLabel = (text) => {
  const label = document.createElement('label');

  label.textContent = text;

  return label;
};

const FormButton = (text) => {
  const button = document.createElement('button');

  button.textContent = text;
  button.setAttribute('type', 'submit');

  return button;
};

const FormInput = ({ type, attribute, required }) => {
  const input = document.createElement('input');

  input.setAttribute(type, attribute);
  input.required = required;

  if (attribute === 'age' || attribute === 'salary') {
    input.setAttribute('type', 'number');
  }

  return input;
};

const FormSelect = ({ type, attribute, selectValues, required }) => {
  const select = document.createElement('select');

  select.setAttribute(type, attribute);
  select.required = required;

  selectValues.forEach((optionValue) => {
    const option = document.createElement('option');

    option.textContent = optionValue;
    option.value = optionValue;

    select.append(option);
  });

  return select;
};

const addNewEmployee = (form) => {
  const employeeName = form.querySelector('[data-qa="name"]').value;
  const employeePosition = form.querySelector('[data-qa="position"]').value;
  const employeeOffice = form.querySelector('[data-qa="office"]').value;
  const employeeAge = form.querySelector('[data-qa="age"]').value;
  const employeeSalary = form.querySelector('[data-qa="salary"]').value;

  const tr = document.createElement('tr');
  const newEmployee = [
    employeeName,
    employeePosition,
    employeeOffice,
    employeeAge,
    `$${Number(employeeSalary).toLocaleString()}`,
  ];

  if (!employeeName.trim() || !employeePosition.trim()) {
    errorMessage.style.display = 'block';

    return;
  }

  if (employeeName.length < 4) {
    errorMessage.style.display = 'block';

    return;
  }

  if (employeeAge < 18 || employeeAge > 90) {
    errorMessage.style.display = 'block';

    return;
  }

  for (const employee of newEmployee) {
    const td = TableItem(employee);

    tr.append(td);
  }

  errorMessage.style.display = 'none';
  successMessage.style.display = 'block';

  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 2000);

  form.reset();
  tableList.push(tr);
  tableContent.append(tr);
};

const TableForm = () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const button = FormButton('Save to table');

  for (const attribute of ATTRIBUTES) {
    const label = FormLabel(`${capitalize(attribute)}: `);
    const input = FormInput({
      type: 'data-qa',
      attribute: attribute,
      required: true,
    });

    if (attribute === 'office') {
      const select = FormSelect({
        type: 'data-qa',
        attribute: attribute,
        selectValues: SELECT_VALUES,
        required: true,
      });

      label.append(select);
    } else {
      label.append(input);
    }

    form.append(label);
  }

  form.append(button);

  button.addEventListener('click', (e) => {
    e.preventDefault();

    addNewEmployee(form);
  });

  return form;
};

const selectTableRow = (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  if (activeTarget) {
    activeTarget.classList.remove('active');
  }

  activeTarget = tr;
  activeTarget.classList.add('active');
};

const toggleColumnSort = (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  if (sortColumnName === th.textContent) {
    currentSortOrder = SORT_ORDERS.desc;
    sortColumnName = '';
  } else {
    currentSortOrder = SORT_ORDERS.asc;
    sortColumnName = th.textContent;
  }

  sortList(e.target.textContent, currentSortOrder);
};

const App = () => {
  tableHead.addEventListener('click', toggleColumnSort);
  tableContent.addEventListener('click', selectTableRow);

  body.append(TableForm(), errorMessage, successMessage);
};

App();

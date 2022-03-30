'use strict';

const headers = document.querySelector('thead > tr').children;
const footers = document.querySelector('tfoot > tr').children;
const tableBody = document.querySelector('tbody');
let rows = [...tableBody.children];
let currentSort = '';

createForm();
addRowEvents();
createNotification();
addColumnEvent();

// console.log(tableBody.children[5].classList.add('active'));
// console.log(tableBody.children[4].classList.add('active'));
// console.log(tableBody.children[4].classList.remove('active'));

for (let i = 0; i < headers.length; i++) {
  headers[i].addEventListener('click', e => {
    rows.sort((a, b) =>
      sortRows(
        a.children[i].innerText,
        b.children[i].innerText,
        headers[i].innerText,
        currentSort
      ));

    currentSort = headers[i].innerText;

    tableBody.innerHTML = '';

    rows.forEach(elem =>
      tableBody.insertAdjacentHTML('beforeend', elem.innerHTML));

    addRowEvents();
  });

  footers[i].addEventListener('click', e => {
    rows.sort((a, b) =>
      sortRows(
        a.children[i].innerText,
        b.children[i].innerText,
        footers[i].innerText,
        currentSort
      ));

    currentSort = footers[i].innerText;

    tableBody.innerHTML = '';

    rows.forEach(elem =>
      tableBody.insertAdjacentHTML('beforeend', elem.innerHTML));

    addRowEvents();
  });

  footers[i].addEventListener('mouseover', e => {
    e.target.style.color = 'yellow';
    e.target.style.cursor = 'pointer';
  });

  footers[i].addEventListener('mouseleave', e => {
    e.target.style.color = '#808080';
    e.target.style.cursor = 'auto';
  });
}

function sortRows(elemFirst, elemSecond, columnName, sortedElem) {
  const sortFlag = columnName === sortedElem ? -1 : 1;

  switch (columnName) {
    case 'Name':
    case 'Position':
    case 'Office':
      return sortFlag * elemFirst.localeCompare(elemSecond);
    case 'Age':
      return sortFlag * (+elemFirst - +elemSecond);
    case 'Salary':
      return sortFlag
        * getSalaryNumber(elemFirst) - getSalaryNumber(elemSecond);
  }
}

function addColumnEvent() {
  rows.forEach(elem => {
    [...elem.children].forEach(col => {
      col.addEventListener('dblclick', e => {
        const initialValue = e.target.innerText;
        const nameInput = document.createElement('Input');

        e.target.innerText = '';

        nameInput.classList.add('cell-input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('name', 'name');
        nameInput.setAttribute('autofocus', '');

        nameInput.addEventListener('blur', ev => {
          if (ev.target.value === '') {
            e.target.innerHTML = '';
            e.target.innerText = initialValue;
          } else {
            e.target.innerHTML = '';
            e.target.innerText = ev.target.value;
          }
        });

        nameInput.addEventListener('keydown', ev => {
          if (ev.key === 'Enter') {
            if (ev.target.value === '') {
              e.target.innerHTML = '';
              e.target.innerText = initialValue;
            } else {
              e.target.innerHTML = '';
              e.target.innerText = ev.target.value;
            }
          }
        });

        e.target.appendChild(nameInput);
        nameInput.focus();
      });
    });
  });
}

function getSalaryNumber(salary) {
  return +salary.substr(1).replaceAll(',', '');
}

function addRowEvents() {
  for (const row of tableBody.children) {
    row.addEventListener('click', e => {
      for (const rowElem of tableBody.children) {
        rowElem.classList.remove('active');
      }

      row.classList.add('active');
    });
  }
}

function createForm() {
  const optionValues = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];
  const form = document.createElement('form');
  const nameLabel = document.createElement('Label');
  const nameInput = document.createElement('Input');
  const positionLabel = document.createElement('Label');
  const positionInput = document.createElement('Input');
  const officeLabel = document.createElement('Label');
  const officeSelect = document.createElement('Select');
  const ageLabel = document.createElement('Label');
  const ageInput = document.createElement('Input');
  const salaryLabel = document.createElement('Label');
  const salaryInput = document.createElement('Input');
  const button = document.createElement('button');

  nameInput.setAttribute('data-qa', 'name');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('name', 'name');
  nameInput.required = true;
  nameLabel.innerText = 'Name: ';
  nameLabel.appendChild(nameInput);

  positionInput.setAttribute('type', 'text');
  positionInput.setAttribute('data-qa', 'position');
  positionInput.setAttribute('name', 'position');
  positionInput.required = true;
  positionLabel.innerText = 'Position: ';
  positionLabel.appendChild(positionInput);

  officeSelect.setAttribute('id', 'selectId');
  officeSelect.setAttribute('data-qa', 'office');
  officeSelect.setAttribute('name', 'office');

  for (const value of optionValues) {
    const option = document.createElement('option');

    option.setAttribute('name', value);
    option.innerText = value;

    officeSelect.appendChild(option);
  }
  officeLabel.innerText = 'Office: ';
  officeLabel.appendChild(officeSelect);

  ageInput.setAttribute('type', 'number');
  ageInput.setAttribute('data-qa', 'age');
  ageInput.setAttribute('name', 'age');
  ageInput.required = true;
  ageLabel.innerText = 'Age: ';
  ageLabel.appendChild(ageInput);

  salaryInput.setAttribute('type', 'number');
  salaryInput.setAttribute('data-qa', 'salary');
  salaryInput.setAttribute('name', 'salary');
  salaryInput.required = true;
  salaryLabel.innerText = 'Salary: ';
  salaryLabel.appendChild(salaryInput);

  button.innerText = 'Save to table';
  button.setAttribute('type', 'submit');

  button.onclick = (e) => {
    e.preventDefault();
    addNewEmployee();
  };

  form.classList.add('new-employee-form');
  document.querySelector('body').appendChild(form);
  form.appendChild(nameLabel);
  form.appendChild(positionLabel);
  form.appendChild(officeLabel);
  form.appendChild(ageLabel);
  form.appendChild(salaryLabel);
  form.appendChild(button);
}

function addNewEmployee() {
  const form = document.querySelector('.new-employee-form');
  const table = document.querySelector('tbody');

  const validationResult = validation(
    form.elements.name.value,
    form.elements.position.value,
    +form.elements.age.value,
    form.elements.salary.value
  );

  if (validationResult.flag) {
    const row = `<tr>
      <td>${form.elements.name.value}</td>
      <td>${form.elements.position.value}</td>
      <td>${form.elements.office.value}</td>
      <td>${form.elements.age.value}</td>
      <td>$${salaryWithCommas(form.elements.salary.value)}</td>
    </td>`;

    table.insertAdjacentHTML('beforeend', row);

    addNotification(true, 'Success', 'Employee added');
    rows = [...tableBody.children];
    addRowEvents();
  } else {
    addNotification(false, 'Data is not Valid', validationResult.description);
  }
}

function salaryWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function createNotification() {
  const form = document.querySelector('body');
  const blockNotification = document.createElement('div');
  const title = document.createElement('h1');
  const description = document.createElement('p');

  blockNotification.classList.add('notification');
  blockNotification.setAttribute('data-qa', 'notification');
  title.classList.add('title');

  blockNotification.appendChild(title);
  blockNotification.appendChild(description);
  blockNotification.style.display = 'none';
  form.appendChild(blockNotification);
}

function addNotification(flag, titleText, descriptionText) {
  const blockNotification = document.querySelector('.notification');
  const title = document.querySelector('.notification>h1');
  const description = document.querySelector('.notification>p');

  if (flag) {
    blockNotification.classList.remove('error');
    blockNotification.classList.add('success');
  } else {
    blockNotification.classList.remove('success');
    blockNotification.classList.add('error');
  }

  title.innerText = titleText;
  description.innerText = descriptionText;
  blockNotification.style.display = 'block';
}

function validation(nameValue, positionValue, ageValue, salaryValue) {
  const resultObject = {};

  resultObject.flag = true;

  if (nameValue.length < 4) {
    resultObject.flag = false;
    resultObject.description = 'Name value has less than 4 letters';
  }

  if (positionValue === '') {
    if (resultObject.flag) {
      resultObject.flag = false;
      resultObject.description = 'Position required';
    } else {
      resultObject.description += '\nPosition required';
    }
  }

  if (ageValue < 18 || ageValue > 90) {
    if (resultObject.flag) {
      resultObject.flag = false;
      resultObject.description = 'Age should be between 18 and 90';
    } else {
      resultObject.description += '\nAge should be between 18 and 90';
    }
  }

  if (salaryValue === '') {
    if (resultObject.flag) {
      resultObject.flag = false;
      resultObject.description = 'Salary required';
    } else {
      resultObject.description += '\nSalary required';
    }
  }

  return resultObject;
}

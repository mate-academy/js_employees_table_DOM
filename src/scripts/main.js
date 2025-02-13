'use strict';

const tableBody = document.querySelector('tbody');
const list = [...tableBody.children];

const employees = list.map((item) => {
  const cells = item.querySelectorAll('td');

  return {
    name: cells[0].textContent,
    position: cells[1].textContent,
    office: cells[2].textContent,
    age: +cells[3].textContent,
    salary: +cells[4].textContent.replace(/[$,]/g, ''),
  };
});

const tableHead = document.querySelector('thead');

const headerToPropertyMap = {
  name: 'name',
  position: 'position',
  office: 'office',
  age: 'age',
  salary: 'salary',
};

const currentSort = { column: '', direction: 'asc' };

tableHead.addEventListener('click', function (e) {
  const column = headerToPropertyMap[e.target.textContent.trim().toLowerCase()];

  if (e.target.tagName !== 'TH') {
    return;
  }

  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.direction = 'asc';
  }

  if (['name', 'position', 'office'].includes(column)) {
    sortingByString(employees, column);
  } else if (['age', 'salary'].includes(column)) {
    sortingByNumber(employees, column);
  }

  updateTable();
});

function sortingByString(objects, type) {
  return objects.sort((a, b) => {
    const result = a[type].localeCompare(b[type]);

    return currentSort.direction === 'asc' ? result : -result;
  });
}

function sortingByNumber(objects, type) {
  return objects.sort((a, b) => {
    const result = a[type] - b[type];

    return currentSort.direction === 'asc' ? result : -result;
  });
}

function updateTable() {
  tableBody.innerHTML = '';

  employees.forEach((employee) => {
    const row = document.createElement('tr');

    row.innerHTML = `<td>${employee.name}</td><td>${employee.position}</td><td>${employee.office}</td><td>${employee.age}</td><td>$${employee.salary.toLocaleString()}</td>`;

    tableBody.appendChild(row);
  });
}

function activeRow(currentRow) {
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((row) => row.classList.remove('active'));
  currentRow.classList.add('active');
}

tableBody.addEventListener('click', function (e) {
  const tr = e.target.closest('tr');

  if (!tr || !tableBody.contains(tr)) {
    return;
  }
  activeRow(tr);
});

function createForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  createInputs(newForm);
  createSelect(newForm);
  createButton(newForm);
  setDataset(newForm);

  document.body.appendChild(newForm);
}

function createInputs(someform) {
  const keys = Object.keys(headerToPropertyMap);

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'office') {
      continue;
    }

    if (keys[i] === 'age' || keys[i] === 'salary') {
      someform.innerHTML += `<label>${keys[i][0].toUpperCase() + keys[i].slice(1)}: <input name="${keys[i]}" type="number"></label>`;
    } else {
      someform.innerHTML += `<label>${keys[i][0].toUpperCase() + keys[i].slice(1)}: <input name="${keys[i]}" type="text"></label>`;
    }
  }
}

function createSelect(someform) {
  const selectElem = document.createElement('select');

  selectElem.setAttribute('name', 'office');

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  for (const office of offices) {
    const option = document.createElement('option');

    option.setAttribute('value', office);
    option.textContent = office;
    selectElem.appendChild(option);
  }

  const label = document.createElement('label');

  label.textContent = 'Office: ';
  label.appendChild(selectElem);

  const thirdElement = someform.children[2];

  if (thirdElement) {
    someform.insertBefore(label, thirdElement);
  } else {
    someform.appendChild(label);
  }
}

function createButton(someform) {
  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.setAttribute('type', 'submit');
  button.setAttribute('data-qa', 'save-button');

  someform.appendChild(button);
}

function setDataset(someform) {
  Array.from(someform.elements).forEach((elem) => {
    if (elem.name) {
      elem.setAttribute('data-qa', elem.name);
      elem.setAttribute('required', '');
    }
  });
}

createForm();

const submitButton = document.querySelector('button');
const form = document.querySelector('form');

submitButton.addEventListener('click', function (e) {
  e.preventDefault();

  const data = getFormData(form);

  const allFieldsFilled = Object.values(data).every(
    (value) => value.trim() !== '',
  );

  if (!allFieldsFilled) {
    const warningTitle = 'Warning!';
    const warningDescription =
      'There is some empty fields, please enter all info';
    const warning = 'warning';

    pushNotification(warningTitle, warningDescription, warning);
    return;
  }

  if (data.name.length < 4 || data.age < 18 || data.age > 90) {
    const errorTitle = 'Error!';
    const errorDescription =
      // eslint-disable-next-line max-len
      'Please check, if your name is not less than 4 letters and your age is not less than 18 or more than 90';

    const error = 'error';

    pushNotification(errorTitle, errorDescription, error);
    return;
  }

  const newRowInfo = document.createElement('tr');

  newRowInfo.innerHTML = `<td>${data.name}</td><td>${data.position}</td><td>${data.office}</td><td>${data.age}</td><td>$${data.salary.toLocaleString()}</td>`;

  tableBody.appendChild(newRowInfo);

  form.reset();
  employees.push(data); // Добавляем нового сотрудника в массив
  updateTable(); // Обновляем таблицу с учетом нового сотрудника

  const succeessTitle = 'Good job!';
  const successDescription = 'You have added info about employeer';
  const success = 'success';

  pushNotification(succeessTitle, successDescription, success);
});

function getFormData(someform) {
  const formData = {};

  // Проходимся по всем элементам формы
  Array.from(someform.elements).forEach((element) => {
    if (element.name) {
      formData[element.name] = element.value;
    }
  });

  return formData;
}

function pushNotification(title, description, type) {
  const notificationDiv = document.createElement('div');

  notificationDiv.setAttribute('data-qa', 'notification');

  notificationDiv.classList.add('notification');

  const titleOfDiv = document.createElement('h2');

  titleOfDiv.classList.add('title');
  titleOfDiv.textContent = title;

  const parOfDiv = document.createElement('p');

  parOfDiv.textContent = description;

  notificationDiv.append(titleOfDiv);
  notificationDiv.append(parOfDiv);

  if (type === 'success') {
    notificationDiv.classList.add('success');
  } else if (type === 'error') {
    notificationDiv.classList.add('error');
  } else {
    notificationDiv.classList.add('warning');
  }

  document.body.append(notificationDiv);

  notificationDiv.style.transition = 'opacity 0.5s ease';
  notificationDiv.style.opacity = '1';

  setTimeout(() => {
    notificationDiv.style.opacity = '0';

    setTimeout(() => {
      notificationDiv.remove();
    }, 500);
  }, 2000);
}

updateTable();

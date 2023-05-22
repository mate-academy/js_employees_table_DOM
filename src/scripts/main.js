'use strict';

const head = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

// -----sorting employees-----
const sortBySymbols = (rowA, rowB, columnIndex) => {
  const strA = rowA.querySelector(`td:nth-child(${columnIndex})`).textContent;
  const strB = rowB.querySelector(`td:nth-child(${columnIndex})`).textContent;

  return strA.localeCompare(strB);
};

const sortByName = (rowA, rowB) => sortBySymbols(rowA, rowB, 1);
const sortByPosition = (rowA, rowB) => sortBySymbols(rowA, rowB, 2);
const sortByOffice = (rowA, rowB) => sortBySymbols(rowA, rowB, 3);

const sortByAge = (rowA, rowB) => {
  const ageA = rowA.querySelector('td:nth-child(4)').textContent;
  const ageB = rowB.querySelector('td:nth-child(4)').textContent;

  return ageA - ageB;
};

const sortBySalary = (rowA, rowB) => {
  const salaryA = +rowA.querySelector('td:nth-child(5)')
    .textContent.replace(/[^0-9.-]+/g, '');

  const salaryB = +rowB.querySelector('td:nth-child(5)')
    .textContent.replace(/[^0-9.-]+/g, '');

  return salaryA - salaryB;
};

const functionMap = {
  'Name': sortByName,
  'Position': sortByPosition,
  'Office': sortByOffice,
  'Age': sortByAge,
  'Salary': sortBySalary,
};

function sortColumns() {
  head.addEventListener('click', e => {
    const rows = tbody.querySelectorAll('tr');
    const rowsArr = Array.from(rows);
    const sortingFunction = functionMap[e.target.textContent];

    const isAscending = e.target.classList.contains('asc');

    if (isAscending) {
      rowsArr.sort((rowA, rowB) => sortingFunction(rowB, rowA));
      e.target.classList.remove('asc');
      e.target.classList.add('desc');
    } else {
      rowsArr.sort(sortingFunction);
      e.target.classList.remove('desc');
      e.target.classList.add('asc');
    }

    head.querySelectorAll('th').forEach(element => {
      if (element !== e.target) {
        element.classList.remove('asc', 'desc');
      }
    });

    rowsArr.forEach(element => {
      tbody.append(element);
    });
  });
}
sortColumns();

// active class
function addActiveClass() {
  tbody.addEventListener('click', e => {
    const row = e.target.closest('tr');
    const isCurrentRowActive = row.classList.contains('active');

    if (!isCurrentRowActive) {
      const prevRowActive = tbody.querySelector('.active');

      if (prevRowActive) {
        prevRowActive.classList.remove('active');
      }
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  });
}
addActiveClass();

// add form
const form = document.createElement('form');

form.method = 'get';
form.action = '/';
form.className = 'new-employee-form';
body.append(form);

const inputLabels = [
  {
    label: 'Name:',
    type: 'text',
    qa: 'name',
    name: 'name',
  },
  {
    label: 'Position:',
    type: 'text',
    qa: 'position',
    name: 'position',
  },
  {
    label: 'Age:',
    type: 'number',
    qa: 'age',
    name: 'age',
  },
  {
    label: 'Salary:',
    type: 'number',
    qa: 'salary',
    name: 'salary',
  },
];

inputLabels.forEach(inpLabel => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = inpLabel.label;
  input.type = inpLabel.type;
  input.dataset['qa'] = inpLabel.qa;
  input.name = inpLabel.name;
  input.required = 'true';

  label.appendChild(input);
  form.appendChild(label);
});

// select input
const selectLabel = document.createElement('label');
const select = document.createElement('select');

select.dataset['qa'] = 'office';
select.name = 'office';
select.required = 'true';
selectLabel.textContent = 'Office:';

const options = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

options.forEach(optionText => {
  const option = document.createElement('option');

  option.textContent = optionText;
  select.append(option);
});

const positionLabel = form.querySelector('label:nth-child(2)');

positionLabel.after(selectLabel);
selectLabel.append(select);

// button
const submitBtn = document.createElement('button');

submitBtn.textContent = 'Save to table';
submitBtn.type = 'submit';
form.append(submitBtn);

// add person
const takeForm = document.querySelector('.new-employee-form');

function addEmployee() {
  takeForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(takeForm);
    const f = Object.fromEntries(formData.entries());

    if (f.name.length < 4 || f.age < 18 || f.age > 90) {
      pushNotification('error',
        `Name of employee must be longer than 4 characters`
        + ` and age must be between 18 - 90 y.o.`
      );
    } else {
      tbody.insertAdjacentHTML('afterbegin', `
      <tr>
        <td>${f.name}</td>
        <td>${f.position}</td>
        <td>${f.office}</td>
        <td>${f.age}</td>
        <td>$${f.salary.toLocaleString('en-US')}</td>
      </tr>
    `);
      pushNotification('success', 'Employee is successfully added');
      form.reset();
    }
  });
}
addEmployee();

// notification
function pushNotification(typeOfMessage, notificationMessage) {
  const box = document.createElement('div');
  const h2 = document.createElement('h2');
  const paragraph = document.createElement('p');

  h2.textContent = typeOfMessage;
  paragraph.textContent = `${notificationMessage}`;
  box.setAttribute('class', `notification ${typeOfMessage}`);
  box.dataset['qa'] = 'notification';

  box.append(h2, paragraph);
  body.append(box);

  setTimeout(() => box.remove(), 4000);
}

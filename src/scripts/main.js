'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const header = document.querySelector('thead tr');
const tbody = document.querySelector('tbody');
const Form = document.createElement('form');
let isSortingAscDesc = false;
let selectedIndexColumnForSort = -1;
const activeTrRow = [];

const formFieldsAttributes = [
  {
    label: 'Name:', dataSet: 'name', element: 'input', type: 'text',
  },
  {
    label: 'Position:', dataSet: 'position', element: 'input', type: 'text',
  },
  {
    label: 'Office:', dataSet: 'office', element: 'select',
  },
  {
    label: 'Age:', dataSet: 'age', element: 'input', type: 'number',
  },
  {
    label: 'Salary:', dataSet: 'salary', element: 'input', type: 'number',
  },
];

const selectOffices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

table.style.margin = '0 0 auto';

createForm(Form);

tbody.addEventListener('click', (e) => {
  const item = e.target.closest('tr');
  const activeRows = document.querySelectorAll('.active');

  if (!item || !tbody.contains(item)) {
    return;
  }

  activeTrRow.length = 0;

  for (let i = 0; i < item.children.length; i++) {
    activeTrRow.push(item.children[i].textContent);
  }

  if ([...activeRows].length > 0) {
    [...activeRows][0].classList.remove('active');
  }

  item.classList.add('active');
});

header.addEventListener('click', (e) => {
  e.preventDefault();

  const index = [...e.target.parentNode.children]
    .findIndex(item => item === e.target);

  if (selectedIndexColumnForSort !== index) {
    isSortingAscDesc = false;
    selectedIndexColumnForSort = index;
  } else if (!isSortingAscDesc) {
    isSortingAscDesc = true;
  } else if (isSortingAscDesc) {
    isSortingAscDesc = false;
  }

  sortTableByColumn(index);
});

Form.addEventListener('submit', (e) => {
  e.preventDefault();

  const Name = e.target.name.value;
  const Position = e.target.position.value;
  const Office = e.target.office.value;
  const Age = e.target.age.value;
  const Salary = e.target.salary.value;

  if (Name.trim().length < 5) {
    notification(
      'error',
      'Error',
      'The Name field must have at least 5 characters.',
    );

    return;
  }

  if (!Position.trim()) {
    notification(
      'error',
      'Error',
      'The Position field cannot be empty.',
    );

    return;
  }

  if (+Age < 18 || +Age > 90) {
    notification(
      'error',
      'Error',
      'The Age field must be no less than 18 and no more than 90.',
    );

    return;
  }

  if (+Salary < 1) {
    notification(
      'error',
      'Error',
      'The Salary field must be no less than 1 dollar',
    );

    return;
  }

  const numberFormatter = Intl.NumberFormat('en-US');
  const salar = `$${numberFormatter.format(Salary)}`;

  const newEmployee = {
    name: Name.trim(),
    position: Position.trim(),
    office: Office,
    age: Age,
    salary: salar,
  };

  const newTr = document.createElement('tr');

  for (const key in newEmployee) {
    const newTd = document.createElement('td');

    newTd.textContent = newEmployee[key];
    newTr.append(newTd);
  }

  tbody.append(newTr);

  notification('succes', 'Success', 'New employee added successfully');

  e.target.name.value = '';
  e.target.position.value = '';
  e.target.office.value = selectOffices[0];
  e.target.age.value = '';
  e.target.salary.value = '';
});

function sortTableByColumn(index) {
  const activeRows = document.querySelectorAll('.active');
  const sortArr = sortByColumn(index);

  for (let y = 0; y < [...tbody.children].length; y++) {
    for (let x = 0; x < [...tbody.children][y].children.length; x++) {
      [...tbody.children][y].children[x].textContent = sortArr[y][x];
    }

    if (isActiveRow(y)) {
      if ([...activeRows].length > 0) {
        [...activeRows][0].classList.remove('active');
      }

      [...tbody.children][y].classList.add('active');
    }
  }
}

function sortByColumn(index) {
  const arr = [...tbody.children]
    .map(r => [...r.children].map(c => c.textContent))
    .sort((a, b) => {
      const [it1, it2] = isSortingAscDesc ? [b, a] : [a, b];

      switch (index) {
        case 4: {
          return formattingSalaryForSort(it1[index])
            - (formattingSalaryForSort(it2[index]));
        }

        default:
          return it1[index].localeCompare(it2[index]);
      }
    });

  return arr;
}

function formattingSalaryForSort(str) {
  return +str.slice(1).replace(/,/g, '.');
}

function isActiveRow(indexColumn) {
  return [...[...tbody.children][indexColumn].children]
    .map((item, index) => item.textContent === activeTrRow[index])
    .every(item => item);
}

function createForm(form) {
  form.className = 'new-employee-form';

  for (const fieldAttributes of formFieldsAttributes) {
    const { label, dataSet, element, type } = fieldAttributes;
    const Label = document.createElement('label');

    Label.textContent = label;

    const input = document.createElement(element);

    if (element === 'select') {
      input.name = dataSet;
      input.dataset.qa = dataSet;

      for (const selectOffice of selectOffices) {
        const option = document.createElement('option');

        option.textContent = selectOffice;
        input.required = true;
        input.append(option);
      }
    } else {
      input.type = type;
      input.name = dataSet;
      input.dataset.qa = dataSet;
      input.required = true;
    }

    Label.append(input);

    form.append(Label);
  }

  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to Table';
  form.append(button);

  body.append(form);
}

function notification(typeClass, titlE, text) {
  const notificationBlock = document.createElement('div');

  notificationBlock.dataset.qa = 'notification';
  notificationBlock.className = `notification ${typeClass}`;

  const title = document.createElement('h2');

  title.classList = 'title';
  title.textContent = titlE;
  title.style.whiteSpace = 'nowrap';
  notificationBlock.append(title);

  const desc = document.createElement('p');

  desc.textContent = text;
  notificationBlock.append(desc);

  body.append(notificationBlock);

  setTimeout(() => {
    notificationBlock.remove();
  }, 3000);
}

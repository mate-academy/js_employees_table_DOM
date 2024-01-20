'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const header = document.querySelector('thead tr');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');
let isSortingAscDesc = false;
let selectedIndexColumnForSort = -1;
const activeTrRow = [];

const formFieldsSettings = [
  {
    lab: 'Name:', dSet: 'name', elem: 'input', type: 'text',
  },
  {
    lab: 'Position:', dSet: 'position', elem: 'input', type: 'text',
  },
  {
    lab: 'Office:', dSet: 'office', elem: 'select',
  },
  {
    lab: 'Age:', dSet: 'age', elem: 'input', type: 'number',
  },
  {
    lab: 'Salary:', dSet: 'salary', elem: 'input', type: 'number',
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

createForm(form);

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

  sortTableByColumnASC(index);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const Name = e.target.name.value;
  const Position = e.target.position.value;
  const Office = e.target.office.value;
  const Age = e.target.age.value;
  const Salary = e.target.salary.value;

  if (Name.trim().length < 4) {
    notification(
      'error',
      'Error',
      'The Name field must have at least 5 characters.',
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

  const salar = '$' + (+Salary).toFixed(3).replace(/\./g, ',');

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

function sortTableByColumnASC(index) {
  const activeRows = document.querySelectorAll('.active');

  const sortArr = (index === 4)
    ? sortBySalaryColumn(index)
    : sortByRestColumns(index);

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

function sortBySalaryColumn(index) {
  return (isSortingAscDesc)
    ? [...tbody.children]
      .map(r => [...r.children].map(c => c.textContent))
      .sort((it1, it2) => (+it2[index].slice(1).replace(/,/g, '.'))
          - (+it1[index].slice(1).replace(/,/g, '.')))
    : [...tbody.children]
      .map(r => [...r.children].map(c => c.textContent))
      .sort((it1, it2) => (+it1[index].slice(1).replace(/,/g, '.'))
          - (+it2[index].slice(1).replace(/,/g, '.')));
}

function sortByRestColumns(index) {
  return (isSortingAscDesc)
    ? [...tbody.children]
      .map(r => [...r.children].map(c => c.textContent))
      .sort((it1, it2) => it2[index].localeCompare(it1[index]))
    : [...tbody.children]
      .map(r => [...r.children].map(c => c.textContent))
      .sort((it1, it2) => it1[index].localeCompare(it2[index]));
}

function isActiveRow(indexColumn) {
  return [...[...tbody.children][indexColumn].children]
    .map((item, index) => item.textContent === activeTrRow[index])
    .every(item => item);
}

function createForm(f) {
  f.className = 'new-employee-form';

  for (const fS of formFieldsSettings) {
    const { lab, dSet, elem, type } = fS;
    const label = document.createElement('label');

    label.textContent = lab;

    const input = document.createElement(elem);

    if (elem === 'select') {
      input.name = dSet;
      label.dataset.qa = dSet;

      for (const selOffice of selectOffices) {
        const option = document.createElement('option');

        option.textContent = selOffice;
        input.required = true;
        input.append(option);
      }
    } else {
      input.type = type;
      input.name = dSet;
      label.dataset.qa = dSet;
      input.required = true;
    }

    label.append(input);

    f.append(label);
  }

  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to Table';
  f.append(button);

  body.append(f);
}

function notification(succesRes, title, text) {
  const notific = document.createElement('div');

  notific.dataset.qa = 'notification';
  notific.className = `notification ${succesRes}`;

  const titl = document.createElement('h2');

  titl.classList = 'title';
  titl.textContent = title;
  titl.style.whiteSpace = 'nowrap';
  notific.append(titl);

  const desc = document.createElement('p');

  desc.textContent = text;
  notific.append(desc);

  body.append(notific);

  setTimeout(() => {
    notific.remove();
  }, 3000);
}

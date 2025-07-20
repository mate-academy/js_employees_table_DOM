'use strict';

// повідомлення
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  notification.style.position = 'absolute';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  notification.append(h2, p);
  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

// сортування

let lastSortedColumn = -1;
let sortDirection = 'asc';

const tbody = document.querySelector('tbody');
const tHead = document.querySelector('thead');

tHead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const clickedIndex = e.target.cellIndex;

  if (clickedIndex === lastSortedColumn) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortDirection = 'asc';
  }
  lastSortedColumn = clickedIndex;

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const textA = a.children[clickedIndex].textContent;
    const textB = b.children[clickedIndex].textContent;
    const direction = sortDirection === 'asc' ? 1 : -1;

    switch (clickedIndex) {
      case 3:
        return (parseInt(textA, 10) - parseInt(textB, 10)) * direction;
      case 4:
        return (parseSalary(textA) - parseSalary(textB)) * direction;
      default:
        return textA.localeCompare(textB) * direction;
    }
  });

  tbody.append(...rows);
});

function parseSalary(num) {
  return Number(num.replace(/[$,]/g, ''));
}

// виділення рядку

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const currentActiveRow = tbody.querySelector('.active');

  if (currentActiveRow && currentActiveRow !== clickedRow) {
    currentActiveRow.classList.remove('active');
  }

  clickedRow.classList.toggle('active');
});

// створення форми

const form = document.createElement('form');

form.className = 'new-employee-form';

const inputsConfig = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

inputsConfig.forEach((config) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = config.label;
  input.name = config.name;
  input.type = config.type;
  input.dataset.qa = config.qa;

  label.append(input);
  form.append(label);
});

const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const selectLabel = document.createElement('label');
const select = document.createElement('select');

selectLabel.textContent = 'Office:';
select.name = 'office';
select.dataset.qa = 'office';

selectOptions.forEach((cityName) => {
  const option = document.createElement('option');

  option.value = cityName;
  option.textContent = cityName;
  select.append(option);
});

selectLabel.append(select);
form.append(selectLabel);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.append(submitButton);

document.querySelector('table').after(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // в чистому жс дані автоматично не передаються в об'єкт при сабміті,
  // треба їх витягувати окремо,через спеціальний об'єкт FormData
  const formData = new FormData(e.target);

  const data = Object.fromEntries(formData.entries());

  const formName = data.name.trim();
  const formAge = Number(data.age);
  const formPosition = data.position.trim();
  const formSalary = Number(data.salary.trim().replace(/[$,]/g, ''));
  const formOffice = data.office;

  if (formName.length < 4) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'Name must be at least 4 characters.',
      'error',
    );

    return;
  }

  if (isNaN(formAge) || formAge < 18 || formAge > 90) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'Age must be a number between 18 and 90.',
      'error',
    );

    return;
  }

  if (!formPosition || !formSalary || !formOffice) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'All fields are required.',
      'error',
    );

    return;
  }

  // додавання рядка
  const newRowData = [
    data.name,
    data.position,
    data.office,
    data.age,
    `$${Number(data.salary).toLocaleString('en-US')}`,
  ];

  const tr = document.createElement('tr');

  newRowData.forEach((cellText) => {
    const td = document.createElement('td');

    td.textContent = cellText;
    tr.append(td);
  });

  tbody.append(tr);

  pushNotification(
    10,
    10,
    'Success',
    `Employee ${data.name} added.`,
    'success',
  );

  form.reset();
});

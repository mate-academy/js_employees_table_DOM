'use strict';

const theads = document.querySelectorAll('th');
const tbody = document.querySelector('table tbody');
const trArr = [...tbody.querySelectorAll('tr')];

const sortOrder = Array(theads.length).fill(true);

function sortColumns(index) {
  const asc = sortOrder[index];

  trArr.sort((a, b) => {
    const trA = a.cells[index].textContent;
    const trB = b.cells[index].textContent;

    if (asc) {
      return trA.localeCompare(trB, undefined, { numeric: true });
    } else {
      return trB.localeCompare(trA, undefined, { numeric: true });
    }
  });

  sortOrder[index] = !asc;

  tbody.innerHTML = '';
  trArr.forEach((tr) => tbody.append(tr));
}

theads.forEach((thead, index) => {
  thead.addEventListener('click', () => {
    sortColumns(index);
  });
});

trArr.forEach((selectedTr) => {
  selectedTr.addEventListener('click', () => {
    trArr.forEach((anotherTr) => anotherTr.classList.remove('active'));

    selectedTr.classList.add('active');
  });
});

const body = document.querySelector('body');

const form = document.createElement('form');

form.classList.add('new-employee-form');
body.append(form);

const formCategories = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    id: 'name',
    qa: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    id: 'position',
    qa: 'position',
  },
  {
    label: 'Office:',
    name: 'office',
    type: 'select',
    id: 'office',
    qa: 'office',
    options: [
      { value: 'Tokyo', text: 'Tokyo' },
      { value: 'Singapore', text: 'Singapore' },
      { value: 'London', text: 'London' },
      { value: 'New York', text: 'New York' },
      { value: 'Edinburgh', text: 'Edinburgh' },
      { value: 'San Francisco', text: 'San Francisco' },
    ],
  },
  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    id: 'age',
    qa: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    id: 'salary',
    qa: 'salary',
  },
];

function createElements(element) {
  const labelElement = document.createElement('label');

  labelElement.textContent = element.label;
  labelElement.classList.add('label');
  labelElement.setAttribute('for', element.id);

  let inputElement;

  if (element.type === 'select') {
    inputElement = document.createElement('select');

    inputElement.setAttribute('name', element.name);
    inputElement.setAttribute('id', element.id);
    inputElement.setAttribute('data-qa', element.qa);
    inputElement.classList.add('input');

    element.options.forEach((option) => {
      const selectOption = document.createElement('option');

      selectOption.setAttribute('value', option.value);
      selectOption.textContent = option.text;
      selectOption.classList.add('select');
      inputElement.append(selectOption);
    });
  } else {
    inputElement = document.createElement('input');

    inputElement.classList.add('input');
    inputElement.setAttribute('name', element.name);
    inputElement.setAttribute('id', element.id);
    inputElement.setAttribute('type', element.type);
    inputElement.setAttribute('data-qa', element.qa);
  }

  labelElement.append(inputElement);

  return labelElement;
}

formCategories.forEach((category) => {
  const labelWithInput = createElements(category);

  form.append(labelWithInput);
});

const button = document.createElement('button');

button.setAttribute('type', 'button');
button.textContent = 'Save to table';
button.classList.add('button');
form.append(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newRow = document.createElement('tr');
  let isValid = true;

  formData.forEach((value, key) => {
    const td = document.createElement('td');

    if (key === 'salary') {
      const normalisedSalary = parseFloat(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      td.textContent = normalisedSalary;
    } else {
      td.textContent = value;
    }

    newRow.append(td);

    if (!checkDataValidity(key, value)) {
      isValid = false;
    }
  });

  if (isValid) {
    tbody.append(newRow);
    pushNotification('success');
    form.reset();
  } else {
    pushNotification('error');
  }
});

function checkDataValidity(id, value) {
  if (id === 'name') {
    return value.trim().length >= 4;
  }

  if (id === 'age') {
    return value >= 18 && value <= 90;
  }

  if (id === 'salary') {
    return value > 0;
  }

  return !!value.trim();
}

function pushNotification(type) {
  const div = document.createElement('div');

  div.classList.add('notification');
  div.setAttribute('data-qa', 'notification');

  const title = document.createElement('h2');

  title.classList.add('title');
  div.append(title);

  if (type === 'success') {
    div.classList.add('success');
    title.textContent = 'Added to table!';
  } else if (type === 'error') {
    div.classList.add('error');
    title.textContent = 'Invalid data!';
  }

  body.append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
}

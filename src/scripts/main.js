'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const trBody = Array.from(tbody.querySelectorAll('tr'));
const form = document.createElement('form');

createInput('Name: ', 'name', 'name', 'text', 'input');
createInput('Position: ', 'position', 'position', 'text', 'input');

const select = createInput('Office', 'office', 'office', null, 'select');
const button = document.createElement('button');
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

cities.forEach((city) => createOption(city, select));

createInput('Age: ', 'age', 'age', 'number', 'input');
createInput('Salary: ', 'salary', 'salary', 'number', 'input');

button.textContent = 'Save to table';
form.classList.add('new-employee-form');
form.append(button);
body.append(form);

function createInput(labetText, valueAtr, nameInp, typeInp, typeEl) {
  const input = document.createElement(typeEl);
  const label = document.createElement('label');

  label.textContent = labetText;
  label.append(input);
  input.setAttribute('data-qa', valueAtr);
  input.name = nameInp;

  if (typeEl === 'input') {
    input.required = true;
    input.type = typeInp;
  }

  form.append(label);

  return input;
}

function createOption(value, selectElement) {
  const option = document.createElement('option');

  option.textContent = value;

  selectElement.append(option);
}

let sotrUp = false;
let lastSortedIndex = 0;

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');
  const ths = Array.from(thead.querySelectorAll('th'));
  const index = ths.indexOf(th);

  sotrUp = !sotrUp;

  if (lastSortedIndex !== index) {
    sotrUp = false;
  }

  lastSortedIndex = index;

  trBody.sort((a, b) => {
    const firstEl = b.children[index].textContent.replace(/[$,]/g, '');
    const secondEl = a.children[index].textContent.replace(/[$,]/g, '');

    const numA = Number(firstEl);
    const numB = Number(secondEl);

    if (!isNaN(numA) && !isNaN(numB)) {
      return sotrUp ? numA - numB : numB - numA;
    }

    return sotrUp
      ? firstEl.localeCompare(secondEl)
      : secondEl.localeCompare(firstEl);
  });

  tbody.innerHTML = '';

  trBody.forEach((el) => {
    tbody.append(el);
  });
});

let isChange = false;

tbody.addEventListener('dblclick', (e) => {
  if (!isChange) {
    const inputTh = document.createElement('input');
    const td = e.target.closest('td');
    const firstValue = td.textContent;

    inputTh.classList.add('cell-input');
    isChange = true;
    td.textContent = '';
    td.append(inputTh);

    inputTh.addEventListener('keypress', (ev) => {
      isChange = false;

      if (ev.key === 'Enter') {
        if (inputTh.value !== '') {
          td.textContent = inputTh.value;
          inputTh.remove();
        } else {
          td.textContent = firstValue;
        }
      }
    });

    inputTh.addEventListener('blur', () => {
      isChange = false;

      if (inputTh.value !== '') {
        td.textContent = inputTh.value;
        inputTh.remove();
      } else {
        td.textContent = firstValue;
      }
    });
  }
});

tbody.addEventListener('click', (e) => {
  for (const el of trBody) {
    el.classList.remove('active');
  }

  const tr = e.target.closest('tr');

  tr.classList.add('active');
});

const pushNotification = (title, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');

  div.setAttribute('data-qa', 'notification');
  div.classList.add('notification');
  div.classList.add(type);
  h2.classList.add('title');
  h2.textContent = title;

  div.append(h2);
  document.body.append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  const inpName = document.querySelector('input[data-qa="name"]');
  const inpPosition = document.querySelector('input[data-qa="position"]');
  const inpSelect = document.querySelector('select[data-qa="office"]');
  const inpAge = document.querySelector('input[data-qa="age"]');
  const inpSalary = document.querySelector('input[data-qa="salary"]');
  const objectInp = {
    name: inpName.value,
    position: inpPosition.value,
    office: inpSelect.value,
    age: inpAge.value,
    salary: `$${inpSalary.value}`,
  };
  let isError = false;

  const tr = document.createElement('tr');

  for (const key in objectInp) {
    if (
      objectInp.name.length < 4 ||
      Number(objectInp.age) < 18 ||
      Number(objectInp) > 90
    ) {
      pushNotification('Title of Error message', 'error');

      return;
    } else {
      isError = true;

      const td = document.createElement('td');

      td.textContent = objectInp[key];
      tr.append(td);
    }
  }

  if (isError) {
    pushNotification('Title of Success message', 'success');
  }

  tbody.append(tr);
});

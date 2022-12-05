'use strict';

const body = document.querySelector('body');
const tableHeaders = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

let isAsc = true;
let defaultIndex = -1;

tableHeaders.addEventListener('click', (e) => {
  const tableRows = tableBody.querySelectorAll('tr');

  sortData([...tableRows], e.target.cellIndex);
});

const sortData = (arr, index) => {
  isAsc = index !== defaultIndex || !isAsc;
  defaultIndex = index;

  arr.sort((a, b) => {
    let prev = a.children[index].innerText.trim();
    let next = b.children[index].innerText.trim();

    if (!isAsc) {
      [prev, next] = [next, prev];
    }

    if (getNumber(prev)) {
      return getNumber(prev) - getNumber(next);
    } else {
      return prev.localeCompare(next);
    }
  });

  for (const x of arr) {
    tableBody.append(x);
  }
};

const getNumber = (data) => data.replace(/\D/g, '');

tableBody.addEventListener('click', e => {
  Array.from(e.target.parentElement.parentElement.children).forEach(el => {
    el.classList.remove('active');
  });
  e.target.parentElement.classList.add('active');
});

const form = document.createElement('form');

const fieldsList = [
  {
    text: 'Name:', 'data-qa': 'name', element: 'input', type: 'text',
  }, {
    text: 'Position:', 'data-qa': 'position', element: 'input', type: 'text',
  }, {
    text: 'Office:', 'data-qa': 'office', element: 'select', type: 'text',
  }, {
    text: 'Age:', 'data-qa': 'age', element: 'input', type: 'number',
  }, {
    text: 'Salary:', 'data-qa': 'salary', element: 'input', type: 'number',
  },
];

for (let i = 0; i < fieldsList.length; i++) {
  const labelElement = document.createElement('label');
  const textNode = document.createTextNode(fieldsList[i].text);
  const inputElement = document.createElement(fieldsList[i].element);

  inputElement.name = fieldsList[i]['data-qa'];
  inputElement.setAttribute('type', fieldsList[i].type);
  inputElement.setAttribute('required', true);

  inputElement.dataset.qa = fieldsList[i]['data-qa'];

  labelElement.appendChild(textNode);
  labelElement.append(inputElement);
  form.append(labelElement);
}

form.classList.add('new-employee-form');
body.append(form);

const options = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];

const selectInput = document.querySelector('select');

for (let i = 0; i < options.length; i++) {
  const optionElement = document.createElement('option');
  const textNode = document.createTextNode(options[i]);

  optionElement.appendChild(textNode);
  selectInput.append(optionElement);
};

const button = document.createElement('button');

button.appendChild(document.createTextNode('Save to table'));
form.append(button);

const numberFormatCurrency = {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
};

button.addEventListener('click', e => {
  e.preventDefault();

  const nameValidation
    = textFieldValidation(form.children[0].firstElementChild.value, 4);
  const positionValidation
    = textFieldValidation(form.children[1].firstElementChild.value, 1);
  const ageCheck
    = ageValidation(form.children[3].firstElementChild.value, 18, 90);
  const salaryValidation
    = textFieldValidation(form.children[4].firstElementChild.value, 1);

  if (!nameValidation) {
    pushNotification(10, 10, 'Name error!',
      'Name field should have at least 4 characters');
  } else if (!positionValidation) {
    pushNotification(10, 10, 'Position error!',
      'Position field should not be empty');
  } else if (!ageCheck) {
    pushNotification(10, 10, 'Age error!',
      'Age should be between 18 and 90');
  } else if (!salaryValidation) {
    pushNotification(10, 10, 'Salary error!',
      'Salary field should not be empty');
  } else {
    const newRow = document.createElement('tr');

    for (let i = 0; i < form.children.length - 1; i++) {
      const newData = document.createElement('td');
      const elementValue = form.children[i].firstElementChild.value;

      if (i !== 4) {
        newData.innerText = elementValue;
      } else {
        newData.innerText = new Intl.NumberFormat('us-US', numberFormatCurrency)
          .format(elementValue);
      }
      newRow.append(newData);
    }

    tableBody.prepend(newRow);
    form.reset();

    pushNotification(10, 10, 'New record was added',
      'Success. All data was successfully added to DB.', 'success');
  }
});

const textFieldValidation = (str, min) => {
  return str.length >= min;
};

const ageValidation = (value, min, max) => {
  return +value >= min && +value <= max;
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.style.boxSizing = 'content-box';
  notification.classList.add(`notification`, type);
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  document.body.append(notification);

  setTimeout(() => (notification.remove()), 2000);
};

tableBody.addEventListener('dblclick', e => {
  const cellWidth = getComputedStyle(e.target).width;
  const currentCell = e.target;

  if (currentCell.nodeName === 'TD') {
    const input = document.createElement('input');
    const innerTextNode = currentCell.firstChild;

    input.classList.add('cell-input');
    input.value = innerTextNode.textContent;
    innerTextNode.remove();

    currentCell.append(input);
    input.focus();
    input.setAttribute('width', 20);
    input.style.width = cellWidth;

    input.addEventListener('blur', () => {
      const tempText = input.value || innerTextNode.textContent;

      innerTextNode.textContent = tempText;
      currentCell.append(innerTextNode);
      input.remove();
    });

    input.addEventListener('keydown', function ss(x) {
      if (['Enter', 'NumpadEnter'].includes(x.code)) {
        input.blur();
      }
    });
  }
});

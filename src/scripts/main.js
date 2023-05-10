'use strict';

const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');

let indexCol = null;
let orderASC = null;

tableHead.addEventListener('click', ev => {
  const index = ev.target.cellIndex;

  if (indexCol === ev.target.cellIndex) {
    orderASC = !orderASC;
  } else {
    indexCol = ev.target.cellIndex;
    orderASC = true;
  }

  sortRows(index, orderASC);
});

// sort table
function sortRows(indexColumn, order) {
  const bodyRows = Array.from(tableBody.querySelectorAll('tr'));

  bodyRows.sort((a, b) => {
    let aValue = a.querySelectorAll('td')[indexColumn].innerText;
    let bValue = b.querySelectorAll('td')[indexColumn].innerText;

    if (aValue.includes('$')) {
      aValue = aValue.slice(1).replace(',', '');
      bValue = bValue.slice(1).replace(',', '');

      return order ? aValue - bValue : bValue - aValue;
    }

    return order ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  tableBody.innerHTML = '';

  bodyRows.forEach(row => {
    tableBody.append(row);
  });
}

// selected row
tableBody.addEventListener('click', ev => {
  const rows = tableBody.querySelectorAll('tr');

  rows.forEach(row => {
    row.classList.remove('active');
  });
  ev.target.parentNode.classList.add('active');
});

// create form
const form = createForm();

function createForm() {
  const formEl = document.createElement('form');

  document.body.appendChild(formEl);
  formEl.classList.add('new-employee-form');

  const nameLabel = document.createElement('label');

  nameLabel.textContent = 'Name:';

  const nameInput = document.createElement('input');

  nameInput.type = 'text';
  nameInput.required = true;
  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('data-qa', 'name');
  nameLabel.appendChild(nameInput);
  formEl.appendChild(nameLabel);

  const positionLabel = document.createElement('label');

  positionLabel.textContent = 'Position:';

  const positionInput = document.createElement('input');

  positionInput.type = 'text';
  positionInput.required = true;
  positionInput.setAttribute('name', 'position');
  positionInput.setAttribute('data-qa', 'position');
  positionLabel.appendChild(positionInput);
  formEl.appendChild(positionLabel);

  const officeLabel = document.createElement('label');

  officeLabel.textContent = 'Office:';

  const officeSelect = document.createElement('select');

  officeSelect.required = true;
  officeSelect.setAttribute('name', 'office');
  officeSelect.setAttribute('data-qa', 'office');

  const officeOptions = ['Tokyo', 'Singapore', 'London',
    'New York', 'Edinburgh', 'San Francisco'];

  for (let i = 0; i < officeOptions.length; i++) {
    const option = document.createElement('option');

    option.value = officeOptions[i];
    option.text = officeOptions[i];
    officeSelect.appendChild(option);
  }

  officeLabel.appendChild(officeSelect);
  formEl.appendChild(officeLabel);

  const ageLabel = document.createElement('label');

  ageLabel.textContent = 'Age:';

  const ageInput = document.createElement('input');

  ageInput.type = 'number';
  ageInput.required = true;
  ageInput.setAttribute('name', 'age');
  ageInput.setAttribute('data-qa', 'age');
  ageLabel.appendChild(ageInput);
  formEl.appendChild(ageLabel);

  const salaryLabel = document.createElement('label');

  salaryLabel.textContent = 'Salary:';

  const salaryInput = document.createElement('input');

  salaryInput.type = 'number';
  salaryInput.required = true;
  salaryInput.setAttribute('name', 'salary');
  salaryInput.setAttribute('data-qa', 'salary');
  salaryLabel.appendChild(salaryInput);
  formEl.appendChild(salaryLabel);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  formEl.appendChild(submitButton);

  return formEl;
}

// sent form and create row
form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = new FormData(form);

  if (validationForm(ev.target)) {
    const formDataArray = [
      data.get('name'),
      data.get('position'),
      data.get('office'),
      data.get('age'),
      data.get('salary'),
    ];

    formDataArray[4] = parseInt(formDataArray[4]).toLocaleString('en-US', {
      style: 'currency', currency: 'USD',
    }).split('.')[0];

    const tr = document.createElement('tr');

    for (let i = 0; i < formDataArray.length; i++) {
      const td = document.createElement('td');

      td.innerText = formDataArray[i].trim();

      tr.append(td);
    }

    tableBody.append(tr);
    form.reset();

    pushNotification(0, 650, 'Success!',
      'New user added to the table.', 'success');
  };
});

// validation dataForm
function validationForm(formD) {
  const data = new FormData(formD);
  const minAge = 18;
  const maxAge = 90;
  const nameLength = 4;
  let valid = true;

  data.forEach(value => {
    if (value.trim() === '') {
      pushNotification(
        0, 250, 'Please fill field',
        'Field can\'t be empty', 'error'
      );
      valid = false;
    }
  });

  if (data.get('name').length < nameLength && valid) {
    pushNotification(
      0, 250,
      'Please, enter correct name', 'Name should be at least 4 symbols',
      'error'
    );
    valid = false;
  }

  if ((data.get('age') < minAge || data.get('age') > maxAge) && valid) {
    pushNotification(
      0, 250, 'Please, enter correct age',
      'Age should be more than 18 and less then 90', 'error'
    );
    valid = false;
  }

  if (data.get('salary') <= 0 && valid) {
    pushNotification(
      0, 250, 'Please, enter correct salary',
      'Salary should be more than 0', 'error'
    );
    valid = false;
  }

  return valid;
}

// notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const divElement = document.createElement('div');
  const h2Element = document.createElement('h2');
  const pElement = document.createElement('p');

  divElement.append(h2Element, pElement);
  divElement.style.top = `${posTop}px`;
  divElement.style.right = `${posRight}px`;
  divElement.classList.add('notification', type);
  divElement.setAttribute('data-qa', 'notification');

  document.body.append(divElement);

  h2Element.innerText = title;
  h2Element.classList.add('title');

  pElement.innerText = description;

  setTimeout(() => {
    divElement.remove();
  }, 3000);
};

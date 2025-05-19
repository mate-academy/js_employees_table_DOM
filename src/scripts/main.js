'use strict';

const newEmployeeForm = document.createElement('form');
const newEmployeeFormTemplate = [
  {
    label: 'Name: ',
    type: 'text',
    dataQa: 'name',
  },
  {
    label: 'Position: ',
    type: 'text',
    dataQa: 'position',
  },
  {
    label: 'Office: ',
    type: 'select',
    dataQa: 'office',
    options: [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ],
  },
  {
    label: 'Age: ',
    type: 'number',
    dataQa: 'age',
  },
  {
    label: 'Salary: ',
    type: 'number',
    dataQa: 'salary',
  },
  {
    label: 'Save to table',
    type: 'button',
    dataQa: '',
  },
];

const fragment = new DocumentFragment();

newEmployeeFormTemplate.forEach((element) => {
  let newElement;

  switch (element.type) {
    case 'number':
    case 'text':
      newElement = document.createElement('label');

      newElement.innerHTML = `${element.label}
<input
    name="${element.label.toLowerCase().trim().replace(/:/, '')}"
    data-qa="${element.dataQa}"
    type="${element.type}" />`;
      break;

    case 'select':
      newElement = document.createElement('label');

      const options = element.options.reduce((str, option) => {
        return str + `<option value="${option}">${option}</option>`;
      }, '');

      newElement.innerHTML = `${element.label}
<select
    name="${element.label.toLowerCase().trim().replace(/:/, '')}"
    data-qa="${element.dataQa}">${options}</select>`;
      break;

    case 'button':
      newElement = document.createElement('button');
      newElement.setAttribute('type', 'submit');
      newElement.innerText = element.label;
  }
  fragment.append(newElement);
});

newEmployeeForm.append(fragment);
newEmployeeForm.className = 'new-employee-form';

newEmployeeForm.addEventListener('submit', (newEmployeeEvent) => {
  newEmployeeEvent.preventDefault();

  const tableBody = document.querySelector('tbody');
  const nameInput = newEmployeeForm.name.value;
  const positionInput = newEmployeeForm.position.value;
  const officeInput = newEmployeeForm.office.value;
  const ageInput = isNaN(parseInt(newEmployeeForm.age.value))
    ? 0
    : parseInt(newEmployeeForm.age.value);
  let salaryInput = newEmployeeForm.salary.value;

  if (positionInput === '') {
    pushNotification(10, 10, 'Short name', 'The `Position` is wrong', 'error');

    return;
  }

  if (nameInput.length < 4) {
    pushNotification(
      10,
      10,
      'Short name',
      'The `Name` should be at least 4 letters',
      'error',
    );

    return;
  }

  if (ageInput < 18 || ageInput > 90) {
    pushNotification(
      10,
      10,
      'Wrong age',
      'The `Age` should be between 18 and 90',
      'error',
    );

    return;
  }

  if (isNaN(parseFloat(salaryInput))) {
    pushNotification(
      10,
      10,
      'Wrong salary',
      'The `Salary` should be valid float',
      'error',
    );

    return;
  }

  salaryInput = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
    maximumSignificantDigits: 3,
    minimumSignificantDigits: 1,
    roundingPriority: 'lessPrecision',
  }).format(salaryInput);

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameInput}</td>
    <td>${positionInput}</td>
    <td>${officeInput}</td>
    <td>${ageInput}</td>
    <td>${salaryInput}</td>`;
  tableBody.append(newRow);

  pushNotification(
    10,
    10,
    'Success',
    'New employee is successfully added to the table',
    'success',
  );

  newEmployeeForm.reset();
});
document.querySelector('body').append(newEmployeeForm);

document.querySelector('thead').addEventListener('click', (e) => {
  const tHead = e.currentTarget;
  const tBody = tHead.nextElementSibling;
  const columnIndex = [...tHead.querySelectorAll('th')].indexOf(e.target);
  const orderASC = e.target.toggleAttribute('data-asc');

  [...tBody.querySelectorAll('tr')]
    .map((row) => {
      let payload = row.querySelectorAll('td')[columnIndex].innerText;

      payload = payload.match(/[$]/g)
        ? parseFloat(payload.replace(/[.$]/g, '').replace(',', '.'))
        : payload;

      return {
        row: row,
        payload: payload,
      };
    })
    .sort((a, b) => {
      if (a.payload < b.payload) {
        return -1;
      }

      if (a.payload > b.payload) {
        return 1;
      }

      return 0;
    })
    .forEach((sortedRow) => {
      if (orderASC) {
        tBody.append(sortedRow.row);
      } else {
        tBody.prepend(sortedRow.row);
      }
    });
});

document.querySelector('tbody').addEventListener('click', (ev) => {
  ev.target.parentElement.className =
    ev.target.parentElement.className === 'active' ? '' : 'active';
});

document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const tdTarget = e.target;
  const tdText = tdTarget.innerHTML;
  const form = document.createElement('form');
  const input = document.createElement('input');

  tdTarget.style.position = 'relative';
  input.setAttribute('name', 'cellText');
  input.style.width = '100%';
  input.style.height = '100%';
  input.className = 'cell-input';
  input.value = tdText;

  form.style.position = 'absolute';
  form.style.left = '0';
  form.style.top = '0';
  form.style.width = '100%';
  form.style.height = '100%';
  form.append(input);

  form.addEventListener('submit', (eSubmit) => {
    tdTarget.innerHTML = eSubmit.currentTarget.cellText.value;
    tdTarget.style.position = null;
  });

  form.addEventListener('focusout', () => {
    tdTarget.innerHTML = tdText;
    tdTarget.style.position = null;
  });

  tdTarget.innerHTML = '';
  tdTarget.append(form);
  form.cellText.focus();
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.innerHTML = `
<h2 class="title">${title}</h2>
<p>${description}</p>`;

  document.querySelector('body').append(notification);
  setTimeout(() => (notification.style.display = 'none'), 2000);
};

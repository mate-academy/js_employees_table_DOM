'use strict';

const table = document.querySelector('table');
let form = null;
const pushNotification = (posTop, posRight, title, description, type) => {
  const container = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  container.classList.add('notification');
  container.setAttribute('data-qa', 'notification');

  if (['success', 'error', 'warning'].includes(type)) {
    container.classList.add(type);
  }
  container.style.top = `${posTop}px`;
  container.style.right = `${posRight}px`;

  titleMessage.textContent = title;
  titleMessage.classList.add('title');
  descriptionMessage.textContent = description;

  container.appendChild(titleMessage);
  container.appendChild(descriptionMessage);
  document.body.appendChild(container);

  setTimeout(() => {
    container.style.display = 'none';
  }, 2000);
};
const toNumber = (value) => {
  let cleaned = '';

  for (const char of value) {
    if ('0123456789'.includes(char)) {
      cleaned += char;
    }
  }

  if (cleaned === '') {
    return NaN;
  }

  return Number(cleaned);
};

const createEmployeeForm = () => {
  if (!table) {
    return null;
  }

  const formElement = document.createElement('form');

  formElement.classList.add('new-employee-form');
  formElement.noValidate = true;

  const createLabel = (text, control) => {
    const label = document.createElement('label');

    label.textContent = `${text} `;
    label.appendChild(control);

    return label;
  };

  const createInput = (fieldName, type, qa) => {
    const input = document.createElement('input');

    input.type = type;
    input.name = fieldName;
    input.required = true;
    input.setAttribute('data-qa', qa);

    return input;
  };

  const nameInput = createInput('name', 'text', 'name');
  const positionInput = createInput('position', 'text', 'position');
  const ageInput = createInput('age', 'number', 'age');
  const salaryInput = createInput('salary', 'number', 'salary');

  const officeSelect = document.createElement('select');

  officeSelect.name = 'office';
  officeSelect.required = true;
  officeSelect.setAttribute('data-qa', 'office');

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  offices.forEach((city, index) => {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;

    if (index === 0) {
      option.selected = true;
    }

    officeSelect.appendChild(option);
  });

  formElement.append(
    createLabel('Name:', nameInput),
    createLabel('Position:', positionInput),
    createLabel('Office:', officeSelect),
    createLabel('Age:', ageInput),
    createLabel('Salary:', salaryInput),
  );

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';

  formElement.appendChild(submitButton);

  table.after(formElement);

  return formElement;
};

form = createEmployeeForm();

if (table) {
  let sortedHeader = null;

  table.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (th) {
      const columnIndex = th.cellIndex;
      const tBodies = [...table.tBodies];

      if (!tBodies || tBodies.length === 0) {
        return;
      }

      if (sortedHeader && sortedHeader !== th) {
        delete sortedHeader.dataset.order;
      }

      let order = 'asc';

      if (sortedHeader === th) {
        order = th.dataset.order === 'asc' ? 'desc' : 'asc';
      }

      th.dataset.order = order;
      sortedHeader = th;

      const dir = order === 'asc' ? 1 : -1;

      tBodies.forEach((tBody) => {
        const rows = [...tBody.rows];

        rows.sort((rowA, rowB) => {
          const a = rowA.cells[columnIndex].textContent.trim();
          const b = rowB.cells[columnIndex].textContent.trim();

          const numberA = toNumber(a);
          const numberB = toNumber(b);

          let result;

          if (!isNaN(numberA) && !isNaN(numberB)) {
            result = numberA - numberB;
          } else {
            result = a.localeCompare(b, undefined, {
              numeric: true,
              sensitivity: 'base',
            });
          }

          return result * dir;
        });

        tBody.append(...rows);
      });
    }

    const row = e.target.closest('tbody tr');

    if (row) {
      const prev = table.querySelector('.active');

      if (prev) {
        prev.classList.remove('active');
      }
      row.classList.add('active');
    }
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.elements['name'];
    const positionInput = form.elements['position'];
    const officeSelect = form.elements['office'];
    const ageInput = form.elements['age'];
    const salaryInput = form.elements['salary'];

    nameInput.setCustomValidity('');
    positionInput.setCustomValidity('');
    ageInput.setCustomValidity('');
    salaryInput.setCustomValidity('');

    const nameValue = nameInput.value.trim();
    const positionValue = positionInput.value.trim();
    const ageRawValue = ageInput.value.trim();
    const salaryRawValue = salaryInput.value.trim();

    if (!nameValue) {
      nameInput.setCustomValidity('Name is required.');
      nameInput.reportValidity();

      pushNotification(24, 24, 'Invalid name', 'Name is required.', 'error');

      return;
    }

    if (!positionValue) {
      positionInput.setCustomValidity('Position is required.');
      positionInput.reportValidity();

      pushNotification(
        24,
        24,
        'Invalid position',
        'Position is required.',
        'error',
      );

      return;
    }

    if (!ageRawValue) {
      ageInput.setCustomValidity('Age is required.');
      ageInput.reportValidity();

      pushNotification(24, 24, 'Invalid age', 'Age is required.', 'error');

      return;
    }

    if (!salaryRawValue) {
      salaryInput.setCustomValidity('Salary is required.');
      salaryInput.reportValidity();

      pushNotification(
        24,
        24,
        'Invalid salary',
        'Salary is required.',
        'error',
      );

      return;
    }

    if (nameValue.length < 4) {
      nameInput.setCustomValidity('Name must be at least 4 characters long.');
      nameInput.reportValidity();

      pushNotification(
        24,
        24,
        'Invalid name',
        'Name must be at least 4 characters long.',
        'error',
      );

      return;
    }

    const ageValue = Number(ageRawValue);

    if (Number.isNaN(ageValue) || ageValue < 18 || ageValue > 90) {
      ageInput.setCustomValidity('Age must be between 18 and 90.');
      ageInput.reportValidity();

      pushNotification(
        24,
        24,
        'Invalid age',
        'Age must be between 18 and 90.',
        'error',
      );

      return;
    }

    const salaryNumber = Number(salaryRawValue);

    if (Number.isNaN(salaryNumber)) {
      salaryInput.setCustomValidity('Salary must be a number.');
      salaryInput.reportValidity();

      pushNotification(
        24,
        24,
        'Invalid salary',
        'Salary must be a number.',
        'error',
      );

      return;
    }

    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');

    nameTd.textContent = nameValue;
    tr.appendChild(nameTd);

    const positionTd = document.createElement('td');

    positionTd.textContent = positionValue;
    tr.appendChild(positionTd);

    const officeTd = document.createElement('td');

    officeTd.textContent = officeSelect.value;
    tr.appendChild(officeTd);

    const ageTd = document.createElement('td');

    ageTd.textContent = ageValue;
    tr.appendChild(ageTd);

    const salaryTd = document.createElement('td');

    salaryTd.textContent = `$${salaryNumber.toLocaleString('en-US')}`;
    tr.appendChild(salaryTd);

    const tBodies = [...table.tBodies];
    const tBody = tBodies[0];

    tBody.appendChild(tr);

    form.reset();

    pushNotification(
      24,
      24,
      'Employee added',
      'New employee has been added to the table.',
      'success',
    );
  });
}

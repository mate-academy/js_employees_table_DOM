'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

let sortedColumn = -1;

const filterStr = (str) => str.replace(/[^a-zA-Z0-9]/g, '');

thead.addEventListener('click', (e) => {
  const index = [...thead.children[0].children].indexOf(e.target);
  const tableRow = [...tbody.children];

  if (index === sortedColumn) {
    tableRow.reverse();
  } else {
    tableRow.sort((a, b) => {
      const valueA = a.children[index].textContent;
      const valueB = b.children[index].textContent;

      return isFinite(filterStr(valueA))
        ? filterStr(valueA) - filterStr(valueB)
        : valueA.localeCompare(valueB);
    });

    sortedColumn = index;
  }

  tbody.append(...tableRow);
});

tbody.addEventListener('click', e => {
  for (let i = 0; i < tbody.children.length; i++) {
    const element = tbody.children[i];

    element.classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

const newEmployeesForm = document.createElement('form');
const fields = [
  ['input', 'name', 'text'],
  ['input', 'position', 'text'],
  ['select', 'office', null],
  ['input', 'age', 'number'],
  ['input', 'salary', 'number'],
];
const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

newEmployeesForm.className = 'new-employee-form';
document.body.append(newEmployeesForm);

for (const [tag, field, type] of fields) {
  const newLabel = document.createElement('label');
  const newTag = document.createElement(tag);
  const labelName = field[0].toUpperCase() + field.slice(1);

  newLabel.textContent = labelName;
  newEmployeesForm.append(newLabel);
  newTag.name = field;

  if (type) {
    newTag.type = type;
  }

  newLabel.append(newTag);
}

for (const option of selectOptions) {
  newEmployeesForm.elements.office.insertAdjacentHTML('afterbegin', `
    <option>${option}</option>
  `);
}

newEmployeesForm.insertAdjacentHTML('beforeend', `
    <button type="submit">Save to table</button>
`);

const convertSalary = (number) => {
  return '$' + Number(number).toLocaleString(
    'en-US',
    {
      style: 'decimal',
    }
  );
};

const errorMassage = {
  'name': 'Name value has less than 4 letters',
  'position': 'Position value has less than 4 letters',
  'age': 'Age value is less than 18 or more than 90',
  'salary': 'Salary value must be more than 10,000',
};

function validateData(dataName, dataValue) {
  switch (dataName) {
    case 'name':
    case 'position':
      return dataValue.trim().length < 4;
    case 'age':
      return +dataValue < 18 || +dataValue > 90;
    case 'salary':
      return +dataValue < 10000;
  }
}

const pushNotification = (title, description, type) => {
  const notification = document.querySelector('.notification');

  if (notification) {
    notification.remove();
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);
};

newEmployeesForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(newEmployeesForm);

  for (const [ , fieldName, , ] of fields) {
    if (validateData(fieldName, data.get(fieldName))) {
      pushNotification(
        'Input error',
        errorMassage[fieldName],
        'error'
      );

      return;
    }
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>${convertSalary(data.get('salary'))}</td>
    </tr>`
  );

  pushNotification(
    'Success',
    'A new employee has been added',
    'success'
  );
});

tbody.addEventListener('dblclick', e => {
  const element = e.target;
  const indexInputElement
    = [...element.closest('tr').children].indexOf(element.closest('td'));
  const fieldType = fields[indexInputElement][2];
  const fieldName = fields[indexInputElement][1];
  const saveText = element.closest('td').textContent;

  e.target.closest('td').textContent = '';

  if (fieldName === 'office') {
    const cellSelect = document.createElement('select');

    cellSelect.className = 'cell-input';
    cellSelect.setAttribute('name', fieldName);
    e.target.closest('td').append(cellSelect);
    cellSelect.focus();

    for (const option of selectOptions) {
      const selectedOption = saveText === option ? 'selected' : null;

      cellSelect.insertAdjacentHTML('afterbegin', `
        <option ${selectedOption}>${option}</option>
      `);
    }

    cellSelect.addEventListener('change', () => {
      cellSelect.blur();
      e.target.closest('td').textContent = cellSelect.value;
    });

    cellSelect.addEventListener('blur', () => {
      e.target.closest('td').textContent = cellSelect.value;
    });

    return;
  }

  const cellInput = document.createElement('input');

  cellInput.className = 'cell-input';
  cellInput.setAttribute('type', fieldType);
  cellInput.setAttribute('name', fieldName);
  e.target.closest('td').append(cellInput);
  cellInput.focus();

  cellInput.addEventListener('keypress', enter => {
    if (enter.key === 'Enter') {
      cellInput.blur();
    }
  });

  cellInput.addEventListener('blur', () => {
    if (validateData(fieldName, cellInput.value)) {
      e.target.closest('td').textContent = saveText;

      pushNotification(
        'Input error',
        errorMassage[fieldName],
        'error'
      );
    } else {
      if (fieldName === 'salary') {
        e.target.closest('td').textContent = convertSalary(cellInput.value);

        return;
      }

      e.target.closest('td').textContent = cellInput.value;
    }
  });
});

'use strict';

const tableHeaders = document.querySelectorAll('th');
const tableBodyRows = document.querySelectorAll('tbody tr');
const currentSort = { index: null, asc: true };

tableHeaders.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (index === currentSort.index) {
      currentSort.asc = !currentSort.asc;
    } else {
      currentSort.index = index;
      currentSort.asc = true;
    }

    const sortedRows = [...tableBodyRows].sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));

      if (currentSort.asc) {
        return isNaN(numA) || isNaN(numB)
          ? cellA.localeCompare(cellB)
          : numA - numB;
      } else {
        return isNaN(numA) || isNaN(numB)
          ? cellB.localeCompare(cellA)
          : numB - numA;
      }
    });

    document.querySelector('tbody').append(...sortedRows);
  });
});

tableBodyRows.forEach((row) => {
  row.addEventListener('click', () => {
    tableBodyRows.forEach((r) => {
      r.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Age',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = `${field.label}: `;

  const input = document.createElement('input');

  input.name = field.name;
  input.type = field.type;
  input.setAttribute('data-qa', field.qa);
  input.setAttribute('required', '');
  label.appendChild(input);
  form.appendChild(label);
});

const labelOff = document.createElement('label');

labelOff.textContent = `Office: `;

const select = document.createElement('select');

const officeOptions = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

officeOptions.forEach((office) => {
  const option = document.createElement('option');

  option.setAttribute('value', office);
  option.textContent = `${office}`;
  select.appendChild(option);
});

select.setAttribute('data-qa', 'office');
select.setAttribute('required', '');
labelOff.appendChild(select);
form.appendChild(labelOff);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';
button.classList.add('button');

form.appendChild(button);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.querySelector('[data-qa="name"]');
  const nameValue = nameInput.value;

  const positionInput = document.querySelector('[data-qa="position"]');
  const positionValue = positionInput.value;

  const officeInput = document.querySelector('[data-qa="office"]');
  const officeValue = officeInput.value;

  const ageInput = document.querySelector('[data-qa="age"]');
  const ageValue = ageInput.value;

  const salaryInput = document.querySelector('[data-qa="salary"]');
  const salaryValue = salaryInput.value;

  const notification = document.createElement('div');

  if (
    nameValue.length < 4 ||
    ageValue < 18 ||
    ageValue > 90 ||
    isNaN(Number(salaryValue))
  ) {
    notification.classList.add('notification', 'error');
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = 'Incorrect data';

    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  } else {
    const addRow = document.createElement('tr');
    const arrayWithNewData = [
      nameValue,
      positionValue,
      officeValue,
      ageValue,
      salaryValue,
    ];

    for (let i = 0; i < arrayWithNewData.length; i++) {
      const td = document.createElement('td');

      td.textContent = arrayWithNewData[i];
      addRow.appendChild(td);
    }
    document.querySelector('tbody').appendChild(addRow);

    notification.classList.add('notification', 'success');
    notification.setAttribute('data-qa', 'notification');

    notification.textContent =
      'New employee is successfully added to the table';

    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }
});

tableBodyRows.forEach((row) => {
  const cells = row.querySelectorAll('td');

  cells.forEach((cell) => {
    let input;
    let originalText;

    cell.addEventListener('dblclick', (e) => {
      if (document.querySelector('.cell-input')) {
        return;
      }

      originalText = e.currentTarget.textContent;
      input = document.createElement('input');
      input.classList.add('cell-input');
      input.value = originalText;

      cell.textContent = '';
      cell.appendChild(input);
      input.focus();

      const save = () => {
        const newValue = input.value.trim();

        cell.textContent = newValue === '' ? originalText : newValue;
      };

      input.addEventListener('blur', save);

      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          save();
        }
      });
    });
  });
});

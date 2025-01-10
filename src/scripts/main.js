'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

let sortOrder = 'asc';

const sortTable = (e) => {
  const target = e.target;

  if (target.tagName === 'TH') {
    const columnName = target.textContent;

    const columnIndices = {
      Name: 0,
      Position: 1,
      Office: 2,
      Age: 3,
      Salary: 4,
    };
    const columnIndex = columnIndices[columnName];

    const rows = [...tbody.querySelectorAll('tr')];

    const sortedRows = rows.sort((a, b) => {
      const aText = a.cells[columnIndex].textContent;
      const bText = b.cells[columnIndex].textContent;

      if (columnName === 'Salary') {
        const aNum = Number(aText.replace(/[$,]/g, ''));
        const bNum = Number(bText.replace(/[$,]/g, ''));

        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      if (columnName === 'Age') {
        return sortOrder === 'asc'
          ? Number(aText) - Number(bText)
          : Number(bText) - Number(aText);
      }

      return sortOrder === 'asc'
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });

    tbody.append(...sortedRows);

    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  }
};

table.addEventListener('click', sortTable);

const handleRowClick = (e) => {
  const clickedRow = e.target.closest('tr');

  if (clickedRow && e.target.tagName !== 'TH') {
    const isActive = clickedRow.classList.contains('active');

    tbody.querySelectorAll('tr').forEach((row) => {
      row.classList.remove('active');
    });

    if (!isActive) {
      clickedRow.classList.add('active');
    }
  }
};

table.addEventListener('click', sortTable);
table.addEventListener('click', handleRowClick);

const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name:',
    type: 'text',
    name: 'name',
    qa: 'name',
  },
  {
    label: 'Position:',
    type: 'text',
    name: 'position',
    qa: 'position',
  },
  {
    label: 'Office:',
    type: 'select',
    name: 'office',
    qa: 'office',
  },
  {
    label: 'Age:',
    type: 'number',
    name: 'age',
    qa: 'age',
  },
  {
    label: 'Salary:',
    type: 'number',
    name: 'salary',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  if (field.type === 'select') {
    const select = document.createElement('select');

    select.name = field.name;
    select.dataset.qa = field.qa;
    select.required = true;

    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.value = office;
      option.textContent = office;
      select.append(option);
    });

    label.append(select);
  } else {
    const input = document.createElement('input');

    input.type = field.type;
    input.name = field.name;
    input.dataset.qa = field.qa;
    input.required = true;

    label.append(input);
  }

  form.append(label);
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
button.dataset.qa = 'add-employee';
form.append(button);

table.after(form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const nodeNotification = document.createElement('div');

  nodeNotification.classList.add('notification');
  nodeNotification.classList.add(type);
  nodeNotification.setAttribute('data-qa', 'notification');

  const nodeTitleOfNotification = document.createElement('h2');

  nodeTitleOfNotification.classList.add('title');
  nodeTitleOfNotification.textContent = title;

  const nodeDescriptionOfNotification = document.createElement('p');

  nodeDescriptionOfNotification.innerText = description;

  nodeNotification.style.top = `${posTop}px`;
  nodeNotification.style.right = `${posRight}px`;

  form.after(nodeNotification);
  nodeNotification.append(nodeTitleOfNotification);
  nodeNotification.append(nodeDescriptionOfNotification);

  setTimeout(() => {
    nodeNotification.remove();
  }, 2000);
};

const addNewEmployee = (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const formName = formData.get('name');
  const formAge = formData.get('age');

  if (formName.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Name must be at least 4 characters long.',
      'error',
    );

    return;
  }

  if (formAge < 18 || formAge > 90) {
    pushNotification(
      10,
      10,
      'Error',
      'Age must be between 18 and 90.',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');

  fields.forEach((field) => {
    const newCell = document.createElement('td');
    let fieldValue = formData.get(field.name);

    if (field.name === 'salary') {
      const salaryNumber = Number(fieldValue);

      fieldValue = `$${salaryNumber.toLocaleString('en-US')}`;
    }

    newCell.textContent = fieldValue;
    newRow.append(newCell);
  });

  tbody.append(newRow);
  form.reset();

  pushNotification(
    10,
    10,
    'Success',
    'New employee successfully added to the table.',
    'success',
  );
};

form.addEventListener('submit', addNewEmployee);

let currentlyEditingCell = null;

const handleDoubleClick = (e) => {
  const clickedCell = e.target;

  if (clickedCell.tagName === 'TD' && clickedCell !== currentlyEditingCell) {
    if (currentlyEditingCell) {
      saveChanges(currentlyEditingCell);
    }

    const originalText = clickedCell.textContent;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = originalText;
    input.classList.add('cell-input');

    clickedCell.textContent = '';
    clickedCell.appendChild(input);

    currentlyEditingCell = clickedCell;

    input.focus();

    input.addEventListener('blur', handleBlur(input, clickedCell));
    input.addEventListener('keydown', handleKeyDown(input, clickedCell));
  }
};

const handleBlur = (input, cell) => () => {
  saveChanges(cell, input);
};

const handleKeyDown = (input, cell) => (e) => {
  if (e.key === 'Enter') {
    saveChanges(cell, input);
  }
};

const saveChanges = (cell, input) => {
  const updatedValue = input.value.trim();

  if (updatedValue === '') {
    cell.textContent = input.defaultValue;
  } else {
    cell.textContent = updatedValue;
  }

  currentlyEditingCell = null;
};

tbody.addEventListener('dblclick', handleDoubleClick);

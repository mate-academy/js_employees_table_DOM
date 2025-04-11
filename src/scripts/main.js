'use strict';

const table = document.querySelector('table');
const districtSort = {};

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const th = e.target;
    const index = Array.from(th.parentNode.children).indexOf(th);

    for (const key in districtSort) {
      if (parseInt(key) !== index) {
        districtSort[key] = 'asc';
      }
    }

    if (!districtSort[index]) {
      districtSort[index] = 'asc';
    }

    tableSort(index, districtSort[index]);

    districtSort[index] = districtSort[index] === 'asc' ? 'desc' : 'asc';
  } else if (e.target.tagName === 'TD') {
    const row = e.target.parentNode;

    select(row);
  }
});

function tableSort(index, district) {
  const tbody = document.querySelector('tbody');
  const newAr = Array.from(tbody.querySelectorAll('tr'));

  newAr.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent.trim();
    const cellB = rowB.cells[index].textContent.trim();

    if (index === 3 || index === 4) {
      return district === 'asc'
        ? Number(cellA.replace(/[$,]/g, '')) -
            Number(cellB.replace(/[$,]/g, ''))
        : Number(cellB.replace(/[$,]/g, '')) -
            Number(cellA.replace(/[$,]/g, ''));
    }

    return district === 'asc'
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  newAr.forEach((row) => tbody.append(row));
}

function select(row) {
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((cs) => cs.classList.remove('active'));

  row.classList.add('active');
}

/* const form = document.createElement('form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
  `;

document.body.appendChild(form); */

function createForm() {
  let container = document.querySelector('#form-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'form-container';
    document.body.appendChild(container);
  }

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const createField = (
    labelText,
    inputType,
    inputName,
    inputAttribute,
    required = true,
  ) => {
    const label = document.createElement('label');

    label.className = 'label';
    label.textContent = labelText;

    const input = document.createElement('input');

    input.type = inputType;
    input.name = inputName;
    input.className = 'input';
    input.setAttribute('data-qa', inputAttribute);
    input.required = required;

    label.appendChild(input);

    return label;
  };

  const labelSelect = document.createElement('label');

  labelSelect.className = 'label';
  labelSelect.textContent = 'Office:';

  const selInput = document.createElement('select');

  selInput.className = 'select';
  selInput.setAttribute('data-qa', 'office');
  selInput.setAttribute('name', 'office');
  selInput.required = true;

  const options = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  options.forEach((text) => {
    const option = document.createElement('option');

    option.value = text;
    option.textContent = text;
    selInput.appendChild(option);
  });

  labelSelect.appendChild(selInput);

  const button = document.createElement('button');

  button.type = 'submit';
  button.className = 'button';
  button.textContent = 'Save to table';
  button.setAttribute('data-qa', 'save-to-table');

  form.appendChild(createField('Name:', 'text', 'name', 'name'));

  form.appendChild(
    createField('Position:', 'text', 'position', 'position', false),
  );
  form.appendChild(labelSelect);
  form.appendChild(createField('Age:', 'number', 'age', 'age'));
  form.appendChild(createField('Salary:', 'number', 'salary', 'salary'));
  form.appendChild(button);

  container.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    function notificationDisplay(message, type) {
      let notification = document.querySelector('#notification');

      if (!notification) {
        notification = document.createElement('div');
        notification.setAttribute('data-qa', 'notification');
        document.body.appendChild(notification);
      }

      notification.className = type;
      notification.textContent = message;

      setTimeout(() => {
        notification.textContent = '';
        notification.className = '';
      }, 3000);
    }

    const nameTable = form.querySelector('[name="name"]').value;
    const position = form.querySelector('[name="position"]').value;
    const officeElement = form.querySelector('[name="office"]');
    const office = officeElement ? officeElement.value : null;

    if (!office) {
      notificationDisplay('office is empty', 'error');

      return;
    }

    const age = parseInt(form.querySelector('[name="age"]').value, 10);
    const salary = parseInt(form.querySelector('[name="salary"]').value, 10);
    const formatSalary = `$${salary.toLocaleString('en-Us')}`;

    if (nameTable.length < 4 || position.length < 4) {
      notificationDisplay('Error! At least 4 characters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      notificationDisplay('Error! Age must be between 18 and 90', 'error');

      return;
    }

    const tbody = document.querySelector('tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${nameTable}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formatSalary}</td>
    `;

    tbody.appendChild(newRow);

    notificationDisplay('Success! Employee added.', 'success');
    form.reset(); // clear form
  });
}

createForm();

table.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const cell = e.target;

    if (document.querySelector('.cell-input')) {
      return;
    }

    const initialText = cell.textContent.trim();

    cell.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';

    input.value = initialText;
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      saveCellChanges(cell, input, initialText);
    });

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        saveCellChanges(cell, input, initialText);
      }
    });
  }
});

function saveCellChanges(cell, input, initialText) {
  const newText = input.value.trim();

  cell.textContent = newText === '' ? initialText : newText;
  input.remove();
}

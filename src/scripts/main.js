'use strict';

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');

let currentIndex = null;
let direction = 'asc';

function sortTable() {
  table.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (th) {
      const index = th.cellIndex;

      if (currentIndex === index) {
        direction = direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentIndex = index;
        direction = 'asc';
      }

      const rows = [...tBody.querySelectorAll('tr')];

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[index];
        const cellB = rowB.children[index];
        const valA = cellA.textContent;
        const valB = cellB.textContent;
        const cleanA = valA.replace(/[^0-9]/g, '');
        const cleanB = valB.replace(/[^0-9]/g, '');
        const numA = Number(cleanA);
        const numB = Number(cleanB);

        if (cleanA !== '' && cleanB !== '') {
          return direction === 'asc' ? numA - numB : numB - numA;
        } else {
          return direction === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
      });
      tBody.append(...rows);

      return;
    }

    function selectRow() {
      const row = e.target.closest('tr');

      if (!row) {
        return;
      }

      if (!tBody.contains(row)) {
        return;
      }

      const rows = [...tBody.querySelectorAll('tr')];

      rows.forEach((r) => {
        r.classList.remove('active');
      });
      row.classList.add('active');
    }
    selectRow();
  });
}
sortTable();

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.setAttribute('novalidate', true);
  table.after(form);

  const label = document.createElement('label');

  label.textContent = 'Name: ';

  const input = document.createElement('input');

  input.name = 'name';
  input.type = 'text';
  input.dataset.qa = 'name';
  input.required = true;

  label.append(input);
  form.append(label);

  const labelPosition = document.createElement('label');

  labelPosition.textContent = 'Position: ';

  const inputPosition = document.createElement('input');

  inputPosition.name = 'position';
  inputPosition.type = 'text';
  inputPosition.dataset.qa = 'position';
  inputPosition.required = true;

  labelPosition.append(inputPosition);
  form.append(labelPosition);

  const labelSelect = document.createElement('label');

  labelSelect.textContent = 'Office: ';

  const inputSelect = document.createElement('select');

  inputSelect.name = 'office';
  inputSelect.dataset.qa = 'office';
  inputSelect.required = true;

  // eslint-disable-next-line
  const cities = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

  for (const city of cities) {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;

    inputSelect.append(option);
  }

  labelSelect.append(inputSelect);
  form.append(labelSelect);

  const labelAge = document.createElement('label');

  labelAge.textContent = 'Age: ';

  const inputAge = document.createElement('input');

  inputAge.name = 'age';
  inputAge.type = 'number';
  inputAge.dataset.qa = 'age';
  inputAge.required = true;

  labelAge.append(inputAge);
  form.append(labelAge);

  const labelSalary = document.createElement('label');

  labelSalary.textContent = 'Salary: ';

  const inputSalary = document.createElement('input');

  inputSalary.name = 'salary';
  inputSalary.type = 'number';
  inputSalary.dataset.qa = 'salary';
  inputSalary.required = true;

  labelSalary.append(inputSalary);
  form.append(labelSalary);

  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to table';

  form.append(button);

  form.addEventListener('submit', handleSubmit);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const employeeName = formData.get('name');
    const position = formData.get('position');
    const office = formData.get('office');
    const age = formData.get('age');
    const salary = formData.get('salary');
    const numAge = Number(age);

    if (
      employeeName === '' ||
      position === '' ||
      office === '' ||
      age === '' ||
      salary === ''
    ) {
      showNotification('error', 'all fields must be filled in');

      return;
    }

    if (employeeName.length < 4) {
      showNotification('error', 'Name is too short');

      return;
    }

    if (numAge < 18 || numAge > 90) {
      showNotification('error', 'Age is too low');

      return;
    }

    const tr = document.createElement('tr');
    const nameData = document.createElement('td');
    const positionData = document.createElement('td');
    const officeData = document.createElement('td');
    const ageData = document.createElement('td');
    const salaryData = document.createElement('td');

    nameData.append(employeeName);
    positionData.append(position);
    officeData.append(office);
    ageData.append(numAge);
    salaryData.append(`$${Number(salary).toLocaleString('en-US')}`);

    tr.append(nameData);
    tr.append(positionData);
    tr.append(officeData);
    tr.append(ageData);
    tr.append(salaryData);
    tBody.append(tr);

    form.reset();

    const rows = [...tBody.querySelectorAll('tr')];

    rows.forEach((r) => {
      r.classList.remove('active');
    });
    showNotification('success', 'Employee added');
  }
}
createForm();

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add(type, 'notification');

  const titleElement = document.createElement('div');

  titleElement.textContent = type;
  titleElement.classList.add('title');

  const messageElement = document.createElement('div');

  messageElement.textContent = message;
  notification.append(titleElement, messageElement);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

table.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');
  const existingInput = document.querySelector('.cell-input');

  if (existingInput) {
    const oldCell = existingInput.closest('td');

    if (oldCell === cell) {
      return;
    }

    oldCell.textContent = existingInput.value || oldCell.textContent;
  }

  if (!cell) {
    return;
  }

  const oldValue = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = oldValue;

  cell.append(input);
  input.focus();

  function save() {
    if (input.value === '') {
      cell.textContent = oldValue;
    } else {
      cell.textContent = input.value;
    }
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      save();
    }
  });
});

'use strict';

const body = document.querySelector('tbody');
const header = document.querySelector('thead');
const asc = [true, true, true, true, true];
let lastIndex = -1;

body.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row) {
    Array.from(body.rows).forEach((el) => {
      el.classList.remove('active');
    });

    row.classList.add('active');
  }
});

header.addEventListener('click', (e) => {
  const cell = e.target.closest('th');

  if (cell) {
    const index = cell.cellIndex;

    if (lastIndex !== index) {
      asc[index] = true;
      lastIndex = index;
    } else {
      asc[index] = !asc[index];
    }

    sortRows(index);
  }
});

function sortRows(index) {
  const rows = Array.from(body.rows);
  const dir = asc[index] === true ? 1 : -1;

  rows.sort((a, b) => {
    const cellA = a.cells[index].textContent.trim();
    const cellB = b.cells[index].textContent.trim();

    const cleanA = cellA.replace(/[^0-9.-]/g, '');
    const cleanB = cellB.replace(/[^0-9.-]/g, '');

    if (cleanA !== '' && cleanB !== '' && !isNaN(cleanA) && !isNaN(cleanB)) {
      return (Number(cleanA) - Number(cleanB)) * dir;
    }

    return cellA.localeCompare(cellB) * dir;
  });

  body.append(...rows);
}

function createForm() {
  const formNew = document.createElement('form');

  formNew.className = 'new-employee-form';

  const fields = [
    { label: 'Name', Name: 'name', type: 'text' },
    { label: 'Position', Name: 'position', type: 'text' },
    { label: 'Age', Name: 'age', type: 'number' },
    { label: 'Salary', Name: 'salary', type: 'number' },
  ];

  fields.forEach((el) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.textContent = el.label + ': ';
    input.name = el.Name;
    input.type = el.type;
    input.dataset.qa = el.Name;
    label.append(input);
    formNew.append(label);
  });

  const office = document.createElement('label');
  const select = document.createElement('select');

  office.textContent = 'Office: ';
  select.name = 'office';
  select.dataset.qa = 'office';

  [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ].forEach((city) => {
    const opt = new Option(city, city);

    select.add(opt);
  });

  office.append(select);
  formNew.append(office);

  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to table';
  formNew.append(button);
  document.body.append(formNew);

  return formNew;
}

const form = createForm();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const Name = data.get('name');
  const position = data.get('position');
  const ageRaw = Number(data.get('age'));
  const salaryRaw = data.get('salary');

  if (Name.length < 4) {
    showNotify('Name is too short', 'error');

    return;
  }

  if (position.length < 4) {
    showNotify('Position is too short or required', 'error');

    return;
  }

  const Age = Number(ageRaw);

  if (ageRaw === '' || Age < 18 || Age > 90) {
    showNotify('Age must be between 18 and 90', 'error');

    return;
  }

  if (salaryRaw === '') {
    showNotify('Salary is required', 'error');

    return;
  }

  const formattedSalary = '$' + Number(salaryRaw).toLocaleString('en-US');

  addEmployee(Name, position, data.get('office'), Age, formattedSalary);

  showNotify('Employee added', 'success');
  form.reset();
});

function addEmployee(Name, position, office, age, salary) {
  const newRow = body.insertRow();
  const employeeData = [Name, position, office, age, salary];

  employeeData.forEach((text) => {
    const newCell = newRow.insertCell();

    newCell.textContent = text;
  });
}

function showNotify(msg, type) {
  const notify = document.createElement('div');

  notify.className = `notification ${type}`;
  notify.dataset.qa = 'notification';
  notify.textContent = msg;
  document.body.append(notify);

  setTimeout(() => {
    notify.remove();
  }, 3000);
}

body.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || cell.querySelector('.cell-input')) {
    return;
  }

  const oldText = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldText;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  const save = () => {
    const val = input.value.trim();

    cell.textContent = val || oldText;
  };

  input.onblur = save;

  input.onkeydown = (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  };
});

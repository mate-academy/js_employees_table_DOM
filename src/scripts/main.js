const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const thList = thead.querySelectorAll('th');

let currentSortColumn = null;
let currentSortDirection = 'asc';

thead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const columnIndex = Array.from(thList).indexOf(e.target);
  const rows = Array.from(tbody.querySelectorAll('tr'));

  if (currentSortColumn === columnIndex) {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortColumn = columnIndex;
    currentSortDirection = 'asc';
  }

  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();

    const aNum = parseFloat(aText.replace(/[$,]/g, ''));
    const bNum = parseFloat(bText.replace(/[$,]/g, ''));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return currentSortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    }

    return currentSortDirection === 'asc'
      ? aText.localeCompare(bText)
      : bText.localeCompare(aText);
  });

  tbody.append(...rows);
});

let activeRow = null;

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
  activeRow = row;
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const labelName = document.createElement('label');

labelName.textContent = 'Name: ';

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
labelName.appendChild(inputName);
form.appendChild(labelName);

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position: ';

const inputPosition = document.createElement('input');

inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');
labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office: ';

const selectOffice = document.createElement('select');

selectOffice.name = 'office';
selectOffice.setAttribute('data-qa', 'office');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  selectOffice.appendChild(option);
});

labelOffice.appendChild(selectOffice);
form.appendChild(labelOffice);

const labelAge = document.createElement('label');

labelAge.textContent = 'Age: ';

const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');
labelAge.appendChild(inputAge);
form.appendChild(labelAge);

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary: ';

const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
labelSalary.appendChild(inputSalary);
form.appendChild(labelSalary);

const saveButton = document.createElement('button');

saveButton.type = 'submit';
saveButton.textContent = 'Save to table';
form.appendChild(saveButton);

table.insertAdjacentElement('afterend', form);

function showNotification(type, title, description) {
  const notif = document.createElement('div');

  notif.classList.add('notification', type);
  notif.setAttribute('data-qa', 'notification');

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  notif.appendChild(h2);
  notif.appendChild(p);

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 2000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const namei = inputName.value.trim();
  const position = inputPosition.value.trim();
  const office = selectOffice.value;
  const age = Number(inputAge.value);
  const salaryNumber = Number(inputSalary.value);

  if (!namei || !position || !office || !inputAge.value || !inputSalary.value) {
    showNotification('error', 'Error', 'All fields are required!');

    return;
  }

  if (namei.length < 4) {
    showNotification('error', 'Error', 'Name must be at least 4 letters');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Error', 'Age must be 18 - 90');

    return;
  }

  if (salaryNumber <= 0) {
    showNotification('error', 'Error', 'Salary must be a positive number');

    return;
  }

  const tr = document.createElement('tr');

  const tdName = document.createElement('td');

  tdName.textContent = namei;

  const tdPosition = document.createElement('td');

  tdPosition.textContent = position;

  const tdOffice = document.createElement('td');

  tdOffice.textContent = office;

  const tdAge = document.createElement('td');

  tdAge.textContent = age;

  const tdSalary = document.createElement('td');

  tdSalary.textContent = '$' + salaryNumber.toLocaleString();

  tr.append(tdName, tdPosition, tdOffice, tdAge, tdSalary);
  tbody.appendChild(tr);

  showNotification('success', 'Success', 'New employee added!');
  form.reset();
});

let editingCell = null;
let originalValue = '';

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (editingCell) {
    return;
  }

  editingCell = cell;
  originalValue = cell.textContent.trim();

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalValue;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('keydown', (i) => {
    if (i.key === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', () => {
    let newValue = input.value.trim();

    if (newValue === '') {
      newValue = originalValue;
    }

    if (editingCell.cellIndex === 4) {
      const num = Number(newValue.replace(/[$,]/g, ''));

      newValue = '$' + num.toLocaleString();
    }

    editingCell.textContent = newValue;
    editingCell = null;
    originalValue = '';
  });
});

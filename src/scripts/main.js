'use strict';

const form = document.createElement('form');

form.className = 'new-employee-form';

const inputsData = [
  {
    label: 'Name: ',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position: ',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Age: ',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary: ',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

inputsData.forEach((data) => {
  const label = document.createElement('label');

  label.textContent = data.label;

  const input = document.createElement('input');

  input.name = data.name;
  input.type = data.type;
  input.setAttribute('data-qa', data.qa);

  label.append(input);
  form.append(label);
});

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office: ';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', 'office');

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
  select.append(option);
});

selectLabel.append(select);
form.append(selectLabel);

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.append(submitBtn);

document.body.append(form);

function showNotification(message, type) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.textContent = message;
  notification.className = type;
  notification.setAttribute('data-qa', 'notification');

  document.body.append(notification);

  setTimeout(() => notification.remove(), 3000);
}

const tbody = document.querySelector('tbody');

function addEmployeeToTable(data) {
  const row = document.createElement('tr');

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(data.salary);

  row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.append(row);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employeeName = formData.get('name').trim();
  const position = (formData.get('position') || '').toString().trim();
  const age = Number(formData.get('age'));

  if (!position) {
    showNotification('Position is required!', 'error');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 characters long!', 'error');

    return;
  }

  if (position.length === 0) {
    showNotification('Position is required!', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90!', 'error');

    return;
  }

  addEmployeeToTable({
    name: employeeName,
    position,
    office: formData.get('office'),
    age,
    salary: Number(formData.get('salary')),
  });

  showNotification('Employee added successfully!', 'success');

  form.reset();
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return '';
  }

  const currentActive = tbody.querySelector('.active');

  if (currentActive) {
    currentActive.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

let lastIndex = -1;
let isDesc = false;

const thead = document.querySelector('thead');

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return '';
  }

  const index = th.cellIndex;
  const rowsArray = Array.from(tbody.rows);

  if (lastIndex === index) {
    isDesc = !isDesc;
  } else {
    isDesc = false;
    lastIndex = index;
  }

  rowsArray.sort((rowA, rowB) => {
    const contentA = rowA.cells[index].textContent.trim();
    const contentB = rowB.cells[index].textContent.trim();

    const cleanA = contentA.replace(/[^0-9.-]+/g, '');
    const cleanB = contentB.replace(/[^0-9.-]+/g, '');

    const isNumber =
      cleanA !== '' && !isNaN(cleanA) && cleanB !== '' && !isNaN(cleanB);

    let result;

    if (isNumber) {
      result = Number(cleanA) - Number(cleanB);
    } else {
      result = contentA.localeCompare(contentB);
    }

    return isDesc ? -result : result;
  });

  tbody.append(...rowsArray);
});

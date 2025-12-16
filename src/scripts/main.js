'use strict';

const tbody = document.querySelector('tbody');
const heads = document.querySelectorAll('thead th');

let currentColumn = null;
let isAscending = true;

heads.forEach((th, index) => {
  th.addEventListener('click', () => {
    if (index === currentColumn) {
      isAscending = !isAscending;
    } else {
      currentColumn = index;
      isAscending = true;
    }

    sortByColumn(index, isAscending);
  });
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

  clickedRow.classList.add('active');
});

const form = document.createElement('form');
const nameInput = document.createElement('input');

nameInput.type = 'text';
nameInput.name = 'name';
nameInput.placeholder = 'Name';
nameInput.setAttribute('data-qa', 'name');
form.appendChild(nameInput);

const positionInput = document.createElement('input');

positionInput.type = 'text';
positionInput.name = 'position';
positionInput.placeholder = 'Position';
positionInput.setAttribute('data-qa', 'position');
form.appendChild(positionInput);

const officeInput = document.createElement('select');

officeInput.name = 'office';
officeInput.setAttribute('data-qa', 'office');
form.appendChild(officeInput);

const offices = ['', 'San Francisco', 'London', 'Tokyo', 'New York'];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office || 'Select office';
  officeInput.appendChild(option);
});

const ageInput = document.createElement('input');

ageInput.type = 'number';
ageInput.name = 'age';
ageInput.placeholder = 'Age';
ageInput.setAttribute('data-qa', 'age');
form.appendChild(ageInput);

const salaryInput = document.createElement('input');

salaryInput.type = 'number';
salaryInput.name = 'salary';
salaryInput.placeholder = 'Salary';
salaryInput.setAttribute('data-qa', 'salary');
form.appendChild(salaryInput);

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
submitBtn.setAttribute('data-qa', 'save');
form.appendChild(submitBtn);

document.body.appendChild(form);

function formatSalary(value) {
  return `$${Number(value).toLocaleString('en-US')}`;
}

function sortByColumn(columnIndex, ascending) {
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const prepared = rows.map((row) => {
    const cellText = row.children[columnIndex].textContent.trim();
    const num = parseFloat(cellText.replace(/[^\d.-]/g, ''));

    return {
      row,
      value: !Number.isNaN(num) ? num : cellText.toLowerCase(),
    };
  });

  prepared.sort((a, b) => {
    if (typeof a.value === 'number' && typeof b.value === 'number') {
      return a.value - b.value;
    }

    return a.value.localeCompare(b.value);
  });

  if (!ascending) {
    prepared.reverse();
  }

  tbody.innerHTML = '';
  prepared.forEach((item) => tbody.appendChild(item.row));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = nameInput.value.trim();
  const employeePosition = positionInput.value.trim();
  const employeeOffice = officeInput.value;
  const employeeAge = ageInput.value.trim();
  const employeeSalary = salaryInput.value.trim();

  if (
    employeeName === '' ||
    employeePosition === '' ||
    employeeOffice === '' ||
    employeeAge === '' ||
    employeeSalary === '' ||
    isNaN(Number(employeeAge)) ||
    isNaN(Number(employeeSalary))
  ) {
    showNotification('Error!', 'error');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('Error!', 'error');

    return;
  }

  const age = Number(employeeAge);

  if (age < 18 || age > 90) {
    showNotification('Invalid age', 'error');

    return;
  }

  const isDuplicateName = Array.from(tbody.querySelectorAll('tr')).some(
    (row) => row.children[0].textContent === employeeName,
  );

  if (isDuplicateName) {
    showNotification('Error! Name already exists', 'error');

    return;
  }

  const tr = document.createElement('tr');
  const tdName = document.createElement('td');

  tdName.textContent = employeeName;
  tr.appendChild(tdName);

  const tdPosition = document.createElement('td');

  tdPosition.textContent = employeePosition;
  tr.appendChild(tdPosition);

  const tdOffice = document.createElement('td');

  tdOffice.textContent = employeeOffice;
  tr.appendChild(tdOffice);

  const tdAge = document.createElement('td');

  tdAge.textContent = employeeAge;
  tr.appendChild(tdAge);

  const tdSalary = document.createElement('td');

  tdSalary.textContent = formatSalary(employeeSalary);
  tr.appendChild(tdSalary);

  tbody.appendChild(tr);
  showNotification('Employee added', 'success');

  form.reset();
});

function showNotification(message, type = 'error') {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  if (td.querySelector('input')) {
    return;
  }

  const currentValue = td.textContent;
  const input = document.createElement('input');

  if (td.cellIndex === 3 || td.cellIndex === 4) {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  input.value = currentValue;
  td.textContent = '';
  td.appendChild(input);
  input.focus();

  const saveValue = () => {
    if (input.type === 'number' && isNaN(Number(input.value))) {
      showNotification('Error!', 'error');
      td.textContent = currentValue;

      return;
    }

    td.textContent = input.value.trim() || currentValue;
  };

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      saveValue();
    }

    if (ev.key === 'Escape') {
      td.textContent = currentValue;
    }
  });

  input.addEventListener('blur', saveValue);
});

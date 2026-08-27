'use strict';

// ===== TABLE ELEMENTS =====
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

// ===== TABLE SORTING =====
headers.forEach((th) => {
  th.addEventListener('click', () => {
    const currentSort = th.getAttribute('data-sort');
    const direction = currentSort === 'asc' ? 'desc' : 'asc';

    headers.forEach((header) => {
      header.removeAttribute('data-sort');
    });

    const columnIndex = th.cellIndex;

    th.setAttribute('data-sort', direction);

    const rows = Array.from(tbody.rows);

    const sortedRows = rows.sort((a, b) => {
      const aText = a.cells[columnIndex].textContent.trim();
      const bText = b.cells[columnIndex].textContent.trim();

      const aNum = Number(aText.replace(/[$,\s]/g, ''));
      const bNum = Number(bText.replace(/[$,\s]/g, ''));

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      return direction === 'asc'
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });

    tbody.innerHTML = '';

    sortedRows.forEach((row) => {
      tbody.appendChild(row);
    });
  });
});

// ===== ROW SELECTION =====
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr.active').forEach((activeRow) => {
    activeRow.classList.remove('active');
  });

  row.classList.add('active');
});

// ===== FORM CREATION =====
const form = document.createElement('form');

form.className = 'new-employee-form';

const fields = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  const input = document.createElement('input');

  input.name = field.name;
  input.type = field.type;
  input.setAttribute('data-qa', field.qa);

  label.appendChild(input);
  form.appendChild(label);
});

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

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
  select.appendChild(option);
});
officeLabel.appendChild(select);
form.appendChild(officeLabel);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);
document.body.append(form);

// ===== NOTIFICATIONS =====
const pushNotification = (type, messageTitle, description) => {
  const previous = document.querySelector('[data-qa="notification"]');

  if (previous) {
    previous.remove();
  }

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  notificationTitle.className = 'title';
  notificationTitle.textContent = messageTitle;

  notificationText.textContent = description;

  notification.append(notificationTitle, notificationText);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

// ===== FORM SUBMISSION =====
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  const employeeName = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = select.value;
  const age = Number(ageInput.value);
  const salary = Number(salaryInput.value);

  if (
    !employeeName ||
    !position ||
    !office ||
    !ageInput.value ||
    !salaryInput.value
  ) {
    pushNotification(
      'error',
      'Empty field',
      'All the fields have to be filled in.',
    );

    return;
  }

  if (employeeName.length < 4) {
    pushNotification(
      'error',
      'Name is too short',
      'Name needs at least 4 letters.',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      'error',
      'Age is out of range',
      'Age has to be between 18 and 90.',
    );

    return;
  }

  const newRow = tbody.insertRow();

  newRow.insertCell().textContent = employeeName;
  newRow.insertCell().textContent = position;
  newRow.insertCell().textContent = office;
  newRow.insertCell().textContent = age;
  newRow.insertCell().textContent = `$${salary.toLocaleString('en-US')}`;

  form.reset();

  pushNotification(
    'success',
    'Employee added',
    `${employeeName} is now in the table.`,
  );
});

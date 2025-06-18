'use strict';

const headers = document.querySelectorAll('thead th');
const sortState = Array(headers.length).fill(true);
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');
const form = document.createElement('form');

form.classList.add('new-employee-form');

function createLabeledInput(labelText, inputName, inputType = 'text', dataQa) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = labelText;
  input.name = inputName;
  input.type = inputType;
  input.setAttribute('data-qa', dataQa);

  label.appendChild(input);

  return label;
}

form.appendChild(createLabeledInput('Name:', 'name', 'text', 'name'));

form.appendChild(
  createLabeledInput('Position:', 'position', 'text', 'position'),
);

const officeLabel = document.createElement('label');
const select = document.createElement('select');

officeLabel.textContent = 'Office:';
select.name = 'office';
select.setAttribute('data-qa', 'office');

const officesArray = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburg',
  'San Francisco',
];

officesArray.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;

  select.appendChild(option);
});

officeLabel.appendChild(select);
form.appendChild(officeLabel);

form.appendChild(createLabeledInput('Age:', 'age', 'number', 'age'));
form.appendChild(createLabeledInput('Salary:', 'salary', 'number', 'salary'));

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.appendChild(submitButton);
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newRow = document.createElement('tr');
  const nameRow = form.name.value;
  const positionRow = form.position.value;
  const ageRow = parseInt(form.age.value, 10);
  const officeRow = form.office.value;
  const salaryRow = parseFloat(form.salary.value);
  const salaryFormat = new Intl.NumberFormat('en-Us');
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  setTimeout(() => notification.remove(), 5000);

  const showNotification = (messege, isError = true) => {
    notification.textContent = messege;
    notification.className = isError ? 'error' : 'success';

    document.body.appendChild(notification);
  };

  if (nameRow.length <= 3) {
    showNotification('Name must contain at least 4 letters');

    return;
  }

  if (ageRow < 18 || ageRow > 90) {
    showNotification('Age must be between 18 and 90');

    return;
  }

  if (
    positionRow === '' ||
    officeRow === '' ||
    isNaN(salaryRow) ||
    isNaN(ageRow)
  ) {
    showNotification('Fill in all fields correctly');

    return;
  }

  [
    nameRow,
    positionRow,
    officeRow,
    ageRow,
    `$${salaryFormat.format(salaryRow)}`,
  ].forEach((text) => {
    const tdRow = document.createElement('td');

    tdRow.textContent = text;
    newRow.appendChild(tdRow);
  });

  tbody.appendChild(newRow);
  showNotification('Employee added successfully', false);
  form.reset();
});

function cellEditing(td) {
  const originalText = td.textContent;
  const editingInput = document.createElement('input');

  editingInput.value = originalText;
  editingInput.className = 'cell-input';

  td.textContent = '';
  td.appendChild(editingInput);
  editingInput.focus();

  const save = () => {
    const newValue = editingInput.value;

    td.textContent = newValue || originalText;
  };

  editingInput.addEventListener('blur', save);

  editingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      save();
    }
  });
}

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD' && !e.target.querySelector('input')) {
    const activeInput = tbody.querySelector('input.cell-input');

    if (activeInput) {
      activeInput.blur();
    }

    cellEditing(e.target);
  }
});

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));
    const isAscending = sortState[index];

    rowsArray.sort((a, b) => {
      const aText = a.children[index].textContent;
      const bText = b.children[index].textContent;

      const aNum = parseFloat(aText.replace(/[^0-9.-]+/g, ''));
      const bNum = parseFloat(bText.replace(/[^0-9.-]+/g, ''));

      const bothAreNumbers = !isNaN(aNum) && !isNaN(bNum);

      if (bothAreNumbers) {
        return isAscending ? aNum - bNum : bNum - aNum;
      } else {
        return isAscending
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      }
    });

    sortState[index] = !isAscending;
    tbody.innerHTML = '';
    rowsArray.forEach((row) => tbody.appendChild(row));
  });
});

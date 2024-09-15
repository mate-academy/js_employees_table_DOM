'use strict';

// write code here

const pageTable = document.querySelector('table');

const pageTableState = {};

function extractAmount(str) {
  return parseFloat(str.replace(/[^0-9.]/g, ''));
}

function convertToCurrency(val) {
  return val.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function validateEmployee(employee) {
  const { employeeName, position, office, age, salary } = employee;

  if (!employeeName || employeeName.length < 4) {
    showNotification('warning', 'Name must be at least 4 characters long');

    return false;
  } else if (!position) {
    showNotification('warning', 'Position is required');

    return false;
  } else if (!office) {
    showNotification('warning', 'Office is required');

    return false;
  } else if (+age < 18 || +age > 90) {
    showNotification('warning', 'Age must be between 18 and 90');

    return false;
  } else if (!salary || +salary < 0 || Number.isNaN(+salary)) {
    showNotification('warning', 'Salary must be a positive number');

    return false;
  } else {
    showNotification('success', 'Employee added successfully');

    return true;
  }
}

function showNotification(type, message) {
  const notification = document.createElement('div');
  const title = document.createElement('p');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');

  if (type === 'warning') {
    notification.classList.add('error');
  } else if (type === 'success') {
    notification.classList.add('success');
  }

  title.classList.add('title');

  if (type === 'warning') {
    title.innerText = message;
  } else {
    title.innerText = message;
  }

  notification.append(title);
  document.body.append(notification);

  setTimeout(() => {
    document.querySelector('.notification').remove();
  }, 3000);
}

function newEmployeeForm() {
  const employeeForm = document.createElement('form');

  employeeForm.classList.add('new-employee-form');
  employeeForm.setAttribute('novalidate', '');
  employeeForm.setAttribute('id', 'new-employee-form');

  const formInfo = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'position',
      label: 'Position',
      type: 'text',
    },
    {
      name: 'office',
      label: 'Office',
      type: 'select',
      options: [
        'Tokyo',
        'London',
        'New York',
        'Singapore',
        'Edinburgh',
        'San Francisco',
      ],
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
    },
    {
      name: 'salary',
      label: 'Salary',
      type: 'number',
    },
  ];

  for (let i = 0; i < formInfo.length; i++) {
    const label = document.createElement('label');

    label.innerText = formInfo[i].label + ':';

    const input = document.createElement('input');
    const select = document.createElement('select');

    if (formInfo[i].type !== 'select') {
      label.append(input);
      input.setAttribute('data-qa', formInfo[i].name);
      input.setAttribute('type', formInfo[i].type);

      if (formInfo[i].name === 'age') {
        input.setAttribute('min', '18');
        input.setAttribute('max', '90');
      }

      if (formInfo[i].name === 'salary') {
        input.setAttribute('min', '1');
      }

      input.setAttribute('required', '');
    } else {
      select.setAttribute('data-qa', formInfo[i].name);
      select.setAttribute('required', '');
      label.append(select);

      for (let j = 0; j < formInfo[i].options.length; j++) {
        const option = document.createElement('option');

        option.value = formInfo[i].options[j];
        option.innerText = formInfo[i].options[j];
        select.append(option);
      }
    }

    employeeForm.append(label);
  }

  const button = document.createElement('button');

  button.innerText = 'Save to table';
  button.setAttribute('type', 'submit');
  employeeForm.append(button);

  const firstScript = document.querySelector('body script');

  document.body.insertBefore(employeeForm, firstScript);
}

newEmployeeForm();

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const COUNT_OF_COLUMNS = 5;

  const newEmloyee = {
    employeeName: form.querySelector('input[data-qa="name"]').value.trim(),
    position: form.querySelector('input[data-qa="position"]').value.trim(),
    office: form.querySelector('select[data-qa="office"]').value,
    age: form.querySelector('input[data-qa="age"]').value.trim(),
    salary: +form.querySelector('input[data-qa="salary"]').value.trim(),
  };

  if (!validateEmployee(newEmloyee)) {
    return;
  }

  const tbody = pageTable.querySelector('tbody');

  const newTr = document.createElement('tr');

  for (let i = 0; i < COUNT_OF_COLUMNS; i++) {
    const newTd = document.createElement('td');

    if (i === 4) {
      newTd.innerText = convertToCurrency(
        newEmloyee[Object.keys(newEmloyee)[i]],
      );
    } else {
      newTd.innerText = newEmloyee[Object.keys(newEmloyee)[i]];
    }

    newTr.append(newTd);
  }

  tbody.append(newTr);

  form.reset();
});

pageTable.addEventListener('click', (e) => {
  const tbody = pageTable.querySelector('tbody');
  const rows = [...tbody.querySelectorAll('tr')];
  const th = e.target.closest('th');
  const tr = e.target.closest('tr');

  if (th) {
    const thIndex = th.cellIndex;

    if (pageTableState.sortedColumn !== thIndex) {
      pageTableState.sortedBy = null;
      pageTableState.sortedColumn = thIndex;
    }

    const isAscending =
      !pageTableState.sortedBy || pageTableState.sortedBy === 'DESC';

    pageTableState.sortedBy = isAscending ? 'ASC' : 'DESC';

    const sortedRows = rows.sort((rowA, rowB) => {
      const a = rowA.children[th.cellIndex].textContent;
      const b = rowB.children[th.cellIndex].textContent;

      const isCurrency = (val) =>
        '$€£¥CHF₹₽₩R₺RM฿Rp₱ر.سد.إ₪E£₫₦₨৳'.includes(val[0]) &&
        '0123456789'.includes(val[1]);

      const compareValues = (valA, valB) => {
        if (isCurrency(valA)) {
          return extractAmount(valA) - extractAmount(valB);
        }

        return valA.localeCompare(valB);
      };

      return isAscending ? compareValues(a, b) : compareValues(b, a);
    });

    tbody.append(...sortedRows);
  }

  if (tr && tr.closest('tbody') === tbody) {
    const trList = [...tbody.querySelectorAll('tr')];

    pageTableState.selectedRow = tr;

    trList.forEach((row) => {
      row.classList.toggle('active', row === pageTableState.selectedRow);
    });
  }
});

function saveChanges(input, initialValue) {
  let newValue = input.value.trim() || initialValue;
  const cell = input.parentElement;

  const value = initialValue.trim();
  const currencySymbols = '$€£¥CHF₹₽₩R₺RM฿Rp₱ر.سد.إ₪E£₫₦₨৳';

  if (currencySymbols.includes(value[0]) && '0123456789'.includes(value[1])) {
    const amount = extractAmount(newValue);

    newValue = convertToCurrency(amount);
  }

  cell.textContent = newValue;
  input.remove();
}

pageTable.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || !cell.closest('tbody')) {
    return;
  }

  if (document.querySelector('.cell-input')) {
    saveChanges(document.querySelector('.cell-input'));
  }

  const initialValue = cell.textContent.trim();
  const currencySymbols = '$€£¥CHF₹₽₩R₺RM฿Rp₱ر.سد.إ₪E£₫₦₨৳';

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');

  if (
    currencySymbols.includes(initialValue[0]) &&
    '0123456789'.includes(initialValue[1])
  ) {
    const amount = extractAmount(initialValue);

    input.value = amount;
  } else {
    input.value = initialValue;
  }

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    saveChanges(input, initialValue);
  });

  input.addEventListener('keydown', (keypressEvent) => {
    if (keypressEvent.key === 'Enter') {
      saveChanges(input, initialValue);
    }
  });
});

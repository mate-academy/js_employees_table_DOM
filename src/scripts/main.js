'use strict';

const table = document.querySelector('table');
const tr = document.querySelector('tr');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');

let messageCount = 0;

function createForm() {
  form.classList.add('new-employee-form');

  const fields = [
    {
      fieldType: 'input',
      name: 'name',
      type: 'text',
      label: 'Name: ',
    },
    {
      fieldType: 'input',
      name: 'position',
      type: 'text',
      label: 'Position: ',
    },
    {
      fieldType: 'select',
      name: 'office',
      label: 'Office: ',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    {
      fieldType: 'input',
      name: 'age',
      type: 'number',
      label: 'Age: ',
    },
    {
      fieldType: 'input',
      name: 'salary',
      type: 'number',
      label: 'Salary: ',
    },
  ];

  for (const field of fields) {
    const label = document.createElement('label');

    label.textContent = field.label;

    if (field.fieldType === 'input') {
      const input = document.createElement('input');

      input.name = field.name;
      input.type = field.type;
      input.setAttribute('data-qa', field.name);

      input.style.marginLeft = '16px';

      label.appendChild(input);
    } else if (field.fieldType === 'select') {
      const select = document.createElement('select');

      select.name = field.name;
      select.setAttribute('data-qa', field.name);

      field.options.forEach((opt) => {
        const option = document.createElement('option');

        option.value = opt;
        option.textContent = opt;

        select.appendChild(option);
      });

      label.appendChild(select);
    } else {
      return;
    }

    form.appendChild(label);
  }

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.type = 'submit';

  form.appendChild(button);

  table.insertAdjacentElement('afterend', form);
}

function pushNotification(type, description) {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');
  message.style.position = 'fixed';
  message.style.right = '10px';

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = type === 'error' ? 'Error' : 'Success';

  const p = document.createElement('p');

  p.textContent = description;

  message.appendChild(h2);
  message.appendChild(p);

  document.body.appendChild(message);

  message.style.top = `${messageCount * (message.offsetHeight + 10)}px`;

  messageCount++;

  setTimeout(() => {
    message.remove();
    messageCount--;
  }, 2000);
}

function sortTable(sortIndex) {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const sortOrder = tr
    .querySelectorAll('th')
    [sortIndex].classList.contains('asc');

  tr.querySelectorAll('th').forEach((item, index) => {
    if (index !== sortIndex) {
      item.classList.remove('asc', 'desc');
    }
  });

  rows.sort((a, b) => {
    const aText = a.querySelectorAll('td')[sortIndex].innerText;
    const bText = b.querySelectorAll('td')[sortIndex].innerText;

    const aNumber = parseFloat(aText.replace(/[$,]/g, ''));
    const bNumber = parseFloat(bText.replace(/[$,]/g, ''));

    if (
      aText.toString() === aText &&
      bText.toString() === bText &&
      isNaN(aNumber) &&
      isNaN(bNumber)
    ) {
      return sortOrder
        ? bText.localeCompare(aText)
        : aText.localeCompare(bText);
    } else {
      return sortOrder ? bNumber - aNumber : aNumber - bNumber;
    }
  });

  rows.forEach((row) => tbody.appendChild(row));
}

createForm();

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const newEmployeeData = {};
  let hasErrors = false;

  form.querySelectorAll('label').forEach((label) => {
    const input = label.firstElementChild;

    if (!input.value.trim()) {
      pushNotification(
        'error',
        `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} field can't be empty!`,
      );
      hasErrors = true;

      return;
    } else if (input.name === 'name' && input.value.trim().length < 4) {
      pushNotification(
        'error',
        'Name field must contain more than 4 characters!',
      );
      hasErrors = true;

      return;
    } else if (
      input.name === 'age' &&
      (input.value.trim() < 18 || input.value.trim() > 90)
    ) {
      pushNotification('error', 'Age must be from 18 to 90');
      hasErrors = true;

      return;
    }

    if (input.name === 'salary') {
      const salary = parseFloat(input.value.trim());

      if (isNaN(salary)) {
        pushNotification('error', 'Salary must be a valid number.');

        return;
      }

      newEmployeeData[input.name] = `$${parseFloat(salary.toFixed(2))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    } else {
      newEmployeeData[input.name] = input.value.trim();
    }
  });

  if (hasErrors) {
    return;
  }

  function addNewEmployeeToTable() {
    const newRow = document.createElement('tr');

    for (const key of Object.keys(newEmployeeData)) {
      const newTd = document.createElement('td');

      newTd.textContent = newEmployeeData[key];

      newRow.appendChild(newTd);
    }

    tbody.appendChild(newRow);

    pushNotification('success', 'New employee was added successfully!');
  }

  addNewEmployeeToTable();
});

tbody.addEventListener('click', (e) => {
  const activeLink = e.target.closest('tr');

  if (!activeLink) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => {
    row.classList.remove('active');
  });

  activeLink.classList.add('active');
});

tr.addEventListener('click', (e) => {
  const link = e.target.closest('th');

  let index;

  tr.querySelectorAll('th').forEach((item, i) => {
    if (item === link) {
      index = i;
    }
  });

  if (!link) {
    return;
  }

  sortTable(index);

  if (link.classList.contains('asc')) {
    link.classList.remove('asc');
    link.classList.add('desc');
  } else if (link.classList.contains('desc')) {
    link.classList.remove('desc');
    link.classList.add('asc');
  } else {
    link.classList.add('asc');
  }
});

tbody.addEventListener('dblclick', (e) => {
  const editingCell = e.target.closest('td');

  if (!editingCell) {
    return;
  }

  const editingInput = document.createElement('input');

  editingInput.value = editingCell.textContent;

  editingInput.classList.add('cell-input');

  editingCell.textContent = '';
  editingCell.appendChild(editingInput);

  editingInput.focus();
  editingInput.select();

  editingInput.addEventListener('blur', () => {
    editingCell.textContent = editingInput.value || editingCell.textContent;
  });

  editingInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      editingCell.textContent = editingInput.value || editingCell.textContent;
    }
  });
});

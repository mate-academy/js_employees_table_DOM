'use strict';

function parseSalary(value) {
  if (!value) {
    return 0;
  }

  return Number(value.replace(/[^0-9.]/g, ''));
}

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const allThs = table.querySelectorAll('th');
  const colIndex = th.cellIndex;

  const currentOrder = th.dataset.order === 'asc' ? 'desc' : 'asc';

  allThs.forEach((header) => {
    if (header !== th) {
      delete header.dataset.order;
    }
  });

  th.dataset.order = currentOrder;

  sortTableByColumn(colIndex, currentOrder);
});

function sortTableByColumn(colIndex, order) {
  const rows = document.querySelectorAll('tbody tr');
  const rowsArr = Array.from(rows);

  rowsArr.sort((rowA, rowB) => {
    const a = rowA.children[colIndex].textContent.trim();
    const b = rowB.children[colIndex].textContent.trim();

    if (colIndex === 4) {
      const salaryA = parseSalary(a);
      const salaryB = parseSalary(b);

      return order === 'asc' ? salaryA - salaryB : salaryB - salaryA;
    }

    return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  rowsArr.forEach((row) => tableBody.appendChild(row));
}

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tableBody.querySelectorAll('tr').forEach((r) => {
    r.classList.remove('active');
  });

  row.classList.add('active');
});

const fieldConfigs = [
  {
    tag: 'input',
    qa: 'name',
    labelText: 'Name:',
    required: true,
    rule: { minLength: 4 },
  },

  {
    tag: 'input',
    qa: 'position',
    labelText: 'Position:',
    required: true,
    rule: { minLength: 2 },
  },

  {
    tag: 'select',
    qa: 'office',
    labelText: 'Office:',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
    required: true,
  },

  {
    tag: 'input',
    qa: 'age',
    type: 'number',
    labelText: 'Age:',
    required: true,
    rule: { min: 18, max: 90 },
  },

  {
    tag: 'input',
    qa: 'salary',
    type: 'number',
    labelText: 'Salary:',
    required: true,
    parse: parseSalary,
    format: (v) => '$' + Number(v).toLocaleString('en-US'),
  },

  {
    tag: 'button',
    type: 'submit',
    textContent: 'Save to table',
  },
];

const form = document.createElement('form');

form.classList = 'new-employee-form';
form.setAttribute('novalidate', true);
document.body.appendChild(form);

fieldConfigs.forEach((config) => {
  const label = document.createElement('label');

  if (config.labelText) {
    label.textContent = config.labelText;
  }

  let field;

  switch (config.tag) {
    case 'input':
      field = document.createElement('input');
      field.type = config.type || 'text';
      break;

    case 'select':
      field = document.createElement('select');

      config.options.forEach((opt) => {
        const option = document.createElement('option');

        option.value = opt.toLowerCase().replace(/\s+/g, '-');
        option.text = opt;
        field.appendChild(option);
      });
      break;

    case 'button':
      field = document.createElement('button');
      field.type = config.type;
      field.textContent = config.textContent;
      break;
  }

  if (config.qa) {
    field.dataset.qa = config.qa;
    field.name = config.qa;
  }

  field.required = config.required;

  if (config.tag === 'button') {
    form.appendChild(field);
  } else {
    label.appendChild(field);
    form.appendChild(label);
  }

  return field;
});

function validate(value, rule) {
  if (value === '') {
    return false;
  }

  if (!rule) {
    return true;
  }

  if (rule.minLength && value.length < rule.minLength) {
    return false;
  }

  const num = Number(value);

  if (rule.min !== undefined && num < rule.min) {
    return false;
  }

  if (rule.max !== undefined && num > rule.max) {
    return false;
  }

  return true;
}

const pushNotification = (type, title, message) => {
  const n = document.createElement('div');

  n.dataset.qa = 'notification';
  n.classList.add('notification', type);

  const h = document.createElement('h2');

  h.textContent = title;
  n.appendChild(h);

  const p = document.createElement('p');

  p.textContent = message;
  n.appendChild(p);

  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isValid = fieldConfigs.every((config) => {
    const fieldName = config.qa;

    if (!fieldName) {
      return true;
    }

    const field = form.elements[fieldName];
    let val;

    if (field.tagName === 'SELECT') {
      val = field.options[field.selectedIndex].text;
    } else {
      val = field.value.trim();
    }

    if (!validate(val, config.rule)) {
      pushNotification('error', 'Error', `Invalid ${fieldName}`);
      field.focus();

      return false;
    }

    return true;
  });

  if (!isValid) {
    return;
  }

  const tr = document.createElement('tr');

  fieldConfigs.forEach((config) => {
    if (!config.qa) {
      return;
    }

    const field = form.elements[config.qa];
    let fieldVal;

    if (field.tagName.toUpperCase() === 'SELECT') {
      fieldVal = field.options[field.selectedIndex].text;
    } else {
      fieldVal = field.value.trim();
    }

    const td = document.createElement('td');

    td.textContent = config.format ? config.format(fieldVal) : fieldVal;
    tr.appendChild(td);
  });

  tableBody.appendChild(tr);
  pushNotification('success', 'Success!', 'Data added successfully');
  form.reset();
  form.elements.name.focus();
});

tableBody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || tableBody.querySelector('input.cell-input')) {
    return;
  }

  const colIndex = td.cellIndex;
  const config = fieldConfigs[colIndex];

  if (!config || config.tag === 'button') {
    return;
  }

  const initialText = td.textContent;

  const input = document.createElement('input');

  input.classList.add('cell-input');

  input.value = config.qa === 'salary' ? parseSalary(initialText) : initialText;

  td.textContent = '';
  td.appendChild(input);
  input.focus();

  const handleSave = () => {
    const val = input.value.trim();

    if (!validate(val, config.rule)) {
      pushNotification('error', 'Error', `Invalid ${config.qa}`);
      td.textContent = initialText;
    } else {
      td.textContent = config.format ? config.format(val) : val;
    }
  };

  input.addEventListener('blur', handleSave);

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      input.blur();
    }

    if (evt.key === 'Escape') {
      input.removeEventListener('blur', handleSave);
      td.textContent = initialText;
    }
  });
});

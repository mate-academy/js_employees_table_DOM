'use strict';

function formatSalary(num) {
  return (
    '$' + Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 })
  );
}

function showNotification(text, type = 'success') {
  let note = document.querySelector('[data-qa="notification"]');

  if (!note) {
    note = document.createElement('div');
    note.setAttribute('data-qa', 'notification');
    document.body.appendChild(note);
  }

  note.className = '';
  note.classList.add(type);
  note.textContent = text;

  clearTimeout(note._hideTimeout);

  note._hideTimeout = setTimeout(() => {
    if (note.parentNode) {
      note.parentNode.removeChild(note);
    }
  }, 3000);
}

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');

table.parentNode.insertBefore(renderForm(), table);

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  const prev = tbody.querySelector('tr.active');

  if (prev) {
    prev.classList.remove('active');
  }
  tr.classList.add('active');
});

function createInputForm(labelText, fieldName, type, qa) {
  const label = document.createElement('label');

  label.textContent = labelText + ': ';

  const input = document.createElement('input');

  input.name = fieldName;
  input.type = type;
  input.setAttribute('data-qa', qa);
  input.required = true;
  label.appendChild(input);

  return label;
}

function renderForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.appendChild(createInputForm('Name', 'name', 'text', 'name'));
  form.appendChild(createInputForm('Position', 'position', 'text', 'position'));
  form.appendChild(createInputForm('Age', 'age', 'number', 'age'));
  form.appendChild(createInputForm('Salary', 'salary', 'number', 'salary'));

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.appendChild(createSelectField('Office', 'office', offices, 'office'));

  const submitBtn = document.createElement('button');

  submitBtn.textContent = 'Save to table';
  submitBtn.type = 'submit';

  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const data = {
      name: (fd.get('name') || '').trim(),
      position: (fd.get('position') || '').trim(),
      office: fd.get('office'),
      age: Number(fd.get('age')),
      salary: Number(fd.get('salary')),
    };

    if (data.name.length < 4) {
      showNotification('Name must be at least 4 characters', 'error');

      return;
    }

    if (!Number.isFinite(data.age) || data.age < 18 || data.age > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    if (!data.office) {
      showNotification('Choose an office', 'error');

      return;
    }

    addRowToTable(data);
    showNotification('Employee added', 'success');
    form.reset();
  });

  return form;
}

function createSelectField(labelText, fieldName, options, qa) {
  const label = document.createElement('label');

  label.textContent = labelText + ': ';

  const select = document.createElement('select');

  select.name = fieldName;
  select.setAttribute('data-qa', qa);
  select.required = true;

  const placeholder = document.createElement('option');

  placeholder.value = '';
  placeholder.textContent = 'Select office';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  options.forEach((optText) => {
    const option = document.createElement('option');

    option.value = optText;
    option.textContent = optText;

    select.appendChild(option);
  });
  label.appendChild(select);

  return label;
}

function addRowToTable({ name: employeeName, position, office, age, salary }) {
  if (!tbody) {
    return;
  }

  const tr = document.createElement('tr');
  const tdName = document.createElement('td');

  tdName.textContent = employeeName;
  tr.appendChild(tdName);

  const tdPosition = document.createElement('td');

  tdPosition.textContent = position;
  tr.appendChild(tdPosition);

  const tdOffice = document.createElement('td');

  tdOffice.textContent = office;
  tr.appendChild(tdOffice);

  const tdAge = document.createElement('td');

  tdAge.textContent = Number.isFinite(age) ? String(age) : '';
  tr.appendChild(tdAge);

  const tdSalary = document.createElement('td');
  const salaryValue = Number(String(salary).trim()) || 0;

  tdSalary.textContent = formatSalary(salaryValue);
  tr.appendChild(tdSalary);
  tbody.appendChild(tr);
}

const columnTypes = ['string', 'string', 'string', 'number', 'salary'];

function salaryToNumber(text) {
  return Number(text.replace(/[^0-9]/g, ''));
}

function getCellValue(text, type) {
  const t = text.trim();

  if (type === 'number') {
    const v = Number(t);

    return Number.isFinite(v) ? v : Infinity;
  }

  if (type === 'salary') {
    const v = salaryToNumber(t);

    return Number.isFinite(v) ? v : Infinity;
  }

  return t.toLowerCase();
}

function sortTableByColumn(columnIndex, direction) {
  const type = columnTypes[columnIndex];

  const rows = Array.from(tbody.querySelectorAll('tr'))

    .map((row, index) => ({ row, index }));

  rows.sort((a, b) => {
    const aVal = getCellValue(a.row.children[columnIndex].textContent, type);
    const bVal = getCellValue(b.row.children[columnIndex].textContent, type);

    if (typeof aVal === 'string') {
      const cmp = aVal.localeCompare(bVal, 'en', { sensitivity: 'base' });

      if (cmp !== 0) {
        return direction === 'asc' ? cmp : -cmp;
      }
    } else {
      const diff = aVal - bVal;

      if (diff !== 0) {
        return direction === 'asc' ? diff : -diff;
      }
    }

    return a.index - b.index;
  });

  const fragment = document.createDocumentFragment();

  rows.forEach(({ row }) => fragment.appendChild(row));
  tbody.appendChild(fragment);
}

const sortState = {
  column: null,
  direction: 'asc',
};

table.querySelector('thead').addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const column = th.getAttribute('data-column');

  const index = Array.from(th.parentElement.children).indexOf(th);

  if (sortState.column === column) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.column = column;
    sortState.direction = 'asc';
  }

  sortTableByColumn(index, sortState.direction);
});

'use strict';

const parseSalary = (text) => {
  const n = Number(text.replace(/[$,\s]/g, ''));

  return Number.isFinite(n) ? n : NaN;
};

const formatSalary = (num) => `$${Number(num).toLocaleString('en-US')}`;

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

let lastSortedCol = -1;
let isAsc = true;

const getCellValue = (tr, colIdx) => {
  const text = tr.cells[colIdx].textContent.trim();

  if (colIdx === 3) {
    return Number(text);
  }

  if (colIdx === 4) {
    const v = parseSalary(text);

    return Number.isFinite(v) ? v : 0;
  }

  return text.toLowerCase();
};

const sortByColumn = (colIdx, asc) => {
  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    const v1 = getCellValue(a, colIdx);
    const v2 = getCellValue(b, colIdx);

    if (v1 < v2) {
      return asc ? -1 : 1;
    }

    if (v1 > v2) {
      return asc ? 1 : -1;
    }

    return 0;
  });
  rows.forEach((tr) => tbody.appendChild(tr));
};

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const colIdx = Array.from(thead.querySelectorAll('th')).indexOf(th);

  if (colIdx === lastSortedCol) {
    isAsc = !isAsc;
  } else {
    lastSortedCol = colIdx;
    isAsc = true;
  }
  sortByColumn(colIdx, isAsc);
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }
  Array.from(tbody.rows).forEach((row) => row.classList.remove('active'));
  tr.classList.add('active');
});

const showNotification = (type, title, text) => {
  const box = document.createElement('div');

  box.setAttribute('data-qa', 'notification');
  box.className = type;
  box.innerHTML = `<strong>${title}</strong><div>${text}</div>`;
  document.body.append(box);
  setTimeout(() => box.remove(), 3000);
};

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const buildLabeledInput = (labelText, input) => {
  const label = document.createElement('label');

  label.textContent = `${labelText}: `;
  label.append(input);

  return label;
};

const createForm = () => {
  const form = document.createElement('form');

  form.className = 'new-employee-form';
  form.noValidate = true;

  const title = document.createElement('h2');

  title.textContent = 'New employee';

  const inputName = document.createElement('input');

  inputName.name = 'name';
  inputName.type = 'text';
  inputName.required = true;
  inputName.setAttribute('data-qa', 'name');

  const inputPosition = document.createElement('input');

  inputPosition.name = 'position';
  inputPosition.type = 'text';
  inputPosition.required = true;
  inputPosition.setAttribute('data-qa', 'position');

  const inputAge = document.createElement('input');

  inputAge.name = 'age';
  inputAge.type = 'number';
  inputAge.required = true;
  inputAge.setAttribute('data-qa', 'age');

  const inputSalary = document.createElement('input');

  inputSalary.name = 'salary';
  inputSalary.type = 'number';
  inputSalary.required = true;
  inputSalary.setAttribute('data-qa', 'salary');

  const selectOffice = document.createElement('select');

  selectOffice.name = 'office';
  selectOffice.required = true;
  selectOffice.setAttribute('data-qa', 'office');

  offices.forEach((city) => {
    const opt = document.createElement('option');

    opt.value = city;
    opt.textContent = city;
    selectOffice.append(opt);
  });

  const labelName = buildLabeledInput('Name', inputName);
  const labelPosition = buildLabeledInput('Position', inputPosition);
  const labelOffice = buildLabeledInput('Office', selectOffice);
  const labelAge = buildLabeledInput('Age', inputAge);
  const labelSalary = buildLabeledInput('Salary', inputSalary);

  const submit = document.createElement('button');

  submit.type = 'submit';
  submit.textContent = 'Save to table';

  form.append(
    title,
    labelName,
    labelPosition,
    labelOffice,
    labelAge,
    labelSalary,
    submit,
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawName = inputName.value.trim();
    const rawPosition = inputPosition.value.trim();
    const rawAge = inputAge.value.trim();
    const rawSalary = inputSalary.value.trim();
    const rawOffice = selectOffice.value.trim();

    if (!rawName || !rawPosition || !rawAge || !rawSalary || !rawOffice) {
      showNotification('error', 'Validation error', 'All fields are required');

      return;
    }

    const empAge = Number(rawAge);
    const empSalary = Number(rawSalary);

    if (rawName.length < 4) {
      showNotification(
        'error',
        'Invalid name',
        'Name must be at least 4 characters',
      );

      return;
    }

    if (!Number.isFinite(empAge) || empAge < 18 || empAge > 90) {
      showNotification('error', 'Invalid age', 'Age must be between 18 and 90');

      return;
    }

    if (!Number.isFinite(empSalary)) {
      showNotification('error', 'Invalid salary', 'Salary must be a number');

      return;
    }

    const tr = document.createElement('tr');

    [
      rawName,
      rawPosition,
      rawOffice,
      String(empAge),
      formatSalary(empSalary),
    ].forEach((txt) => {
      const td = document.createElement('td');

      td.textContent = txt;
      tr.append(td);
    });
    tbody.append(tr);

    form.reset();
    showNotification('success', 'Added', 'Employee added to the table');
  });

  return form;
};

table.after(createForm());

let editing = null;

const startEdit = (td) => {
  if (editing) {
    finishEdit(true);
  }

  const colIdx = td.cellIndex;
  const initial = td.textContent.trim();
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = colIdx === 3 || colIdx === 4 ? 'number' : 'text';

  if (colIdx === 4) {
    const parsed = parseSalary(initial);

    input.value = Number.isNaN(parsed) ? '' : String(parsed);
  } else {
    input.value = initial;
  }
  td.textContent = '';
  td.append(input);
  input.focus();

  editing = {
    td,
    input,
    initial,
    colIdx,
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finishEdit(true);
    }

    if (e.key === 'Escape') {
      finishEdit(false);
    }
  });
  input.addEventListener('blur', () => finishEdit(true), { once: true });
};

const finishEdit = (save) => {
  if (!editing) {
    return;
  }

  const { td, input, initial, colIdx } = editing;
  let nextText = initial;

  if (save) {
    const val = input.value.trim();

    if (val !== '') {
      if (colIdx === 4) {
        nextText = formatSalary(Number(val));
      } else if (colIdx === 3) {
        nextText = String(Number(val));
      } else {
        nextText = val;
      }
    }
  }
  td.textContent = nextText;
  editing = null;
};

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (td) {
    startEdit(td);
  }
});

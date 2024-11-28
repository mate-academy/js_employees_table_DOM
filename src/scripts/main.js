'use strict';

const trList = Array.from(document.querySelectorAll('tr th')).slice(0, 5);
const tBody = document.querySelector('tbody');
const rows = Array.from(tBody.querySelectorAll('tr'));

function parseSalary(salaryString) {
  return Number(salaryString.replace(/[$,]/g, ''));
}

const sortState = [];

trList.forEach((headerTh, columnIndex) => {
  headerTh.addEventListener('click', () => {
    const ascSort = sortState[columnIndex];

    sortTable(columnIndex, ascSort);

    sortState.fill(false);
    sortState[columnIndex] = !ascSort;
  });
});

function sortTable(columnIndex, ascSort) {
  const sortedRows = rows.sort((a, b) => {
    const aText = a.children[columnIndex].textContent.trim();
    const bText = b.children[columnIndex].textContent.trim();

    const aNum = parseSalary(aText);
    const bNum = parseSalary(bText);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (ascSort) {
        return bNum - aNum;
      }

      return aNum - bNum;
    } else {
      if (ascSort) {
        return bText.localeCompare(aText);
      }

      return aText.localeCompare(bText);
    }
  });

  sortedRows.forEach((row) => tBody.appendChild(row));
}

rows.forEach((row) => {
  row.addEventListener('click', () => {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    } else {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    }
  });
});

const form = document.createElement('form');
const button = document.createElement('button');

const attributes = ['name', 'position', 'office', 'age', 'salary'];

const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i <= 4; i++) {
  const input = document.createElement('input');
  const label = document.createElement('label');
  const select = document.createElement('select');

  const attr = attributes[i];

  label.textContent = `${attr.charAt(0).toUpperCase() + attr.slice(1, attr.length)}:`;

  input.setAttribute('data-qa', attr);
  input.setAttribute('required', 'true');
  input.setAttribute('name', attr);
  input.setAttribute('type', 'text');

  if (attr === 'age' || attr === 'salary') {
    input.setAttribute('type', 'number');
  }

  select.setAttribute('name', 'office');
  select.setAttribute('data-qa', 'office');

  label.appendChild(input);

  if (attr === 'office') {
    const labelSelect = document.createElement('label');

    labelSelect.textContent = `${attr.charAt(0).toUpperCase() + attr.slice(1, attr.length)}:`;

    for (let j = 0; j < options.length; j++) {
      const option = document.createElement('option');

      const optionText = options[j];

      option.value = optionText;

      const text =
        optionText.charAt(0).toUpperCase() + optionText.slice(1, option.length);

      option.textContent = text;

      select.appendChild(option);
      labelSelect.appendChild(select);
    }

    form.appendChild(labelSelect);
  } else {
    form.appendChild(label);
  }
}

button.textContent = 'Save to table';

form.appendChild(button);

form.classList.add('new-employee-form');
document.documentElement.appendChild(form);

function formatSalary(salary) {
  return `$${Number(salary).toLocaleString('en-US')}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const tr = document.createElement('tr');

  for (const key in data) {
    const td = document.createElement('td');

    if (+data[key] > 100) {
      td.textContent = formatSalary(data[key]);
    } else {
      td.textContent = data[key];
    }
    tr.appendChild(td);
  }

  let isError = false;

  if (data.name.length < 4) {
    isError = true;
  }

  if (+data.age < 18 || +data.age > 90) {
    isError = true;
  }

  if (!isError) {
    tBody.appendChild(tr);
    pushNotification('Successfully added a new employee', 'success');
  } else {
    pushNotification('Unexpected error occured', 'error');
  }

  isError = false;

  form.reset();
});

function pushNotification(title, type) {
  const block = document.createElement('div');
  const h2 = document.createElement('h2');

  block.classList.add('notification');
  h2.classList.add('title');

  block.setAttribute('data-qa', 'notification');

  h2.textContent = title;

  block.style.top = `10px`;
  block.style.right = `10px`;

  block.append(h2);
  document.body.append(block);

  switch (type) {
    case 'success':
      block.classList.add('success');
      break;
    case 'error':
      block.classList.add('error');
      break;
  }
}

'use strict';

const body = document.querySelector('body');
const headers = document.querySelectorAll('thead tr th');
const tbody = document.querySelector('tbody');

let activeColumnIndex = null;
let sortDirection = 'asc';

const pushNotification = (
  posTop,
  posRight,
  titleText,
  descriptionText,
  type,
) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.style.top = typeof posTop === 'number' ? `${posTop}px` : posTop;

  notification.style.right =
    typeof posRight === 'number' ? `${posRight}px` : posRight;

  const title = document.createElement('h2');

  title.classList.add('title');
  title.textContent = titleText;

  const description = document.createElement('p');

  description.textContent = descriptionText;

  notification.appendChild(title);
  notification.appendChild(description);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

function compareText(a, b, targetIndex, direction) {
  const aText = a.children[targetIndex].textContent.trim().toLowerCase();
  const bText = b.children[targetIndex].textContent.trim().toLowerCase();

  const result = aText.localeCompare(bText);

  return direction === 'desc' ? -result : result;
}

function compareNumbers(a, b, targetIndex, direction, isSalary = false) {
  const getNum = (row) => {
    const text = row.children[targetIndex].textContent;

    return isSalary ? Number(text.replace(/[^0-9.-]+/g, '')) : Number(text);
  };

  const aNum = getNum(a);
  const bNum = getNum(b);

  const result = aNum - bNum;

  return direction === 'desc' ? -result : result;
}

headers.forEach((th) => {
  th.addEventListener('click', (ev) => {
    headers.forEach((header) => {
      delete header.dataset.sort;
      delete header.dataset.sorted;
    });

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const targetIndex = ev.target.cellIndex;

    if (targetIndex === activeColumnIndex) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection = 'asc';
      activeColumnIndex = targetIndex;
    }

    ev.target.dataset.sort = sortDirection;
    ev.target.dataset.sorted = 'true';

    switch (ev.target.textContent.trim()) {
      case 'Name':
      case 'Position':
      case 'Office':
        rows.sort((a, b) => compareText(a, b, targetIndex, sortDirection));
        break;

      case 'Age':
        rows.sort((a, b) => {
          return compareNumbers(a, b, targetIndex, sortDirection, false);
        });
        break;

      case 'Salary':
        rows.sort((a, b) => {
          return compareNumbers(a, b, targetIndex, sortDirection, true);
        });
        break;

      default:
        return;
    }

    tbody.innerHTML = '';
    tbody.append(...rows);
  });
});

tbody.addEventListener('click', (ev) => {
  const clickedRow = ev.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const allRows = tbody.querySelectorAll('tr');

  allRows.forEach((row) => {
    row.className = '';
  });

  clickedRow.className = 'active';
});

const form = document.createElement('form');
const formButton = document.createElement('button');
const formSelector = document.createElement('select');
const inputs = ['name', 'position', 'office', 'age', 'salary'];
const selectors = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

body.appendChild(form);
form.className = 'new-employee-form';
form.setAttribute('novalidate', true);
form.appendChild(formSelector);

inputs.forEach((newInputName) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  form.appendChild(label);

  if (newInputName !== 'office') {
    label.textContent =
      newInputName[0].toUpperCase() + newInputName.slice(1) + ':';
    label.appendChild(input);

    input.name = newInputName;

    switch (newInputName) {
      case 'name':
      case 'position':
        input.type = 'text';
        break;
      case 'age':
      case 'salary':
        input.type = 'number';
        break;
    }

    input.required = true;
    input.dataset.qa = newInputName;
  } else {
    label.textContent = 'Office';
    label.appendChild(formSelector);

    formSelector.name = 'office';
    formSelector.dataset.qa = 'office';

    selectors.forEach((select) => {
      const option = document.createElement('option');

      formSelector.appendChild(option);
      option.value = select;
      option.textContent = select;
    });
  }
});

form.appendChild(formButton);
formButton.textContent = 'Save to table';

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  if (!form.checkValidity()) {
    pushNotification(
      10,
      10,
      'Форма не валідна!',
      'Заповніть всі поля форми.',
      'error',
    );

    return;
  }

  const formData = new FormData(form);
  const formName = formData.get('name');
  const formPosition = formData.get('position');
  const formOffice = formData.get('office');
  const formAge = formData.get('age');
  const rawFormSalary = formData.get('salary');
  const formattedFormSalary = Number(rawFormSalary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (formName.trim().length < 4) {
    pushNotification(
      10,
      10,
      'Помилка у полі Name',
      'Ім’я повинно містити принаймні 4 літери.',
      'error',
    );

    return;
  }

  if (formAge < 18 || formAge > 90) {
    pushNotification(
      10,
      10,
      'Помилка у полі Age',
      'Вік має бути в межах від 18 до 90 років.',
      'error',
    );

    return;
  }

  const tr = document.createElement('tr');

  inputs.forEach((input) => {
    const td = document.createElement('td');

    switch (input) {
      case 'name':
        td.textContent = formName;
        break;
      case 'position':
        td.textContent = formPosition;
        break;
      case 'office':
        td.textContent = formOffice;
        break;
      case 'age':
        td.textContent = formAge;
        break;
      case 'salary':
        td.textContent = formattedFormSalary;
        break;
    }
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  form.reset();

  pushNotification(
    10,
    10,
    'Успіх!',
    'Співробітника додано в таблицю.',
    'success',
  );
});

tbody.addEventListener('dblclick', (ev) => {
  const row = ev.target.closest('tr');

  if (!row) {
    return;
  }

  const activeEditingRow = tbody.querySelector('tr.editing');

  if (activeEditingRow && activeEditingRow !== row) {
    return;
  }

  if (row.classList.contains('editing')) {
    return;
  }
  row.classList.add('editing');

  const cells = row.querySelectorAll('td');

  const originalValues = [];

  cells.forEach((cell, index) => {
    const currentValue = cell.textContent;

    originalValues.push(currentValue);

    cell.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = currentValue;
    cell.appendChild(input);
  });

  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      cells.forEach((cell, index) => {
        const input = cell.querySelector('input');

        if (input) {
          const trimmedValue = input.value.trim();

          cell.textContent =
            trimmedValue !== '' ? trimmedValue : originalValues[index];
        }
      });
      row.classList.remove('editing');
    }
  });
});

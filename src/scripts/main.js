'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

// оновлення рядків
function updateRows() {
  const allRows = tbody.querySelectorAll('tr');

  allRows.forEach((rowTr) => {
    rowTr.addEventListener('click', () => {
      allRows.forEach((r) => {
        r.classList.remove('active');
      });
      rowTr.classList.add('active');
    });
  });
}
updateRows();

// спрацьовує: Тільки один раз при завантаженні сторінки.
headers.forEach((th, index) => {
  th.setAttribute('data-order', 'desc');

  th.addEventListener('click', () => {
    sortByColumn(index, th);
  });
});

// сортування колонок
function sortByColumn(columnIndex, headerElement) {
  const currentOrder = headerElement.getAttribute('data-order');

  // Скидання інших колонок (Логіка перемикання)
  headers.forEach((th) => {
    if (th !== headerElement) {
      th.setAttribute('data-order', 'desc');
    }
  });

  const newOrder = currentOrder === 'desc' ? 'asc' : 'desc';

  const sortedRow = Array.from(tbody.querySelectorAll('tr')).sort(
    (rowA, rowB) => {
      const cellA = rowA.children[columnIndex];
      const cellB = rowB.children[columnIndex];

      const textA = cellA.textContent.trim();
      const textB = cellB.textContent.trim();

      const isNum = columnIndex === 3 || columnIndex === 4;

      const valA = isNum
        ? parseFloat(textA.replace('$', '').replace(',', ''))
        : textA;

      const valB = isNum
        ? parseFloat(textB.replace('$', '').replace(',', ''))
        : textB;

      let comparator = 0;

      if (isNum) {
        comparator = valA - valB;
      } else {
        comparator = valA.toLowerCase().localeCompare(valB.toLowerCase());
      }

      return newOrder === 'asc' ? comparator : comparator * -1;
    },
  );

  // Оновлення DOM //
  sortedRow.forEach((row) => {
    tbody.appendChild(row);
  });

  headerElement.setAttribute('data-order', newOrder);
}

// дані для форми
const formData = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    'data-qa': 'name',
    required: true,
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    'data-qa': 'position',
    required: true,
  },
  {
    label: 'Office:',
    name: 'office',
    type: 'select',
    'data-qa': 'office',
    required: true,
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
    label: 'Age:',
    name: 'age',
    type: 'number',
    'data-qa': 'age',
    required: true,
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    'data-qa': 'salary',
    required: true,
  },
];

const form = document.createElement('form');

form.setAttribute('method', 'post');
form.setAttribute('action', 'submit');
form.classList.add('new-employee-form');

// створення форми
function createField(configuration) {
  const label = document.createElement('label');

  label.textContent = configuration.label + '';

  let input;

  if (configuration.type === 'select') {
    input = document.createElement('select');

    // Створюємо опції для select
    configuration.options.forEach((optText) => {
      const option = document.createElement('option');

      option.textContent = optText;
      option.value = optText;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = configuration.type;
  }
  // 3. Додаємо спільні атрибути
  input.setAttribute('data-qa', configuration['data-qa']);
  input.name = configuration.name;
  input.required = true;
  label.appendChild(input);

  return label;
}

//  Заповнення форми полями
formData.forEach((item) => {
  form.appendChild(createField(item));
});

// Кнопка submit
const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);
document.body.appendChild(form);

// створення pushNotification
const pushNotification = (title, description, type) => {
  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const elementDiv = document.createElement('div');

  elementDiv.classList.add('notification', type);
  elementDiv.setAttribute('data-qa', 'notification');

  const header = document.createElement('h2');

  header.classList.add('title');
  header.textContent = title;

  const paragraph = document.createElement('p');

  paragraph.textContent = description;

  elementDiv.append(header, paragraph);
  document.body.appendChild(elementDiv);

  setTimeout(() => {
    elementDiv.remove();
  }, 5000);
};

// обробка submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const allInputs = form.querySelectorAll('input , select');
  let isFormValid = true;

  for (const elemInput of allInputs) {
    const val = elemInput.value.trim();

    if (!val) {
      pushNotification('Error', 'All fields are required!', 'error');
      isFormValid = false;
      break;
    }

    if (elemInput.name === 'name' && val.length < 4) {
      pushNotification(
        'Error',
        'The Name value has fewer than 4 letters',
        'error',
      );
      isFormValid = false;
      break;
    }

    if (elemInput.name === 'age') {
      const age = parseFloat(val);

      if (age < 18 || age > 90) {
        pushNotification(
          'Error',
          'The Age value is less than 18 or more than 90!',
          'error',
        );
        isFormValid = false;
      }
    }
  }

  if (isFormValid) {
    const newRow = document.createElement('tr');

    const formattedSalary =
      '$' + parseFloat(form.elements['salary'].value).toLocaleString('en-US');

    const values = [
      form.elements['name'].value,
      form.elements['position'].value,
      form.elements['office'].value,
      form.elements['age'].value,
      formattedSalary,
    ];

    values.forEach((text) => {
      const td = document.createElement('td');

      td.textContent = text;
      newRow.appendChild(td);
    });

    tbody.appendChild(newRow);
    updateRows();

    form.reset();
    pushNotification('Success', 'Employee added!', 'success');
  }
});

// обробка double click

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    editTable(e.target);
  }
});

// редагування комірки
function editTable(td) {
  if (document.querySelector('.cell-input')) {
    return;
  }

  const originText = td.textContent.trim();

  // створення input
  const input = document.createElement('input');

  input.value = originText;
  input.classList.add('cell-input');

  td.textContent = '';
  td.appendChild(input);
  input.focus(); // ставимо курсор в поле

  // збереження кінцевого input
  const saveTextChanges = () => {
    const newValue = input.value.trim();

    td.textContent = newValue === '' ? originText : newValue;
  };

  // обробка blur
  input.addEventListener('blur', () => {
    saveTextChanges();
  });

  // обробка Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur(); // blur сам викличе saveTextChanges
    }
  });
}

'use strict';

// флаги определяют порядок сортировки
function Flags() {
  for (let i = 0; i < headerRow.children.length; i++) {
    this[headerItems[i].toLowerCase()] = true;
  }
}

// принимает строку (зарплату с '$', ',')
// возвращает число
function getSalary(salary) {
  return Number(salary.replace(/[$,]/g, ''));
}

// принимает число
// возвращает строку со знаком $ и в формате thousand separator
function salaryFromNumber(salary) {
  const copy = `${salary}`.split('');

  for (let i = copy.length - 3; i >= 0; i -= 3) {
    if (i !== 0) {
      copy.splice(i, 0, ',');
    }
  }

  return `$${copy.join('')}`;
}

// проверка полей формы на корректность вводимых данных
function formCheck() {
  const nameCheck = form.name.value.length >= 4;
  const positionCheck = form.position.value !== '';
  const ageCheck = form.age.value >= 18
    && form.age.value <= 90;
  const salaryCheck = form.salary.value !== '';

  return nameCheck
  && positionCheck
  && ageCheck
  && salaryCheck;
}

const header = document.querySelector('thead');
const headerRow = header.querySelector('tr');
// массив из заколовков таблицы
const headerItems = [...headerRow.children].map(item => item.textContent);

const body = document.querySelector('tbody');

const sortingFlags = new Flags();
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const notification = document.createElement('div');
const titleBlock = document.createElement('h2');
const descriptionBlock = document.createElement('p');

// Сортировки
headerRow.addEventListener('click', () => {
  let bodyRows = body.querySelectorAll('tr');
  const index = [...headerRow.children].indexOf(event.target);
  const columnName = headerRow.children[index].textContent;

  switch (columnName) {
    case 'Name': {
      bodyRows = [...bodyRows].sort((a, b) => {
        if (sortingFlags.name) {
          return a.children[index].textContent
            .localeCompare(b.children[index].textContent);
        } else {
          return b.children[index].textContent
            .localeCompare(a.children[index].textContent);
        }
      });

      sortingFlags.name = !sortingFlags.name;
      break;
    }

    case 'Position': {
      bodyRows = [...bodyRows].sort((a, b) => {
        if (sortingFlags.position) {
          return a.children[index].textContent
            .localeCompare(b.children[index].textContent);
        } else {
          return b.children[index].textContent
            .localeCompare(a.children[index].textContent);
        }
      });

      sortingFlags.position = !sortingFlags.position;
      break;
    }

    case 'Office': {
      bodyRows = [...bodyRows].sort((a, b) => {
        if (sortingFlags.office) {
          return a.children[index].textContent
            .localeCompare(b.children[index].textContent);
        } else {
          return b.children[index].textContent
            .localeCompare(a.children[index].textContent);
        }
      });

      sortingFlags.office = !sortingFlags.office;
      break;
    }

    case 'Age': {
      bodyRows = [...bodyRows].sort((a, b) => {
        if (sortingFlags.age) {
          return a.children[index].textContent - b.children[index].textContent;
        } else {
          return b.children[index].textContent - a.children[index].textContent;
        }
      });

      sortingFlags.age = !sortingFlags.age;
      break;
    }

    case 'Salary': {
      bodyRows = [...bodyRows].sort((a, b) => {
        if (sortingFlags.salary) {
          return getSalary(a.children[index].textContent)
            - getSalary(b.children[index].textContent);
        } else {
          return getSalary(b.children[index].textContent)
            - getSalary(a.children[index].textContent);
        }
      });

      sortingFlags.salary = !sortingFlags.salary;
      break;
    }
  }

  for (const row of bodyRows) {
    body.append(row);
  }
});

// выделение строки по клику
body.addEventListener('click', () => {
  for (const row of body.querySelectorAll('tr')) {
    row.classList.remove('active');
  }

  event.target.closest('tr').classList.add('active');
});

// Создание формы для добавления строки в таблицу
const form = document.createElement('form');

form.classList.add('new-employee-form');

for (let i = 0; i < headerItems.length; i++) {
  const label = document.createElement('label');

  if (headerItems[i] === 'Office') {
    const select = document.createElement('select');

    select.name = headerItems[i].toLowerCase();
    select.dataset.qa = select.name;

    for (let j = 0; j < cities.length; j++) {
      const option = document.createElement('option');

      option.textContent = cities[j];
      option.value = cities[j];

      select.append(option);
    }

    label.textContent = headerItems[i];

    label.append(select);
  } else {
    const input = document.createElement('input');

    input.type = i === 3 || i === 4
      ? 'number'
      : 'text';

    input.name = headerItems[i].toLowerCase();
    input.dataset.qa = input.name;

    label.textContent = headerItems[i];

    label.append(input);
  }

  form.append(label);
}

const saveBtn = document.createElement('button');

saveBtn.textContent = 'Save to table';
saveBtn.type = 'button';
form.append(saveBtn);

document.body.append(form);

// добавление новой строки
saveBtn.addEventListener('click', () => {
  const newRow = document.createElement('tr');

  for (let i = 0; i < headerItems.length; i++) {
    const newCell = document.createElement('td');

    newCell.textContent = headerItems[i] === 'Salary'
      ? salaryFromNumber(form[headerItems[i].toLowerCase()].value)
      : form[headerItems[i].toLowerCase()].value;

    newRow.append(newCell);
  }

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';

  if (formCheck()) {
    titleBlock.innerText = 'Good';
    descriptionBlock.innerText = 'Good';

    notification.classList.remove('error');
    notification.classList.add('success');

    notification.append(titleBlock);
    notification.append(descriptionBlock);

    document.body.append(notification);

    body.append(newRow);

    // цикл очищает все поля формы
    for (let i = 0; i < headerItems.length; i++) {
      if (headerItems[i] === 'Office') {
        form.office.querySelectorAll('option')[0].selected = 'selected';
      } else {
        form[headerItems[i].toLowerCase()].value = '';
      }
    }
  } else {
    titleBlock.innerText = 'Bad';
    descriptionBlock.innerText = 'Bad';

    notification.classList.remove('success');
    notification.classList.add('error');

    notification.append(titleBlock);
    notification.append(descriptionBlock);

    document.body.append(notification);
  }
});

// изменение ячеек таблицы
body.addEventListener('dblclick', () => {
  const cell = event.target;
  const changeInput = document.createElement('input');
  const previousValue = cell.textContent;

  changeInput.type = 'text';
  changeInput.classList.add('cell-input');

  cell.textContent = '';
  cell.append(changeInput);

  changeInput.addEventListener('keydown', () => {
    const currentRow = event.target.closest('tr');
    const currentCell = event.target.closest('td');
    const indexOfCell = [...currentRow.children].indexOf(currentCell);

    // Enter
    if (event.keyCode === 13) {
      cell.textContent = changeInput.value !== ''
        ? headerItems[indexOfCell] === 'Salary'
          ? cell.textContent = salaryFromNumber(changeInput.value)
          : cell.textContent = changeInput.value
        : previousValue;

      changeInput.remove();
    }
  });
});

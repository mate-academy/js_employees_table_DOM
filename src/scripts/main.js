/* eslint-disable prettier/prettier */
'use strict';

const getTableHeader = document.querySelectorAll('table th');
const tableBody = document.querySelector('tbody');
const getTHead = document.querySelectorAll('thead tr');
const getTBody = document.querySelectorAll('tbody tr');
const getTFooter = document.querySelectorAll('tfoot tr');
let clickCount = 0;
let lastClickedColumn = null;

// ASC sort
function sortASC(columnName, cell) {
  const newArr = [];

  getTBody.forEach((item) => {
    const itemContent = item.cells[cell];

    newArr.push(itemContent.textContent);
  });

  if (columnName === 'Salary') {
    newArr.sort(
      (a, b) =>
        transformIntoNumberFromSalary(a) - transformIntoNumberFromSalary(b),
    );
  } else {
    newArr.sort();
  }

  // Оновлюємо таблицю
  getTBody.forEach((item, index) => {
    const itemContent = item.cells[cell];

    itemContent.textContent = newArr[index];
  });
}

// Функція для перетворення зарплати в число
function transformIntoNumberFromSalary(str) {
  return +str.replace(/[^0-9.-]+/g, '');
}

// DESC sort
function sortDESC(columnName, cell) {
  const newArr = [];

  getTBody.forEach((item) => {
    const itemContent = item.cells[cell];

    newArr.push(itemContent.textContent);
  });

  if (columnName === 'Salary') {
    newArr
      .sort(
        (a, b) =>
          transformIntoNumberFromSalary(a) - transformIntoNumberFromSalary(b),
      )
      .reverse();
  } else {
    newArr.sort().reverse(); // Сортуємо і реверсуємо
  }

  // Оновлюємо таблицю
  getTBody.forEach((item, index) => {
    const itemContent = item.cells[cell];

    itemContent.textContent = newArr[index];
  });
}


getTableHeader.forEach((header) => {
  // eslint-disable-next-line no-shadow
  header.addEventListener('click', function (event) {
    const getClickOnHeader = event.target.closest('th');

    if (getClickOnHeader) {
      const columnName = header.textContent;

      // Скидаємо clickCount, якщо натискаємо на нову колонку
      if (lastClickedColumn !== columnName) {
        clickCount = 0;
        lastClickedColumn = columnName;
      }

      clickCount++;

      if (clickCount === 1) {
        // Перший клік
        if (columnName === 'Name') {
          sortASC(columnName, 0);
        }

        if (columnName === 'Position') {
          sortASC(columnName, 1);
        }

        if (columnName === 'Office') {
          sortASC(columnName, 2);
        }

        if (columnName === 'Age') {
          sortASC(columnName, 3);
        }

        if (columnName === 'Salary') {
          sortASC(columnName, 4);
        }
      } else if (clickCount === 2) {
        if (columnName === 'Name') {
          sortDESC(columnName, 0);
        }

        if (columnName === 'Position') {
          sortDESC(columnName, 1);
        }

        if (columnName === 'Office') {
          sortDESC(columnName, 2);
        }

        if (columnName === 'Age') {
          sortDESC(columnName, 3);
        }

        if (columnName === 'Salary') {
          sortDESC(columnName, 4);
        }
      }
    }

    getTHead.forEach((item) => {
      item.addEventListener('click', function () {
        getTBody.forEach((del2) => del2.classList.remove('active'));
        getTHead.forEach((del) => del.classList.remove('active'));
        getTFooter.forEach((itemf) => itemf.classList.remove('active'));

        item.classList.add('active');
      });
    });
  });
});

// Додаємо обробник подій для рядків таблиці
getTBody.forEach((item2) => {
  item2.addEventListener('click', function () {
    getTHead.forEach((del2) => del2.classList.remove('active'));
    getTBody.forEach((del2) => del2.classList.remove('active'));
    getTFooter.forEach((itemTfooter) => itemTfooter.classList.remove('active'));

    item2.classList.add('active');
  });
});

const createElementForm = document.createElement('form');

createElementForm.classList.add('new-employee-form');

const textContentLabel = [
  'Name: ',
  'Position: ',
  'Office: ',
  'Age: ',
  'Salary: ',
];

// звертатись по масиву
const arrForLabel = [];

textContentLabel.forEach((item) => {
  const createElementLabel = document.createElement('label');
  const createElementInput = document.createElement('input');
  const cleanText = item.replace(': ', '').toLowerCase();

  createElementLabel.textContent = cleanText;
  createElementLabel.textContent = item;
  arrForLabel.push(createElementLabel);
  createElementInput.setAttribute('name', cleanText.toLowerCase());
  createElementInput.setAttribute('data-qa', cleanText.toLowerCase());
  createElementForm.append(createElementLabel);

  if (
    createElementInput.name === 'age' ||
    createElementInput.name === 'salary'
  ) {
    createElementInput.type = 'number';
  }

  if (
    createElementInput.name === 'name' ||
    createElementInput.name === 'position'
  ) {
    createElementInput.type = 'text';
  }

  if (createElementInput.name === 'office') {
    const select = document.createElement('select');

    select.setAttribute('name', cleanText.toLowerCase());

    const cities = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'San Francisco',
    ];

    cities.forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      select.append(option);
    });
    createElementLabel.append(select);
  }

  if (createElementInput.name !== 'office') {
    createElementLabel.append(createElementInput);
  }
});



// можна звертатись по індексу
// console.log(arrForLabel[0].textContent);

// create Button Save
const button = document.createElement('button');

button.textContent = 'Save to table';

createElementForm.append(button);

button.addEventListener('click', function (e) {
  e.preventDefault(); // Запобігаємо стандартній поведінці кнопки

  const data = new FormData(createElementForm);
  const namePerson = data.get('name');
  const age = data.get('age');
  const position = data.get('position');
  const salary = data.get('salary');

  if (namePerson.trim().length < 4) {
    showError('Name value has less than 4 letters');
  } else if (position.trim().length === 0) {
    showError('Position field cannot be empty');
  } else if (+age < 18 || +age >= 90 || isNaN(age)) {
    showError('Age value is less than 18 or more than 90');
  } else if (+salary <= 0) {
    showError('Add salary');
  } else {
    showSuccessuf('Employee successfully added');

    const newPerson = [
      namePerson,
      position,
      data.get('office'),
      age,
      `$${(+(salary / 1000)).toFixed(3).replace('.', ',')}`,
    ];

    const newRow = tableBody.insertRow(-1);

    newPerson.forEach((item, index) => {
      const cell = newRow.insertCell(index);

      cell.innerText = item;
    });
    createElementForm.reset();
  }

  setTimeout(() => {
    const notifications = document.querySelectorAll('.notification');

    notifications.forEach((notification) => {
      notification.parentNode.removeChild(notification);
    });
  }, 3000);
});


// Функція для відображення повідомлень про помилки
function showError(message) {
  const createElementDiv = document.createElement('div');

  createElementDiv.setAttribute('data-qa', 'notification.error');
  createElementDiv.classList.add('notification', 'error');
  createElementDiv.textContent = message;
  document.body.append(createElementDiv);

  setTimeout(() => {
    createElementDiv.remove();
  }, 2000);
}

function showSuccessuf(message) {
  const createElementDiv = document.createElement('div');

  createElementDiv.setAttribute('data-qa', 'notification.success');
  createElementDiv.classList.add('notification', 'success');
  createElementDiv.textContent = message;
  document.body.append(createElementDiv);

  setTimeout(() => {
    createElementDiv.remove();
  }, 2000);
}

document.body.append(createElementForm);

// Обробник подій для футера таблиці
getTFooter.forEach((item) => {
  item.addEventListener('click', function () {
    getTBody.forEach((itemBody) => itemBody.classList.remove('active'));
    getTHead.forEach((itemHead) => itemHead.classList.remove('active'));
    getTFooter.forEach((itemTfooter) => itemTfooter.classList.remove('active'));

    item.classList.add('active');
  });
});


getTBody.forEach((item) => {
  item.addEventListener('dblclick', function(e) {
    const clickedCell = e.target; // Отримуємо клікаючу комірку

    if (clickedCell.tagName === 'TD') {
      const originalValue = clickedCell.textContent;

      clickedCell.textContent = '';

      const createInputCell = document.createElement('input');

      createInputCell.classList.add('cell-input');
      createInputCell.type = 'text';


      createInputCell.value = originalValue;


      clickedCell.append(createInputCell);


      createInputCell.addEventListener('blur', function () {
        const newValue = createInputCell.value.trim();

        // eslint-disable-next-line max-len
        clickedCell.textContent = newValue.length > 0 ? newValue : originalValue;
        createInputCell.remove(); // Видаляємо input
      });


      createInputCell.addEventListener('keydown', function (e2) {
        if (e2.key === 'Enter') {
          const newValue = createInputCell.value.trim(); // Обрізаємо пробіли

          // eslint-disable-next-line max-len
          clickedCell.textContent = newValue.length > 0 ? newValue : originalValue;
          createInputCell.remove(); // Видаляємо input
        }
      });
    }
  });
});

/* eslint-disable prettier/prettier */
'use strict';

const getTableHeader = document.querySelectorAll('table th');
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
  const cleanText = item.replace(': ', '');

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

    select.name = item.toLowerCase();

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

console.log(createElementForm);

// можна звертатись по індексу
// console.log(arrForLabel[0].textContent);

// create Button Save
const button = document.createElement('button');

button.textContent = 'Save to table';

createElementForm.append(button);

button.addEventListener('click', function (e) {
  e.preventDefault(); // Запобігаємо стандартній поведінці кнопки

  const clickButton = e.target.closest('button');

  // Перевіряємо, чи є активний рядок
  // eslint-disable-next-line max-len
  const activeRow = Array.from(getTBody).find(item => item.classList.contains('active'));

  if (clickButton && activeRow) {
    let allInputsValid = true; // Для перевірки всіх інпутів

    // Збираємо дані з інпутів
    arrForLabel.forEach((label, index) => {
      const input = label.querySelector('input');

      if (input) {
        let valueToSet = input.value.trim();

        // Якщо це зарплата, додаємо символ '$'
        if (index === 4) {
          valueToSet = `$${valueToSet}`;
        }

        console.log(input.value); // Відразу тримаємо trimmed значення

        // Перевірка довжини введеного значенн
        if (input.name === 'name' || input.name === 'position') {
          // Для name та position: перевірка на довжину
          if (valueToSet.length < 4) {
            if (allInputsValid) { // Виводимо попередження лише один раз
              allInputsValid = false;
              alert('Uncorrect data for name or position');
            }

            return; // Вихід з циклу, якщо дані некоректні
          }
        } else if (input.name === 'age') {
          // Для age: перевірка на числове значення та діапазон
          const numericValue = parseFloat(valueToSet);

          if (isNaN(numericValue) || numericValue < 18 || numericValue > 90) {
            if (allInputsValid) { // Виводимо попередження лише один раз
              allInputsValid = false;
              alert('Enter correct data for age!');
            }

            return; // Вихід з циклу, якщо дані некоректні
          }
        }


        // Оновлюємо текст в активному рядку таблиці лише якщо дані валідні
        if (allInputsValid) {
          activeRow.cells[index].textContent = valueToSet;
        }
      }
    });

    // Якщо всі дані валідні, показуємо повідомлення
    if (allInputsValid) {
      alert('Employee added successfully!');
    }
  }
});




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

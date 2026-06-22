'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

// обьект для хранения текущей сортировки
const sortDirect = {};

// индекс столбца, по которому отсортировано прямо сейчас
// (нужен, чтобы при клике на ДРУГОЙ столбец сортировка
// всегда начиналась заново с 'asc', а не продолжала
// чужое сохранённое направление)
let currentSortIndex = null;

// СОРТИРОВКА ПО КЛИКУ НА ЗАГОЛОВОК //
thead.addEventListener('click', (e) => {
  // реагируем только на клик именно по ячейке <th>
  if (e.target.tagName === 'TH') {
    // индекс столбца, по которому кликнули
    const index = e.target.cellIndex;
    // превращаем NodeList строк таблицы в обычный массив
    // чтобы можно было sort()
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (index !== currentSortIndex) {
      // кликнули на НОВЫЙ столбец — всегда начинаем с восходящего порядка,
      // независимо от того, что было сохранено для него ранее
      sortDirect[index] = 'asc';
    } else {
      // кликнули на ТОТ ЖЕ столбец повторно — переключаем направление:
      // 'asc' -> 'desc', 'desc' -> 'asc'
      sortDirect[index] = sortDirect[index] === 'asc' ? 'desc' : 'asc';
    }

    // запоминаем, какой столбец сейчас активен для сортировки
    currentSortIndex = index;

    const direction = sortDirect[index];

    // сортируем строки в зависимости от типа данных в столбце
    rows.sort((rowA, rowB) => {
      // берём текстовое содержимое нужной ячейки в каждой строке
      const valueA = rowA.cells[index].textContent;
      const valueB = rowB.cells[index].textContent;

      // столбец с индексом 3 — числовой
      //  (например, возраст) — сортируем как числа
      if (index === 3) {
        return direction === 'asc'
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      // столбец с индексом 4 — зарплата в формате "$1,000" —
      // сначала убираем символ $ и запятые, потом сравниваем как числа
      if (index === 4) {
        return direction === 'asc'
          ? Number(valueA.replace(/\$|,/g, '')) -
              Number(valueB.replace(/\$|,/g, ''))
          : Number(valueB.replace(/\$|,/g, '')) -
              Number(valueA.replace(/\$|,/g, ''));
      }

      // остальные столбцы — текстовые, сравниваем как строки
      // (localeCompare корректно учитывает алфавит и регистр)
      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    // заново вставляем отсортированные строки в tbody —
    // append() с готовыми DOM-элементами просто
    // переставляет их, не создавая копии
    tbody.append(...rows);
  }
});

// ВЫДЕЛЕНИЕ АКТИВНОЙ СТРОКИ ПРИ КЛИКЕ //
tbody.addEventListener('click', (e) => {
  // Находим ближайшую родительскую строку <tr>
  // относительно элемента, на который кликнули
  const row = e.target.closest('tr');
  // Если клик был не внутри строки (например, в пустом месте)
  // — ничего не делаем

  if (!row) {
    return;
  }

  // Сначала убираем класс "active" со всех строк
  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

  // Затем добавляем класс "active" только текущей (кликнутой) строке
  row.classList.add('active');
});

// СОЗДАНИЕ ФОРМЫ ДОБАВЛЕНИЯ СОТРУДНИКА //
const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

// ИМЯ //
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
// атрибут для тестов/автоматизации
nameInput.dataset.qa = 'name';
nameLabel.append(nameInput);

// ДОЛЖНОСТЬ //
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';
positionLabel.append(positionInput);

// ОФИС //
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';

// СОЗДАЕМ <option> для каждого города из списка
[
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
].forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeSelect.append(option);
});

officeLabel.append(officeSelect);

// ВОЗРАСТ //
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';
ageLabel.append(ageInput);

// ЗАРПЛАТА //
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';
salaryLabel.append(salaryInput);

// КНОПКА //
const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

// собираем все поля и кнопку внутрь формы
form.append(
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
  button,
);

// ОБРАБОТКА ОТПРАВКИ ФОРМЫ + ВАЛИДАЦИЯ/ДОБАВЛЕНИЕ СТРОКИ В ФОРМУ
form.addEventListener('submit', (e) => {
  // отменяем стандартную перезагрузку страницы при отправке формы
  e.preventDefault();

  // удаляем предыдущее уведомление (об ошибке или успехе), если оно есть
  document.querySelector('[data-qa="notification"]')?.remove();

  const names = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const age = Number(form.elements.age.value);
  const salary = Number(form.elements.salary.value);

  // проверка 1: имя должно быть не короче 4 символов
  if (names.length < 4) {
    const error = document.createElement('div');

    error.dataset.qa = 'notification';
    error.classList.add('error');
    error.textContent = 'Invalid data';
    document.body.append(error);

    // прерываем обработку — строка в таблицу не добавляется
    return;
  }

  // проверка 2: должность не должна быть пустой
  if (position.length < 1) {
    const error = document.createElement('div');

    error.dataset.qa = 'notification';
    error.classList.add('error');
    error.textContent = 'Invalid data';
    document.body.append(error);

    return;
  }

  // проверка 3: возраст должен быть в диапазоне от 18 до 90 лет
  if (age < 18 || age > 90) {
    const error = document.createElement('div');

    error.dataset.qa = 'notification';
    error.classList.add('error');
    error.textContent = 'Invalid data';
    document.body.append(error);

    return;
  }

  // если все проверки пройдены — показываем уведомление об успехе
  const success = document.createElement('div');

  success.dataset.qa = 'notification';
  success.classList.add('success');
  success.textContent = 'Employee added successfully';
  document.body.append(success);

  const tr = document.createElement('tr');

  // форматируем зарплату в виде валюты США, например: $1,000
  const formattedSalary = Number(salary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  // заполняем ячейки строки данными из формы

  tr.innerHTML = `
    <td>${names}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  // добавляем готовую строку в конец таблицы
  tbody.append(tr);

  // очищаем форму после успешного добавления
  form.reset();
});

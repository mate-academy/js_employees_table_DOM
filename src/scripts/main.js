'use strict';

// 1. Знаходимо основні елементи один раз при завантаженні скрипта
const form = document.querySelector('.new-employee-form');
const tableBody = document.querySelector('tbody');
const notification = document.querySelector('[data-qa="notification"]');
const headers = document.querySelectorAll('th');

// Функція для відображення сповіщень 📣
function showNotification(text, type) {
  notification.textContent = text;
  // Перезаписуємо класи,
  // щоб уникнути нашарування (напр. "notification success")
  notification.className = `notification ${type}`;
  notification.style.display = 'block';

  // Автоматично ховаємо через 3 секунди
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// --- КРОК 4 & 5: ДОДАВАННЯ ПРАЦІВНИКА ТА ВАЛІДАЦІЯ ---
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Зупиняємо стандартне перезавантаження сторінки

  // Отримуємо значення та одразу конвертуємо числа
  // eslint-disable-next-line no-shadow
  const name = document.querySelector('[data-qa="name"]').value;
  const position = document.querySelector('[data-qa="position"]').value;
  const office = document.querySelector('[data-qa="office"]').value;
  const ageNum = Number(document.querySelector('[data-qa="age"]').value);
  const salaryNum = Number(document.querySelector('[data-qa="salary"]').value);
  // Створюємо форматувальник для долара США
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  // Форматуємо числове значення зарплати
  const formattedSalary = formatter.format(salaryNum);

  // Валідація: Ім'я >= 4 символи, вік 18-90, офіс обрано, зарплата > 0 🛡️
  if (
    name.length >= 4 &&
    ageNum >= 18 &&
    ageNum <= 90 &&
    office !== '' &&
    salaryNum > 0 &&
    position.length > 0
  ) {
    // Створюємо новий рядок таблиці
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${ageNum}</td>
      <td>${formattedSalary}</td>
    `;

    tableBody.appendChild(row); // Додаємо рядок у кінець таблиці
    form.reset(); // Очищуємо всі поля форми для наступного введення
    showNotification('Дані успішно збережено!', 'success');
  } else {
    showNotification(
      'Помилка валідації! Перевірте правильність заповнення полів.',
      'error',
    );
  }
});

// --- КРОК 3: ВИДІЛЕННЯ РЯДКА (ДЕЛЕГУВАННЯ ПОДІЙ) ---
tableBody.addEventListener('click', (e) => {
  // Шукаємо найближчий рядок tr від елемента, на який клікнули 🖱️
  const row = e.target.closest('tr');

  if (!row) {
    return;
  } // Якщо клікнули не по рядку — ігноруємо

  // Прибираємо виділення у всіх існуючих рядків
  tableBody
    .querySelectorAll('tr')
    .forEach((tr) => tr.classList.remove('active'));
  // Додаємо клас active поточному рядку
  row.classList.add('active');
});

// --- КРОК 2: СОРТУВАННЯ ТАБЛИЦІ ---
headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    // Визначаємо наступний порядок сортування (перемикач asc/desc) 🔄
    const currentOrder =
      header.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';

    // Скидаємо атрибути сортування у всіх інших колонок
    headers.forEach((h) => h.removeAttribute('data-order'));
    header.setAttribute('data-order', currentOrder);

    // Перетворення на масив
    const rowsArray = Array.from(tableBody.querySelectorAll('tr'));

    // Множник для зміни напрямку: 1 (asc) або -1 (desc)
    const modifier = currentOrder === 'asc' ? 1 : -1;

    rowsArray.sort((a, b) => {
      const aVal = a.children[index].textContent;
      const bVal = b.children[index].textContent;

      // Сортування чисел (Age - 3, Salary - 4)
      // з урахуванням форматування (наприклад, "$1,000")
      if (index === 3 || index === 4) {
        // 1. Очищуємо перше значення (aVal) і перетворюємо на число
        const aNum = Number(aVal.replace(/[^0-9.-]+/g, ''));

        // 2. Очищуємо друге значення (bVal) і перетворюємо на число
        const bNum = Number(bVal.replace(/[^0-9.-]+/g, ''));

        // 3. Повертаємо результат порівняння
        return (aNum - bNum) * modifier;
      }
      // Сортування тексту (Name, Position, Office)

      return aVal.localeCompare(bVal) * modifier;
    });

    // Оновлюємо таблицю
    rowsArray.forEach((row) => tableBody.appendChild(row));
  });
});

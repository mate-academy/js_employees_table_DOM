'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');
const rowtable = table.querySelectorAll('tr');

// індекс поточного відсортування стовпців
let currentSortIndex = -1;
// сортування asc або desc
let currentSortDirection = 'asc';

// Реалізувати сортування таблиці клацанням по заголовку (в двох напрямках) //
headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    // петеворюю рядки в масив
    const rows = Array.from(tbody.querySelectorAll('tr'));
    // перевіряю чи є поточні стопці числовими стопцями(3 і 4 є числовим)
    const isNumberColumn = index === 3 || index === 4;

    // Якщо клікаєм на той самий стовпець декілька разів сортування міняється
    if (index === currentSortIndex) {
      // переключаю напрямок сортування
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // якщо натиснути на новий стопчик посинати з asc
      currentSortDirection = 'asc';
    }
    // оновлюю індекс стопця який зараз сортується
    currentSortIndex = index;

    // суртую рядок
    rows.sort((a, b) => {
      // отримую текст з змісту сопця
      const aText = a.cells[index].textContent.trim();
      const bText = b.cells[index].textContent.trim();

      if (isNumberColumn) {
        // перетворюю на чистло з плаваючою комою
        const aValue = parseFloat(aText.replace(/[$,]/g, ''));
        const bValue = parseFloat(bText.replace(/[$,]/g, ''));

        // повертає за зростаням спаданням
        return currentSortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      } else {
        if (aText < bText) {
          return currentSortDirection === 'asc' ? -1 : 1;
        }

        if (aText > bText) {
          return currentSortDirection === 'asc' ? 1 : -1;
        }

        return 0;
      }
    });
    // після сортування повертаю рядки до tbody в правильному порядку
    rows.forEach((row) => tbody.appendChild(row));
  });
});

//  Коли користувач клацає рядок, він має стати виділеним.
rowtable.forEach((row) => {
  row.addEventListener('click', () => {
    rowtable.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

/* Напишіть сценарій, щоб додати форму до документа. */

// створення форми
const form = document.createElement('form');

form.className = 'new-employee-form';

form.action = '/register';
form.method = 'POST';

document.body.appendChild(form);

// поле для Name
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.type = 'text';

nameInput.name = 'name';
nameInput.required = true;
nameInput.setAttribute('data-qa', 'name');

nameLabel.appendChild(nameInput);
form.appendChild(nameLabel);

// поле для 	Position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';

const positionInput = document.createElement('input');

positionInput.type = 'text';

positionInput.name = 'position';
positionInput.required = true;
positionInput.setAttribute('data-qa', 'position');

positionLabel.appendChild(positionInput);
form.appendChild(positionLabel);

// поле для 	Office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.required = true;

officeSelect.setAttribute('data-qa', 'office');

// створюю масив міст
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// додаю кожен офіс до option
offices.forEach((office) => {
  const option = document.createElement('option');

  option.textContent = office;
  officeSelect.appendChild(option);
});

officeLabel.appendChild(officeSelect);
form.appendChild(officeLabel);

// поле для 	Age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';

const ageInput = document.createElement('input');

ageInput.type = 'number';

ageInput.name = 'age';
ageInput.required = true;
ageInput.min = 0;
ageInput.setAttribute('data-qa', 'age');

ageLabel.appendChild(ageInput);
form.appendChild(ageLabel);

// поле для 	Salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary:';

const salaryInput = document.createElement('input');

salaryInput.type = 'text';

salaryInput.name = 'salary';
salaryInput.required = true;
salaryInput.setAttribute('data-qa', 'salary');

salaryLabel.appendChild(salaryInput);
form.appendChild(salaryLabel);

// обробляю введення зарплати
salaryInput.addEventListener('blur', () => {
  const rawValue = salaryInput.value;
  // видаляю $, коми і перевіряю числа
  const numericValue = parseFloat(rawValue.replace(/[$,]/g, ''));

  if (!isNaN(numericValue)) {
    salaryInput.value = numericValue.toFixed(2);
  } else {
    alert('Please enter a valid salary!');
    salaryInput.value = '';
  }
});

// кнопкаа для фідправки форми
const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(button);

// обробка натискання кнопки
button.addEventListener('click', () => {
  const namee = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value.trim();
  const age = ageInput.value.trim();
  const salary = salaryInput.value.trim();

  if (!namee || !position || !office || !age || !salary) {
    alert('Please fill in all fields!');
  }

  // перетворення зарплати
  let salaryy = salaryInput.value.trim();

  salaryy = parseFloat(salary.replace(/[$,]/g, ''));

  if (isNaN(salaryy)) {
    alert('Please enter a valid salary!');
    salaryInput.value = '';
  }

  // додаю новий рядрк до таблиці
  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${namee}</td>
  <td>${position}</td>
  <td>${age}</td>
  <td>$${salary.toFixed(2)}</td>
  <td>${office.replace(/-/g, ' ')}</td>
`;

  tbody.appendChild(row);

  // очищуюю ворму
  nameInput.value = '';
  ageInput.value = '';
  positionInput.value = '';
  officeSelect.value = officeSelect.options[0].value;
  salaryInput.value = '';
});

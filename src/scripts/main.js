'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const salary = (salaries) => Number(salaries.replace(/[$\s,]/g, ''));

let lastIndex = -1;
let isAsc = true;

/* сортування */

thead.addEventListener('click', function (e) {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const trCellIndex = e.target.cellIndex;

  const trTbody = table.querySelectorAll('tbody tr');
  const tr = Array.from(trTbody);

  if (trCellIndex === lastIndex) {
    isAsc = !isAsc;
  } else {
    isAsc = true;
    lastIndex = trCellIndex;
  }

  const sortTr = tr.sort((rowA, rowB) => {
    const textA = rowA.cells[trCellIndex].textContent;
    const textB = rowB.cells[trCellIndex].textContent;

    const numA = salary(textA);
    const numB = salary(textB);

    let result = 1;

    if (!isNaN(numA) && !isNaN(numB)) {
      result = numA - numB;
    } else {
      result = textA.localeCompare(textB);
    }

    return isAsc ? result : -result;
  });

  table.tBodies[0].append(...sortTr);
});

/* виділення рядка */

table.tBodies[0].addEventListener('click', function (e) {
  const clickTr = e.target.closest('tr');
  const active = table.tBodies[0].querySelector('.active');

  if (!clickTr) {
    return;
  }

  if (active) {
    active.classList.remove('active');
  }
  clickTr.classList.add('active');
});

/* форма для додавання співробітників */

const form = document.createElement('form');

form.classList.add('new-employee-form');

function createInput(labelText, name, type, qa) {
  return `
    <label>
      ${labelText}
      <input name='${name}' type='${type}' data-qa='${qa}'>
    </label>
  `;
}

let formContent = '';

function createSelect(name, qa, arrCity) {
  const city = arrCity.map((n) => `<option>${n}</option>`).join('');

  return `
  <label>
  Office
  <select name='${name}' data-qa='${qa}'>
  ${city}
  </select>
  </label>
  `;
}

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

formContent += createInput('Name', 'name', 'text', 'name');
formContent += createInput('Position', 'position', 'text', 'position');
formContent += createSelect('office', 'office', offices);
formContent += createInput('Age', 'age', 'number', 'age');
formContent += createInput('Salary', 'salary', 'number', 'salary');
formContent += '<button type="submit">Save to table</button>';

form.innerHTML = formContent;
table.after(form);

/* валідація та додавання в таблицю */

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.classList.add('notification');
  message.classList.add(type);

  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';

  const elementH2 = document.createElement('h2');
  const elementP = document.createElement('p');

  elementH2.classList.add('title');
  elementH2.textContent = title;
  elementP.textContent = description;
  message.append(elementH2, elementP);

  message.setAttribute('data-qa', 'notification');

  document.body.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const data = new FormData(e.target);
  const nameValue = data.get('name').trim();
  const positionValue = data.get('position').trim();
  const officeValue = data.get('office');
  const ageValue = +data.get('age');
  const salaryValue = +data.get('salary');

  if (nameValue.length < 4) {
    pushNotification(
      10,
      10,
      'Повідомлення про помилку',
      `Ім'я має бути від 4 символів`,
      'error',
    );

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    pushNotification(
      150,
      10,
      'Повідомлення про помилку',
      'Вік має бути від 18 до 90 років',
      'error',
    );

    return;
  }

  if (!positionValue) {
    pushNotification(
      80,
      10,
      'Повідомлення про помилку',
      `Посада є обов'язковою`,
      'error',
    );

    return;
  }

  if (!salaryValue) {
    pushNotification(
      220,
      10,
      'Повідомлення про помилку',
      `Заробітну плату додати обов'язково`,
      'error',
    );

    return;
  }

  const newRow = table.tBodies[0].insertRow();

  newRow.innerHTML = `
      <td>${nameValue}</td>
      <td>${positionValue}</td>
      <td>${officeValue}</td>
      <td>${ageValue}</td>
      <td>$${salaryValue.toLocaleString()}</td>
    `;

  pushNotification(
    290,
    10,
    'Повідомлення про успіх',
    'Співробітника додано успішно',
    'success',
  );

  e.target.reset();
});

/* подвійний клік для зміни даних */

table.tBodies[0].addEventListener('dblclick', function (e) {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const existingInput = table.querySelector('.cell-input');

  if (existingInput) {
    return;
  }

  const value = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = value;

  cell.textContent = '';
  cell.append(input);

  input.focus();

  function saveChanges() {
    const newValue = input.value.trim();

    if (newValue.length === 0) {
      cell.textContent = value;
    } else {
      cell.textContent = newValue;
    }
  }

  input.onkeydown = function (ev) {
    if (ev.code === 'Enter') {
      input.blur();
    }
  };

  input.onblur = saveChanges;
});

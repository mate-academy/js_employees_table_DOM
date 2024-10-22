'use strict';

const tbody = document.querySelector('tbody');
// #region sort

const thead = document.querySelector('thead');
const titles = thead.querySelectorAll('th');
const nameTit = titles[0];
const positionTit = titles[1];
const officeTit = titles[2];
const ageTit = titles[3];
const salaryTit = titles[4];
const sortState = {
  names: 'desc',
  position: 'desc',
  office: 'desc',
  age: 'desc',
  salary: 'desc',
};
let employees = tbody.querySelectorAll('tr');

function sortByAlphabet([...list], n, direction) {
  list.sort((a, b) => {
    const nameA = a.children[n].textContent;
    const nameB = b.children[n].textContent;

    return direction === 'asc'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const parentList = list[0].parentNode;

  list.forEach((item) => {
    parentList.appendChild(item);
  });
}

function sortByNumber([...list], n, direction) {
  list.sort((a, b) => {
    const numbA = Number(a.children[n].textContent.replace(/[^0-9.-]+/g, ''));
    const numbB = Number(b.children[n].textContent.replace(/[^0-9.-]+/g, ''));

    return direction === 'asc' ? numbA - numbB : numbB - numbA;
  });

  const parentList = list[0].parentNode;

  list.forEach((item) => {
    parentList.appendChild(item);
  });
}

nameTit.addEventListener('click', () => {
  const direction = sortState.names === 'asc' ? 'desc' : 'asc';

  employees = tbody.querySelectorAll('tr');
  sortByAlphabet(employees, 0, direction);
  sortState.names = direction;
});

positionTit.addEventListener('click', () => {
  const direction = sortState.position === 'asc' ? 'desc' : 'asc';

  employees = tbody.querySelectorAll('tr');
  sortByAlphabet(employees, 1, direction);
  sortState.position = direction;
});

officeTit.addEventListener('click', () => {
  const direction = sortState.office === 'asc' ? 'desc' : 'asc';

  employees = tbody.querySelectorAll('tr');
  sortByAlphabet(employees, 2, direction);
  sortState.office = direction;
});

ageTit.addEventListener('click', () => {
  const direction = sortState.age === 'asc' ? 'desc' : 'asc';

  employees = tbody.querySelectorAll('tr');
  sortByNumber(employees, 3, direction);
  sortState.age = direction;
});

salaryTit.addEventListener('click', () => {
  const direction = sortState.salary === 'asc' ? 'desc' : 'asc';

  employees = tbody.querySelectorAll('tr');
  sortByNumber(employees, 4, direction);
  sortState.salary = direction;
});

// #endregion
// #region notification

const pushNotification = (title, description, type) => {
  const divElement = document.createElement('div');
  const heading = document.createElement('h2');
  const paragraph = document.createElement('p');

  divElement.classList.add('notification', type);
  divElement.setAttribute('data-qa', 'notification');

  heading.classList.add('title');
  heading.textContent = title;
  paragraph.textContent = description;

  divElement.appendChild(heading);
  divElement.appendChild(paragraph);

  document.body.appendChild(divElement);

  setTimeout(() => {
    divElement.style.display = 'none';
  }, 2000);
};
// #endregion
// #region add class active
let previousElement = null;

document.addEventListener('click', (even) => {
  const parentElement = even.target.parentElement;

  if (tbody.contains(parentElement)) {
    if (previousElement && previousElement !== parentElement) {
      previousElement.classList.remove('active');
    }

    parentElement.classList.add('active');
    previousElement = parentElement;
  }
});
// #endregion
// #region form

const form = document.createElement('form');
const existingElement = document.querySelector('script');

form.classList.add('new-employee-form');

const labelsAndInputs = [
  {
    label: 'Name:',
    type: 'text',
    name: 'name',
    data: 'name',
  },
  {
    label: 'Position:',
    type: 'text',
    name: 'position',
    data: 'position',
  },
  {
    label: 'Age:',
    type: 'number',
    name: 'age',
    data: 'age',
  },
  {
    label: 'Salary:',
    type: 'number',
    name: 'salary',
    data: 'salary',
  },
];

// Додаємо лейбли та інпуты до форми
labelsAndInputs.forEach((item) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = item.label;
  input.type = item.type;
  input.name = item.name;
  input.required = true;
  input.setAttribute('data-qa', item.data);

  label.appendChild(input);
  form.appendChild(label);
});

// Створюємо новий елемент <select>
const selectLabel = document.createElement('label');
const select = document.createElement('select');
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

select.name = 'city';
selectLabel.textContent = 'Office:';
select.required = true;

cities.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  select.appendChild(option);
});

const AgeLab = form.querySelector('label input[name="age"]').parentElement;

selectLabel.appendChild(select);

form.insertBefore(selectLabel, AgeLab);

// Створюємо кнопку
const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

document.body.insertBefore(form, existingElement);

// #endregion
// #region check form
document
  .querySelector('.new-employee-form')
  .addEventListener('submit', (even) => {
    even.preventDefault();

    // Збираємо дані з форми
    let statusAnswers = true;
    const formResult = even.target;
    const names = formResult.querySelector('input[name="name"]').value;
    const position = formResult.querySelector('input[name="position"]').value;
    const city = formResult.querySelector('select[name="city"]').value;
    const age = formResult.querySelector('input[name="age"]').value;
    const salary = formResult.querySelector('input[name="salary"]').value;

    // Валідація даних
    if (names.length < 4) {
      pushNotification('Error', 'Ups.\n ' + 'Your name too short', 'error');
      statusAnswers = false;
    }

    if (age < 18 || age > 90) {
      pushNotification('Error', 'Ups.\n ' + 'Your age ', 'error');
      statusAnswers = false;
    }

    if (statusAnswers) {
      pushNotification('Success', 'Great.\n ' + 'check', 'success');

      // Додаємо дані до таблиці
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${names}</td>
        <td>${position}</td>
        <td>${city}</td>
        <td>${age}</td>
        <td>${'$' + salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
        `;
      tbody.appendChild(row);

      // Очищуємо форму після успішного додавання даних
      formResult.reset();
    }
  });

// #endregion
// #region optional
let activeInput = null;
let initialText = '';

tbody.addEventListener('dblclick', (events) => {
  const cell = events.target;

  if (cell.tagName.toLowerCase() === 'td' && !cell.querySelector('input')) {
    if (activeInput) {
      saveChanges();
    }

    const input = document.createElement('input');

    initialText = cell.textContent.trim();
    input.type = 'text';
    input.classList.add('cell-input');
    input.value = initialText;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    activeInput = input;

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keypress', (even) => {
      if (even.key === 'Enter') {
        saveChanges();
      }
    });
  }
});

function saveChanges() {
  if (!activeInput) {
    return;
  }

  const newValue = activeInput.value.trim();
  const cell = activeInput.parentElement;

  cell.textContent = newValue !== '' ? newValue : initialText;

  activeInput.remove();
  activeInput = null;
}

// #endregion

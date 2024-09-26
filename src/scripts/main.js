'use strict';

// #region 1. Sorting by clicking on the title (in two directions)

const tableHead = document.querySelector('thead').children[0];

function converter(element) {
  return +element.slice(1).split(',').join('');
}

tableHead.addEventListener('click', e => {
  const tableBody = document.querySelector('tbody');
  const arrayOfPeople = [...tableBody.children];
  const data = [];

  arrayOfPeople.forEach(person => {
    data.push({
      name: person.children[0].innerText,
      position: person.children[1].innerText,
      office: person.children[2].innerText,
      age: person.children[3].innerText,
      salary: converter(person.children[4].innerText),
    });
  });

  if (!e.target.sortCount) {
    e.target.sortCount = 1;
  }

  const sortCondition = e.target.innerText.toLowerCase();
  const sortOrder = e.target.sortCount % 2 === 0 ? 'afterbegin' : 'beforeend';

  data.sort((p1, p2) => {
    if (Number(p1[`${sortCondition}`])) {
      return p1[`${sortCondition}`] - p2[`${sortCondition}`];
    }

    return p1[`${sortCondition}`].localeCompare(p2[`${sortCondition}`]);
  });

  tableBody.innerHTML = '';
  e.target.sortCount++;

  data.forEach(person => {
    tableBody.insertAdjacentHTML(`${sortOrder}`, `
    <tr>
      <td>${person.name}</td>
      <td>${person.position}</td>
      <td>${person.office}</td>
      <td>${person.age}</td>
      <td>$${person.salary.toLocaleString('en-US')}</td>
    </tr>
  `);
  });
});

// #endregion

// #region 2. Selecting the row

let prevRow = false;

document.querySelector('tbody').addEventListener('click', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  e.target.parentNode.classList.add('active');

  if (prevRow && prevRow !== e.target.parentNode) {
    prevRow.classList.remove('active');
  }

  prevRow = e.target.parentNode;
});

// #endregion

// #region 3. Additional form

const table = document.querySelector('table');

table.insertAdjacentHTML('afterend', `
<form class="new-employee-form" action="get">
  <label>Name: 
    <input name="name" type="text" data-qa="name" required>
  </label>
  <label>Position: 
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>Salary: 
    <input name="Salary" type="number" data-qa="salary" required>
  </label>
  <button>Save to table</button>
</form>
`);

const form = document.querySelector('.new-employee-form');
const formButton = form.querySelector('button');
const formName = form.querySelector('[data-qa="name"]');
const formPosition = form.querySelector('[data-qa="position"]');
const formAge = form.querySelector('[data-qa="age"]');
const formOffice = form.querySelector('[data-qa="office"]');
const formSalary = form.querySelector('[data-qa="salary"]');

formButton.addEventListener('click', e => {
  if (formName.value.length < 4) {
    pushNotification(
      `Ім'я введено не коректно`,
      `Ім'я повинно складатися мінімум з 4 символів`,
      'error'
    );

    return;
  }

  if (formPosition.value.length < 3) {
    pushNotification(
      `Посаду введено не коректно`,
      `Назва посади повинна складатися мінімум з 4 символів`,
      'error'
    );

    return;
  }

  if (formAge.value < 18 || formAge.value > 90) {
    pushNotification(
      `Вік введено не коректно`,
      `Вік працівника повинен бути в межаж 18-90 років`,
      'error'
    );

    return;
  }

  if (formSalary.value < 1) {
    pushNotification(
      `Зарплату працівника введено не коректно`,
      `Сума зарплати повинна становити мінімум 1$`,
      'error'
    );

    return;
  }

  document.querySelector('tbody').insertAdjacentHTML('beforeend', `
  <tr>
    <td>${formName.value}</td>
    <td>${formPosition.value}</td>
    <td>${formOffice.value}</td>
    <td>${formAge.value}</td>
    <td>$${formSalary.value.toLocaleString('en-US')}</td>
  </tr>
  `);
  e.preventDefault();

  pushNotification(
    `Дію виконано успішно`,
    `Працівник був добавлений в таблицю`,
    'success'
  );
});

// #endregion

// #region 4. Notification

const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');
  const error = document.createElement('div');

  error.dataset.qa = 'notification';
  error.classList.add('notification', `${type}`);
  error.style.top = `10px`;
  error.style.right = `10px`;

  error.insertAdjacentHTML('beforeend', `
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `);

  body.append(error);

  setTimeout(
    () => error.remove(),
    4000);
};

// #endregion

// #region 5. Editing of table cells by double-clicking on it

document.querySelector('table').addEventListener('dblclick', e => {
  const cell = e.target;

  if (cell.tagName === 'TD') {
    let input = document.createElement('input');
    const defaultCell = cell.innerText;

    input.type = 'text';
    input.style.width = getComputedStyle(cell).width;

    if (cell.cellIndex === 3 || cell.cellIndex === 4) {
      input.type = 'number';
    } else if (cell.cellIndex === 2) {
      input = document.createElement('select');

      input.insertAdjacentHTML('afterbegin', `
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      `);
    }

    input.classList.add('cell-input');

    if (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }

    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      // #region Validation
      switch (String(cell.cellIndex)) {
        case '0':
          if (input.value.length < 4) {
            pushNotification(
              `Ім'я введено не коректно`,
              `Ім'я повинно складатися мінімум з 4 символів`,
              'error'
            );
            input.value = defaultCell;
          }
          break;

        case '1':
          if (input.value.length < 3) {
            pushNotification(
              `Посаду введено не коректно`,
              `Назва посади повинна містити мінімум 3 символи`,
              'error'
            );
            input.value = defaultCell;
          }
          break;

        case '2':
          break;

        case '3':
          if (input.value < 18 || input.value > 90) {
            pushNotification(
              `Вік введено не коректно`,
              `Вік працівника повинен бути в межаж 18-90 років`,
              'error'
            );
            input.value = defaultCell;
          }
          break;

        case '4':
          if (input.value < 1) {
            pushNotification(
              `Зарплату працівника введено не коректно`,
              `Сума зарплати повинна становити мінімум 1$`,
              'error'
            );
            cell.innerText = defaultCell;
          } else {
            cell.innerText = `$${input.value.toLocaleString('en-US')}`;
          }
          break;

        default:
          pushNotification(
            `Невідома помилка!`,
            `Будь ласка перевірте правильність введених даних`,
            'error'
          );
      }
      // #endregion

      cell.removeChild(input);
      cell.appendChild(document.createTextNode(input.value));
    });

    input.addEventListener('keydown', (e1) => {
      if (e1.key === 'Enter') {
        input.blur();
      }
    });
  }
});

// #endregion

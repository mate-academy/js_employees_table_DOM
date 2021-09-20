'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const tableHead = table.querySelector('thead');
let rowList = [...tableBody.rows];

/* получение числа из строки */

function getNumber(string) {
  let str = '';

  for (let i = 0; i <= string.length; i++) {
    if (!isNaN(+string[i])) {
      str += string[i];
    }
  }

  return +str;
}

/* создание и вставка сообщения */

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');

  message.classList.add('notification');
  message.classList.add(type);

  message.innerHTML = `
    <h2 class='title'>${title}</h2>
    <p>${description}</p>
  `;

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  body.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 5000);
};

/* сортировка таблицы */

let prevClick = '';

tableHead.addEventListener('click', e => {
  const headCol = e.target;

  if (!headCol) {
    return;
  }

  const index = [...document.querySelectorAll('th')].findIndex(
    item => item.innerText === headCol.innerText);

  switch (headCol.innerText) {
    case 'Name':
      if (prevClick !== headCol.innerText) {
        prevClick = headCol.innerText;

        rowList = [...tableBody.rows].sort((a, b) => {
          const aElem = a.cells[index].innerText;
          const bElem = b.cells[index].innerText;

          return aElem.localeCompare(bElem);
        });
      } else if (prevClick === headCol.innerText) {
        prevClick = '';

        rowList.reverse();
      }
      break;

    case 'Position':
      if (prevClick !== headCol.innerText) {
        prevClick = headCol.innerText;

        rowList = [...tableBody.rows].sort((a, b) => {
          const aElem = a.cells[index].innerText;
          const bElem = b.cells[index].innerText;

          return aElem.localeCompare(bElem);
        });
      } else if (prevClick === headCol.innerText) {
        prevClick = '';

        rowList.reverse();
      }
      break;

    case 'Office':
      if (prevClick !== headCol.innerText) {
        prevClick = headCol.innerText;

        rowList = [...tableBody.rows].sort((a, b) => {
          const aElem = a.cells[index].innerText;
          const bElem = b.cells[index].innerText;

          return aElem.localeCompare(bElem);
        });
      } else if (prevClick === headCol.innerText) {
        prevClick = '';

        rowList.reverse();
      }
      break;

    case 'Age':
      if (prevClick !== headCol.innerText) {
        prevClick = headCol.innerText;

        rowList = [...tableBody.rows].sort((a, b) => {
          const aElem = a.cells[index].innerText;
          const bElem = b.cells[index].innerText;

          return aElem - bElem;
        });
      } else if (prevClick === headCol.innerText) {
        prevClick = '';

        rowList.reverse();
      }
      break;

    case 'Salary':
      if (prevClick !== headCol.innerText) {
        prevClick = headCol.innerText;

        rowList = [...tableBody.rows].sort((a, b) => {
          const aElem = getNumber(a.cells[index].innerText);
          const bElem = getNumber(b.cells[index].innerText);

          return aElem - bElem;
        });
      } else if (prevClick === headCol.innerText) {
        prevClick = '';

        rowList.reverse();
      }
      break;
  }

  for (const row of rowList) {
    tableBody.append(row);
  }
});

/* выделение только одной строки */

tableBody.addEventListener('click', e => {
  const activeRow = e.target.closest('tr');

  [...tableBody.rows].forEach(row => {
    row.classList.remove('active');
  });

  activeRow.classList.toggle('active');
});

/* создание и вставка формы для нового сотрудника */

const form = document.createElement('form');

form.classList.add('new-employee-form');

const formInputs = `
  <label>Name:
    <input data-qa="name" name="name" type="text" required>
  </label>
  <label>Position:
    <input data-qa="position" name="position" type="text" required>
  </label>
  <label>Office:
    <select data-qa="office" >
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input data-qa="age" name="age" type="text" required>
  </label>
  <label>Salary:
    <input data-qa="salary" name="salary" type="text" required>
  </label>
  <button type="submit">Save to table</button>
`;

form.insertAdjacentHTML('afterbegin', formInputs);

body.append(form);

/* валидация данных формы и вставки их в общую таблицу */

function deletePreviousMessage() {
  document.querySelectorAll('.notification')
    .forEach(message => message.remove());
}

form.addEventListener('submit', (e) => {
  const sel = document.querySelector('select');

  e.preventDefault();

  const selectedValue = sel.value;

  const data = new FormData(form);

  data.append('office', selectedValue);

  const [nameNewEmp, position, age, salary, office] = [...data.entries()];

  let checkSum = 0;

  if (nameNewEmp[1].length < 4) {
    deletePreviousMessage();

    pushNotification(450, 10, 'ERROR',
      'Имя должно сожержать более 4-х символов.', 'error');
  } else {
    checkSum++;
  }

  if (isNaN(+age[1])) {
    deletePreviousMessage();

    pushNotification(600, 10, 'ERROR',
      'Введите Ваш возраст в числовом формате.', 'error');
  } else if (+age[1] < 18 || +age[1] > 90) {
    deletePreviousMessage();

    pushNotification(600, 10, 'ERROR',
      'Ваш возраст должен быть от 18 до 90 лет.', 'error');
  } else {
    checkSum++;
  }

  if (isNaN(+salary[1])) {
    deletePreviousMessage();

    pushNotification(750, 10, 'ERROR',
      'Введите Вашу заработную плату в числовом формате.', 'error');
  } else {
    salary[1] = '$' + new Intl.NumberFormat('en-EN').format(+salary[1]);
    checkSum++;
  }

  if (checkSum >= 3) {
    deletePreviousMessage();

    pushNotification(450, 10, 'SUCCESS', 'Это успешный УСПЕХ', 'success');

    const newEmployeeRow = document.createElement('tr');

    newEmployeeRow.innerHTML = `
      <td>${nameNewEmp[1]}</td>
      <td>${position[1]}</td>
      <td>${office[1]}</td>
      <td>${age[1]}</td>
      <td>${salary[1]}</td>
    `;
    tableBody.insertAdjacentElement('beforeend', newEmployeeRow);
  }
});

/* редактирование таблицы */

tableBody.addEventListener('dblclick', (e) => {
  const targetCell = e.target;
  const prevTargetInner = targetCell.innerText;

  const columnHeader
    = [...document.querySelectorAll('th')][targetCell.cellIndex];

  targetCell.innerText = '';

  const cellInput = document.createElement('input');

  cellInput.classList.add('cell-input');
  targetCell.append(cellInput);
  cellInput.value = prevTargetInner;

  cellInput.addEventListener('blur', () => {
    const newValueFromInput = cellInput.value.trim();

    if (newValueFromInput.length <= 0) {
      targetCell.innerText = prevTargetInner;
    }

    switch (columnHeader.innerText) {
      case 'Name':

        /* не знаю как написать регулярку,
          чтобы проверялось есть после буквы число или нет
          (чтоб в имени вообще не было цифр) */

        if ((/([A-Za-z])/g).test(newValueFromInput)
            && newValueFromInput.length >= 4) {
          targetCell.innerText = newValueFromInput;
          cellInput.remove();
          deletePreviousMessage();
        } else if (!(/([A-Za-z])/g).test(newValueFromInput)
            || newValueFromInput.length < 4) {
          deletePreviousMessage();

          pushNotification(450, 10, 'ERROR',
            'Вводимые данны должны быть СТРОКОЙ \n '
              + 'и содержать более 4-х символов', 'error');
        }
        break;
      case 'Position':
      case 'Office':
        if ((/[A-Za-z]/g).test(newValueFromInput)) {
          targetCell.innerText = newValueFromInput;
          cellInput.remove();
          deletePreviousMessage();
        } else if (!(/[A-Za-z]/g).test(newValueFromInput)) {
          deletePreviousMessage();

          pushNotification(450, 10, 'ERROR',
            'Вводимые данны должны быть СТРОКОЙ.', 'error');
        }
        break;

      case 'Age':
        if (!isNaN(+newValueFromInput)
            && +newValueFromInput > 18 && +newValueFromInput < 90) {
          targetCell.innerText = newValueFromInput;
          cellInput.remove();
          deletePreviousMessage();
        } else if (isNaN(+newValueFromInput)) {
          deletePreviousMessage();

          pushNotification(600, 10, 'ERROR',
            'Введите Ваш возраст в числовом формате.', 'error');
        } else if (+newValueFromInput < 18 || +newValueFromInput > 90) {
          deletePreviousMessage();

          pushNotification(600, 10, 'ERROR',
            'Ваш возраст должен быть от 18 до 90 лет.', 'error');
        }
        break;
      case 'Salary':
        if (isNaN(+newValueFromInput)) {
          deletePreviousMessage();

          pushNotification(750, 10, 'ERROR',
            'Введите Вашу заработную плату в числовом формате.', 'error');
        } else {
          deletePreviousMessage();

          targetCell.innerText = '$' + new Intl.NumberFormat('en-EN').format(
            +newValueFromInput);
        }
        break;
    }
  });

  document.addEventListener('keydown', (ev) => {
    const newValueFromInput = cellInput.value.trim();

    if (ev.key === 'Enter' && newValueFromInput.length <= 0) {
      targetCell.innerText = prevTargetInner;
    } else if (ev.key === 'Enter' && newValueFromInput.length > 0) {
      switch (columnHeader.innerText) {
        case 'Name':

          /* не знаю как написать регулярку,
            чтобы проверялось есть после буквы число или нет
            (чтоб в имени вообще не было цифр) */

          if ((/([A-Za-z])/g).test(newValueFromInput)
              && newValueFromInput.length >= 4) {
            targetCell.innerText = newValueFromInput;
            cellInput.remove();
            deletePreviousMessage();
          } else if (!(/([A-Za-z])/g).test(newValueFromInput)
              || newValueFromInput.length < 4) {
            deletePreviousMessage();

            pushNotification(450, 10, 'ERROR',
              'Вводимые данны должны быть СТРОКОЙ \n '
                + 'и содержать более 4-х символов', 'error');
          }
          break;
        case 'Position':
        case 'Office':
          if ((/[A-Za-z]/g).test(newValueFromInput)) {
            targetCell.innerText = newValueFromInput;
            cellInput.remove();
            deletePreviousMessage();
          } else if (!(/[A-Za-z]/g).test(newValueFromInput)) {
            deletePreviousMessage();

            pushNotification(450, 10, 'ERROR',
              'Вводимые данны должны быть СТРОКОЙ.', 'error');
          }
          break;

        case 'Age':
          if (!isNaN(+newValueFromInput)
              && +newValueFromInput > 18 && +newValueFromInput < 90) {
            targetCell.innerText = newValueFromInput;
            cellInput.remove();
            deletePreviousMessage();
          } else if (isNaN(+newValueFromInput)) {
            deletePreviousMessage();

            pushNotification(600, 10, 'ERROR',
              'Введите Ваш возраст в числовом формате.', 'error');
          } else if (+newValueFromInput < 18 || +newValueFromInput > 90) {
            deletePreviousMessage();

            pushNotification(600, 10, 'ERROR',
              'Ваш возраст должен быть от 18 до 90 лет.', 'error');
          }
          break;
        case 'Salary':
          if (isNaN(+newValueFromInput)) {
            deletePreviousMessage();

            pushNotification(750, 10, 'ERROR',
              'Введите Вашу заработную плату в числовом формате.', 'error');
          } else {
            deletePreviousMessage();

            targetCell.innerText = '$' + new Intl.NumberFormat('en-EN').format(
              +newValueFromInput);
          }
          break;
      }
    }
  });
});

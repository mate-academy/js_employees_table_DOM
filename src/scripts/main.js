'use strict';

const table = document.querySelector('table');

createForm();

const form = document.querySelector('.new-employee-form');
const tbody = document.querySelector('tbody');

form.addEventListener('submit', function (e) {
  // щоб не було перезавантаження при сабміті
  e.preventDefault();

  const res = checkForm();

  if (res.type === 'error') {
    pushNotification(10, 10, 'Error', res.message, 'error');
  } else {
    pushNotification(10, 10, 'Success', res.message, 'success');
    createNewEmploye(form.elements);
  }
});

table.addEventListener('dblclick', function (e) {
  const target = e.target.closest('td');

  if (!target) {
    return; // якщо клікнуто не по комірці нічо не робити
  }

  const cellContent = target.textContent;

  const input = createInput();

  function createInput() {
    const inputCtrl = document.createElement('input');

    inputCtrl.className = 'cell-input';
    inputCtrl.type = 'text';
    target.innerHTML = '';
    target.append(inputCtrl);
    inputCtrl.focus();

    return inputCtrl;
  }

  function deleteInput() {
    if (input.value === '') {
      target.textContent = cellContent;
    }

    if (!checkInput(cellContent, input)) {
      pushNotification(10, 10, 'Error', 'Incorect type value', 'error');
      input.focus();

      return;
    }

    if (input.value !== '') {
      target.textContent = input.value;
    }
    input.remove();
  }

  input.onblur = function (ev) {
    deleteInput();
  };

  document.onkeyup = function (ev) {
    if (ev.key === 'Enter') {
      deleteInput();
    }
  };
});

table.addEventListener('click', function (e) {
  const target = e.target.closest('th, td');
  const targetRow = e.target.closest('tr');

  if (!target && !targetRow) {
    return undefined;
  }

  const rows = Array.from(table.querySelectorAll('tr'));

  if (targetRow && targetRow.matches('tr')) {
    singleActivateRow(rows, targetRow.rowIndex);
  }

  if (target && target.matches('th') && target.dataset.type) {
    const columns = Array.from(tbody.rows).map(
      (el) => el.cells[target.cellIndex],
    );
    let order = target.dataset.order === 'asc' ? 'desc' : 'asc';

    order = target.dataset.old ? order : 'asc';

    target.setAttribute('data-order', order);

    // якщо перед цим був порядок 'asc'
    // то міняю результат порівняння на від'ємний,
    // щоб змінити порядок на 'desc' і навпаки
    columns.sort((a, b) => {
      const res = getSorted(target, a, b);

      return order === 'asc' ? res : -res;
    });

    columns.forEach((cell, index) => {
      tbody.append(cell.parentElement);
    });
  }
});

// це щоб активувати тільки один рядок,
// також додав деактивацію на повторний клік
function singleActivateRow(rows, index) {
  const isActive = rows[index].matches('.active');

  if (index !== 0 && !isActive) {
    rows[index].classList.add('active');
  }

  if (isActive) {
    rows[index].classList.remove('active');
  }

  rows.forEach((el, ind) => {
    if (ind !== index) {
      el.classList.remove('active');
    }
  });
}

function getSorted(target, a, b) {
  switch (target.dataset.type) {
    case 'string':
      return a.textContent.localeCompare(b.textContent);
    case 'number':
      return parseFloat(a.textContent) - parseFloat(b.textContent);
    case 'money':
      const first = parseFloat(a.textContent.replace(/[^0-9.]/g, ''));
      const second = parseFloat(b.textContent.replace(/[^0-9.]/g, ''));

      return first - second;
  }
}

function createForm() {
  table.insertAdjacentHTML(
    'afterend',
    `
      <form class="new-employee-form">
        <label>Name: <input name="name" type="text" data-qa="name" required></label>
        <label>Position: <input name="position" type="text"  data-qa="position" required></label>
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
        <label>Age: <input name="age" type="number" data-qa="age" required></label>
        <label>Salary: <input name="salary" type="number" step="any" data-qa="salary" required></label>
        <button name="submit" type="submit">Save to table</button>

      </form>
    `,
  );
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');
  const exictingNotification = document.querySelector('.notification');

  if (exictingNotification) {
    exictingNotification.remove();
  }

  body.insertAdjacentHTML(
    'beforeend',
    `
      <div class="notification ${type}" data-qa="notification">
        <h2 class="title">${title}</h2>
        <p>${description}</p>
      </div>
    `,
  );

  const notification = document.querySelector('.notification');

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';
  notification.style.opacity = '1';
  notification.style.transition = '1s';

  setTimeout(() => {
    notification.style.opacity = '0';

    notification.addEventListener(
      'transitionend',
      () => {
        notification.remove();
      },
      { once: true },
    ); // після відпрацювання анімації видалити
    // повідомлення і видалити відразу обробник
  }, 2000);
};

function createNewEmploye(formElements) {
  tbody.insertAdjacentHTML(
    'beforeend',
    `
    <tr>
      <td>${formElements.name.value}</td>
      <td>${formElements.position.value}</td>
      <td>${formElements.office.value}</td>
      <td>${formElements.age.value}</td>
      <td>$${parseFloat(formElements.salary.value).toLocaleString('en-US')}</td>
    </tr>
  `,
  );
}

function checkInput(firstValue, input) {
  let firstType;

  if (!input.value) {
    return true;
  }

  if (firstValue[0] === '$') {
    firstType = 'money';
  } else if (!isNaN(parseFloat(firstValue))) {
    firstType = 'number';
  } else {
    firstType = 'string';
  }

  switch (firstType) {
    case 'money':
      return /^\$([1-9]([,.])*)*[0-9]$/.test(input.value);
    case 'number':
      return /[0-9]+/.test(input.value);
    case 'string':
      return true;
  }
}

function checkForm() {
  const age = parseInt(form.age.value);
  const salary = parseFloat(form.salary.value);

  if (form.position.value.length < 4) {
    return {
      type: 'error',
      message: 'Position must be at least 2 characters',
    };
  }

  if (isNaN(salary)) {
    return {
      type: 'error',
      message: 'Incorrect salary value entered',
    };
  }

  if (form.name.value.length < 4) {
    return {
      type: 'error',
      message: 'Name value has less than 4 letters',
    };
  }

  if (age < 18 || age > 90) {
    return {
      type: 'error',
      message: 'Should be more than 18 and less than 90 ',
    };
  }

  return {
    type: 'success',
    message: 'Greate! A new employe was added!',
  };
}

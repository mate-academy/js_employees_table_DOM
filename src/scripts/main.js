'use strict';

const table = document.querySelector('table');
const thCollection = document.querySelectorAll('th');
/* arrayRows и notification объявляется в глобальной области т.к.
будет обновлена в нескольких событиях */
let arrayRows = [...table.tBodies[0].rows];

// Вместе с checkCount нужно для корректной сортировки
thCollection.forEach(element => {
  element.dataset.count = 0;
});

let checkCount = 0;

let notification = document.querySelector('.notification');

document.body.addEventListener('click', e => {
  const th = e.target.closest('th');
  const tr = e.target.closest('tr');

  function sorting(a, b) {
    const firstElement = a.cells[th.cellIndex].textContent;
    const secondtElement = b.cells[th.cellIndex].textContent;

    switch (th.cellIndex) {
      case 0:
      case 1:
      case 2:
        return +th.dataset.count === 0
          ? firstElement.localeCompare(secondtElement)
          : secondtElement.localeCompare(firstElement);

      case 3:
        return +th.dataset.count === 0
          ? +firstElement - +secondtElement
          : +secondtElement - +firstElement;

      case 4:
        const newfirseElement = firstElement.slice(1);
        const newSecondElement = secondtElement.slice(1);

        return +th.dataset.count === 0
          ? parseFloat(newfirseElement) - parseFloat(newSecondElement)
          : parseFloat(newSecondElement) - parseFloat(newfirseElement);
    }
  }

  if (th) {
    if (checkCount > 0 && th.dataset.count === '0') {
      thCollection.forEach(element => {
        element.dataset.count = 0;
        checkCount = 0;
      });
    }

    arrayRows.sort(sorting);
    +th.dataset.count === 0 ? ++th.dataset.count : --th.dataset.count;
    ++checkCount;

    table.tBodies[0].append(...arrayRows);
  }

  if (tr && !tr.closest('thead')) {
    arrayRows.forEach(el => {
      el.classList.remove('active');
    });
    tr.classList.add('active');
  }

  /* обновить переменную, что-бы удалить
  сообщение при попытке ввода новых данных */
  notification = document.querySelector('.notification');

  if (notification && e.target.closest('input')) {
    notification.remove();
  }
});

function showNotification(message, inform) {
  const div = document.createElement('div');

  div.classList.add(message, 'notification');
  div.textContent = inform;

  div.style.cssText = 'left: 0; top: calc(100% + 10px); font-size: 18px;'
    + 'color: black; display: flex; justify-content: center;'
    + 'align-items: center; text-transform: uppercase;';
  div.setAttribute('data-qa', 'notification');

  form.append(div);
}

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin',
  `<label>Name:
    <input required name="name" type="text" data-qa="name">
  </label>
  <label>Position:
    <input required name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" type="text" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input required name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button type="submit" class="submit">Save to table</button>`
);

document.body.append(form);

form.addEventListener('submit', ev => {
  ev.preventDefault();

  const employerTR = document.createElement('tr');

  const objectEmployer = {
    name: form.elements.name.value,
    position: form.elements.position.value,
    office: form.elements.office.value,
    age: form.elements.age.value,
    salary: form.elements.salary.value,
  };

  if (objectEmployer.name.length === 0
    || objectEmployer.position.length === 0
    || objectEmployer.age.length === 0
    || objectEmployer.salary.length === 0
  ) {
    showNotification('error', 'You should fill all inputs');

    return false;
  }

  if (objectEmployer.name.length < 4) {
    showNotification('error', 'Name field must contain at lest 4 letters');

    return false;
  }

  if (!Number.isNaN(+objectEmployer.position)) {
    showNotification('error', 'The Position field must contain only letters');

    return false;
  }

  if (objectEmployer.age < 18 || objectEmployer.age > 90) {
    showNotification('error', 'The age field must be between 18 and 90');

    return false;
  }

  employerTR.insertAdjacentHTML('afterbegin',
    `<td>${objectEmployer.name}</td>
    <td>${objectEmployer.position}</td>
    <td>${objectEmployer.office}</td>
    <td>${objectEmployer.age}</td>
    <td>${'$' + Intl.NumberFormat('en-US').format(objectEmployer.salary)}</td>`
  );

  showNotification('success', 'Employer is added');
  table.tBodies[0].append(employerTR);
  // обновить массив рядов таблицы после добавления сотрудника
  arrayRows = [...table.tBodies[0].rows];

  for (let i = 0; i < [...form.querySelectorAll('input')].length; i++) {
    form.querySelectorAll('input')[i].value = '';
  }
});

table.addEventListener('dblclick', e => {
  const td = e.target;

  if (!td.closest('td')) {
    return false;
  }

  const content = td.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');

  /* Обновить переменную, т.к. до этого она была null */
  notification = document.querySelector('.notification');

  if (notification && td) {
    notification.remove(); /* Удалить сообщение о добавлении / ошибке */
  }

  td.textContent = '';
  td.append(input);
  input.focus();

  input.onkeydown = function(ev) {
    if (ev.code === 'Enter') {
      input.blur();
    }
  };

  input.addEventListener('blur', function() {
    const tableDataCell = e.target.closest('td');
    const value = input.value;

    function setData(message) {
      showNotification('error', message);
      td.textContent = content;

      return false;
    }

    if (tableDataCell.cellIndex === 0) {
      if (value.length < 4 || !Number.isNaN(+value)) {
        return setData('The Name field must contain at lest 4 letters');
      }
    } else if (tableDataCell.cellIndex === 1) {
      if (!Number.isNaN(+value)) {
        return setData('The Position field must contain only letters');
      }
    } else if (tableDataCell.cellIndex === 3) {
      if ((+value < 18 || +value > 90) || Number.isNaN(+value)) {
        return setData('The age field must be between 18 and 90');
      }
    } else if (tableDataCell.cellIndex === 4) {
      if (Number.isNaN(+value)) {
        return setData('The salary field must contain only letters');
      }
    }

    input.remove();

    td.textContent = value;

    if (tableDataCell.cellIndex === 4) {
      td.textContent = '$' + Intl.NumberFormat('en-US').format(value);
    }
  });
});

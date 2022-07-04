'use strict';

// write code here
const body = document.querySelector('body');
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const tr = [...tbody.children];

// ACTIVE_ROW=============================================================
table.addEventListener('click', (events) => {
  const selectRowTbody = events.target.closest('td');

  if (!selectRowTbody) {
    return false;
  }

  tr.forEach(row => row.classList.remove('active'));
  selectRowTbody.parentElement.className = 'active';
});

// SORT_TABLE=============================================================

table.addEventListener('click', (events) => {
  const selectRowThead = events.target.closest('th');

  if (!selectRowThead) {
    return false;
  }

  if (events.target.className !== 'sortActive') {
    const trUnderThead = events.target.parentElement;
    const childTrUnderThead = [...trUnderThead.children];

    childTrUnderThead.forEach(findClass =>
      findClass.classList.remove('sortActive'));

    const indexHeader = events.target.cellIndex;

    const sortedASC = tr.sort((a, b) => {
      const x = a.cells[indexHeader].textContent.replace(/[$,]/g, '');
      const y = b.cells[indexHeader].textContent.replace(/[$,]/g, '');

      if (isNaN(x)) {
        return x.localeCompare(y);
      } else {
        return x - y;
      }
    });

    tbody.append(...sortedASC);
    events.target.className = 'sortActive';
  } else {
    const indexHeader = events.target.cellIndex;

    const sortedDESC = tr.sort((a, b) => {
      const x = a.cells[indexHeader].textContent.replace(/[$,]/g, '');
      const y = b.cells[indexHeader].textContent.replace(/[$,]/g, '');

      if (isNaN(x)) {
        return y.localeCompare(x);
      } else {
        return y - x;
      }
    });

    tbody.append(...sortedDESC);
    events.target.classList.remove('sortActive');
  }
});

// GET_data_from-FORM==========================================================
table.insertAdjacentHTML('afterend', `
<form action="/" method="GET" class="new-employee-form">
  <label>Name: <input name="name" type="text" data-qa="name"required></label>
  <label>Position:
    <input name="position" type="text" data-qa="position" >
  </label>
  <label>Office
    <select name="office" data-qa="office" required>
      <option value="Tokyo" >Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>
    Salary: <input name="salary" type="number" data-qa="salary" >
  </label>
  <button type="submit">Save to table</button>
</form>
`);

// Work with FORM_________________________________________

const notification = (type, textTitle, textParagraph) => {
  const div = document.createElement('div');
  const h2Notif = document.createElement('h2');
  const pNotif = document.createElement('p');

  h2Notif.textContent = textTitle;
  pNotif.textContent = textParagraph;

  div.setAttribute('data-qa', 'notification');
  div.classList = 'notification';
  div.classList.add(type);

  div.append(h2Notif);
  div.append(pNotif);

  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
};

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const newEmployee = Object.fromEntries(data.entries());
  const newSalary = newEmployee.salary;

  // Check INPUT_NAME ==================================================
  if (newEmployee.name.length <= 4) {
    // div.classList.add('error');

    notification('error',
      'Attention', 'Name string length is less than 5 letters');

    form.reset();

    return;
  }

  // Check INPUT_NAME_With_Numbers =========================================

  const checkName = [...newEmployee.name].some(letter =>
    !isNaN(Number(letter)));

  if (checkName === true) {
    notification('error',
      'Attention', 'The NAME has numbers, it is impossible');

    form.reset();

    return;
  }

  // Check INPUT_POSITION ==================================================

  const checkPosition = [...newEmployee.position].some(letter =>
    !isNaN(Number(letter)));

  if (checkPosition === true) {
    notification('error',
      'Attention', 'The POSITION has numbers, it is impossible');

    form.reset();

    return;
  }

  // Check INPUT_AGE_ENOUGH=========================================

  switch (true) {
    case newEmployee.age <= 18:
      notification('error',
        'Attention', 'You are not enough old for this statistic table');

      form.reset();

      return false;

    case newEmployee.age >= 90:
      notification('error',
        'Attention', 'You are enough old for this statistic table');

      form.reset();

      return false;
  }

  // IF_ALL_IS_OK=========================================
  notification('success',
    'Notification', 'WELCOME to this statistic table');

  form.reset();

  tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${newEmployee.name}</td>
    <td>${newEmployee.position}</td>
    <td>${newEmployee.office}</td>
    <td>${newEmployee.age}</td>
    <td>${'$' + newSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
  </tr>
`);
});

// WORK_WITH_DOUBLE_CLICK================================================

tbody.addEventListener('dblclick', (e) => {
  const selectRowTbody = e.target.closest('td');

  if (!selectRowTbody) {
    return false;
  }

  const textBeforCorect = e.target.textContent;

  const newInput = document.createElement('input');

  newInput.className = 'cell-input';
  newInput.type = 'text';

  const target = e.target;

  target.innerHTML = '';

  target.append(newInput);
  newInput.focus();

  const myNewInput = document.querySelector('.cell-input');

  // EFFECT_KEYDOWN===============================================

  newInput.addEventListener('keydown', (action) => {
    if (action.code === 'Enter' || action.code === 'NumpadEnter') {
      if (myNewInput.value.length === 0) {
        target.textContent = textBeforCorect;
      }

      if (target.cellIndex <= 2) {
        if (myNewInput.value.length < 4) {
          notification('warning',
            'Attention', 'Name string length is less than 5 letters');

          target.textContent = textBeforCorect;
        } else {
          target.textContent = myNewInput.value;
        }
      }

      if (target.cellIndex === 3) {
        switch (true) {
          case myNewInput <= 18:
            notification('warning',
              'Attention', 'You are not enough old for this statistic table');

            target.textContent = textBeforCorect;
            break;

          case myNewInput >= 90:
            notification('warning',
              'Attention', 'You are enough old for this statistic table');

            target.textContent = textBeforCorect;
            break;
        }
        target.textContent = myNewInput.value;
      }

      if (target.cellIndex === 4) {
        if (myNewInput.value < 1) {
          notification('warning',
            'Attention', 'The salary will be more then 0$');

          target.textContent = textBeforCorect;
        } else {
          target.textContent = '$'
            + myNewInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
    }
  });

  // EFFECT_BLUR_MOUSE===============================================
  newInput.addEventListener('blur', () => {
    if (myNewInput.value.length === 0) {
      target.textContent = textBeforCorect;
    }

    if (target.cellIndex <= 2) {
      if (myNewInput.value.length < 4) {
        notification('warning',
          'Attention', 'Name string length is less than 5 letters');

        target.textContent = textBeforCorect;
      } else {
        target.textContent = myNewInput.value;
      }
    }

    if (target.cellIndex === 3) {
      if (myNewInput.value <= 18) {
        target.textContent = textBeforCorect;

        notification('warning',
          'Attention', 'The age must be more then 18 years old');

        return;
      }

      if (myNewInput.value >= 90) {
        target.textContent = textBeforCorect;

        notification('warning',
          'Attention', 'You are enough old for this statistic table');

        return;
      }
    }

    if (target.cellIndex === 4) {
      if (myNewInput.value < 1) {
        notification('warning',
          'Attention', 'The salary will be more then 0$');

        target.textContent = textBeforCorect;
      } else {
        target.textContent = '$'
          + myNewInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
  });
});

'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tableBody = table.querySelector('tbody');

headers.forEach((header) => {
  header.dataset.sorted = 'DESC';
});

function sortColumn(index, isASC) {
  let sortedRows = [];

  if (isASC) {
    // eslint-disable-next-line chai-friendly/no-unused-expressions
    index === 4
      ? sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (salaryToNumber(a.cells[index].innerHTML)
        - salaryToNumber(b.cells[index].innerHTML)))
      : sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (a.cells[index].innerHTML.localeCompare(b.cells[index].innerHTML)));
  } else {
    // eslint-disable-next-line chai-friendly/no-unused-expressions
    index === 4
      ? sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (salaryToNumber(b.cells[index].innerHTML)
        - salaryToNumber(a.cells[index].innerHTML)))
      : sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (b.cells[index].innerHTML.localeCompare(a.cells[index].innerHTML)));
  }

  table.tBodies[0].append(...sortedRows);
}

headers.forEach((header, index) => {
  header.addEventListener('click', (e) => {
    let order;

    // eslint-disable-next-line chai-friendly/no-unused-expressions
    e.target.dataset.sorted === 'ASC'
      ? (e.target.dataset.sorted = 'DESC',
      order = false)
      : (e.target.dataset.sorted = 'ASC',
      order = true);

    sortColumn(index, order);
  });
});

function pushNotification(posTop, posRight, title, description, type) {
  document.body.insertAdjacentHTML('afterbegin', `
    <div data-qa="notification" class="notification ${type}"
      style="top: ${posTop}px; right: ${posRight}px;">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
    `);

  const notification = document.querySelector('.notification');

  setTimeout(() => notification.remove(), 2000);
}

table.insertAdjacentHTML('afterend', `
  <form class="new-employee-form">
    <label>Name: 
      <input
        data-qa="name"
        name="name"
        type="text"
        required
      >
    </label>
    <label>Position: 
      <input
        data-qa="position"
        name="position"
        type="text"
        required
      >
    </label>
    <label>Office: 
      <select data-qa="office" name="office" type="text">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: 
      <input
        data-qa="age"
        name="age"
        type="number"
        required
      >
    </label>
    <label>Salary: 
      <input
        data-qa="salary"
        name="salary"
        type="number"
        required
      >
    </label>
    <button>Save to table</button>
  </form>
 `);

const form = document.querySelector('.new-employee-form');

const button = form.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const personName = form.querySelector('[data-qa="name"]');
  const position = form.querySelector('[data-qa="position"]');
  const office = form.querySelector('[data-qa="office"]');
  const age = form.querySelector('[data-qa="age"]');
  const salary = form.querySelector('[data-qa="salary"]');

  if (formValidation(personName, position, age, salary)) {
    saveDataToTable(personName, position, office, age, salary);
    form.reset();
    unselectTable();
  };
});

function formValidation(personName, personPosition, personAge, personSalary) {
  if (personName.value.length < 4) {
    const nameStyle = form.querySelector('[data-qa="name"]');

    nameStyle.style.borderColor = '#e25644';

    setTimeout(() => {
      nameStyle.style.borderColor = '';
    }, 2000);

    pushNotification(450, 20, 'Щось пішло не так',
      `Name: меньше 4х символів`, 'error');

    return false;
  }

  if (personPosition.value.length < 1) {
    const positionStyle = form.querySelector('[data-qa="position"]');

    positionStyle.style.borderColor = '#e25644';

    setTimeout(() => {
      positionStyle.style.borderColor = '';
    }, 2000);

    pushNotification(450, 20, 'Щось пішло не так',
      `Position: не може бути пустим`, 'error');

    return false;
  }

  if (personAge.value < 18
    || personAge.value > 90) {
    const ageStyle = form.querySelector('[data-qa="age"]');

    ageStyle.style.borderColor = '#e25644';

    setTimeout(() => {
      ageStyle.style.borderColor = '';
    }, 2000);

    pushNotification(450, 20, 'Щось пішло не так',
      'Age: має бути від 18 до 90', 'error');

    return false;
  }

  if (personSalary.value.length < 1 || personSalary.value < 0) {
    const salaryStyle = form.querySelector('[data-qa="salary"]');

    salaryStyle.style.borderColor = '#e25644';

    setTimeout(() => {
      salaryStyle.style.borderColor = '';
    }, 2000);

    pushNotification(450, 20, 'Щось пішло не так',
      `Дохід не може бути пустим або від'ємним`, 'error');

    return false;
  }

  pushNotification(450, 20, 'Вау - це успіх',
    'Нові дані додано до таблиці', 'success');

  return true;
};

function saveDataToTable(personName, position, office, age, salary) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
     <td>${personName.value}</td>
     <td>${position.value}</td>
     <td>${office.value}</td>
     <td>${age.value}</td>
     <td>$${numberWithComma(salary.value)}</td>
   `;

  tableBody.append(tr);
};

function numberWithComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function salaryToNumber(text) {
  return +text.slice(1).replace(/,/g, '');
};

function unselectTable() {
  const trows = tableBody.querySelectorAll('tr');

  trows.forEach((tr) => {
    tr.classList.remove('active');
  });
};

tableBody.addEventListener('click', (e) => {
  const row = e.target;

  if (!row || !tableBody.contains(row)) {
    return;
  }

  unselectTable();
  row.closest('tr').classList.toggle('active');
});

tableBody.addEventListener('dblclick', (e) => {
  const row = e.target;

  if (!row || !tableBody.contains(row)) {
    return;
  }

  const trows = tableBody.querySelectorAll('td');
  const index = Array.from(trows).findIndex(n => n === row) % 5;
  const tempValue = row.innerText;
  let input;

  switch (index) {
    case 2:
      input = document.createElement('select');

      input.innerHTML = `
         <select>
           <option value="Tokyo">Tokyo</option>
           <option value="Singapore">Singapore</option>
           <option value="London">London</option>
           <option value="New York">New York</option>
           <option value="Edinburgh">Edinburgh</option>
           <option value="San Francisco">San Francisco</option>
         </select>
       `;
      break;
    case 3:
      input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'age value 18 - 90';
      break;
    case 4:
      input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'just a number';
      break;
    default:
      input = document.createElement('input');
      input.type = 'text';
  }

  row.innerText = '';
  row.append(input);
  input.focus();

  input.onblur = () => {
    inputValidation(index);
  };

  input.addEventListener('keydown', (evt) => {
    if (evt.code !== 'Enter') {
      return;
    }

    inputValidation(index);
  });

  const inputValidation = (i) => {
    if (input.value !== '') {
      switch (i) {
        case 0:
          if (input.value.length < 4) {
            row.innerText = tempValue;

            pushNotification(450, 20, 'Щось пішло не так',
              `Name: меньше 4х символів`, 'error');
            break;
          }
          row.innerText = input.value;
          break;
        case 3:
          if (input.value < 18 || input.value > 90) {
            row.innerText = tempValue;

            pushNotification(450, 20, 'Щось пішло не так',
              'Вік має бути від 18 до 90', 'error');
            break;
          }
          row.innerText = input.value;
          break;
        case 4:
          if (input.value < 0) {
            row.innerText = tempValue;

            pushNotification(450, 20, 'Щось пішло не так',
              'Перевірь правельність введених даних', 'error');
            break;
          }
          row.innerText = `$${numberWithComma(input.value)}`;
          break;
        default:
          row.innerText = input.value;
      }
    } else {
      row.innerText = tempValue;
    }
    input.remove();
  };
});

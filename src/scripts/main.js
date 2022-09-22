'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tableBody = table.querySelector('tbody');

headers.forEach(function(header) {
  header.dataset.sorted = 'DESC';
});

function sortColumn(index, isASC) {
  let sortedRows = [];

  if (isASC) {
    if (index === 4) {
      sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (salaryToNumber(a.cells[index].innerHTML)
        - salaryToNumber(b.cells[index].innerHTML)));
    } else {
      sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (a.cells[index].innerHTML.localeCompare(b.cells[index].innerHTML)));
    }
  } else {
    if (index === 4) {
      sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (salaryToNumber(b.cells[index].innerHTML)
        - salaryToNumber(a.cells[index].innerHTML)));
    } else {
      sortedRows = Array.from(tableBody.rows).sort((a, b) =>
        (b.cells[index].innerHTML.localeCompare(a.cells[index].innerHTML)));
    }
  }

  table.tBodies[0].append(...sortedRows);
}

headers.forEach(function(header, index) {
  header.addEventListener('click', (evnt) => {
    let order;

    if (evnt.target.dataset.sorted === 'ASC') {
      evnt.target.dataset.sorted = 'DESC';
      order = false;
    } else {
      evnt.target.dataset.sorted = 'ASC';
      order = true;
    }
    sortColumn(index, order);
  });
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add('notification', type);
  div.dataset.qa = 'notification';
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;
  div.style.boxSizing = 'content-box';
  h2.classList.add('title');
  h2.innerText = `${title}`;
  p.innerText = `${description}`;

  div.append(h2, p);
  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: 
    <input name="name" type="text" data-qa="name" 
      required pattern="[A-Za-z]{4,}">
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
    <input name="age" type="number" 
      data-qa="age" required 
      min="18" max="90">
  </label>
  <label>Salary: 
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`;

table.after(form);

const button = form.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const personName = form.querySelector('[data-qa="name"]');
  const position = form.querySelector('[data-qa="position"]');
  const office = form.querySelector('[data-qa="office"]');
  const age = form.querySelector('[data-qa="age"]');
  const salary = form.querySelector('[data-qa="salary"]');

  if (formValidation(personName, age)) {
    saveDataToTable(personName, position, office, age, salary);
    form.reset();
    unselectTable();
  };
});

function formValidation(personName, personAge) {
  if (personName.value.length < 4
    || personAge.value < 18
    || personAge.value > 90) {
    pushNotification(450, 20, 'Error',
      'Check your entries, please', 'error');

    return false;
  }

  pushNotification(450, 20, 'Success',
    'The data was saved succesfully', 'success');

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
}

function salaryToNumber(text) {
  return +text.slice(1).replace(/,/g, '');
};

function unselectTable() {
  const trs = tableBody.querySelectorAll('tr');

  trs.forEach(function(tr) {
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

  const trs = tableBody.querySelectorAll('td');
  const index = Array.from(trs).findIndex(n => n === row) % 5;
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
      input.placeholder = 'age 18 - 90';
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

  input.onblur = function() {
    inputValidation(index);
  };

  input.addEventListener('keydown', (ev) => {
    if (ev.code !== 'Enter') {
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

            pushNotification(450, 20, 'Error',
              'Check your entries, please', 'error');
            break;
          }
          row.innerText = input.value;
          break;
        case 3:
          if (input.value < 18 || input.value > 90) {
            row.innerText = tempValue;

            pushNotification(450, 20, 'Error',
              'Check your entries, please', 'error');
            break;
          }
          row.innerText = input.value;
          break;
        case 4:
          if (input.value < 0) {
            row.innerText = tempValue;

            pushNotification(450, 20, 'Error',
              'Check your entries, please', 'error');
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

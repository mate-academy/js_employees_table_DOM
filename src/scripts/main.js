'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead > tr > th');
const tbody = table.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

const pushNotification = (description, type) => {
  const notification = document.createElement('div');

  notification.classList.add(`notification`);
  notification.classList.add(`${type}`);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
  <h2 class="title">${type}</h2>
  <p>${description}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

function sortTable(arr, count, header, index) {
  return arr.sort((rowA, rowB) => {
    let cellA = rowA.children[index].textContent;
    let cellB = rowB.children[index].textContent;

    if (count % 2 === 0) {
      cellA = rowB.children[index].textContent;
      cellB = rowA.children[index].textContent;
    }

    if (header.textContent === 'Salary') {
      const parseSalary = (salary) => parseFloat(salary.replace(/[$,]/g, ''));

      return parseSalary(cellA) - parseSalary(cellB);
    }

    if (header.textContent === 'Age') {
      return parseInt(cellA) - parseInt(cellB);
    }

    return cellA.localeCompare(cellB);
  });
}

headers.forEach((header, index) => {
  let count = 0;

  header.addEventListener('click', () => {
    count++;

    const rowsArray = Array.from(rows);

    const sortedRows = sortTable(rowsArray, count, header, index);

    tbody.append(...sortedRows);
  });
});

tbody.addEventListener('click', (e) => {
  const activeRow = e.target.closest('tr');

  if (!activeRow) {
  }

  rows.forEach((element) => {
    element.classList.remove('active');
  });

  activeRow.classList.add('active');
});

addForm();

const employeName = document.querySelector('input[name="name"]');
const position = document.querySelector('input[name="position"]');
const office = document.querySelector('select[name="office"]');
const age = document.querySelector('input[name="age"]');
const employeSalary = document.querySelector('input[name="salary"]');
const button = document.querySelector('button[name="save"]');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const newEmployee = {
    name: employeName.value,
    position: position.value,
    office: office.value,
    age: age.value,
    salary: employeSalary.value,
  };
  const row = document.createElement('tr');

  switch (formValidation(newEmployee)) {
    case 'name': {
      pushNotification('Not valid name', 'error');
      break;
    }

    case 'position': {
      pushNotification('Not valid position', 'error');
      break;
    }

    case 'age': {
      pushNotification('Not valid age', 'error');
      break;
    }

    default: {
      for (const key in newEmployee) {
        const td = document.createElement('td');

        td.textContent = newEmployee[key];

        if (key === 'salary') {
          const validSalary = new Intl.NumberFormat('en-US').format(
            newEmployee[key],
          );

          td.textContent = `$${validSalary}`;
        }

        row.appendChild(td);
      }

      tbody.appendChild(row);
      pushNotification('Employe added to the table!', 'success');
    }
  }
});

function addForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" required data-qa="name"></label>
    <label>Position: <input name="position" type="text" required data-qa="position" ></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" required data-qa="age" ></label>
    <label>Salary: <input name="salary" type="number" required data-qa="salary"></label>
    <button name="save" type="submit">Save to table</button>
  `;

  document.querySelector('body').appendChild(form);
}

function formValidation(employe) {
  if (employe.name.length < 4) {
    return 'name';
  }

  if (employe.position.length < 4) {
    return 'position';
  }

  if (employe.age < 18 || employe.age > 90) {
    return 'age';
  }
}

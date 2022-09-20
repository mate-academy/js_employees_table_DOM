'use strict';

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const employeesList = [];

function getEmployees(list) {
  const employee = {
    name: list[0],
    position: list[1],
    office: list[2],
    age: list[3],
    salary: list[4],
  };

  return employee;
}

for (const child of tableBody.children) {
  const arrayEmployees = child.innerText.split('\t');
  const employeeRow = getEmployees(arrayEmployees);

  employeesList.push(employeeRow);
}

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>

    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>

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

    <label>Age:
      <input name="age" type="number" data-qa="age">
    </label>

    <label>Salary:
      <input name="salary" type="number" data-qa="salary">
    </label>

    <button>Save to table</button>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());

  if (dataObject.name.length < 4) {
    pushNotification('Wrong name!',
      'Name should be more than 4 letters. Correct it!', 'error');

    return;
  }

  if (dataObject.age < 18 || dataObject.age > 90) {
    pushNotification('Wrong age!',
      'Employee dhould be adult and not older than 90 years.', 'error');

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${capitalizePhrase(dataObject.name)}</td>
    <td>${capitalizePhrase(dataObject.position)}</td>
    <td>${dataObject.office}</td>
    <td>${dataObject.age}</td>
    <td>${createSalary(dataObject.salary)}</td>
</tr>
  `);

  pushNotification('Success!',
    'New employee is successfully added to the table', 'success');
});

function pushNotification(title, description, type) {
  const body = document.body;
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.dataset.qa = 'notification';

  div.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;
  body.append(div);

  setTimeout(() => {
    body.removeChild(div);
  }, 2000);
};

function capitalizePhrase(word) {
  return word.replace(/(^|\s)\S/g, function(char) {
    return char.toUpperCase();
  });
}

function createSalary(number) {
  return `$${parseFloat(number).toLocaleString('en-US')}`;
}

let sortedList = false;

tableHeader.addEventListener('click', e => {
  const element = e.target;

  switch (element.innerText) {
    case ('Name'):
      const sortedByName = sortName(employeesList);

      if (sortedList) {
        addSortedColumn(sortedByName.reverse());
        sortedList = false;
      } else {
        addSortedColumn(sortedByName);
        sortedList = true;
      }

      break;

    case ('Position'):
      const sortedByPosition = sortPosition(employeesList);

      if (sortedList) {
        addSortedColumn(sortedByPosition.reverse());
        sortedList = false;
      } else {
        addSortedColumn(sortedByPosition);
        sortedList = true;
      }

      break;

    case ('Office'):
      const sortedByOffice = sortOffice(employeesList);

      if (sortedList) {
        addSortedColumn(sortedByOffice.reverse());
        sortedList = false;
      } else {
        addSortedColumn(sortedByOffice);
        sortedList = true;
      }
      break;

    case ('Age'):
      const sortedByAge = sortAge(employeesList);

      if (sortedList) {
        addSortedColumn(sortedByAge.reverse());
        sortedList = false;
      } else {
        addSortedColumn(sortedByAge);
        sortedList = true;
      }
      break;

    case ('Salary'):
      const sortedBySalary = sortSalary(employeesList);

      if (sortedList) {
        addSortedColumn(sortedBySalary.reverse());
        sortedList = false;
      } else {
        addSortedColumn(sortedBySalary);
        sortedList = true;
      }
      break;
  }
});

function sortName(list) {
  return list.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

function sortPosition(list) {
  return list.sort((a, b) => {
    return a.position.localeCompare(b.position);
  });
}

function sortOffice(list) {
  return list.sort((a, b) => {
    return a.office.localeCompare(b.office);
  });
}

function sortAge(list) {
  return list.sort((a, b) => {
    const age1 = createNumber(a.age);
    const age2 = createNumber(b.age);

    return age1 - age2;
  });
}

function sortSalary(list) {
  return list.sort((a, b) => {
    const salaryA = createNumber(a.salary);
    const salaryB = createNumber(b.salary);

    return salaryA - salaryB;
  });
}

function addSortedColumn(array) {
  tableBody.innerHTML = '';

  return array.forEach(object => {
    tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${object.name}</td>
      <td>${object.position}</td>
      <td>${object.office}</td>
      <td>${object.age}</td>
      <td>${object.salary}</td>
    </tr>
    `);
  });
}

function createNumber(string) {
  if (string.includes('$')) {
    return +(string.slice(1).replace(',', '.'));
  } else {
    return +string;
  }
}

tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const choosenRow = tableBody.querySelector('.active');

  if (choosenRow) {
    choosenRow.classList.remove('active');
  }

  row.classList.add('active');
});

tableBody.addEventListener('dblclick', e => {
  const choosenCell = e.target.innerText;
  let input = document.createElement('input');

  e.target.innerText = null;
  input.className = 'cell-input';
  input.type = 'text';
  input.value = '';

  if (e.target.tagName !== 'TD') {
    return;
  }

  if (e.target.cellIndex >= 3) {
    input.type = 'number';
  }

  if (e.target.cellIndex === 2) {
    const select = document.createElement('select');

    select.dataset.qa = 'office';

    select.insertAdjacentHTML('beforeend', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>`);

    input = select;
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (input.value === '') {
      e.target.innerText = choosenCell;

      return;
    }

    if (e.target.cellIndex <= 2) {
      e.target.innerText = capitalizePhrase(input.value);

      return;
    }

    if (e.target.cellIndex === 4) {
      if (parseInt(input.value)) {
        e.target.innerText = createSalary(input.value);

        return;
      }
    }

    e.target.innerText = input.value;
    input.remove();
  });

  input.addEventListener('keydown', eventKeyDown => {
    if (eventKeyDown.code === 'Enter') {
      input.blur();
    }
  });
});

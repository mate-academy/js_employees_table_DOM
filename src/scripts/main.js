'use strict';

const table = document.querySelector('table');
const tbodyRows = [...table.tBodies[0].rows];
const tbody = document.querySelector('tbody');

let direction = null;

const sortTableString = (cellIndex) => {
  const sortString = tbodyRows.sort((prev, current) => {
    const prevStr = prev.cells[cellIndex].textContent;
    const currentStr = current.cells[cellIndex].textContent;

    if (direction === 'desc') {
      return currentStr.localeCompare(prevStr);
    }

    return prevStr.localeCompare(currentStr);
  });

  table.tBodies[0].append(...sortString);
};

function sortTableNumber(cellNumber) {
  const sortNumber = tbodyRows.sort((prevStr, currentStr) => {
    const prevNum = toNumber(prevStr.cells[cellNumber].innerText);
    const currentNum = toNumber(currentStr.cells[cellNumber].innerText);

    if (direction === 'desc') {
      return currentNum - prevNum;
    }

    return prevNum - currentNum;
  });

  table.tBodies[0].append(...sortNumber);
}

function toNumber(string) {
  const numb = +string.replace(/\D/g, '');

  return numb;
}

table.tHead.addEventListener('click', (e) => {
  switch (true) {
    case (e.target.cellIndex === 0):
      if (direction === null) {
        sortTableString(0);
        direction = 'asc';
      } else if (direction === 'asc') {
        sortTableString(0);
        direction = 'desc';
      } else {
        sortTableString(0);
        direction = 'asc';
      }

      return;

    case (e.target.cellIndex === 1):
      if (direction === null) {
        sortTableString(10);
        direction = 'asc';
      } else if (direction === 'asc') {
        sortTableString(1);
        direction = 'desc';
      } else {
        sortTableString(1);
        direction = 'asc';
      }

      return;

    case (e.target.cellIndex === 2):
      if (direction === null) {
        sortTableString(2);
        direction = 'asc';
      } else if (direction === 'asc') {
        sortTableString(2);
        direction = 'desc';
      } else {
        sortTableString(2);
        direction = 'asc';
      }

      return;

    case (e.target.cellIndex === 3):
      if (direction === null) {
        sortTableNumber(3);
        direction = 'asc';
      } else if (direction === 'asc') {
        sortTableNumber(3);
        direction = 'desc';
      } else {
        sortTableNumber(3);
        direction = 'asc';
      }

      return;

    case (e.target.cellIndex === 4):
      if (direction === null) {
        sortTableNumber(4);
        direction = 'asc';
      } else if (direction === 'asc') {
        sortTableNumber(4);
        direction = 'desc';
      } else {
        sortTableNumber(4);
        direction = 'asc';
      }
  }
});

tbody.addEventListener('click', (e) => {
  tbodyRows.forEach(elem => {
    elem.classList = '';
  });

  e.target.parentNode.classList = 'active';
});

table.insertAdjacentHTML('afterend', `
  <form class= "new-employee-form">
    <label>
      Name: <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position: <input name="position" type="text" data-qa="position" required>
    </label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option selected>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>
      Age: <input name="age" type="number"
      data-qa="age" min= 0 max= 100 required>
    </label>
    <label>
      Salary: <input name="salary" type="number"
        data-qa="salary" min= 0 max= 100 required>
    </label>
    <button name="button" type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

function createNotification(titleAndClass, description) {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="notification data-qa="notification" ${titleAndClass}">
      <span class="title">${titleAndClass}</span>
      <p>${description}</p>
    </div>
  `);

  const message = document.querySelector('.notification');

  setTimeout(() => {
    message.remove();
  }, 2000);
}

form.elements.button.addEventListener('click', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const f = Object.fromEntries(data.entries());

  if (f.name.length < 4
      || +f.age < 18
      || +f.age > 90
      || !isNaN(f.position)
      || !isNaN(f.name)) {
    createNotification('error', 'Please enter correct data');
    form.reset();

    return;
  }

  const NewtrForTable = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tdName.innerText = f.name;
  tdPosition.innerText = f.position;
  tdOffice.innerText = f.office;
  tdAge.innerText = f.age;
  tdSalary.innerText = `$${f.salary.toLocaleString('en-US')}`;
  NewtrForTable.append(tdName, tdPosition, tdOffice, tdAge, tdSalary);
  tbodyRows.push(NewtrForTable);
  tbody.append(NewtrForTable);

  form.reset();
  createNotification('success', 'Correct data, You added new row');
});

let initialValue;

tbody.addEventListener('dblclick', (event2) => {
  const input = document.createElement('input');
  const td = event2.target;

  initialValue = td.innerHTML;
  input.value = td.innerHTML;
  input.className = 'cell-input';
  td.innerHTML = '';
  td.append(input);

  if (td.cellIndex === 3) {
    if (+input.value < 18 || +input.value < 90) {
      input.value = initialValue;
    }
  }

  if (td.cellIndex === 4) {
    input.value = `$${td.textContent.toLocaleString('en-US')}`;
  }

  input.addEventListener('blur', () => {
    if (input.value === '') {
      td.textContent = initialValue;
      input.remove();

      return;
    }

    if (td.cellIndex === 3) {
      if (+input.value < 18 || +input.value > 90 || isNaN(input.value)) {
        td.textContent = initialValue;
        input.remove();

        return;
      }
    }

    td.innerHTML = input.value.trim();
    input.remove();
  });

  input.addEventListener('keydown', (e) => {
    if (input.value === '' && e.key === 'Enter') {
      td.textContent = initialValue;
      input.remove();

      return;
    }

    if (e.key === 'Enter') {
      td.textContent = input.value.trim();
      input.remove();
    }
  });
});

'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const headers = table.querySelectorAll('thead th');
let rows = table.querySelectorAll('tbody tr');
const doc = document.querySelector('body');
const countryArray = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
  `Kyiv`,
];
const positionArray = [
  'Accountant',
  'Data Coordinator',
  'Developer',
  'Financial Controller',
  'Integration Specialist',
  'Javascript Developer',
  'QA Engineer',
  'Marketing Designer',
  'Regional Director',
  'Regional Marketing',
  'Software Engineer',
  'Technical Author',
];
const headerIndexArr = Array(5).fill(0);

// Sort table in two ways
const sortTatble = (el) => {
  const headerArr = [...headers];
  const rowArr = [...rows];
  const headerIndex = headerArr.indexOf(el.target);

  rowArr.sort((a, b) => {
    let tdA = a.children[headerIndex].innerHTML;
    let tdB = b.children[headerIndex].innerHTML;

    if (el.target.innerHTML === 'Salary') {
      tdA = +a.children[headerIndex].innerHTML
        .replace('$', '')
        .replace(',', '');

      tdB = +b.children[headerIndex].innerHTML
        .replace('$', '')
        .replace(',', '');
    }

    if (tdA > tdB) {
      return 1;
    } else if (tdA < tdB) {
      return -1;
    } else {
      return 0;
    }
  });

  if (headerIndexArr[headerIndex] % 2 === 0) {
    rowArr.forEach((item) => table.append(item));
    headerIndexArr[headerIndex]++;
  } else {
    rowArr.forEach((item) => table.prepend(item));
    headerIndexArr[headerIndex]--;
  }
};

for (const item of headers) {
  item.addEventListener('click', sortTatble);
}

// When user clicks on a row, it should become selected.
tbody.addEventListener('click', function() {
  rows = table.querySelectorAll('tbody tr');

  for (const row of rows) {
    row.addEventListener('click', (el) => {
      const target = el.target.parentElement;

      [...rows].forEach(item => {
        item.classList.remove('active');
      });
      target.classList.add('active');
    });
  }
});

// Notification function
const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');
  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');
  const coords = {
    x: 10,
    y: 10,
  };

  message.classList.add('notification', `${type}`);
  message.style.top = `${coords.x}px`;
  message.style.right = `${coords.y}px`;
  message.setAttribute('data-qa', 'notification');
  h2.classList.add('title');
  h2.textContent = title;
  p.textContent = description;
  message.append(h2, p);
  body.append(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
};

// Add a form to the document.
const formAdd = `
  <form action="/" method="post" class="new-employee-form">
    <label for="name">Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        id="name"
        required
      >
    </label>
    <label for="position">Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        id="position"
        required
      >
    </label>
    <label for="office">
      Office:
      <select name="office" id="office" data-qa="office">
      ${countryArray.map(country => `
        <option value='${country}'>${country}</option>
      `)}
      </select>
    </label>
    <label for="age">Age:
      <input name="age"
        type="number"
        min="18"
        max="90"
        step="1"
        data-qa="age"
        id="age"
        required
      >
    </label>
    <label for="salary">Salary:
      <input
        name="salary"
        type="number"
        min="5000"
        max="5000000"
        step="500"
        data-qa="salary"
        id="salary"
        required
      >
    </label>
    <button type="submit" class="js-add-employee">Save to table</button>
  </form>
`;

doc.insertAdjacentHTML('beforeend', formAdd);

// Save data to table
const saveToTableBtn = document.querySelector('.js-add-employee');

const addEmployee = (el) => {
  const newEmployeeName = document.querySelector('#name');
  const newEmployeePosition = document.querySelector('#position');
  const newEmployeeOffice = document.querySelector('#office');
  const newEmployeeAge = document.querySelector('#age');
  const newEmployeeSalary = document.querySelector('#salary');

  function formatSalary(value) {
    return `$${new Intl.NumberFormat().format(value)}`;
  }

  const tr = `
    <td>${newEmployeeName.value.trim()}</td>
    <td>${newEmployeePosition.value}</td>
    <td>${newEmployeeOffice.value}</td>
    <td>${newEmployeeAge.value}</td>
    <td>${formatSalary(newEmployeeSalary.value)}</td>
  `;

  if (newEmployeeName.value.length < 4) {
    pushNotification('Wrong', 'Name length less then 4 digits', 'error');

    return;
  }

  if (newEmployeePosition.value.length === 0
    || !positionArray.includes(newEmployeePosition.value)) {
    pushNotification('Wrong', `Position didn't match with existing position`,
      'error'
    );

    return;
  }

  if (newEmployeeAge.value < 18 || newEmployeeAge.value > 90) {
    pushNotification(
      'Wrong',
      'There is error in Age of Employee. Please check it.',
      'error'
    );

    return;
  }

  if (newEmployeeSalary.value.length === 0) {
    pushNotification('Wrong', `Salary can't be negative or zero.`, 'error');

    return;
  }

  pushNotification('Success',
    `Look's everything is okay. Check table :)`,
    'success'
  );
  tbody.insertAdjacentHTML('beforeend', tr);
  newEmployeeName.value = '';
  newEmployeePosition.value = '';
  newEmployeeAge.value = '';
  newEmployeeSalary.value = '';
};

saveToTableBtn.addEventListener('click', addEmployee);

// Double click on the cell of the table
const changeTableCell = (cell) => {
  const editCell = cell.target;
  const prevTextContent = editCell.textContent;
  const cellIndex = editCell.cellIndex;
  const input = document.createElement('input');
  const select = document.createElement('select');

  input.classList.add('cell-input');
  input.style.padding = `18px`;

  select.style.border = `1px solid #808080`;
  select.style.borderRadius = `4px`;
  select.style.color = `#808080`;
  select.style.marginTop = `14px`;
  select.style.padding = `4px`;
  select.style.outlineColor = `#808080`;

  if (cellIndex === 1) {
    editCell.replaceWith(select);

    select.innerHTML = `${positionArray.map(position =>
      `<option value="${position}">${position}</option>`).join('')}`;
    select.focus();
  } else if (cellIndex === 2) {
    editCell.replaceWith(select);

    select.innerHTML = `${countryArray.map(position =>
      `<option value="${position}">${position}</option>`).join('')}`;
    select.focus();
  } else {
    editCell.replaceWith(input);
    input.focus();
  }

  const changeText = () => {
    const td = document.createElement('td');

    const successChange = () => {
      td.textContent = input.value;
      input.replaceWith(td);
      pushNotification('Success', `Look's everything is okay. :)`, 'success');
    };

    const unSuccessChange = (errorText) => {
      td.textContent = prevTextContent;
      input.replaceWith(td);
      pushNotification('Wrong', `${errorText}`, 'error');
    };

    switch (cellIndex) {
      case 0:
        if (input.value.length < 4) {
          unSuccessChange('Name must be at least 4 digits');
        } else {
          successChange();
        }
        break;
      case 1:
        td.textContent = select.value;
        select.replaceWith(td);
        pushNotification('Success', `Look's everything is okay. :)`, 'success');
        break;
      case 2:
        td.textContent = select.value;
        select.replaceWith(td);
        pushNotification('Success', `Look's everything is okay. :)`, 'success');
        break;
      case 3:
        if (+input.value < 18 || +input.value > 90) {
          unSuccessChange('Age must be from 18 to 90. Please try again.');
        } else {
          td.textContent = input.value;
          successChange();
        }
        break;
      case 4:
        if (+input.value < 0
            || input.value.length === 0
            || typeof input.value === 'string'
        ) {
          unSuccessChange(
            `Salary can't be negative / empty or word. Please try again.`
          );
        } else {
          td.textContent = `$${new Intl.NumberFormat().format(input.value)}`;
          input.replaceWith(td);
        }
        break;
    }
  };

  input.addEventListener('blur', changeText);
  select.addEventListener('blur', changeText);

  input.addEventListener('keydown', (key) => {
    if (key.key === 'Enter') {
      changeText();
    }
  });

  select.addEventListener('keydown', (press) => {
    if (press.key === 'Enter') {
      changeText();
    }
  });
};

tbody.addEventListener('dblclick', changeTableCell);

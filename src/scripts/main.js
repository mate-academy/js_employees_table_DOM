'use strict';

const body = document.querySelector('body');
const table = document.querySelector('tbody');
const head = document.querySelector('thead');
let sortedParam;
const dataArray = [];

const container = document.createElement('div');

body.style.alignItems = 'flex-start';
body.append(container);
container.style.flexDirection = 'column';

// Convert salary to number
function salaryToNumber(salary) {
  return salary.slice(1).split(',').join('');
}

// Convert salary to render format
function toFormat(data) {
  let resultString = data.toString();
  const result = [];

  do {
    if (resultString.length % 3) {
      result.push(resultString.slice(0, resultString.length % 3));
      resultString = resultString.slice(resultString.length % 3);
    }
    result.push(resultString.slice(0, 3));
    resultString = resultString.slice(3);
  } while (resultString.length > 0);

  return `$${result.join(',')}`;
}

// Create array from table
for (const row of table.children) {
  const rowObject = {};

  rowObject.name = row.children[0].innerText;
  rowObject.position = row.children[1].innerText;
  rowObject.office = row.children[2].innerText;
  rowObject.age = row.children[3].innerText;
  rowObject.salary = +salaryToNumber(row.children[4].innerText);
  dataArray.push(rowObject);
}

createTable();

// Sort table function
function sortTable(toSort, colum) {
  const direction = sortedParam === colum;

  sortedParam = sortedParam === colum ? '' : colum;

  if (!direction) {
    if (typeof toSort[0][colum.toLowerCase()] === 'string') {
      toSort.sort((a, b) =>
        a[colum.toLowerCase()].localeCompare(b[colum.toLowerCase()]));
    } else {
      toSort.sort((a, b) => a[colum.toLowerCase()] - b[colum.toLowerCase()]);
    }
  } else {
    if (typeof toSort[0][colum.toLowerCase()] === 'string') {
      toSort.sort((a, b) =>
        b[colum.toLowerCase()].localeCompare(a[colum.toLowerCase()]));
    } else {
      toSort.sort((a, b) => b[colum.toLowerCase()] - a[colum.toLowerCase()]);
    }
  }

  createTable();
}

// Create Table from object
function createTable() {
  table.innerHTML = `${dataArray.map(element => `
    <tr class="row">
      <td data-qa="name">${element.name}</td>
      <td data-qa="position">${element.position}</td>
      <td data-qa="office">${element.office}</td>
      <td data-qa="age">${element.age}</td>
      <td data-qa="salary">${toFormat(element.salary)}</td>
    </tr>
  `).join('')}`;
}

// Sort table Event
head.addEventListener('click', (evnt) => {
  sortTable(dataArray, evnt.target.innerText);
});

// Slect Row
table.addEventListener('click', (evnt) => {
  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  const selectedRow = evnt.target.closest('.row');

  selectedRow.classList.add('active');
});

// Create Form
const form = document.createElement('form');

form.className = 'new-employee-form';
container.style.display = 'flex';

form.innerHTML = `
  <label>
    Name: 
      <input name="name" 
        type="text"
        class="new-name"
        data-qa="name"
        required
      >
  </label>
  <label>
    Position: 
      <input name="position" 
        
        class="new-position"
        data-qa="position"
        required
      >
  </label>
  <label>
    Office: 
      <select name="office"
        class="new-office"
        data-qa="office"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
  </label>
  <label>
    Age: 
      <input name="age" 
        type="number"
        class="new-age"
        data-qa="age"
        min="18"
        max="90"
        required
      >
  </label>
  <label>
    Salary: 
      <input name="salary" 
        class="new-sallary"
        type="number"
        data-qa="salary"
        required
      >
  </label>

  <button type="submit" class="form-button">Save to table</button>
`;

container.append(form);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  document.getElementById('form').reset();
});

const newName = form.querySelector('.new-name');
const newPosition = form.querySelector('.new-position');
const newOffice = form.querySelector('.new-office');
const newAge = form.querySelector('.new-age');
const newSallary = form.querySelector('.new-sallary');
const formButton = form.querySelector('.form-button');

// Add new employee
formButton.addEventListener('click', () => {
  const rowObject = {};

  if (newName.value === '' || newPosition.value === ''
  || newAge.value === '' || newSallary.value === '') {
    return;
  }

  if (newName.value.length < 4) {
    pushNotification('Error',
      'Name must be longer than 4 letters', 'error');

    return;
  }

  if (newAge.value < 18 || newAge.value > 90) {
    pushNotification('Error',
      'Age must be beetwen 18 and 90 years', 'error');

    return;
  }

  rowObject.name = newName.value;
  rowObject.position = newPosition.value;
  rowObject.office = newOffice.value;
  rowObject.age = newAge.value;
  rowObject.salary = +newSallary.value;
  dataArray.push(rowObject);

  createTable();

  pushNotification('Success',
    'A new employee is successfully added to the table', 'success');

  newName.value = '';
  newPosition.value = '';
  newAge.value = '';
  newSallary.value = '';
});

// Notification's

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.style.position = 'static';
  message.className = 'notification ' + type;
  messageTitle.className = 'title';
  messageDescription.innerText = description;
  messageTitle.innerText = title;
  message.append(messageTitle);
  message.append(messageDescription);
  message.style.marginLeft = '24px';
  message.style.marginTop = '24px';
  container.append(message);

  setTimeout(() => message.remove(), 2000);
};

// Edit Cell

table.addEventListener('dblclick', (evnt) => {
  if (!document.querySelector('.cell-input')) {
    const row = evnt.target.closest('.row');
    const rowObject = {};
    const cell = evnt.target;
    const editCell = document.createElement('input');

    editCell.className = 'cell-input';

    rowObject.name = row.children[0].innerText;
    rowObject.position = row.children[1].innerText;
    rowObject.office = row.children[2].innerText;
    rowObject.age = row.children[3].innerText;
    rowObject.salary = +salaryToNumber(row.children[4].innerText);

    const index = dataArray.findIndex(x => x.name === rowObject.name);
    const atribute = evnt.target.dataset.qa;

    cell.innerHTML = '';
    cell.append(editCell);

    editCell.addEventListener('keydown', (evnt2) => {
      if (evnt2.key === 'Enter') {
        editCell.blur();
      }
    });

    const initialValue = dataArray[index][atribute];

    editCell.addEventListener('blur', () => {
      let valueToSet = editCell.value;

      if (!editCell.value) {
        valueToSet = initialValue;
        createTable();
      }

      if (atribute === 'salary') {
        dataArray[index][atribute] = +valueToSet;
      } else {
        dataArray[index][atribute] = valueToSet;
      }
      editCell.remove();
      createTable();
    });
  }
});

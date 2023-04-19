'use strict';

const tableHeader = document.querySelector('thead');

const rowList = document.querySelectorAll('tbody >tr');
const tbody = document.querySelector('tbody');

const thead = document.querySelector('thead>tr');
const headerNames = document.querySelectorAll('thead>tr>th');

for (const nameClicked of headerNames) {
  nameClicked.isClicked = false;
};

tableHeader.addEventListener('click', (e) => {
  const item = e.target.textContent;

  let children = 0;

  for (let i = 0; i < thead.children.length; i++) {
    if (item === thead.children[i].textContent) {
      children = i;
    }
  }

  const listArr = [...rowList];

  if (e.target.isClicked === false) {
    if (item === 'Salary') {
      listArr.sort((x, y) =>
        (+y.children[children].textContent.replace(/,/g, '').replace('$', ''))
      - (+x.children[children].textContent.replace(/,/g, '').replace('$', '')));
    } else {
      listArr.sort((x, y) =>
        y.children[children].textContent
          .localeCompare(x.children[children].textContent));
    }

    for (const element of listArr) {
      tbody.prepend(element);
    }
    e.target.isClicked = true;

    return;
  };

  if (e.target.isClicked === true) {
    if (item === 'Salary') {
      listArr.sort((x, y) =>
        (+x.children[children].textContent.replace(/,/g, '').replace('$', ''))
      - (+y.children[children].textContent.replace(/,/g, '').replace('$', '')));
    } else {
      listArr.sort((x, y) =>
        x.children[children].textContent
          .localeCompare(y.children[children].textContent));
    }

    for (const element of listArr) {
      tbody.prepend(element);
    }

    e.target.isClicked = false;

    return;
  };
});

tbody.addEventListener('click', (e) => {
  for (const line of [...rowList]) {
    line.classList.remove('active');
  }

  e.target.parentElement.className = 'active';
});

const body = document.querySelector('body');
const formCreate = document.createElement('form');

body.append(formCreate);
formCreate.className = 'new-employee-form';

formCreate.innerHTML = `
<label>
  Name: 
  <input data-qa="name" type="text" name="name" required>
</label>

<label >
Position: 
<input  data-qa="position" type="text" name="position" required>
</label>

<label >
Office:
  <select data-qa="office"  required>
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
  </select>
</label>

<label >
Age: 
<input data-qa="age" type="number" name="age" required>
</label>

<label >
Salary: 
<input data-qa="salary" type="number" name="salary" required>
</label>

<button type="submitt">Save to table</button>
`;

const button = document.querySelector('button');
const row = document.createElement('tr');
const div = document.createElement('div');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const person = document.querySelector('input[data-qa="name"]').value;
  const position = document.querySelector('input[data-qa="position"]').value;
  const office = document.querySelector('select[data-qa="office"]').value;
  const age = document.querySelector('input[data-qa="age"]').value;
  const salary = document.querySelector('input[data-qa="salary"]').value;

  const salaryFormal = '$' + Intl.NumberFormat('en-US').format(salary);

  if (person.length < 4) {
    body.append(div);
    div.dataset.qa = `notification`;
    div.className = `notification error`;

    div.innerHTML = `<h2 class='title'>ERROR </h2>
    <p> Name  has less than 4 letters</p>`;

    return;
  }

  if (position.length < 4) {
    body.append(div);
    div.dataset.qa = `notification`;
    div.className = `notification error`;

    div.innerHTML = `<h2 class='title'>ERROR </h2>
    <p> position  has less than 4 letters</p>`;

    return;
  }

  if (age < 18 || age > 90) {
    body.append(div);
    div.dataset.qa = `notification`;
    div.className = `notification error`;

    div.innerHTML = `<h2 class='title'>ERROR </h2>
    <p> Age value is less than 18 or more than 90.</p>`;

    return;
  }

  const newrow = row.cloneNode(true);

  tbody.append(newrow);

  tbody.lastElementChild.innerHTML = `
    <td>${person}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salaryFormal}</td>`;

  body.append(div);
  div.dataset.qa = `notification`;
  div.className = `notification success`;

  div.innerHTML = `<h2 class='title'> success </h2>
    <p> A new employee is successfully added to the table</p>`;
});

let editedCell = null; // Хранит ссылку на редактируемую ячейку

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (cell && !editedCell) {
    const cellText = cell.textContent;

    cell.textContent = '';

    const input = document.createElement('input');

    input.className = 'cell-input';

    cell.append(input);
    input.focus();

    editedCell = cell;

    input.addEventListener('blur', () => {
      const newСellText = input.value || cellText;

      cell.textContent = newСellText;
      editedCell = null;
    });

    input.addEventListener('keydown', () => {
      if (e.key === 'Enter') {
        const newСellText = input.value || cellText;

        cell.textContent = newСellText;
        editedCell = null;
      }
    });
  }
});

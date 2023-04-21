'use strict';

const tableHeader = document.querySelector('thead');

let rowList = document.querySelectorAll('tbody >tr');
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

  function removeSumbolSalary(a) {
    return +a.children[children].textContent.replace(/,/g, '').replace('$', '');
  }

  if (!e.target.isClicked) {
    if (item === 'Salary') {
      listArr.sort((x, y) => removeSumbolSalary(y) - removeSumbolSalary(x));
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

  if (e.target.isClicked) {
    if (item === 'Salary') {
      listArr.sort((x, y) => removeSumbolSalary(x) - removeSumbolSalary(y));
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

function notificationError() {
  body.append(div);
  div.dataset.qa = `notification`;
  div.className = `notification error`;

  div.innerHTML = `<h2 class='title'>ERROR </h2>
  <p>  Incorrect data entry </p>`;

  setTimeout(() => {
    div.remove();
  }, 2000);
}

function notificationSuccess() {
  body.append(div);
  div.dataset.qa = `notification`;
  div.className = `notification success`;

  div.innerHTML = `<h2 class='title'> success </h2>
    <p> Information saved </p>`;

  setTimeout(() => {
    div.remove();
  }, 2000);
}

button.addEventListener('click', (e) => {
  e.preventDefault();

  const person = document.querySelector('input[data-qa="name"]');
  const position = document.querySelector('input[data-qa="position"]');
  const office = document.querySelector('select[data-qa="office"]');
  const age = document.querySelector('input[data-qa="age"]');
  const salary = document.querySelector('input[data-qa="salary"]');

  function clearInput() {
    setTimeout(() => {
      person.value = '';
      position.value = '';
      office.value = '';
      age.value = '';
      salary.value = '';
    }, 1000);
  }

  if (person.value.trim().length < 4 || position.value.trim().length < 4) {
    notificationError();

    return;
  }

  if (age.value < 18 || age.value > 90) {
    notificationError();

    return;
  }

  const newrow = row.cloneNode(true);

  tbody.append(newrow);

  tbody.lastElementChild.innerHTML = `
    <td>${person.value}</td>
    <td>${position.value}</td>
    <td>${office.value}</td>
    <td>${age.value}</td>
    <td>${'$' + Intl.NumberFormat('en-US').format(salary.value)}</td>`;

  rowList = document.querySelectorAll('tbody >tr');

  notificationSuccess();
  clearInput();
});

let editedCell = null;

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

    if ((cell === cell.parentElement.children[2])) {
      input.remove();

      cell.parentElement.children[2].insertAdjacentHTML('afterbegin', `
        <label >
          <select data-qa="cell-input"  required>
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
          </select>
        </label> `);
      editedCell = null;
    }

    input.addEventListener('blur', () => {
      switch (cell) {
        case cell.parentElement.children[0]:
        case cell.parentElement.children[1]:

          if (input.value.length >= 4) {
            cell.textContent = input.value;
            notificationSuccess();
          } else {
            cell.textContent = cellText;

            notificationError();
          }
          break;

        case cell.parentElement.children[3]:

          if ((+input.value > 18) && (+input.value < 90)) {
            cell.textContent = input.value;
            notificationSuccess();
          } else {
            notificationError();

            cell.textContent = cellText;
          }
          break;

        case cell.parentElement.children[4]:

          if (+input.value >= 0) {
            cell.textContent
            = '$' + Intl.NumberFormat('en-US').format(input.value);
            notificationSuccess();
          } else {
            cell.textContent = cellText;

            notificationError();
          }
          break;
      }

      editedCell = null;
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        switch (cell) {
          case cell.parentElement.children[0]:
          case cell.parentElement.children[1]:

            if (input.value.length >= 4) {
              cell.textContent = input.value;
              notificationSuccess();
            } else {
              cell.textContent = cellText;

              notificationError();
            }
            break;

          case cell.parentElement.children[3]:

            if ((+input.value > 18) && (+input.value < 90)) {
              cell.textContent = input.value;
              notificationSuccess();
            } else {
              notificationError();

              cell.textContent = cellText;
            }
            break;

          case cell.parentElement.children[4]:

            if (+input.value >= 0) {
              cell.textContent
              = '$' + Intl.NumberFormat('en-US').format(input.value);
              notificationSuccess();
            } else {
              cell.textContent = cellText;

              notificationError();
            }
            break;
        }

        editedCell = null;
      }
    });
  }
});

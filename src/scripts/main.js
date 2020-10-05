'use strict';

const bodyOfTable = document.querySelector('tbody');
const headOfTable = document.querySelector('thead');
let sortedColumn;

function sortTable(event) {
  const columnIndex = event.target.cellIndex;
  const workers = [...bodyOfTable.children];

  if (event.target.textContent === sortedColumn) {
    workers.reverse();
  } else {
    sortedColumn = event.target.textContent;

    workers.sort((a, b) => {
      if (!toNumber(a.cells[columnIndex].innerText)) {
        return a.cells[columnIndex].innerText
          .localeCompare(b.cells[columnIndex].innerText);
      }

      return toNumber(a.cells[columnIndex].innerText)
    - toNumber(b.cells[columnIndex].innerText);
    });
  }

  bodyOfTable.append(...workers);
}

function toNumber(value) {
  if (+value) {
    return +value;
  } else {
    return +value.slice(1).split(',').join('');
  }
};

headOfTable.addEventListener('click', sortTable);

function selectWorker() {
  const rows = [...bodyOfTable.children];

  bodyOfTable.addEventListener('click', (event) => {
    const clickedPoint = event.target.parentNode;

    rows.map(worker => worker.classList.remove('active'));
    clickedPoint.classList.add('active');
  });
}
selectWorker();

function CreateForm() {
  const form = document.createElement('form');
  const offices = ['Tokyo', 'Singapore', 'London',
    'New York', 'Edinburgh', 'San Francisco'];
  let officeOption = '';

  for (const office in offices) {
    officeOption += `<option value="${office}">${offices[office]}</option>`;
  }

  form.classList = 'new-employee-form';

  form.insertAdjacentHTML('afterbegin', `
    <label> Name:
      <input 
        name= "name" 
        id = "name"
        type="text" required
      >
    </label>
    
    <label> Position:
      <input 
        name = "position"
        id = "position"
        type = "text" required
      >
    </label>
    
    <label> Office:
      <select name="office" id = "office">
        ${officeOption}
      </select>
    </label>
    
    <label> Age:
      <input 
        name = "age"
        id = "age"
        type ="number" required
      >
    </label>  
    <label> Salary:
      <input 
        name = "salary"
        id = "salary"
        type = "number" required
      >
    </label>
    <button>
      <type = "submit">
        Save to table
    </button>
  `);

  function employerAddAndValidator() {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const tr = document.createElement('tr');
      const column = ['name', 'position', 'office', 'age', 'salary'];

      for (let i = 0; i < column.length; i++) {
        const td = document.createElement('td');
        let salary = document.querySelector('input[name=salary]').value;
        const age = document.querySelector('input[name=age]').value;
        const name = document.querySelector('input[name=name]').value;

        td.textContent = document.getElementById(column[i]).value;
        tr.append(td);

        if (column[i] === 'salary') {
          salary = salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          td.textContent = `$${salary}`;
        }

        if (name.length < 4) {
          pushNotification('10px', '10px', 'Error!',
            `Name can't be less then 4 letters`,
            `error`
          );

          return;
        };

        if (age < 18) {
          pushNotification('10px', '10px', 'Error!',
            `Age can't be less then 18`,
            `error`
          );

          return;
        };

        if (age > 90) {
          pushNotification('10px', '10px', 'Error!',
            `Age can't be bigger then 90`,
            `error`
          );

          return;
        }
      }

      bodyOfTable.append(tr);
      sortedColumn = null;

      pushNotification('10px', '10px', 'Congratulations',
        `You are the new employer`,
        `success`
      );
    });
  }
  employerAddAndValidator();

  document.body.append(form);
}
CreateForm();

const pushNotification = (top, right, title, description, type) => {
  const elemDiv = document.createElement('div');

  document.body.append(elemDiv);
  elemDiv.classList.add('notification', type);

  const head = document.createElement('h2');

  head.className = title;
  head.innerText = `${title}`;
  elemDiv.append(head);

  const descript = document.createElement('p');

  descript.innerText = `${description}`;
  elemDiv.append(descript);

  elemDiv.style.top = `${top}px`;
  elemDiv.style.right = `${right}px`;

  setTimeout(() => {
    elemDiv.remove();
  }, 5000);
};

function saveValue(td, input, defaultValue) {
  if (!input.value) {
    td.textContent = defaultValue;

    return;
  }
  td.textContent = input.value;
}

function editTable() {
  bodyOfTable.addEventListener('dblclick', (event) => {
    const input = document.createElement('input');
    const clickedCell = event.target;
    const defaultValue = clickedCell.innerText;

    input.classList.add('cell-input');
    input.value = defaultValue;
    clickedCell.textContent = '';
    clickedCell.append(input);
    input.focus();

    input.addEventListener('blur', () =>
      saveValue(clickedCell, input, defaultValue)
    );

    input.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        saveValue(clickedCell, input, defaultValue);
      }
    }
    );
  });
}
editTable();

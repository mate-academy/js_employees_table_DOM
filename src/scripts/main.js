'use strict';

const bodyOfTable = document.querySelector('tbody');
const headOfTable = document.querySelector('thead');
const form = document.createElement('form');
let sortDirection = 'asc';
let clickCell = 0;
const workers = [...bodyOfTable.children];

function sorting() {
  headOfTable.addEventListener('click', (event) => {
    const sortBy = event.target.innerText;

    switch (sortBy) {
      case 'Name':
        if (clickCell === 0 && sortDirection !== 'asc') {
          workers.sort((a, b) => {
            return b.children[0].innerText
              .localeCompare(a.children[0].innerText);
          });
          sortDirection = 'asc';
          clickCell = event.target.cellIndex;
        } else {
          workers.sort((a, b) => {
            return a.children[0].innerText
              .localeCompare(b.children[0].innerText);
          });
          sortDirection = 'desc';
          clickCell = event.target.cellIndex;
        }

        break;
      case 'Position':
        if (clickCell === 1 && sortDirection !== 'asc') {
          workers.sort((a, b) => {
            return b.children[1].innerText
              .localeCompare(a.children[1].innerText);
          });
          sortDirection = 'asc';
          clickCell = event.target.cellIndex;
        } else {
          workers.sort((a, b) => {
            return a.children[1].innerText
              .localeCompare(b.children[1].innerText);
          });
          sortDirection = 'desc';
          clickCell = event.target.cellIndex;
        }

        break;
      case 'Office':
        if (clickCell === 2 && sortDirection !== 'asc') {
          workers.sort((a, b) => {
            return b.children[2].innerText
              .localeCompare(a.children[2].innerText);
          });
          sortDirection = 'asc';
          clickCell = event.target.cellIndex;
        } else {
          workers.sort((a, b) => {
            return a.children[2].innerText
              .localeCompare(b.children[2].innerText);
          });
          sortDirection = 'desc';
          clickCell = event.target.cellIndex;
        }

        break;
      case 'Age':
        if (clickCell === 3 && sortDirection !== 'asc') {
          workers.sort((a, b) => {
            return +b.children[3].innerText - +a.children[3].innerText;
          });
          sortDirection = 'asc';
          clickCell = event.target.cellIndex;
        } else {
          workers.sort((a, b) => {
            return +a.children[3].innerText - +b.children[3].innerText;
          });
          sortDirection = 'desc';
          clickCell = event.target.cellIndex;
        }

        break;
      case 'Salary':
        if (clickCell === 4 && sortDirection !== 'asc') {
          workers.sort((a, b) => {
            return (+b.children[4].innerText.slice(1).split(',').join('')
              - +(a.children[4].innerText.slice(1).split(',').join('')));
          });
          sortDirection = 'asc';
          clickCell = event.target.cellIndex;
        } else {
          workers.sort((a, b) => {
            return (+a.children[4].innerText.slice(1).split(',').join('')
              - +(b.children[4].innerText.slice(1).split(',').join('')));
          });
          sortDirection = 'desc';
          clickCell = event.target.cellIndex;
        }

        break;
    }
    bodyOfTable.append(...workers);
  });
}
sorting();

function selectWorker() {
  for (let i = 0; i < workers.length; i++) {
    workers[i].addEventListener('click', (event) => {
      for (let j = 0; j < workers.length; j++) {
        workers[j].classList.remove('active');
      }
      event.target.parentElement.classList.add('active');
    });
  };
}
selectWorker();

function CreateForm() {
  form.classList = 'new-employee-form';
  document.body.append(form);

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
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
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

function employerAddValidator() {
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

    pushNotification('10px', '10px', 'Congratulations',
      `You are the new employer`,
      `success`
    );
  });
}
employerAddValidator();

function editTable() {
  bodyOfTable.addEventListener('dblclick', (event) => {
    const input = document.createElement('input');
    const cell = event.target;
    const defaultValue = cell.innerText;

    input.classList.add('cell-input');
    input.value = defaultValue;
    cell.textContent = '';
    cell.append(input);
    input.focus();
  });
}
editTable();

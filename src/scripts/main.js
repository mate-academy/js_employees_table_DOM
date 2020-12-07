'use strict';

const tHead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rowsArray = Array.from(tbody.rows);
let firstHeaderClick = false;

function sort() {
  tHead.addEventListener('click', (e) => {
    const th = e.target;

    const sortTable = function(colNum = 0) {
      if (firstHeaderClick) {
        firstHeaderClick = false;

        const compare = function(rowA, rowB) {
          if (rowA.cells[colNum].innerHTML.charAt(0) === '$') {
            return rowA.cells[colNum].innerHTML
              .split('$').join('').split(',').join('.')
                - rowB.cells[colNum].innerHTML
                  .split('$').join('').split(',').join('.');
          }

          return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML
            ? 1 : -1;
        };

        rowsArray.sort(compare);
      } else {
        firstHeaderClick = true;

        const compare = function(rowA, rowB) {
          if (rowA.cells[colNum].innerHTML.charAt(0) === '$') {
            return rowB.cells[colNum].innerHTML
              .split('$').join('').split(',').join('.')
                - rowA.cells[colNum].innerHTML
                  .split('$').join('').split(',').join('.');
          }

          return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML
            ? -1 : 1;
        };

        rowsArray.sort(compare);
      }

      tbody.append(...rowsArray);
    };

    sortTable(th.cellIndex, th.dataset.type);
  });
}

function addActiveClass() {
  tbody.addEventListener('click', (e) => {
    const previousSelectedRow = document.querySelector('tr.active');

    if (previousSelectedRow) {
      previousSelectedRow.classList.remove('active');
    }

    const tb = e.target;
    const trow = tb.closest('TR');

    trow.classList.add('active');
  });
}

function createForm() {
  const form = document.createElement('FORM');

  form.classList.add('new-employee-form');

  form.insertAdjacentHTML('afterbegin',
    `<label>Name: <input name="name" id="name" type="text" required></label> 
    <label>Position: <input name="position"
     id="position" type="text" required></label>
    <label>Office: 
        <select id="citySelect" required>
            <option value="Tokyo">Tokyo</option>
            <option value="Singapore">Singapore</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="San Francisco">San Francisco</option>
        </select>
    </label>
    <label>Age: <input name="age" id="age" type="number" required></label>
    <label>Salary: <input name="salary"
     id="salary" type="number" required></label>
    <button type="submit" value="Save to table">Save to table</button>`);

  document.body.appendChild(form);
}

function saveToTable() {
  const saveButton = document.querySelector('button');

  saveButton.addEventListener('click', (e) => {
    e.preventDefault();

    const newRow = document.createElement('TR');
    const nameValue = document.querySelector('#name').value;
    const positionValue = document.querySelector('#position').value;
    const cityValue = document.querySelector('#citySelect').value;
    const ageValue = document.querySelector('#age').value;
    const salaryValue = document.querySelector('#salary').value;

    const salary = '$' + Number(salaryValue).toLocaleString('en-US');

    if (nameValue.length < 4) {
      alert('This name is very short');
    } else if (ageValue < 18 || ageValue > 90) {
      alert('You need to be older than 18 or younger than 90!');
    } else if (nameValue && positionValue
        && cityValue && ageValue && salaryValue) {
      newRow.insertAdjacentHTML('afterbegin',
        `<td>${nameValue}</td>
        <td>${positionValue}</td>
        <td>${cityValue}</td>
        <td>${ageValue}</td>
        <td>${salary}</td>`);

      tbody.appendChild(newRow);
      alert('Success adding to the table!');
    } else {
      alert('You need to fill all inputs');
    }
  });
};

function changeCellText() {
  const table = document.querySelector('table');
  const cells = table.tBodies[0];

  cells.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (cell.tagName === 'TD') {
      const cellText = cell.innerText;

      cell.innerHTML = '';

      cell.insertAdjacentHTML('afterbegin',
        `<input class="cell-input">`);

      const cellInput = document.querySelector('.cell-input');

      cellInput.addEventListener('keypress', (ev) => {
        ev.stopPropagation();

        if (ev.key === 'Enter') {
          const cellInputValue = cellInput.value;

          if (cell.innerText.length === 0) {
            cell.innerText = cellText;
          }

          if (cellInputValue.length > 0) {
            cell.innerHTML = cellInputValue;
          }
        }
      });

      cellInput.addEventListener('blur', (ev) => {
        ev.stopPropagation();

        const cellInputValue = cellInput.value;

        if (cell.innerText.length === 0) {
          cell.innerText = cellText;
        }

        if (cellInputValue.length > 0) {
          cell.innerHTML = cellInputValue;
        }
      });
    }
  });
}

sort();
addActiveClass();
createForm();
saveToTable();
changeCellText();

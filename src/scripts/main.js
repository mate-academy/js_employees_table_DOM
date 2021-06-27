'use strict';

const table = document.querySelector('table');
const tableRows = table.tBodies[0].rows;
let clickedCell = '';
let isCellClicked = false;

function convertToNumber(salaryString) {
  const recString = salaryString.slice(1);
  const salaryNumber = +recString.split(',').join('');

  return salaryNumber;
}

table.tHead.onclick = function(e) {
  const target = e.target;
  const cellName = target.innerText;

  isCellClicked = (cellName === clickedCell);

  const sortedArr = Array.from(tableRows);

  switch (cellName) {
    case 'Name':
    case 'Position':
    case 'Office':
      sortStr();
      break;
    case 'Age':
      sortNum();
      break;
    case 'Salary':
      sortSalary();
      break;
  }

  function sortStr() {
    sortedArr.sort((a, b) => {
      if (isCellClicked) {
        return a.cells[target.cellIndex].innerText
        > b.cells[target.cellIndex].innerText
          ? -1
          : 1;
      } else {
        return a.cells[target.cellIndex].innerText
        > b.cells[target.cellIndex].innerText
          ? 1
          : -1;
      };
    });
  };

  function sortNum() {
    sortedArr.sort((a, b) => {
      if (isCellClicked) {
        return a.cells[target.cellIndex].innerText
        - b.cells[target.cellIndex].innerText;
      } else {
        return b.cells[target.cellIndex].innerText
        - a.cells[target.cellIndex].innerText;
      };
    });
  }

  function sortSalary() {
    sortedArr.sort((a, b) => {
      if (isCellClicked) {
        return convertToNumber(a.cells[target.cellIndex].innerText)
        - convertToNumber(b.cells[target.cellIndex].innerText);
      } else {
        return convertToNumber(b.cells[target.cellIndex].innerText)
        - convertToNumber(a.cells[target.cellIndex].innerText);
      };
    });
  };

  clickedCell = target.innerText;

  table.tBodies[0].append(...sortedArr);
};

table.tBodies[0].onclick = function(e) {
  const target = e.target;
  const currentActive = table.tBodies[0].querySelector('.active');

  if (currentActive) {
    currentActive.classList.remove('active');
  };

  target.parentElement.classList.add('active');
};

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
<label>Name: <input name="Name" type="text" data-qa="name" required></label>
<label>Position: 
  <input name="Position" type="text" data-qa="position" required></label>
<label>Office:
  <select id="office" name="Office" data-qa="office" required>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>Age: <input name="Age" type="number" data-qa="age" required></label>
<label>Salary: 
  <input name="Salary" type="number" data-qa="salary" required></label>
<button>Save to table</button>
`;

document.body.append(form);

const saveButton = form.querySelector('button');

saveButton.onclick = function(e) {
  const personName = form.elements.Name.value;
  const age = form.elements.Age.value;
  const position = form.elements.Position.value;
  const office = form.elements.Office.value;
  const salary = +form.elements.Salary.value;

  if (personName.length < 4) {
    pushNotification(10, 10, 'Error', 'name should be >= 4 symbols', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(10, 10, 'Error', 'age should be between 18 & 90', 'error');

    return;
  }

  if (!personName || !position || !age || !salary) {
    pushNotification(10, 10, 'Error', 'Required fields are empty', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${personName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${(salary).toLocaleString('en-US')}</td>
  `;

  table.tBodies[0].append(newRow);
  pushNotification(10, 10, 'Success', 'employee is added', 'success');
  e.preventDefault();
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  document.body.style.position = 'relative';

  div.dataset.qa = 'notification';
  div.classList.add('notification');
  div.classList.add(type);

  div.innerHTML = `<h2 class='title'>${title}</h2>
  <p>${description}</p>`;

  div.style.top = posTop + 'px';
  div.style.position = 'absolute';
  div.style.right = posRight + 'px';

  document.body.append(div);
  setTimeout(() => div.remove(), 3000);
};

table.tBodies[0].addEventListener('dblclick', (e) => {
  const changeValue = e.target;
  const removedTxt = changeValue.innerText;

  changeValue.innerHTML = `
    <input name="cell-input" class='cell-input' value='${removedTxt}'>`;

  const input = document.querySelector('.cell-input');

  function changeCell(ev) {
    changeValue.innerHTML = ev.target.value || removedTxt;
    ev.target.remove();
  };

  input.onblur = changeCell;

  input.onkeydown = function(ev) {
    if (ev.code === 'Enter') {
      this.blur();
    }
  };
});

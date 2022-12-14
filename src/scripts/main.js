'use strict';

// write code here
const tableHeader = document.querySelector('thead');
const table = document.querySelector('tbody');

const displayStatus = function(posTop, posRight, title, description, type) {
  const body = document.body;
  const block = document.createElement('div');
  const blockTitle = document.createElement('h2');
  const message = document.createElement('p');

  block.classList.add('notification', type);
  block.dataset.qa = 'notification';
  blockTitle.className = 'title';
  blockTitle.textContent = title;
  message.innerText = description;

  block.style.width = 'max-content';
  block.style.top = `${posTop}px`;
  block.style.right = `${posRight}px`;

  block.append(blockTitle, message);
  body.append(block);

  setTimeout(() => block.remove(), 4000);
};

function addSortingListener() {
  const addTable = (array, element) => {
    if (!element.sortedASC) {
      array.forEach(tr => {
        table.append(tr);
      });

      element.sortedASC = true;

      return;
    }

    if (element.sortedASC) {
      [...array].reverse().forEach(tr => {
        table.append(tr);
      });

      element.sortedASC = false;
    }
  };

  function getSortedArray(array, index) {
    const result = array.sort((row1, row2) => {
      if (row1.cells[index].innerText[0] === '$') {
        const cellOne = +row1.cells[index].innerText.slice(1).replace(/,/g, '');
        const cellTwo = +row2.cells[index].innerText.slice(1).replace(/,/g, '');

        return cellOne - cellTwo;
      }

      return (
        row1.cells[index].textContent
          .localeCompare(row2.cells[index].textContent)
      );
    });

    return result;
  }

  tableHeader.addEventListener('click', (e) => {
    const title = e.target.closest('th');

    if (!title) {
      return;
    }

    switch (title.textContent) {
      case 'Name':
        addTable(getSortedArray(Array.from(table.rows), 0), title);
        break;
      case 'Position':
        addTable(getSortedArray(Array.from(table.rows), 1), title);
        break;
      case 'Office':
        addTable(getSortedArray(Array.from(table.rows), 2), title);
        break;
      case 'Age':
        addTable(getSortedArray(Array.from(table.rows), 3), title);
        break;
      case 'Salary':
        addTable(getSortedArray(Array.from(table.rows), 4), title);
        break;
    }
  });
}

function addRowSelection() {
  table.addEventListener('click', e => {
    const targetRow = e.target.closest('tr');
    const rows = Array.from(table.querySelectorAll('tr'));

    for (const row of rows) {
      if (row !== targetRow && row.className === 'active') {
        row.className = '';
      }
    }

    targetRow.className = 'active';
  });
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';
  form.method = 'post';

  const formHTML = `
    <label>Name: <input data-qa="name" name="name" type="text" required></label>
    <label>Position: 
      <input 
        data-qa="position" 
        name="position" 
        type="text" 
        required>
    </label>
    <label>Office: <select data-qa="office" name="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: 
      <input 
        data-qa="age" 
        name="age" 
        type="number" 
        required>
    </label>
    <label>Salary: 
      <input 
        data-qa="salary" 
        name="salary" 
        type="number" 
        required>
    </label>
    <button type="submit">Save to table</button>
  `;

  form.insertAdjacentHTML('afterbegin', formHTML);
  document.querySelector('table').insertAdjacentElement('afterend', form);
}

function addFormDataToTable() {
  const form = document.querySelector('.new-employee-form');

  const clearForm = function() {
    const fields = Array.from(document.querySelectorAll('input'));

    fields.forEach(function(field) {
      field.value = '';
    });
  };

  const appendNewEmployee = (data) => {
    const tr = document.createElement('tr');
    const salary = Number.parseInt(data.get('salary')).toLocaleString('en-US');
    const employeeHTML = `
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>$${salary}</td>
    `;

    tr.insertAdjacentHTML('afterbegin', employeeHTML);
    table.append(tr);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    let isValid = true;
    let message;

    if (formData.get('name').length < 4) {
      isValid = false;
      message = 'Name should be more than 4 characters long';
      displayStatus(100, 10, 'Invalid data', message, 'error');
    }

    if (+formData.get('age') < 18 || +formData.get('age') > 90) {
      isValid = false;
      message = 'Enter correct age';
      displayStatus(250, 10, 'Invalid data', message, 'error');
    }

    if (isValid) {
      message = 'Employee successfully added';
      displayStatus(390, 10, 'Success', message, 'success');
      appendNewEmployee(formData);
      clearForm();
    }
  });
}

function addCellUpdateListener() {
  const createInput = function(placeholder, editIndex) {
    if (editIndex === 2) {
      const select = document.createElement('select');

      select.className = 'cell-input';

      select.innerHTML = `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
      `;

      return select;
    }

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.placeholder = `${placeholder}`;

    return input;
  };

  table.addEventListener('dblclick', e => {
    const targetCell = e.target.closest('td');

    if (!targetCell) {
      return;
    }

    const cellParent = targetCell.parentElement;
    const cellIndex = targetCell.cellIndex;

    targetCell.style.display = 'none';

    const inputCell = cellParent.insertCell(cellIndex);

    inputCell.insertAdjacentElement(
      'afterbegin', createInput(targetCell.textContent, cellIndex)
    );

    const input = document.querySelector('.cell-input');
    input.focus();

    ['blur', 'change'].forEach(function(inputEvent) {
      input.addEventListener(inputEvent, () => {
        if (input.value !== '' && validateEdit(input.value, cellIndex)) {
          targetCell.textContent = cellIndex === 4
            ? `$${Number.parseInt(input.value).toLocaleString('en-US')}`
            : input.value;
        }

        inputCell.remove();
        targetCell.style.display = '';
      });
    });

    const validateEdit = function(value, index) {
      let isLegit = true;
      let message;

      switch (index) {
        case 0:
        case 1:
          if (value.length < 4) {
            message = 'Field should be more than 4 character long.';
            displayStatus(100, 10, 'Invalid data', message, 'error');
            isLegit = false;
          }
          break;

        case 3:
          if (isNaN(value)) {
            message = 'Field should have a number type';
            displayStatus(100, 10, 'Invalid data', message, 'error');
            isLegit = false;
          }

          if (+value < 18 || +value > 90) {
            message = 'Incorrect age';
            displayStatus(200, 10, 'Invalid data', message, 'error');
            isLegit = false;
          }
          break;

        case 4:
          if (isNaN(value)) {
            message = 'Should be a number';
            displayStatus(100, 10, 'Invalid data', message, 'error');
            isLegit = false;
          }
          break;
      }

      return isLegit;
    };
  });
}

addSortingListener();
addRowSelection();
createForm();
addFormDataToTable();
addCellUpdateListener();

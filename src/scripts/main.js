/* eslint-disable max-len */
'use strict';

const tableBody = document.querySelector('tbody');
const allEmployees = tableBody.rows;

// sort list
const headers = document.querySelectorAll('th');
let currSortedCol = null;

const sortList = (colIndex) => {
  [...allEmployees]
    .sort((prev, next) => {
      const prevContent = prev.children[colIndex].textContent;
      const nextContent = next.children[colIndex].textContent;

      const returnResult = (colIndex === 4)
        ? convertToNumber(prevContent) - convertToNumber(nextContent)
        : (prevContent).localeCompare(nextContent);

      return (currSortedCol === colIndex)
        ? returnResult * -1
        : returnResult;
    })
    .forEach(item => tableBody.append(item));
};

// add click events to titles
headers.forEach((header, index) => {
  header.addEventListener('click', function() {
    sortList(index);
    currSortedCol = (currSortedCol === index) ? null : index;
  });
});

// helper fn
const convertToNumber = number => number.replace('$', '').replace(',', '');
const convertToCurrency = string => `$${Number(string).toLocaleString('en-US')}`;

// add selection on row click
function initRowSelection() {
  [...tableBody.rows].forEach(row => {
    row.addEventListener('click', function() {
      [...tableBody.rows].forEach(person => {
        person.classList.remove('active');
      });
      row.classList.add('active');
    });
  });
};

initRowSelection();

// add form
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
    <label>Name: <input name="name" type="text" id="name" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Office:
      <select name = "office" data-qa="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
`;

form.addEventListener('submit', addNewEmployee);
document.body.append(form);

function addNewEmployee(e) {
  e.preventDefault();

  const row = document.createElement('tr');
  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  nameCell.textContent = form.elements.name.value;
  positionCell.textContent = form.elements.position.value;
  officeCell.textContent = form.elements.office.value;
  ageCell.textContent = form.elements.age.value;
  salaryCell.textContent = convertToCurrency(form.elements.salary.value);
  row.append(nameCell, positionCell, officeCell, ageCell, salaryCell);

  // add dblclick events to the cells
  row.querySelectorAll('td').forEach(cell => {
    addDoubleClickEvent(cell);
  });

  const isDataValid
    = form.elements.name.value.length >= 4
    && form.elements.age.value >= 18
    && form.elements.age.value <= 90;

  if (isDataValid) {
    tableBody.append(row);
    initRowSelection();
    pushNotification(10, 10, 'Success', 'New employee added.', 'success');
    form.reset();
  } else {
    pushNotification(
      10,
      10,
      'Error',
      'Please enter the correct information. The name should be at least 4 characters long. Age should not be less than 18 and greater than 90',
      'error');
  }
};

// add notifications

const pushNotification = (posTop, posRight, title, description, type) => {
  const messageNotification = document.createElement('div');
  const heading = document.createElement('h2');
  const message = document.createElement('p');

  heading.innerText = title;
  heading.classList.add('title');
  message.innerText = description;

  messageNotification.dataset.qa = 'notification';
  messageNotification.style.top = `${posTop}px`;
  messageNotification.style.right = `${posRight}px`;
  messageNotification.classList.add('notification', type);
  messageNotification.append(heading, message);

  document.body.append(messageNotification);

  setTimeout(() => {
    messageNotification.remove();
  }, 2000);
};

// add dblclick events on all cells
[...tableBody.rows].forEach(row => {
  row.querySelectorAll('td').forEach((cell, index) => {
    addDoubleClickEvent(cell, index);
  });
});

// add dblclick function
function addDoubleClickEvent(el, colIndex) {
  el.addEventListener('dblclick', (e) => {
    let editInput = document.createElement('input');
    const temporaryText = e.target.textContent;

    editInput.value = temporaryText;

    e.target.firstChild.remove();

    switch (colIndex) {
      case 2:
        editInput = document.createElement('select');

        const countries = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh',  'San Francisco'];

        for (const country of countries) {
          editInput.innerHTML += (country === temporaryText) ? `<option selected>${country}</option>` : `<option>${country}</option>`;
        };
        break;
      case 3:
        editInput.type = 'number';
        break;
      case 4:
        editInput.type = 'number';
        editInput.value = convertToNumber(temporaryText);

        editInput.addEventListener('blur', function() {
          editInput.remove();

          if (this.value) {
            e.target.textContent = convertToCurrency(this.value);
          } else {
            e.target.textContent = temporaryText;
          }
        });
        break;
    };

    function removeEditInput(thisContext) {
      editInput.remove();

      if (thisContext.value) {
        e.target.textContent = thisContext.value;

        if (colIndex === 4) {
          e.target.textContent = convertToCurrency(thisContext.value);
        }
      } else {
        e.target.textContent = temporaryText;
      }
    }

    editInput.addEventListener('blur', function() {
      removeEditInput(this);
    });

    editInput.addEventListener('keypress', function(ev) {
      if (ev.key === 'Enter') {
        removeEditInput(this);
      }
    });
    e.target.append(editInput);
    editInput.focus();
  });
};

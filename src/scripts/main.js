/* eslint-disable max-len */
'use strict';

const headers = document.querySelectorAll('th');
const tableBody = document.querySelector('tbody');
const allEmployees = tableBody.rows;
const tableCells = document.querySelectorAll('td');
let currSortedCol = null;

// sort list

const sortList = (index) => {
  [...allEmployees]
    .sort((prev, next) => {
      const prevContent = prev.children[index].textContent;
      const nextContent = next.children[index].textContent;

      const returnResult = (prevContent.charAt(0) === '$')
        ? convertToNumber(prevContent) - convertToNumber(nextContent)
        : (prevContent).localeCompare(nextContent);

      return (currSortedCol === index)
        ? returnResult * -1
        : returnResult;
    })
    .forEach(item => tableBody.append(item));
};

headers.forEach((header, index) => {
  header.addEventListener('click', function() {
    sortList(index);
    currSortedCol = (currSortedCol === index) ? null : index;
  });
});

function convertToNumber(number) {
  return +number.replace('$', '').replace(',', '.');
}

// add selection on row click

[...tableBody.rows].forEach(function(row) {
  row.addEventListener('click', function() {
    for (const person of [...tableBody.rows]) {
      person.classList.remove('active');
    };
    row.classList.add('active');
  });
});

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

  row.innerHTML = `
    <td>${form.elements.name.value}</td>
    <td>${form.elements.position.value}</td>
    <td>${form.elements.office.value}</td>
    <td>${form.elements.age.value}</td>
    <td>${'$' + Number(form.elements.salary.value).toLocaleString('en-US')}</td>
  `;

  const isDataValid
    = form.elements.name.value.length >= 4
    && form.elements.age.value >= 18
    && form.elements.age.value <= 90;

  if (isDataValid) {
    tableBody.append(row);
    pushNotification(10, 10, 'Success', 'New employee added.', 'success');
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

// handle double click on cells

tableCells.forEach(el => {
  el.addEventListener('dblclick', (e) => {
    const editInput = document.createElement('input');
    const temporaryText = e.target.textContent;

    e.target.firstChild.remove();
    editInput.value = temporaryText;

    editInput.addEventListener('blur', function() {
      editInput.remove();

      if (this.value) {
        e.target.textContent = this.value;
      } else {
        e.target.textContent = temporaryText;
      }
    });

    e.target.append(editInput);
    editInput.focus();
  });
});

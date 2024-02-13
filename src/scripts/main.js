'use strict';

const body = document.querySelector('body');
const options = document.querySelector('thead tr');
const tbody = document.querySelector('tbody');
let sortedBy = '';

options.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const clickedIndex = [...options.children].indexOf(e.target);
    const list = Array.from(tbody.querySelectorAll('tr'));

    if (e.target.textContent === sortedBy) {
      list.reverse();
    } else {
      const sortByNumbers = (a, b) => {
        return parseInt(a.children[clickedIndex]
          .textContent.replaceAll(/[$,]/g, ''))
        - parseInt(b.children[clickedIndex]
          .textContent.replaceAll(/[$,]/g, ''));
      };

      const sortByStrings = (a, b) => {
        return a.children[clickedIndex].textContent
          .localeCompare(b.children[clickedIndex].textContent);
      };

      clickedIndex < 3
        ? list.sort((a, b) => sortByStrings(a, b))
        : list.sort((a, b) => sortByNumbers(a, b));
    }

    tbody.textContent = '';

    list.map(item => tbody.append(item));
  }

  sortedBy = e.target.textContent;
});

tbody.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    const selectedElementclassList = e.target.parentElement.classList;

    [...tbody.children].forEach(row => {
      row.classList.remove('active');
    });

    selectedElementclassList.add('active');
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>
    Name:
    <input name="name" data-qa="name" type="text" required>
  </label>

  <label>
    Position:
    <input name="position" data-qa="position" type="text" required>
  </label>

  <label>
    Office:
    <select name="office" data-qa="office" required>
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
    <input name="age" data-qa="age" type="number" required>
  </label>

  <label>
    Salary:
    <input name="salary" data-qa="salary" type="number" required>
  </label>
`;

const button = document.createElement('button');

button.textContent = 'Save to table';

body.append(form);
form.append(button);

function notification(type, descr) {
  const errorMessage = document.createElement('div');

  body.append(errorMessage);

  errorMessage.innerHTML = `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${type.toUpperCase()}</h2>
      <p class="descr">${descr}</p>
    </div>
  `;

  setTimeout(() => errorMessage.remove(), 2000);
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  const employeeName = document.querySelector('[name="name"]').value;
  const position = document.querySelector('[name="position"]').value;
  const office = document.querySelector('[name="office"]').value;
  const age = +document.querySelector('[name="age"]').value;
  const salary = (+document.querySelector('[name="salary"]').value)
    .toLocaleString('en-US');

  if (employeeName.trim().length < 4) {
    notification('error', 'Name should have more then 4 letters');
  } else if (position.trim().length === 0) {
    notification('error', 'Position is required');
  } else if (age < 18 || age > 90) {
    notification('error', 'Age must be from 18 to 90');
  } else if (salary.trim() === '0') {
    notification('error', 'Salary is required');
  } else {
    notification('success', 'New employee added');

    const newEmployee = document.createElement('tr');

    newEmployee.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${'$' + salary}</td>
    `;

    tbody.append(newEmployee);

    [...form.querySelectorAll('input')].forEach(input => {
      input.value = '';
    });
  }
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const currentTd = e.target;
    let value = currentTd.textContent;
    const input = document.createElement('input');
    const clickedIndex = [...e.target.parentElement.children].indexOf(e.target);
    const type = clickedIndex < 3 ? 'text' : 'number';

    if (clickedIndex === 4) {
      value = +value.replaceAll(/[$,]/g, '');
    }

    input.setAttribute('class', 'cell-input');
    input.setAttribute('type', type);
    input.setAttribute('value', value);

    currentTd.innerHTML = '';
    currentTd.append(input);

    input.focus();

    const saveNewTableCell = () => {
      let newValue = input.value.trim() === '' ? value : input.value;

      if (clickedIndex === 4) {
        newValue = '$' + (+newValue).toLocaleString('en-US');
      }

      input.remove();
      currentTd.innerHTML = newValue;
    };

    input.addEventListener('blur', () => saveNewTableCell());

    input.addEventListener('keydown', (keydown) => {
      if (keydown.key === 'Enter') {
        input.blur();
      }
    });
  }
});

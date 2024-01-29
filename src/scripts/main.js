'use strict';

function convertToNumber(text) {
  return +(text.replace('$', '').replaceAll(',', ''));
}

const tableHead = document.querySelector('thead');

const table = document.querySelector('table');

const tableBody = document.querySelector('tbody');

let allRows = document.querySelectorAll('tr');

let employees = [...allRows].splice(1);

employees.pop();

const notification = document.createElement('div');

let title;
let description;

notification.dataset.qa = 'notification';
notification.classList.add('notification');

function errorNotification() {
  title = 'Error message';
  description = 'Data is invalid';

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    `;

  notification.classList.add('error');
  notification.classList.remove('success');
  table.after(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function successNotification() {
  title = 'Success message';
  description = 'Data is valid';

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  notification.classList.add('success');
  notification.classList.remove('error');
  table.after(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function cellValidation(currentCellInput, currentElement, currentText) {
  let newText = currentCellInput.value;

  if (!newText) {
    currentCellInput.remove();
    currentElement.innerText = currentText;

    return;
  }

  if (isNaN(convertToNumber(currentText))
    && !isNaN(convertToNumber(newText))) {
    errorNotification();
    currentElement.innerText = currentText;

    return;
  }

  if (!isNaN(convertToNumber(currentText))
    && isNaN(convertToNumber(newText))) {
    errorNotification();
    currentElement.innerText = currentText;

    return;
  }

  if (!currentText.includes('$') && !isNaN(convertToNumber(currentText))
    && ((convertToNumber(newText)) < minAge
      || convertToNumber(newText) > maxAge)) {
    errorNotification();
    currentElement.innerText = currentText;

    return;
  }

  if (currentText.includes('$') && !isNaN(convertToNumber(currentText))
    && convertToNumber(newText) <= 0) {
    errorNotification();
    currentElement.innerText = currentText;

    return;
  }

  if (currentText.includes('$') && !newText.includes('$')) {
    newText = `$${newText}`;
  }

  currentCellInput.remove();
  currentElement.innerText = newText;
}

function updateEmployeesList() {
  allRows = document.querySelectorAll('tr');
  employees = [...allRows].splice(1);
  employees.pop();
}

function selectEmployee() {
  employees.forEach(element => {
    element.addEventListener('click', () => {
      const activeElement = document.querySelector('.active');

      if (activeElement) {
        activeElement.classList.remove('active');
      }
      element.classList.add('active');
    });
  });
}

const minNameLength = 4;
const minAge = 18;
const maxAge = 90;

function addAbilityToEdit() {
  const tableCells = document.querySelectorAll('td');

  [...tableCells].forEach(element => {
    let initialText;

    element.addEventListener('dblclick', () => {
      const cellInput = document.createElement('input');

      initialText = element.innerText;

      element.innerText = '';
      element.append(cellInput);
      cellInput.classList.add('cell-input');
      cellInput.value = initialText;
      cellInput.focus();
    });

    element.addEventListener('focusout', () => {
      const cellInput = document.querySelector('.cell-input');

      cellValidation(cellInput, element, initialText);
    });

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cellInput = document.querySelector('.cell-input');

        cellValidation(cellInput, element, initialText);
      }
    });
  });
}

const form = document.createElement('form');

form.innerHTML = `
  <form>
      <label>Name:
        <input
          name="name"
          type="text"
          data-qa="name"
          required
        >
      </label>
      <label>Position:
        <input
          name="position"
          type="text"
          data-qa="position"
          required
        >
      </label>
      <label>Office:
        <select
          data-qa="office"
          name="city"
          required
        >
          <option>Tokyo</option>
          <option value="singapore">Singapore</option>
          <option value="london">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age:
        <input
          name="age"
          type="number"
          data-qa="age"
          required
        >
      </label>
      <label>Salary:
        <input
          name="salary"
          type="number"
          data-qa="salary"
          required
        >
      </label>
      <button type="submit">Save to table</button>
    </form>
`;

table.after(form);

form.classList.add('new-employee-form');

const saveButton = document.querySelector('button');

saveButton.addEventListener('submit', (e) => {
  e.preventDefault();
});

saveButton.addEventListener('click', (e) => {
  const newRow = document.createElement('tr');

  const employeeName = form.children[0].firstElementChild.value;
  const position = form.children[1].firstElementChild.value;
  const office = form.children[2].firstElementChild.value;
  const age = +form.children[3].firstElementChild.value;
  const salary = +form.children[4].firstElementChild.value;

  newRow.innerHTML = `
    <tr>
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>
    </tr>
  `;

  if (employeeName.length < minNameLength || age < minAge || age > maxAge
    || !isNaN(+position) || !isNaN(+employeeName)) {
    e.preventDefault();
    errorNotification();
    form.reset();

    return;
  }

  successNotification();
  tableBody.append(newRow);
  form.reset();

  addAbilityToEdit();
  updateEmployeesList();
  selectEmployee();
});

let salaryClicked = false;
let ageClicked = false;
let officeClicked = false;
let positionClicked = false;
let nameClicked = false;

tableHead.addEventListener('click', e => {
  switch (e.target.innerText) {
    case 'Salary':
      switch (salaryClicked) {
        case false:
          employees.sort((employee1, employee2) => {
            return convertToNumber(employee1.children[4].innerText)
              > convertToNumber(employee2.children[4]
                .innerText) ? 1 : -1;
          });

          salaryClicked = true;
          break;

        case true:
          employees.sort((employee1, employee2) => {
            return convertToNumber(employee1.children[4].innerText)
              < convertToNumber(employee2.children[4]
                .innerText) ? 1 : -1;
          });

          salaryClicked = false;
          break;
      }

      break;

    case 'Age':
      switch (ageClicked) {
        case false:
          employees.sort((employee1, employee2) => {
            return +employee1.children[3].innerText
              > +employee2.children[3].innerText ? 1 : -1;
          });

          ageClicked = true;
          break;

        case true:
          employees.sort((employee1, employee2) => {
            return +employee1.children[3].innerText
              < +employee2.children[3].innerText ? 1 : -1;
          });

          ageClicked = false;
          break;
      }

      break;

    case 'Office':
      switch (officeClicked) {
        case false:
          employees.sort((employee1, employee2) => {
            return employee1.children[2].innerText
              .localeCompare(employee2.children[2].innerText);
          });

          officeClicked = true;
          break;

        case true:
          employees.sort((employee1, employee2) => {
            return -employee1.children[2].innerText
              .localeCompare(employee2.children[2].innerText);
          });

          officeClicked = false;
          break;
      }
      break;

    case 'Position':
      switch (positionClicked) {
        case false:
          employees.sort((employee1, employee2) => {
            return employee1.children[1].innerText
              .localeCompare(employee2.children[1].innerText);
          });

          positionClicked = true;
          break;

        case true:
          employees.sort((employee1, employee2) => {
            return employee2.children[1].innerText
              .localeCompare(employee1.children[1].innerText);
          });

          positionClicked = false;
          break;
      }
      break;

    case 'Name':
      switch (nameClicked) {
        case false:
          employees.sort((employee1, employee2) => {
            return employee1.children[0].innerText
              .localeCompare(employee2.children[0].innerText);
          });

          nameClicked = true;
          break;

        case true:
          employees.sort((employee1, employee2) => {
            return -employee1.children[0].innerText
              .localeCompare(employee2.children[0].innerText);
          });

          nameClicked = false;
          break;
      }
      break;
  }

  tableBody.innerHTML = `
      ${employees.map(element => `
        <tr>
          <td>${element.children[0].innerText}</td>
          <td>${element.children[1].innerText}</td>
          <td>${element.children[2].innerText}</td>
          <td>${element.children[3].innerText}</td>
          <td>${element.children[4].innerText}</td>
        </tr>
      `).join('')}
    `;

  updateEmployeesList();
  selectEmployee();
  addAbilityToEdit();
});

selectEmployee();
addAbilityToEdit();

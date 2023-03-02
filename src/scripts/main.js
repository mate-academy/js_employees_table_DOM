'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');

const headings = tableHead.querySelectorAll('th');
const tableRows = tableBody.querySelectorAll('tr');

for (const heading of headings) {
  heading.setAttribute('data-order', 'desc');
}

tableHead.addEventListener('click', (e) => {
  [...headings].map((heading) => {
    if (heading !== e.target) {
      heading.setAttribute('data-order', 'desc');
    }
  });

  const headingIndex = e.target.cellIndex;

  const rowsArray = [...tableBody.rows];

  rowsArray.sort((firstElement, secondElement) => {
    const firstContent = firstElement.cells[headingIndex].textContent;
    const secondContent = secondElement.cells[headingIndex].textContent;

    if (parseInt(firstContent) === +firstContent) {
      return firstContent - secondContent;
    };

    if (isNaN(parseInt(firstContent.slice(1)))) {
      return firstContent.localeCompare(secondContent);
    } else {
      return parseInt(firstContent.slice(1).replaceAll(',', ''))
      - parseInt(secondContent.slice(1).replaceAll(',', ''));
    }
  });

  if (e.target.getAttribute('data-order') === 'desc') {
    tableBody.append(...rowsArray);
    e.target.setAttribute('data-order', 'asc');
  } else {
    tableBody.append(...rowsArray.reverse());
    e.target.setAttribute('data-order', 'desc');
  }
});

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');

  [...tableRows].map((row) => {
    if (row !== selectedRow) {
      row.classList.remove('active');
    }
  });

  if (selectedRow.classList.contains('active')) {
    selectedRow.classList.remove('active');
  } else {
    selectedRow.classList.add('active');
  }
});

body.insertAdjacentHTML('beforeend', `
<form
  method="GET"
  action="/"
  class="new-employee-form"
>
  <label>
    Name:
    <input 
      name="name"
      type="text"
      data-qa="name"
    >
  </label>

  <label>
    Position:
    <input 
      name="position"
      type="text"
      data-qa="position"
    >
  </label>

  <label>
    Office:
    <select data-qa="office" name="office">
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
    <input 
      name="age"
      type="number"
      data-qa="age"
      min="0"
    >
  </label>

  <label>
    Salary:
    <input 
      name="salary"
      type="number"
      data-qa="salary"
      min="0"
    >
  </label>

  <button type="submit">
    Save to table
  </button>
</form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', AddToTable);

function AddToTable(e) {
  e.preventDefault();

  const currentForm = e.target;
  const formFields = currentForm.elements;

  const newEmployeeName = formFields.name.value;
  const newEmployeePosition = formFields.position.value;
  const newEmployeeOffice = formFields.office.value;
  const newEmployeeAge = formFields.age.value;
  const newEmployeeSalary = +formFields.salary.value;
  const EmployeeSalary = `$${newEmployeeSalary.toLocaleString('en-US')}`;

  if (newEmployeeName.trim() === '' || newEmployeeName.length < 4
    || !isNaN(newEmployeeName)) {
    pushNotification('Warning',
      'The entered name must be at least 4 characters long', 'warning');
  } else if (newEmployeeAge < 18) {
    pushNotification('Warning',
      'The employee must be at least 18 years old', 'warning');
  } else if (newEmployeeAge > 90) {
    pushNotification('Warning',
      'The employee must be no more than 90 years old', 'warning');
  } else if (newEmployeePosition.trim() === '' || newEmployeePosition.length < 2
    || !isNaN(newEmployeePosition)) {
    pushNotification('Warning',
      'The entered position must be at least 2 characters long', 'warning');
  } else {
    tableBody.insertAdjacentHTML('beforeend', `
      <tr>
          <td>${newEmployeeName}</td>
          <td>${newEmployeePosition}</td>
          <td>${newEmployeeOffice}</td>
          <td>${newEmployeeAge}</td>
         <td>${EmployeeSalary}</td>
        </tr>
    `);

    pushNotification('Success',
      'The new employee\'s data was added to the table', 'success');
  }
};

const pushNotification = function(title, description, type) {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');
  message.classList = 'notification';
  message.classList += ` ${type}`;

  message.insertAdjacentHTML('beforeend', `
    <h2>${title}</h2>
    <p>${description}</p>
  `);

  const heading = message.querySelector('h2');

  heading.className = 'title';

  body.append(message);

  setTimeout(() => message.remove(), 2000);
};

tableBody.addEventListener('dblclick', (e) => {
  const item = e.target.closest('td');
  const itemText = item.textContent;
  const itemIndex = item.cellIndex;

  item.innerHTML = '';

  let newInput = document.createElement('input');

  newInput.className = 'cell-input';

  if (itemIndex === 3 || itemIndex === 4) {
    newInput.setAttribute('type', 'number');
  }

  if (itemIndex === 2) {
    const select = document.createElement('select');

    select.insertAdjacentHTML('afterbegin', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `);

    newInput = select;
  }

  if (itemIndex === 1 || itemIndex === 0) {
    newInput.setAttribute('type', 'text');
  }

  item.append(newInput);
  newInput.focus();

  newInput.addEventListener('blur', () => {
    if (itemIndex === 3 && newInput.value < 18) {
      pushNotification('Warning',
        'The employee must be at least 18 years old', 'warning');
      item.textContent = itemText;

      return;
    };

    if (itemIndex === 3 && newInput.value > 90) {
      pushNotification('Warning',
        'The employee must be no more than 90 years old', 'warning');
      item.textContent = itemText;

      return;
    };

    if (itemIndex === 4 && newInput.value < 0) {
      pushNotification('Warning',
        'The employee\'s salary cannot be negative', 'warning');
      item.textContent = itemText;

      return;
    };

    if (itemIndex === 4 && newInput.value) {
      const figure = +newInput.value;

      item.textContent = '$' + `${figure.toLocaleString('en-US')}`;

      return;
    };

    if (!newInput.value) {
      item.textContent = itemText;
    } else {
      item.textContent = newInput.value;
    };

    newInput.remove();
  });

  newInput.addEventListener('keypress', (pushEvent) => {
    if (pushEvent.key !== 'Enter') {
      return;
    }

    newInput.blur();
  });
});

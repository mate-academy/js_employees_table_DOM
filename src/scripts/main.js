'use strict';

const employees = document.querySelector('table');

sortTable(employees);
selectRow(employees);
createForm(employees);

function sortTable(table) {
  let isAsc = true;
  let columnTitle = '';

  document.querySelectorAll('th').forEach((th) => {
    return th.addEventListener('click', (e) => {
      const tbody = table.querySelector('tbody');

      if (columnTitle !== e.target.textContent) {
        isAsc = true;
        columnTitle = e.target.textContent;
      }

      Array.from(tbody.querySelectorAll('tr'))
        .sort(
          getCompareFunction(
            Array.from(th.parentNode.children).indexOf(th),
            isAsc
          )
        )
        .forEach((tr) => tbody.appendChild(tr));

      isAsc = !isAsc;
    });
  });
}

function getCompareFunction(headerIndex, dir) {
  return function(a, b) {
    const aCellValue = getRowCellValue(dir ? a : b, headerIndex);
    const bCellValue = getRowCellValue(dir ? b : a, headerIndex);

    if (
      aCellValue !== ''
      && bCellValue !== ''
      && !isNaN(aCellValue)
      && !isNaN(bCellValue)
    ) {
      return aCellValue - bCellValue;
    }

    return aCellValue[0] === '$'
      ? parseInt(aCellValue.slice(1)) - parseInt(bCellValue.slice(1))
      : aCellValue.toString().localeCompare(bCellValue);
  };
}

function getRowCellValue(tr, index) {
  return tr.children[index].textContent;
}

function selectRow(table) {
  let previousSelectedRow;

  table.querySelector('tbody').addEventListener('click', (e) => {
    if (previousSelectedRow) {
      previousSelectedRow.classList.remove('active');
    }

    e.target.parentNode.classList.add('active');
    previousSelectedRow = e.target.parentNode;
  });
}

function createForm(table) {
  const newEmployeeForm = document.createElement('form');

  newEmployeeForm.classList.add('new-employee-form');

  newEmployeeForm.innerHTML = `
    <label>
      Name: 
      <input 
        name="name" 
        type="text"
        data-qa="name"
        required
      >
    </label>

    <label>
      Position: 
      <input 
        name="position" 
        type="text"
        data-qa="position"
        required 
      >
    </label>

    <label>
      Office:
      <select 
        name="office" 
        data-qa="office"
        required
      >
        <option value="default">Tokyo</option>
        <option>San Francisco</option>
        <option>Singapore</option>
        <option>New York</option>
        <option>London</option>
        <option>Edinburgh</option>
      </select>
    </label>
    <label>
      Age: 
      <input 
        name="age" 
        type="number"
        data-qa="age"
        required
      >
    </label>
    <label>
      Salary: 
      <input 
        name="salary" 
        type="number" 
        data-qa="salary"
        required
      >
    </label>
    <button type="submit">
      Save to table
    </button>
  `;

  table.parentNode.insertBefore(newEmployeeForm, table.nextSibling);

  addEmployee(newEmployeeForm);
}

function addEmployee(form) {
  form.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();

    const employeeName = document.querySelector('[name="name"]');
    const employeePosition = document.querySelector('[name="position"]');
    const employeeOffice = document.querySelector('[name="office"]');
    const employeeAge = document.querySelector('[name="age"]');
    const employeeSalary = document.querySelector('[name="salary"]');

    if (employeeName.value.length < 4) {
      pushNotification(
        150,
        10,
        'Name input error',
        'Name must not be less than 4 letters',
        'error'
      );

      return;
    }

    if (employeePosition.value.length < 4) {
      pushNotification(
        150,
        10,
        'Position input error',
        'Position must not be less than 4 letters',
        'error'
      );

      return;
    }

    if (parseInt(employeeAge.value) < 18 || parseInt(employeeAge.value) > 90) {
      pushNotification(
        150,
        10,
        'Age input error',
        'Age must not be less than 18 and more than 90',
        'error'
      );

      return;
    }

    const newEmployeeRow = `
      <tr>
        <td>${employeeName.value}</td>
        <td>${employeePosition.value}</td>
        <td>${employeeOffice.value}</td>
        <td>${employeeAge.value}</td>
        <td>$${parseInt(employeeSalary.value).toLocaleString('en-US')}</td>
      </tr>
    `;

    document
      .querySelector('tbody')
      .insertAdjacentHTML('beforeend', newEmployeeRow);

    pushNotification(
      150,
      10,
      'Success!',
      'New employee successfully added to the table',
      'success'
    );

    employeeName.value = '';
    employeePosition.value = '';
    employeeOffice.value = 'default';
    employeeAge.value = '';
    employeeSalary.value = '';
  });
}

function pushNotification(posTop, posRight, title, description, type) {
  const body = document.querySelector('body');
  const message = document.createElement('div');

  message.classList = `notification ${type}`;
  message.dataset.qa = 'notification';
  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';

  const messageTitle = document.createElement('h2');

  messageTitle.className = 'title';
  messageTitle.textContent = title;

  const messageDescription = document.createElement('p');

  messageDescription.textContent = description;

  message.append(messageTitle, messageDescription);
  body.append(message);

  setTimeout(() => {
    message.style.visibility = 'hidden';
  }, 2000);
}

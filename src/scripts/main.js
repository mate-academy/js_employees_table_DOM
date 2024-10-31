'use strict';

//Sorting by header of column: 

const body = document.querySelector('body');
const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tBody = table.querySelector('tbody');
const cells = tBody.querySelectorAll('td');
const td = document.createElement('td');
let rows = [...tBody.querySelectorAll('tr')];
const sortOrder = Array(headers.length).fill(true);

function updateRows() {
  rows = [...tBody.querySelectorAll('tr')];
}

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    setSortTable(index);
  });
});

const setSortTable = (columnIndex) => {
  updateRows();

  const sortedRows = rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent.trim();
    const bValue = b.cells[columnIndex].textContent.trim();

    if (+aValue) {
      return sortOrder[columnIndex] ? +aValue - bValue : bValue - aValue;
    }

    if (columnIndex === 4) {
      const aSalary = parseFloat(aValue.replace(/[$,]/g, ''));
      const bSalary = parseFloat(bValue.replace(/[$,]/g, ''));

      return sortOrder[columnIndex] ? aSalary - bSalary : bSalary - aSalary;
    }

    return sortOrder[columnIndex] ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  tBody.innerHTML = '';
  tBody.append(...sortedRows);
  sortOrder[columnIndex] = !sortOrder[columnIndex];
};

//Selecting row:

[...tBody.rows].forEach((row) => {
  row.addEventListener('click', (e) => {
    const rowsActive = tBody.querySelectorAll('tr.active');
    rowsActive.forEach(rowActive => {
      rowActive.classList.remove('active');
    });

    row.classList.toggle('active');
  });

})

//Create form: 

const form = document.createElement('form');
form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name: <input name="name" type="text" data-qa="name" required>
  </label>
  <label>
    Position: <input name="position" type="text" data-qa="position" required>
  </label>
  <label>
    Office:
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>
    Age: <input name="age" type="number" data-qa="age" required>
  </label>
  <label>
    Salary: <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="button">Save to table</button>
`;

body.append(form);

form.querySelector('button').addEventListener('click', (e) => {
  // e.preventDefault();

  if (!checkFormFields()) {
    return;
  }
  
  const newRow = tBody.insertRow();

  if (
    form.elements.name.value &&
    form.elements.position.value &&
    form.elements.office.value &&
    form.elements.age.value &&
    form.elements.salary.value
  ) {
      newRow.insertCell(0).textContent = form.elements.name.value.trim();  
      newRow.insertCell(1).textContent = form.elements.position.value.trim();
      newRow.insertCell(2).textContent = form.elements.office.value.trim();
      newRow.insertCell(3).textContent = parseInt(form.elements.age.value, 10);
      let salaryFormated = parseFloat(form.elements.salary.value.replace(/[^0-9.]/g, ''));
      newRow.insertCell(4).textContent = `$${new Intl.NumberFormat("us-IN").format(salaryFormated)}`;
  }

  checkFormFields();
  tBody.append(newRow);
  
  showNotification(
    'Success!',
    'New employee is successfuly added',
    'success'
  )

  form.reset();
});

function showNotification(title, message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-ga', 'notification');

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${message}</p>
  `;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}

function checkFormFields() {
  const employeeName = form.elements.name.value.trim();

  if (employeeName.length > 0 && employeeName.length < 4) {
    showNotification(
      'Error!',
      'The minimum name length is 4 letters',
      'error'
    );

    return false;
  }

  const employeeAge = parseInt(form.elements.age.value, 10);

  if (employeeAge < 18 || employeeAge > 90) {
    showNotification(
      'Error!',
      'You are too young/old for this',
      'error'
    )

    return false;
  }

  [...form.elements].every(input => {
    if (input.tagName === 'INPUT' || input.tagName === 'SELECT') {
      if (!input.value.trim()) {
        showNotification(
          'Error!',
          'Fill in all fields',
          'error'
        )

        return false;
      }
    }

    return true;
  });

  return true;
}

//Making editable table content:

cells.forEach(cell => {
  const editCell = document.createElement('input');
  editCell.classList.add('cell-input');
  
  cell.addEventListener('dblclick', () => {
    cell.replaceWith(editCell);
  });

  editCell.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      editCell.replaceWith(td);
      td.textContent = editCell.value;
    }
  })

  editCell.addEventListener('blur', (e) => {
    if (editCell.value !== '') {
      editCell.replaceWith(td);
      td.textContent = editCell.value;
    } else {
      editCell.replaceWith(cell);
    }
  })
});

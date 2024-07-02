'use strict';

// write code here
const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = Array.from(tbody.rows);

let isSortedASC = true;
let lastSortedColumn = -1;

function sortTable(e) {
  if (e.target.tagName === 'TH') {
    const column = e.target.cellIndex;
    const type = e.target.textContent;

    if (lastSortedColumn !== column) {
      isSortedASC = true;
    }

    const sortedRows = rows.sort((a, b) => {
      const aText = a.cells[column].textContent;
      const bText = b.cells[column].textContent;

      if (type === 'Age' || type === 'Salary') {
        const aNum = parseFloat(aText.replace(/[$,]/g, ''));
        const bNum = parseFloat(bText.replace(/[$,]/g, ''));

        if (isSortedASC) {
          return aNum - bNum;
        }

        return bNum - aNum;
      } else {
        if (isSortedASC) {
          return aText.localeCompare(bText);
        }

        return bText.localeCompare(aText);
      }
    });

    tbody.innerHTML = '';
    sortedRows.forEach((row) => tbody.appendChild(row));

    isSortedASC = !isSortedASC;
    lastSortedColumn = column;
  }
}

thead.addEventListener('click', sortTable);

function highlightRow(e) {
  if (e.target.tagName === 'TD') {
    const row = e.target.closest('tr');
    const activeRow = document.querySelector('tr.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    row.classList.add('active');
  }
}

tbody.addEventListener('click', highlightRow);

const saveChanges = (input, initialValue) => {
  if (input) {
    const newValue = input.value.trim();

    if (newValue === '') {
      input.parentNode.textContent = initialValue;
    } else {
      input.parentNode.textContent = newValue;
    }
    input.remove();
  }
};

function toEditInput(row) {
  const cells = row.querySelectorAll('td');

  cells.forEach((cell) => {
    let cellInput = null;
    const initialValue = cell.textContent;

    cell.addEventListener('dblclick', () => {
      if (cellInput) {
        saveChanges(cellInput, initialValue);
        cellInput = null;
      } else {
        const input = document.createElement('input');

        input.value = initialValue;
        input.classList.add('cell-input');
        cell.textContent = '';
        cell.appendChild(input);
        input.focus();
        cellInput = input;

        input.addEventListener('blur', () => {
          saveChanges(input, initialValue);
          cellInput = null;
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            saveChanges(input, initialValue);
            cellInput = null;
          }
        });
      }
    });
  });
}

rows.forEach(toEditInput);

// Add Form
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

employeeForm.insertAdjacentHTML(
  'beforeend',
  `
<label>Name:
  <input name="name" type="text" data-qa="name" required autocomplete="off">
</label>
<label>Position:
  <input name="position" type="text" data-qa="position" required>
</label>
<label>Office:
  <select name="office" data-qa="office" required>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New Yor">New Yor</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>Age:
  <input name="age" type="text" data-qa="age" required>
</label>
<label>Salary:
  <input name="salary" type="text" data-qa="salary" required>
</label>
<button type="submit">Save to table</button>
`,
);
body.appendChild(employeeForm);

const pushNotification = (posTop, posRight, title, errorInput, type) => {
  let description = '';

  switch (errorInput) {
    case 'name':
      description = 'The name field must contain at least 4 characters';
      break;
    case 'age':
      description = `You must be at least 18 and not more than 90 years old.
        The text must be a number`;
      break;
    case 'salary':
      description = 'Your salary should be a number';
      break;
    default:
      description = 'Your form has been successfully added to the table';
  }

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `,
  );

  const notificationBlock = document.querySelector('.notification:last-child');

  notificationBlock.style.top = posTop + 'px';
  notificationBlock.style.right = posRight + 'px';

  setTimeout(() => {
    notificationBlock.remove();
  }, 2000);
};

function checkValidateForm(nameValue, age, salary) {
  const isNotAgeValid = Number(age) < 18 || Number(age) > 90;
  const isNotSalaryValid = isNaN(Number(salary));

  if (nameValue.length < 4) {
    return [false, 'name'];
  } else if (isNotAgeValid) {
    return [false, 'age'];
  } else if (isNotSalaryValid) {
    return [false, 'salary'];
  }

  return [true, null];
}

function clearForm(...formValue) {
  formValue.forEach((value) => {
    value.value = '';
  });
}

function addRowToTable(e) {
  e.preventDefault();

  const row = document.createElement('tr');
  const nameInput = employeeForm.querySelector('input[name="name"]');
  const position = employeeForm.querySelector('input[name="position"]');
  const office = employeeForm.querySelector('select[name="office"]');
  const age = employeeForm.querySelector('input[name="age"]');
  const salary = employeeForm.querySelector('input[name="salary"]');

  const nameValue = nameInput.value;
  const positionValue = position.value;
  const officeValue = office.value;
  const ageValue = age.value;
  let salaryValue = salary.value;

  const rowValue = [nameValue, positionValue, officeValue, ageValue];

  const [isValid, errorInput] = checkValidateForm(
    nameValue,
    ageValue,
    salaryValue,
  );

  salaryValue = `$${salaryValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  rowValue.push(salaryValue);

  if (isValid) {
    rowValue.forEach((value) => {
      row.insertAdjacentHTML('beforeend', `<td>${value}</td>`);
    });

    tbody.appendChild(row);

    pushNotification(450, 450, 'Added Successfully.', null, 'success');
    clearForm(nameInput, position, age, salary);
  } else {
    pushNotification(
      600,
      450,
      `It is impossible to add: Error in the ${errorInput} field`,
      errorInput,
      'error',
    );
  }
}

employeeForm.addEventListener('submit', addRowToTable);

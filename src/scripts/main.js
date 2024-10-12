'use strict';

function convertToNumber(string) {
  let result = string.replace('$', '');

  result = result.replace(',', '');

  return +result;
}

const REVERSE_ORDER = 'DESC';
const tableBody = document.querySelector('tbody');
let rows = [...tableBody.rows];
let sortBy = '';

function updateRows() {
  rows = [...tableBody.rows];
}

document.querySelectorAll('th').forEach((rowHead, index) => {
  rowHead.addEventListener('click', () => {
    const newSortBy = rowHead.textContent.toLowerCase();

    if (sortBy === newSortBy) {
      sortBy += REVERSE_ORDER;
    } else {
      sortBy = newSortBy;
    }

    rows.sort((row1, row2) => {
      const value1 = row1.children[index].textContent;
      const value2 = row2.children[index].textContent;

      if (value1.startsWith('$')) {
        return convertToNumber(value1) - convertToNumber(value2);
      }

      return value1.localeCompare(value2);
    });

    tableBody.innerHTML = '';

    if (sortBy.includes(REVERSE_ORDER)) {
      rows.reverse();
    }

    rows.forEach((row) => tableBody.append(row));
  });
});

let selectedRow = rows[0];

function handleRowClick(row) {
  row.addEventListener('click', () => {
    selectedRow.classList.remove('active');
    row.classList.add('active');
    selectedRow = row;
  });
}

rows.forEach((row) => handleRowClick(row));

document.body.insertAdjacentHTML(
  'beforeend',
  `
  <form method="get" class="new-employee-form">
    <label>Name: <input data-qa="name" name="name" type="text"></label>
    <label>Position: <input data-qa="position" name="position" type="text"></label>
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
        data-qa="age"
        name="age"
        type="number"
      >
    </label>

    <label>
      Salary:

      <input
        data-qa="salary"
        name="salary"
        type="number"
      >
      </label>

    <button type="submit">Save to table</button>
  </form>
`,
);

const newEmployeeForm = document.querySelector('.new-employee-form');
const inputName = newEmployeeForm.querySelector('input[name="name"]');
const inputPosition = newEmployeeForm.querySelector('input[name="position"]');
const inputAge = newEmployeeForm.querySelector('input[name="age"]');
const inputSalary = newEmployeeForm.querySelector('input[name="salary"]');
const selectOffice = newEmployeeForm.querySelector('select');

function clearForm() {
  inputName.value = '';
  inputAge.value = '';
  inputPosition.value = '';
  inputSalary.value = '';
  selectOffice.value = selectOffice.options[0].value;
}

function isAllLetters(str) {
  for (const ch of str) {
    if (ch.toLowerCase() === ch.toUpperCase()) {
      return false;
    }
  }

  return true;
}

function addNotification(message, isSuccess) {
  const notification = document.createElement('div');
  const title = document.createElement('h2');
  const text = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');

  notification.classList.add('notification');
  title.classList.add('title');

  if (isSuccess) {
    title.textContent = 'Success';
    notification.classList.add('success');
  } else {
    title.textContent = 'Error';
    notification.classList.add('error');
  }

  text.textContent = message;

  notification.append(title, text);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2500);
}

function convertToSalary(num) {
  return `$${Number(num)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function handleCellsClick(row) {
  [...row.children].forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      const initialValue = cell.textContent;
      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = initialValue;

      let newValue = input.value;

      input.addEventListener('change', () => (newValue = input.value));

      cell.innerHTML = '';
      cell.append(input);
      input.focus();

      const onValueChange = () => {
        if (!newValue.trim().length) {
          input.remove();
          cell.textContent = initialValue;
        } else {
          input.remove();
          cell.textContent = newValue;
        }
      };

      input.addEventListener('blur', onValueChange);

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          onValueChange();
        }
      });
    });
  });
}

rows.forEach((row) => handleCellsClick(row));

function addNewEmployee({ employeeName, position, office, age, salary }) {
  tableBody.insertAdjacentHTML(
    'beforeend',
    `
    <tr>
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${convertToSalary(salary)}</td>
    </tr>
  `,
  );

  updateRows();
  handleRowClick(tableBody.lastElementChild);
  handleCellsClick(tableBody.lastElementChild);
  clearForm();
}

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (inputName.value.length < 4) {
    addNotification('Name is too short!', false);

    return;
  }

  if (!isAllLetters(inputName.value)) {
    addNotification('Name should include only letters!', false);

    return;
  }

  if (!inputPosition.value.trim()) {
    addNotification('Please enter your position', false);

    return;
  }

  if (inputAge.value < 18 || inputAge.value > 90) {
    addNotification(
      'Please enter your age, age should be between 18 and 90',
      false,
    );

    return;
  }

  if (!inputSalary.value.trim()) {
    addNotification('Please enter your salary', false);

    return;
  }

  const newEmployee = {
    employeeName: inputName.value,
    position: inputPosition.value,
    office: selectOffice.value,
    age: inputAge.value,
    salary: inputSalary.value,
  };

  addNewEmployee(newEmployee);
  addNotification('New employee was added', true);
});

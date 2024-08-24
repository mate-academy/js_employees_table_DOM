'use strict';

function formatNumberWithCommas(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function createNotification(title, description, type) {
  const message = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  message.dataset.qa = 'notification';

  message.classList.add('notification', type);
  titleElement.classList.add('title');

  titleElement.innerText = title;
  descriptionElement.innerText = description;
  titleElement.style.whiteSpace = 'nowrap';

  message.append(titleElement, descriptionElement);

  return message;
}

function pushNotification(message) {
  document.body.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 6000);
}

function createSortHandler() {
  let prevHeader = null;
  let isASCOrder = true;

  return (e) => {
    if (e.target.tagName !== 'TH') {
      return;
    }

    if (prevHeader === e.target) {
      isASCOrder = !isASCOrder;
    } else {
      isASCOrder = true;
    }

    prevHeader = e.target;

    const clickedIndex = e.target.cellIndex;
    const isNumericSort = clickedIndex === 3 || clickedIndex === 4;

    const sortedRows = [...tableBody.querySelectorAll('tr')].sort(
      (rowA, rowB) => {
        const cellA = rowA.children[clickedIndex].textContent.trim();
        const cellB = rowB.children[clickedIndex].textContent.trim();

        let compareResult = 0;

        if (isNumericSort) {
          compareResult =
            +cellA.replace(/\D+/g, '') - +cellB.replace(/\D+/g, '');
        } else {
          compareResult = cellA.localeCompare(cellB);
        }

        return isASCOrder ? compareResult : -compareResult;
      },
    );

    sortedRows.forEach((row) => tableBody.append(row));
  };
}

const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');

const sortHandler = createSortHandler();

tableHead.addEventListener('click', sortHandler);

const formHtml = `
  <form class="new-employee-form">
    <label>
      Name:
      <input type="text" data-qa="name" required>
    </label>
    <label>
      Position:
      <input type="text" data-qa="position" required>
    </label>
    <label>
      Office:
      <select data-qa="office" required></select>
    </label>
    <label>
      Age:
      <input type="number" data-qa="age" min="0" required>
    </label>
    <label>
      Salary:
      <input type="number" data-qa="salary" min="0" required>
    </label>
    <button type="submit">Save to table</button>
  </form>
`;

document.body.insertAdjacentHTML('beforeend', formHtml);

const selectOptions = [
  { value: 'Tokyo', text: 'Tokyo' },
  { value: 'Singapore', text: 'Singapore' },
  { value: 'London', text: 'London' },
  { value: 'New-York', text: 'New York' },
  { value: 'Edinburgh', text: 'Edinburgh' },
  { value: 'San-Francisco', text: 'San Francisco' },
];

const selectOffice = document.querySelector('select[data-qa="office"]');

const optionsHtml = selectOptions
  .map((city) => `<option value="${city.value}">${city.text}</option>`)
  .join('');

selectOffice.innerHTML = optionsHtml;

const newEmployeeForm = document.querySelector('.new-employee-form');
const inputName = newEmployeeForm.querySelector('input[data-qa="name"]');
const inputPos = newEmployeeForm.querySelector('input[data-qa="position"]');
const selectCity = newEmployeeForm.querySelector('select[data-qa="office"]');
const inputAge = newEmployeeForm.querySelector('input[data-qa="age"]');
const inputSalary = newEmployeeForm.querySelector('input[data-qa="salary"]');

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (inputName.value.length < 4) {
    const errorMessage = createNotification(
      'Error',
      'Name must be at least 4 letters long',
      'error',
    );

    pushNotification(errorMessage);

    return;
  }

  if (inputPos.value.trim().length === 0) {
    const errorMessage = createNotification(
      'Error',
      'Invalid position',
      'error',
    );

    pushNotification(errorMessage);

    return;
  }

  const age = parseInt(inputAge.value);

  if (age < 18 || age > 90) {
    const errorMessage = createNotification(
      'Error',
      'We hire employee who are between 18 and 90 years old',
      'error',
    );

    pushNotification(errorMessage);

    return;
  }

  const rowHtml = `
  <tr>
    <td>${inputName.value}</td>
    <td>${inputPos.value}</td>
    <td>${selectCity.value.split('-').join(' ')}</td>
    <td>${inputAge.value}</td>
    <td>$${formatNumberWithCommas(inputSalary.value)}</td>
  </tr>
`;

  tableBody.insertAdjacentHTML('beforeend', rowHtml);
  newEmployeeForm.reset();

  const message = createNotification(
    'Success',
    'Employee was successfully added',
    'success',
  );

  pushNotification(message);
});

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');
  const bodyRows = tableBody.querySelectorAll('tr');

  bodyRows.forEach((row) => row.classList.remove('active'));
  selectedRow.classList.add('active');
});

tableBody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const input = document.createElement('input');
    const currText = e.target.textContent;

    input.type = 'text';
    input.classList.add('cell-input');

    input.value = currText;
    e.target.textContent = '';
    e.target.append(input);

    input.focus();

    input.addEventListener('blur', () => {
      e.target.textContent = input.value || currText;
      input.remove();
    });

    input.addEventListener('keypress', (keyPressEvent) => {
      if (keyPressEvent.key === 'Enter') {
        e.target.textContent = input.value || currText;
        input.remove();
      }
    });
  }
});

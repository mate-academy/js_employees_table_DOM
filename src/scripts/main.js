/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
'use strict';

const body = document.querySelector('body');
const form = document.createElement('form');

form.className = 'new-employee-form';
body.append(form);

form.innerHTML = `
<label>
Name:
<input name="name" type="text"
data-qa="name"
required>
</label>

<label>
Position:
<input name="position" type="text
data-qa="position"
required>
</label>

<label>
Office:

<select name="office" type="text"
data-qa="office"
required>
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
<input name="number" type="number"
data-qa="age"
required>
</label>

<label>
Salary:
<input name="number" type="number"
data-qa="salary"
required>
</label>

<button>Save to table</button>
`;

function createNotification(type) {
  const divNotification = document.createElement('div');

  divNotification.setAttribute('data-qa', 'notification');

  divNotification.className = type;

  divNotification.style.width = '300px';
  divNotification.style.minHeight = '100px';
  divNotification.style.padding = '0 16px';
  divNotification.style.boxSizing = 'border-box';
  divNotification.style.borderRadius = '10px';
  divNotification.style.position = 'absolute';
  divNotification.style.top = '500px';
  divNotification.style.right = '100px';

  const h1 = document.createElement('h1');

  const p = document.createElement('p');

  h1.style.display = 'block';
  h1.style.fontWeight = 900;
  h1.style.textAlign = 'center';

  p.style.textAlign = 'center';

  body.append(divNotification);
  divNotification.append(h1);
  divNotification.append(p);

  if (divNotification.className === 'error') {
    divNotification.style.background = 'rgba(253, 0, 0, 0.3)';
    h1.textContent = 'Error';
    p.textContent = 'invalid value. Try again';
  }

  if (divNotification.className === 'success') {
    divNotification.style.background = 'rgba(10, 189, 0, 0.3)';
    h1.textContent = 'Success';
    p.textContent = 'Employee is successfuly added to the table';
  }

  setTimeout(() => divNotification.remove(), 2000);
};

let count = 0;
let currentSortedCollumn = '';

const tBody = document.querySelector('tbody');

body.addEventListener('click', event => {
  event.preventDefault();

  if (event.target.closest('button')) {
    const columnsAmount = tBody.rows[0].cells.length;

    const nameInput = document.querySelector('form').children[0].children[0];
    const ageInput = document.querySelector('form').children[3].children[0];
    const positionInput = document.querySelector('form').children[1]
      .children[0];
    const salaryInput = document.querySelector('form').children[4].children[0];

    if (nameInput.value === ''
      || ageInput.value === ''
      || positionInput.value === ''
      || salaryInput.value === '') {
      createNotification('error');

      return;
    }

    if (nameInput.value.length < 4
      || (+ageInput.value < 18 || +ageInput.value > 90)) {
      createNotification('error');

      return;
    }

    const labels = document.querySelectorAll('label');
    const formValues = [];

    for (const label of labels) {
      formValues.push(label.children[0]);
    }

    const salary = formValues.pop();

    const rows = document.createElement('tr');

    for (let i = 0; i < columnsAmount; i++) {
      tBody.append(rows);
    }

    const lastRow = tBody.lastChild;

    lastRow.innerHTML = `
  ${formValues.map(formValue => `
  <td>${formValue.value}</td>
  `).join('')}
  `;

    const lastCell = document.createElement('td');

    lastCell.textContent = convertSalary(salary.value);
    lastRow.append(lastCell);

    createNotification('success');
  }

  if (event.target.closest('thead')) {
    const tbody = document.querySelector('tbody');

    const tableRows = [...tbody.rows];

    const onlyNumbers = string => {
      const result = string.replace(/[$,]/g, '');

      return result.length ? +result : NaN;
    };

    const sortRows = (array, sortType) => {
      if (sortType === 'ABC') {
        array.sort((a, b) => {
          const first = a.children[event.target.cellIndex].innerText;
          const second = b.children[event.target.cellIndex].innerText;

          return isNaN(onlyNumbers(first)) ? first.localeCompare(second)
            : onlyNumbers(first) - onlyNumbers(second);
        }
        );
      } else if (sortType === 'DESC') {
        array.sort((a, b) => {
          const first = a.children[event.target.cellIndex].innerText;
          const second = b.children[event.target.cellIndex].innerText;

          return isNaN(onlyNumbers(first)) ? second.localeCompare(first)
            : onlyNumbers(second) - onlyNumbers(first);
        }
        );
      }
    };

    if (currentSortedCollumn !== event.target.textContent) {
      currentSortedCollumn = event.target.textContent;
    }

    count === 0 ? (sortRows(tableRows, 'ABC'), count = 1)
      : (count = 0, sortRows(tableRows, 'DESC'));

    tbody.append(...tableRows);
  }
}
);

tBody.addEventListener('click', (e) => {
  for (const item of tBody.children) {
    item.classList.remove('active');
  }

  e.target.parentElement.classList.add('active');
});

function convertSalary(number) {
  return `$${Intl.NumberFormat('en-US').format(number)}`;
}

tBody.addEventListener('dblclick', event => {
  const target = event.target;
  const initialTextContent = target.textContent;

  const inputCell = document.createElement('input');

  inputCell.type = 'text-area';
  inputCell.className = 'cell-input';

  event.target.textContent = '';
  event.target.append(inputCell);

  inputCell.addEventListener('blur', ev => {
    if (inputCell.value === '') {
      inputCell.value = initialTextContent;
    }
  });

  inputCell.addEventListener('keydown', ev => {
    const tableRows = [...tBody.rows];

    if (ev.keyCode === 13) {
      for (const row of tableRows) {
        if (target === row.lastElementChild) {
          target.textContent = convertSalary(+inputCell.value);
          break;
        } else {
          target.textContent = inputCell.value;
        }
      }
    }
  });
});

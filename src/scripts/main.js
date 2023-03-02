'use strict';

const table = document.body.querySelector('table');
const tHeaders = Array.from(document.body.querySelector('thead')
  .rows[0]
  .children
);
const tBody = document.body.querySelector('tbody');
const tBodyRows = Array.from(tBody.children);

tHeaders.forEach((header) => header.addEventListener('click', toSort));

function toSort(e) {
  const target = e.target;
  const columnNumber = tHeaders.indexOf(target);

  if (!target.countClick) {
    target.countClick = 1;
  } else {
    target.countClick = 2;
  }

  if (!table.contains(target)) {
    return;
  }

  const sortedList = tBodyRows.sort((a, b) => {
    const dataA = a.children[columnNumber].textContent;
    const dataB = b.children[columnNumber].textContent;

    switch (columnNumber) {
      case 3:
        if (target.countClick === 2) {
          return Number(dataB) - Number(dataA);
        }

        return Number(dataA) - Number(dataB);

      case 4:
        if (target.countClick === 2) {
          return salaryToNumber(dataB) - salaryToNumber(dataA);
        }

        return salaryToNumber(dataA) - salaryToNumber(dataB);

      default:
        if (target.countClick === 2) {
          return dataB.localeCompare(dataA);
        }

        return dataA.localeCompare(dataB);
    }
  });

  if (target.countClick === 2) {
    target.countClick = 0;
  };

  sortedList.forEach((item) => tBody.append(item));
};

function salaryToNumber(string) {
  const salary = string.slice(1).split(',').join('');

  return Number(salary);
}

tBody.addEventListener('click', (e) => {
  e.target.classList.add('active');
});

const form = document.createElement('form');

form.method = 'GET';
form.action = '/';
form.classList.add('new-employee-form');
table.after(form);

form.insertAdjacentHTML('afterbegin',
  `
  <label>Name:
    <input name="name" type="text" data-qa="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="tokyo">Tokyo</option>
      <option value="singapore">Singapore</option>
      <option value="london">London</option>
      <option value="newYork">New York</option>
      <option value="edinburgh">Edinburgh</option>
      <option value="sanFrancisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button name="saveToTable" type="submit" value="saveToTable">
    Save to table
  </button>
`
);

const submitButton = form.querySelector('button');
const labels = Array.from(form.querySelectorAll('label'));

submitButton.addEventListener('click', (e) => {
  let count = 0;
  const row = tBodyRows[tBodyRows.length - 1].cloneNode(true);
  const columns = Array.from(row.children);

  tBody.append(row);

  labels.forEach((label) => {
    const inputValue = label.firstElementChild.value;

    if (count < 3) {
      const apperCaseValue
        = inputValue.slice(0, 1).toUpperCase()
        + inputValue.slice(1);

      columns[count].textContent = apperCaseValue;
    } else if (count === 4) {
      columns[count].textContent = Number(inputValue).toLocaleString('es-US',
        {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        });
    } else {
      columns[count].textContent = inputValue;
    }

    count++;
  });

  e.preventDefault();
});

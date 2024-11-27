'use strict';

const table = document.querySelector('table');
// const thead = table.tHead;
let tbody = table.tBodies[0];
let tbodyRows = [...tbody.rows];

function toNumber(str) {
  const num = parseFloat(str.replace(/[$,]/g, ''));

  return isNaN(num) ? str.trim().toLowerCase() : num;
}
// TABLE

// eslint-disable-next-line no-shadow
table.addEventListener('click', (event) => {
  const title = event.target.closest('th');
  const row = event.target.closest('tr');

  if (title) {
    const index = title.cellIndex;
    const newRows = [...tbodyRows];
    const isSorted = title.classList.toggle('sorted');

    newRows.sort((a, b) => {
      const valueFirst = isSorted
        ? `${b.cells[index].innerHTML}`
        : `${a.cells[index].innerHTML}`;
      const valueSecond = isSorted
        ? `${a.cells[index].innerHTML}`
        : `${b.cells[index].innerHTML}`;

      if (!isNaN(toNumber(valueFirst)) && !isNaN(toNumber(valueSecond))) {
        return toNumber(valueFirst) - toNumber(valueSecond);
      }

      return valueFirst.localeCompare(valueSecond);
    });

    tbody.innerHTML = '';
    // eslint-disable-next-line no-shadow
    newRows.forEach((row) => tbody.appendChild(row));
  }

  if (row && row.rowIndex !== 0 && row.rowIndex !== tbodyRows.length - 1) {
    let countActive = 0;

    for (const r of tbodyRows) {
      if (r.classList.contains('active')) {
        countActive++;
      }
    }

    row.classList.toggle('active', countActive < 1);
  }
});

const body = document.body;
const form = document.createElement('form');

// FORM

form.classList.add('new-employee-form');

form.innerHTML = `
<lable>Name: <input name='name' type='text' data-qa="name" required></lable>
<lable>Position: <input name='position' type='text' data-qa="position" required></lable>
<lable>Office:
  <select name="office" id="office" data-qa="office" required>
    <option value="tokyo">Tokyo</option>
    <option value="singapore">Singapore</option>
    <option value="london">London</option>
    <option value="new york">New York</option>
    <option value="edinburgh">Edinburgh</option>
    <option value="san francisco">San Francisco</option>
  </select>
</lable>
<lable>Age: <input name='age' type='number' data-qa="age" required> </lable>
<lable>Salary: <input name='salary' type='number' data-qa="salary" required> </lable>
<button type='submit'>Save to table</button>
`;
body.appendChild(form);

// BUTTON

const button = body.querySelector("[type='submit']");
const createRow = (data) => {
  const row = document.createElement('tr');

  const convertToString = (num) => {
    if (num === null || num === undefined || isNaN(+num)) {
      return '';
    }

    return `$${(+num).toLocaleString('en-US')}`;
  };

  row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>${convertToString(data.salary)}</td>
  `;

  tbody.appendChild(row);
  tbody = table.tBodies[0];
  tbodyRows = [...tbody.rows];
};
// NOTIFICATION
const pushNotification = (posRight, title, description, type) => {
  const posTop = body.offsetHeight / 2 - body.getBoundingClientRect().top;
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  h2.textContent = title;
  p.textContent = description;
  notification.append(h2, p);

  body.appendChild(notification);
  setTimeout(() => (notification.style.display = 'none'), 2000);
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const isValide = () => {
    const checkInput = Object.values(data).every((val) => val !== '');
    const checkName = data.name.length >= 4;
    const checkAge = data.age >= 18 && data.age <= 90;

    if (checkInput && checkName && checkAge) {
      return true;
    }

    return false;
  };

  if (isValide()) {
    createRow(data);
    pushNotification(10, 'Success', 'Data added successfully', 'success');
    form.reset();
  } else {
    pushNotification(
      10,
      'Error',
      'Please fill in all fields and check valid values',
      'error',
    ); // eslint-disable-line
  }
});

// DBLCLICK

// eslint-disable-next-line no-shadow
// tbody.addEventListener('dblclick', (event) => {
//   const cell = event.target.closest('td');

//   if (cell) {
//     const copyTextCell = cell.textContent;
//     const input = document.createElement('input');
//     const cellIndex = cell.cellIndex;
//     const cellTextChange = (value) => {
//       const checkInputValue = () => {
//         if (value.length) {
//           if (cellIndex === 4) {
//             input.value = `$${toNumber(value).toLocaleString('en-US')}`;
//           }
//         } else {
//           input.value = copyTextCell;
//         }

//         return input.value;
//       };

//       cell.innerText = checkInputValue(input.value);
//       input.remove();
//     };

//     input.type = 'text';
//     input.classList.add('cell-input');
//     cell.innerText = '';
//     cell.appendChild(input);

//     input.addEventListener('blur', () => {
//       cellTextChange(input.value);
//     });

//     // eslint-disable-next-line no-shadow
//     window.addEventListener('keydown', (event) => {
//       if (event.key === 'Enter') {
//         cellTextChange(input.value);
//       }
//     });
//   }
// });
// eslint-disable-next-line no-shadow
tbody.addEventListener('dblclick', (event) => {
  const cell = event.target.closest('td');

  if (cell && cell.cellIndex !== undefined) {
    const initialValue = cell.textContent.trim();
    const input = document.createElement('input');

    input.type = 'text';
    // input.value = initialValue.replace(/[$,]/g, '');
    input.classList.add('cell-input');
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();

    const saveValue = () => {
      const newValue = input.value.trim();

      if (cell.cellIndex === 4 && isNaN(+newValue)) {
        cell.textContent = `$${(+initialValue.replace(/[$,]/g, '')).toLocaleString('en-US')}`;
      } else if (newValue) {
        cell.textContent =
          cell.cellIndex === 4
            ? `$${(+newValue).toLocaleString('en-US')}`
            : newValue;
      } else {
        cell.textContent = initialValue;
      }
    };

    input.addEventListener('blur', saveValue);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveValue();
      }
    });
  }
});

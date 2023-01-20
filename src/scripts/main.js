'use strict';

// write code here
const head = document.querySelector('thead');
const body = document.querySelector('tbody');

// sorted table
let count = 0;

head.addEventListener('click', (e) => {
  const sort = e.target.cellIndex;

  count++;

  const sorted = [...body.children].sort((a, b) => {
    let one = a.cells[sort].innerText;
    let two = b.cells[sort].innerText;

    if (one.includes('$')) {
      one = one.replace(/[$,]/g, '');
      two = two.replace(/[$,]/g, '');

      return one - two;
    }

    return one.localeCompare(two);
  });

  if (count % 2 === 1) {
    body.append(...sorted);
  } else {
    body.append(...sorted.reverse());
  }
});

// highlighted click
body.addEventListener('click', (e) => {
  const target = e.target;

  [...body.rows].forEach(row => row.classList.contains('active')
    ? row.classList.remove('active')
    : target.parentNode.classList.add('active'));
});

// form
const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

form.insertAdjacentHTML('afterbegin', `
<label>
  Name:
    <input
      name="name"
      data-qa="name"
      type="text"
      min = '4'
    >
</label>
<label>
  Position:
    <input 
      name="position"
      data-qa="position"
      type="text"
    >
</label>
<label>
  Office: 
    <select name="office" data-qa="office" type="text">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
</label>
<label>
  Age: 
    <input 
      name="age"
      data-qa="age" 
      type="number"
    >
</label>
<label>
  Salary:
    <input 
      name="salary"
      data-qa="salary" 
      type="number" 
      min = '0'
    >
</label>
<button type='submit'>Save to table</button>
`);

// notification and adding rows in the table
const input = [...form.querySelectorAll('input')];
const options = form.querySelector('option').innerText;

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  const h2 = document.createElement('h2');

  div.dataset.qa = 'notification';
  div.classList.add('notification', type);

  p.innerText = description;
  h2.innerText = title;

  div.append(h2);
  div.append(p);
  document.body.append(div);

  setTimeout(() => div.remove(), 5000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const salary = '$' + new Intl.NumberFormat('en-GB').format(input[3].value);
  const nameEmp = input[0].value;
  const age = Number(input[2].value);
  const position = input[1].value;

  if (nameEmp.length < 4) {
    pushNotification('Oops!',
      'Name must be longer than 4 letters', 'error');
  } else if (age < 18 || age > 90) {
    pushNotification('Oh no!',
      'Age must be between 18 & 90 years', 'error');
  } else if (!position) {
    pushNotification('Error',
      'Please enter the position', 'error');
  } else if (!input[3].value) {
    pushNotification('Error', 'Please enter the salary', 'error');
  } else {
    body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${nameEmp}</td>
        <td>${position}</td>
        <td>${options}</td>
        <td>${age}</td>
        <td>${salary}</td>
        </tr>
      `);
    pushNotification('Success', 'New employee was added', 'success');

    input.forEach(item => {
      item.value = '';
    }
    );
  }
});

// double click
body.addEventListener('dblclick', (e) => {
  const newInput = document.createElement('input');

  const cellText = e.target.textContent;

  const clickedCell = e.target;

  clickedCell.textContent = '';

  newInput.classList.add('cell-input');
  newInput.placeholder = cellText;

  clickedCell.append(newInput);

  newInput.focus();

  const cellInput = document.querySelector('.cell-input');

  if (clickedCell.cellIndex === 2) {
    clickedCell.innerHTML = `
      <select name="office"
              data-qa="office" 
              type="text"
              class="cell-input"
              class="temporary"
      >
        <option value="tokyo">Tokyo</option>
        <option value="singapore">Singapore</option>
        <option value="london">London</option>
        <option value="new york">New York</option>
        <option value="edinburg">Edinburgh</option>
        <option value="san francisco">San Francisco</option>
      </select>
  `;
  };

  newInput.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      if (cellInput.value.length === 0) {
        cellInput.value = cellText;
      }

      changingTheTable(clickedCell, cellInput, cellText);
      pushNotification('Success', 'Changes was added', 'success');
    }
  });

  newInput.addEventListener('blur', () => {
    if (cellInput.value.length === 0) {
      cellInput.value = cellText;
    }

    changingTheTable(clickedCell, cellInput, cellText);
  });
});

// clickedCell === cell, cellInput === inputCell, cellText === text
function changingTheTable(cell, inputCell, text) {
  switch (cell.cellIndex) {
    case 0:
      if (inputCell.value.length < 4) {
        cell.textContent = text;
      } else {
        cell.textContent = inputCell.value;
      }
      break;

    case 1:
      cell.textContent = inputCell.value;
      break;

    case 2:
      const option = cell.querySelectorAll('option');

      if (option.textContent === text) {
        option.setAttribute('selected', true);
      }

      cell.textContent = option.textContent;
      document.querySelector('.temporary').remove();
      break;

    case 3:
      if (!Number(inputCell.value)
        || inputCell.value < 18 || inputCell.value > 90) {
        cell.textContent = text;
      } else {
        cell.textContent = inputCell.value;
      }
      break;

    case 4:
      if (!Number(inputCell.value)) {
        cell.textContent = text;
      } else {
        cell.textContent
          = '$' + new Intl.NumberFormat('en-GB').format(inputCell.value);
      }
      break;
  }
};

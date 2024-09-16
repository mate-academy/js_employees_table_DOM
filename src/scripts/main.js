'use strict';

// write code here
const headers = document.querySelector('thead tr');
const tableBody = document.querySelector('tbody');
const list = [...tableBody.querySelectorAll('tr')];
let lastChoise;
let x = 1;

// [1] sorting
headers.addEventListener('click', action => {
  if (action.target.tagName !== 'TH') {
    return;
  }

  const index = [...headers.children].indexOf(action.target);
  let callback;

  switch (index) {
    case 3: // age
      callback = (a, b) => a.children[index].innerText
      - b.children[index].innerText;
      break;

    case 4: // salary
      callback = (a, b) => getSalary(a) - getSalary(b);
      break;

    default: // name && position && office
      callback = (a, b) => {
        return a.children[index].innerText
          .localeCompare(b.children[index].innerText);
      };
  }

  function getSalary(row) {
    return +row.children[4].innerText.slice(1).split(',').join('');
  }

  // DESC or ASC order
  if (lastChoise === index) {
    x *= -1;
  } else {
    lastChoise = index;
    x = 1;
  }

  tableBody.innerHTML = '';
  list.sort((a, b) => callback(a, b) * x).forEach(tr => tableBody.append(tr));
});

// [2] focusing
let activeRow;

tableBody.addEventListener('click', action => {
  if (activeRow) {
    activeRow.classList.remove('active');
  }

  activeRow = action.target.closest('tr');
  activeRow.classList.add('active');
});

// [3] adding form
document.querySelector('table').insertAdjacentHTML('afterend', `
<form class="new-employee-form">
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
<select 
  name="office" 
  data-qa="office">
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
>
</label>

<label>
Salary: 
<input 
  name="salary" 
  type="number"
  data-qa="salary"
>
</label>
<button 
  type="submit">
    Save to table
</button>
</form>`
);

const form = document.querySelector('.new-employee-form');

// [4] converting salary
function normilize(key, value) {
  return key === 'salary'
    ? `$${(+value).toLocaleString()}`
    : value;
}

// [5] poping up notification
function showNotification(type, message) {
  form.insertAdjacentHTML('afterend', `
  <div 
    class="notification" 
    data-qa="notification">
      <h1 class="title"></h1>
      <p></p>
  </div>
  `);

  const notification = document.querySelector('.notification');
  const notificationTitle = document.querySelector('.title');
  const notificationDescription = document.querySelector('p');

  switch (type) {
    case 'error':
      notification.classList.add('error');
      notificationTitle.innerHTML = 'ERROR';
      break;

    case 'success':
      notification.classList.add('success');
      notificationTitle.innerHTML = 'SUCCESS';
      break;

    default:
      return;
  }

  notificationDescription.innerHTML = message;

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// [6] validating input
function validation(key, value) {
  if (!value) {
    showNotification('error', 'All fields are required');

    return false;
  }

  if (key === 'name' && value.length < 4) {
    showNotification('error', 'Name length should be at least 4 letters');

    return false;
  }

  if (key === 'age' && (+value < 18 || +value > 90)) {
    showNotification('error', 'Age should be from 18 to 90');

    return false;
  }

  return true;
}

// [7] adding new employee
form.addEventListener('submit', action => {
  action.preventDefault();

  const dataFromForm = new FormData(form);
  const newRow = document.createElement('tr');

  for (const [key, value] of dataFromForm) {
    if (!validation(key, value)) {
      return;
    }

    newRow.insertAdjacentHTML('beforeend', `
    <td>
      ${normilize(key, value)}
    </td>`);
  }

  tableBody.append(newRow);
  form.reset();

  showNotification('success',
    'New employee is successfully added to the table');
});

// [8] editing cell
tableBody.addEventListener('dblclick', action => {
  const target = action.target;
  const targetCell = target.cellIndex;
  const oldData = target.innerText;
  const resetData = oldData.replace(/[$,]/g, '');
  const targetInput = form.querySelectorAll('[name]')[targetCell]
    .cloneNode(true);

  targetInput.classList.add('cell-input');
  targetInput.value = resetData;
  target.firstChild.replaceWith(targetInput);
  targetInput.focus();

  targetInput.addEventListener('keypress', eventKey => {
    if (eventKey.key === 'Enter') {
      targetInput.blur();
    }
  });

  targetInput.addEventListener('blur', e => {
    if (
      !validation(targetInput.name, targetInput.value) || !targetInput.value
    ) {
      target.innerText = oldData;

      return;
    }

    target.innerText = normilize(targetInput.name, targetInput.value);
  });
});

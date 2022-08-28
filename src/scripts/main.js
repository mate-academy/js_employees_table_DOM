'use strict';

const toNum = (numStr) => {
  if (numStr[0] !== '$') {
    return +numStr;
  }

  return Number(numStr.split(',').join('').slice(1));
};

const heading = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tr = document.querySelectorAll('tr');
const arr = [];

tr.forEach(item => arr.push(item));
arr.shift();
arr.pop();

let oldTarget = null;
let clickCount = 0;

const sortingHandler = e => {
  const targetItem = e.target.closest('th');

  if (!targetItem || !heading.contains(targetItem)) {
    return;
  }

  arr.sort((a, b) => {
    const aElement = a.children[targetItem.cellIndex].innerText;
    const bElement = b.children[targetItem.cellIndex].innerText;

    if (targetItem.innerText === 'Salary' || targetItem.innerText === 'Age') {
      return toNum(aElement) - toNum(bElement);
    }

    return aElement.localeCompare(bElement);
  });

  if (targetItem === oldTarget) {
    clickCount += 1;

    if (clickCount % 2 !== 0) {
      arr.reverse();
    }
  } else {
    clickCount = 0;
  };

  tbody.innerHTML = arr.map(item => `
    <tr>
      <td>${item.children[0].innerText}</td>
      <td>${item.children[1].innerText}</td>
      <td>${item.children[2].innerText}</td>
      <td>${item.children[3].innerText}</td>
      <td>${item.children[4].innerText}</td>
    </tr>
  `).join('');

  oldTarget = targetItem;
};

let oldTargetRow = null;

const rowHandler = e => {
  const targetRow = e.target.closest('tr');

  if (oldTargetRow !== null && targetRow.innerText !== oldTargetRow.innerText) {
    oldTargetRow.classList.remove('active');
  }
  targetRow.classList.add('active');
  oldTargetRow = targetRow;
};

/* Start script for creating form; */
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('beforeend', `
  <label>Name: 
    <input name="name" data-qa="name" type="text" required>
  </label>

  <label>Position: 
    <input name="position" data-qa="position" type="text" required>
  </label>

  <label>Office: 
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburhg">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label>Age: 
    <input name="age" data-qa="age" type="number" required>
  </label>

  <label>Salary: 
    <input  data-qa="salary" name="salary" type="number" required>
  </label>

  <button type="submit">Save to table</button>
`);
document.body.append(form);
/* End creating form. */

/* Handler for submit + validation */
function prettySalary(salary) {
  const strNum = String(salary);
  const numberArr = strNum.split('');
  const numberArrCopy = [...numberArr];
  let count = 1;

  for (let i = numberArr.length - 1; i !== 0; i--) {
    if (count % 3 === 0 && count !== 0) {
      numberArrCopy.splice(i, 0, ',');
    }

    count++;
  }

  return '$' + numberArrCopy.join('');
}

const validation = data => {
  if (data.get('name').length < 4) {
    return 'Invalid name';
  }

  if (+data.get('age') < 18 || +data.get('age') > 90) {
    return 'Invalid age';
  }
};

const submitHandler = e => {
  e.preventDefault();

  const data = new FormData(form);
  const div = document.createElement('div');

  div.classList.add('notification');
  div.setAttribute('data-qa', 'notification');

  if (validation(data) === 'Invalid name') {
    div.classList.add('error');

    div.innerHTML = `
      <h2 class = "title">Invalid name</h2>
      <p>You type too short name. Change it.</p>
    `;
  } else if (validation(data) === 'Invalid age') {
    div.classList.add('error');

    div.innerHTML = `
      <h2 class = "title">Invalid age</h2>
      <p>You type too big or too small age. Fix it.</p>
    `;
  } else {
    div.classList.add('success');

    div.innerHTML = `
      <h2 class = "title">Success</h2>
      <p>Employee was added to the list.</p>
    `;

    const newTr = document.createElement('tr');
    const newEmpSalary = prettySalary(data.get('salary'));

    newTr.innerHTML = `
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>${newEmpSalary}</td>
    `;

    arr.push(newTr);
    tbody.insertAdjacentElement('beforeend', newTr);
  }

  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

/* End handler */

/* Double click on cell handler */

const doubleClickHandler = e => {
  const targetCell = e.target.closest('td');
  const initialValue = targetCell.innerText;

  targetCell.innerText = '';
  targetCell.innerHTML = `<input name="inputVal" class="cell-input">`;

  const targetInput = document.querySelector('.cell-input');

  targetCell.addEventListener('keypress', ev => {
    if (ev.key === 'Enter') {
      if (targetInput.value) {
        targetCell.innerText = targetInput.value;
      } else {
        targetCell.innerText = initialValue;
      }
    }
  });
};

/* End handler */

heading.addEventListener('click', sortingHandler);
tbody.addEventListener('click', rowHandler);
form.addEventListener('submit', submitHandler);
tbody.addEventListener('dblclick', doubleClickHandler);

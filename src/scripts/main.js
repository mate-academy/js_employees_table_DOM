'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let index;
let tbodyChildren;

// table sorting by clicking on the title

thead.addEventListener('click', (et) => {
  if (!et.target) {
    return;
  }

  if (index === et.target.cellIndex) {
    return tbody.append(...tbodyChildren.reverse());
  } else {
    index = et.target.cellIndex;

    tbodyChildren = [...tbody.children].sort((a, b) => {
      const elemA = a.cells[index].textContent.replace(/[$,]/g, '');
      const elemB = b.cells[index].textContent.replace(/[$,]/g, '');

      return isNaN(elemA)
        ? elemA.localeCompare(elemB)
        : elemA - elemB;
    });
  }
  tbody.append(...tbodyChildren);
});

// user clicks on a row, it should become selected

tbody.addEventListener('click', (et) => {
  for (const row of [...tbody.rows]) {
    row.classList.remove('active');
  }

  et.target.parentNode.className = 'active';
});

// add a form

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>
      Name: 
      <input name="name" type="text" data-qa="name">
    </label>

    <label>
      Position: 
      <input name="position" type="text" data-qa="position">
    </label>

    <label>
      Office: 
      <select name="office" type="text" data-qa="office">
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
      <input name="age" type="number" data-qa="age">
    </label>

    <label>
      Salary: 
      <input name="salary" type="number" data-qa="salary">
    </label>

    <button>Save to table</button>
  </form>
`);

// notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.className = `notification ${type}`;

  div.style = `
    position: absolute;
    top: ${posTop}px; 
    right: ${posRight}px
  `;

  div.innerHTML = `
    <h2 class='title'>${title}</h2>
    <p>${description}</p>
  `;

  div.setAttribute('data-qa', 'notification');

  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

pushNotification(10, 10, 'Warning',
  'All fields are required.', 'warning');

// click on Save to table

const button = document.querySelector('button');
const form = document.querySelector('.new-employee-form');

button.addEventListener('click', (et) => {
  et.preventDefault();
  validateForm();
});

function validateForm() {
  if (form.elements[0].value.length < 4) {
    return pushNotification(10, 310, 'Error',
      'Fill in the field min 4 letter.', 'error');
  }

  if (form.elements[1].value.length <= 0
    || form.elements[3].value.length <= 0
    || form.elements[4].value.length <= 0) {
    return pushNotification(10, 310, 'Error',
      'All fields are required.', 'error');
  }

  if (form.elements[3].value < 18 || form.elements[3].value > 90) {
    return pushNotification(10, 310, 'Error',
      'Age value is less than 18 or more than 90.', 'error');
  }

  addEmployee();
};

function addEmployee() {
  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${form.elements[0].value}</td>
      <td>${form.elements[1].value}</td>
      <td>${form.elements[2].value}</td>
      <td>${form.elements[3].value}</td>
      <td>
        $${parseInt(form.children[4].children[0].value).toLocaleString('en-US')}
      </td>
    </tr>
  `);

  pushNotification(10, 10, 'Success',
    'A new employee added to the table.', 'success');

  [...form.elements].map(el => {
    el.value = '';
  });
};

// double-clicking

let text = '';

tbody.addEventListener('dblclick', (et) => {
  const tdInput = document.createElement('input');
  let tdSelect = document.createElement('select');
  const td = et.target;

  tdSelect = document.querySelector('select').cloneNode(true);
  text = td.textContent;

  tdInput.className = 'cell-input';
  tdInput.value = '';
  td.innerHTML = '';
  td.append(tdInput);

  if (td.cellIndex === 3 || td.cellIndex === 4) {
    tdInput.type = 'number';
  }

  if (td.cellIndex === 2) {
    td.innerHTML = '';
    td.append(tdSelect);
  }

  tdSelect.addEventListener('blur', () => {
    td.innerHTML = tdSelect.value;
  });

  tdSelect.addEventListener('keydown', (e) => {
    if (e.code !== 'Enter') {
      return;
    }
    td.innerHTML = tdSelect.value;
  });

  tdInput.addEventListener('blur', () => {
    td.innerHTML = tdInput.value;

    if (td.textContent.length === 0) {
      td.innerHTML = text;
    }
  });

  tdInput.addEventListener('keydown', (e) => {
    if (e.code !== 'Enter') {
      return;
    }
    td.innerHTML = tdInput.value;

    if (td.textContent.length === 0) {
      td.innerHTML = text;
    }
  });
});

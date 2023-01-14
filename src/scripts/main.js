'use strict';

const table = document.querySelector('table');
const tableHeader = table.rows[0];
const tableRows = table.tBodies[0];
const rowsCollection = tableRows.rows;
const objClicked = {};
const form = document.createElement('form');
const selectCity = [
  'Tokyo', 'Singapore',
  'London', 'New&#32;York',
  'Edinburgh', 'San&#32;Francisco',
];
const submitBtn = document.createElement('button');
const block = document.createElement('div');
const blockTitle = document.createElement('h3');
const textP = document.createElement('p');
let defaultText;

addInput('name');
addInput('position');

const unitAge = addInput('age', 'number');
const unitSalary = addInput('salary', 'number');

unitAge.min = 0;
unitSalary.min = 0;

form.children[2].insertAdjacentHTML('beforebegin', `
  <label> Office
    <select name="office" data-qa="office" required>
      ${selectCity.map(text => `
      <option value=${text}>${text}</option>
      `)};
    </select>
  </label>
`);

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.append(submitBtn);

form.className = 'new-employee-form';
table.after(form);

tableRows.addEventListener('dblclick', e => {
  const td = e.target.closest('td');

  if (!td || !tableRows.contains(td)) {
    return null;
  }

  defaultText = td.textContent;

  const input = createInput();

  td.textContent = '';
  td.append(input);

  input.addEventListener('blur', addNewData);

  input.addEventListener('keypress', (keypress) => {
    if (keypress.key === 'Enter') {
      addNewData(keypress);
    }
  });

  function addNewData(action) {
    let value = action.target.value;

    if (!(value.trim().length > 0)) {
      value = defaultText;
    }
    td.textContent = value;
    input.remove();
  }
});

tableRows.addEventListener('click', e => {
  const item = e.target.closest('tr');

  if (!item || !tableRows.contains(item)) {
    return null;
  }

  [...rowsCollection].forEach(element => {
    if (element.classList.contains('active')) {
      element.classList.toggle('active');
    }
  });
  item.classList.add('active');
});

tableHeader.addEventListener('click', e => {
  const item = e.target.closest('th');

  if (!item || !tableHeader.contains(item)) {
    return null;
  }

  const index = e.target.cellIndex;

  if (objClicked[index] === undefined || objClicked[index] === false) {
    tableSort(index);
    objClicked[index] = true;
  } else {
    tableSort(index, false);
    objClicked[index] = false;
  }
});

function tableSort(index, asc = true) {
  const arr = Array.from(table.querySelectorAll('tbody tr'));

  arr.sort((a, b) => {
    let aValue = a.children[index].innerText;
    let bValue = b.children[index].innerText;

    if (aValue.includes('$')) {
      aValue = aValue.slice(1).replace(',', '');
      bValue = bValue.slice(1).replace(',', '');

      return (asc) ? aValue - bValue : bValue - aValue;
    }

    return (asc) ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  arr.forEach(elem => {
    table.querySelector('tbody').appendChild(elem);
  });
}

function addInput(text, type = 'text') {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const content = `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

  if (type === 'text') {
    input.pattern = '[A-Za-z -]+';

    const validNote = 'this.setCustomValidity("Use words, \' \', and - ")';

    input.setAttribute('onchange', 'this.setCustomValidity("")');
    input.setAttribute('oninvalid', validNote);
  }

  input.name = text;
  input.type = type;
  input.setAttribute('data-qa', text);
  label.textContent = content;
  label.append(input);
  form.append(label);

  return input;
}

function note(message, type = 'error') {
  blockTitle.className = 'title';
  blockTitle.textContent = type;
  block.className = 'notification';
  block.setAttribute('data-qa', 'notification');
  block.classList.add(type);
  textP.textContent = message;
  block.append(blockTitle);
  block.append(textP);

  return block;
};

form.addEventListener('submit', (send) => {
  send.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());
  const checkName = validateTextData(dataObject.name).length < 4;
  const checkPosition = validateTextData(dataObject.position).length < 4;
  const checkAge = +dataObject.age < 18 || +dataObject.age > 90;
  const textMessage = `
    Text must contain > 3 symbols
    only words, spaces and '-'
    without digits
  `;
  const ageMessage = `Age must be at 18 to 90`;
  const added = 'employee added to the table';

  if (checkName || checkPosition) {
    form.after(note(textMessage));
  } else if (checkAge) {
    form.after(note(ageMessage));
  } else {
    addToTable(dataObject);

    const successNote = note(added, 'success');

    form.after(successNote);
    document.querySelector('.new-employee-form').reset();
    setTimeout(() => successNote.remove(), 2000);
  }
});

function addToTable(employee) {
  const { name: empName, position, office, age, salary } = employee;

  const validSalary = `$${Number(salary).toLocaleString('en-EN')}`;

  tableRows.insertAdjacentHTML('beforeend', `
    <tr>
        <td>
          ${validateTextData(empName)}
        </td>
        <td>
          ${validateTextData(position)}
        </td>
        <td>
          ${office}
        </td>
        <td>
          ${age}
        </td>
        <td>
          ${validSalary}
        </td>
    </tr>
  `);
}

function validateTextData(dataText) {
  const textData = dataText.trim();
  const arr = [];

  textData.split(' ').forEach(item => {
    if (item !== '') {
      arr.push(item);
    }
  });

  const textArray = arr.map(word => {
    return (word[0].toUpperCase() + word.slice(1));
  });

  return textArray.join(' ');
}

function createInput(startValue = '') {
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = 'text';
  input.value = startValue;

  return input;
};

'use strict';

const root = document.querySelector('body');
const table = document.querySelector('table');
const tHead = document.querySelector('thead > tr');
const tBody = document.querySelector('tbody');
const tdList = root.querySelectorAll('td');

// When I want edit my table cell, my input have own width, and table stretches.
// Here I set fixed width for my cells,
// and in css 100% relative width for my input.
const setWidth = () => {
  tdList.forEach(td => {
    td.style.width = `${parseFloat(getComputedStyle(td).width)}px`;
  });
};

setWidth();

function addAttributes() {
  const tBodyList = [...tBody.children];

  for (const tr of tBodyList) {
    [...tr.cells].forEach((item, index) => {
      item.dataset.label = tHead.children[index].textContent.toLowerCase();
    });
  }
}

addAttributes();

// sort table;
const getNumber = num => {
  return num.replace(/[\D]+/g, '');
};

const parseTable = () => {
  return [...tBody.children].map(row => {
    const person = {};

    [...row.cells].forEach(cell => {
      person[cell.dataset.label] = cell.textContent;
    });

    return person;
  });
};

const sortData = (data, columnName, sortType) => {
  const arrEl = getNumber(data[0][columnName]);

  const callBacks = {
    'ASC': {
      forString: (a, b) => a[columnName].localeCompare(b[columnName]),
      forNum: (a, b) => getNumber(a[columnName]) - getNumber(b[columnName]),
    },
    'DESC': {
      forString: (a, b) => b[columnName].localeCompare(a[columnName]),
      forNum: (a, b) => getNumber(b[columnName]) - getNumber(a[columnName]),
    },
  };

  if (arrEl !== '') {
    return data.sort(callBacks[sortType].forNum);
  }

  return data.sort(callBacks[sortType].forString);
};

const replaceTable = (data) => {
  tBody.innerHTML = data.map(row => `
    <tr>
      <td data-label="name">${row.name}</td>
      <td data-label="position">${row.position}</td>
      <td data-label="office">${row.office}</td>
      <td data-label="age">${row.age}</td>
      <td data-label="salary">${row.salary}</td>
    </tr>
    `).join('');
};

tHead.addEventListener('click', e => {
  const sortType = e.target.dataset.sort;
  const sortColumnName = e.target.textContent.toLowerCase();
  const data = parseTable();

  switch (sortType) {
    case 'ASC':
      e.target.dataset.sort = 'DESC';
      break;

    case 'DESC':
      e.target.dataset.sort = 'ASC';
      break;

    default:
      e.target.dataset.sort = 'ASC';
      break;
  }

  sortData(data, sortColumnName, e.target.dataset.sort);

  replaceTable(data);
  setWidth();
});

// select row;

tBody.addEventListener('click', e => {
  if (e.target.parentNode.tagName !== 'TR') {
    return;
  }

  const selected = tBody.querySelector('.active');

  if (selected) {
    selected.classList.remove('active');
  }
  e.target.parentNode.classList.add('active');
});

// form;

const offices = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

const formEl = `
  <form class="new-employee-form">
    <label>
      Name: 
    <input 
      data-qa="name" 
      name="name" 
      type="text" 
      required
    >
    </label>
    <label>
      Position:
      <input
        data-qa="position" 
        name="position" 
        type="text"
      >
    </label>
    <label>
      Office:
      <select data-qa="office" name="office">
      ${offices.map(city => `<option value="${city}">${city}</option>`)}
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
    <button>Save to table</button>
  </form>
`;

const formValidator = (data) => {
  const nameLength = data.name.length;
  const age = data.age;
  const salary = data.salary;

  return nameLength > 4 && (age >= 18 && age <= 90) && salary > 0;
};

const addNotification = type => {
  let notification;

  switch (type) {
    case 'success':
      notification = `
        <div 
          data-qa="notification" 
          class="notification ${type}"
        >
          <p class="title">
            The employee was successfully added. 
          </p>
        </div>
      `;
      break;
    case 'error':
      notification = `
        <div 
          data-qa="notification" 
          class="notification ${type}"
        >
          <p class="title">
            Invalid data.
            Сheck the following:
            * Name value has not less than 4 letters
            * Age is not less than 18 or more than 90
          </p>
        </div>
        `;
      break;
  }
  root.insertAdjacentHTML('afterbegin', notification);

  setTimeout(() => {
    const message = root.querySelector('.notification');

    message.remove();
  }, 3000);
};

const makeSalaryValue = num => {
  const correctNum = num.toFixed(3);

  return `$${correctNum.toString().replace('.', ',')}`;
};

table.insertAdjacentHTML('afterend', formEl);

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tableData = Object.fromEntries(formData.entries());

  if (!formValidator(tableData)) {
    addNotification('error');

    return;
  }

  const newRow = `
    <tr>
      <td data-label="name">${tableData.name}</td>
      <td data-label="position">${tableData.position}</td>
      <td data-label="office">${tableData.office}</td>
      <td data-label="age">${tableData.age}</td>
      <td data-label="salary">${makeSalaryValue(+tableData.salary)}</td>
    </tr>
  `;

  tBody.insertAdjacentHTML('beforeend', newRow);
  addNotification('success');
  form.reset();
  setWidth();
});

// editing of table cells;

const getCellType = (value) => {
  let cellType;

  switch (true) {
    case value.includes('$'):
      cellType = 'salary';
      break;

    case offices.includes(value):
      cellType = 'office';
      break;

    case !isNaN(+value):
      cellType = 'age';
      break;

    case typeof value === 'string':
      cellType = 'str';
      break;
  }

  return cellType;
};

const validateCell = (cellType, newValue) => {
  switch (cellType) {
    case 'str':
      if (newValue.length > 2) {
        return newValue;
      }
      break;

    case 'office':
      if (offices.includes(newValue)) {
        return newValue;
      }
      break;

    case 'age':
      if (newValue >= 18 && newValue <= 90) {
        return newValue;
      }
      break;

    case 'salary':
      if (!isNaN(parseFloat(newValue.replace('$', '')))) {
        return `$${parseFloat(
          newValue
            .replace('$', '')
            .replace(',', '.')
            .replace('-', ''))
          .toFixed(3)
        }`;
      }
  }
};

tBody.addEventListener('dblclick', bodyEvent => {
  const initialValue = bodyEvent.target.textContent;

  bodyEvent.target.innerHTML = `<input 
                                  type="text" 
                                  class="cell-input"  
                                  value="${initialValue}">`;

  const inputCell = tBody.querySelector('.cell-input');

  inputCell.selectionStart = inputCell.value.length;
  inputCell.focus();

  const blurAction = (inputMouseEvent) => {
    const currentValue = inputMouseEvent.target.value;

    const currentCellType = getCellType(initialValue);

    const newData = validateCell(currentCellType, currentValue);

    const inputText = newData || initialValue;

    inputMouseEvent.target.outerHTML = `<td>${inputText}</td>`;
  };

  inputCell.addEventListener('blur', blurAction);

  inputCell.addEventListener('keydown', inputKeyEvent => {
    if (inputKeyEvent.key !== 'Enter') {
      return;
    }

    const inputText = inputKeyEvent.target.value;

    inputCell.removeEventListener('blur', blurAction);

    inputKeyEvent.target.outerHTML = `<td>${inputText}</td>`;
  });
});

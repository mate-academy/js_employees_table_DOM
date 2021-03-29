'use strict';

(function sortHandler() {
  const table = document.querySelector('table');

  const tableHead = table.tHead;
  const tableBody = table.tBodies[0];

  const sortKeys = [...tableHead.children[0].children]
    .map(td => td.textContent);

  tableHead.addEventListener('click', (e) => {
    const index = sortKeys.indexOf(e.target.textContent);

    if (e.target.clicked === 'undefined') {
      e.target.clicked = true;
    } else {
      e.target.clicked = !e.target.clicked;
    }

    sortByIndex(index, e.target.clicked);
  });

  function sortByIndex(index, ascending = true) {
    const rows = [...tableBody.children];
    const isNumber = index >= 3;

    const sorted = rows.sort((rowA, rowB) => {
      let textA = (ascending ? rowA : rowB).children[index].textContent;
      let textB = (ascending ? rowB : rowA).children[index].textContent;

      if (index === 4) {
        textA = textA.slice(1).replace(/,/g, '');
        textB = textB.slice(1).replace(/,/g, '');
      }

      if (isNumber) {
        return textA - textB;
      } else {
        return textA.localeCompare(textB);
      }
    });

    for (const row of sorted) {
      tableBody.append(row);
    }
  }
})();

(function createForm() {
  const body = document.querySelector('body');
  const selectOptions = [
    'Tokio', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
  ];
  const options = selectOptions
    .map(option => `<option value="${option}">${option}</option>`);
  const textNames = ['name', 'position'];
  const numberNames = ['age', 'salary'];
  const textInputs = textNames.map(textName => {
    const labelName = textName.slice(0, 1).toUpperCase() + textName.slice(1);

    return `
      <label>${labelName}:
          <input
            name="${textName}"
            type="text"
            data-qa="${textName}"
          required>
      </label>
    `;
  }).join('');
  const numberInputs = numberNames.map(numberName => {
    const labelName = numberName
      .slice(0, 1).toUpperCase() + numberName.slice(1);

    return `
      <label>${labelName}:
          <input
            name="${numberName}"
            type="number"
            data-qa="${numberName}"
          required>
      </label>
    `;
  }).join('');

  body.insertAdjacentHTML('beforeend', `
    <form action="/createemployee" class="new-employee-form" method="get">
      ${textInputs}
      <label>Office:
        <select name="office" id="office" data-qa="office">
          ${options}
        </select>
      </label>
      ${numberInputs}
      <button type="submit">
        Save to table
      </button>
    </form>
  `);
})();

(function addNewEmployee() {
  const button = document.querySelector('.new-employee-form button');

  button.addEventListener('click', (e) => {
    const { name: fname, position, office, age, salary }
      = button.parentNode.elements;

    if (position.value.length === 0) {
      e.preventDefault();

      pushNotification(10, 10, 'Incorrect position',
        'Position should not be empty', 'error');
    }

    if ([fname, office, age, salary]
      .every(input => input.value.length > 0)) {
      if (fname.value.length < 4) {
        e.preventDefault();

        pushNotification(10, 10, 'Incorrect name',
          'Name should contain at least 4 characters', 'error');
      } else if (age.value < 18 || age.value > 90) {
        e.preventDefault();

        pushNotification(10, 10, 'Incorrect age',
          'Age should be between 18 and 90 years', 'error');
      } else {
        e.preventDefault();

        addEmployeeRow([fname, position, office, age, salary]);

        pushNotification(10, 10, 'Added new employee',
          'New employee is successfully added', 'success');
      }
    }
  });
})();

function addEmployeeRow(values) {
  const table = document.querySelector('table');
  const tableBody = table.tBodies[0];
  const cellsContent = values.map((object, index) => {
    const textContext = (index === values.length - 1)
      ? Number(object.value).toLocaleString('en-US',
        {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })
      : `${object.value}`;

    return `
      <td>${textContext}</td>
    `;
  }).join('');

  tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      ${cellsContent}
    </tr>
  `);
}

const pushNotification = function(topPos, rightPos, title, description, type) {
  const body = document.querySelector('body');

  body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2>${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const notification = body.querySelector(`.${type}`);

  notification.top = `${topPos}px`;
  notification.right = `${rightPos}px`;

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

(function editEmployee() {
  let selectedRow = null;
  let selectedCell = null;
  let lastText = null;
  const activeInput = document.createElement('input');

  activeInput.className = 'cell-input';

  function restoreCell() {
    selectedCell.textContent = (activeInput.value.length > 0)
      ? activeInput.value
      : lastText;
    activeInput.value = '';
    activeInput.remove();
    selectedCell = null;
  }

  activeInput.addEventListener('blur', (e) => {
    restoreCell();
  });

  const table = document.querySelector('table');
  const tableBody = table.tBodies[0];

  tableBody.addEventListener('keyup', (e) => {
    if (e.code === 'Enter') {
      restoreCell();
    }
  });

  tableBody.addEventListener('click', (e) => {
    if (e.detail === 1) {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      e.target.parentNode.classList.add('active');
      selectedRow = e.target.parentNode;
    }
  });

  tableBody.addEventListener('dblclick', (e) => {
    e.preventDefault();

    if (selectedCell) {
      restoreCell();
    }

    if (e.target.tagName === 'TD') {
      selectedCell = e.target;
      lastText = selectedCell.textContent;

      const padding = +(getComputedStyle(selectedCell).padding.slice(0, -2));
      const inputWidth = selectedCell.offsetWidth - 2 * padding;

      activeInput.style.width = `${inputWidth}px`;
      selectedCell.textContent = '';
      selectedCell.appendChild(activeInput);
      activeInput.focus();
    }
  });
})();

'use strict';

const table = document.querySelector('table');
const body = document.querySelector('tbody');
let prevIndex;

function sort(e) {
  const indexOfTitle = e.target.cellIndex;
  const allRows = body.querySelectorAll('tr');
  let sortedRows;

  if (e.target.tagName === 'TH') {
    if (prevIndex !== indexOfTitle) {
      sortedRows = [...allRows].sort((x, y) => {
        let prevObj = x.querySelectorAll('td')[indexOfTitle].innerText;
        let nextObj = y.querySelectorAll('td')[indexOfTitle].innerText;

        if (prevObj[0] === '$' || nextObj[0] === '$') {
          prevObj = +prevObj.slice(1).split(',').join('.');
          nextObj = +nextObj.slice(1).split(',').join('.');
        };

        return isNaN(prevObj || nextObj)
          ? prevObj.localeCompare(nextObj)
          : prevObj - nextObj;
      });
    };

    if (prevIndex === indexOfTitle) {
      sortedRows = [...allRows].sort((x, y) => {
        let prevObj = x.querySelectorAll('td')[indexOfTitle].innerText;
        let nextObj = y.querySelectorAll('td')[indexOfTitle].innerText;

        if (prevObj[0] === '$') {
          prevObj = +prevObj.slice(1).split(',').join('.');
          nextObj = +nextObj.slice(1).split(',').join('.');
        };

        return isNaN(prevObj)
          ? nextObj.localeCompare(prevObj)
          : nextObj - prevObj;
      });

      prevIndex = -1;
      body.append(...sortedRows);

      return;
    };

    prevIndex = e.target.cellIndex;
    body.append(...sortedRows);

    return;
  };
};

function switchActive(e) {
  [...this.children].map(x => {
    if (x === e.target.parentElement) {
      x.classList.add('active');
    } else {
      x.classList.remove('active');
    };

    return x;
  });
};

table.addEventListener('click', sort);
body.addEventListener('click', switchActive);

const form = document.createElement('form');

form.method = 'POST';
form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input
    name="position"
    type="text"
    data-qa="position"
    required>
  </label>
  <label>Office: <select name="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore" selected>Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
  </label>
  <label>Age: <input
    name="age"
    type="number"
    data-qa="age"
    step="1"
    required>
  </label>
  <label>Salary: <input
    name="salary"
    type="number"
    data-qa="salary"
    required>
  </label>

  <button type="submit">Save to table</button>
`);
document.querySelector('body').append(form);

let errorText = '';

function validateForm() {
  const nameInValue = document
    .querySelector('.new-employee-form')['name']
    .value;
  const ageInValue = document.querySelector('.new-employee-form')['age'].value;

  if (nameInValue.length <= 3) {
    errorText = 'The name must contain more than 4 characters';

    return false;
  }

  if (ageInValue < 18) {
    errorText = 'Only adults can edit the table';

    return false;
  }

  if (ageInValue > 90) {
    errorText = 'Your age is over 90';

    return false;
  } else {
    return true;
  };
};

function addNotification(className) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';

  const bodyMain = document.querySelector('body');

  notification.classList.add(className);

  let message;

  notification.style.cssText = `
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      font-size: 20px;
      top: 40px;
      left: 0px;`;

  if (className === 'error') {
    message = errorText;
    notification.style.color = 'red';
  }

  if (className === 'success') {
    message = 'A new employee has been added';
    notification.style.color = 'green';
  };

  notification.append(message);
  bodyMain.append(notification);
}

function addRow(e) {
  e.preventDefault();

  if (validateForm()) {
    const data = new FormData(form);
    const salary = data.get('salary');
    const salaryArr = salary.split('');
    let count = 0;

    for (let i = salaryArr.length - 1; i >= 0; i--) {
      count++;

      if (count === 3) {
        if (i !== 0) {
          salaryArr[i] = ',' + salaryArr[i];
        }
        count = 0;
      };
    };

    const newSalary = '$' + salaryArr.join('');

    body.insertAdjacentHTML('afterBegin', `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>${newSalary}</td>
    </tr>
    `);

    addNotification('success');

    setTimeout(() => {
      document.querySelector('.success').remove();
      document.querySelector('.new-employee-form').reset();
    }, 2000);
  } else {
    addNotification('error');

    setTimeout(() => {
      document.querySelector('.error').remove();
    }, 2000);
  };
};

form.addEventListener('submit', addRow);

function editCell(e) {
  if (e.target.tagName === 'TD') {
    if (table.querySelector('input')) {
      saveText();
    };

    const input = document.createElement('input');

    input.setAttribute('value', e.target.innerText);
    input.classList.add('cell-input2');

    e.target.innerText = '';
    e.target.append(input);

    input.focus();

    input.addEventListener('blur', () => {
      saveText();
    });

    input.addEventListener('keypress', () => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  }

  function saveText() {
    const lastEditingInput = table.querySelector('input');

    lastEditingInput.parentElement.innerHTML = `
      ${lastEditingInput.value}
    `;
  }
}

table.addEventListener('dblclick', editCell);

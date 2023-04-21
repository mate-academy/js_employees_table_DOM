'use strict';

const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');

// #region Sort
let counter = 1;
let lastClickedIndex = null;

tableHead.addEventListener('click', e => {
  const index = e.target.cellIndex;

  if (lastClickedIndex !== index) {
    counter = 1;
    lastClickedIndex = index;
  } else {
    counter++;
  }

  const rows = Array.from(tableBody.querySelectorAll('tr'));
  const sortedRows = rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index].textContent;
    const cellB = rowB.querySelectorAll('td')[index].textContent;

    let sortDirection = 1;

    if (counter % 2 === 0) {
      sortDirection = -1;
    }

    if (index === 4) {
      const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

      return sortDirection * (numA - numB);
    } else {
      return sortDirection * cellA.localeCompare(cellB);
    }
  });

  tableBody.append(...sortedRows);
});
// #endregion

// #region Select
let activeRow;

tableBody.addEventListener('click', (e) => {
  if (activeRow) {
    activeRow.classList.remove('active');
  }

  const clickedRow = e.target.parentNode;

  clickedRow.classList.add('active');

  activeRow = clickedRow;
});
// #endregion

// #region Form
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input id="input" name="name" type="text" data-qa="name"></label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);
// #endregion

// #region Notification
const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  h2.className = 'title';
  h2.innerText = title;

  p.innerText = description;

  notification.append(h2, p);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const notification = document.querySelector('.notification');

  if (notification) {
    notification.remove();
  }

  const formData = new FormData(e.target);
  const formValues = Object.fromEntries(formData.entries());

  if (formValues.name.length < 4) {
    pushNotification('Error', 'Name should contain more than 3 letters',
      'error');

    return;
  }

  const ageCheck = +(formValues.age) < 18 || +(formValues.age) > 90;

  if (ageCheck) {
    pushNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  if (!formValues.position || !formValues.salary) {
    pushNotification('Error', 'All fields are required', 'error');

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${formValues.name}</td>
    <td>${formValues.position}</td>
    <td>${formValues.office}</td>
    <td>${formValues.age}</td>
    <td>$${Number(formValues.salary).toLocaleString()}</td>
  `;

  tableBody.append(tr);
  form.reset();

  pushNotification('Success', 'New employee was added', 'success');
});
//  #endregion

// #region Edit by double-clicking
tableBody.addEventListener('dblclick', (evnt) => {
  const text = evnt.target.textContent;
  const index = evnt.target.cellIndex;

  evnt.target.textContent = '';

  let input = document.createElement('input');

  input.classList.add('.cell-input');

  if (index === 2) {
    const selectCity = document.createElement('select');
    const cityList = [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];

    cityList.forEach((option) => {
      const city = document.createElement('option');

      city.textContent = option;
      selectCity.append(city);
    });
    input = selectCity;
  }

  evnt.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (index) {
      case 0:
        if (input.value.length < 4) {
          pushNotification(
            'error',
            'Name value should have more than 4 letters'
          );
          evnt.target.textContent = text;
        } else {
          evnt.target.textContent = input.value;
        }
        break;

      case 1:
        if (input.value) {
          evnt.target.textContent = input.value;
        } else {
          pushNotification('error', 'All fields are required');
          evnt.target.textContent = text;
        }
        break;

      case 2:
        if (input.value) {
          evnt.target.textContent = input.value;
        } else {
          evnt.target.textContent = text;
        }
        break;

      case 3:
        if (input.value < 18 || input.value > 90) {
          pushNotification(
            'error',
            'Age value is not valid. Employee must be an adult'
          );

          evnt.target.textContent = text;
        } else {
          evnt.target.textContent = input.value;
        }
        break;

      case 4:
        if (input.value && input.value > 0) {
          evnt.target.textContent
            = '$' + Number(input.value).toLocaleString('en-US');
        } else {
          pushNotification(
            'error',
            'Salary value is not valid. It must be more than zero'
          );
          evnt.target.textContent = text;
        }
        break;
    }
    input.remove();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});
// #endregion

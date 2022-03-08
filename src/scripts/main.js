'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let trList = tbody.querySelectorAll('tr');
let switched = true;

/* Sort */
function sortColumns(e) {
  const col = e.target.cellIndex;

  switched = !switched;

  const table = [];

  for (let i = 0; i < trList.length; i++) {
    table.push(trList[i]);
    trList[i].remove();
  }

  table.sort((a, b) => {
    let aE = b.children[col].textContent;
    let bE = a.children[col].textContent;

    if (switched !== true) {
      aE = a.children[col].textContent;
      bE = b.children[col].textContent;
    }

    if (col === 0 || col === 1 || col === 2) {
      return aE > bE ? 1 : -1;
    }

    if (col === 4) {
      return +aE.toString().replace(/\$|,/g, '')
      - +bE.toString().replace(/\$|,/g, '');
    }

    if (col === 3) {
      return +aE - +bE;
    }
  });

  table.forEach(item => tbody.appendChild(item));
}

thead.addEventListener('click', sortColumns);

// ------------------------insert Form-------------------

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" action="post">
    <label>
      Name:
      <input
        type="text"
        name="name"
        data-qa="name"
        min="4"
        required
        id="name"/>
    </label>
    <label>
      Position:
      <input
      type="text"
      name="position"
      data-qa="position"
      required
      id="position"/>
    </label>
    <label>
      Office:
      <select
      name="office"
      data-qa="office"
      id="office"/>
      <option value="Tokyo" selected>Tokyo</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Singapore">Singapore</option>
      <option value="San Francisco">San Francisco</option>
      <option value="Edinburgh">Edinburgh</option>
    </select>
    </label>
    <label>
      Age:
      <input
        type="number"
        name="age"
        data-qa="age"
        min='18'
        max='90'
        required
        id="age"/>
    </label>
    <label>
      Salary:
      <input
      type="number"
      name="salary"
      data-qa="salary"
      required
      id="salary"/>
    </label>
    <button>Save to table</button>
  </form>
`);

// -----------------------row indic------------------------------

for (const item of trList) {
  item.addEventListener('click', (e) =>
    e.currentTarget.classList.add('active'));
}
// -----------------------cells indic-----------------------------------------

for (const item of trList) {
  item.addEventListener('dblclick',
    (e) => {
      e.target.classList.add('active');

      e.target.innerHTML('beforeend', '<input type="text">');
    });
}
// -----------------------input tr in table---------------------------------

const btn = document.querySelector('button');
const form = document.querySelector('.new-employee-form');

btn.addEventListener('click', (e) => {
  e.preventDefault();

  if (!form.position.value || !form.name.value || !form.age.value
     || !form.office.value || !form.salary.value) {
    notSubmitError('error');

    return;
  };

  if (form.name.value.length < 4) {
    form.name.classList.add('notification error');
    form.name.setAttribute('data-qa', 'notification');

    notEnoughText('warning',
      'Please, enter more than 4 characters to the field "Name"');

    return;
  }

  if (form.position.value.length < 4) {
    form.position.classList.add('notification');
    form.position.setAttribute('data-qa', 'notification');

    notEnoughText('warning',
      'Please, enter more than 4 characters to the field "Postion"');

    return;
  }

  if (form.age.value < 18 || form.age.value > 90) {
    form.age.classList.add('notification');
    form.age.setAttribute('data-qa', 'notification');

    notEnoughText('warning',
      'Please, enter age more than 18 and less then 90');

    return;
  }

  addLists();
  submitTotal('success');
  form.reset();
});

function addLists() {
  tbody.insertAdjacentHTML('beforeend', `
  <tr>
  <td>${form.name.value}</td>
  <td>${form.position.value}</td>
  <td>${form.office.value}</td>
  <td>${+form.age.value}</td>
  <td>$${(+form.salary.value).toLocaleString('en-US')}</td>
  </tr>
  `);

  trList = tbody.querySelectorAll('tr');
}
// -------------------------notification------------------------

function pushNotification(posTop, posRight, title, description, type) {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  div.insertAdjacentHTML('afterbegin',
    `<div data-qa="notification" class="notification ${type}">
      <h1 class="title">${title}</h1>
      <p>${description}</p>
    </div>`);

  body.append(div);

  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  setTimeout(() => {
    div.remove();
  }, 3000);

  return div;
};

function submitTotal(titleSubmit) {
  pushNotification(10, 10, titleSubmit, '\n '
  + 'All the information added to the table', 'success');
};

function notSubmitError(notSumbit) {
  pushNotification(150, 10, notSumbit, '\n '
  + 'Please, enter the information in the field and confirm info', 'error');
};

function notEnoughText(notEnough, text) {
  pushNotification(290, 10, notEnough, '\n '
  + text, 'warning');
};

// 2. When user clicks on a row, it should become selected.

// const selectedRow = (e) => {
//   if (e.target.tagName !== 'TD') {
//     for (const row of bodyRows) {
//       row.classList.remove('active');
//     };
//   } else {
//     for (const row of bodyRows) {
//       row.classList.remove('active');
//     };
//     e.target.parentElement.classList.add('active');
//   }
// };

// document.addEventListener('click', selectedRow);

// const SaveToTable = document.querySelector('button');
// const form = document.querySelector('form');

// const addEmployees = (e) => {
//   e.preventDefault();

//   const data = new FormData(form);
//   const newEmployee = document.createElement('tr');
//   const nameEmployee = data.get('name');
//   const positionEmployee = data.get('position');
//   const officeEmployee = data.get('office');
//   const ageEmployee = data.get('age');
//   const salaryEmployee = data.get('salary');
//   const notification = document.createElement('div');

//   notification.setAttribute('data-qa', 'notification');
//   notification.classList.add('notification');

//   if (nameEmployee.length > 3 & ageEmployee < 90 & ageEmployee > 17) {
//     newEmployee.insertAdjacentHTML('beforeend', `
//       <td class="name">${nameEmployee}</td>
//       <td class="position">${positionEmployee}</td>
//       <td class="office">${officeEmployee}</td>
//       <td class="age">${ageEmployee}</td>
//       <td class="salary">$${(+salaryEmployee).toLocaleString('en-US')}</td>
//     `);

//     notification.classList.add('success');

//     notification.innerHTML = '<h4 class="title">'
//     + 'Employee added successfully'
//     + '</h4>';

//     bodyTable.insertAdjacentElement('beforeend', newEmployee);
//   } else {
//     notification.classList.add('error');

//     notification.innerHTML = '<h4 class="title">'
//     + 'Invalid data'
//     + '</h4>';
//   };
//   body.insertAdjacentElement('beforeend', notification);

//   setTimeout(() => {
//     notification.remove();
//   }, 3000);
// };

// SaveToTable.addEventListener('click', addEmployees);

// // 5. Implement editing of table cells by double-clicking on it.

// const changeCell = (e) => {
//   e.preventDefault();

//   if (e.target.tagName === 'TD') {
//     const initialValue = e.target.innerText;
//     const cellInput = document.createElement('input');

//     cellInput.classList.add('cell-input');
//     e.target.innerText = '';
//     e.target.insertAdjacentElement('beforeend', cellInput);
//     cellInput.focus();

//     const saveInput = (passage) => {
//       e.preventDefault();

//       if (passage.code === undefined || passage.code === 'Enter') {
//         const resultValue = (cellInput.value === '')
//           ? initialValue
//           : cellInput.value;

//         e.target.innerText = resultValue;
//       };
//     };

//     document.addEventListener('click', saveInput);
//     document.addEventListener('keyup', saveInput);
//   };
// };

// document.addEventListener('dblclick', changeCell);

// const table = document.querySelector('table');
// const tbody = table.querySelector('tbody');
// const ascStatus = new Array(tbody.firstElementChild.cells.length).fill(true);

// table.addEventListener('click', (e) => {
//   const target = e.target;

//   if (!table.contains(target) || !target) {
//     return;
//   }

//   if (target.closest('td')) {
//     const activeRow = table.querySelector('.active');

//     if (activeRow) {
//       activeRow.classList.remove('active');
//     }
//     target.parentNode.classList.add('active');
//   }
// });

// const form = document.querySelector('form');
// const inputs = form.querySelectorAll('input');
// const button = form.querySelector('button');

// for (const input of inputs) {
//   input.required = true;
// }

// button.addEventListener('click', (e) => {
//   e.preventDefault();

//   if (form.elements.name.value.trim().length === 0
//     || form.elements.position.value.trim().length === 0
//     || form.elements.salary.value.length === 0) {
//     pushNotification('All fields are required', 'error');
//   } else if (form.elements.name.value.trim().length < 4
//     || !form.elements.name.validity.valid) {
//     form.elements.name.value = '';

//     pushNotification('Name should contain at least 4 letters', 'error');
//   } else if (!form.elements.age.validity.valid) {
//     form.elements.age.value = '';

//     pushNotification('Age should be between 18-90 years', 'error');
//   } else if (!form.elements.salary.validity.valid) {
//     form.elements.salary.value = '';

//     pushNotification('You must be kidding', 'error');
//   } else {
//     pushNotification('The new employee is added!', 'success');

//     const newRow = table.rows[1].cloneNode(true);

//     [...newRow.cells].forEach((cell, index) => {
//       cell.innerHTML = form.elements[index].value;
//       cell.classList.add(`${form.elements[index].name}`);

//       if (cell.classList.contains('salary')) {
//         cell.innerHTML = getDollars(cell.innerHTML);
//       }
//     });

//     tbody.append(newRow);
//     form.reset();
//   }
// });

// tbody.addEventListener('dblclick', (e) => {
//   const target = e.target;
//   const startData = target.textContent;
//   const style = window.getComputedStyle(target);
//   const headCellName = table.rows[0].cells[target.cellIndex].textContent;
//   let editableField;

//   if (!target || target.tagName !== 'TD') {
//     return;
//   }

//   if (headCellName === 'Office') {
//     editableField = document.createElement('select');

//     const offices = document.querySelectorAll('option');

//     for (const office of offices) {
//       const option = document.createElement('option');

//       option.textContent = office.textContent;

//       if (startData === office.textContent) {
//         option.selected = true;
//       } else {
//         option.selected = false;
//       }

//       editableField.append(option);
//     }
//   } else {
//     editableField = document.createElement('input');
//     editableField.type = 'text';

//     if (headCellName === 'Age' || headCellName === 'Salary') {
//       editableField.pattern = '[0-9]+';
//     }
//   }

//   target.textContent = '';
//   editableField.value = startData.replace('$', '').replace(',', '');
//   editableField.style.width = style.width;
//   editableField.className = 'cell-input';

//   target.append(editableField);
//   editableField.focus();

//   editableField.addEventListener('blur', saveData);
//   editableField.addEventListener('keydown', saveData);

//   function saveData(evnt) {
//     if (evnt.keyCode === 13 || evnt.type === 'blur') {
//       const newData = editableField.value.trim();

//       if (!newData) {
//         target.textContent = startData;
//         pushNotification('This field can not be empty', 'error');
//       } else if (headCellName === 'Name' && newData.length < 4) {
//         target.textContent = startData;
//         pushNotification('Name should contain at least 4 letters', 'error');
//       } else if ((headCellName === 'Age' && newData < 18)
//       || (headCellName === 'Age' && newData > 90)
//       || (headCellName === 'Age' && !editableField.validity.valid)) {
//         target.textContent = startData;
//         pushNotification('Age should be a number between 18-90', 'error');
//       } else if ((headCellName === 'Salary' && newData < 1)
//       || (headCellName === 'Salary' && !editableField.validity.valid)) {
//         target.textContent = startData;
//         pushNotification('It should be positive number', 'error');
//       } else {
//         editableField.remove();

//         if (headCellName === 'Salary') {
//           target.textContent = getDollars(newData);
//         } else {
//           target.textContent = newData;
//         }
//       }
//     }
//   }
// });

// function pushNotification(text, type) {
//   let notification = document.querySelector('.notification');

//   if (notification) {
//     notification.remove();
//   }
//   notification = document.createElement('div');

//   const title = document.createElement('h1');
//   const message = document.createElement('p');
//   const titleText = type[0].toUpperCase() + type.slice(1);

//   notification.setAttribute('data-qa', 'notification');
//   notification.className = `notification`;
//   notification.classList.add(type);
//   title.className = 'title';
//   title.innerHTML = titleText;
//   message.innerHTML = text;

//   notification.append(title, message);
//   form.insertAdjacentElement('afterend', notification);

//   setTimeout(() => notification.remove(), 3000);
// }

// function getDollars(num) {
//   const result = (+num).toLocaleString('en-EN', {
//     style: 'currency', currency: 'USD',
//   }).slice(0, -3);

//   return result;
// }

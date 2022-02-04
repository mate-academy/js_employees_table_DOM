'use strict';

// write code here
const table = document.querySelector('table');
let trList = [...table.querySelectorAll('tr')];
const headList = [...trList[0].children];
const selectHTML = `
  <select name="office" data-qa="office" required>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>`;

let secondClickTh = '';
let reverseSort = -1;
let previousActive = '';

table.addEventListener('click', ev => {
  const element = ev.target;
  const tbody = table.querySelector('tbody');
  const trListNotTh = [...table.querySelectorAll('tbody tr')];

  const headName = element.textContent;
  const index = headList.findIndex(h => h.innerText === headName);

  if (element.tagName === 'TH') {
    if (element !== secondClickTh) {
      secondClickTh = element;
      reverseSort = 1;
    } else {
      secondClickTh = '';
      reverseSort = -1;
    }

    trListNotTh.sort((a, b) => {
      let A = [...a.children][index].innerText;
      let B = [...b.children][index].innerText;

      if (A.includes('$')) {
        A = A.replace(/[^0-9]/g, '');
        B = B.replace(/[^0-9]/g, '');
      }

      if (isFinite(A)) {
        return (Number(A) - Number(B)) * reverseSort;
      } else {
        return A.localeCompare(B) * reverseSort;
      }
    });

    tbody.append(...trListNotTh);
  } else if (element.tagName === 'TD') {
    const tr = element.closest('tr');

    if (tr !== previousActive && previousActive) {
      previousActive.classList.remove('active');
    }
    tr.className = 'active';
    previousActive = tr;
  }
});

function createInput(type, td, innerHTML = '') {
  const element = document.createElement(type);

  element.innerHTML = innerHTML;
  element.classList.add('cell-input');
  element.value = td.innerText;
  td.innerText = '';
  td.append(element);

  return element;
}

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');

  div.className = 'notification ' + type;

  div.insertAdjacentHTML('afterbegin', `
  <h1 class="title" data-qa="notification">${title}</h1>
    <p>${description}</p>
  `);

  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
};

function checkInput(input, index) {
  switch (index) {
    case 0:
      if (input.value.length < 4) {
        pushNotification('Error', 'Name field must have more letters', 'error');

        return false;
      }
      break;

    case 3:
      if (input.value < 18 || input.value > 90) {
        pushNotification(
          'Error',
          'Age must be more than 18 and less than 90',
          'error');

        return false;
      }
      break;

    case 4:
      if (input.value && isFinite(input.value)) {
        input.value = '$' + Number(input.value).toLocaleString('en-US');

        return true;
      } else {
        pushNotification('Error',
          'Salary field must have only numbers', 'error');

        return false;
      }
  }

  return true;
}

table.addEventListener('dblclick', eDbl => {
  trList = [...table.querySelectorAll('tr')];

  if (eDbl.target.matches('td')) {
    const td = eDbl.target;
    const tdInnerText = td.innerText;

    const tr = trList.find(el =>
      [...el.children].find(tE => tdInnerText === tE.innerText));
    const tdIndex = [...tr.children].findIndex(e =>
      e.innerText === tdInnerText);

    let input;

    switch (tdIndex) {
      case 2:
        input = createInput('select', td, selectHTML);
        break;
      case 3:
        input = createInput('input', td);
        input.type = 'number';
        break;
      case 4:
        input = createInput('input', td);
        input.value = input.value.replace(/[^0-9]/g, '');
        break;
      default:
        input = createInput('input', td);
        break;
    }

    const blurFocus = () => {
      if (checkInput(input, tdIndex)) {
        td.innerText = input.value;
      } else {
        td.innerText = tdInnerText;
      }

      input.remove();
    };

    const enterPress = (eKey) => {
      if (eKey.code === 'Enter') {
        input.removeEventListener('blur', blurFocus);

        if (checkInput(input, tdIndex)) {
          td.innerText = input.value;
        } else {
          td.innerText = tdInnerText;
        }

        input.remove();
      }
    };

    input.addEventListener('blur', blurFocus);
    input.addEventListener('keydown', enterPress);
  }
});

document.body.insertAdjacentHTML('beforeend',
  `<form class="new-employee-form" action="/" method="GET">
    <label>Name:
      <input name="name" data-qa="name" type="text" required>
    </label>
    <label>Position:
      <input name="position" data-qa="position" type="text" required>
    </label>
    <label>Office:
      ${selectHTML}
    </label>
    <label>Age:
      <input name="age" data-qa="age" type="number" required>
    </label>
    <label>Salary:
      <input name="salary" data-qa="salary" type="number" required>
    </label>
    <button type="submit">Save to table</button>
  </form>`);

const form = document.forms[0];

form.addEventListener('submit', eSubmit => {
  const tbody = document.querySelector('tbody');
  const inputName = form.name;
  const position = form.position;
  const office = form.office;
  const age = form.age;
  const salary = form.salary;

  let error = true;

  eSubmit.preventDefault();

  if (!checkInput(inputName, 0)) {
    error = true;
  } else if (!checkInput(age, 3)) {
    error = true;
  } else {
    error = false;
  }

  if (!error) {
    const tr = document.createElement('tr');
    const salaryToString = '$' + Number(salary.value).toLocaleString('en-US');

    tr.insertAdjacentHTML('afterbegin', `
      <td>${inputName.value}</td>
      <td>${position.value}</td>
      <td>${office.value}</td>
      <td>${age.value}</td>
      <td>${salaryToString}</td>
    `);

    pushNotification('Success', 'New field was successide add', 'success');
    tbody.append(tr);

    form.reset();
  }
});

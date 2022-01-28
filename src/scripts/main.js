'use strict';

// write code here
const table = document.querySelector('table');
const trList = [...table.querySelectorAll('tr')];
const headList = [...trList[0].children];
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

table.addEventListener('dblclick', eDbl => {
  if (eDbl.target.tagName === 'TD') {
    const input = document.createElement('input');
    const td = eDbl.target;
    const tdInnerText = td.innerText;

    input.className = 'cell-input';
    input.value = td.innerText;
    td.innerText = '';
    td.append(input);

    const blurFocus = (eBlur) => {
      if (input.value) {
        td.innerText = input.value;
      } else {
        td.innerText = tdInnerText;
      }

      input.remove();
    };

    const enterPress = (eKey) => {
      if (eKey.code === 'Enter') {
        input.removeEventListener('blur', blurFocus);

        if (input.value) {
          td.innerText = input.value;
        } else {
          td.innerText = tdInnerText;
        }

        input.remove();
      } else {
        input.addEventListener('blur', blurFocus);
      }
    };

    input.addEventListener('keydown', enterPress);
  }
});

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

document.body.insertAdjacentHTML('beforeend',
  `<form class="new-employee-form" action="/" method="GET">
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
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
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

  if (inputName.value.length < 4) {
    error = true;

    pushNotification('Error', 'Name field must have more letters', 'error');
  } else if (age.value < 18 || age.value > 90) {
    error = true;

    pushNotification(
      'Error',
      'Age must be more than 18 and less than 90',
      'error');
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

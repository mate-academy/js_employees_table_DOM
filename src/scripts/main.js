'use strict';

const table = document.querySelector('table');
const tBody = table.querySelector('tbody');
const tRows = tBody.querySelectorAll('tr');
const rowsArr = [...tRows];
const theaders = document.querySelector('tr');

function convertSalaryToNumber(salary) {
  return parseInt(salary.substring(1).split(',').join(''));
}

theaders.addEventListener('click', (e) => {
  const header = [...theaders.children].indexOf(e.target);

  if (!e.target.dataset.sort) {
    e.target.dataset.sort = 'asc';
  } else if (e.target.dataset.sort === 'asc') {
    e.target.dataset.sort = 'desc';
  } else if (e.target.dataset.sort === 'desc') {
    e.target.dataset.sort = 'asc';
  }

  let rows;

  if (e.target.dataset.sort === 'asc') {
    if (e.target.innerText === 'Salary') {
      rows = rowsArr.sort((x, y) =>
        convertSalaryToNumber(x.children[header].innerText)
          - convertSalaryToNumber(y.children[header].innerText));
    } else if (e.target.innerText === 'Age') {
      rows = rowsArr.sort((x, y) =>
        +x.children[header].innerText - +y.children[header].innerText);
    } else {
      rows = rowsArr.sort((x, y) =>
        x.children[header].innerText.localeCompare(y.children[header].innerText));
    }
  } else {
    if (e.target.innerText === 'Salary') {
      rows = rowsArr.sort((x, y) =>
        convertSalaryToNumber(y.children[header].innerText)
          - convertSalaryToNumber(x.children[header].innerText));
    } else if (e.target.innerText === 'Age') {
      rows = rowsArr.sort((x, y) =>
        parseInt(y.children[header].innerText)
          - parseInt(x.children[header].innerText));
    } else {
      rows = rowsArr.sort((x, y) =>
        y.children[header].innerText.localeCompare(x.children[header].innerText));
    }
  }

  table.appendChild(tBody);

  rows.forEach(element => {
    tBody.appendChild(element);
  });
});

tBody.addEventListener('click', (e) => {
  for (const row of tRows) {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  }

  e.target.parentElement.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('beforeend', `
  <label>Name: 
    <input name="name"
           type="text"
           data-qa="name"
           class="name"
           required
    >
  </label>
  <label>Position:
    <input name="position"
           type="text"
           data-qa="position"
           class="position"
           required
    >
  </label>
  <label>Office:
    <select name="office"
            data-qa="office"
            class="office"
            required
    >
      <option value="tokyo">Tokyo</option>
      <option value="singapore">Singapore</option>
      <option value="london">London</option>
      <option value="new-york">New York</option>
      <option value="edinburh">Edinburgh</option>
      <option value="san-francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age"
           type="number"
           data-qa="age"
           class="age"
           required
    >
  </label>
  <label>Salary:
    <input name="salary"
           type="number"
           data-qa="salary"
           class="salary"
           required
    >
  </label>
  <button class="button" type="submit">Save to table</button>
`);

document.body.appendChild(form);

function convertNumberToSalary(salary) {
  return (salary.length > 5) ? '$' + salary.match(/^\d{3}|\d{3}|\d+/g)
    : '$' + salary.match(/^\d{2}|\d{3}|\d+/g);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const desc = document.createElement('p');

  if (data.get('name').length < 4
       || data.get('age') < 18
       || data.get('age') > 90) {
    notification.classList.add('error');
    h2.textContent = 'Error |x|_|x|';
    desc.textContent = 'Houston, we have a problem!!!';
  } else {
    notification.classList.add('success');
    h2.textContent = 'Success <3';
    desc.textContent = 'Smell all around, you know what is it? SUCCESS!!!';

    table.insertAdjacentHTML('beforeend', `
    <tr>
      <td>
        ${data.get('name')}
      </td>
      <td>
        ${data.get('position')}
      </td>
      <td>
        ${data.get('office')}
      </td>
      <td>
        ${data.get('age')}
      </td>
      <td>
        ${convertNumberToSalary(data.get('salary'))}
      </td>
    </tr>
  `);
  }

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';
  h2.setAttribute('title', 'title');
  notification.append(h2);
  notification.append(desc);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
});

table.addEventListener('dblclick', (e) => {
  // something wrong
});

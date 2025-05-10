'use strict';

const thead = document.querySelector('thead');
const theadRow = thead.querySelector('tr');
const tbody = document.querySelector('tbody');
const tbodyRows = tbody.querySelectorAll('tr');
const tbodyRowsArr = [...tbodyRows];
const clicks = {};

//  ##### Implement table sorting by clicking on the title (in two directions)
for (let i = 0; i < theadRow.children.length; i++) {
  clicks[theadRow.children[i].innerText] = 0;

  theadRow.children[i].addEventListener('click', () => {
    if (isNaN(+tbodyRowsArr[0]
      .children[i]
      .innerText
      .replace('$', '')
      .replace(',', ''))) {
      tbodyRowsArr.sort((a, b) => {
        return a.children[i].innerText.localeCompare(b.children[i].innerText);
      });
    } else {
      tbodyRowsArr.sort((a, b) => {
        const answer = +(a.children[i]
          .innerText
          .replace('$', '')
          .replace(',', ''))
        - +(b.children[i]
          .innerText
          .replace('$', '')
          .replace(',', ''));

        return answer;
      });
    }

    if (clicks[theadRow.children[i].innerText] % 2 === 0) {
      tbodyRowsArr.forEach(row => {
        tbody.append(row);
      });
    } else {
      tbodyRowsArr.forEach(row => {
        tbody.prepend(row);
      });
    }

    clicks[theadRow.children[i].innerText]++;
  });
}

//  ##### When user clicks on a row, it should become selected.
tbodyRowsArr.forEach(row => {
  row.addEventListener('click', () => {
    tbodyRowsArr.forEach(checkingRow => {
      checkingRow.className = '';
    });
    row.className = 'active';
  });
});

//  ##### Create notification if form data is invalid.

document.body.insertAdjacentHTML('beforeend', `
  <div class='notification error error-all'
  data-qa="notification">
  <h1 class='title'>All fields are required</h1>
  </div>

  <div class='notification error error-name'
  data-qa="notification">
  <h1 class='title'>Invalid name</h1>
  </div>

  <div class='notification error error-invalid-age'
  data-qa="notification">
  <h1 class='title'>Invalid age</h1>
  </div>

  <div class='notification error error-less-then-min-age'
  data-qa="notification">
  <h1 class='title'>Peson is baby</h1>
  </div>

  <div class='notification error error-more-then-max-age'
  data-qa="notification">
  <h1 class='title'>Person is creaker</h1>
  </div>

  <div class='notification error error-salary'
  data-qa="notification">
  <h1 class='title'>Invalid salary</h1>
  </div>

  <div class='notification success'
  data-qa="notification">
  <h1 class='title'>Person was succeffully added</h1>
  </div>
`);

const errorAllMessage = document
  .querySelector('.error-all');
const errorNameMessage = document
  .querySelector('.error-name');

const errorInvalidAgeMessage = document
  .querySelector('.error-invalid-age');
const errorLessThenMinAgeMessage = document
  .querySelector('.error-less-then-min-age');
const errorMoreThenMaxAgeMessage = document
  .querySelector('.error-more-then-max-age');

const errorSalaryMessage = document
  .querySelector('.error-salary');
const successMessage = document
  .querySelector('.success');

const errorMessages = [...document.querySelectorAll('.error')];

for (const errMes of errorMessages) {
  errMes.style.display = 'none';
}

successMessage.style.display = 'none';

//  ##### Write a script to add a form to the document.

document.body.insertAdjacentHTML('beforeend', `
  <form class = new-employee-form>
  <label>Name:
  <input required name="name" type="text" data-qa="name">
  </label>

  <label>Position:
  <input required name="position" type="text" data-qa="position" >
  </label>

  <label>Office:
  <select required name="office" data-qa="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
  </label>

  <label>Age:
  <input required name="age" type="text" data-qa="age">
  </label>

  <label>Salary:
  <input required name="salary" type="text" data-qa="salary">
  </label>

  <button type = "button">Save to table</button>
  </form>
`);

const form = document.body.querySelector('.new-employee-form');
const sendButton = form.querySelector('button');

sendButton.addEventListener('click', (evnt) => {
  const values = [];

  for (let i = 0; i < 5; i++) {
    values.push(form.children[i].firstElementChild.value);
  }

  for (const value of values) {
    if (value === '') {
      errorAllMessage.style.display = 'block';

      setTimeout(() => {
        errorAllMessage.style.display = 'none';
      }, 2000);

      return;
    }
  }

  if (values[0].length < 4) {
    errorNameMessage.style.display = 'block';

    setTimeout(() => {
      errorNameMessage.style.display = 'none';
    }, 2000);

    return;
  }

  if (isNaN(+values[3])) {
    errorInvalidAgeMessage.style.display = 'block';

    setTimeout(() => {
      errorInvalidAgeMessage.style.display = 'none';
    }, 2000);

    return;
  }

  if (values[3] < 18) {
    errorLessThenMinAgeMessage.style.display = 'block';

    setTimeout(() => {
      errorLessThenMinAgeMessage.style.display = 'none';
    }, 2000);

    return;
  }

  if (values[3] > 90) {
    errorMoreThenMaxAgeMessage.style.display = 'block';

    setTimeout(() => {
      errorMoreThenMaxAgeMessage.style.display = 'none';
    }, 2000);

    return;
  }

  if (isNaN(+values[4])) {
    errorSalaryMessage.style.display = 'block';

    setTimeout(() => {
      errorSalaryMessage.style.display = 'none';
    }, 2000);

    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${values[0]}</td>
    <td>${values[1]}</td>
    <td>${values[2]}</td>
    <td>${values[3]}</td>
    <td>$${Math.trunc(values[4] / 1000)},${(values[4] % 1000)
  .toString()
  .length < 2
  ? (values[4] % 1000).toString() + '00'
  : (values[4] % 1000).toString()}</td>
  </tr>
  `);

  successMessage.style.display = 'block';

  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 2000);
});

//  ##### Implement editing of table cells by double-clicking on it (optional).
const cellInput = document.createElement('input');
const cells = [...document.querySelectorAll('td')];
let oldText;
const customEnter = new Event('keyup');
let lastTarget;

cellInput.className = 'cell-input';
customEnter.code = 'Enter';

for (const cell of cells) {
  cell.addEventListener('dblclick', (evnt) => {
    if (lastTarget) {
      lastTarget.dispatchEvent(customEnter);
    }
    lastTarget = evnt.target;
    oldText = evnt.target.innerText;
    cellInput.value = oldText;
    evnt.target.innerText = '';
    evnt.target.append(cellInput);
  });

  cell.addEventListener('keyup', (evnt) => {
    if (evnt.code === 'Enter') {
      if (cellInput.value !== '') {
        evnt.target.innerText = cellInput.value;
      } else {
        evnt.target.innerText = oldText;
      }
    }
  });

  cell.addEventListener('blur', (evnt) => {
    if (cellInput.value !== '') {
      evnt.target.innerText = cellInput.value;
    } else {
      evnt.target.innerText = oldText;
    }
  });
}

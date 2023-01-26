'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const headers = thead.querySelector('tr');
let tr = tbody.querySelectorAll('tr');
let sorted = [];

for (let i = 0; i < headers.children.length; i++) {
  headers.children[i].setAttribute('dataDirection', 'ASC');
}

function removeSeparator(string) {
  return string.split(',').join('').split('$').join('');
}

function sortStrings(data, key) {
  const dataTable = [...data];
  const direction = headers.children[key].getAttribute('dataDirection');

  const newDataTable = dataTable.sort((a, b) => {
    let stringA;
    let stringB;

    if (direction === 'ASC') {
      stringA = a.children[key].textContent;
      stringB = b.children[key].textContent;
      headers.children[key].setAttribute('dataDirection', 'DESC');
    } else {
      stringA = b.children[key].textContent;
      stringB = a.children[key].textContent;
      headers.children[key].setAttribute('dataDirection', 'ASC');
    }

    if (stringA > stringB) {
      return 1;
    }

    if (stringA === stringB) {
      return 0;
    }

    return -1;
  });

  return newDataTable;
}

function sortNumbers(data, key) {
  const dataTable = [...data];
  const direction = headers.children[key].getAttribute('dataDirection');

  const newDataTable = dataTable.sort((a, b) => {
    const stringA = a.children[key].textContent;
    const stringB = b.children[key].textContent;
    const numA = parseInt(removeSeparator(stringA));
    const numB = parseInt(removeSeparator(stringB));

    if (direction === 'ASC') {
      headers.children[key].setAttribute('dataDirection', 'DESC');

      return numA - numB;
    }

    headers.children[key].setAttribute('dataDirection', 'ASC');

    return numB - numA;
  });

  return newDataTable;
}

thead.addEventListener('click', e => {
  if (!e.target.closest('thead')) {
    return;
  }

  switch (e.target.textContent) {
    case headers.children[0].textContent :
      sorted = sortStrings(tr, 0);
      headers.children[1].setAttribute('dataDirection', 'ASC');
      headers.children[2].setAttribute('dataDirection', 'ASC');
      headers.children[3].setAttribute('dataDirection', 'ASC');
      headers.children[4].setAttribute('dataDirection', 'ASC');
      break;
    case headers.children[1].textContent :
      sorted = sortStrings(tr, 1);
      headers.children[0].setAttribute('dataDirection', 'ASC');
      headers.children[2].setAttribute('dataDirection', 'ASC');
      headers.children[3].setAttribute('dataDirection', 'ASC');
      headers.children[4].setAttribute('dataDirection', 'ASC');
      break;
    case headers.children[2].textContent :
      sorted = sortStrings(tr, 2);
      headers.children[0].setAttribute('dataDirection', 'ASC');
      headers.children[1].setAttribute('dataDirection', 'ASC');
      headers.children[3].setAttribute('dataDirection', 'ASC');
      headers.children[4].setAttribute('dataDirection', 'ASC');
      break;
    case headers.children[3].textContent :
      sorted = sortNumbers(tr, 3);
      headers.children[0].setAttribute('dataDirection', 'ASC');
      headers.children[1].setAttribute('dataDirection', 'ASC');
      headers.children[2].setAttribute('dataDirection', 'ASC');
      headers.children[4].setAttribute('dataDirection', 'ASC');
      break;
    case headers.children[4].textContent :
      sorted = sortNumbers(tr, 4);
      headers.children[0].setAttribute('dataDirection', 'ASC');
      headers.children[1].setAttribute('dataDirection', 'ASC');
      headers.children[2].setAttribute('dataDirection', 'ASC');
      headers.children[3].setAttribute('dataDirection', 'ASC');
      break;
    default :
      sorted = [...tr];
      break;
  }

  tbody.innerHTML = `
    ${sorted.map(el => `
    <tr>
      <td>${el.children[0].textContent}</td>
      <td>${el.children[1].textContent}</td>
      <td>${el.children[2].textContent}</td>
      <td>${el.children[3].textContent}</td>
      <td>${el.children[4].textContent}</td>
    </tr>
    `).join('')}
  `;
});

tbody.addEventListener('click', e => {
  if (!e.target.closest('tr')) {
    return;
  }

  tr = tbody.querySelectorAll('tr');

  for (const el of tr) {
    el.classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form action="#" class="new-employee-form">
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label>Office: <select name="select" data-qa="office" required>
      <option value="Tokyo" selected>Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>
      Salary: <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="button">Save to table</button>
  </form>
`);

function printNotification(stat, message) {
  body.insertAdjacentHTML('beforeend', `
    <div class="${stat}" data-qa="notification">${stat} <br> ${message}</div>
  `);
}

const form = document.querySelector('form');
const button = form.querySelector('button');
const nameInput = form.querySelector('[data-qa="name"]');
const ageInput = form.querySelector('[data-qa="age"]');
const positionInput = form.querySelector('[data-qa="position"]');
const officeInput = form.querySelector('[data-qa="office"]');
const salaryInput = form.querySelector('[data-qa="salary"]');
// let salaryFormated = '';

// if (salaryInput.value.length <= 3) {
//   salaryFormated = salaryInput;
// } else {
//   for (const letter of salaryInput) {
//     console.log (letter);
//   }
// }

button.addEventListener('click', e => {
  let salaryFormated = '';

  if (nameInput.value.length < 4
      || parseInt(ageInput.value) < 18
      || parseInt(ageInput.value) > 90
      || !Number.isInteger(parseInt(ageInput.value))
      || !Number.isInteger(parseInt(salaryInput.value))
      || !nameInput.value
      || !ageInput.value
      || !positionInput.value
      || !officeInput.value
      || !salaryInput.value
  ) {
    printNotification('error', 'message of error');
  } else {
    let count = 0;

    if (salaryInput.value.length <= 3) {
      salaryFormated = salaryInput;
    } else {
      for (let i = salaryInput.value.length - 1; i >= 0; i--) {
        salaryFormated = salaryInput.value[i] + salaryFormated;
        count++;

        if (count === 3 && i !== 0) {
          salaryFormated = ',' + salaryFormated;
          count = 0;
        }
      }
    }

    salaryFormated = '$' + salaryFormated;

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${nameInput.value}</td>
        <td>${positionInput.value}</td>
        <td>${officeInput.value}</td>
        <td>${ageInput.value}</td>
        <td>${salaryFormated}</td>
      </tr>
    `);

    printNotification('success', 'message of success');

    nameInput.value = '';
    ageInput.value = '';
    positionInput.value = '';
    officeInput.value = '';
    salaryInput.value = '';
  }

  // console.log(Number.isInteger(parseInt(ageInput.value)));
});

// console.log(e.target.closest('tr'));

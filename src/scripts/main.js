'use strict';

const body = document.querySelector('body');
const tableBody = document.querySelector('tbody');

tableBody.classList.add('table-body');

body.insertAdjacentHTML('beforeend', `
<form action="" class="new-employee-form">
<label>
  Name:
  <input
    pattern="[A-Za-z]"
    name="name" 
    type="text" 
    data-qa="name" 
    required
    minlength ="4"
    value=""
  >
</label>

<label>
  Position:
  <input 
    name="position"
    type="text" 
    data-qa="position"
    required
    value=""
  >
</label>

<label>
  Office:
  <select 
  nema="office" 
  type="text" 
  data-qa="office"
  required
  value=""
>
  <option value="" disabled selected></option>
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
  </select>
</label>

<label>
  Age:
  <input 
  name="age" 
  type="number" 
  data-qa="age" 
  min="18"
  max="90"
  required
  value=""
>
</label>

<label>
  Salary:
  <input 
  name="salary" 
  type="number" 
  data-qa="salary"
  required
  value=""
  >
</label>

<button type="submit">Save to table</button>
</form>
`);

const buttonForm = document.querySelector('button');

function getSalary(el) {
  return el.replace(/\D/g, '');
}

let counterClickName = 0;
let counterClickPosition = 0;
let counterClickOffice = 0;
let counterClickAge = 0;
let counterClickSalary = 0;

function resetCount() {
  counterClickName = 0;
  counterClickPosition = 0;
  counterClickOffice = 0;
  counterClickAge = 0;
  counterClickSalary = 0;
}

document.querySelector('thead').addEventListener('click', (e) => {
  const whereСlicked = e.target;
  const tableBodyActive = document.querySelector('tbody');
  const personsNow = [...tableBodyActive.querySelectorAll('tr')];
  let personsRender = [];

  function sortedAlphabet(person) {
    return person.sort((a, b) => a.children[whereСlicked.cellIndex]
      .innerText.localeCompare(b.children[whereСlicked.cellIndex].innerText));
  }

  switch (whereСlicked.innerText) {
    case 'Name':
      if (counterClickName > 0) {
        personsRender = personsNow.reverse();
        break;
      }

      resetCount();
      counterClickName++;
      personsRender = sortedAlphabet(personsNow);
      break;

    case 'Position':
      if (counterClickPosition > 0) {
        personsRender = personsNow.reverse();
        break;
      }

      resetCount();
      counterClickPosition++;
      personsRender = sortedAlphabet(personsNow);
      break;

    case 'Office':
      if (counterClickOffice > 0) {
        personsRender = personsNow.reverse();
        break;
      }

      resetCount();
      counterClickOffice++;
      personsRender = sortedAlphabet(personsNow);
      break;

    case 'Age':
      if (counterClickAge > 0) {
        personsRender = personsNow.reverse();
        break;
      }

      resetCount();
      counterClickAge++;

      personsRender = personsNow.sort((a, b) => {
        return +a.children[whereСlicked.cellIndex].innerText
        - +b.children[whereСlicked.cellIndex].innerText;
      });
      break;

    case 'Salary':
      if (counterClickSalary > 0) {
        personsRender = personsNow.reverse();
        break;
      }

      resetCount();
      counterClickSalary++;

      personsRender = personsNow.sort((a, b) => getSalary(a
        .children[whereСlicked.cellIndex].innerText)
        - getSalary(b.children[whereСlicked.cellIndex].innerText));
  }

  tableBody.append(...personsRender);
});

tableBody.addEventListener('click', (e) => {
  [...document.querySelectorAll('.active')]
    .forEach(el => el.classList.remove('active'));

  e.target.closest('tr').classList.add('active');
});

buttonForm.onclick = (e) => {
  e.preventDefault();

  const labels = [...document.querySelectorAll('label')];

  let valueInput = [];

  valueInput = labels.map(label => [...label.children][0].value);

  if (valueInput.some(item => item === '')
  || valueInput[0].length < 4
  || valueInput[3] <= 18
  || valueInput[3] >= 90
  ) {
    body.insertAdjacentHTML('afterend', `
    <div class="notification error" style="position: fixed">
      <h2>Error</h2>
      <p>Fields filled out incorrectly. Umya must have 4 
      characters, age must be greater than 18 and less than 90</p>
      </br>
    </div>
  `);

    setTimeout(() => document.querySelector('.notification').remove(), 5000);

    return;
  }

  const newTableElement = `
    <tr>
      <td>${valueInput[0]}</td>
      <td>${valueInput[1]}</td>
      <td>${valueInput[2]}</td>
      <td>${valueInput[3]}</td>
      <td>${'$' + (+valueInput[4]).toLocaleString()}</td>
    </tr>
  `;

  tableBody.insertAdjacentHTML('afterbegin', newTableElement);

  body.insertAdjacentHTML('afterend', `
  <div class="notification success" style="position: fixed">
    <h2>Well done</h2>
    <p>You have added a new employee</p>
    </br>
  </div>
`);

  setTimeout(() => document.querySelector('.notification').remove(), 2000);

  labels.map(label => {
    [...label.children][0].value = '';

    return label;
  });
};

let elementText;

window.addEventListener('dblclick', (e) => {
  if (e.target.closest('tbody') === null) {
    return;
  }

  if (e.target.closest('tbody').classList.contains('table-body')) {
    elementText = e.target.innerText;

    e.target.closest('td').innerHTML = `
    <input 
      class="input-edit" 
      value="${elementText}"
      style="
        outline:none;
        background: none;
        font-size:15px; 
        height: 28px;
        width: 100px;
      "
    >
    `;
  }
});

window.addEventListener('click', (e) => {
  const inputEdit = document.querySelector('.input-edit');

  if (inputEdit === null
    || e.target.classList.contains('input-edit')) {
    return;
  }

  if (inputEdit.value === '') {
    inputEdit.closest('td').innerHTML = elementText;
  }

  inputEdit.closest('td').innerHTML = `${inputEdit.value}`;
});

window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const inputEdit = document.querySelector('.input-edit');

    if (inputEdit.value === '') {
      inputEdit.closest('td').innerHTML = elementText;
    }

    inputEdit.closest('td').innerHTML = `${inputEdit.value}`;
  }
});

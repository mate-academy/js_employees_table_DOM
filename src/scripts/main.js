'use strict';

const body = document.querySelector('body');
const tableBody = document.querySelector('tbody');
const selectOffice = `
<select 
  class="input-edit"
  nema="office" 
  type="text" 
  data-qa="office"
  required
  value=""
>
  <option value="Tokyo">Tokyo</option>
  <option value="London">London</option>
  <option value="Singapore">Singapore</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
</select>
`;

const countriesOffice = [`Tokyo`, `Singapore`, `London`,
  `New York`, `Edinburgh`, `San Francisco`];

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
    ` + selectOffice + `
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
  let personsNow = [...tableBodyActive.querySelectorAll('tr')];

  function sortedAlphabet(personsToSort) {
    return personsToSort.sort((a, b) => a.children[whereСlicked.cellIndex]
      .innerText.localeCompare(b.children[whereСlicked.cellIndex].innerText));
  }

  switch (whereСlicked.innerText) {
    case 'Name':
      if (counterClickName > 0) {
        personsNow.reverse();
        break;
      }

      resetCount();
      counterClickName++;
      sortedAlphabet(personsNow);
      break;

    case 'Position':
      if (counterClickPosition > 0) {
        personsNow.reverse();
        break;
      }

      resetCount();
      counterClickPosition++;
      sortedAlphabet(personsNow);
      break;

    case 'Office':
      if (counterClickOffice > 0) {
        personsNow.reverse();
        break;
      }

      resetCount();
      counterClickOffice++;
      sortedAlphabet(personsNow);
      break;

    case 'Age':
      if (counterClickAge > 0) {
        personsNow.reverse();
        break;
      }

      resetCount();
      counterClickAge++;

      personsNow.sort((a, b) => {
        return +a.children[whereСlicked.cellIndex].innerText
        - +b.children[whereСlicked.cellIndex].innerText;
      });
      break;

    case 'Salary':
      if (counterClickSalary > 0) {
        personsNow = personsNow.reverse();
        break;
      }

      resetCount();
      counterClickSalary++;

      personsNow = personsNow.sort((a, b) => getSalary(a
        .children[whereСlicked.cellIndex].innerText)
        - getSalary(b.children[whereСlicked.cellIndex].innerText));
  }

  tableBody.append(...personsNow);
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

function saveInputText(input) {
  if (input.value === '') {
    input.closest('td').innerHTML = elementText;

    return;
  }

  input.closest('td').innerHTML = `${input.value}`;
}

tableBody.addEventListener('dblclick', (e) => {
  if (e.target.closest('td').innerHTML.includes('<input')
  || e.target.closest('td').innerHTML.includes('<select')) {
    return;
  }

  if (countriesOffice.some(countri => countri
    === e.target.closest('td').innerHTML)) {
    e.target.closest('td').innerHTML = selectOffice;

    const selectEdit = document.querySelector('.input-edit');

    selectEdit.addEventListener('blur', () => {
      saveInputText(selectEdit);
    });

    selectEdit.addEventListener('keypress', (even) => {
      if (even.key === 'Enter') {
        saveInputText(selectEdit);
      }
    });

    return;
  }

  elementText = e.target.innerText;

  const elementWidth = e.target.clientWidth;

  e.target.closest('td').innerHTML = `
    <input
    autofocus
      class="input-edit" 
      value="${elementText}"
      style="
        outline:none;
        background: none;
        font-size:15px; 
        height: 28px;
        width: ${elementWidth - 36}px;
      "
    >
    `;

  const inputEdit = document.querySelector('.input-edit');

  inputEdit.addEventListener('blur', () => {
    saveInputText(inputEdit);
  });

  inputEdit.addEventListener('keypress', (even) => {
    if (even.key === 'Enter') {
      saveInputText(inputEdit);
    }
  });
});

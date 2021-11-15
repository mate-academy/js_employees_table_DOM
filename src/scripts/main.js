'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tableBody = table.querySelector('tbody');
const tableRows = [...tableBody.rows];

const fromUsdToNumber = str => {
  return +str.replace('$', '').split(',').join('');
};

const fromStringToUsd = str => {
  return '$' + (+str).toLocaleString();
};

const toCapitalLetters = str => {
  const words = str.split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(' ');
};

// ===============  1 sort table  ===================

let sortSwitch = 1;

headers.forEach(header => {
  header.addEventListener('click', e => {
    sortSwitch++;

    const headerIndex = [...headers].indexOf(e.target);

    tableRows.sort((a, b) => {
      const x = a.cells[headerIndex].innerText;
      const y = b.cells[headerIndex].innerText;

      if (sortSwitch % 2 === 0) {
        return fromUsdToNumber(x) - fromUsdToNumber(y) || x.localeCompare(y);
      }

      return fromUsdToNumber(y) - fromUsdToNumber(x) || y.localeCompare(x);
    });

    tableBody.append(...tableRows);
  });
});

// ===============  2 select row  ===================

tableBody.addEventListener('click', e => {
  const elem = e.target;
  const activeElem = tableBody.querySelector('tr.active');

  if (activeElem) {
    activeElem.classList.remove('active');
  }
  elem.parentElement.classList.add('active');
});

// ===============  3 create form  ===================

const form = document.createElement('form');
const offices = ['Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name:
    <input
      type="text"
      name="name"
      pattern="[A-Za-z ]*"
      data-qa="name"
      required
    >
  </label>
  <label>Position:
    <input
      type="text"
      name="position"
      minlength="4"
      maxlength = "30"
      pattern="[A-Za-z ]*"
      data-qa="position"
      required
    >
  </label>
  <label>Office:
    <select
      name="office"
      data-qa="office" 
      required
    >
    ${offices.map(office => `
      <option>${office}</option>
    `).join()}
    </select>
  </label>
  <label>Age:
    <input
      type="number"
      name="age"
      data-qa="age"
      required
    >
  </label>
  <label>Salary:
    <input
      type="number"
      name="salary"
      min="10 000"
      max="999 999"
      data-qa="salary"
      required
    >
  </label>
  <button type="submit">
    Save to table
  </button>
`;

document.body.append(form);

// ===============  4 show notification  ===================

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const h4 = document.createElement('h4');
  const p = document.createElement('p');

  message.className = type;
  message.dataset.qa = 'notification';

  message.style.cssText = `
    box-sizing: content-box;
    padding: 10px;
    margin-top: 16px;
    border: 1px solid;
    border-radius: 10px;
  `;

  h4.textContent = title;
  h4.style.margin = '0';
  p.textContent = description;
  p.style.cssText = `margin: 0; padding-top: 10px; line-height: 1.5;`;

  if (type === 'error') {
    message.style.borderColor = 'red';
    h4.style.color = 'red';
  } else {
    message.style.borderColor = 'green';
    h4.style.color = 'green';
  }

  message.append(h4, p);

  form.append(message);
  setTimeout(() => message.remove(), 2000);
};

// ===============  add employee  ===================

form.addEventListener('submit', e => {
  e.preventDefault();

  const newEmploee = tableRows[1].cloneNode(true);

  const formData = new FormData(form);
  const emploeeName = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = fromStringToUsd(formData.get('salary'));

  newEmploee.children[0].innerText = emploeeName;
  newEmploee.children[1].innerText = position;
  newEmploee.children[2].innerText = office;
  newEmploee.children[3].innerText = age;
  newEmploee.children[4].innerText = salary;

  if (emploeeName.length < 4) {
    pushNotification('ERROR!!!',
      'Name should contain at least 4 letters',
      'error'
    );
  }

  if (age < 18 || age > 90) {
    pushNotification('ERROR!!!',
      'Employee must be between 18 and 90 years old',
      'error'
    );
  }

  if (emploeeName.length >= 4 && age >= 18 && age <= 90) {
    pushNotification('SUCCESS!!!',
      'Employee was added to database',
      'success'
    );

    tableBody.append(newEmploee);

    form.reset();
  }
});

// ===============  5 edit the table  ===================

tableBody.addEventListener('dblclick', e => {
  const elem = e.target;
  const elemValue = elem.innerText;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = elemValue;
  input.setAttribute('value', elemValue);

  if (elem.cellIndex === 3) {
    input.type = 'number';
  }

  if (elem.cellIndex === 4) {
    input.value = fromUsdToNumber(elemValue);
    input.type = 'number';
  }

  elem.innerText = '';
  elem.append(input);
  input.focus();

  const select = document.createElement('select');

  select.classList.add('cell-input');

  for (const office of offices) {
    const option = document.createElement('option');

    option.value = office;
    option.innerText = office;

    select.append(option);
  }

  if (elem.cellIndex === 2) {
    elem.innerText = '';
    elem.append(select);
  }

  const saveData = () => {
    if (elem.cellIndex === 0 || elem.cellIndex === 1) {
      if (!input.value) {
        elem.innerText = elemValue;
      }

      for (const char of input.value) {
        if (!isNaN(parseInt(char))) {
          alert('Name should contain only letters');
          input.value = elemValue;
          break;
        }
      }
      elem.innerText = toCapitalLetters(input.value);
    }

    if (elem.cellIndex === 2) {
      /*
      я не знаю, як у коді вище
      зберегти у змінну значення обраного селекту (опції) так,
      щоб потім цю змінну призначити в elem.innerText
      */

      elem.innerHTML = '';
      elem.innerText = 'hello';

      // if (!option.value) {
      //   elem.innerHTML = elemValue;
      // }
    }

    if (elem.cellIndex === 3) {
      if (input.value < 18 || input.value > 90) {
        alert('Employee must be between 18 and 90 years old');
        input.value = elemValue;
      }
      elem.innerText = input.value;
    }

    if (elem.cellIndex === 4) {
      if (!input.value) {
        elem.innerText = elemValue;
      }

      elem.innerText = fromStringToUsd(input.value);
    }
  };

  input.addEventListener('blur', saveData);

  input.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      saveData();
    }
  });

  select.addEventListener('blur', saveData);

  select.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      saveData();
    }
  });
});

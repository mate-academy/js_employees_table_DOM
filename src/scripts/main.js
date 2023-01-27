'use strict';

const table = document.body.querySelector('table');
const thead = document.body.querySelector('thead');
const tbody = document.body.querySelector('tbody');

let clickCount = 0;

thead.addEventListener('click', (e) => {
  const target = e.target.closest('th');
  const cellIndex = target.cellIndex;
  const trBody = tbody.querySelectorAll('tr');

  if (!target) {
    return;
  }

  clickCount++;

  const sortedTr = [...trBody].sort((a, b) => {
    let value1 = a.children[cellIndex].textContent;
    let value2 = b.children[cellIndex].textContent;

    if (clickCount % 2 === 0) {
      value1 = b.children[cellIndex].textContent;
      value2 = a.children[cellIndex].textContent;
    }

    if (!isNaN(+value1)) {
      return value1 - value2;
    } else if (value1[0] === '$') {
      return toNumber(value1) - toNumber(value2);
    } else if (typeof value1 === 'string') {
      return value1.localeCompare(value2);
    }
  });

  sortedTr.forEach(item => {
    return tbody.append(item);
  });
});

tbody.addEventListener('click', (e) => {
  const target = e.target.closest('td');
  const trBody = tbody.querySelectorAll('tr');

  if (!target) {
    return;
  }

  [...trBody].map(item => {
    if (item.classList.contains('active')) {
      item.classList.remove('active');
    }
  });

  target.parentElement.classList.toggle('active');
});

table.insertAdjacentHTML('afterend',
  `<form action="/" method="get" class="new-employee-form">
    <label>
      Name:

      <input 
        name="name" 
        type="text" 
        data-qa="name" 
        required
      >
    </label>

    <label>
      Position: 

      <input 
        name="position" 
        type="text" 
        data-qa="position" 
        required
      >
    </label>

    <label>
      Office:

      <select 
        name="office" 
        type="select" 
        data-qa="office" 
        required
      >
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>
      Age: 

      <input 
        name="age" 
        type="number" 
        data-qa="age" 
        required
      >
    </label>

    <label>
      Salary: 

      <input 
        name="salary" 
        type="number" 
        data-qa="salary" 
        required
      >
    </label>

    <button>
      Save to table
    </button>
  </form>`
);

const form = document.forms[0];
const submit = document.body.querySelector('button');

function createNotification(nType, nTitle, nDescription) {
  const div = document.createElement('div');
  const title = document.createElement('h2');
  const p = document.createElement('p');

  form.after(div);

  div.dataset.qa = 'notification';
  div.classList.add(`${nType}`, 'notification');

  div.append(title);

  title.classList.add('title');
  title.innerHTML = `${nTitle}`;

  title.append(p);

  p.innerHTML = `${nDescription}`;
}

function validation(validatedForm) {
  for (let i = 0; i < validatedForm.elements.length - 1; i++) {
    const item = validatedForm.elements[i];

    if (item.value.trim() === '') {
      createNotification('error', 'Field error', 'The field cannot be empty');

      return false;
    }

    if (item.dataset.qa === 'name') {
      for (const ch of item.value.split(' ').join('')) {
        if (ch.toLowerCase() === ch.toUpperCase()) {
          createNotification('error', 'Name error',
            'Your name must contain only letters');

          return false;
        }
      }

      if (item.value.length < 4) {
        createNotification('error', 'Name error',
          'Your name must not be shorter than 4 letters');

        return false;
      }
    }

    if (item.dataset.qa === 'age') {
      if (item.value < 18 || item.value > 90) {
        createNotification('error', 'Wrong age',
          'Your age cannot be less than 18 and more than 90 years old');

        return false;
      }
    }
  }

  createNotification('success', 'Successful operation',
    'Your data has been successfully entered into the table');

  return true;
}

submit.addEventListener('click', (e) => {
  const notification = document.body.querySelectorAll('.notification');

  [...notification].map(item => item.remove());
  e.preventDefault();

  if (validation(form)) {
    const tr = document.createElement('tr');

    tbody.append(tr);

    for (let i = 0; i < form.elements.length - 1; i++) {
      const item = form.elements[i];
      const td = document.createElement('td');

      tr.append(td);
      td.innerHTML = item.value;

      if (item.dataset.qa === 'salary') {
        const number = +item.value;

        td.innerHTML = convertSalary(number);
      }
    }
    form.reset();
  }
});

function convertSalary(value) {
  return `$${value.toLocaleString('en-US')}`;
}

const toNumber = function(value) {
  return +value.slice(1).split(',').join('');
};

tbody.addEventListener('dblclick', (e) => {
  const target = e.target.closest('td');
  const text = target.textContent;

  if (!target) {
    return;
  }

  target.innerHTML = `<input type="text" class="cell-input">`;

  const input = document.querySelector('.cell-input');
  const cellIndex = target.cellIndex;

  input.value = text;
  input.focus();

  input.onblur = function() {
    const notification = document.body.querySelectorAll('.notification');

    [...notification].map(item => item.remove());
    target.innerHTML = tableValidation(input.value, cellIndex, text);
    input.replaceWith(target);
  };

  input.onkeyup = function(ev) {
    if (ev.key === 'Enter') {
      input.blur();
    }
  };
});

function tableValidation(value, index, text) {
  if (index === 0 || index === 1 || index === 2) {
    for (const ch of value.split(' ').join('')) {
      if (ch.toLowerCase() === ch.toUpperCase()) {
        createNotification('error', 'Name error',
          'Your name must contain only letters');

        return text;
      }
    }
  }

  if (index === 0) {
    if (value.length < 4) {
      createNotification('error', 'Name error',
        'Your name must not be shorter than 4 letters');

      return text;
    }
  }

  if (index === 3) {
    if (value < 18 || value > 90 || isNaN(+value)) {
      createNotification('error', 'Wrong age',
        'Your age cannot be less than 18 and more than 90 years old');

      return text;
    }
  }

  const salary = toNumber(value);

  if (index === 4 && isNaN(salary)) {
    createNotification('error', 'Wrong number',
      'Your salary must be a number');

    return text;
  } else if (index === 4 && !isNaN(salary)) {
    return convertSalary(salary);
  }

  if (value.trim() === '') {
    return text;
  }

  return value;
}

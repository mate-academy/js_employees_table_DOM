'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

let toggleSwitch = true;

thead.addEventListener('click', (e) => {
  const coords = e.target;
  let pers = [...tbody.children];

  pers.sort((a, b) => {
    const textA = a.children[coords.cellIndex].innerText;
    const textB = b.children[coords.cellIndex].innerText;

    switch (coords.innerText) {
      case 'Name':
      case 'Position':
      case 'Office':
        return textA.localeCompare(textB);

      case 'Age':
        return +textA - +textB;

      case 'Salary':
        return trimmer(textA) - trimmer(textB);
    }
  });

  if (!toggleSwitch) {
    pers = pers.reverse();
  }

  toggleSwitch = !toggleSwitch;

  tbody.append(...pers);
});

function trimmer(salary) {
  return salary.replace(/\D/g, '');
}

let special;

tbody.addEventListener('click', (e) => {
  if (special) {
    special.classList.remove('active');
  }

  special = e.target.parentElement;
  e.target.parentElement.classList.add('active');
});

document.body.insertAdjacentHTML('beforeend', `
  <form 
    action="/" 
    method="get" 
    class="new-employee-form"
  >
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        minlength="4"
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
    <label for="office">
      Office:
      <select 
        id="office" 
        data-qa="office" 
        required
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
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
        required 
        min="18" 
        max="90"
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
    <button type="submit"> Save to table </button>
  </form>
`);

const form = document.forms[0];
const select = form.querySelector('[data-qa="office"]');

const createRow = (...arg) => {
  const firstField = form.name.value;
  const secondField = form.position.value;
  const thirdField = select.value;
  const fourthField = form.age.value;
  const fifthField = parseFloat(form.salary.value);
  const format = fifthField.toLocaleString('en-US');

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${firstField}</td>
      <td>${secondField}</td>
      <td>${thirdField}</td>
      <td>${fourthField}</td>
      <td>$${format}</td>
    </tr>
  `);
};

function showNotification(type, title, text) {
  form.insertAdjacentHTML('afterend', `
    <div class="notification" data-qa="notification">
      <h1 class="title">${title.toUpperCase()}</h1>
      <p>${text}</p>
    </div>
  `);

  const notification = document.querySelector('.notification');

  notification.classList.add(type);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.name.addEventListener('change', e => {
  if (!form.name.validity.valid || !form.name.value.trim()) {
    showNotification(
      'error',
      'Incorrect name',
      'Name length should be at least 4 letters'
    );
  }
});

form.age.addEventListener('change', e => {
  if (!form.age.validity.valid) {
    showNotification(
      'error',
      'Enter a correct age',
      'Your age must be from 18 to 90 years'
    );
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (form.name.value.trim()) {
    createRow();

    showNotification(
      'success',
      'Successful!',
      'New employee is successfully added to the table'
    );
  }

  e.target.reset();
});

const validScheme = {
  name: (value) => value.length > 4,
  age: (value) => value > 18 || value < 90,
  salary: (value) => `$${value}`,
};

tbody.addEventListener('dblclick', (e) => {
  const item = e.target;
  const targetCell = item.cellIndex;
  const prevValue = item.innerText;
  const normValue = prevValue.replace(/[$,]/g, '');
  const targetInput
    = form.querySelectorAll('[data-qa]')[targetCell].cloneNode(true);

  targetInput.classList.add('cell-input');
  targetInput.value = normValue;
  item.firstChild.replaceWith(targetInput);
  targetInput.focus();

  targetInput.addEventListener('keypress', eventKey => {
    if (eventKey.key === 'Enter') {
      targetInput.blur();
    }
  });

  targetInput.addEventListener('blur', eventBlur => {
    if (validScheme.name(targetInput.value)
      || validScheme.age(targetInput.value)
      || validScheme.salary(targetInput.value)
      || !targetInput.value.trim()) {
      item.removeChild(targetInput);

      if (targetInput.value.toLowerCase() === targetInput.value.toUpperCase()
        && targetInput.value.length > 2) {
        const numb = +targetInput.value;

        item.textContent = `$${numb.toLocaleString('en-US')}`;
      } else {
        item.textContent = targetInput.value;
      }

      return;
    }

    item.removeChild(targetInput);
    item.textContent = prevValue;
  });
});

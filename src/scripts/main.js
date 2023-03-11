'use strict';

const validField = {
  name: (value) => value.length > 4,
  age: (value) => value > 18 || value < 90,
  salary: (value) => `$${value}`,
};

document.body.insertAdjacentHTML('beforeend', `
  <form action="/" method="get" class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        minlength="4"
        pattern="[A-Za-zа-яёА-ЯЁ0-9]{4,30}"
        required
      >
    </label>
    <label>
      Position:
      <input
      name="position"
      type="text"
      data-qa="position"
      pattern="[A-Za-zа-яёА-ЯЁ0-9]{4,30}"
      required>
    </label>
    <label for="office">
      Office:
      <select id="office" data-qa="office" required>
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
      <input name="age" type="number" data-qa="age" required min="18" max="90">
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" min="1"required>
    </label>
    <button type="submit"> Save to table </button>
  </form>
`);

const thead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const form = document.forms[0];
const select = form.querySelector('[data-qa="office"]');

const createRow = (...arr) => {
  const nameField = form.name.value.trim();
  const positionField = form.position.value.trim();
  const officeField = select.value;
  const ageField = form.age.value;
  const salaryField = parseFloat(form.salary.value);
  const formatSalaryField = salaryField.toLocaleString('en-US');

  tBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${nameField}</td>
      <td>${positionField}</td>
      <td>${officeField}</td>
      <td>${ageField}</td>
      <td>$${formatSalaryField}</td>
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
  }, 5000);
}

form.name.addEventListener('submit', e => {
  if (!form.name.validity.valid) {
    form.name.setCustomValidity(
      'Error! Less 4 letters are entered in the field'
    );
  }
});

form.name.addEventListener('change', e => {
  if (!form.name.validity.valid && form.name.innerText.trim().length < 4) {
    showNotification(
      'error', 'Incorrect name', 'Name length should be at least 4 letters'
    );
  }
});

form.age.addEventListener('change', e => {
  if (!form.age.validity.valid) {
    showNotification(
      'error', 'Enter a correct age', 'Your age must be from 18 to 90 years'
    );
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  createRow();

  showNotification(
    'success', 'Good!!!', 'New employee is successfully added to the table'
  );
  e.target.reset();
});

tBody.addEventListener('dblclick', (e) => {
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
    if (validField.name(targetInput.value)
      || validField.age(targetInput.value
      || validField.salary(targetInput.value))) {
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

let toggleSwitch = true;

thead.addEventListener('click', (e) => {
  const item = e.target;
  const cellIndex = item.cellIndex;

  let data = [...tBody.children];

  data.sort((a, b) => {
    const contentA = a.cells[cellIndex].textContent;
    const contentB = b.cells[cellIndex].textContent;

    if (contentA.toUpperCase() !== contentA.toLowerCase()) {
      return contentA.localeCompare(contentB);
    }

    if (parseInt(contentA)) {
      return contentA - contentB;
    } else {
      return parseInt(contentA.slice(1)) - parseInt(contentB.slice(1));
    }
  });

  if (!toggleSwitch) {
    data = data.reverse();
  }

  toggleSwitch = !toggleSwitch;

  data.forEach((elem, i) => {
    elem.innerHTML = data[i].innerHTML;
  });

  tBody.append(...data);
});

let special;

tBody.addEventListener('click', (e) => {
  if (special) {
    special.classList.remove('active');
    special.removeAttribute('class');
  }

  special = e.target.parentElement;
  e.target.parentElement.classList.add('active');
});

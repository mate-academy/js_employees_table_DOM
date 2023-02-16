'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const validScheme = {
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
        required
        minlength="4"
      >
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position" required>
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
      <input name="salary" type="number" data-qa="salary" required>
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

function showNotifi(type, text) {
  form.insertAdjacentHTML('afterend', `
    <div class="notification" data-qa="notification">
      <h1 class="title">${type.toUpperCase()}</h1>
      <p>${text}</p>
    </div>
  `);

  const notification = document.querySelector('.notification');

  if (type === 'success') {
    notification.classList.add('success');
  };

  if (type === 'error') {
    notification.classList.add('error');
  }

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

form.name.addEventListener('submit', e => {
  if (!form.name.validity.valid) {
    form.name.setCustomValidity(
      'Error! Less 4 letters are entered in the field'
    );
    showNotifi('error', 'Name length should be at least 4 letters');
  }
});

form.name.addEventListener('change', e => {
  if (!form.name.validity.valid) {
    showNotifi('error', 'Name length should be at least 4 letters');
  }
});

form.age.addEventListener('submit', e => {
  if (!form.age.validity.valid) {
    form.age.setCustomValidity(
      'Error! Age range should be from 18 to 90 years'
    );
  }
});

form.age.addEventListener('change', e => {
  if (!form.age.validity.valid) {
    showNotifi('error', 'Age range should be from 18 to 90');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  createRow();
  showNotifi('success', 'New employee is successfully added to the table');
  e.target.reset();
});

let toggleSwitch = true;

thead.addEventListener('click', (e) => {
  const item = e.target;
  const cellIndex = item.cellIndex;

  let data = [...tbody.children];

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

  tbody.append(...data);
});

let special;

tbody.addEventListener('click', (e) => {
  if (special) {
    special.classList.remove('active');
    special.removeAttribute('class');
  }

  special = e.target.parentElement;
  e.target.parentElement.classList.add('active');
});

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
      || validScheme.age(targetInput.value
      || validScheme.salary(targetInput.value))) {
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

'use strict';

const body = document.querySelector('body');
const table = body.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');

body.insertAdjacentHTML('beforeend', `
  <form 
    action="#"
    method="get"
    class="new-employee-form"
  >
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        min=0
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        min=0
      >
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

// implements notification function
function pushNotification(title, description, type) {
  body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
  </div>
  `);

  setTimeout(() => {
    body.removeChild(document.querySelector('.notification'));
  }, 2000);
}

// validate form field value
function checkFormData(key, value) {
  if (!value) {
    pushNotification('An error occured', 'Empty field value', 'error');

    return false;
  }

  if (key === 'name' && value.length < 4) {
    pushNotification('An error occured', 'Invalid name value', 'error');

    return false;
  }

  if (key === 'age' && ((+value < 18 || +value > 90) || isNaN(+value))) {
    pushNotification('An error occured', 'Invalid age value', 'error');

    return false;
  }

  return true;
}

// implements rows sorting function
tHead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const isSorted = e.target.matches('.sorted');
  const isSalary = e.target.innerText === 'Salary';

  [...tBody.children]
    .sort((a, b) => {
      const aValue = isSalary
        ? +(a.children[index].innerText.replaceAll(/\$|,/g, ''))
        : a.children[index].innerText;
      const bValue = isSalary
        ? +(b.children[index].innerText.replaceAll(/\$|,/g, ''))
        : b.children[index].innerText;

      return aValue > bValue
        ? isSorted ? -1 : 1
        : aValue < bValue
          ? isSorted ? 1 : -1
          : 0;
    })
    .forEach(item => tBody.append(item));

  e.target.classList.toggle('sorted', !isSorted);

  [...tHead.firstElementChild.children].forEach(item => {
    if (item !== e.target) {
      item.classList.remove('sorted');
    }
  });
});

// implements row selecting function
tBody.addEventListener('click', (e) => {
  if (e.target.closest('tr').matches('.active')) {
    return;
  }

  [...tBody.children].forEach(item => {
    item.classList.remove('active');
  });

  e.target.closest('tr').classList.toggle('active');
});

// implements form validation
body.querySelector('.new-employee-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const newNode = document.createElement('tr');

  for (const [key, value] of data) {
    if (!checkFormData(key, value)) {
      return;
    }

    if (key === 'salary') {
      newNode.insertAdjacentHTML('beforeend', `
        <td>$${Intl.NumberFormat('en-US').format(+value)}</td>
      `);
    } else {
      newNode.insertAdjacentHTML('beforeend', `<td>${value}</td>`);
    }
  }

  tBody.append(newNode);
  e.target.reset();
  pushNotification('Success', 'New data added', 'success');
});

// implement row editing
tBody.addEventListener('dblclick', (e) => {
  const element = e.target.closest('td');
  const parentElement = element.parentElement;
  const input = document.createElement('input');
  const cellIndex = element.cellIndex;

  input.classList.add('cell-input');
  input.type = 'text';
  parentElement.replaceChild(input, element);
  input.focus();
  input.value = element.innerText;

  input.addEventListener('blur', (handler) => {

  });

  input.addEventListener('blur', (handler) => {
    const key = tHead.firstElementChild.children[cellIndex]
      .innerText.toLowerCase();

    if (checkFormData(key, input.value)) {
      element.innerText = input.value;
    }

    parentElement.replaceChild(element, input);
    input.remove();
  });

  input.addEventListener('keydown', (handler) => {
    if (handler.type === 'keydown' && handler.code !== 'Enter') {
      return;
    }

    input.blur();
  });
});

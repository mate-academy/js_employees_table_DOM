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

tBody.addEventListener('click', (e) => {
  if (e.target.closest('tr').matches('.active')) {
    return;
  }

  [...tBody.children].forEach(item => {
    item.classList.remove('active');
  });

  e.target.closest('tr').classList.toggle('active');
});

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

tBody.addEventListener('dblclick', ev => {
  const targeted = ev.target;

  const originalText = targeted.textContent;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.name = 'text';
  input.type = 'text';

  targeted.textContent = '';

  targeted.append(input);
  input.focus();

  const textInput = document.querySelector('.cell-input');

  input.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
      if (textInput.value.length === 0) {
        targeted.textContent = originalText;
      }

      if (targeted.cellIndex === 0) {
        if (textInput.value.length < 4) {
          targeted.textContent = originalText;

          pushNotification('Error', 'Invalid Name', 'error');
        } else {
          targeted.textContent = textInput.value;

          pushNotification('Success', 'Successfully changed', 'success');
        }
      } else if (targeted.cellIndex === 3) {
        if (+textInput.value < 18 || +textInput.value > 90) {
          targeted.textContent = originalText;

          pushNotification('Error', 'Invalid Age', 'error');
        } else {
          targeted.textContent = textInput.value;

          pushNotification('Success', 'Successfully changed', 'success');
        }
      } else if (targeted.cellIndex === 4) {
        if (isNaN(textInput.value)) {
          targeted.textContent = originalText;

          pushNotification('Error', 'Not a number', 'error');
        } else {
          targeted.textContent = `
            $${parseInt(textInput.value).toLocaleString('en-US')}
          `;

          pushNotification('Success', 'Successfully changed', 'success');
        }
      }
    }
  });

  input.addEventListener('blur', e2 => {
    if (textInput.value.length === 0) {
      targeted.textContent = originalText;
    }

    if (targeted.cellIndex === 0) {
      if (textInput.value.length < 4) {
        targeted.textContent = originalText;

        pushNotification('Error', 'Invalid Name', 'error');
      } else {
        targeted.textContent = textInput.value;

        pushNotification('Success', 'Successfully changed', 'success');
      }
    } else if (targeted.cellIndex === 3) {
      if (+textInput.value < 18 || +textInput.value > 90) {
        targeted.textContent = originalText;

        pushNotification('Error', 'Invalid Age', 'error');
      } else {
        targeted.textContent = textInput.value;

        pushNotification('Success', 'Successfully changed', 'success');
      }
    } else if (targeted.cellIndex === 4) {
      if (isNaN(textInput.value)) {
        targeted.textContent = originalText;

        pushNotification('Error', 'Not a number', 'error');
      } else {
        targeted.textContent = `
          $${parseInt(textInput.value).toLocaleString('en-US')}
        `;

        pushNotification('Success', 'Successfully changed', 'success');
      }
    }
  });
});

'use strict';

const body = document.querySelector('body');
const tabHead = document.querySelector('thead');
const tabBody = document.querySelector('tbody');

const rows = tabBody.rows;

let clickCount;

function convertToNumber(elem) {
  return elem.split('$').join('').split(',').join('');
}

function pushNotification(title, description, type) {
  const div = document.createElement('div');

  div.classList.add('notification', type);
  div.setAttribute('data-qa', 'notification');

  div.insertAdjacentHTML('afterbegin', `
    <h1 class="title">${title}</h1>
    <p>${description}</p>
  `);

  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

tabHead.addEventListener('click', ev => {
  const targeted = ev.target.closest('th');

  clickCount++;

  const cellIndex = targeted.cellIndex;

  const sorted = [...rows].sort((a, b) => {
    const first = convertToNumber(a.cells[cellIndex].textContent);
    const second = convertToNumber(b.cells[cellIndex].textContent);

    if (clickCount === 1) {
      if (isNaN(first)) {
        return first.localeCompare(second);
      } else {
        return first - second;
      }
    } else if (clickCount === 2) {
      if (isNaN(second)) {
        return second.localeCompare(first);
      } else {
        return second - first;
      }
    }

    clickCount = 1;
  });

  tabBody.append(...sorted);
});

tabBody.addEventListener('click', ev => {
  const targeted = ev.target.closest('tr');

  for (const row of rows) {
    row.classList.remove('active');
  }

  targeted.classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name:
      <input
        name="name"
        type="text"
        data-qa="name"
      >
    </label>
    <label>Position:
      <input
        name="position"
        type="text"
        data-qa="position"
      >
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
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      >
    </label>
    <button>Save to table</buttom>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', ev => {
  ev.preventDefault();

  const data = new FormData(form);

  const arrData = [
    data.get('name'),
    data.get('position'),
    data.get('office'),
    data.get('age'),
    data.get('salary'),
  ];

  const tr = document.createElement('tr');

  if (data.get('name').length === 0
    || data.get('position').length === 0
    || data.get('office').length === 0
    || data.get('age') === 0
    || data.get('salary') === 0) {
    pushNotification('Error', 'No data filled', 'error');
  } else if (data.get('name') < 4) {
    pushNotification('Error', 'Invalid name', 'error');
  } else if (+data.get('age') < 18 || +data.get('age') > 90) {
    pushNotification('Error',
      'Invalid age. Min 18 and max 90',
      'error'
    );
  } else {
    for (let i = 0; i < arrData.length; i++) {
      const td = document.createElement('td');

      if (i !== arrData.length - 1) {
        td.textContent = arrData[i];
      }

      if (i === arrData.length - 1) {
        td.textContent = `$${parseInt(arrData[i]).toLocaleString('en-US')}`;
      }

      tr.append(td);

      pushNotification('Success', 'Successfully added', 'success');
    }
  }

  form.reset();

  tabBody.append(tr);
});

tabBody.addEventListener('dblclick', ev => {
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

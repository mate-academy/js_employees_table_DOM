'use strict';

const list = document.querySelector('tbody');
const header = document.querySelector('thead');
const body = document.querySelector('body');
let count = 0;
let targetCheck;

// ___Start___sort___

function toNumber(num) {
  return num.split('').splice(1).join('')
    .split(',').join('');
}

header.addEventListener('click', e => {
  count++;

  const column = e.target.closest('th').cellIndex;
  const listRows = [...list.rows];

  if (targetCheck !== column) {
    count = 1;
  }

  targetCheck = column;

  if (e.target.closest('th')) {
    count % 2 === 1
      ? listRows.sort((a, b) => {
        return (a.cells[column].innerText[0] === '$'
          ? toNumber(a.cells[column]
            .innerText) - toNumber(b.cells[column].innerText)
          : a.cells[column]
            .innerText.localeCompare(b.cells[column].innerText));
      })
      : listRows.sort((a, b) => {
        return (a.cells[column].innerText[0] === '$'
          ? toNumber(b.cells[column]
            .innerText) - toNumber(a.cells[column].innerText)
          : b.cells[column]
            .innerText.localeCompare(a.cells[column].innerText));
      });
  };

  list.append(...listRows);
});

// ___Finish_sort___

// ___Start___row___selection____

list.addEventListener('click', e => {
  [...list.children].forEach(row => {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  });

  e.target.parentElement.classList.add('active');
});

// ___Finish___Row___Selection___

// ___Start___Add___Form___

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>
    Name:
    <input
      name="name"
      data-qa="name"
      minlength="4"
      maxlength="15"
      type="text"
      required>
  </label>
  <label>
    Position: <input name="position" data-qa="position" type="text" required>
  </label>
  <label>
    Office:<select data-qa="office" name="office" size="1">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age: <input name="age" data-qa="age" type="number" required>
  </label>
  <label>
    Salary:
    <input name="salary" data-qa="salary" type="number" min="0" required>
  </label>
  <button type="submit">Save to table</button>
`;

body.append(form);

const forms = document.querySelector('form');
const btn = document.querySelector('button');

function formatSalary(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatTest(text) {
  return text.split(/\s+/)
    .map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
};

const pushNotification = (title, description, type) => {
  const checked = body.querySelector('.notification');

  if (checked) {
    checked.remove();
  };

  const message = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const textMessage = document.createElement('p');

  message.className = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');

  titleMessage.className = 'title';
  titleMessage.textContent = `${title}`;

  textMessage.textContent = `${description}`;

  message.append(titleMessage);
  message.append(textMessage);

  body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

btn.addEventListener('click', (add) => {
  add.preventDefault();

  const data = new FormData(forms);
  const formData = Object.fromEntries(data.entries());
  const { position, office, age, salary } = formData;

  for (let i = 0; i <= formData.name.length; i++) {
    if ('1234567890'.includes(formData.name[i])) {
      pushNotification('Name Error',
        'Enter only the letters', 'error');

      return;
    }
  }

  for (let i = 0; i <= position.length; i++) {
    if ('1234567890'.includes(position[i])) {
      pushNotification('Position Error',
        'Enter only the letters', 'error');

      return;
    }
  }

  if (formData.name.length < 4 || formData.name.length > 15) {
    pushNotification('Name Error',
      'Name length must be greater than 4', 'error');

    return;
  }

  if (position.length < 4 || position.length > 40) {
    pushNotification('Position Error',
      'Position length must be greater than 4', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('Age Error',
      'Please enter an age from 18 to 90', 'error');

    return;
  }

  if (!salary) {
    pushNotification('Salary Error',
      'Please enter an salary from 0', 'error');

    return;
  }

  list.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${formatTest(formData.name)}</td>
      <td>${formatTest(position)}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${formatSalary(salary)}</td>
    </td>
  `);

  pushNotification('Good Job!!!',
    'New employee added', 'success');

  forms.reset();
});

// ___Finish___Add___Form___

// ___Start___Redactor___Rows___

let inputCheck;
let oldText;

list.addEventListener('dblclick', e => {
  const paddingElement = window.getComputedStyle(e.target)
    .padding.slice(0, length - 2);
  const widthInput = e.target.clientWidth - (+paddingElement * 2);
  let selectOfficeEdit;

  let saveText = e.target.textContent;
  const input = document.createElement('input');

  input.value = saveText;

  input.classList.add('cell-input');
  e.target.textContent = '';

  switch (e.target.cellIndex) {
    case 3:
      input.type = 'number';
      break;
    case 4:
      const value = saveText.split('')
        .filter(elem => '1234567890'.includes(elem)).join('');

      input.value = value;
      input.type = 'number';
      break;
  }

  if (inputCheck !== e.target) {
    [...list.rows].forEach(row => {
      [...row.cells].map(child => {
        if (child.children.length > 0) {
          [...child.children][0].remove();
          inputCheck.textContent = oldText;
        }
      });
    });
  }

  inputCheck = e.target;
  oldText = saveText;

  if (e.target.cellIndex !== 2) {
    input.style.width = `${widthInput}px`;
    e.target.append(input);
    input.focus();
  } else {
    e.target.insertAdjacentHTML('beforeend', `
      <select data-qa="office" name="office" size="1">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    `);

    selectOfficeEdit = document.querySelector('td select');
    selectOfficeEdit.style.width = `${widthInput}px`;
    selectOfficeEdit.focus();
  }

  const inputLine = document.querySelector('td input');

  const collbacks = () => {
    switch (e.target.cellIndex) {
      case 0:
        if (inputLine.value.length < 4 || inputLine.value.length > 15) {
          pushNotification('Name Error',
            'Name length must be greater than 4', 'error');

          return;
        }

        for (let i = 0; i <= inputLine.value.length; i++) {
          if ('1234567890'.includes(inputLine.value[i])) {
            pushNotification('Name Error',
              'Enter only the letters', 'error');

            return;
          }
        }
        saveText = formatTest(inputLine.value);
        break;
      case 1:
        if (inputLine.value.length < 4 || inputLine.value.length > 40) {
          pushNotification('Position Error',
            'Position length must be greater than 4', 'error');

          return;
        }

        for (let i = 0; i <= inputLine.value.length; i++) {
          if ('1234567890'.includes(inputLine.value[i])) {
            pushNotification('Position Error',
              'Enter only the letters', 'error');

            return;
          }
        }
        saveText = formatTest(inputLine.value);
        break;
      case 2:
        saveText = selectOfficeEdit.value;
        break;
      case 3:
        if (inputLine.value < 18 || inputLine.value > 90) {
          pushNotification('Age Error',
            'Please enter an age from 18 to 90', 'error');

          return;
        }
        saveText = inputLine.value;
        break;
      case 4:
        if (inputLine.value < 0) {
          pushNotification('Salary Error',
            'Please enter an salary > 0', 'error');

          return;
        }

        saveText = `$${formatSalary(inputLine.value)}`;
        break;
    }

    e.target.textContent = saveText;
    input.remove();
  };

  e.target.addEventListener('keydown', elem => {
    if (elem.key === 'Enter') {
      if (e.target.cellIndex !== 2) {
        if (inputLine.value.length === 0) {
          e.target.textContent = saveText;
          input.remove();

          return;
        }
      }

      collbacks();
    }
  });

  body.addEventListener('click', elemClick => {
    if (e.target.cellIndex === 2) {
      if (!elemClick.target.closest('select')) {
        collbacks();
      }
    } else {
      if (!elemClick.target.closest('input')) {
        collbacks();
      }
    }
  });
});

'use strict';

const filterBlock = document.querySelector('thead');
const filters = filterBlock.querySelectorAll('th');
const tableBody = document.querySelector('tbody');

let lastFilterClicked;
let ascDone = false;

function formatNum(str) {
  return Number(str.replace(/\D/g, ''));
}

filterBlock.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const items = tableBody.querySelectorAll('tr');

  if (e.target !== lastFilterClicked) {
    ascDone = false;
  };

  const filterIndex = [...filters].indexOf(e.target);

  const sorted = [...items].sort((a, b) => {
    const sortFieldA = a.children[filterIndex].innerText;
    const sortFieldB = b.children[filterIndex].innerText;

    if (!isNaN(sortFieldA) || sortFieldA[0] === '$') {
      return !ascDone
        ? formatNum(sortFieldA) - formatNum(sortFieldB)
        : formatNum(sortFieldB) - formatNum(sortFieldA);
    }

    return !ascDone
      ? sortFieldA.localeCompare(sortFieldB)
      : sortFieldB.localeCompare(sortFieldA);
  });

  tableBody.append(...sorted);
  lastFilterClicked = e.target;
  ascDone = !ascDone;
});

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow || !tableBody.contains(clickedRow)) {
    return;
  }

  const items = tableBody.querySelectorAll('tr');

  [...items].forEach(row => row.classList.remove('active'));
  clickedRow.classList.add('active');
});

document.body.insertAdjacentHTML('beforeend', `
  <form action="#" class="new-employee-form">
    <label>
      Name: <input name="name" type="text" data-qa="name" required>
    </label>

    <label>
      Position: <input name="position" type="text" data-qa="position" required>
    </label>

    <label>
      Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>
      Age: <input name="age" type="number" data-qa="age" required>
    </label>

    <label>
      Salary: <input name="salary" type="number" data-qa="salary" required>
    </label>

    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const data = new FormData(e.currentTarget);
  const fields = Object.fromEntries(data.entries());

  let message = '';

  if (fields.name.length < 4) {
    message += '\n Name must not be less than 4 symbols';
  };

  if (parseInt(fields.age) < 18 || parseInt(fields.age) > 90) {
    message += '\n The age must be between 18 and 90';
  };

  if (message) {
    pushNotification('Error', message, 'error');

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${fields.name}</td>
      <td>${fields.position}</td>
      <td>${fields.office}</td>
      <td>${fields.age}</td>
      <td>
        $${Number(fields.salary).toLocaleString('en-US')}
      </td>
    </tr>
  `);

  pushNotification('Success', 'The data has successfully created', 'success');
});

function pushNotification(title, message, type) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.className = `notification ${type}`;

  notification.insertAdjacentHTML('afterbegin', `
    <h2 class="title">${title}</h2>
    <p>${message}</p>
  `);

  document.body.append(notification);

  setTimeout(() => {
    if (notification) {
      notification.remove();
    }
  }, 9000);
}

tableBody.addEventListener('dblclick', (e) => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const oldtext = e.target.innerText;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldtext;

  if (e.target === e.target.parentElement.children[3]) {
    input.setAttribute('type', 'number');
  };

  if (e.target === e.target.parentElement.children[4]) {
    input.setAttribute('type', 'number');
    input.value = Number(oldtext.replace(/\D/g, ''));
  };

  e.target.firstChild.replaceWith(input);
  input.focus();

  const handleCellInput = () => {
    if (input.value.trim() === '') {
      e.target.innerText = oldtext;
    } else {
      e.target.innerText = input.value;
    }

    if (e.target === e.target.parentElement.children[4]) {
      e.target.innerText = `$${Number(input.value)
        .toLocaleString('en-US')}`;
    }
  };

  input.addEventListener('blur', () => {
    handleCellInput();
  });

  input.addEventListener('keypress', (f) => {
    if (f.key === 'Enter') {
      handleCellInput();
    }
  });
});

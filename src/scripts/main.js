'use strict';

const container = document.querySelector('tbody');
let prevColNumber;
let sameColClickedCounter = 0;

function sortColumn(column, reverseSort) {
  const coefficient = reverseSort ? -1 : 1;
  const content = [...document.querySelectorAll('tbody > tr')];
  const firstSymbol = content[0].children[column].innerText[0];

  if (firstSymbol === '$') {
    content.sort((a, b) => {
      const A = a.children[column].innerText;
      const B = b.children[column].innerText;

      return coefficient * toNumber(A) - coefficient * toNumber(B);
    });
  } else {
    content.sort((a, b) => {
      const A = a.children[column].innerText;
      const B = b.children[column].innerText;

      return coefficient * A.localeCompare(B);
    });
  }

  container.append(...content);
}

function toNumber(str) {
  return Number(str.replace('$', '').split(',').join(''));
}

const thead = document.querySelector('thead');

thead.addEventListener('click', e => {
  const currentColNumber = [...document.querySelectorAll('thead > tr > th')]
    .indexOf(e.target);

  let reverseSort = false;

  if (prevColNumber === currentColNumber) {
    sameColClickedCounter++;

    if (sameColClickedCounter % 2 === 0) {
      reverseSort = true;
    }
  } else {
    sameColClickedCounter = 1;
  }

  prevColNumber = currentColNumber;
  sortColumn(currentColNumber, reverseSort);
});

container.addEventListener('click', e => {
  const item = e.target.closest('tr');
  const selectedRow = document.querySelector('.active');

  item.classList.toggle('active');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }
});

container.addEventListener('dblclick', e => {
  const dataCell = e.target.closest('td');
  const dataCellText = dataCell.textContent;

  dataCell.textContent = '';

  dataCell.insertAdjacentHTML('afterbegin', `
  <input class="cell-input">
  `);

  const input = document.querySelector('.cell-input');

  input.value = dataCellText;
  input.focus();

  input.addEventListener('blur', (eBlur) => {
    if (eBlur.target.value !== '') {
      dataCell.textContent = eBlur.target.value;
    } else {
      dataCell.textContent = dataCellText;
    }
    input.remove();
  });

  input.addEventListener('keydown', (eDown) => {
    if (eDown.key !== 'Enter') {
      return;
    }

    if (eDown.target.value !== '') {
      dataCell.textContent = eDown.target.value;
    } else {
      dataCell.textContent = dataCellText;
    }
    input.remove();
  });
});

document.body.insertAdjacentHTML('beforeend', `
  <form action="/" method="GET" class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name" required>
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
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');
const button = form.querySelector('button');

form.addEventListener('submit', e => {
  e.preventDefault();
  disableButtonAfterClick();

  const data = new FormData(form);

  if (data.get('name').length < 4
    || +data.get('age') < 18
    || +data.get('age') > 90
    || data.get('position') === '') {
    return pushNotification(
      'Error saving data',
      'All fields must be filled. \n'
      + 'Name should consist of more than 4 characters. \n'
      + 'Age can not be less than 18 or greater than 90.',
      'error');
  }

  container.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>$${(+data.get('salary')).toLocaleString('en')}</td>
    </tr>
  `);

  return pushNotification(
    'Congratulations',
    'A new employee has been added!',
    'success');
});

function disableButtonAfterClick() {
  button.disabled = true;

  setTimeout(() => {
    button.disabled = false;
  }, 2000);
}

const pushNotification = (title, description, type) => {
  const list = document.body;

  list.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const element = document.querySelector(`.${type}`);

  element.style.top = `${form.getBoundingClientRect().top
    + form.offsetHeight + 10 + window.pageYOffset}px`;
  element.style.left = `${form.getBoundingClientRect().left}px`;

  setTimeout(() => {
    element.remove();
  }, 2000);
};

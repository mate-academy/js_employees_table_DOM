'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');
const form = document.createElement('form');

let count = 1;

const selected = (e) => {
  const target = e.target;
  const selectTr = e.target.parentNode;

  if (target.closest('tr')) {
    selectTr.classList.add('active');
  }
};

form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `<form action="#" method="GET">
<label for="name">
  Name:
  <input name="name" data-qa="name" type="text" required>
</label>
<label for="position">
  Position:
  <input name="position" data-qa="position" type="text" required>
</label>
<label for="office">
  Office:
  <select name="office" data-qa="office" id="office" required>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label for="age">
  Age:
  <input name="age" data-qa="age" type="number" required>
</label>
<label for="salary">
  Salary:
  <input name="salary" data-qa="salary" type="number" required>
</label>
<button type="submit">Save to table</button>
</form>`);

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const titleNotification = document.createElement('h2');
  const descriptionNotification = document.createElement('p');

  notification.classList.add('notification', `${type}`);
  notification.dataset.qa = 'notification';
  titleNotification.classList.add('title');
  descriptionNotification.classList.add('description');

  titleNotification.innerText = title;
  descriptionNotification.innerText = description;

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  notification.append(titleNotification, descriptionNotification);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

document.body.append(form);
tbody.addEventListener('click', selected);

const submit = document.querySelector('button');
const input = document.querySelectorAll('input');
const select = document.querySelector('select');

const addToForm = (e) => {
  e.preventDefault();

  const formName = input[0].value;
  const formPosition = input[1].value;
  const formOffice = select.value;
  const formAge = input[2].value;
  const formSalary = +input[3].value;

  if (formName.length < 4) {
    pushNotification(150, -0, 'error',
      'value is less than 4 letters', 'error');
  }

  if (!formPosition) {
    pushNotification(-0, -0, 'error',
      'Position is required', 'error');
  }

  if (!formSalary) {
    pushNotification(450, -0, 'error',
      'Salary is required', 'error');
  }

  if (formAge < 18 || formAge > 90) {
    pushNotification(300, -0, 'error',
      'value is less than 18 or more than 90', 'error');
  }

  if (formName.length >= 4
    && formPosition
    && formSalary
    && (formAge >= 18
      && formAge <= 90
    )
  ) {
    tbody.insertAdjacentHTML('beforeend', `<tr>
      <td>${formName}</td>
      <td>${formPosition}</td>
      <td>${formOffice}</td>
      <td>${formAge}</td>
      <td>$${formSalary.toLocaleString('en')}</td>
    </tr>`);

    pushNotification(0, -0, 'success',
      'congrats', 'success');
  }
};

function convertToNumber(string) {
  return string.split('').filter(letter => (letter * 1) === +letter).join('');
}

const sorted = (e) => {
  const th = e.target.closest('th');
  const thIndex = th.cellIndex;
  const newRows = [...rows];

  count++;

  if (!th || !thead.contains(th)) {
    return;
  }

  if (thIndex === 0 || thIndex === 1) {
    if (count % 2 === 0) {
      newRows.sort((currentString, nextString) => {
        const currentStringText = currentString.cells[thIndex].innerText;
        const nextStringText = nextString.cells[thIndex].innerText;

        return currentStringText.localeCompare(nextStringText);
      });
    }

    if (count % 2 !== 0) {
      newRows.sort((currentString, nextString) => {
        const currentStringText = currentString.cells[thIndex].innerText;
        const nextStringText = nextString.cells[thIndex].innerText;

        return nextStringText.localeCompare(currentStringText);
      });
    }
  };

  newRows.sort((currentItem, nextItem) => {
    const currentItemNumber
      = convertToNumber(currentItem.cells[thIndex].innerText);
    const nextItemNumber
      = convertToNumber(nextItem.cells[thIndex].innerText);

    if (count % 2 === 0) {
      return currentItemNumber - nextItemNumber;
    }

    if (count % 2 !== 0) {
      return nextItemNumber - currentItemNumber;
    }
  });

  rows.forEach(row => tbody.removeChild(row));
  newRows.forEach(rowed => tbody.appendChild(rowed));

  count > 2 ? count = 1 : count = 2;
};

submit.addEventListener('click', addToForm);
thead.addEventListener('click', sorted);

'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

const selecteHandler = (e) => {
  if (!e.target) {
    return;
  }

  [...tbody.children].forEach(employee => {
    employee.classList.remove('active');
  });

  const selectTr = e.target.parentNode;

  selectTr.classList.add('active');
};

tbody.addEventListener('click', selecteHandler);

employeeForm.insertAdjacentHTML('afterbegin', `
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
`);

document.body.append(employeeForm);

const pushNotification = (
  positionTop,
  positionRight,
  title,
  description,
  type
) => {
  const notification = document.createElement('div');
  const titleNotification = document.createElement('h2');
  const descriptionNotification = document.createElement('p');

  notification.classList.add('notification', `${type}`);
  notification.dataset.qa = 'notification';
  titleNotification.classList.add('title');
  descriptionNotification.classList.add('description');

  titleNotification.innerText = title;
  descriptionNotification.innerText = description;

  notification.style.top = positionTop + 'px';
  notification.style.right = positionRight + 'px';

  notification.append(titleNotification, descriptionNotification);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

const submit = employeeForm.querySelector('button');
const input = employeeForm.querySelectorAll('input');
const select = employeeForm.querySelector('select');

const addToForm = (e) => {
  e.preventDefault();

  const inputName = input[0].value;
  const inputPosition = input[1].value;
  const selectOffice = select.value;
  const inputAge = input[2].value;
  const inputSalary = +input[3].value;

  const minLengthOfInput = 4;
  const minAgeForInput = 18;
  const maxAgeForInput = 90;

  if (inputName.length < 4) {
    pushNotification(
      150,
      -0,
      'error',
      'value is less than 4 letters',
      'error'
    );
  }

  if (!inputPosition) {
    pushNotification(
      -0,
      -0,
      'error',
      'Position is required',
      'error'
    );
  }

  if (!inputSalary) {
    pushNotification(
      450,
      -0,
      'error',
      'Salary is required',
      'error'
    );
  }

  if (inputAge < minAgeForInput || inputAge > maxAgeForInput) {
    pushNotification(
      300,
      -0,
      'error',
      'value is less than 18 or more than 90',
      'error'
    );
  }

  if (
    inputName.length >= minLengthOfInput
    && inputPosition
    && inputSalary
    && (
      inputAge >= minAgeForInput
      && inputAge <= maxAgeForInput
    )
  ) {
    tbody.insertAdjacentHTML('beforeend', `<tr>
      <td>${inputName}</td>
      <td>${inputPosition}</td>
      <td>${selectOffice}</td>
      <td>${inputAge}</td>
      <td>$${inputSalary.toLocaleString('en')}</td>
    </tr>`);

    pushNotification(
      0,
      -0,
      'success',
      'congrats',
      'success'
    );
  }
};

function convertToNumber(string) {
  return string.replace(/[^0-9]/g, '');
}

let count = 1;

const sorted = (e) => {
  const th = e.target.closest('th');
  const thIndex = th.cellIndex;
  const rowsList = [...tbody.children];

  count++;

  if (!th || !thead.contains(th)) {
    return;
  }

  if (thIndex === 0 || thIndex === 1) {
    if (count % 2 === 0) {
      rowsList.sort((currentString, nextString) => {
        const currentStringText = currentString.cells[thIndex].innerText;
        const nextStringText = nextString.cells[thIndex].innerText;

        return currentStringText.localeCompare(nextStringText);
      });
    }

    if (count % 2 !== 0) {
      rowsList.sort((currentString, nextString) => {
        const currentStringText = currentString.cells[thIndex].innerText;
        const nextStringText = nextString.cells[thIndex].innerText;

        return nextStringText.localeCompare(currentStringText);
      });
    }
  }

  rowsList.sort((currentItem, nextItem) => {
    const currentItemNumber = convertToNumber(
      currentItem.cells[thIndex].innerText
    );
    const nextItemNumber = convertToNumber(
      nextItem.cells[thIndex].innerText
    );

    if (count % 2 === 0) {
      return currentItemNumber - nextItemNumber;
    }

    if (count % 2 !== 0) {
      return nextItemNumber - currentItemNumber;
    }
  });

  rows.forEach(row => tbody.removeChild(row));
  rowsList.forEach(row => tbody.appendChild(row));

  count > 2 ? count = 1 : count = 2;
};

submit.addEventListener('click', addToForm);
thead.addEventListener('click', sorted);

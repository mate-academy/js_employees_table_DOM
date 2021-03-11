'use strict';

// write code here
const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = [...tbody.rows];

body.insertAdjacentHTML('beforeend', `
  <form
    class='new-employee-form'
    name='new-employee'
    method='POST'
    >
    <label>Name:
      <input name="name" type="text" data-qa="name" required>
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>
    <label>Office:
      <select name="office" type="text" data-qa="office" required>
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

let numberClicks = 0;
let indexOfPressedCell = 0;

const convertToNumber = (string) => {
  return Number(string.replace(/[$,]/g, ''));
};

thead.addEventListener('click', (clickEvent) => {
  const index = clickEvent.target.cellIndex;
  const title = clickEvent.target.closest('th');
  let sortedColums;

  if (indexOfPressedCell !== index) {
    numberClicks = 0;
  }

  indexOfPressedCell = index;
  numberClicks++;

  switch (title.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      sortedColums = rows.sort(
        (currentRow, nextRow) => {
          const currentValue = currentRow.cells[index].innerText;
          const nextValue = nextRow.cells[index].innerText;

          return currentValue.localeCompare(nextValue);
        });
      break;

    case 'Age':
    case 'Salary':
      sortedColums = rows.sort((currentRow, nextRow) => {
        const currentValue = currentRow.cells[index].innerText;
        const nextValue = nextRow.cells[index].innerText;

        return convertToNumber(currentValue) - convertToNumber(nextValue);
      });
  }

  if (numberClicks % 2 !== 0) {
    tbody.append(...sortedColums);
  } else {
    tbody.append(...sortedColums.reverse());
  }
});

tbody.addEventListener('click', (clickEvent) => {
  const selectedRow = clickEvent.target.closest('tr');

  rows.forEach(row => row.classList.remove('active'));
  selectedRow.classList.add('active');
});

const form = document.querySelector('form');

form.addEventListener('submit', (clickEvent) => {
  clickEvent.preventDefault();

  const data = new FormData(form);
  const employeeName = data.get('name');
  const age = data.get('age');
  const position = data.get('position');
  const salary = '$' + (Number(data.get('salary')).toLocaleString('en'));
  const minAge = 18;
  const maxAge = 90;
  const minNameLength = 4;

  if (employeeName >= 4 && age >= 18 && age <= 90 && position !== '') {
    tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${data.get('office')}</td>
    <td>${age}</td>
    <td>${salary}</td>
  </tr>
`);

    form.elements.name.value = '';
    form.elements.age.value = '';
    form.elements.position.value = '';
    form.elements.salary.value = '';

    createNotification(
      'success',
      'Success',
      'New employee was successfully added'
    );
  }

  if (employeeName.length < minNameLength) {
    createNotification(
      350,
      10,
      'error',
      'Error',
      'Name should consist of 5 or more letters'
    );
  };

  if (!position) {
    createNotification(
      170,
      10,
      'error',
      'Error',
      'Please indicate the correct position',
    );
  }

  if (age < minAge || age > maxAge) {
    createNotification(
      0,
      10,
      'error',
      'Error',
      'Age should not be less than 18 or more than 90'
    );
  }
});

function createNotification(
  positionTop,
  positionRight,
  type,
  title,
  description) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  notification.style.top = positionTop + 'px';
  notification.style.right = positionRight + 'px';

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.innerText = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.innerText = description;
  notification.append(h2, notificationDescription);

  body.prepend(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

let selectedField = null;

tbody.addEventListener('dblclick', (clickEvent) => {
  clickEvent.preventDefault();

  if (selectedField) {
    return;
  }

  selectedField = clickEvent.target;

  const text = selectedField.innerText;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = text;

  input.addEventListener('change', () => {
    selectedField.innerText = input.value !== '' ? input.value : text;
  });

  input.addEventListener('blur', (eventBlur) => {
    eventBlur.target.replaceWith(selectedField);
    selectedField = null;
  });

  input.addEventListener('keydown', (eventKeydown) => {
    if (eventKeydown.code === 'Enter') {
      eventKeydown.target.replaceWith(selectedField);
      selectedField = null;
    }
  });

  selectedField.replaceWith(input);
});

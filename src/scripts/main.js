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

let checkStarusSorting;

thead.addEventListener('click', (e) => {
  const cellIndex = e.target.cellIndex;

  checkStarusSorting = checkStarusSorting === undefined
    ? cellIndex
    : undefined;

  const sortRows = [...tbody.rows].sort(
    (currentElement, nextElement) => {
      const currentValue = currentElement.cells[cellIndex].innerText;
      const nextValue = nextElement.cells[cellIndex].innerText;

      if (checkStarusSorting !== undefined) {
        return currentValue.replace(/[^0-9]/g, '')
          ? currentValue.replace(/[^0-9]/g, '')
            - nextValue.replace(/[^0-9]/g, '')
          : currentValue.localeCompare(nextValue);
      } else {
        return currentValue.replace(/[^0-9]/g, '')
          ? nextValue.replace(/[^0-9]/g, '')
            - currentValue.replace(/[^0-9]/g, '')
          : nextValue.localeCompare(currentValue);
      }
    });

  tbody.append(...sortRows);
}
);

tbody.addEventListener('click', (e) => {
  const selected = e.target.closest('tr');

  rows.forEach(row => row.classList.remove('active'));
  selected.classList.add('active');
});

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const employeeName = data.get('name');
  const age = data.get('age');
  const position = data.get('position');
  const salary = '$' + (Number(data.get('salary')).toLocaleString('en'));
  const minAge = 18;
  const maxAge = 90;
  const minNameLength = 4;

  if (employeeName.length < minNameLength) {
    return createNotification(
      'error',
      'Error',
      'Name should consist of 5 or more letters'
    );
  }

  if (!position) {
    return createNotification(
      'error',
      'Error',
      'Please indicate the correct position',
    );
  }

  if (age < minAge || age > maxAge) {
    return createNotification(
      'error',
      'Error',
      'Age should not be less than 18 or more than 90'
    );
  }

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

  return createNotification(
    'success',
    'Success',
    'New employee was successfully added'
  );
});

function createNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

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

tbody.addEventListener('dblclick', (e) => {
  e.preventDefault();

  if (selectedField) {
    return;
  }

  selectedField = e.target;

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

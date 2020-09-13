'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');
let element;

function makeNumber(num) {
  return (+num) ? +num : +num.slice(1).split(',').join('');
};

thead.addEventListener('click', (event) => {
  const index = event.target.cellIndex;
  const list = [...tbody.rows];

  if (element === event.target) {
    list.reverse();
  } else {
    element = event.target;

    list.sort((x, y) => {
      if (!makeNumber(x.cells[index].innerText)) {
        return x.cells[index].innerText.localeCompare(y.cells[index].innerText);
      }

      return makeNumber(x.cells[index].innerText)
      - makeNumber(y.cells[index].innerText);
    });
  }
  tbody.append(...list);
});

tbody.addEventListener('click', (event) => {
  [...tbody.rows].map(elem => elem.classList.remove('active'));
  event.target.parentNode.classList.add('active');
});

function createForm() {
  form.classList.add('new-employee-form');
  document.body.append(form);

  form.insertAdjacentHTML('afterbegin', `
    <label>Name:
      <input
        name="name"
        type="text"
        required
      >
    </label>
    <label>Position:
      <input
        name="position"
        type="text"
        required
      >
    </label>
    <label>Office:
      <select name="office" required>
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
        required
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        required
      >
    </label>
    <button type="submit">Save to table</button>
  `);
}
createForm();

function pushNotification(title, description, type) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add('notification', type);
  h2.classList.add('title');
  h2.innerText = title;
  p.innerText = description;
  div.append(h2, p);
  document.body.append(div);

  setTimeout(() => div.remove(), 3000);
};

function validateForm() {
  switch (true) {
    case (form.age.value < 18):
      pushNotification('Error!', `Age can't be less then 18`, 'error');

      return false;
    case (form.age.value > 90):
      pushNotification('Error!', `Age can't be greater then 90`, 'error');

      return false;
    case (form.name.value.length < 4):
      pushNotification('Error!', `Name can't be less than 4 letters`, 'error');

      return false;
    case (+form.salary.value === 0):
      pushNotification('Error!', 'Incorrect salary value', 'error');

      return false;
    default:
      pushNotification('Success!', 'A new employee was added', 'success');

      return true;
  };
}

function addNewEmployee() {
  const employee = document.createElement('tr');

  employee.insertAdjacentHTML('afterbegin', `
    <td>${form.name.value}</td>
    <td>${form.position.value}</td>
    <td>${form.office.value}</td>
    <td>${form.age.value}</td>
    <td>$${(+form.salary.value).toLocaleString('en')}</td>
  `);
  tbody.append(employee);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const newForm = event.target;

  if (!validateForm(newForm)) {
    return;
  }

  addNewEmployee(newForm);
  newForm.reset();
});

function saveValue(td, input, defaultValue) {
  if (!input.value) {
    td.textContent = defaultValue;

    return;
  }
  td.textContent = input.value;
}

tbody.addEventListener('dblclick', (event) => {
  const td = event.target;
  const defaultValue = td.textContent;
  const input = document.createElement('input');

  input.classList = 'cell-input';
  input.value = defaultValue;
  input.style.width = window.getComputedStyle(event.target).width;
  td.textContent = '';
  td.append(input);
  input.focus();

  input.addEventListener('blur', () =>
    saveValue(td, input, defaultValue));

  input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      saveValue(td, input, defaultValue);
    }
  });
});

'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
<form class="new-employee-form">
  <label>Name:<input name="name" type="text" data-qa="name"></label>
  <label>Position:<input name="position" type="text" data-qa="position"></label>
  <label>Office:<select name="office" data-qa="office">
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
  </select>
  </label>
  <label>Age:<input name="age" type="number" data-qa="age"></label>
  <label>Salary:<input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
</form>
`;

body.append(form);

function errorNotification(posTop, posLeft, title, description, type) {
  const container = document.createElement('div');

  const newTitle = document.createElement('h2');

  const newDescription = document.createElement('p');

  newTitle.textContent = title;
  newTitle.classList.add('title');
  container.appendChild(newTitle);

  newDescription.textContent = description;
  container.appendChild(newDescription);

  container.classList.add('notification', type);

  container.style.top = `${posTop}px`;
  container.style.left = `${posLeft}px`;

  body.appendChild(container);

  setTimeout(() => {
    container.hidden = true;
  }, 2000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newRow = document.createElement('tr');

  const formName = form.children[0].children[0].value;
  const formPosition = form.children[1].children[0].value;
  const formSelect = form.children[2].children[0].value;
  const formAge = form.children[3].children[0].value;
  const formSalary = form.children[4].children[0].value;

  const valueSalary = Number(formSalary).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${formName}</td>
    <td>${formPosition}</td>
    <td>${formSelect}</td>
    <td>${formAge}</td>
    <td>${'$' + valueSalary}</td>
  `;

  if (!formName.trim() || !formPosition || !formAge) {
    errorNotification(10, 1000, 'Error!',
    'All inputs must be filled!', 'error');

    return false;
  }

  if (formName.length < 4) {
    errorNotification(10, 1000,
      'Error!', 'Value has less than 4 letters!', 'warning',
    );

    return false;
  }

  if (formPosition.length === 0) {
    errorNotification(10, 1000, 'Error!',
      `Position field cannot be empty!`, 'error');

    return false;
  }

  if (formAge < 18 || formAge > 90) {
    errorNotification(10, 1000, 'Error!',
      'Value is less than 18 or more than 90!',
      'warning');

    return false;
  }

  tbody.prepend(newRow);
  form.reset();
});

tbody.addEventListener('dblclick', e => {
  const target = e.target;

  if (target.tagName === 'TD') {
    const parentRow = target.parentElement;

    const originalText = target.innerText;
    const newInput = document.createElement('input');

    const addInput = () => {
      newInput.value.trim() === ''
        ? target.innerText = originalText
        : target.innerText = newInput.value;

      if (newInput.classList.contains('salary')) {
        target.innerText
          = '$' + newInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    };

    target.innerHTML = '';

    newInput.classList.add('cell-input');

    newInput.value = originalText;

    if (target === parentRow.children[3]) {
      newInput.setAttribute('type', 'number');
    }

    if (target === parentRow.children[4]) {
      newInput.value = Number(originalText.replace(/\D/g, ''));

      newInput.setAttribute('type', 'number');
      newInput.classList.add('salary');
    }

    target.append(newInput);

    newInput.focus();

    newInput.addEventListener('blur', () => {
      addInput();
    });

    newInput.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        addInput();
      }
    });
  }
});
